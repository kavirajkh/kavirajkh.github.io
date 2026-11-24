import type { Explanation } from './syntax-explanations-types';

export const sbExplanations: Record<string, Explanation> = {
  'sb-1': {
    explain:
      'A StringBuilder is a mutable text buffer. It lets you build a string piece by piece in O(n) total, unlike repeated `+=` on a String, which copies everything each time (O(n²)).',
    remember: 'Building text in a loop? Use `StringBuilder`.',
  },
  'sb-2': {
    explain:
      '`append` returns the builder itself, so calls can be chained. This adds "ab" and then the char c, in order. It has versions for String, char, int and more.',
    remember: 'append returns itself, so chain it.',
  },
  'sb-3': {
    explain:
      '`sb.length() - 1` is the index of the last character, and `deleteCharAt` removes it. In backtracking, you append a choice, recurse, then do this to undo it.\n`sb.setLength(sb.length() - 1)` does the same.',
    remember: 'Backtracking with text: append, recurse, `deleteCharAt(length - 1)`.',
  },
  'sb-4': {
    explain:
      '`sb.reverse()` flips the characters in place and returns the builder. It is the quickest way to reverse a string.',
    remember: 'Reverse a String: put it in a StringBuilder, `reverse()`, `toString()`.',
  },
  'sb-5': {
    explain:
      '`sb.toString()` creates a normal immutable String from the builder. It copies the characters, so call it once at the end, not in a loop.',
    remember: 'Done building? `toString()`.',
  },
  'sb-6': {
    explain:
      '`sb.insert(0, c)` places c at index 0 and moves the rest right. The first argument is the position, the second is the value. Inserting at the front is O(n), so use it sparingly.',
    remember: 'insert: position first, then the value.',
  },
  'sb-7': {
    explain:
      '`sb.setCharAt(2, c)` overwrites the character at index 2. A StringBuilder is the easy way to change one character of a string, which a String cannot do.',
    remember: 'Replace one char: `setCharAt(index, char)`.',
  },
  'sb-8': {
    explain:
      '`sb.length()` returns how many characters are in the builder. It is a method call with parentheses, like String.',
    remember: 'StringBuilder length is a method, like String.',
  },
  'sb-9': {
    explain:
      '`sb.charAt(0)` reads the first character without converting to a String. It works exactly like `String.charAt`.',
    remember: 'Same read method as String.',
  },
  'sb-10': {
    explain:
      '`sb.deleteCharAt(i)` removes the single character at index i and shifts the rest left. For a range, use `sb.delete(start, end)` with an exclusive end.',
    remember: 'One char: `deleteCharAt`. A range: `delete(start, end)`.',
  },
  'sb-11': {
    explain:
      'A palindrome reads the same backward.\n- `new StringBuilder(s)` wraps s in a builder.\n- `.reverse()` flips it.\n- `.toString()` turns it back into a String.\n- `.equals(s)` compares with the original.\nThe two-pointer loop uses less memory, but this is short and clear.',
    remember: 'Palindrome check: reverse and compare.',
  },
};

export const treeExplanations: Record<string, Explanation> = {
  'tree-1': {
    explain:
      '`tm.floorKey(25)` returns the greatest key that is less than or equal to 25, or null when none exists. It runs in O(log n) because a TreeMap is a balanced tree.\nThe result is `Integer` because it can be null.',
    remember: 'Floor = at or below. Ceiling = at or above.',
  },
  'tree-2': {
    explain:
      '`tm.ceilingKey(25)` returns the smallest key that is greater than or equal to 25, or null if there is none. O(log n).',
    remember: 'Ceiling = at or above.',
  },
  'tree-3': {
    explain:
      '`tm.pollFirstEntry()` removes the entry with the smallest key and returns it (or null if empty). The `Map.Entry` has the key and value you can read with `getKey()` and `getValue()`.',
    remember: 'poll = remove and return. First = smallest.',
  },
  'tree-4': {
    explain:
      '`tm.firstKey()` returns the smallest key in O(log n). It throws NoSuchElementException when the map is empty, so check `isEmpty()` first or use `firstEntry()`, which returns null.',
    remember: 'First = smallest, last = largest.',
  },
  'tree-5': {
    explain: '`tm.lastKey()` returns the largest key. It throws if the map is empty.',
    remember: 'Last = largest.',
  },
  'tree-6': {
    explain:
      '`tm.higherKey(25)` returns the smallest key strictly greater than 25. Compare with `ceilingKey`, which allows equal.',
    remember: 'Higher/lower are strict. Ceiling/floor allow equal.',
  },
  'tree-7': {
    explain:
      '`tm.lowerKey(25)` returns the largest key strictly less than 25, or null. Compare with `floorKey`, which allows equal.',
    remember: 'Strictly smaller: `lowerKey`.',
  },
  'tree-8': {
    explain:
      '`ts.floor(25)` returns the greatest element at or below 25, or null. It is the TreeSet version of `floorKey` and runs in O(log n).',
    remember: 'TreeSet uses plain names: `floor`, `ceiling`, `higher`, `lower`.',
  },
  'tree-9': {
    explain: '`ts.ceiling(25)` returns the smallest element at or above 25, or null.',
    remember: 'Ceiling = at or above.',
  },
  'tree-10': {
    explain:
      '`ts.pollFirst()` removes and returns the smallest element, or null if the set is empty. Unboxing a null into `int` would throw, so use `Integer` when the set may be empty.',
    remember: 'poll = remove and return. `pollLast` is the largest.',
  },
};

export const convExplanations: Record<string, Explanation> = {
  'conv-1': {
    explain:
      'This adds up an int array.\n- `Arrays.stream(arr)` makes an IntStream.\n- `.sum()` adds the elements and returns an int.\nIntStream has `sum` built in, so no boxing is needed.',
    remember: 'Stream the array, then `sum()`.',
  },
  'conv-2': {
    explain:
      '`max()` on an IntStream returns an `OptionalInt`, because the array might be empty. `getAsInt()` takes the value out. It throws if the stream was empty.',
    remember: 'Max returns an Optional, so finish with `getAsInt()`.',
  },
  'conv-3': {
    explain:
      'This line converts a primitive `int[]` into a `List<Integer>`.\n- `Arrays.stream(arr)` turns the array into an IntStream, a stream specialized for primitive int values.\n- `.boxed()` wraps each int in an Integer object, which turns the IntStream into a `Stream<Integer>`. This step is needed because Java collections like List can only hold objects, not primitives. Wrapping a primitive in its object class is called boxing.\n- `.collect(Collectors.toList())` gathers the stream elements into a `List<Integer>`. In practice you get an ArrayList, so you can add or remove elements, though the documentation does not officially promise that.',
    remember:
      'Stop memorizing it as one line and remember the story instead. Each step solves one problem. Ask yourself three questions:\n- "How do I get a stream from an array?" gives `Arrays.stream(arr)`.\n- "Lists cannot hold primitives. How do I turn int into Integer?" gives `.boxed()`.\n- "How do I put the stream into a list?" gives `.collect(Collectors.toList())`.',
  },
  'conv-4': {
    explain:
      'This is the reverse trip, from `List<Integer>` to `int[]`.\n- `list.stream()` makes a Stream<Integer>.\n- `.mapToInt(Integer::intValue)` unboxes each Integer into a primitive int, turning it into an IntStream.\n- `.toArray()` collects the IntStream into an `int[]`.',
    remember:
      'Story: "stream it, unbox to ints, make an array". Boxed goes `boxed()`, unboxed goes `mapToInt`.',
  },
  'conv-5': {
    explain:
      '`strs.toArray(new String[0])` copies the list into a String array. The empty array only tells Java which array type to build; it is resized to fit automatically.\nA bare `toArray()` would give an `Object[]`, which is not what you want.',
    remember: 'List to typed array: pass an empty array of that type.',
  },
  'conv-6': {
    explain:
      '`new String(cs)` creates a String from the characters of the array. `String.valueOf(cs)` does the same thing. Use this after you edit or sort a `char[]`.',
    remember: 'char[] back to String: `new String(cs)`.',
  },
  'conv-7': {
    explain:
      'This turns a digit string into an array of digits.\n- `"2024".chars()` makes an IntStream of the character codes.\n- `.map(c -> c - \'0\')` converts each character code into its digit value.\n- `.toArray()` collects them into an `int[]`.',
    remember: "chars, minus '0', toArray.",
  },
  'conv-8': {
    explain:
      'The HashSet constructor copies a collection and keeps only unique values. Here {1, 2, 2} becomes the set {1, 2}.',
    remember: 'Dedupe = `new HashSet<>(list)`.',
  },
  'conv-9': {
    explain:
      'A class that implements `Comparable<Node>` must define `compareTo`. Returning `Integer.compare(dist, o.dist)` orders nodes by distance, smallest first.\nThat natural ordering lets a `PriorityQueue<Node>` work without a separate comparator, as in Dijkstra.',
    remember:
      'compareTo returns negative, zero or positive: "this compared with other". Use `Integer.compare`.',
  },
  'conv-10': {
    explain:
      '`IntStream.range(0, n)` produces 0, 1, ... n-1 (end exclusive). `.toArray()` collects it into an int array. `rangeClosed` includes the end.',
    remember: 'range = end exclusive, rangeClosed = end inclusive.',
  },
  'conv-11': {
    explain:
      '`Collectors.toSet()` gathers stream elements into a Set. It does the same as `new HashSet<>(list)`, which is shorter when you are not already in a stream.',
    remember: 'Either collector or constructor: both dedupe.',
  },
  'conv-12': {
    explain:
      'A `Stream<Integer>` has no `sum`. `mapToInt(Integer::intValue)` converts it into an IntStream of primitives, and `sum()` adds them.',
    remember: 'Object stream to numbers: `mapToInt`, then `sum`.',
  },
  'conv-13': {
    explain:
      '`map(Integer::parseInt)` applies parseInt to every string, producing a Stream<Integer>. `collect(Collectors.toList())` gathers the results. On Java 16+ you can end with `.toList()` instead.',
    remember: 'Transform with `map`, finish with `collect`.',
  },
  'conv-14': {
    explain:
      '`filter(x -> x > 2)` keeps the elements that pass the test and `count()` returns how many are left. `count` returns a `long`, which is why the variable is `long`.',
    remember: 'filter, then count (a long).',
  },
  'conv-15': {
    explain:
      '`map.keySet()` is a view of the keys. Passing it to the ArrayList constructor copies the keys into a real list that you can sort or index.',
    remember: 'Any collection into a list: `new ArrayList<>(collection)`.',
  },
  'conv-16': {
    explain:
      '`boxed()` turns an IntStream into a Stream<Integer>. `toArray(Integer[]::new)` builds an `Integer[]`, and the `Integer[]::new` part tells Java what array to create. You need `Integer[]` when you want to sort with a comparator.',
    remember: 'Boxed array: stream, `boxed()`, `toArray(Integer[]::new)`.',
  },
  'conv-17': {
    explain:
      '`Collections.frequency(list, x)` counts how many elements equal x. It scans the list, so it is O(n). Use a HashMap if you need many counts.',
    remember: 'Count one value: `Collections.frequency`.',
  },
  'conv-18': {
    explain:
      'The String constructor accepts a `char[]` and copies it. `String.valueOf(cs)` is the equivalent static version.',
    remember: 'char[] to String: constructor or `valueOf`.',
  },
  'conv-19': {
    explain:
      '`Integer.toString(n)` returns the decimal text of an int, "42" here. `String.valueOf(n)` gives the same result.',
    remember: 'int to text: `Integer.toString`.',
  },
  'conv-20': {
    explain:
      '`"0".repeat(n)` repeats the string n times, giving "000" for n = 3. Available since Java 11.',
    remember: 'Repeat a string: `str.repeat(n)`.',
  },
};

export const nodeExplanations: Record<string, Explanation> = {
  'node-1': {
    explain:
      'A dummy head is a fake node placed before the real list. It removes the special case "what if the head changes?": every real node now has a predecessor.\nThe 0 is a throwaway value. You return `dummy.next` at the end.',
    remember: 'Merging, deleting or inserting at the head? Create a dummy first.',
  },
  'node-2': {
    explain:
      '`cur` is a moving pointer, the tail of the list you are building. You attach new nodes to `cur.next` and advance it. The `dummy` variable stays put so you can find the start later.',
    remember: 'Dummy stays, cur moves.',
  },
  'node-3': {
    explain:
      'This loop visits every node. When `cur` becomes null you have walked past the last node, so the loop stops. Check `cur` before reading `cur.next` or `cur.val`.',
    remember: 'Walk until null: `while (cur != null)`.',
  },
  'node-4': {
    explain:
      '`cur = cur.next` moves the pointer one node forward. Forgetting it creates an infinite loop.',
    remember: 'The step of every list loop: `cur = cur.next`.',
  },
  'node-5': {
    explain:
      'The dummy node sits in front of the list you built, so the real head is `dummy.next`. Returning `dummy` itself would include the fake node.',
    remember: 'Return the node after the dummy.',
  },
  'node-6': {
    explain:
      'The fast pointer moves two steps per loop, the slow pointer one. The condition makes sure fast and the node after it both exist before you jump two steps.\nWhen fast reaches the end, slow is at the middle. If fast ever meets slow, there is a cycle.',
    remember: 'Check fast, then fast.next: "fast and fast-next not null".',
  },
  'node-7': {
    explain:
      'To reverse a link without losing the rest of the list:\n- `nxt = cur.next` saves the next node first.\n- `cur.next = prev` points the current node backward.\nThen you move prev to cur and cur to nxt. Saving before overwriting is the key.',
    remember: 'Save next, flip pointer, then step: "save, flip, move".',
  },
  'node-8': {
    explain:
      'Every recursive tree function starts with the base case. An empty subtree (null) contributes 0, so the recursion stops and the sum or depth builds up from there.',
    remember: 'Null node means stop. Return 0 for counts and depths, null for tree builders.',
  },
  'node-9': {
    explain:
      'The depth of a tree is 1 for the current node plus the deeper of its two subtrees.\n- `maxDepth(root.left)` and `maxDepth(root.right)` ask each child.\n- `Math.max` picks the larger.\nThis is a post-order idea: answer the children first, then combine.',
    remember: '"1 plus the max of left and right."',
  },
  'node-10': {
    explain:
      'Iterative inorder keeps going while there is either a node to dive into or a node waiting on the stack.\n- `cur != null` means keep going left.\n- `!stack.isEmpty()` means pop and visit a waiting node.\nBoth conditions false means every node has been visited.',
    remember: 'Either cur is alive or the stack is non-empty.',
  },
  'node-11': {
    explain:
      'In Union-Find every node starts as its own set, so its parent is itself. The loop sets `parent[i] = i` for every i.\nThe array is later updated as sets are merged.',
    remember: 'Everyone starts as their own boss: `parent[i] = i`.',
  },
  'node-12': {
    explain:
      '`find` returns the root of the set that x belongs to.\n- If `parent[x] != x`, x is not the root, so ask its parent.\n- Writing the answer back into `parent[x]` is path compression: it flattens the tree so later finds are nearly O(1).\n- A root is its own parent, so it just returns.',
    remember: 'Find with compression: "ask upward and remember the answer".',
  },
  'node-13': {
    explain:
      'A Trie node has one child slot per letter. Index `c - \'a\'` picks the slot, and a null slot means that letter does not continue from here. Add a boolean flag for "a word ends here".',
    remember: '26 children for lowercase letters.',
  },
};
