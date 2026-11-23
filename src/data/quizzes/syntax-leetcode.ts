import type { QuizQuestion } from './types';
import { q, r } from './helpers';

export const leetcodeQuestions: QuizQuestion[] = [
  // Arrays and strings, more
  q(
    'arr-11',
    'Arrays',
    'Compare arrays a and b by content into eq.',
    [r`boolean eq = Arrays.equals(a, b);`],
    {
      context: r`int[] a = {1, 2};
int[] b = {1, 2};`,
      note: 'a.equals(b) and a == b compare references.',
    },
  ),
  q(
    'arr-12',
    'Arrays',
    'Fill every row of a 2D array dp with Integer.MAX_VALUE.',
    [r`for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);`],
    { context: r`int[][] dp = new int[3][4];` },
  ),
  q(
    'arr-13',
    'Arrays',
    'Make a copy of b padded or truncated to length 10 into big.',
    [r`int[] big = Arrays.copyOf(b, 10);`],
    { context: r`int[] b = {1, 2, 3};` },
  ),
  q('arr-14', 'Arrays', 'Sort only indexes [1, 4) of b.', [r`Arrays.sort(b, 1, 4);`], {
    context: r`int[] b = {5, 4, 3, 2, 1};`,
  }),
  q('arr-15', 'Arrays', 'Declare a frequency array cnt for the 26 lowercase letters.', [
    r`int[] cnt = new int[26];`,
  ]),
  q(
    'arr-16',
    'Arrays',
    'Declare a jagged 2D array rows of 3 rows with the column count not yet allocated.',
    [r`int[][] rows = new int[3][];`],
  ),
  q(
    'arr-17',
    'Arrays',
    'Copy 3 elements from src (start 0) into dst (start 2) with the native method.',
    [r`System.arraycopy(src, 0, dst, 2, 3);`],
    {
      context: r`int[] src = {1, 2, 3, 4};
int[] dst = new int[6];`,
    },
  ),
  q('arr-18', 'Arrays', 'Declare a 2D array grid initialised to {{1, 2}, {3, 4}}.', [
    r`int[][] grid = {{1, 2}, {3, 4}};`,
    r`int[][] grid = new int[][]{{1, 2}, {3, 4}};`,
  ]),
  q(
    'arr-19',
    'Arrays',
    'Return the pair of indices i and j as an int array.',
    [r`return new int[]{i, j};`],
    {
      context: r`int i = 0, j = 1;`,
    },
  ),
  q('arr-20', 'Arrays', 'Read the length of the array a into len.', [r`int len = a.length;`], {
    context: r`int[] a = {1, 2, 3};`,
    note: 'Arrays use .length, Strings use .length(), collections use .size().',
  }),
  q(
    'arr-21',
    'Arrays',
    'Convert the list res of int[] into an int[][] named out.',
    [
      r`int[][] out = res.toArray(new int[res.size()][]);`,
      r`int[][] out = res.toArray(new int[0][]);`,
    ],
    { context: r`List<int[]> res = new ArrayList<>();` },
  ),
  q(
    'arr-22',
    'Arrays',
    'Declare the four-direction array dirs as row/col deltas (right, down, left, up).',
    [r`int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};`],
  ),
  q(
    'arr-23',
    'Arrays',
    'Write the bounds check for cell (nr, nc) in an m by n grid.',
    [
      r`if (nr >= 0 && nr < m && nc >= 0 && nc < n)`,
      r`if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;`,
    ],
    { note: 'Accepted: the in-bounds if, or the out-of-bounds continue.' },
  ),
  q('str-12', 'Strings', 'Write the loop header over each char c of s.', [
    r`for (char c : s.toCharArray())`,
  ]),
  q(
    'str-13',
    'Strings',
    'Check whether char c is a letter or digit into ok.',
    [r`boolean ok = Character.isLetterOrDigit(c);`],
    { context: r`char c = 'a';` },
  ),
  q(
    'str-14',
    'Strings',
    'Check whether char c is a digit into d.',
    [r`boolean d = Character.isDigit(c);`],
    {
      context: r`char c = '7';`,
    },
  ),
  q(
    'str-15',
    'Strings',
    'Lowercase the char c into lower.',
    [r`char lower = Character.toLowerCase(c);`],
    {
      context: r`char c = 'A';`,
    },
  ),
  q('str-16', 'Strings', 'Lowercase the whole String s into low.', [
    r`String low = s.toLowerCase();`,
  ]),
  q('str-17', 'Strings', 'Check whether s starts with "ab" into sw.', [
    r`boolean sw = s.startsWith("ab");`,
  ]),
  q('str-18', 'Strings', 'Check whether s contains "ab" into has.', [
    r`boolean has = s.contains("ab");`,
  ]),
  q('str-19', 'Strings', 'Take the substring of s from index 2 to the end into tail.', [
    r`String tail = s.substring(2);`,
  ]),
  q('str-20', 'Strings', 'Compare strings a and b lexicographically into cmp.', [
    r`int cmp = a.compareTo(b);`,
  ]),
  q('str-21', 'Strings', 'Convert the char c to a String str.', [
    r`String str = String.valueOf(c);`,
    r`String str = Character.toString(c);`,
    r`String str = "" + c;`,
  ]),
  q('str-22', 'Strings', 'Check whether s is empty into e.', [
    r`boolean e = s.isEmpty();`,
    r`boolean e = s.length() == 0;`,
  ]),
  q('str-23', 'Strings', 'Replace every "a" with "b" in s into out.', [
    r`String out = s.replace("a", "b");`,
  ]),
  q(
    'str-24',
    'Strings',
    'Find the last index of char c in s into at.',
    [r`int at = s.lastIndexOf(c);`],
    {
      context: r`char c = 'x';`,
    },
  ),
  q('str-25', 'Strings', 'Compare a and b ignoring case into same.', [
    r`boolean same = a.equalsIgnoreCase(b);`,
  ]),
  q(
    'str-26',
    'Strings',
    'Convert the digit char c to its int value (0 to 9) using arithmetic into n.',
    [r`int n = c - '0';`],
    { context: r`char c = '7';` },
  ),
  q(
    'str-27',
    'Strings',
    'Shift char c to the next letter, into next.',
    [r`char next = (char) (c + 1);`],
    {
      context: r`char c = 'a';`,
      note: 'c + 1 is an int, so the cast back to char is required.',
    },
  ),
  q(
    'str-28',
    'Strings',
    'Build a sorted anagram key from s (sort its chars, rebuild a String) into key.',
    [
      r`char[] cs = s.toCharArray(); Arrays.sort(cs); String key = new String(cs);`,
      r`char[] cs = s.toCharArray(); Arrays.sort(cs); String key = String.valueOf(cs);`,
    ],
    { note: 'Sorting chars gives one key per anagram group.' },
  ),
  q(
    'str-29',
    'Strings',
    'Count how many times char c appears in s using a stream, into n.',
    [r`long n = s.chars().filter(ch -> ch == c).count();`],
    { context: r`char c = 'a';` },
  ),
  q('str-30', 'Strings', 'Split s into a String array of single characters.', [
    r`String[] parts = s.split("");`,
  ]),
  q('str-31', 'Strings', 'Check that the characters at i and j of s are equal.', [
    r`s.charAt(i) == s.charAt(j)`,
  ]),

  // HashMap more
  q(
    'map-8',
    'HashMap',
    'Check whether map contains the key "a" into has.',
    [r`boolean has = map.containsKey("a");`],
    {
      context: r`Map<String, Integer> map = new HashMap<>();`,
    },
  ),
  q(
    'map-9',
    'HashMap',
    'Increment the count for key c using the classic getOrDefault form.',
    [r`map.put(c, map.getOrDefault(c, 0) + 1);`],
    {
      context: r`Map<Character, Integer> map = new HashMap<>();`,
      note: 'merge(c, 1, Integer::sum) is the other common form.',
    },
  ),
  q(
    'map-10',
    'HashMap',
    'Increment the count for key c using merge.',
    [r`map.merge(c, 1, Integer::sum);`],
    { context: r`Map<Character, Integer> map = new HashMap<>();` },
  ),
  q(
    'map-11',
    'HashMap',
    'Write the loop header over all keys of map.',
    [r`for (int key : map.keySet())`, r`for (Integer key : map.keySet())`],
    { context: r`Map<Integer, Integer> map = new HashMap<>();` },
  ),
  q(
    'map-12',
    'HashMap',
    'Write the loop header over all values of map.',
    [r`for (int v : map.values())`, r`for (Integer v : map.values())`],
    { context: r`Map<Integer, Integer> map = new HashMap<>();` },
  ),
  q(
    'map-13',
    'HashMap',
    'Read the key and value of entry e into k and v.',
    [r`int k = e.getKey(), v = e.getValue();`, r`int k = e.getKey(); int v = e.getValue();`],
    { context: r`Map.Entry<Integer, Integer> e = null;` },
  ),
  q('map-14', 'HashMap', 'Remove key 5 from map.', [r`map.remove(5);`], {
    context: r`Map<Integer, Integer> map = new HashMap<>();`,
  }),
  q('map-15', 'HashMap', 'Create a LinkedHashMap named lhm that keeps insertion order.', [
    r`Map<Integer, Integer> lhm = new LinkedHashMap<>();`,
  ]),
  q(
    'map-16',
    'HashMap',
    'Group words into lists keyed by their sorted key, one statement.',
    [r`groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);`],
    {
      context: r`Map<String, List<String>> groups = new HashMap<>();
String key = "aet", w = "tea";`,
    },
  ),
  q(
    'map-17',
    'HashMap',
    'Copy all values of groups into a new ArrayList of lists named out.',
    [r`List<List<String>> out = new ArrayList<>(groups.values());`],
    { context: r`Map<String, List<String>> groups = new HashMap<>();` },
  ),
  q(
    'map-18',
    'HashMap',
    'Create a LinkedHashMap lru with capacity 3 in access order, evicting the eldest when size exceeds 3.',
    [
      r`Map<Integer, Integer> lru = new LinkedHashMap<>(3, 0.75f, true) { protected boolean removeEldestEntry(Map.Entry<Integer, Integer> e) { return size() > 3; } };`,
    ],
    { note: 'Classic LRU cache: accessOrder=true plus removeEldestEntry.' },
  ),

  // HashSet more
  q(
    'set-6',
    'HashSet',
    'Check whether set contains 3 into has.',
    [r`boolean has = set.contains(3);`],
    {
      context: r`Set<Integer> set = new HashSet<>();`,
    },
  ),
  q('set-7', 'HashSet', 'Remove 3 from set.', [r`set.remove(3);`], {
    context: r`Set<Integer> set = new HashSet<>();`,
  }),
  q('set-8', 'HashSet', 'Create a TreeSet named ts (sorted, supports floor and ceiling).', [
    r`TreeSet<Integer> ts = new TreeSet<>();`,
  ]),
  q('set-9', 'HashSet', 'Create a LinkedHashSet named lhs that keeps insertion order.', [
    r`Set<Integer> lhs = new LinkedHashSet<>();`,
  ]),
  q('set-10', 'HashSet', 'Keep only the elements of a that are also in b.', [r`a.retainAll(b);`], {
    context: r`Set<Integer> a = new HashSet<>(), b = new HashSet<>();`,
  }),
  q(
    'set-11',
    'HashSet',
    'Check whether all of b is in a into sub.',
    [r`boolean sub = a.containsAll(b);`],
    {
      context: r`Set<Integer> a = new HashSet<>(), b = new HashSet<>();`,
    },
  ),

  // ArrayList more
  q('list-10', 'ArrayList', 'Read element 2 of list into x.', [r`int x = list.get(2);`], {
    context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
  }),
  q('list-11', 'ArrayList', 'Set element 2 of list to 9.', [r`list.set(2, 9);`], {
    context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
  }),
  q(
    'list-12',
    'ArrayList',
    'Remove the LAST element of list.',
    [r`list.remove(list.size() - 1);`],
    {
      context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
      note: 'The backtracking undo step.',
    },
  ),
  q('list-13', 'ArrayList', 'Swap elements i and j of list.', [r`Collections.swap(list, i, j);`], {
    context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));
int i = 0, j = 2;`,
  }),
  q(
    'list-14',
    'ArrayList',
    'Find the maximum of list into mx.',
    [r`int mx = Collections.max(list);`],
    {
      context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
    },
  ),
  q('list-15', 'ArrayList', 'Initialise res as an empty list of lists of Integer.', [
    r`List<List<Integer>> res = new ArrayList<>();`,
  ]),
  q('list-16', 'ArrayList', 'Create an immutable list of 1, 2, 3 named nums.', [
    r`List<Integer> nums = List.of(1, 2, 3);`,
  ]),
  q(
    'list-17',
    'ArrayList',
    'Create a mutable ArrayList named nums from 1, 2, 3 in one statement.',
    [
      r`List<Integer> nums = new ArrayList<>(List.of(1, 2, 3));`,
      r`List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3));`,
    ],
  ),
  q('list-18', 'ArrayList', 'Append every element of other to list.', [r`list.addAll(other);`], {
    context: r`List<Integer> list = new ArrayList<>();
List<Integer> other = new ArrayList<>();`,
  }),
  q(
    'list-19',
    'ArrayList',
    'Create the adjacency list adj for n nodes (a list of lists), initialised with a loop.',
    [
      r`List<List<Integer>> adj = new ArrayList<>(); for (int i = 0; i < n; i++) adj.add(new ArrayList<>());`,
    ],
    { context: r`int n = 5;` },
  ),
  q(
    'list-20',
    'ArrayList',
    'Add the undirected edge (u, v) to adjacency list adj.',
    [r`adj.get(u).add(v); adj.get(v).add(u);`],
    { context: r`List<List<Integer>> adj = new ArrayList<>();` },
  ),

  // Deque and Queue more
  q('dq-9', 'Deque and Queue', 'Create a Queue of Integer named queue using a LinkedList.', [
    r`Queue<Integer> queue = new LinkedList<>();`,
  ]),
  q(
    'dq-10',
    'Deque and Queue',
    'Add 1 to queue, returning false instead of throwing on failure.',
    [r`queue.offer(1);`],
    {
      context: r`Queue<Integer> queue = new ArrayDeque<>();`,
    },
  ),
  q(
    'dq-11',
    'Deque and Queue',
    'Remove and return the head of queue (null if empty) into head.',
    [r`Integer head = queue.poll();`],
    { context: r`Queue<Integer> queue = new ArrayDeque<>();` },
  ),
  q('dq-12', 'Deque and Queue', 'Pop the top of stack into top.', [r`int top = stack.pop();`], {
    context: r`Deque<Integer> stack = new ArrayDeque<>();`,
  }),
  q(
    'dq-13',
    'Deque and Queue',
    'Check whether stack is empty into e.',
    [r`boolean e = stack.isEmpty();`],
    {
      context: r`Deque<Integer> stack = new ArrayDeque<>();`,
    },
  ),
  q(
    'dq-14',
    'Deque and Queue',
    'Remove and return the LAST element of dq into last.',
    [r`int last = dq.pollLast();`, r`int last = dq.removeLast();`],
    { context: r`Deque<Integer> dq = new ArrayDeque<>();` },
  ),
  q(
    'dq-15',
    'Deque and Queue',
    'Write the BFS level loop header that processes exactly the current level of queue.',
    [
      r`for (int s = queue.size(); s > 0; s--)`,
      r`int size = queue.size(); for (int i = 0; i < size; i++)`,
    ],
    { note: 'Capture size before the loop since the queue grows inside it.' },
  ),
  q(
    'dq-16',
    'Deque and Queue',
    'Write the monotonic-stack condition: pop while stack is non-empty and the top index has a smaller value than nums[i].',
    [r`while (!stack.isEmpty() && nums[stack.peek()] < nums[i])`],
    { context: r`Deque<Integer> stack = new ArrayDeque<>();` },
  ),
  q(
    'dq-17',
    'Deque and Queue',
    'Write the loop that runs while queue is not empty.',
    [r`while (!queue.isEmpty())`],
    { context: r`Queue<Integer> queue = new ArrayDeque<>();` },
  ),
  q(
    'dq-18',
    'Deque and Queue',
    'Create a boolean array visited of size n.',
    [r`boolean[] visited = new boolean[n];`],
    {
      context: r`int n = 5;`,
    },
  ),

  // PriorityQueue more
  q('pq-6', 'PriorityQueue', 'Create a max-heap of Integer using Collections.reverseOrder().', [
    r`PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());`,
  ]),
  q('pq-7', 'PriorityQueue', 'Add 5 to minHeap.', [r`minHeap.offer(5);`, r`minHeap.add(5);`], {
    context: r`PriorityQueue<Integer> minHeap = new PriorityQueue<>();`,
  }),
  q(
    'pq-8',
    'PriorityQueue',
    'Read the number of elements in minHeap into n.',
    [r`int n = minHeap.size();`],
    {
      context: r`PriorityQueue<Integer> minHeap = new PriorityQueue<>();`,
    },
  ),
  q(
    'pq-9',
    'PriorityQueue',
    'Create a PriorityQueue<int[]> pq ordered by element 0 ascending using a comparator lambda.',
    [
      r`PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));`,
      r`PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));`,
    ],
  ),
  q(
    'pq-10',
    'PriorityQueue',
    'Create a top-k heap of the most frequent keys: PriorityQueue<Integer> pq ordered by map.get(x) ascending.',
    [
      r`PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> map.get(a) - map.get(b));`,
      r`PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> Integer.compare(map.get(a), map.get(b)));`,
      r`PriorityQueue<Integer> pq = new PriorityQueue<>(Comparator.comparingInt(map::get));`,
    ],
    { context: r`Map<Integer, Integer> map = new HashMap<>();` },
  ),
  q(
    'pq-11',
    'PriorityQueue',
    'Trim minHeap back to size k by removing the smallest when size exceeds k.',
    [r`if (minHeap.size() > k) minHeap.poll();`],
    {
      context: r`PriorityQueue<Integer> minHeap = new PriorityQueue<>();
int k = 3;`,
      note: 'A min-heap capped at k holds the k largest values.',
    },
  ),

  // Linked lists, trees, graphs
  q(
    'node-1',
    'Linked lists and trees',
    'Create a dummy head node named dummy before a merge or removal.',
    [r`ListNode dummy = new ListNode(0);`, r`ListNode dummy = new ListNode();`],
  ),
  q(
    'node-2',
    'Linked lists and trees',
    'Create a pointer cur that starts at the dummy node.',
    [r`ListNode cur = dummy;`],
    {
      context: r`ListNode dummy = new ListNode(0);`,
    },
  ),
  q(
    'node-3',
    'Linked lists and trees',
    'Write the loop header that walks a linked list from head with cur.',
    [r`while (cur != null)`],
    { context: r`ListNode cur = head;` },
  ),
  q('node-4', 'Linked lists and trees', 'Advance cur to the next node.', [r`cur = cur.next;`]),
  q('node-5', 'Linked lists and trees', 'Return the real head after using a dummy head.', [
    r`return dummy.next;`,
  ]),
  q(
    'node-6',
    'Linked lists and trees',
    'Write the fast/slow pointer loop condition for finding the middle or a cycle.',
    [r`while (fast != null && fast.next != null)`],
  ),
  q(
    'node-7',
    'Linked lists and trees',
    'Reverse one step: save next into nxt, point cur back to prev.',
    [r`ListNode nxt = cur.next; cur.next = prev;`],
    { context: r`ListNode prev = null, cur = head;` },
  ),
  q(
    'node-8',
    'Linked lists and trees',
    'Write the base case of a recursive tree function that returns 0 for a null node.',
    [r`if (root == null) return 0;`, r`if (node == null) return 0;`],
  ),
  q(
    'node-9',
    'Linked lists and trees',
    'Compute max depth recursively: 1 plus the larger of the left and right depths.',
    [r`return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));`],
  ),
  q(
    'node-10',
    'Linked lists and trees',
    'Write the loop header for an iterative inorder traversal that continues while cur exists or stack has nodes.',
    [r`while (cur != null || !stack.isEmpty())`],
    {
      context: r`TreeNode cur = root;
Deque<TreeNode> stack = new ArrayDeque<>();`,
    },
  ),
  q(
    'node-11',
    'Linked lists and trees',
    'Declare the Union-Find parent array of size n initialised so every node is its own parent.',
    [
      r`int[] parent = new int[n]; for (int i = 0; i < n; i++) parent[i] = i;`,
      r`int[] parent = IntStream.range(0, n).toArray();`,
    ],
    { context: r`int n = 5;` },
  ),
  q(
    'node-12',
    'Linked lists and trees',
    'Write the recursive find with path compression for Union-Find.',
    [r`int find(int x) { if (parent[x] != x) parent[x] = find(parent[x]); return parent[x]; }`],
    { context: r`int[] parent;` },
  ),
  q('node-13', 'Linked lists and trees', 'Create the Trie node children array for 26 letters.', [
    r`TrieNode[] children = new TrieNode[26];`,
  ]),

  // Math and bits more
  q('num-11', 'Math and numbers', 'Store the larger of a and b in mx.', [
    r`int mx = Math.max(a, b);`,
  ]),
  q(
    'num-12',
    'Math and numbers',
    'Store the absolute value of x in ab.',
    [r`int ab = Math.abs(x);`],
    { context: r`int x = -3;` },
  ),
  q(
    'num-13',
    'Math and numbers',
    'Compute the square root of n as a double into root.',
    [r`double root = Math.sqrt(n);`],
    {
      context: r`int n = 16;`,
    },
  ),
  q('num-14', 'Math and numbers', 'Compute 2 to the power 10 with Math.pow, into p.', [
    r`double p = Math.pow(2, 10);`,
  ]),
  q('num-15', 'Math and numbers', 'Compute the overflow-safe midpoint of lo and hi into mid.', [
    r`int mid = lo + (hi - lo) / 2;`,
    r`int mid = lo + ((hi - lo) >> 1);`,
    r`int mid = (lo + hi) >>> 1;`,
  ]),
  q('num-16', 'Math and numbers', 'Store the smallest int in small.', [
    r`int small = Integer.MIN_VALUE;`,
  ]),
  q('num-17', 'Math and numbers', 'Store the largest long in big.', [
    r`long big = Long.MAX_VALUE;`,
  ]),
  q(
    'num-18',
    'Math and numbers',
    'Check whether x is a power of two (x > 0) into pow.',
    [r`boolean pow = x > 0 && (x & (x - 1)) == 0;`],
    { context: r`int x = 8;` },
  ),
  q(
    'num-19',
    'Math and numbers',
    'Clear the lowest set bit of x.',
    [r`x = x & (x - 1);`, r`x &= x - 1;`],
    {
      context: r`int x = 12;`,
    },
  ),
  q(
    'num-20',
    'Math and numbers',
    'Isolate the lowest set bit of x into low.',
    [r`int low = x & -x;`],
    { context: r`int x = 12;` },
  ),
  q(
    'num-21',
    'Math and numbers',
    'Check whether bit i of mask is set into on.',
    [r`boolean on = ((mask >> i) & 1) == 1;`, r`boolean on = (mask & (1 << i)) != 0;`],
    { context: r`int mask = 5, i = 2;` },
  ),
  q(
    'num-22',
    'Math and numbers',
    'Set bit i of mask.',
    [r`mask |= 1 << i;`, r`mask = mask | (1 << i);`],
    {
      context: r`int mask = 5, i = 1;`,
    },
  ),
  q(
    'num-23',
    'Math and numbers',
    'Loop over every subset mask of n items.',
    [r`for (int mask = 0; mask < (1 << n); mask++)`],
    { context: r`int n = 4;` },
  ),
  q('num-24', 'Math and numbers', 'XOR a and b into x.', [r`int x = a ^ b;`]),
  q('num-25', 'Math and numbers', 'Declare the modulus 10^9 + 7 as a constant named MOD.', [
    r`final int MOD = 1_000_000_007;`,
    r`static final int MOD = 1_000_000_007;`,
    r`final int MOD = 1000000007;`,
    r`static final int MOD = 1000000007;`,
    r`int MOD = 1_000_000_007;`,
    r`int MOD = 1000000007;`,
  ]),
  q(
    'num-26',
    'Math and numbers',
    'Compute (a * b) % MOD safely for int a and b, into res.',
    [r`int res = (int) ((long) a * b % MOD);`, r`long res = (long) a * b % MOD;`],
    {
      context: r`final int MOD = 1_000_000_007;`,
      note: 'Cast to long before multiplying to avoid int overflow.',
    },
  ),
  q(
    'num-27',
    'Math and numbers',
    'Cast a long total to int into small.',
    [r`int small = (int) total;`],
    {
      context: r`long total = 5L;`,
    },
  ),
  q(
    'num-28',
    'Math and numbers',
    'Count integer division with ceiling for positive a and b, into c.',
    [r`int c = (a + b - 1) / b;`, r`int c = Math.ceilDiv(a, b);`],
  ),
  q(
    'num-29',
    'Math and numbers',
    'Parse a char digit c with Character helper into n.',
    [r`int n = Character.getNumericValue(c);`],
    {
      context: r`char c = '7';`,
    },
  ),
  q('num-30', 'Math and numbers', 'Swap a and b using a temp variable.', [
    r`int tmp = a; a = b; b = tmp;`,
  ]),
  q('num-31', 'Math and numbers', 'Use the ternary operator to set m to the larger of a and b.', [
    r`int m = a > b ? a : b;`,
  ]),
  q(
    'num-32',
    'Math and numbers',
    'Write the greatest common divisor method gcd(a, b) recursively.',
    [
      r`int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
      r`int gcd(int a, int b) { if (b == 0) return a; return gcd(b, a % b); }`,
    ],
  ),

  // Sorting and comparators more
  q('cmp-4', 'Sorting and comparators', 'Sort the int[][] pts by x then by y using Comparator.', [
    r`Arrays.sort(pts, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));`,
    r`Arrays.sort(pts, Comparator.comparingInt((int[] a) -> a[0]).thenComparingInt(a -> a[1]));`,
  ]),
  q(
    'cmp-5',
    'Sorting and comparators',
    'Sort list in descending order using the built-in comparator.',
    [
      r`list.sort(Collections.reverseOrder());`,
      r`list.sort(Comparator.reverseOrder());`,
      r`Collections.sort(list, Collections.reverseOrder());`,
    ],
    { context: r`List<Integer> list = new ArrayList<>();` },
  ),
  q(
    'cmp-6',
    'Sorting and comparators',
    'Sort the String array ws alphabetically.',
    [r`Arrays.sort(ws);`],
    {
      context: r`String[] ws = {"b", "a"};`,
    },
  ),
  q(
    'cmp-7',
    'Sorting and comparators',
    'Sort list of int[] by element 1 descending, using Integer.compare.',
    [r`list.sort((a, b) -> Integer.compare(b[1], a[1]));`],
    { context: r`List<int[]> list = new ArrayList<>();` },
  ),
  q(
    'cmp-8',
    'Sorting and comparators',
    'Sort the entries list of Map.Entry<Integer, Integer> by value descending.',
    [
      r`entries.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));`,
      r`entries.sort(Map.Entry.<Integer, Integer>comparingByValue().reversed());`,
      r`entries.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));`,
    ],
    { context: r`List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(map.entrySet());` },
  ),

  // TreeMap / TreeSet more
  q(
    'tree-4',
    'TreeMap and TreeSet',
    'Read the smallest key of tm into lo.',
    [r`int lo = tm.firstKey();`],
    {
      context: r`TreeMap<Integer, Integer> tm = new TreeMap<>();`,
    },
  ),
  q(
    'tree-5',
    'TreeMap and TreeSet',
    'Read the largest key of tm into hi.',
    [r`int hi = tm.lastKey();`],
    {
      context: r`TreeMap<Integer, Integer> tm = new TreeMap<>();`,
    },
  ),
  q(
    'tree-6',
    'TreeMap and TreeSet',
    'Find the smallest key strictly greater than 25 in tm, as up.',
    [r`Integer up = tm.higherKey(25);`],
    { context: r`TreeMap<Integer, Integer> tm = new TreeMap<>();` },
  ),
  q(
    'tree-7',
    'TreeMap and TreeSet',
    'Find the largest key strictly less than 25 in tm, as down.',
    [r`Integer down = tm.lowerKey(25);`],
    { context: r`TreeMap<Integer, Integer> tm = new TreeMap<>();` },
  ),
  q(
    'tree-8',
    'TreeMap and TreeSet',
    'Find the largest element <= 25 in TreeSet ts, as fl.',
    [r`Integer fl = ts.floor(25);`],
    {
      context: r`TreeSet<Integer> ts = new TreeSet<>();`,
    },
  ),
  q(
    'tree-9',
    'TreeMap and TreeSet',
    'Find the smallest element >= 25 in TreeSet ts, as ce.',
    [r`Integer ce = ts.ceiling(25);`],
    {
      context: r`TreeSet<Integer> ts = new TreeSet<>();`,
    },
  ),
  q(
    'tree-10',
    'TreeMap and TreeSet',
    'Remove and return the smallest element of ts into first.',
    [r`int first = ts.pollFirst();`],
    { context: r`TreeSet<Integer> ts = new TreeSet<>();` },
  ),

  // StringBuilder more
  q('sb-6', 'StringBuilder', 'Insert char c at the front of sb.', [r`sb.insert(0, c);`], {
    context: r`StringBuilder sb = new StringBuilder();
char c = 'a';`,
  }),
  q('sb-7', 'StringBuilder', 'Set character at index 2 of sb to c.', [r`sb.setCharAt(2, c);`], {
    context: r`StringBuilder sb = new StringBuilder("abcd");
char c = 'z';`,
  }),
  q('sb-8', 'StringBuilder', 'Read the length of sb into len.', [r`int len = sb.length();`], {
    context: r`StringBuilder sb = new StringBuilder();`,
  }),
  q(
    'sb-9',
    'StringBuilder',
    'Read the character at index 0 of sb into c.',
    [r`char c = sb.charAt(0);`],
    {
      context: r`StringBuilder sb = new StringBuilder("abc");`,
    },
  ),
  q('sb-10', 'StringBuilder', 'Delete the character at index i of sb.', [r`sb.deleteCharAt(i);`], {
    context: r`StringBuilder sb = new StringBuilder("abc");
int i = 1;`,
  }),
  q(
    'sb-11',
    'StringBuilder',
    'Check whether a String s is a palindrome by comparing it with its reverse, into pal.',
    [r`boolean pal = new StringBuilder(s).reverse().toString().equals(s);`],
  ),

  // Streams and conversions more
  q(
    'conv-10',
    'Streams and conversions',
    'Create the int range 0 to n-1 and collect it to an int[] arr.',
    [r`int[] arr = IntStream.range(0, n).toArray();`],
    { context: r`int n = 5;` },
  ),
  q(
    'conv-11',
    'Streams and conversions',
    'Convert List<Integer> list to a Set<Integer> named set with a collector.',
    [
      r`Set<Integer> set = list.stream().collect(Collectors.toSet());`,
      r`Set<Integer> set = new HashSet<>(list);`,
    ],
  ),
  q('conv-12', 'Streams and conversions', 'Sum a List<Integer> list using a stream, into sum.', [
    r`int sum = list.stream().mapToInt(Integer::intValue).sum();`,
    r`int sum = list.stream().mapToInt(x -> x).sum();`,
  ]),
  q(
    'conv-13',
    'Streams and conversions',
    'Convert List<String> strs to a List<Integer> using a stream, into nums.',
    [
      r`List<Integer> nums = strs.stream().map(Integer::parseInt).collect(Collectors.toList());`,
      r`List<Integer> nums = strs.stream().map(Integer::valueOf).collect(Collectors.toList());`,
      r`List<Integer> nums = strs.stream().map(Integer::parseInt).toList();`,
    ],
  ),
  q(
    'conv-14',
    'Streams and conversions',
    'Count the elements of list that are greater than 2 using a stream, into n.',
    [r`long n = list.stream().filter(x -> x > 2).count();`],
    { context: r`List<Integer> list = new ArrayList<>();` },
  ),
  q(
    'conv-15',
    'Streams and conversions',
    'Convert the keys of map into a new ArrayList named keys.',
    [r`List<Integer> keys = new ArrayList<>(map.keySet());`],
    { context: r`Map<Integer, Integer> map = new HashMap<>();` },
  ),
  q(
    'conv-16',
    'Streams and conversions',
    'Box an int[] arr into an Integer[] named boxed with a stream.',
    [r`Integer[] boxed = Arrays.stream(arr).boxed().toArray(Integer[]::new);`],
  ),
  q(
    'conv-17',
    'Streams and conversions',
    'Count the frequency of x in list using Collections, into f.',
    [r`int f = Collections.frequency(list, x);`],
    {
      context: r`List<Integer> list = new ArrayList<>();
int x = 3;`,
    },
  ),
  q(
    'conv-18',
    'Streams and conversions',
    'Convert the char[] cs to a String using the constructor, into s.',
    [r`String s = new String(cs);`, r`String s = String.valueOf(cs);`],
  ),
  q(
    'conv-19',
    'Streams and conversions',
    'Convert the int n to a String using the Integer helper, into s.',
    [r`String s = Integer.toString(n);`, r`String s = String.valueOf(n);`],
    { context: r`int n = 42;` },
  ),
  q(
    'conv-20',
    'Streams and conversions',
    'Create a String of n zeros using repeat, into zeros.',
    [r`String zeros = "0".repeat(n);`],
    { context: r`int n = 3;` },
  ),
];
