import type { Explanation } from './syntax-explanations-types';

export const mapExplanations: Record<string, Explanation> = {
  'map-1': {
    explain:
      'This creates an empty map from String keys to Integer values.\n- The variable type is the interface `Map`, so you can swap implementations later.\n- `new HashMap<>()` is the implementation. The empty `<>` lets Java infer the types.\nHashMap gives O(1) average get and put, and does not keep any order.',
    remember: 'Interface on the left, implementation on the right: "Map = new HashMap".',
  },
  'map-2': {
    explain:
      'This counts occurrences in one call.\n- `merge("a", 1, Integer::sum)` puts 1 if "a" is missing.\n- If "a" already has a value, it calls `Integer.sum(oldValue, 1)` and stores the result.\nIt replaces the longer "get, add one, put" dance.',
    remember: 'merge = "key, starting value, how to combine": `map.merge(key, 1, Integer::sum)`.',
  },
  'map-3': {
    explain:
      '`getOrDefault("z", 0)` returns the stored value when the key exists, and 0 when it does not. Plain `get` would return null, and unboxing that null into an `int` would throw a NullPointerException.\nIt does not add the key to the map.',
    remember: 'Safe read: "get, or else this default".',
  },
  'map-4': {
    explain:
      '`putIfAbsent("b", 5)` stores 5 only when there is no value for "b" yet. An existing value stays untouched. It returns the old value (or null), which you can ignore.\nUse it for "first one wins" logic.',
    remember: 'Put, but only if absent: the name says it.',
  },
  'map-5': {
    explain:
      '`map.entrySet()` gives the key-value pairs as a set of `Map.Entry` objects. The loop takes one pair at a time as e. Then `e.getKey()` and `e.getValue()` read the parts.\nIt is faster than looping over keys and calling `get` for each.',
    remember: '"Entry set, one entry at a time": `for (Map.Entry<K, V> e : map.entrySet())`.',
  },
  'map-6': {
    explain:
      'Removing from a map while looping over it throws ConcurrentModificationException. `removeIf` on the entry set removes safely in one pass.\n- `e -> e.getValue() == 0` is the condition: remove entries whose value is 0.\nThe removal passes through to the map itself.',
    remember:
      'Delete while looping = `entrySet().removeIf(...)`, never `remove` inside a for-each.',
  },
  'map-7': {
    explain:
      'This builds a "key to list" map in one statement.\n- `computeIfAbsent(1, k -> new ArrayList<>())` returns the existing list for key 1, or creates, stores and returns a new one.\n- `.add(7)` then adds to whichever list came back.\nIt is the standard way to build adjacency lists and group-by results.',
    remember: '"Compute if absent, then add": one chain, no null check needed.',
  },
  'map-8': {
    explain:
      '`map.containsKey("a")` is true when the key is present, even if its value is null. It runs in O(1) on average. Use it when you care only about existence, not the value.',
    remember: 'Keys are asked with `containsKey`; values with `containsValue` (which is O(n)).',
  },
  'map-9': {
    explain:
      'The classic counting pattern.\n- `map.getOrDefault(c, 0)` reads the current count, 0 if new.\n- `+ 1` increments it.\n- `map.put(c, ...)` writes it back.\nIt works on any Java version and everyone will recognize it.',
    remember: 'Read with default, add one, put back: "get-or-default plus one".',
  },
  'map-10': {
    explain:
      '`merge(c, 1, Integer::sum)` does the whole counting update in one call: it inserts 1 for a new key, or adds 1 to the existing value. It is shorter than the getOrDefault form and does exactly the same job.',
    remember: 'merge = key, value to add, combine function.',
  },
  'map-11': {
    explain:
      "`map.keySet()` is a view of all the keys. The for-each visits each key once, in the map's own iteration order (random for HashMap).\nIf you need the values as well, use the entry set instead of calling `get` inside the loop.",
    remember: 'Keys: `keySet()`.',
  },
  'map-12': {
    explain:
      '`map.values()` is a collection of every value, without their keys. Use it when you only need the numbers, such as summing counts or finding the maximum.',
    remember: 'Values: `values()`. No keys come with them.',
  },
  'map-13': {
    explain:
      'A `Map.Entry` is one key-value pair. `getKey()` returns the key and `getValue()` returns the value. They are plain getter calls, not fields.',
    remember: 'Entry = a pair: `getKey`, `getValue`.',
  },
  'map-14': {
    explain:
      '`map.remove(5)` deletes the entry whose key is 5 and returns the old value (or null if it was missing). Nothing happens if the key is absent.',
    remember: 'Map remove takes the key. (List remove takes an index, or an object.)',
  },
  'map-15': {
    explain:
      'A LinkedHashMap behaves like a HashMap, but it remembers the order in which keys were inserted, so iteration follows that order.\nIt is useful for "first non-repeating character" and when you need predictable output.',
    remember: 'Linked = remembers order. `LinkedHashMap` = HashMap + insertion order.',
  },
  'map-16': {
    explain:
      'This groups words that share the same key, such as anagrams.\n- `computeIfAbsent(key, k -> new ArrayList<>())` gets or creates the group list for this key.\n- `.add(w)` puts the word in it.\nAfterwards `groups.values()` holds all the groups.',
    remember: 'Same pattern as the adjacency list: "compute if absent, then add".',
  },
  'map-17': {
    explain:
      '`groups.values()` is a view of every list. Passing it to `new ArrayList<>(...)` copies them into a real List<List<String>>, which is what Group Anagrams-style problems want to return.',
    remember: 'Collection to list: wrap it in `new ArrayList<>(collection)`.',
  },
  'map-18': {
    explain:
      'This is an LRU cache built from LinkedHashMap.\n- `new LinkedHashMap<>(3, 0.75f, true)`: capacity 3, load factor 0.75, and `true` for access order, so every get moves that entry to the end.\n- The anonymous subclass overrides `removeEldestEntry` and returns true when size is more than 3, so the least recently used entry is dropped automatically.\nGreat for the LRU Cache problem when libraries are allowed.',
    remember:
      'Three ingredients: access order `true`, override `removeEldestEntry`, return `size() > capacity`.',
  },
};

export const setExplanations: Record<string, Explanation> = {
  'set-1': {
    explain:
      'This creates an empty set of Integers. A Set keeps only unique values. `HashSet` gives O(1) average add, remove and contains, with no ordering.',
    remember: 'Same shape as the map: interface on the left, `new HashSet<>()` on the right.',
  },
  'set-2': {
    explain:
      '`set.add(3)` inserts 3 and returns a boolean: true if the value was new, false if it was already in the set. That return value is handy for duplicate detection in one step.',
    remember: '"Add tells you if it was new." `if (!seen.add(x))` means duplicate found.',
  },
  'set-3': {
    explain:
      'Passing a collection to the HashSet constructor copies its elements and drops the duplicates. `List.of(1, 2, 2)` has three elements, the set ends up with two: 1 and 2.',
    remember: 'Dedupe a list: `new HashSet<>(list)`.',
  },
  'set-4': {
    explain:
      '`Set.of(...)` creates a fixed, read-only set. It is a compact way to write a lookup table of vowels. Adding to it throws an exception, and so does listing a duplicate value.\nAfter that, `vowels.contains(c)` replaces a long chain of `||` tests.',
    remember: '`Set.of(...)` = constant set. For an editable set, wrap it in `new HashSet<>(...)`.',
  },
  'set-5': {
    explain:
      'Sets cannot hold an int pair directly, so you build a string key.\n- `2 + "," + 3` joins the numbers with a comma into "2,3". The comma stops "1,23" and "12,3" from colliding.\n- `visited.add(...)` marks the cell as seen.\nA cheaper alternative is encoding as `r * cols + c`.',
    remember: 'A grid cell as a key: `r + "," + c`, or `r * cols + c`.',
  },
  'set-6': {
    explain:
      '`set.contains(3)` returns true when 3 is in the set. It is O(1) on average for a HashSet, which is why sets beat lists for membership tests.',
    remember: 'Membership test: `contains`.',
  },
  'set-7': {
    explain:
      '`set.remove(3)` deletes the value 3 if present and returns true when something was removed.',
    remember: 'Remove takes the value itself.',
  },
  'set-8': {
    explain:
      'A TreeSet keeps its elements sorted. It supports `first`, `last`, `floor` and `ceiling`, all in O(log n). The variable is declared as `TreeSet`, not `Set`, so those extra methods are available.',
    remember:
      'Need sorted order or nearest-value lookups? `TreeSet`. The type must be `TreeSet` to see `floor`.',
  },
  'set-9': {
    explain:
      'LinkedHashSet is a HashSet that remembers insertion order. It is useful for removing duplicates while keeping the original order.',
    remember: 'Linked = keeps the order.',
  },
  'set-10': {
    explain:
      '`a.retainAll(b)` removes from a every element that is not in b, so a becomes the intersection of the two sets. It changes a in place. Copy first with `new HashSet<>(a)` if you need to keep the original.',
    remember: 'Retain = keep only. Intersection = `retainAll`, union = `addAll`.',
  },
  'set-11': {
    explain:
      '`a.containsAll(b)` is true when every element of b is also in a, so b is a subset of a.',
    remember: '"A contains all of B".',
  },
};

export const listExplanations: Record<string, Explanation> = {
  'list-1': {
    explain:
      'This creates an empty, resizable list of Integers. The interface `List` is the variable type and `ArrayList` is the implementation. Boxing is automatic, so you can add plain ints.',
    remember: '"List = new ArrayList": interface left, implementation right.',
  },
  'list-2': {
    explain:
      '`list.add(0, 9)` inserts 9 at index 0 and shifts every other element one place to the right. That shift makes it O(n).\nIf you do this a lot, use an ArrayDeque and `addFirst`.',
    remember: 'Two arguments: index first, then value.',
  },
  'list-3': {
    explain:
      'On a List<Integer>, `remove(5)` is read as "remove the element at index 5". To remove the value, you box it first: `Integer.valueOf(5)` is an object, so Java picks the remove-by-object version.\nA cast `(Integer) 5` works too.',
    remember: 'Value removal needs an object: `remove(Integer.valueOf(x))`.',
  },
  'list-4': {
    explain:
      '`list.remove(0)` with an int argument removes the element at that index and returns it. Everything after it shifts left, so it is O(n).',
    remember: 'A plain int means index.',
  },
  'list-5': {
    explain:
      '`Collections.sort(list)` sorts a list into ascending natural order, in place. It uses a stable merge sort variant (TimSort) with O(n log n). `list.sort(null)` does the same.',
    remember: 'Lists sort with `Collections.sort`, arrays with `Arrays.sort`.',
  },
  'list-6': {
    explain: '`Collections.reverse(list)` reverses the order of the elements in place, in O(n).',
    remember: 'Reverse the list: `Collections.reverse`. For a String, reverse a StringBuilder.',
  },
  'list-7': {
    explain:
      'The last index is `size() - 1`, because indexes start at 0. So `list.get(list.size() - 1)` reads the last element. It throws on an empty list, so check `isEmpty()` first.\nJava 21 added `list.getLast()`.',
    remember: 'Last = size minus one.',
  },
  'list-8': {
    explain:
      '`list.subList(0, 2)` returns a view of indexes 0 and 1 (end exclusive). It is not a copy: changing the view changes the original list.\nWrap it with `new ArrayList<>(...)` if you need an independent copy.',
    remember: 'A view, not a copy. Same "inclusive start, exclusive end" rule.',
  },
  'list-9': {
    explain:
      'When backtracking you keep editing one working list. If you add that same object to the results, every stored entry ends up pointing to the one list that keeps changing.\n`new ArrayList<>(list)` creates a snapshot copy at this moment, so the result is frozen.',
    remember: 'Backtracking rule: "add a copy, never the live list".',
  },
  'list-10': {
    explain:
      '`list.get(2)` returns the element at index 2 in O(1). The Integer is unboxed to int automatically.',
    remember: 'List uses `get(i)`, arrays use `[i]`.',
  },
  'list-11': {
    explain:
      '`list.set(2, 9)` replaces the element at index 2 with 9 and returns the old value. The size stays the same, unlike `add`.',
    remember: '`set` replaces, `add` inserts.',
  },
  'list-12': {
    explain:
      '`list.remove(list.size() - 1)` removes the last element, which is cheap since nothing needs to shift. In backtracking it is the "undo" step after you try a choice.\nOn Java 21 you can write `list.removeLast()`.',
    remember: 'Backtracking is "add, recurse, remove last".',
  },
  'list-13': {
    explain:
      '`Collections.swap(list, i, j)` exchanges the elements at positions i and j. It saves you the temporary variable and works on any List.',
    remember: 'Swap: list, then the two indexes.',
  },
  'list-14': {
    explain:
      '`Collections.max(list)` scans the list and returns its largest element. `Collections.min` is the opposite. Both are O(n) and throw on an empty list.',
    remember: 'Max of a collection: `Collections.max`.',
  },
  'list-15': {
    explain:
      'This is the usual results container for subsets, permutations and path problems: a list whose elements are lists of Integer. You add inner lists to it as you find answers.',
    remember: 'List of lists: `List<List<Integer>>`, with a plain `new ArrayList<>()` outside.',
  },
  'list-16': {
    explain:
      '`List.of(1, 2, 3)` builds a fixed, read-only list. Calling `add`, `remove` or `set` throws UnsupportedOperationException. Good for constants.',
    remember: '`List.of` is immutable.',
  },
  'list-17': {
    explain:
      'Wrapping the fixed list in `new ArrayList<>(...)` copies it into an editable one. This is the one-statement way to get a mutable list with starting values.',
    remember: 'Need to change it? Wrap in `new ArrayList<>(...)`.',
  },
  'list-18': {
    explain:
      '`list.addAll(other)` appends every element of other to the end of list, in order. It returns true if the list changed.',
    remember: 'All of them at once: `addAll`.',
  },
  'list-19': {
    explain:
      'A graph with n nodes needs one neighbor list per node.\n- The outer `List<List<Integer>>` has one slot per node.\n- The loop adds n empty ArrayLists, so `adj.get(u)` is never null.\nNodes are numbered 0 to n-1.',
    remember: 'Adjacency list = list of lists + a loop to fill empty lists.',
  },
  'list-20': {
    explain:
      'For an undirected edge, each end knows the other. `adj.get(u).add(v)` records v as a neighbor of u, and `adj.get(v).add(u)` records u as a neighbor of v.\nFor a directed edge, you only write the first.',
    remember: 'Undirected means two adds, one in each direction.',
  },
};
