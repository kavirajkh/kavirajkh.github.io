import type { Quiz, QuizQuestion } from './types';
import { q, r } from './helpers';
import { leetcodeQuestions } from './syntax-leetcode';
import { syntaxPriority } from './syntax-priority';

const authored: QuizQuestion[] = [
  // Arrays
  q(
    'arr-1',
    'Arrays',
    'Declare an int array a of size n (all zeros).',
    [r`int[] a = new int[n];`],
    {
      context: r`int n = 5;`,
    },
  ),
  q('arr-2', 'Arrays', 'Declare a 2D int array grid with 3 rows and 4 columns.', [
    r`int[][] grid = new int[3][4];`,
  ]),
  q(
    'arr-3',
    'Arrays',
    'Declare rows and cols (the dimensions of grid) in one statement.',
    [r`int rows = grid.length, cols = grid[0].length;`],
    {
      context: r`int[][] grid = new int[3][4];`,
      note: 'Check grid.length > 0 before reading grid[0].',
    },
  ),
  q('arr-4', 'Arrays', 'Set every element of a to -1.', [r`Arrays.fill(a, -1);`], {
    context: r`int[] a = new int[5];`,
  }),
  q(
    'arr-5',
    'Arrays',
    'Make a copy of b called copy.',
    [r`int[] copy = b.clone();`, r`int[] copy = Arrays.copyOf(b, b.length);`],
    { context: r`int[] b = {5, 3, 8, 1};` },
  ),
  q(
    'arr-6',
    'Arrays',
    'Copy the elements of b from index 1 up to (not including) index 3 into part.',
    [r`int[] part = Arrays.copyOfRange(b, 1, 3);`],
    { context: r`int[] b = {5, 3, 8, 1};`, note: 'The end index of copyOfRange is exclusive.' },
  ),
  q('arr-7', 'Arrays', 'Sort b in ascending order, in place.', [r`Arrays.sort(b);`], {
    context: r`int[] b = {5, 3, 8, 1};`,
  }),
  q(
    'arr-8',
    'Arrays',
    'Store the position of value 5 in the sorted array b in pos.',
    [r`int pos = Arrays.binarySearch(b, 5);`],
    {
      context: r`int[] b = {1, 3, 5, 8};`,
      note: 'Only valid on a sorted array; returns a negative number if absent.',
    },
  ),
  q(
    'arr-9',
    'Arrays',
    'Print array b in readable form for debugging.',
    [r`System.out.println(Arrays.toString(b));`],
    { context: r`int[] b = {1, 3, 5, 8};` },
  ),
  q(
    'arr-10',
    'Arrays',
    'Print the 2D array grid in readable form.',
    [r`System.out.println(Arrays.deepToString(grid));`],
    { context: r`int[][] grid = new int[3][4];` },
  ),

  // Strings
  q('str-1', 'Strings', 'Store the first character of s in c.', [r`char c = s.charAt(0);`], {
    context: r`String s = "Hello, World";`,
  }),
  q('str-2', 'Strings', 'Get a mutable char array cs from s.', [r`char[] cs = s.toCharArray();`], {
    context: r`String s = "Hello, World";`,
  }),
  q(
    'str-3',
    'Strings',
    'Take the first 5 characters of s as sub.',
    [r`String sub = s.substring(0, 5);`],
    { context: r`String s = "Hello, World";`, note: 'The end index of substring is exclusive.' },
  ),
  q(
    'str-4',
    'Strings',
    'Check whether s has the same content as "Hello, World", into same.',
    [r`boolean same = s.equals("Hello, World");`],
    { context: r`String s = "Hello, World";`, note: 'Never compare Strings with ==.' },
  ),
  q(
    'str-5',
    'Strings',
    'Find the index of "World" in s (or -1) into at.',
    [r`int at = s.indexOf("World");`],
    { context: r`String s = "Hello, World";` },
  ),
  q(
    'str-6',
    'Strings',
    'Trim line and split it on runs of whitespace into words.',
    [r`String[] words = line.trim().split("\\s+");`],
    { context: r`String line = "  a  b c ";` },
  ),
  q(
    'str-7',
    'Strings',
    'Convert the letter ch to an index 0..25 into idx.',
    [r`int idx = ch - 'a';`],
    {
      context: r`char ch = 'c';`,
    },
  ),
  q(
    'str-8',
    'Strings',
    'Convert the index i back to a letter into letter.',
    [r`char letter = (char) ('a' + i);`],
    { context: r`int i = 2;`, note: 'The cast to char is required.' },
  ),
  q(
    'str-9',
    'Strings',
    'Convert the digit character d to an int into digit.',
    [r`int digit = d - '0';`],
    {
      context: r`char d = '7';`,
    },
  ),
  q(
    'str-10',
    'Strings',
    'Join words with "-" into joined.',
    [r`String joined = String.join("-", words);`],
    {
      context: r`String[] words = {"a", "b", "c"};`,
    },
  ),
  q(
    'str-11',
    'Strings',
    'Build "ababab" by repeating "ab" three times into rep.',
    [r`String rep = "ab".repeat(3);`],
    { note: 'String.repeat needs Java 11+.' },
  ),

  // HashMap
  q('map-1', 'HashMap', 'Create a Map<String, Integer> named map backed by a HashMap.', [
    r`Map<String, Integer> map = new HashMap<>();`,
  ]),
  q(
    'map-2',
    'HashMap',
    'Increment the count for key "a" in one call.',
    [r`map.merge("a", 1, Integer::sum);`, r`map.put("a", map.getOrDefault("a", 0) + 1);`],
    { context: r`Map<String, Integer> map = new HashMap<>();` },
  ),
  q(
    'map-3',
    'HashMap',
    'Read the value for "z", or 0 if it is missing, into v.',
    [r`int v = map.getOrDefault("z", 0);`],
    {
      context: r`Map<String, Integer> map = new HashMap<>();`,
      note: 'No null, no NullPointerException.',
    },
  ),
  q(
    'map-4',
    'HashMap',
    'Put "b" -> 5 only if "b" is not already present.',
    [r`map.putIfAbsent("b", 5);`],
    {
      context: r`Map<String, Integer> map = new HashMap<>();`,
    },
  ),
  q(
    'map-5',
    'HashMap',
    'Write the for-loop header that iterates key and value together as e.',
    [r`for (Map.Entry<String, Integer> e : map.entrySet())`],
    { context: r`Map<String, Integer> map = new HashMap<>();` },
  ),
  q(
    'map-6',
    'HashMap',
    'Remove every entry whose value is 0, safely.',
    [r`map.entrySet().removeIf(e -> e.getValue() == 0);`],
    { context: r`Map<String, Integer> map = new HashMap<>();` },
  ),
  q(
    'map-7',
    'HashMap',
    'Add 7 to the list stored under key 1, creating the list if needed (one statement).',
    [r`groups.computeIfAbsent(1, k -> new ArrayList<>()).add(7);`],
    { context: r`Map<Integer, List<Integer>> groups = new HashMap<>();` },
  ),

  // HashSet
  q('set-1', 'HashSet', 'Create a Set<Integer> named set backed by a HashSet.', [
    r`Set<Integer> set = new HashSet<>();`,
  ]),
  q(
    'set-2',
    'HashSet',
    'Add 3 to set and keep whether it was newly added in added.',
    [r`boolean added = set.add(3);`],
    {
      context: r`Set<Integer> set = new HashSet<>();`,
      note: 'add returns false if the value was already present.',
    },
  ),
  q('set-3', 'HashSet', 'Create a HashSet fromList from List.of(1, 2, 2).', [
    r`Set<Integer> fromList = new HashSet<>(List.of(1, 2, 2));`,
  ]),
  q('set-4', 'HashSet', 'Make an immutable Set<Character> vowels of a, e, i, o, u.', [
    r`Set<Character> vowels = Set.of('a', 'e', 'i', 'o', 'u');`,
  ]),
  q(
    'set-5',
    'HashSet',
    'Add the grid cell (2, 3) to visited using a String key "2,3" built from the numbers.',
    [r`visited.add(2 + "," + 3);`],
    { context: r`Set<String> visited = new HashSet<>();` },
  ),

  // ArrayList
  q('list-1', 'ArrayList', 'Create a List<Integer> named list backed by an ArrayList.', [
    r`List<Integer> list = new ArrayList<>();`,
  ]),
  q('list-2', 'ArrayList', 'Insert 9 at index 0 of list.', [r`list.add(0, 9);`], {
    context: r`List<Integer> list = new ArrayList<>(List.of(5));`,
  }),
  q(
    'list-3',
    'ArrayList',
    'Remove the VALUE 5 (not index 5) from list.',
    [r`list.remove(Integer.valueOf(5));`],
    {
      context: r`List<Integer> list = new ArrayList<>(List.of(4, 5));`,
      note: 'remove(5) would remove by index.',
    },
  ),
  q('list-4', 'ArrayList', 'Remove the element at INDEX 0 of list.', [r`list.remove(0);`], {
    context: r`List<Integer> list = new ArrayList<>(List.of(4, 5));`,
  }),
  q(
    'list-5',
    'ArrayList',
    'Sort list ascending.',
    [r`Collections.sort(list);`, r`list.sort(null);`],
    {
      context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
    },
  ),
  q('list-6', 'ArrayList', 'Reverse list in place.', [r`Collections.reverse(list);`], {
    context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
  }),
  q(
    'list-7',
    'ArrayList',
    'Read the last element of list into last.',
    [r`int last = list.get(list.size() - 1);`],
    {
      context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
      note: 'Java 21 adds list.getLast().',
    },
  ),
  q(
    'list-8',
    'ArrayList',
    'Take a view of indexes [0, 2) of list as view.',
    [r`List<Integer> view = list.subList(0, 2);`],
    {
      context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
      note: 'Edits to the view write through to the list.',
    },
  ),
  q('list-9', 'ArrayList', 'Add a COPY of list to res.', [r`res.add(new ArrayList<>(list));`], {
    context: r`List<List<Integer>> res = new ArrayList<>();
List<Integer> list = new ArrayList<>();`,
    note: 'Adding the live list would let later changes alter stored results.',
  }),

  // Deque / Queue
  q(
    'dq-1',
    'Deque and Queue',
    'Create a stack of Integer using ArrayDeque, typed as Deque.',
    [r`Deque<Integer> stack = new ArrayDeque<>();`],
    { note: 'Prefer ArrayDeque over the legacy Stack class.' },
  ),
  q('dq-2', 'Deque and Queue', 'Push 1 onto stack.', [r`stack.push(1);`], {
    context: r`Deque<Integer> stack = new ArrayDeque<>();`,
  }),
  q(
    'dq-3',
    'Deque and Queue',
    'Look at the top of stack without removing it into top.',
    [r`int top = stack.peek();`],
    { context: r`Deque<Integer> stack = new ArrayDeque<>();` },
  ),
  q('dq-4', 'Deque and Queue', 'Create a BFS queue q of int[] using ArrayDeque.', [
    r`Queue<int[]> q = new ArrayDeque<>();`,
  ]),
  q('dq-5', 'Deque and Queue', 'Enqueue the pair {0, 0} into q.', [r`q.offer(new int[]{0, 0});`], {
    context: r`Queue<int[]> q = new ArrayDeque<>();`,
  }),
  q(
    'dq-6',
    'Deque and Queue',
    'Dequeue into cell, getting null (not an exception) when q is empty.',
    [r`int[] cell = q.poll();`],
    {
      context: r`Queue<int[]> q = new ArrayDeque<>();`,
      note: 'remove() would throw on an empty queue.',
    },
  ),
  q(
    'dq-7',
    'Deque and Queue',
    'Add 1 at the front of dq.',
    [r`dq.offerFirst(1);`, r`dq.addFirst(1);`],
    {
      context: r`Deque<Integer> dq = new ArrayDeque<>();`,
    },
  ),
  q('dq-8', 'Deque and Queue', 'Peek the last element of dq into l.', [r`int l = dq.peekLast();`], {
    context: r`Deque<Integer> dq = new ArrayDeque<>();`,
  }),

  // PriorityQueue
  q('pq-1', 'PriorityQueue', 'Create a min-heap of Integer named minHeap.', [
    r`PriorityQueue<Integer> minHeap = new PriorityQueue<>();`,
  ]),
  q('pq-2', 'PriorityQueue', 'Create a max-heap of Integer named maxHeap.', [
    r`PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());`,
  ]),
  q(
    'pq-3',
    'PriorityQueue',
    'Create a PriorityQueue<int[]> byDist ordered by element at index 1 (use Integer.compare).',
    [r`PriorityQueue<int[]> byDist = new PriorityQueue<>((x, y) -> Integer.compare(x[1], y[1]));`],
    { note: 'Avoid (a, b) -> a[1] - b[1]: subtraction can overflow.' },
  ),
  q(
    'pq-4',
    'PriorityQueue',
    'Read the smallest element of minHeap into smallest.',
    [r`int smallest = minHeap.peek();`],
    { context: r`PriorityQueue<Integer> minHeap = new PriorityQueue<>();` },
  ),
  q(
    'pq-5',
    'PriorityQueue',
    'Remove and return the smallest element of minHeap.',
    [r`minHeap.poll();`],
    {
      context: r`PriorityQueue<Integer> minHeap = new PriorityQueue<>();`,
    },
  ),

  // Math and numbers
  q('num-1', 'Math and numbers', 'Store the largest int in big.', [
    r`int big = Integer.MAX_VALUE;`,
  ]),
  q(
    'num-2',
    'Math and numbers',
    'Compute big * 2 as a long without overflowing, into prod.',
    [r`long prod = (long) big * 2;`],
    { context: r`int big = Integer.MAX_VALUE;`, note: 'Cast BEFORE multiplying.' },
  ),
  q('num-3', 'Math and numbers', 'Compute ceil(7 / 3) using only int arithmetic, into ceilDiv.', [
    r`int ceilDiv = (7 + 3 - 1) / 3;`,
  ]),
  q(
    'num-4',
    'Math and numbers',
    'Compute -7 modulo 3 as a non-negative number into mod.',
    [r`int mod = Math.floorMod(-7, 3);`],
    { note: '-7 % 3 is -1 in Java.' },
  ),
  q('num-5', 'Math and numbers', 'Parse the String "-42" into an int num.', [
    r`int num = Integer.parseInt("-42");`,
  ]),
  q('num-6', 'Math and numbers', 'Convert the int 42 to a String str.', [
    r`String str = String.valueOf(42);`,
    r`String str = Integer.toString(42);`,
  ]),
  q('num-7', 'Math and numbers', 'Get the binary string of 10 into bin.', [
    r`String bin = Integer.toBinaryString(10);`,
  ]),
  q('num-8', 'Math and numbers', 'Parse the binary string "1010" into an int fromBin.', [
    r`int fromBin = Integer.parseInt("1010", 2);`,
  ]),
  q('num-9', 'Math and numbers', 'Count the set bits of 7 into ones.', [
    r`int ones = Integer.bitCount(7);`,
  ]),
  q(
    'num-10',
    'Math and numbers',
    'Compute 2 to the power 40 as a long using a shift, into pow2.',
    [r`long pow2 = 1L << 40;`],
    { note: 'Math.pow returns a double.' },
  ),

  // Sorting and comparators
  q(
    'cmp-1',
    'Sorting and comparators',
    'Sort the boxed array in descending order.',
    [r`Arrays.sort(boxed, Collections.reverseOrder());`],
    { context: r`Integer[] boxed = {3, 1, 2};`, note: 'Works on boxed arrays only, not int[].' },
  ),
  q(
    'cmp-2',
    'Sorting and comparators',
    'Sort the intervals iv by start (index 0) using Integer.compare.',
    [
      r`Arrays.sort(iv, (x, y) -> Integer.compare(x[0], y[0]));`,
      r`Arrays.sort(iv, Comparator.comparingInt(x -> x[0]));`,
    ],
    { context: r`int[][] iv = {{1, 4}, {0, 2}, {1, 3}};` },
  ),
  q(
    'cmp-3',
    'Sorting and comparators',
    'Sort the String array ws with the longest string first, using Integer.compare.',
    [r`Arrays.sort(ws, (x, y) -> Integer.compare(y.length(), x.length()));`],
    { context: r`String[] ws = {"bb", "a", "ccc"};` },
  ),

  // TreeMap / TreeSet
  q(
    'tree-1',
    'TreeMap and TreeSet',
    'Largest key <= 25 in tm, as fl.',
    [r`Integer fl = tm.floorKey(25);`],
    {
      context: r`TreeMap<Integer, String> tm = new TreeMap<>();`,
    },
  ),
  q(
    'tree-2',
    'TreeMap and TreeSet',
    'Smallest key >= 25 in tm, as ce.',
    [r`Integer ce = tm.ceilingKey(25);`],
    {
      context: r`TreeMap<Integer, String> tm = new TreeMap<>();`,
    },
  ),
  q(
    'tree-3',
    'TreeMap and TreeSet',
    'Remove and return the entry with the smallest key of tm into e.',
    [r`Map.Entry<Integer, String> e = tm.pollFirstEntry();`],
    { context: r`TreeMap<Integer, String> tm = new TreeMap<>();` },
  ),

  // StringBuilder
  q('sb-1', 'StringBuilder', 'Create a StringBuilder named sb.', [
    r`StringBuilder sb = new StringBuilder();`,
  ]),
  q(
    'sb-2',
    'StringBuilder',
    'Append "ab" then the char c in one chained statement.',
    [r`sb.append("ab").append('c');`],
    { context: r`StringBuilder sb = new StringBuilder();` },
  ),
  q(
    'sb-3',
    'StringBuilder',
    'Delete the last character of sb (the undo step in backtracking).',
    [r`sb.deleteCharAt(sb.length() - 1);`],
    { context: r`StringBuilder sb = new StringBuilder("abc");` },
  ),
  q('sb-4', 'StringBuilder', 'Reverse sb in place.', [r`sb.reverse();`], {
    context: r`StringBuilder sb = new StringBuilder("abc");`,
  }),
  q('sb-5', 'StringBuilder', 'Convert sb to a String out.', [r`String out = sb.toString();`], {
    context: r`StringBuilder sb = new StringBuilder("abc");`,
  }),

  // Streams and conversions
  q(
    'conv-1',
    'Streams and conversions',
    'Sum an int[] arr using a stream, into sum.',
    [r`int sum = Arrays.stream(arr).sum();`],
    { context: r`int[] arr = {3, 1, 2};` },
  ),
  q(
    'conv-2',
    'Streams and conversions',
    'Max of int[] arr using a stream, into max.',
    [r`int max = Arrays.stream(arr).max().getAsInt();`],
    { context: r`int[] arr = {3, 1, 2};` },
  ),
  q(
    'conv-3',
    'Streams and conversions',
    'Convert int[] arr to List<Integer> asList with a stream.',
    [r`List<Integer> asList = Arrays.stream(arr).boxed().collect(Collectors.toList());`],
    { context: r`int[] arr = {3, 1, 2};` },
  ),
  q(
    'conv-4',
    'Streams and conversions',
    'Convert List<Integer> list to int[] arr.',
    [r`int[] arr = list.stream().mapToInt(Integer::intValue).toArray();`],
    { context: r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));` },
  ),
  q(
    'conv-5',
    'Streams and conversions',
    'Convert List<String> strs to a String[] sArr.',
    [r`String[] sArr = strs.toArray(new String[0]);`],
    { context: r`List<String> strs = new ArrayList<>(List.of("a", "b"));` },
  ),
  q(
    'conv-6',
    'Streams and conversions',
    'Convert char[] cs back to a String back.',
    [r`String back = new String(cs);`, r`String back = String.valueOf(cs);`],
    { context: r`char[] cs = {'h', 'i'};` },
  ),
  q(
    'conv-7',
    'Streams and conversions',
    'Turn the String "2024" into the int[] {2, 0, 2, 4} named digits.',
    [r`int[] digits = "2024".chars().map(c -> c - '0').toArray();`],
  ),
  q(
    'conv-8',
    'Streams and conversions',
    'Create a HashSet named set from list (dedupe).',
    [r`Set<Integer> set = new HashSet<>(list);`],
    { context: r`List<Integer> list = new ArrayList<>(List.of(1, 2, 2));` },
  ),
  q(
    'conv-9',
    'Streams and conversions',
    'Write the compareTo method for Node that orders by dist ascending (use Integer.compare).',
    [r`public int compareTo(Node o) { return Integer.compare(dist, o.dist); }`],
    {
      context: r`class Node implements Comparable<Node> {
    int id, dist;
}`,
    },
  ),
  ...leetcodeQuestions,
];

const byId = new Map(authored.map((item) => [item.id, item]));
const ranked = syntaxPriority.map((id) => {
  const item = byId.get(id);
  if (!item) throw new Error(`Unknown id in syntaxPriority: ${id}`);
  return item;
});
const rankedIds = new Set(syntaxPriority);

export const syntaxQuiz: Quiz = {
  slug: 'syntax',
  title: 'Java Syntax Recall',
  description:
    'Type the Java line from memory: arrays, strings, collections, comparators, conversions and common utilities.',
  source: {
    label: 'DS & Algorithms Cheat Sheet: Java Syntax',
    href: '/resources/ds-algorithms-cheat-sheet.html#syntax',
  },
  /** Ordered by importance: random rounds of N take the first N. */
  questions: [...ranked, ...authored.filter((item) => !rankedIds.has(item.id))],
};
