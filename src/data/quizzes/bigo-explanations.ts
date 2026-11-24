import type { Explanation } from './syntax-explanations-types';

export const bigoExplanations: Record<string, Explanation> = {
  // Reading constraints
  'con-1': {
    explain:
      'A judge runs roughly 10^8 simple operations per second. With n = 10^5, an O(n²) solution does 10^10 operations, far too many. O(n log n) is about 1.7 million, which is trivial.\nSo n around 10^5 tells you to sort, use a heap, a hash map or a two-pointer pass.',
    remember: 'Budget is about 10^8 operations. n = 10^5 means n log n or better.',
  },
  'con-2': {
    explain:
      'n = 1,000 gives n² = 10^6 operations, which is tiny. Even O(n² log n) is fine. Exponential growth such as 2^n is hopeless at that size.',
    remember: 'n up to a few thousand: nested loops are fine.',
  },
  'con-3': {
    explain:
      'When n is at most about 20, 2^n is around a million, so trying every subset or running a backtracking search is affordable. Larger n makes that impossible.',
    remember: 'Tiny n (20 or so) is a hint for subsets and backtracking.',
  },
  'con-4': {
    explain:
      'With n up to 10^9 you cannot even loop from 1 to n, because that is 10^9 steps, too slow for a one-second limit. You need O(log n), O(sqrt n) or O(1) math, such as binary search, fast exponentiation or a formula.',
    remember: 'n = 10^9 means no loop to n: think log n or sqrt n.',
  },
  'con-5': {
    explain:
      'n = 10^6 squared is 10^12, which is thousands of times over budget. You need O(n) or O(n log n) at best, for example a hash map, sorting or a linear scan.',
    remember: 'n = 10^6: only linear or n log n survives.',
  },
  'con-6': {
    explain:
      'A common rule of thumb is about 10^8 simple operations per second in Java and C++. Use it to turn the constraints into a complexity target before you pick an approach.',
    remember: 'One second is about 10^8 operations.',
  },
  'con-7': {
    explain:
      'Meet in the middle splits the items into two halves of 20, enumerates the 2^20 subsets of each half, then combines them with sorting or a hash map. The cost drops from 2^40 (about a trillion) to roughly 2^20 times a log factor.',
    remember: 'n = 40 is the meet-in-the-middle size: two halves of 2^20.',
  },

  // Java collections
  'col-1': {
    explain:
      'A hash map computes the bucket from the hash code and jumps straight to it, so a lookup or insert takes constant time on average. Bad hashing can pile keys into one bucket and cost O(n), or O(log n) once a bucket turns into a tree in Java 8+.',
    remember: 'Hash lookups are O(1) on average. Hash means jump straight there.',
  },
  'col-2': {
    explain:
      'A HashSet is a HashMap whose values are a dummy object, so `contains` hashes the element and checks one bucket: O(1) on average.',
    remember: 'HashSet is a HashMap in disguise: O(1).',
  },
  'col-3': {
    explain:
      'TreeMap and TreeSet are red-black trees. A balanced tree has height about log n, so lookups, inserts and deletes each walk one root-to-leaf path: O(log n). The price of that is that keys stay sorted.',
    remember: 'Tree means sorted and O(log n).',
  },
  'col-4': {
    explain:
      'A PriorityQueue is a binary heap in an array. Insertion bubbles the new element up and `poll` moves the last element to the root and sinks it down, each along a path of height log n.',
    remember: 'Heap offer and poll: O(log n). Only peek is free.',
  },
  'col-5': {
    explain:
      '`peek` only reads the root of the heap, which is always the smallest (or largest) element. No restructuring happens, so it is constant time.',
    remember: 'Peek just looks at the top: O(1).',
  },
  'col-6': {
    explain:
      '`remove(Object)` has to scan the array to find the element first, which is O(n), then fix the heap in O(log n). The scan dominates.\nIf you need many removals, mark items as deleted in a set and skip them when they reach the top (lazy deletion).',
    remember: 'Removing a random item from a heap is a scan: O(n).',
  },
  'col-7': {
    explain:
      'Building a heap bottom-up (heapify) is O(n): most nodes are near the leaves and sink only a step or two. Calling `offer` n times costs O(n log n). Passing a collection to the PriorityQueue constructor heapifies in one pass.',
    remember: 'Heapify from a collection is O(n). One by one is O(n log n).',
  },
  'col-8': {
    explain:
      'An ArrayList stores elements in a contiguous array, so index i is a direct address computation: constant time.',
    remember: 'Array behind the scenes means O(1) random access.',
  },
  'col-9': {
    explain:
      'Adding at the end is usually one write. Occasionally the backing array is full and gets copied into a bigger one, which is O(n). Because the capacity grows geometrically, the copies are rare enough that the average cost per add stays constant: amortized O(1).',
    remember: 'add at the end is amortized O(1): rare big copies, mostly free.',
  },
  'col-10': {
    explain:
      'Inserting or removing at the front means every other element shifts one slot, so the cost grows with the size of the list: O(n). If you need cheap work at the front, use an ArrayDeque.',
    remember: 'Front of an ArrayList: everything shifts, so O(n).',
  },
  'col-11': {
    explain:
      '`contains` on a list has no index to jump to. It checks elements one by one with `equals` until it finds a match or reaches the end: O(n). Use a HashSet when you test membership a lot.',
    remember: 'List contains is a scan. Set contains is a jump.',
  },
  'col-12': {
    explain:
      'An ArrayDeque is a circular array with a head and a tail index. Adding or removing at either end only moves an index and writes one slot: constant time, with the same amortized resize cost as ArrayList.',
    remember: 'Both ends of an ArrayDeque are O(1).',
  },
  'col-13': {
    explain:
      'A LinkedList has no random access. `get(i)` follows next pointers from the nearer end, so it takes O(n). Even with that, the constant factors and cache misses make it rarely better than ArrayList or ArrayDeque.',
    remember: 'LinkedList get is a walk: O(n). Rarely worth using.',
  },
  'col-14': {
    explain:
      'Java sorts objects with TimSort (a merge-sort variant) and primitives with dual-pivot quicksort. Both are O(n log n) on typical input. The object sort is stable.',
    remember: 'Any comparison sort is n log n.',
  },
  'col-15': {
    explain:
      '`floor` and `ceiling` walk down the tree following the sorted order, like a binary search tree lookup, so they cost O(log n). This is exactly what a HashSet cannot do.',
    remember: 'Nearest-key queries on a tree: O(log n).',
  },
  'col-16': {
    explain:
      '`Arrays.fill`, `copyOf` and `clone` touch every element once, so they cost O(n). Remember that copying a big array inside a loop quietly multiplies the cost.',
    remember: 'Copying or filling n items always costs n.',
  },
  'col-17': {
    explain:
      '`Collections.reverse` swaps pairs from the two ends, which is about n / 2 swaps: O(n).',
    remember: 'Reverse touches each element once: O(n).',
  },
  'col-18': {
    explain:
      'The sublist view is O(1) to create, but wrapping it in `new ArrayList<>(...)` copies the k elements, so that costs O(k). Copying is the hidden price in recursion that builds sublists.',
    remember: 'Copying k items costs k.',
  },

  // Strings
  'str-1': {
    explain:
      'Strings are immutable, so `s += c` builds a brand new string and copies the old characters every time. The copies are of length 1, 2, 3, ... n, which adds up to about n² / 2: O(n²).\nA StringBuilder appends into one growing buffer instead.',
    remember: 'String plus in a loop is quadratic. Use StringBuilder.',
  },
  'str-2': {
    explain:
      'A StringBuilder keeps a growing array and appends characters in amortized O(1), the same trick as ArrayList. n appends cost O(n) in total.',
    remember: 'StringBuilder append is amortized O(1) each.',
  },
  'str-3': {
    explain:
      'Since Java 7u6, `substring` copies the characters in the range rather than sharing the original array. So its cost is the length of the slice, j - i, not constant time.',
    remember: 'substring copies: cost is the slice length.',
  },
  'str-4': {
    explain:
      'A String is backed by an array, so `charAt(i)` is a direct index and `length()` returns a stored field. Both are constant time.',
    remember: 'charAt and length are O(1).',
  },
  'str-5': {
    explain:
      '`equals` compares characters one by one until it finds a difference or reaches the end, so in the worst case it reads all n of them: O(n).',
    remember: 'String compare walks the characters: O(n).',
  },
  'str-6': {
    explain:
      'The map is O(1) in the number of keys, but hashing a string reads all k characters, and the equality check reads k more. So string keys cost O(k) per operation. The hash is cached after the first time on the same object.',
    remember: 'Hash map with string keys: O(k), not O(1).',
  },
  'str-7': {
    explain:
      'Sorting each word of length k costs O(k log k), and you do that for n words: O(n · k log k). Counting the 26 letters instead of sorting reduces each word to O(k), so the total becomes O(n · k).',
    remember: 'n words, each sorted: n times k log k.',
  },
  'str-8': {
    explain:
      'The simple search tries each of about n starting positions and compares up to m characters at each, so the worst case is O(n · m). Algorithms such as KMP bring this down to O(n + m).',
    remember: 'Naive search: positions times pattern length.',
  },

  // Analyzing code
  'code-1': {
    explain: 'One loop that runs n times with constant work inside is O(n).',
    remember: 'One loop to n means O(n).',
  },
  'code-2': {
    explain:
      'The inner loop runs n times for each of the n outer iterations, so the body executes n × n = n² times.',
    remember: 'Nested loops multiply: n times n.',
  },
  'code-3': {
    explain:
      'The inner loop runs n-1, n-2, ... 0 times, which adds up to n(n-1) / 2 pairs. Drop the constant 1/2 and the lower term and you are left with O(n²).',
    remember: 'All pairs i < j is about n² / 2, still O(n²).',
  },
  'code-4': {
    explain:
      'i doubles each time: 1, 2, 4, 8, ... The loop stops after about log₂ n steps, so it is O(log n).',
    remember: 'Doubling or halving means log n.',
  },
  'code-5': {
    explain:
      'Stepping by 2 makes about n / 2 iterations. Constant factors are ignored in Big-O, so it is still O(n).',
    remember: 'Constant factors vanish: n / 2 is n.',
  },
  'code-6': {
    explain:
      'The outer loop runs n times. The inner loop doubles j, so it runs about log n times. Multiply them: O(n log n).',
    remember: 'A linear loop around a doubling loop is n log n.',
  },
  'code-7': {
    explain:
      'The two loops run one after the other, not nested. Costs add: n + n = 2n, which is O(n).',
    remember: 'Sequential adds, nested multiplies.',
  },
  'code-8': {
    explain:
      'The two loops have different bounds, n and m. Nested, they multiply to n · m. Do not collapse them to n² unless the two sizes are the same.',
    remember: 'Different inputs, different letters: n times m.',
  },
  'code-9': {
    explain: 'Halving n each time reaches 1 after about log₂ n steps: O(log n).',
    remember: 'Halving until 1 is log n.',
  },
  'code-10': {
    explain:
      'The loop runs while i × i is at most n, so i only goes up to sqrt(n). This is how you check divisors or primality quickly: O(√n).',
    remember: 'i * i <= n means square root.',
  },
  'code-11': {
    explain:
      'The outer loop runs once per character (n times). The inner loop always runs 26 times no matter how long the string is, so it is a constant. 26 · n is O(n).',
    remember: 'A loop over a fixed alphabet is a constant factor.',
  },
  'code-12': {
    explain: 'Three nested loops that each run n times execute n × n × n = n³ times.',
    remember: 'Three nested loops to n means n cubed.',
  },
  'code-13': {
    explain:
      'It looks nested, but `left` only ever moves forward and never resets. Together the two pointers move at most n steps each, so the total work is O(n). This is the sliding window pattern.',
    remember: 'A pointer that never goes back makes it linear.',
  },
  'code-14': {
    explain:
      'Each index is pushed once and popped at most once, so across the whole loop there are at most 2n stack operations. The inner while loop does not multiply the cost. This is the monotonic stack pattern.',
    remember: 'Count total pushes and pops: each item at most once.',
  },

  // Recursion
  'rec-1': {
    explain:
      'Each call makes two more calls, so the call tree roughly doubles at every level and has about 1.6^n nodes. O(2^n) is the usual upper bound. It repeats the same subproblems over and over.',
    remember: 'Two recursive calls that overlap is exponential.',
  },
  'rec-2': {
    explain:
      'With memoization each value fib(0..n) is computed once and stored, then reused from the cache. That is n distinct calls with constant work each: O(n) time and O(n) space.',
    remember: 'Memoize and exponential becomes linear.',
  },
  'rec-3': {
    explain:
      'Each step does constant work and shrinks the problem to half. After log₂ n halvings you reach size 1, so the total is O(log n). This is binary search.',
    remember: 'One half, constant work: log n.',
  },
  'rec-4': {
    explain:
      'The problem splits into two halves, and the merge step costs O(n). There are about log n levels, each doing n total work: O(n log n). This is merge sort.',
    remember: 'Two halves plus a linear merge is n log n.',
  },
  'rec-5': {
    explain:
      'Each call does constant work and recurses on n - 1, so there are n calls: O(n) time. All n calls sit on the call stack at once before the first one returns, so the stack space is O(n) too.',
    remember: 'Linear recursion costs linear stack space.',
  },
  'rec-6': {
    explain:
      'On a skewed tree, one path goes down through all n nodes, so the recursion is n frames deep. The stack space equals the tree height, which is n here.',
    remember: 'Stack space equals tree height. Skewed height is n.',
  },
  'rec-7': {
    explain:
      'On a balanced tree the height is about log n, and the recursion depth equals the height, so the stack space is O(log n).',
    remember: 'Balanced tree height is log n.',
  },
  'rec-8': {
    explain:
      'There are 2^n subsets, and copying each one into the answer costs up to n. That makes O(n · 2^n) in total. If you only count visiting them, it is 2^n.',
    remember: 'Subsets: 2^n of them, times n to copy.',
  },
  'rec-9': {
    explain:
      'There are n! permutations, and copying each one costs n. That is O(n · n!), which is only practical for n up to about 10 or 11.',
    remember: 'Permutations: n! of them, times n to copy.',
  },

  // Algorithms
  'alg-1': {
    explain:
      'Binary search halves the remaining range every step, so it finishes in about log₂ n steps. It needs sorted data (or a monotonic condition).',
    remember: 'Binary search: halve each time, so log n.',
  },
  'alg-2': {
    explain:
      'Merge sort always splits in half (log n levels) and merges in O(n) per level, giving O(n log n) even in the worst case. The merge needs a temporary array of size n.',
    remember: 'Merge sort: n log n time, n extra space.',
  },
  'alg-3': {
    explain:
      'Quick sort picks a pivot and partitions. A good pivot splits evenly, giving n log n on average. A consistently bad pivot, for example the smallest element every time, degrades to n². Random pivots make the worst case very unlikely.',
    remember: 'Quick sort: usually n log n, unlucky n².',
  },
  'alg-4': {
    explain:
      'BFS and DFS visit each vertex once and look at each edge once (twice in an undirected graph), which is O(V + E) with adjacency lists. An adjacency matrix would cost O(V²).',
    remember: 'Graph traversal touches every vertex and edge once.',
  },
  'alg-5': {
    explain:
      'In a grid, every cell is a vertex with up to four neighbors, so the edges are about 4 times m · n. The traversal is O(m · n), as long as you mark cells as visited so none is processed twice.',
    remember: 'Grid traversal: visit each cell once.',
  },
  'alg-6': {
    explain:
      'Each edge can cause a heap insert (log V) and each vertex a poll (log V), so the total is O((V + E) log V). Without a heap, an array scan gives O(V²).',
    remember: 'Dijkstra is BFS with a heap, so add a log V.',
  },
  'alg-7': {
    explain:
      'Kahn computes in-degrees (O(V + E)) and then processes each vertex and edge once while removing zero-in-degree nodes. The total is O(V + E).',
    remember: 'Topological sort visits each vertex and edge once.',
  },
  'alg-8': {
    explain:
      'With both path compression and union by rank, the amortized cost per operation is the inverse Ackermann function, which is at most 4 or 5 for any input size you can store. In practice that is constant.',
    remember: 'Union-Find with both tricks is practically O(1).',
  },
  'alg-9': {
    explain:
      'Keep a min-heap of the k largest values seen so far. For each of n numbers you offer it (log k) and poll when the heap exceeds k (log k). Total: O(n log k), using only O(k) space.',
    remember: 'Heap of size k, n numbers: n log k.',
  },
  'alg-10': {
    explain:
      'Quickselect partitions like quick sort but recurses into only one side. The expected sizes are n + n/2 + n/4 + ..., which sums to about 2n: O(n) on average. The worst case is O(n²).',
    remember: 'Quickselect is quick sort that follows one side: O(n) average.',
  },
  'alg-11': {
    explain:
      'Building the prefix array is one pass (O(n)). Each range sum is then `prefix[r+1] - prefix[l]`, which is constant time, so q queries cost O(q). Total O(n + q).',
    remember: 'Pay n once, then each query is O(1).',
  },
  'alg-12': {
    explain:
      'A trie follows one node per character, so inserting or searching a word of length L takes L steps regardless of how many words are stored: O(L).',
    remember: 'Trie cost depends on word length, not on the number of words.',
  },
  'alg-13': {
    explain:
      'The DP table has n rows (items) and W + 1 columns (capacities), and each cell takes constant time: O(n · W). This is pseudo-polynomial because W is a value, not an input size.',
    remember: 'Knapsack: items times capacity.',
  },
  'alg-14': {
    explain:
      'The DP table has m + 1 rows and n + 1 columns, and each cell is filled in constant time from its neighbors: O(m · n).',
    remember: 'Two-string DP: length times length.',
  },
  'alg-15': {
    explain:
      'Floyd-Warshall has three nested loops over the vertices (intermediate k, source i, destination j), so it takes V³ steps.',
    remember: 'Three nested loops over vertices: V cubed.',
  },
  'alg-16': {
    explain:
      'Merging walks both lists once with one pointer each, and each step advances one pointer. There are n + m steps in total: O(n + m).',
    remember: 'Merge is one pass over both lists.',
  },
  'alg-17': {
    explain:
      'Kadane keeps a running best ending at the current index and the global best, in one pass with constant work per element: O(n) time and O(1) space.',
    remember: 'One pass, two numbers: O(n).',
  },
  'alg-18': {
    explain:
      'Brute force tries every pair, O(n²). With a HashMap you store seen values and check `target - x` in O(1) for each element, giving O(n) time at the cost of O(n) space.',
    remember: 'Trade space for time: a map turns n² into n.',
  },
  'alg-19': {
    explain:
      'With the array sorted, put one pointer at each end. If the sum is too small move the left pointer right, if too large move the right pointer left. Each step discards one element, so there are at most n steps, and you only keep two indexes: O(n) time, O(1) space.',
    remember: 'Sorted input lets two pointers replace the hash map.',
  },
  'alg-20': {
    explain:
      'Heap sort builds a heap (O(n)) and then removes the maximum n times, each removal costing O(log n). The total is O(n log n), and it sorts in place with O(1) extra space.',
    remember: 'n removals from a heap, log n each.',
  },
  'alg-21': {
    explain:
      'Counting sort makes one pass to count each value (n), then builds the output from the counts across the range (k). It beats n log n when the range k is small, but it needs O(k) extra space.',
    remember: 'Counting sort: n plus the range.',
  },
  'alg-22': {
    explain:
      'Each of the n² output cells is a dot product of n multiplications, so the schoolbook method costs n² × n = n³. Faster algorithms such as Strassen exist but are rarely used in interviews.',
    remember: 'Matrix multiply is three nested loops: n cubed.',
  },
  'alg-23': {
    explain:
      'The O(log n) guarantee depends on the tree staying balanced. If keys are inserted in sorted order into a plain BST, it degenerates into a linked list of height n, so operations cost O(n). Red-black and AVL trees rebalance to prevent this.',
    remember: 'Balanced is log n. Skewed is n.',
  },

  // Concepts
  'cpt-1': {
    explain:
      'Big-O is an upper bound on growth, Big-Omega is a lower bound, and Big-Theta says both bounds match (a tight bound). In interviews, people usually say Big-O to mean the tight worst case.',
    remember: 'O is the Ceiling, Omega is the floor, Theta is both.',
  },
  'cpt-2': {
    explain:
      'Keep only the fastest-growing term and drop its constant. For large n, the 5n and the 10 are tiny compared with 3n², and the 3 is a constant factor. So O(3n² + 5n + 10) is O(n²).',
    remember: 'Drop constants and lower terms.',
  },
  'cpt-3': {
    explain:
      'Two loops one after the other add their costs: n + m. They multiply only when one is nested inside the other. Use separate letters for separate inputs.',
    remember: 'Back to back adds, nested multiplies.',
  },
  'cpt-4': {
    explain:
      'Amortized analysis spreads the cost of rare expensive operations across many cheap ones. A dynamic array doubling occasionally makes a single add O(n), but n adds together cost O(n), so each is O(1) amortized. It is a guarantee on any sequence, not an average over random inputs.',
    remember: 'Amortized: total over a sequence, divided by the count.',
  },
  'cpt-5': {
    explain:
      'From slowest growth to fastest: constant, logarithmic, linear, linearithmic (n log n), quadratic, exponential, factorial. Knowing this order lets you compare two solutions at a glance.',
    remember: '1, log n, n, n log n, n squared, 2^n, n factorial.',
  },
  'cpt-6': {
    explain:
      'Memoization stores results you have already computed, so you spend memory to avoid repeating work. Dynamic programming tables and hash-map caches are the same trade: more space, less time.',
    remember: 'Cache it: space for time.',
  },
  'cpt-7': {
    explain:
      'A HashMap stores one entry per key, so with n entries it uses space proportional to n: O(n). Extra data structures count toward the space complexity of your solution.',
    remember: 'One entry per item means O(n) space.',
  },
  'cpt-8': {
    explain:
      'A table with n rows and m columns stores n × m cells: O(n · m). If each row depends only on the previous one, you can keep just two rows and cut the space to O(m).',
    remember: 'Table space is rows times columns. Keep two rows to shrink it.',
  },
};
