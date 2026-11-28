# Build a Browser Extension for Comments on GitHub Markdown, Stored in Discussions

## What you will build, and why

Documentation is moving into GitHub as markdown. It is versioned and easy to review, but hard to discuss: to ask a question about one sentence, GitHub expects a pull request. That is too heavy for people who just want to leave a note.

In this guide you build a small **browser extension** that lets anyone select text on a GitHub markdown page, write a comment, and see it pinned to that text, like comments in a word processor. There is **no server and no database**. Every comment is stored as a **GitHub Discussion** comment, so GitHub keeps the history, the notifications and the permissions.

*[Diagram] Figure 1. Comments flow from the page, through the extension, into GitHub Discussions and back to every reader.*

> **The key idea.** GitHub Discussions already gives markdown, threading, reactions, notifications and moderation. The extension only adds the two missing parts: *anchoring* a comment to a piece of text, and *signing in* as the real user.

### What GitHub stores for each thing the user does

| What the user does | What GitHub stores |
|---|---|
| Comments on a file | One Discussion for that file |
| Comments on a selection | A comment in that Discussion, with a hidden anchor in its body |
| Replies | A nested reply |
| Resolves a thread | The comment is minimized with the `RESOLVED` reason |
| Assigns someone | An `@mention` in the body, so GitHub notifies them |

**Why one Discussion per file, not per comment?**

Creating a Discussion for every comment gives each thread its own close state, but it floods the Discussions tab as soon as comments spread across many files. One Discussion per file keeps the noise proportional to the number of files. The trade-off is that "resolve" becomes "minimize the comment" instead of "close the Discussion".

## Before you start

| You need | Notes |
|---|---|
| A GitHub host you can use | github.com or a GitHub Enterprise Server. Examples below use `github.example.com`. Replace it with your host. |
| A repository with Discussions enabled | Settings, General, Features, tick Discussions. Create at least one category. |
| Permission to register a GitHub App | On your own account is enough for a test. An organization owner does it for a real rollout. |
| Chrome (or another Chromium browser) | Manifest V3 extensions load unpacked from a folder. |
| A text editor | The extension is plain JavaScript. No bundler and no packages. |

> The two GitHub flavors use different API paths. On GitHub Enterprise Server the GraphQL endpoint is `https://HOST/api/graphql` and the REST root is `https://HOST/api/v3`. On github.com the GraphQL endpoint is `https://api.github.com/graphql`. Adjust the base URL in step 5 if you use github.com.

## Register a GitHub App for sign-in

Comments must be posted as the real person. Asking everyone to paste a personal access token is unfriendly and risky. A **GitHub App** with the OAuth **device flow** lets each user sign in once with a short code, and needs no client secret and no server.

Go to your account or organization settings, Developer settings, GitHub Apps, New GitHub App, and set:

| Field | Value |
|---|---|
| Name and homepage | Anything unique, for example `Margin Notes (test)` |
| Callback URL | Any placeholder. The device flow does not use it. |
| Enable Device Flow | Tick this. It is what makes a server-less sign-in possible. |
| Webhook, Active | Untick. Not needed. |
| Where can it be installed | Only on this account, for a test |

| Repository permission | Access | Why |
|---|---|---|
| Discussions | Read and write | Read and post comments |
| Metadata | Read-only | Mandatory, added automatically |

Create the App, then install it on the test repository ("Only select repositories"). Copy the App's **Client ID**. You will paste it into the extension in step 4.

> User tokens from a GitHub App expire after about 8 hours unless "Expire user authorization tokens" is switched off on the App. Either leave it on and handle the "sign in again" case, or switch it off for a simple test.

## Create the extension skeleton

Make a folder with these files. Everything runs as a content script injected into GitHub pages.

```
margin-notes/
  manifest.json
  api.js        # token storage, device-flow sign-in, GraphQL helper
  anchor.js     # capture a selection, find it again, highlight it
  panel.js      # the comment panel and its buttons
  panel.css
```

```
{
  "manifest_version": 3,
  "name": "Margin Notes",
  "version": "0.1",
  "description": "Anchored comments on GitHub markdown, stored as Discussions.",
  "permissions": ["storage"],
  "host_permissions": ["https://github.example.com/*"],
  "content_scripts": [{
    "matches": ["https://github.example.com/*"],
    "js": ["api.js", "anchor.js", "panel.js"],
    "css": ["panel.css"],
    "run_at": "document_idle"
  }]
}
```

Scripts listed together share one global scope, so each file can use what the previous one defined. Limit the `matches` to the one host you need, so the extension never runs on other sites.

> GitHub is a single-page app: moving between pages does not reload the document. In `panel.js` listen for navigation (for example the `turbo:render` event on GitHub) and rebuild or remove your panel each time, otherwise comments from the previous page stay on screen.

## Sign in with the device flow

The device flow has two calls: ask GitHub for a code, then poll until the user has entered it on GitHub's sign-in page.

```
const HOST = "github.example.com";
const CLIENT_ID = "YOUR_APP_CLIENT_ID";

async function startDeviceFlow() {
  const r = await fetch(`https://${HOST}/login/device/code`, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID }),
  });
  return r.json(); // { device_code, user_code, verification_uri, interval }
}

async function pollForToken(deviceCode, intervalSec) {
  const wait = Math.min(30, Math.max(5, Number(intervalSec) || 5)); // never trust 0
  for (;;) {
    await new Promise((res) => setTimeout(res, wait * 1000));
    const r = await fetch(`https://${HOST}/login/oauth/access_token`, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      }),
    });
    const j = await r.json();
    if (j.access_token) {
      await chrome.storage.local.set({ token: j.access_token });
      return j.access_token;
    }
    if (j.error !== "authorization_pending" && j.error !== "slow_down") throw new Error(j.error);
  }
}
```

1. Call `startDeviceFlow()` and show the user `user_code` with a link to the sign-in page.
2. Call `pollForToken()`. When the user approves, the token is saved.
3. Add a small "Sign in" button to your panel that runs these two steps.

> Store the token in `chrome.storage.local`, **not** `storage.sync`. Sync copies data through the browser vendor's servers, which you do not want for a credential. Always send the user to the sign-in address you already know, never to a URL taken from the response.

## Add a GraphQL helper

All comment operations go through one function. Because the content script runs on the GitHub host itself, the request is same-origin and needs no CORS setup.

```
async function gql(query, variables) {
  const { token } = await chrome.storage.local.get("token");
  if (!token) throw new Error("Not signed in");
  const r = await fetch(`https://${HOST}/api/graphql`, {   // github.com: https://api.github.com/graphql
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors.map((e) => e.message).join("; "));
  return j.data;
}
```

Passing values through `variables` (never string-concatenating them into the query) avoids injection problems with file paths and comment text.

## Find or create the Discussion for the current file

Give each file's Discussion a hidden marker in its body, for example ``. To find it, list the repository's Discussions and pick the one whose body contains the marker. If none exists, create it on the first comment.

```
const Q_REPO = `query($owner:String!,$name:String!){
  repository(owner:$owner,name:$name){
    id hasDiscussionsEnabled
    discussionCategories(first:20){ nodes{ id name } }
    discussions(first:100){ nodes{ id body } pageInfo{ hasNextPage endCursor } }
  }
}`;

const M_CREATE = `mutation($repo:ID!,$cat:ID!,$title:String!,$body:String!){
  createDiscussion(input:{repositoryId:$repo,categoryId:$cat,title:$title,body:$body}){
    discussion{ id }
  }
}`;

const markerFor = (docPath) => `<!-- margin-notes:doc=${docPath} -->`;

async function getOrCreateDiscussion(owner, name, docPath) {
  const { repository: r } = await gql(Q_REPO, { owner, name });
  if (!r.hasDiscussionsEnabled) throw new Error("Enable Discussions on this repository");
  const found = r.discussions.nodes.find((d) => d.body.includes(markerFor(docPath)));
  if (found) return found.id;
  const cat = r.discussionCategories.nodes[0];            // pick the category you prefer
  const d = await gql(M_CREATE, {
    repo: r.id, cat: cat.id,
    title: `Comments: ${docPath}`,
    body: `Comments for ${docPath}\n\n${markerFor(docPath)}`,
  });
  return d.createDiscussion.discussion.id;
}
```

This first version reads only the first 100 Discussions. If a repository may have more, follow `pageInfo.endCursor` and request the next page until you find the marker.

To get `owner`, `name` and `docPath` from the address bar, match a markdown file URL of the form `/OWNER/REPO/blob/BRANCH/PATH.md`. Only run on `.md` files, because anchoring to prose makes no sense on code or data files.

## Anchor a comment to the selected text

A Discussion has no concept of "this sentence", so each comment carries its own anchor as a hidden HTML comment holding a small JSON object. The anchor stores the selected text plus a little text before and after it, so the right spot can be found again even if the same words appear twice.

```
Can we support the device-code flow for browser-less devices?

<!-- margin-notes:v1 {"quote":"authorization-code flow with PKCE","prefix":"provider using an OAuth 2.0 ","suffix":". On successful login"} -->
```

Capture the selection, taking up to 24 characters of context on each side:

```
function captureSelection(article) {
  const sel = window.getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  if (!article.contains(range.commonAncestorContainer)) return null;

  const before = document.createRange();
  before.setStart(article, 0);
  before.setEnd(range.startContainer, range.startOffset);
  const after = document.createRange();
  after.setStart(range.endContainer, range.endOffset);
  after.setEnd(article, article.childNodes.length);

  return {
    quote:  range.toString().slice(0, 60),     // keep the text exactly as the page has it
    prefix: before.toString().slice(-24),
    suffix: after.toString().slice(0, 24),
  };
}

// JSON keeps quotes and line breaks safe. Escape < and > so the text can never close the HTML comment.
const buildBody = (text, a) => {
  const json = JSON.stringify(a).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  return `${text}\n\n<!-- margin-notes:v1 ${json} -->`;
};
```

Post it as a comment on the file's Discussion:

```
const M_COMMENT = `mutation($d:ID!,$body:String!,$reply:ID){
  addDiscussionComment(input:{discussionId:$d,body:$body,replyToId:$reply}){
    comment{ id }
  }
}`;

const postComment = (discussionId, body, replyTo = null) =>
  gql(M_COMMENT, { d: discussionId, body, reply: replyTo });
```

To **assign** someone, add a line such as `Assigned to @username` to the body. GitHub turns it into a notification.

## Read the comments and parse the anchors

```
const Q_THREADS = `query($id:ID!){
  node(id:$id){ ... on Discussion {
    comments(first:100){ nodes{
      id body isMinimized author{ login }
      replies(first:50){ nodes{ id body author{ login } } }
    } }
  } }
}`;

function parseAnchor(body) {
  const m = body.match(/<!-- margin-notes:v1 (\{.*?\}) -->/s);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

const visibleText = (body) => body.replace(/<!--[\s\S]*?-->/g, "").trim();

async function loadThreads(discussionId) {
  const d = await gql(Q_THREADS, { id: discussionId });
  return d.node.comments.nodes
    .map((c) => ({ ...c, anchor: parseAnchor(c.body), text: visibleText(c.body) }))
    .filter((c) => c.anchor);   // ignore comments that were typed directly in GitHub
}
```

Strip the hidden anchor with `visibleText` before showing a comment in your panel, otherwise users see the raw markers.

## Highlight the text again on every page load

The page is re-rendered each time, so the highlight is recomputed from the stored anchor. Work on the page's *text nodes*, find the quote, and wrap it in `` elements.

```
function findQuote(article, a) {
  const nodes = [];
  const w = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode()); ) nodes.push(n);
  const full = nodes.map((n) => n.nodeValue).join("");

  const hits = [];
  for (let i = full.indexOf(a.quote); i !== -1; i = full.indexOf(a.quote, i + 1)) hits.push(i);
  if (!hits.length) return null;                         // text was edited away: show as "anchor lost"

  // Several matches: keep the one whose surrounding text matches the stored context best.
  const score = (i) =>
    (full.slice(Math.max(0, i - a.prefix.length), i).endsWith(a.prefix) ? 1 : 0) +
    (full.startsWith(a.suffix, i + a.quote.length) ? 1 : 0);
  const start = hits.reduce((best, i) => (score(i) > score(best) ? i : best), hits[0]);
  return { nodes, start, end: start + a.quote.length };
}

function highlight({ nodes, start, end }) {
  const segs = []; let pos = 0;
  for (const n of nodes) {
    const len = n.nodeValue.length;
    const a = Math.max(start, pos), b = Math.min(end, pos + len);
    if (a < b) segs.push([n, a - pos, b - pos]);
    pos += len;
  }
  // Wrap back to front so splitting one node cannot shift the offsets of the next.
  for (const [n, a, b] of segs.reverse()) {
    const mid = n.splitText(a);
    mid.splitText(b - a);
    const mark = document.createElement("mark");
    mid.parentNode.replaceChild(mark, mid);
    mark.appendChild(mid);
  }
}
```

> **Why one wrap per text node.** A selection can cross bold text, links or inline code. Wrapping the whole range in one element fails when the range only partly contains an element, so wrap each text node on its own, as above.

### What to do when the quote is not found

- Do not delete the comment. Show it in the panel with an "anchor lost" label so the conversation is still readable.
- Optional improvement: retry with shorter runs of words from the quote and use the longest run that still matches.

## Replies and resolving

Replies reuse the same mutation from step 7 with `replyToId` set to the parent comment. Resolving minimizes the comment, which GitHub shows collapsed but keeps.

```
const M_RESOLVE = `mutation($id:ID!){
  minimizeComment(input:{subjectId:$id,classifier:RESOLVED}){ clientMutationId }
}`;
const resolveThread = (commentId) => gql(M_RESOLVE, { id: commentId });
```

Now wire the pieces together in `panel.js`. This minimal version adds one button that comments on the current selection and highlights existing comments on load. Add the panel list, sign-in button and filters on top of it.

```
(async function main() {
  const m = location.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/[^/]+\/(.+\.md)$/i);
  const article = document.querySelector("article.markdown-body");
  if (!m || !article) return;                       // not a markdown file page
  const [, owner, repo, docPath] = m;

  const discussionId = await getOrCreateDiscussion(owner, repo, decodeURIComponent(docPath));
  for (const t of await loadThreads(discussionId)) {
    const hit = findQuote(article, t.anchor);
    if (hit) highlight(hit);                        // else: list it as "anchor lost"
  }

  const btn = document.createElement("button");
  btn.textContent = "Comment on selection";
  btn.className = "mn-launcher";
  btn.onclick = async () => {
    const a = captureSelection(article);
    if (!a) return alert("Select some text first");
    const text = prompt("Your comment");
    if (text) await postComment(discussionId, buildBody(text, a));
    location.reload();
  };
  document.body.appendChild(btn);
})();
```

In the panel, offer filters for **All**, **Open** (not minimized), **Resolved** (minimized) and **Mine** (author is the signed-in user). Use `isMinimized` from step 8 for the first three.

## Load it and test it

1. Open `chrome://extensions` and switch on Developer mode.
2. Choose **Load unpacked** and select the `margin-notes` folder.
3. Open a markdown file in your test repository and click your panel's sign-in button. Approve the code on GitHub.
4. Select a sentence, write a comment, post it. It should appear highlighted.
5. Open the repository's Discussions tab. You should see one Discussion for the file with your comment inside it.
6. Reload the page. The highlight should come back. Ask a second user to open the file and confirm they see it too.

After you change a file, click the reload arrow on `chrome://extensions` and then hard-reload the GitHub page.

### Checklist

- Posting a comment creates the file's Discussion once, not once per comment.
- A reply appears under its parent.
- Resolving collapses the comment and the Resolved filter shows it.
- Editing the page so the quote disappears shows "anchor lost" instead of an error.
- The same words appearing twice highlight the correct occurrence.

## Security and troubleshooting

- **Least privilege.** Request only Discussions access. Add Contents or Pull requests only if you later build an "edit and open a pull request" feature.
- **Narrow host access.** List only your GitHub host in `host_permissions` and `matches`.
- **Escape everything you render.** Comment text is user input. Insert it with `textContent`, or run it through a markdown sanitizer, never raw `innerHTML`.
- **Do not trust server values.** Clamp the polling interval, and never navigate to a URL that came back from an API response.
- **No secrets in the repo.** The Client ID is not secret, but never commit a token or a client secret.

| Symptom | Likely cause and fix |
|---|---|
| "Not signed in" or 401 | The token is missing or expired. Sign in again, or turn off token expiry on the App for a test. |
| Repository comes back `null` | The App is not installed on that repository or organization. Install it. |
| "Enable Discussions" | Turn on Discussions in the repository settings and create a category. |
| Panel shows old comments after navigating | You did not rebuild or remove the panel on navigation. See the tip in step 3. |
| Highlight on the wrong repeat of a phrase | Prefix and suffix context were empty. Check `captureSelection`. |
| Nothing happens on a page | The URL is not a markdown file, or the host is missing from `matches`. |

## Limits and ideas for later

- **Anchors follow text, not git history.** If the quoted text is rewritten heavily the comment becomes "anchor lost". Re-anchoring to an older commit is not covered here.
- **Resolve is a minimize, not a close.** A direct result of one Discussion per file.
- **No notifications beyond GitHub's.** With no backend, `@mention` notifications come from GitHub only.
- **One-time setup per organization.** An owner installs the App, and each repository needs Discussions on.
- **Ideas:** an "edit and open a pull request" mode using the REST API, an activity feed of recent comments, and unit tests for the pure functions (parsing, scoring, offset arithmetic) in a plain Node test file.
- **Not measured.** This guide makes no performance claims. Test highlighting speed on your largest documents.

*The approach of storing page comments in GitHub Discussions is also used by the open-source [giscus](https://giscus.app/) project. The code on this page is original example code written for this guide. GitHub, GitHub Discussions and Chrome are trademarks of their owners. This page is not affiliated with or endorsed by them.*
