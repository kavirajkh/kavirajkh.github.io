# kavirajkh.github.io

Personal engineering portfolio for **Kaviraj Haridasan** — Senior Software Engineer building high-scale Java backend systems for Apple.

Live site: https://kavirajkh.github.io

## Tech Stack

- **[Astro](https://astro.build)** (static output) — content-driven pages with near-zero shipped JS
- Hand-rolled CSS with custom properties (light theme, no framework/utility CSS)
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** for automatic sitemap generation
- Deployed via **GitHub Actions** to **GitHub Pages**

## Content Architecture

All resume content lives as typed data in `src/data/` rather than hardcoded in markup, so updates don't require touching page templates:

- `profile.ts` — headline, summary, contact info
- `experience.ts` — work history and highlights
- `projects.ts` — case studies (problem → architecture → trade-offs → impact), each rendered as its own crawlable page at `/projects/[slug]/`
- `skills.ts` — grouped technical skills, certifications, education

## Local Development

Requires Node.js 22+.

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build to ./dist
npm run preview   # preview the production build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `./dist` to GitHub Pages. No manual deploy steps required.

## Project Structure

```
src/
├── data/         # resume content as typed data
├── layouts/      # BaseLayout.astro — shared <head>, meta, JSON-LD
├── components/   # SiteHeader, SiteFooter
├── styles/       # global.css — design tokens, resets, components
└── pages/        # route-level pages (home, about, experience, projects, skills, contact, 404)
```

## Notes on Content

Project case studies describe systems by function rather than internal codename, in line with maintaining confidentiality around Apple's internal project names and architecture.
