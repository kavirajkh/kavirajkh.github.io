import type { Quiz, QuizQuestion } from './types';
import { mc, q, r, rankQuestions } from './helpers';
import { conversionsPriority } from './conversions-priority';

/**
 * Every answer explains the conversion the same way: what it does, the older way, the modern
 * way, whether the result can change, and where it shows up in coding challenges. The memory
 * tip goes in `remember`.
 */
type Detail = {
  what: string;
  older?: string;
  modern?: string;
  mutable?: string;
  use?: string;
  tip: string;
};

function explainOf(d: Detail): { explain: string; remember: string } {
  const lines = [d.what];
  if (d.older) lines.push(`- Older way: ${d.older}`);
  if (d.modern) lines.push(`- Modern way: ${d.modern}`);
  if (d.mutable) lines.push(`- Mutable or not: ${d.mutable}`);
  if (d.use) lines.push(`- In coding challenges: ${d.use}`);
  return { explain: lines.join('\n'), remember: d.tip };
}

/** Typed: write the conversion from memory. */
function t(
  id: string,
  section: string,
  prompt: string,
  answers: string[],
  d: Detail,
  context?: string,
): QuizQuestion {
  return q(id, section, prompt, answers, { ...explainOf(d), context });
}

/** Multiple choice: pick the correct conversion, result type or behaviour. */
function m(
  id: string,
  section: string,
  prompt: string,
  correct: string,
  wrong: [string, string, string],
  d: Detail,
  context?: string,
): QuizQuestion {
  return mc(id, section, prompt, correct, wrong, { ...explainOf(d), context });
}

const authored: QuizQuestion[] = [
  // ---------------------------------------------------------------- int[] and Integer[]
  t(
    'box-array',
    'int[] and Integer[]',
    'Convert the primitive int[] arr into an Integer[] named boxed.',
    [r`Integer[] boxed = Arrays.stream(arr).boxed().toArray(Integer[]::new);`],
    {
      what: '`Arrays.stream(arr)` makes an IntStream, `.boxed()` wraps every int in an Integer, and `.toArray(Integer[]::new)` collects them into an Integer[]. The constructor reference tells Java which array type to build.',
      older:
        'allocate `new Integer[arr.length]` and copy in a loop (`boxed[i] = arr[i]`, autoboxing does the wrapping). Four lines, but it runs everywhere.',
      modern:
        'the one-line stream (Java 8+). Less typing, and the same shape as every other conversion here.',
      mutable:
        'the new array is independent of arr, so changing one never changes the other. The array slots can be reassigned. Each Integer object itself is immutable.',
      use: 'you need a comparator on a primitive array, for example `Arrays.sort(boxed, Collections.reverseOrder())`, or `Arrays.sort(boxed, (a, b) -> ...)` for custom orders.',
      tip: 'Primitive to object: stream it, `boxed()` it, then `toArray` with the array constructor.',
    },
    r`int[] arr = {1, 2, 3};`,
  ),
  t(
    'unbox-array',
    'int[] and Integer[]',
    'Convert the Integer[] boxed back into a primitive int[] named back.',
    [
      r`int[] back = Arrays.stream(boxed).mapToInt(Integer::intValue).toArray();`,
      r`int[] back = Arrays.stream(boxed).mapToInt(i -> i).toArray();`,
    ],
    {
      what: '`Arrays.stream(boxed)` makes a Stream<Integer>, `.mapToInt(Integer::intValue)` unboxes each element into a primitive and switches to an IntStream, and `.toArray()` collects an int[].',
      older: 'allocate `new int[boxed.length]` and copy in a loop (auto-unboxing does the work).',
      modern:
        '`mapToInt(Integer::intValue)`. The shorter `mapToInt(i -> i)` is accepted too, because the lambda unboxes automatically.',
      mutable:
        'the result is a fresh int[] with copied values, independent of boxed. A null element throws NullPointerException while unboxing.',
      use: 'a method must return int[], or you finished a custom sort on Integer[] and want the primitive array back.',
      tip: 'Boxed goes `boxed()`, unboxed goes `mapToInt`. The two are mirror images.',
    },
    r`Integer[] boxed = {1, 2, 3};`,
  ),
  m(
    'box-array-bug',
    'int[] and Integer[]',
    'Where does `Arrays.stream(arr).toArray(Integer[]::new)` go wrong when arr is an int[]?',
    'IntStream.toArray() takes no argument: call boxed() first to get a Stream<Integer>',
    [
      'Arrays.stream cannot read an int[] at all',
      'Integer[]::new is not valid Java syntax',
      'It compiles and returns an int[] anyway',
    ],
    {
      what: '`Arrays.stream(int[])` returns an IntStream, and IntStream only has the no-argument `toArray()` that returns int[]. The generator version `toArray(Integer[]::new)` exists on Stream<T>, so you must call `.boxed()` first.',
      modern: 'the fixed line is `Arrays.stream(arr).boxed().toArray(Integer[]::new)`.',
      use: 'a very common compile error when you rush a conversion in an interview.',
      tip: 'Primitive streams (IntStream) have no generic toArray. Box first, then ask for a typed array.',
    },
    r`int[] arr = {1, 2, 3};`,
  ),
  m(
    'sort-desc-int',
    'int[] and Integer[]',
    'Which approach sorts a primitive int[] in descending order?',
    'Sort ascending then reverse by swapping ends, or box to Integer[] and use Collections.reverseOrder()',
    [
      'Arrays.sort(arr, Collections.reverseOrder())',
      'Arrays.sort(arr, (a, b) -> b - a)',
      'Arrays.sort(arr, Comparator.reverseOrder())',
    ],
    {
      what: 'Comparators only work on object arrays. A primitive int[] has no `sort(arr, comparator)` overload, so all three comparator forms fail to compile.',
      older: 'sort ascending, then swap `arr[i]` with `arr[n - 1 - i]` for the first half.',
      modern:
        'box and sort with a comparator: `Integer[] b = Arrays.stream(arr).boxed().toArray(Integer[]::new); Arrays.sort(b, Collections.reverseOrder());`.',
      mutable:
        'the swap approach sorts in place. The boxed approach sorts a copy, so convert back with `mapToInt` if you need the int[].',
      use: 'top-k problems, greedy problems that process the largest first, and any time you want descending order from a primitive array.',
      tip: 'No comparators on primitives. Ascending then reverse, or box it.',
    },
  ),

  // ---------------------------------------------------------------- Arrays and Lists
  t(
    'arr-to-list',
    'Arrays and Lists',
    'Convert the int[] arr into a List<Integer> named list using a stream.',
    [
      r`List<Integer> list = Arrays.stream(arr).boxed().collect(Collectors.toList());`,
      r`List<Integer> list = Arrays.stream(arr).boxed().toList();`,
    ],
    {
      what: '`Arrays.stream(arr)` gives an IntStream, `.boxed()` wraps each int, and `.collect(Collectors.toList())` gathers them into a List<Integer>.',
      older:
        'create `new ArrayList<>()` and `add` each element in a for loop. Still perfectly fine and the easiest to get right.',
      modern:
        'the stream line (Java 8+). On Java 16+ you can end with `.boxed().toList()`, which is shorter.',
      mutable:
        '`Collectors.toList()` gives an ArrayList in practice (not guaranteed by the docs), so add and remove work. `.toList()` returns an unmodifiable list: add, remove and set all throw.',
      use: 'collections and generics need objects, so this appears whenever you feed an int[] to a List, a Set, a heap or a comparator.',
      tip: 'Stream it, box it, collect it. Need to edit afterwards? Wrap in `new ArrayList<>(...)` or use `Collectors.toList()`.',
    },
    r`int[] arr = {3, 1, 2};`,
  ),
  t(
    'list-to-arr',
    'Arrays and Lists',
    'Convert the List<Integer> list into a primitive int[] named arr.',
    [
      r`int[] arr = list.stream().mapToInt(Integer::intValue).toArray();`,
      r`int[] arr = list.stream().mapToInt(i -> i).toArray();`,
    ],
    {
      what: '`list.stream()` makes a Stream<Integer>, `.mapToInt(Integer::intValue)` unboxes each element into an IntStream, and `.toArray()` collects an int[].',
      older: 'allocate `new int[list.size()]` and fill it with `arr[i] = list.get(i)` in a loop.',
      modern: 'the stream line. `mapToInt(i -> i)` is the shortest form and is accepted too.',
      mutable:
        'the result is a new array that does not follow later changes to the list. There is no `list.toArray()` that returns an int[]: the built-in one only gives Object[] or Integer[].',
      use: 'the single most common conversion: build answers in a List, then return int[] as the method signature requires.',
      tip: 'Stream it, unbox to ints, make an array.',
    },
    r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
  ),
  m(
    'aslist-int-trap',
    'Arrays and Lists',
    'With int[] arr = {1, 2, 3}, what does Arrays.asList(arr).size() return?',
    '1: it is a List<int[]> holding the array as one element',
    ['3: one element per int', '0: primitives are skipped', 'It does not compile'],
    {
      what: '`Arrays.asList` takes a generic varargs `T...`, and T cannot be a primitive. An int[] is a single object, so T becomes int[] and you get a one-element List<int[]>.',
      older: 'loop and add each int, or use a stream with `boxed()`.',
      modern:
        'use `Arrays.stream(arr).boxed().toList()`. `Arrays.asList` is only for object arrays such as Integer[] or String[].',
      use: 'a classic interview trap. It compiles and runs, and then your list has the wrong size.',
      tip: 'asList on a primitive array wraps the whole array. Box first.',
    },
    r`int[] arr = {1, 2, 3};`,
  ),
  t(
    'objarr-to-list',
    'Arrays and Lists',
    'Make a resizable List<Integer> named list from the Integer[] boxed.',
    [
      r`List<Integer> list = new ArrayList<>(Arrays.asList(boxed));`,
      r`List<Integer> list = new ArrayList<>(List.of(boxed));`,
    ],
    {
      what: '`Arrays.asList(boxed)` is a view of the array, and wrapping it in `new ArrayList<>(...)` copies the elements into a normal list you can grow and shrink.',
      older: '`Arrays.asList(boxed)` alone, which is fixed size.',
      modern:
        '`List.of(boxed)` (Java 9+) is immutable and rejects null, so wrap it too if you need to edit.',
      mutable:
        'bare `Arrays.asList(boxed)`: fixed size, `set` works and writes through to the array, `add` and `remove` throw UnsupportedOperationException. The ArrayList wrapper is fully mutable and independent.',
      use: 'turning String[] or Integer[] input into something you can add to, remove from or sort.',
      tip: 'asList is a window onto the array. Wrap it in `new ArrayList<>` when you need your own copy.',
    },
    r`Integer[] boxed = {1, 2, 3};`,
  ),
  m(
    'aslist-fixed',
    'Arrays and Lists',
    'For List<Integer> v = Arrays.asList(boxed), which call throws UnsupportedOperationException?',
    'v.add(4)',
    ['v.set(0, 9)', 'Collections.sort(v)', 'v.get(0)'],
    {
      what: 'The list returned by `Arrays.asList` is backed by the array, so its size is fixed. Reading, `set` and sorting only rearrange existing slots and are allowed. `add` and `remove` change the size and throw.',
      mutable:
        '`set` and `sort` write through to the original array. Changing v[0] changes boxed[0], and the other way round.',
      use: 'a surprise in code like `Arrays.asList(...).add(...)`. Wrap in `new ArrayList<>(...)` first.',
      tip: 'asList: fixed size, but you can set and sort.',
    },
    r`Integer[] boxed = {3, 1, 2};`,
  ),
  m(
    'list-mutability',
    'Arrays and Lists',
    'Which list is fully mutable (add, remove, set)?',
    'new ArrayList<>(List.of(1, 2, 3))',
    [
      'List.of(1, 2, 3)',
      'Arrays.asList(1, 2, 3)',
      'Collections.unmodifiableList(new ArrayList<>(List.of(1, 2, 3)))',
    ],
    {
      what: '`List.of` is immutable (even `set` throws), `Arrays.asList` is fixed size, and `unmodifiableList` is a read-only wrapper. Only an ArrayList you construct yourself can grow and shrink.',
      older: '`Arrays.asList(1, 2, 3)` (Java 5+) for a quick fixed-size list.',
      modern:
        '`List.of(...)` (Java 9+) for a literal list, and `new ArrayList<>(List.of(...))` when you need to edit it.',
      mutable:
        'List.of: immutable and rejects null. Arrays.asList: fixed size, allows set. new ArrayList: fully mutable.',
      use: 'test data and seeds in challenges. Remember that mutation on a List.of result throws at runtime, not compile time.',
      tip: 'Literal list that you plan to change? Wrap it in `new ArrayList<>(...)`.',
    },
  ),
  m(
    'tolist-vs-collect',
    'Arrays and Lists',
    'Which stream ending returns an unmodifiable List?',
    'stream.toList() (Java 16+)',
    [
      'stream.collect(Collectors.toList())',
      'stream.collect(Collectors.toCollection(ArrayList::new))',
      'stream.collect(Collectors.toCollection(LinkedList::new))',
    ],
    {
      what: '`Stream.toList()` was added in Java 16 and returns an unmodifiable list that allows nulls. `Collectors.toList()` returns a mutable ArrayList in practice, and `toCollection(ArrayList::new)` guarantees one.',
      older: '`.collect(Collectors.toList())` (Java 8+).',
      modern: '`.toList()` is fewer characters and signals that the result is read-only.',
      mutable:
        'toList(): unmodifiable. Collectors.toList(): mutable in practice, not guaranteed. toCollection(ArrayList::new): guaranteed mutable.',
      use: 'if later code calls add or sort on the result, do not use `.toList()`.',
      tip: '`.toList()` is read-only. Need to edit it? Use `Collectors.toList()` or wrap it in `new ArrayList<>`.',
    },
  ),

  // ---------------------------------------------------------------- List to typed array
  t(
    'list-to-objarr',
    'List to typed array',
    'Convert the List<Integer> list into an Integer[] named boxed.',
    [
      r`Integer[] boxed = list.toArray(new Integer[0]);`,
      r`Integer[] boxed = list.toArray(Integer[]::new);`,
    ],
    {
      what: 'The array you pass only tells Java which type to build, and Java sizes the result for you. A bare `list.toArray()` would give an Object[], which is not an Integer[].',
      older:
        '`list.toArray(new Integer[0])`, the long-standing idiom (an empty array works fine and is the usual style).',
      modern:
        '`list.toArray(Integer[]::new)` (Java 11+) says the same thing with a constructor reference.',
      mutable:
        'the result is a new array copy, independent of the list. Later list changes do not show up in it.',
      use: 'you need an object array for a comparator sort, or an API takes `Integer[]`.',
      tip: 'List to typed array: pass an empty array of that type, or `Type[]::new`.',
    },
    r`List<Integer> list = new ArrayList<>(List.of(3, 1, 2));`,
  ),
  t(
    'strlist-to-strarr',
    'List to typed array',
    'Convert the List<String> strs into a String[] named sArr.',
    [
      r`String[] sArr = strs.toArray(new String[0]);`,
      r`String[] sArr = strs.toArray(String[]::new);`,
    ],
    {
      what: 'Same pattern as Integer[]: pass the array type and Java builds and sizes the array. Strings are immutable, so you can share the array without defensive copies of the values.',
      older: '`strs.toArray(new String[0])`.',
      modern: '`strs.toArray(String[]::new)` (Java 11+).',
      mutable: 'a new array, independent of the list. Each String inside is immutable.',
      use: 'returning String[] from a method (word problems, split results) or passing to varargs.',
      tip: 'The same trick works for any object type: `toArray(Type[]::new)`.',
    },
    r`List<String> strs = new ArrayList<>(List.of("a", "b"));`,
  ),
  t(
    'pairs-to-matrix',
    'List to typed array',
    'Convert the List<int[]> pairs into an int[][] named matrix.',
    [
      r`int[][] matrix = pairs.toArray(new int[0][]);`,
      r`int[][] matrix = pairs.toArray(int[][]::new);`,
    ],
    {
      what: 'A List<int[]> holds int[] objects, so it converts with the object-array form of toArray: the element type is int[], and the array type is int[][].',
      older: '`pairs.toArray(new int[0][])`.',
      modern: '`pairs.toArray(int[][]::new)` (Java 11+).',
      mutable:
        'the outer array is new, but the inner int[] rows are the same objects the list held. Changing a row shows up in both.',
      use: 'Merge Intervals, Insert Interval and any problem that returns int[][] after you collect rows in a list.',
      tip: 'List of arrays to 2D array: `toArray(new int[0][])`.',
    },
    r`List<int[]> pairs = new ArrayList<>();
pairs.add(new int[] {1, 2});`,
  ),
  t(
    'nested-to-matrix',
    'List to typed array',
    'Convert List<List<Integer>> lists into an int[][] named grid.',
    [
      r`int[][] grid = lists.stream().map(l -> l.stream().mapToInt(Integer::intValue).toArray()).toArray(int[][]::new);`,
      r`int[][] grid = lists.stream().map(l -> l.stream().mapToInt(i -> i).toArray()).toArray(int[][]::new);`,
    ],
    {
      what: 'Convert each inner list into an int[] with the usual `mapToInt(...).toArray()`, then collect those rows into an int[][] with `toArray(int[][]::new)`.',
      older: 'allocate `new int[lists.size()][]` and fill each row with a nested loop.',
      modern: 'the nested stream. Long, so practise typing it once.',
      mutable: 'a new matrix with copied values: independent of the lists.',
      use: 'permutation and combination problems return List<List<Integer>>, but some judges want a 2D array.',
      tip: 'Two layers: each inner list becomes an int[], then the rows become int[][].',
    },
    r`List<List<Integer>> lists = List.of(List.of(1, 2), List.of(3));`,
  ),
  t(
    'matrix-to-list',
    'List to typed array',
    'Make a resizable List<int[]> named rows from the int[][] matrix.',
    [
      r`List<int[]> rows = new ArrayList<>(Arrays.asList(matrix));`,
      r`List<int[]> rows = new ArrayList<>(List.of(matrix));`,
    ],
    {
      what: 'An int[][] is an array of int[] objects, so `Arrays.asList(matrix)` works here (unlike for int[]) and produces a List<int[]>. Wrap it in an ArrayList to make it resizable.',
      older: 'loop over the rows and `add` each one.',
      modern:
        'the one-line wrap. Sort rows with `rows.sort((a, b) -> a[0] - b[0])` or `Integer.compare`.',
      mutable:
        'the list is new but the rows are shared with the matrix, so changing a row changes both.',
      use: 'intervals: put the rows in a list so you can sort, merge and remove them.',
      tip: 'A 2D array is an array of objects, so asList works on it.',
    },
    r`int[][] matrix = {{1, 3}, {2, 6}};`,
  ),

  // ---------------------------------------------------------------- Copying
  t(
    'copy-array',
    'Copying and aliasing',
    'Make an independent copy of int[] arr named copy.',
    [r`int[] copy = arr.clone();`, r`int[] copy = Arrays.copyOf(arr, arr.length);`],
    {
      what: '`int[] copy = arr;` only copies the reference, so both names point at one array. `clone()` or `Arrays.copyOf` allocates a new array with the same values.',
      older: 'allocate a new array and copy in a loop, or `System.arraycopy`.',
      modern: '`arr.clone()` is the shortest. `Arrays.copyOfRange(arr, from, to)` copies a slice.',
      mutable:
        'arrays are always mutable. After the copy, changing one never affects the other for primitives.',
      use: 'backtracking and DP: snapshot a state before changing it, or return a result array without exposing your working array.',
      tip: 'Assignment shares, `clone()` copies.',
    },
    r`int[] arr = {1, 2, 3};`,
  ),
  t(
    'copy-grid',
    'Copying and aliasing',
    'Make a deep copy of int[][] grid named copy (every row copied).',
    [r`int[][] copy = Arrays.stream(grid).map(int[]::clone).toArray(int[][]::new);`],
    {
      what: '`grid.clone()` is shallow: the new outer array points at the same row arrays. Cloning each row creates a true copy.',
      older: 'allocate `new int[n][]` and `clone()` each row in a for loop.',
      modern: 'the stream: map each row with `int[]::clone`, then `toArray(int[][]::new)`.',
      mutable:
        'a deep copy is fully independent. A shallow copy still shares rows, so a write to `copy[0][0]` changes the original too.',
      use: 'matrix and board problems (game of life, N-Queens, flood fill): snapshot the grid before you mutate it.',
      tip: 'Shallow clone shares rows. Clone each row to go deep.',
    },
    r`int[][] grid = {{1, 2}, {3, 4}};`,
  ),
  m(
    'clone-shallow',
    'Copying and aliasing',
    'After int[][] copy = grid.clone(); copy[0][0] = 9; what happens to grid[0][0]?',
    'It also becomes 9: clone copies only the outer array, so rows are shared',
    [
      'It stays unchanged: clone is a deep copy',
      'It throws an exception because rows are read-only',
      'It becomes 0 because the copy resets the values',
    ],
    {
      what: '`clone()` on a 2D array creates a new outer array whose slots hold the same row objects as the original. A write through one name reaches the other.',
      modern: 'copy each row too: `Arrays.stream(grid).map(int[]::clone).toArray(int[][]::new)`.',
      mutable: 'rows are shared, so they are shared mutable state.',
      use: 'a frequent bug in backtracking over boards, where all saved states end up identical.',
      tip: 'clone is one level deep.',
    },
    r`int[][] grid = {{1, 2}, {3, 4}};`,
  ),

  // ---------------------------------------------------------------- Strings and chars
  t(
    'str-to-chars',
    'Strings and chars',
    'Convert the String s into a char[] named cs.',
    [r`char[] cs = s.toCharArray();`],
    {
      what: '`toCharArray()` returns a new char[] holding a copy of the characters. Strings are immutable, so this is how you get something you can sort, swap and edit.',
      older: 'loop with `s.charAt(i)` and fill an array yourself.',
      modern: '`s.toCharArray()` has been the standard since Java 1.',
      mutable:
        'the String is immutable: it can never change. The char[] is mutable and independent, so edits to it never change s.',
      use: 'in-place string problems, anagram keys, palindromes, reversing, two pointers on a string.',
      tip: 'Immutable String in, mutable char[] out: `toCharArray()`.',
    },
    r`String s = "hello";`,
  ),
  t(
    'chars-to-str',
    'Strings and chars',
    'Convert the char[] cs back into a String named back.',
    [r`String back = new String(cs);`, r`String back = String.valueOf(cs);`],
    {
      what: 'Both forms copy the characters into a new String. Use this after you sort or edit a char[].',
      older: '`new String(cs)`.',
      modern:
        '`String.valueOf(cs)` is equally good and reads naturally with other `valueOf` calls.',
      mutable:
        'the new String is immutable. Changing cs afterwards does not change the String, because it was copied.',
      use: 'anagram keys (`sort the chars, then new String`), reverse a string, apply an in-place edit and return the result.',
      tip: 'char[] to String: `new String(cs)`. Never `cs.toString()`: that prints a type and hash code.',
    },
    r`char[] cs = {'h', 'i'};`,
  ),
  m(
    'chararray-tostring',
    'Strings and chars',
    'What does cs.toString() return for a char[] cs?',
    'A type and hash such as [C@1b6d3586, not the characters',
    [
      'The characters, for example "hi"',
      'A comma separated list such as [h, i]',
      'It does not compile',
    ],
    {
      what: 'Arrays do not override `toString()`, so you get the default Object form. To get the text, build a String from the array.',
      older: '`new String(cs)`.',
      modern:
        '`String.valueOf(cs)`. For debugging an array of anything else, `Arrays.toString(arr)`.',
      use: 'printing a char[] in a coding challenge and getting `[C@...` in the output.',
      tip: '`toString()` on arrays is useless. Use `new String(cs)` or `Arrays.toString(arr)`.',
    },
    r`char[] cs = {'h', 'i'};`,
  ),
  t(
    'char-to-str',
    'Strings and chars',
    'Convert the char c into a String named one.',
    [
      r`String one = String.valueOf(c);`,
      r`String one = Character.toString(c);`,
      r`String one = "" + c;`,
    ],
    {
      what: 'A char is a primitive and a String is an object, so you wrap the char. `String.valueOf(c)` is the clearest, and `"" + c` is the shortest.',
      older: '`"" + c`, which still works and is common in quick code.',
      modern: '`String.valueOf(c)` or `Character.toString(c)`.',
      mutable: 'the String result is immutable.',
      use: 'building map keys, StringBuilder-free concatenation, and putting single characters into a List<String>.',
      tip: 'Wrap a char: `String.valueOf(c)`.',
    },
    r`char c = 'x';`,
  ),
  t(
    'sorted-key',
    'Strings and chars',
    'Build the anagram key sortedKey for String s: sort its characters, then turn them back into a String.',
    [
      r`char[] cs = s.toCharArray(); Arrays.sort(cs); String sortedKey = new String(cs);`,
      r`char[] cs = s.toCharArray(); Arrays.sort(cs); String sortedKey = String.valueOf(cs);`,
    ],
    {
      what: 'Anagrams share the same sorted characters, so the sorted String works as a HashMap key for grouping.',
      older: 'count letters into an int[26] and join the counts into a key. Faster, a bit longer.',
      modern: 'the three-step sort key. Always sort a copy: `toCharArray()` already is one.',
      mutable:
        'the char[] is mutable and is sorted in place. The String is immutable and is the stable key.',
      use: 'Group Anagrams, Valid Anagram and many string grouping problems.',
      tip: 'String to chars, sort, new String.',
    },
    r`String s = "tea";`,
  ),
  t(
    'reverse-str',
    'Strings and chars',
    'Reverse the String s into a String named rev.',
    [r`String rev = new StringBuilder(s).reverse().toString();`],
    {
      what: 'String has no `reverse()`. StringBuilder does: wrap the String, reverse in place, and convert back.',
      older:
        'loop from the end with `charAt` and append to a StringBuilder, or swap characters in a char[].',
      modern: 'the one-line `new StringBuilder(s).reverse().toString()`.',
      mutable:
        'StringBuilder is mutable and `reverse()` changes it in place. The String s is immutable and is untouched.',
      use: 'palindrome checks (`s.equals(rev)`), reverse words, and number reversal through strings.',
      tip: 'Reverse lives on StringBuilder, not String.',
    },
    r`String s = "abc";`,
  ),
  t(
    'str-to-charlist',
    'Strings and chars',
    'Convert the String s into a List<Character> named chars using a stream.',
    [
      r`List<Character> chars = s.chars().mapToObj(c -> (char) c).collect(Collectors.toList());`,
      r`List<Character> chars = s.chars().mapToObj(c -> (char) c).toList();`,
    ],
    {
      what: '`s.chars()` is an IntStream of character codes. `mapToObj(c -> (char) c)` casts each code to a char and boxes it as a Character, and `collect` builds the list.',
      older: 'loop over `s.toCharArray()` (or `charAt`) and `add` each character.',
      modern: 'the stream. The cast to `char` matters: without it you get a List<Integer>.',
      mutable:
        '`Collectors.toList()` gives a mutable list in practice. `.toList()` (Java 16+) is unmodifiable.',
      use: 'sort characters with a comparator, or shuffle and filter them with list methods.',
      tip: 'chars() gives ints. Cast to char in `mapToObj` to get Characters.',
    },
    r`String s = "abc";`,
  ),
  m(
    'no-char-stream',
    'Strings and chars',
    'Why is there no Arrays.stream(char[])?',
    'Java has no CharStream: use a loop, or new String(cs).chars() to get an IntStream of codes',
    [
      'char[] is not an array type',
      'It exists but is deprecated since Java 11',
      'chars are always boxed so Arrays.stream(Character[]) is the only form',
    ],
    {
      what: 'Streams exist for int, long, double and objects only. For a char[], either loop, or build a String and use its `chars()`.',
      older: 'a for-each loop over the char[].',
      modern: '`new String(cs).chars()` gives an IntStream you can map and sum.',
      use: 'counting or summing characters from a char[]. Loops are also faster for this.',
      tip: 'No CharStream. For chars, go through `String.chars()`.',
    },
    r`char[] cs = {'a', 'b'};`,
  ),

  // ---------------------------------------------------------------- Numbers, digits, letters
  t(
    'parse-int',
    'Numbers and text',
    'Convert the String s into an int named n.',
    [r`int n = Integer.parseInt(s);`],
    {
      what: '`Integer.parseInt` reads the text and returns a primitive int. It throws NumberFormatException if the text is not a valid integer, such as "12a" or an empty string.',
      older:
        '`Integer.valueOf(s)` returns an Integer object, which then unboxes. Slightly more work, same result.',
      modern:
        '`Integer.parseInt(s)`. Use `Long.parseLong` for long, and `Integer.parseInt(s, 2)` to read another base.',
      mutable: 'primitives are values, so nothing to mutate. The String is immutable.',
      use: 'parsing input, the integer in Evaluate Reverse Polish Notation, and splitting "12:30" style strings.',
      tip: 'Parse a primitive with `parseInt`. `valueOf` returns the boxed Integer.',
    },
    r`String s = "123";`,
  ),
  t(
    'int-to-str',
    'Numbers and text',
    'Convert the int n into a String named s.',
    [r`String s = String.valueOf(n);`, r`String s = Integer.toString(n);`, r`String s = "" + n;`],
    {
      what: 'All three build the decimal text for n. `String.valueOf` and `Integer.toString` are explicit, and `"" + n` is the shortest.',
      older: '`"" + n`, which is common in quick code.',
      modern: '`String.valueOf(n)`, which also works for char, long, double and objects.',
      mutable: 'the String is immutable.',
      use: 'digit manipulation, palindrome numbers, and building keys such as `i + "," + j`.',
      tip: 'Number to text: `String.valueOf(n)`.',
    },
    r`int n = 123;`,
  ),
  t(
    'digit-char',
    'Numbers and text',
    'Convert the digit character c into its int value named d.',
    [r`int d = c - '0';`, r`int d = Character.getNumericValue(c);`],
    {
      what: "Characters are numbers underneath, and the digits are consecutive: `'7' - '0'` is 55 - 48 = 7.",
      older: "`c - '0'`, the classic one that every Java developer reads at a glance.",
      modern:
        "`Character.getNumericValue(c)` is more descriptive, but `c - '0'` is shorter and faster.",
      use: 'Add Strings, Multiply Strings, parsing digits one at a time, and digit DP.',
      tip: "Digit char minus '0' gives the int.",
    },
    r`char c = '7';`,
  ),
  t(
    'int-digit-char',
    'Numbers and text',
    'Convert the int d (0 to 9) into its digit character named c.',
    [r`char c = (char) ('0' + d);`],
    {
      what: "`'0' + d` is int arithmetic, so it needs a cast back to char. Without the cast the line does not compile.",
      older: '`Character.forDigit(d, 10)` also works and handles other bases.',
      modern: "`(char) ('0' + d)`.",
      use: 'building number strings digit by digit (add big numbers, base conversion).',
      tip: "Int plus '0', then cast to char.",
    },
    r`int d = 7;`,
  ),
  t(
    'letter-index',
    'Numbers and text',
    'Convert the lowercase letter c into its index 0..25 named idx.',
    [r`int idx = c - 'a';`],
    {
      what: "Letters are consecutive, so subtracting `'a'` gives 0 for a and 25 for z. That is the index into an `int[26]` counting array.",
      older: 'a switch or a map from letter to index, which is slower and longer.',
      modern: "`c - 'a'`. For the other direction: `(char) ('a' + i)`.",
      use: 'counting letters with `int[26]`, anagrams, tries, and anything with lowercase input.',
      tip: "Letter minus 'a' gives the index. Add it back, then cast to char.",
    },
    r`char c = 'd';`,
  ),
  m(
    'char-arith-cast',
    'Numbers and text',
    "Why does `char next = 'a' + 1;` compile but `char next = 'a' + i;` (with int i) not?",
    "'a' + 1 is a constant that fits in a char; 'a' + i is int arithmetic and needs a (char) cast",
    [
      'char cannot hold the result of any addition',
      "'a' + i returns a String, not a number",
      'the compiler rejects variables on the right-hand side of a char',
    ],
    {
      what: "Arithmetic on chars is done in int. The compiler allows a narrowing assignment only for compile-time constants that fit. Once a variable is involved, you must cast: `(char) ('a' + i)`.",
      use: 'shifting letters (Caesar cipher, shifting strings) and generating letters from indexes.',
      tip: 'Variable arithmetic on chars gives an int: cast it back.',
    },
    r`int i = 1;`,
  ),
  t(
    'to-binary',
    'Numbers and text',
    'Convert the int n into its binary String named bin.',
    [r`String bin = Integer.toBinaryString(n);`, r`String bin = Integer.toString(n, 2);`],
    {
      what: '`Integer.toBinaryString` returns the bits without leading zeros. `Integer.toString(n, 2)` gives the same text for non-negative numbers and handles other bases such as 16. For negative numbers they differ: `toBinaryString` shows the 32-bit two-complement form, `toString(n, 2)` shows a minus sign.',
      older: 'divide by 2 in a loop and build the digits backwards.',
      modern: 'one call. Read binary back with `Integer.parseInt(bin, 2)`.',
      use: 'bit manipulation, Add Binary, Convert to Base 7 or Hex.',
      tip: 'Number to base 2: `toBinaryString`. Back: `parseInt(s, 2)`.',
    },
    r`int n = 10;`,
  ),
  m(
    'long-to-int',
    'Numbers and text',
    'Which way turns a long into an int and throws when the value does not fit?',
    'Math.toIntExact(x)',
    ['(int) x', 'Integer.valueOf(x)', 'x.intValue()'],
    {
      what: '`(int) x` silently keeps only the low 32 bits, so a big long can become a wrong or negative int. `Math.toIntExact` throws ArithmeticException instead.',
      older: 'compare with `Integer.MAX_VALUE` by hand before casting.',
      modern: '`Math.toIntExact(x)` makes overflow loud.',
      use: 'a wrong answer from a silent cast is hard to see. In modulo problems, reduce the range first: `(int) (x % MOD)`.',
      tip: 'Cast is silent, `toIntExact` is loud.',
    },
    r`long x = 5_000_000_000L;`,
  ),
  t(
    'widen-product',
    'Numbers and text',
    'Multiply the ints a and b without overflow into a long named prod.',
    [r`long prod = (long) a * b;`],
    {
      what: '`a * b` on two ints overflows before the result is widened. Casting one operand to long first makes the whole multiplication long.',
      older: '`long prod = (long) a * (long) b;`, which also works.',
      modern: '`(long) a * b`, and `1L * a * b` as a shortcut.',
      use: 'modular arithmetic, counting pairs, factorial and power problems where the product can exceed 2 billion.',
      tip: 'Widen before the multiply, not after.',
    },
    r`int a = 100000, b = 100000;`,
  ),
  m(
    'double-to-int',
    'Numbers and text',
    'What is (int) 3.9, and which call rounds to the nearest whole number?',
    '3 (truncates toward zero); Math.round(3.9) gives 4 as a long',
    [
      '4 (rounds up); Math.floor(3.9) gives 4',
      '3 (rounds down); Math.round(3.9) gives 3',
      '4 (rounds); Math.ceil(3.9) gives 3',
    ],
    {
      what: 'A cast to int truncates toward zero. `Math.round` returns a long, so you need `(int) Math.round(x)` to get an int. `Math.ceil` and `Math.floor` return doubles.',
      older: '`(int) (x + 0.5)` for non-negative values.',
      modern: '`(int) Math.round(x)`, `(int) Math.ceil(x)`, `(int) Math.floor(x)`.',
      use: 'rounding bugs in midpoint and percentage math. For ceiling division of ints, skip doubles and use `(a + b - 1) / b`.',
      tip: 'Cast truncates. `round` gives a long.',
    },
  ),
  m(
    'integer-equals',
    'Numbers and text',
    'With Integer a = 1000, b = 1000, what does a == b usually give, and what should you use?',
    'false, because it compares object references; use a.equals(b)',
    [
      'true, because both hold 1000',
      'false, because Integer cannot be compared with ==',
      'true for any value, because Integer is a primitive wrapper',
    ],
    {
      what: '`==` on two Integer objects compares references. Small values (-128 to 127) come from a cache and can compare equal, which hides the bug until a larger value appears.',
      older: 'unbox to compare: `a.intValue() == b.intValue()`.',
      modern: '`a.equals(b)`, or compare as primitives (`int x = a;`).',
      mutable: 'Integer objects are immutable.',
      use: 'a classic bug when comparing values taken from a `List<Integer>` or `Map<String, Integer>`.',
      tip: 'Boxed numbers: use `equals`, never `==`.',
    },
    r`Integer a = 1000, b = 1000;`,
  ),

  // ---------------------------------------------------------------- Splitting, joining, parsing input
  t(
    'split-words',
    'Split, join and parse',
    'Split the String s on any run of spaces into a String[] named words.',
    [r`String[] words = s.trim().split("\\s+");`],
    {
      what: '`split("\\\\s+")` splits on one or more whitespace characters. Trim first: leading whitespace would otherwise give an empty first element.',
      older: '`new StringTokenizer(s)`, which skips empty tokens, or a manual scan.',
      modern: '`s.trim().split("\\\\s+")`. In Java 11+, `s.strip()` handles Unicode whitespace.',
      mutable: 'the array is new and mutable. The Strings inside are immutable.',
      use: 'parsing input lines, Reverse Words in a String, and tokenising expressions.',
      tip: 'Trim, then split on `\\\\s+`.',
    },
    r`String s = "  a  b c ";`,
  ),
  t(
    'str-to-intarr',
    'Split, join and parse',
    'Parse the String s ("1 2 3") into an int[] named nums.',
    [r`int[] nums = Arrays.stream(s.trim().split("\\s+")).mapToInt(Integer::parseInt).toArray();`],
    {
      what: 'Split into a String[], stream it, parse each piece with `Integer::parseInt` (which also switches to an IntStream), and collect into an int[].',
      older: 'split, allocate an int[], and parse in a for loop with `Integer.parseInt(parts[i])`.',
      modern: 'the stream line. For comma-separated text use `split(",")`.',
      mutable: 'the result is a fresh, mutable array.',
      use: 'reading input from stdin, parsing "[1,2,3]" style strings after stripping brackets, and test harness code.',
      tip: 'Split, stream, `mapToInt(Integer::parseInt)`, `toArray`.',
    },
    r`String s = "1 2 3";`,
  ),
  t(
    'str-to-digits',
    'Split, join and parse',
    'Turn the String "2024" into an int[] of its digits named digits.',
    [r`int[] digits = "2024".chars().map(c -> c - '0').toArray();`],
    {
      what: '`"2024".chars()` is an IntStream of character codes, `map(c -> c - \'0\')` turns each code into its digit, and `toArray()` collects an int[] {2, 0, 2, 4}.',
      older: "loop over `charAt(i) - '0'` and fill an int[].",
      modern: 'the stream. No boxing is involved because the whole pipeline stays IntStream.',
      use: 'Plus One, Add Two Numbers, digit sums and big-number problems.',
      tip: "chars, minus '0', toArray.",
    },
  ),
  t(
    'join-strings',
    'Split, join and parse',
    'Join the List<String> words with a comma into a String named csv.',
    [r`String csv = String.join(",", words);`],
    {
      what: '`String.join(delimiter, iterable)` glues the strings together with the delimiter between them and nothing after the last one.',
      older: 'a StringBuilder in a loop, trimming the extra trailing comma.',
      modern: '`String.join(",", words)` (Java 8+). It accepts a List<String> or several Strings.',
      mutable: 'the result is an immutable String.',
      use: 'building output lines and serialising results.',
      tip: '`String.join(delimiter, list)`: no loop and no trailing comma.',
    },
    r`List<String> words = List.of("a", "b", "c");`,
  ),
  t(
    'join-ints',
    'Split, join and parse',
    'Join the int[] arr into a String named out with a space between numbers, using a stream.',
    [
      r`String out = Arrays.stream(arr).mapToObj(String::valueOf).collect(Collectors.joining(" "));`,
    ],
    {
      what: '`String.join` only takes strings, so convert each int with `mapToObj(String::valueOf)`, then `Collectors.joining(" ")` glues them together.',
      older: 'a StringBuilder loop with an if to skip the last space.',
      modern: 'the stream. For quick debugging, `Arrays.toString(arr)` prints `[1, 2, 3]`.',
      use: 'printing an answer array in the exact format a judge expects.',
      tip: 'Ints to text: `mapToObj(String::valueOf)`, then `joining`.',
    },
    r`int[] arr = {1, 2, 3};`,
  ),
  t(
    'rows-to-chargrid',
    'Split, join and parse',
    'Convert the String[] rows into a char[][] named grid.',
    [r`char[][] grid = Arrays.stream(rows).map(String::toCharArray).toArray(char[][]::new);`],
    {
      what: 'Map each String to its char[] with `String::toCharArray`, then collect into a char[][] with `toArray(char[][]::new)`.',
      older:
        'allocate `new char[rows.length][]` and set `grid[i] = rows[i].toCharArray()` in a loop.',
      modern: 'the stream line, which makes the grid in one expression.',
      mutable:
        'the grid is mutable, so you can flood-fill or mark visited cells in place. The input Strings are unaffected.',
      use: 'Number of Islands, Word Search and every grid problem where the board arrives as an array of strings.',
      tip: 'Each row String becomes a char[], then the rows become char[][].',
    },
    r`String[] rows = {"10", "01"};`,
  ),

  // ---------------------------------------------------------------- Sets, maps and heaps
  t(
    'list-to-set',
    'Sets, maps and heaps',
    'Create a HashSet named set from the List<Integer> list (remove duplicates).',
    [r`Set<Integer> set = new HashSet<>(list);`],
    {
      what: 'The HashSet constructor takes any collection and adds each element, so duplicates disappear.',
      older: 'loop and call `set.add(x)` for each element.',
      modern:
        'the constructor. Use `LinkedHashSet` to keep first-seen order and `TreeSet` for sorted order.',
      mutable: 'the set is a new mutable collection, independent of the list.',
      use: 'Contains Duplicate, Longest Consecutive Sequence, and fast "have I seen this" checks.',
      tip: 'Dedupe by constructing a set from the list.',
    },
    r`List<Integer> list = new ArrayList<>(List.of(1, 2, 2));`,
  ),
  m(
    'dedupe-keep-order',
    'Sets, maps and heaps',
    'Which dedupes a list and keeps the first-seen order?',
    'new ArrayList<>(new LinkedHashSet<>(list))',
    [
      'new ArrayList<>(new HashSet<>(list))',
      'new ArrayList<>(new TreeSet<>(list))',
      'list.stream().sorted().distinct().toList()',
    ],
    {
      what: 'HashSet gives no order guarantee, TreeSet sorts, and `sorted().distinct()` sorts too. `LinkedHashSet` remembers insertion order.',
      older: 'loop and check `contains` on a second list, which is O(n^2).',
      modern: '`list.stream().distinct().toList()` also keeps order (without `sorted()`).',
      mutable: 'the ArrayList wrapper is mutable. `.toList()` would be unmodifiable.',
      use: 'removing duplicates from output while keeping the order the problem expects.',
      tip: 'Need order too? Linked hash set.',
    },
    r`List<Integer> list = new ArrayList<>(List.of(3, 1, 3, 2));`,
  ),
  t(
    'set-to-list',
    'Sets, maps and heaps',
    'Create an ArrayList named list from the Set<Integer> set.',
    [r`List<Integer> list = new ArrayList<>(set);`],
    {
      what: 'The ArrayList constructor takes any collection and copies the elements in iteration order.',
      older: 'loop and `add` each element.',
      modern:
        'the constructor. Sort afterwards with `Collections.sort(list)` or `list.sort(null)`.',
      mutable: 'a new mutable list. Changing it does not change the set.',
      use: 'a set has no index or sort, so convert to a list when you need either.',
      tip: 'Set to list: pass it to the ArrayList constructor.',
    },
    r`Set<Integer> set = new HashSet<>(Set.of(3, 1, 2));`,
  ),
  t(
    'arr-to-set',
    'Sets, maps and heaps',
    'Convert the int[] arr into a Set<Integer> named set using a stream.',
    [r`Set<Integer> set = Arrays.stream(arr).boxed().collect(Collectors.toSet());`],
    {
      what: 'Stream the array, box each int, and collect into a set (a HashSet in practice).',
      older: 'loop over the array and call `set.add(x)`.',
      modern:
        'the stream line. For an Integer[] you can write `new HashSet<>(Arrays.asList(boxed))`.',
      mutable:
        '`Collectors.toSet()` returns a mutable HashSet in practice, though the docs do not promise it.',
      use: 'Contains Duplicate, Intersection of Two Arrays and Longest Consecutive Sequence.',
      tip: 'Stream, box, collect to a set.',
    },
    r`int[] arr = {1, 2, 2};`,
  ),
  t(
    'set-to-intarr',
    'Sets, maps and heaps',
    'Convert the Set<Integer> set into an int[] named arr.',
    [
      r`int[] arr = set.stream().mapToInt(Integer::intValue).toArray();`,
      r`int[] arr = set.stream().mapToInt(i -> i).toArray();`,
    ],
    {
      what: 'A set has no `toArray` that gives an int[], so stream it and unbox with `mapToInt`, the same pattern as for a list.',
      older: 'allocate an int[] and fill it with a counter while iterating.',
      modern:
        'the stream. HashSet order is unspecified, so sort afterwards if the output order matters.',
      use: 'Intersection of Two Arrays asks for an int[] result after you built a set.',
      tip: 'Any collection to int[]: stream, `mapToInt`, `toArray`.',
    },
    r`Set<Integer> set = new HashSet<>(Set.of(3, 1, 2));`,
  ),
  m(
    'set-of-duplicates',
    'Sets, maps and heaps',
    'What does Set.of(1, 2, 2) do?',
    'Throws IllegalArgumentException: Set.of rejects duplicates, and the set is immutable',
    [
      'Returns a set of {1, 2}, ignoring the duplicate',
      'Returns a set of {1, 2, 2}',
      'Returns a mutable HashSet of {1, 2}',
    ],
    {
      what: '`Set.of` is a literal factory (Java 9+). It throws on duplicates and on null, and the set it returns cannot be modified.',
      older: '`new HashSet<>(Arrays.asList(1, 2, 2))` quietly drops duplicates.',
      modern: '`Set.copyOf(list)` is fine with duplicates (it dedupes) and is immutable too.',
      mutable: 'immutable: add and remove throw.',
      use: 'turning input into a set with `Set.of(array)` breaks on repeated values. Use the HashSet constructor.',
      tip: 'Factory `of` methods are strict and immutable.',
    },
  ),
  t(
    'keys-to-list',
    'Sets, maps and heaps',
    'Create a List<String> named keys from the keys of Map<String, Integer> map.',
    [r`List<String> keys = new ArrayList<>(map.keySet());`],
    {
      what: '`map.keySet()` is a live view of the keys, and the ArrayList constructor copies them into an independent list.',
      older: 'loop over `map.keySet()` and add each key.',
      modern: 'the constructor. The same works for `map.values()` and `map.entrySet()`.',
      mutable:
        'the keySet view changes when the map changes, and removing from it removes from the map. The ArrayList copy is independent.',
      use: 'sort keys, or sort entries by value: `new ArrayList<>(map.entrySet())` then `sort(...)`. Used in Top K Frequent Elements.',
      tip: 'Views are live. Wrap in `new ArrayList<>` to take a snapshot you can sort.',
    },
    r`Map<String, Integer> map = new HashMap<>(Map.of("a", 1, "b", 2));`,
  ),
  t(
    'entries-to-list',
    'Sets, maps and heaps',
    'Create a List<Map.Entry<String, Integer>> named es from the entries of Map<String, Integer> map.',
    [r`List<Map.Entry<String, Integer>> es = new ArrayList<>(map.entrySet());`],
    {
      what: 'Copy the entry set into a list so you can sort by value with a comparator.',
      older: 'loop over `entrySet()` and add each entry.',
      modern:
        'the constructor, then `es.sort(Map.Entry.comparingByValue())` or `Map.Entry.<String, Integer>comparingByValue().reversed()`.',
      mutable:
        'the list is a new, mutable container, but each entry still points into the map unless you copy it.',
      use: 'sort a map by value for Top K Frequent Words or word-frequency problems.',
      tip: 'Maps cannot be sorted. Copy the entries into a list and sort that.',
    },
    r`Map<String, Integer> map = new HashMap<>(Map.of("a", 1, "b", 2));`,
  ),
  t(
    'list-to-pq',
    'Sets, maps and heaps',
    'Build a PriorityQueue named pq from the List<Integer> list in one call.',
    [r`PriorityQueue<Integer> pq = new PriorityQueue<>(list);`],
    {
      what: 'The PriorityQueue constructor accepts a collection and heapifies it in O(n), which is faster than adding n elements one by one at O(n log n).',
      older: 'create an empty queue and call `pq.add(x)` for every element.',
      modern:
        'the constructor. Add `Collections.reverseOrder()` as a comparator to get a max-heap.',
      mutable: 'the queue is a new mutable structure, independent of the list.',
      use: 'Kth Largest Element, Merge k Lists and any problem that starts from existing data.',
      tip: 'Collection into the constructor: heapify in O(n).',
    },
    r`List<Integer> list = new ArrayList<>(List.of(5, 1, 3));`,
  ),
  t(
    'list-to-deque',
    'Sets, maps and heaps',
    'Create an ArrayDeque named dq from the List<Integer> list.',
    [r`Deque<Integer> dq = new ArrayDeque<>(list);`],
    {
      what: 'ArrayDeque has a constructor that takes a collection. The first list element becomes the head.',
      older: '`new LinkedList<>(list)`, which also works but is slower and uses more memory.',
      modern: '`new ArrayDeque<>(list)`: the preferred stack and queue in interviews.',
      mutable: 'a new mutable deque, independent of the list. ArrayDeque rejects null elements.',
      use: 'BFS queues and monotonic stacks that start from existing data.',
      tip: 'Collections can seed other collections through the constructor.',
    },
    r`List<Integer> list = new ArrayList<>(List.of(1, 2, 3));`,
  ),
  t(
    'range-to-array',
    'Sets, maps and heaps',
    'Create the int[] idx = {0, 1, 2, 3, 4} (indexes 0 to n-1) using a stream.',
    [r`int[] idx = IntStream.range(0, n).toArray();`],
    {
      what: '`IntStream.range(0, n)` produces 0 to n-1 with the end exclusive, and `rangeClosed(0, n)` includes n. `toArray()` collects an int[].',
      older: 'allocate an array and fill it with a for loop.',
      modern:
        'the one-liner. Add `.boxed().toArray(Integer[]::new)` when you need an Integer[] to sort indexes by value.',
      use: 'argsort (sort indexes by value), sort Integer indexes with a comparator, and Two Sum indexes.',
      tip: 'Range is end-exclusive, like `substring`.',
    },
    r`int n = 5;`,
  ),
  t(
    'sum-long',
    'Sets, maps and heaps',
    'Sum int[] arr into a long named total without overflow, using a stream.',
    [
      r`long total = Arrays.stream(arr).asLongStream().sum();`,
      r`long total = Arrays.stream(arr).mapToLong(x -> x).sum();`,
    ],
    {
      what: '`IntStream.sum()` adds as int and can overflow. Converting to a LongStream first makes the addition long.',
      older: 'a for loop with `long total = 0; total += x;`.',
      modern: '`asLongStream().sum()` or `mapToLong(x -> x).sum()`.',
      use: 'sum of large values or lots of elements, and prefix sums that might pass 2 billion.',
      tip: 'Sum as int overflows. Go long first.',
    },
    r`int[] arr = {2_000_000_000, 2_000_000_000};`,
  ),
];

export const conversionsQuiz: Quiz = {
  slug: 'conversions',
  title: 'Java Conversions',
  description:
    'Convert between the structures you need in coding challenges: int[] and Integer[], arrays and lists, lists and sets, strings and chars, numbers and text. Each answer covers the older and modern way, mutability and a memory tip.',
  source: {
    label: 'Conversions table (cheat sheet)',
    href: '/resources/ds-algorithms-cheat-sheet.html#syntax--conversions-input-to-the-structure-you-need',
  },
  /** Ordered by importance: random rounds of N take the first N. */
  questions: rankQuestions(authored, conversionsPriority),
};
