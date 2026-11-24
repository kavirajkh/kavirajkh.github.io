import type { Quiz, QuizQuestion } from './types';
import { mc, q, r, rankQuestions } from './helpers';
import { criticalPriority } from './critical-priority';

/** Multiple choice: spot the critical check, the bug, or the right variation. */
function m(
  id: string,
  section: string,
  prompt: string,
  correct: string,
  wrong: [string, string, string],
  explain: string,
  remember: string,
  context?: string,
): QuizQuestion {
  return mc(id, section, prompt, correct, wrong, { explain, remember, context });
}

/** Typed: write the one critical line from memory. */
function t(
  id: string,
  section: string,
  prompt: string,
  answers: string[],
  explain: string,
  remember: string,
  context?: string,
): QuizQuestion {
  return q(id, section, prompt, answers, { explain, remember, context });
}

const authored: QuizQuestion[] = [
  // Backtracking
  t(
    'bt-copy',
    'Backtracking',
    'Save the current path into result. Which line avoids every saved list ending up empty?',
    [
      'result.add(new ArrayList<>(path));',
      'result.add(new ArrayList<Integer>(path));',
      'result.add(List.copyOf(path));',
    ],
    'The path list is one shared object that you keep mutating. Adding it directly stores a reference, so when backtracking removes elements, every saved entry empties out too.\nA copy freezes the current contents at that moment.',
    'Save a COPY, never the live list: `new ArrayList<>(path)`.',
    r`void dfs(int start, List<Integer> path) {
    // record this subset here
}`,
  ),
  t(
    'bt-undo',
    'Backtracking',
    'After the recursive call, undo the choice you made with path.add(x).',
    ['path.remove(path.size() - 1);', 'path.removeLast();'],
    'Backtracking is choose, explore, undo. Removing the last element restores the state for the next sibling choice.\nCatch: `path.remove(x)` on a List<Integer> removes by INDEX when x is an int, so remove the last position explicitly.',
    'Choose, explore, undo. Undo removes the LAST index.',
    r`path.add(nums[i]);
dfs(i + 1, path);
// undo`,
  ),
  t(
    'bt-dup-skip',
    'Backtracking',
    'Subsets II: after sorting, skip a duplicate choice at the same recursion level.',
    ['if (i > start && nums[i] == nums[i - 1]) continue;'],
    'The condition i > start means "not the first choice at this level". Skipping an equal sibling removes duplicate branches before they are created.\nCatch: using i > 0 also skips valid choices deeper in the path, and forgetting to sort first makes equal values non-adjacent.',
    'Sort first, then skip equal SIBLINGS: i > start.',
    r`for (int i = start; i < nums.length; i++) {
    // skip duplicate here
    path.add(nums[i]);
    dfs(i + 1, path);
    path.remove(path.size() - 1);
}`,
  ),
  m(
    'bt-start-index',
    'Backtracking',
    'In Combination Sum (numbers can be reused), which recursive call is right?',
    'dfs(i, remaining - nums[i])',
    ['dfs(i + 1, remaining - nums[i])', 'dfs(0, remaining - nums[i])', 'dfs(start, remaining)'],
    'Passing i keeps the same number available, which allows reuse, and never goes backward, so [2, 3] and [3, 2] are not produced separately.\nPassing i + 1 forbids reuse (Combination Sum II). Passing 0 allows permutations of the same combination.',
    'Reuse allowed: pass i. Each number once: pass i + 1.',
  ),
  m(
    'bt-permutations-used',
    'Backtracking',
    'Permutations with a used[] array. What must happen after the recursive call returns?',
    'Set used[i] back to false and remove the last element',
    ['Nothing: the array resets itself', 'Clear the whole used array', 'Sort the path again'],
    'The same used array is shared by all branches. If you do not unmark the element, later branches think it is still taken and the search silently misses permutations.',
    'Anything you mark on the way in must be unmarked on the way out.',
  ),
  m(
    'bt-prune',
    'Backtracking',
    'Candidates are sorted and you are building a sum to a target. Which prune is correct and cheap?',
    'break as soon as nums[i] > remaining',
    [
      'continue when nums[i] > remaining',
      'Run the full search then filter',
      'return only at the end of the loop',
    ],
    'Because the array is sorted, every later number is even larger, so the whole rest of the loop is useless. break stops the loop, while continue only skips one item and keeps testing larger values.',
    'Sorted candidates: break, do not continue.',
  ),
  t(
    'bt-grid-restore',
    'Backtracking',
    'Word Search marks a cell with # while exploring. Restore it after the four recursive calls (the saved value is tmp).',
    ['board[r][c] = tmp;'],
    'Marking the cell stops the same cell being reused in one path. Restoring it lets other paths use the cell later.\nCatch: forgetting to restore it makes the search fail on boards where a different path needs that cell.',
    'Mark the cell in, restore it out.',
    r`char tmp = board[r][c];
board[r][c] = '#';
boolean found = dfs(r + 1, c) || dfs(r - 1, c) || dfs(r, c + 1) || dfs(r, c - 1);
// restore here
return found;`,
  ),
  m(
    'bt-generate-parens',
    'Backtracking',
    'Generate Parentheses: which rule guarantees only valid strings are built?',
    'Add ( while open < n, and add ) only while close < open',
    [
      'Add ) whenever close < n',
      'Build all 2^(2n) strings then validate each',
      'Always add ( first then ) at the end',
    ],
    'The two counters are the validity rule. Enforcing it while building means no invalid prefix is ever explored, so there is nothing to filter later.',
    'Put the validity rule inside the loop, not after it.',
  ),

  // Binary search
  t(
    'bs-mid',
    'Binary search',
    'Compute mid without integer overflow.',
    [
      'int mid = lo + (hi - lo) / 2;',
      'int mid = lo + ((hi - lo) >> 1);',
      'int mid = (lo + hi) >>> 1;',
    ],
    '(lo + hi) / 2 overflows when both are large, producing a negative index. lo + (hi - lo) / 2 never exceeds hi.',
    'lo plus half the gap.',
  ),
  m(
    'bs-loop-condition',
    'Binary search',
    'You use `while (lo < hi)` with `hi = mid`. What is the safe pairing for the other branch?',
    'lo = mid + 1',
    ['lo = mid', 'lo = mid - 1', 'lo = hi'],
    'With lo < hi and floor division, lo = mid can leave lo unchanged when hi = lo + 1, which loops forever. Using mid + 1 always shrinks the range.',
    'Pair lo < hi with hi = mid and lo = mid + 1.',
  ),
  m(
    'bs-lower-bound',
    'Binary search',
    'First index whose value is at least target (lower bound). Which loop is correct?',
    'while (lo < hi) { int mid = lo + (hi - lo) / 2; if (a[mid] >= target) hi = mid; else lo = mid + 1; } return lo;',
    [
      'while (lo <= hi) { int mid = lo + (hi - lo) / 2; if (a[mid] >= target) hi = mid; else lo = mid + 1; } return lo;',
      'while (lo < hi) { int mid = lo + (hi - lo) / 2; if (a[mid] > target) hi = mid; else lo = mid + 1; } return lo;',
      'while (lo < hi) { int mid = lo + (hi - lo) / 2; if (a[mid] >= target) lo = mid; else hi = mid - 1; } return lo;',
    ],
    'Start with hi = n so "not found" returns n. When a[mid] qualifies, keep it as a candidate with hi = mid. Using > instead of >= gives the upper bound (first value greater than target).\nThe first wrong choice with lo <= hi and hi = mid never terminates when lo == hi.',
    'Lower bound: >= goes left and keeps mid. Upper bound: > goes left.',
  ),
  m(
    'bs-first-last',
    'Binary search',
    'Find the first and last position of a target in a sorted array with duplicates. What is the standard approach?',
    'Two binary searches: lower bound of target and lower bound of target + 1 minus one',
    [
      'One binary search then scan outward',
      'Linear scan from the left',
      'Sort a copy and use indexOf',
    ],
    'Scanning outward is O(n) in the worst case when every element equals the target. Two O(log n) bounds keep the whole thing logarithmic.',
    'Duplicates plus log n means bounds, not a scan.',
  ),
  m(
    'bs-rotated-sorted-half',
    'Binary search',
    'Search in Rotated Sorted Array: how do you know the left half is sorted?',
    'a[lo] <= a[mid]',
    ['a[mid] <= a[hi]', 'a[lo] < a[hi]', 'a[mid] == target'],
    'If the leftmost value is not larger than the middle, no rotation point lies inside the left half, so it is sorted. Then check whether the target lies inside that sorted range to decide which side to keep.\nCatch: use <= so the single-element case lo == mid is treated as sorted.',
    'Find the sorted half first, then test whether the target is in it.',
  ),
  t(
    'bs-ceil-div',
    'Binary search',
    'Koko Eating Bananas: hours needed for one pile at a given speed, using integer ceiling division.',
    ['hours += (pile + speed - 1) / speed;', 'hours += (pile - 1) / speed + 1;'],
    'Plain pile / speed rounds down, which undercounts hours. Adding speed - 1 first rounds up.\nCatch: sums of hours can exceed int, so accumulate in a long.',
    'Ceiling division: (a + b - 1) / b.',
    r`long hours = 0;
for (int pile : piles) {
    // add the hours for this pile
}`,
  ),
  m(
    'bs-answer-monotonic',
    'Binary search',
    'You want to binary search on the answer. What must be true of your feasibility check?',
    'It flips only once: false up to some value, true after it (or the reverse)',
    ['The data array must be sorted', 'It must run in O(1)', 'It must return the exact answer'],
    'The search needs a monotonic yes/no predicate. Once that holds, you can discard half of the answer range each step, however unordered the input data is.',
    'Search the answer only when the check flips exactly once.',
  ),
  m(
    'bs-bounds-answer',
    'Binary search',
    'For Capacity to Ship Packages, which range should the search use?',
    'lo = largest single weight, hi = total weight',
    [
      'lo = 0, hi = number of packages',
      'lo = 1, hi = days',
      'lo = smallest weight, hi = largest weight',
    ],
    'The ship must carry the heaviest package, so anything smaller is infeasible. Carrying everything at once is always enough, so the total is a safe upper limit.',
    'Lower bound: the item that must fit. Upper bound: everything at once.',
  ),

  // Sorting and merge sort variations
  m(
    'sort-merge-stable',
    'Sorting variations',
    'In merge sort, which comparison keeps the sort stable?',
    'Take from the left half when left <= right',
    [
      'Take from the left half only when left < right',
      'Take from the right half on ties',
      'Always take from the left half first',
    ],
    'On equal values, taking the left element first preserves the original order of equal items. Using < would put the right equal element first.',
    'Ties go left.',
    r`while (i <= mid && j <= hi) {
    tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
}`,
  ),
  m(
    'sort-merge-list',
    'Sorting variations',
    'Sort a linked list in O(n log n). Which method fits best?',
    'Merge sort: split with slow and fast, sort each half, merge',
    ['Quick sort with random access', 'Heap sort in place', 'Counting sort'],
    'Linked lists give no random access, which quick sort and heap sort rely on, while merging two sorted lists only needs pointers and uses O(1) extra space.\nCatch: cut the list at the middle (slow.next = null), or the halves never end.',
    'List plus n log n means merge sort.',
  ),
  m(
    'sort-merge-list-fast-start',
    'Sorting variations',
    'When splitting a list for merge sort, where should fast start so a two-node list splits into two single nodes?',
    'fast = head.next, slow = head',
    ['fast = head, slow = head', 'fast = head.next.next, slow = head', 'fast = null, slow = head'],
    'Starting fast one step ahead makes slow stop at the end of the first half. With both at head, a two-node list leaves slow at the second node, so the left half never shrinks and the recursion never ends.',
    'Fast starts one ahead to get the LEFT-middle.',
  ),
  m(
    'sort-merge-inversions',
    'Sorting variations',
    'Count inversions with merge sort. What do you add when you take an element from the right half?',
    'The number of elements remaining in the left half (mid - i + 1)',
    ['1', 'The size of the right half', 'The size of the whole array'],
    'The left half is sorted, so if right[j] is smaller than left[i], it is also smaller than every remaining element of the left half. They all form inversions with it.\nThis one-line addition turns merge sort into an O(n log n) counter.',
    'Taking from the right means it jumped over all remaining left items.',
  ),
  m(
    'sort-merge-reverse-pairs',
    'Sorting variations',
    'Reverse Pairs (a[i] > 2 * a[j]) with merge sort. When must you count the pairs?',
    'In a separate pass over the two sorted halves BEFORE the normal merge',
    [
      'During the merge using the same comparison',
      'After the whole array is merged',
      'Using only the left half',
    ],
    'The merge comparison is a[i] <= a[j], but the pair condition is a[i] > 2 * a[j]. They differ, so a single combined pass would miscount. Count first with two pointers on the sorted halves, then merge.\nUse long to avoid overflow when doubling.',
    'If the counting rule differs from the merge rule, count first.',
  ),
  m(
    'sort-count-smaller',
    'Sorting variations',
    'Count of Smaller Numbers After Self. What do you have to carry through the merge sort?',
    'The original indexes, so each count lands on the right element',
    ['Nothing: the values are enough', 'A second array of ranks', 'A hash map from value to count'],
    'The merge reorders values, so you lose track of who is who. Sort an array of indexes (by value) and add to counts[index] whenever a right element jumps ahead of a left one.',
    'Sort indexes, not values, when you need an answer per original position.',
  ),
  m(
    'sort-quickselect',
    'Sorting variations',
    'Kth Largest Element in O(n) average time. Which technique?',
    'Quickselect: partition, then recurse into only the side that contains k',
    ['Full quick sort', 'Merge sort then index', 'A max-heap of all elements'],
    'After one partition the pivot is in its final position, so you only need the side that holds the target index. Expected work is n + n/2 + n/4 + ... = O(n), with an O(n²) worst case that random pivots make unlikely.',
    'Quick sort follows both sides, quickselect follows one.',
  ),
  m(
    'sort-dutch-flag',
    'Sorting variations',
    'Sort Colors (only 0, 1, 2) in one pass and O(1) space. Which technique?',
    'Three pointers (Dutch national flag): low, mid, high',
    ['Merge sort', 'A HashMap of counts then rebuild', 'Binary search'],
    'Swap 0s to the front and 2s to the back while mid scans. Counting then rewriting works too in two passes, but the one-pass pointer version is the expected answer.\nCatch: do not advance mid after swapping with high, because the swapped-in value is unchecked.',
    'Three values, one pass: low, mid, high.',
  ),
  t(
    'sort-interval-comparator',
    'Sorting variations',
    'Sort an int[][] of intervals by start without risking overflow.',
    [
      'Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));',
      'Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));',
    ],
    'Integer.compare is safe for any ints. (a, b) -> a[0] - b[0] can overflow when values are far apart and give the wrong order.',
    'Compare with Integer.compare, never subtract.',
  ),
  m(
    'sort-stable-objects',
    'Sorting variations',
    'Which Java call is stable for objects?',
    'Arrays.sort(T[], Comparator) and Collections.sort',
    ['Arrays.sort(int[])', 'Arrays.sort(long[])', 'None are stable'],
    'Object sorts use TimSort, which is stable. Primitive sorts use dual-pivot quicksort, but stability does not matter for primitives because equal values are indistinguishable.',
    'Objects stable, primitives do not care.',
  ),

  // BFS and graphs
  t(
    'bfs-visited-enqueue',
    'Graphs and BFS',
    'Grid BFS: mark the neighbor visited at the moment you add it to the queue.',
    ['visited[nr][nc] = true;'],
    'If you mark cells only when you poll them, the same cell is enqueued by several neighbors and the queue blows up (and counts like shortest distance get duplicated work).\nMarking at enqueue guarantees each cell enters exactly once.',
    'Mark visited when you enqueue, not when you poll.',
    r`if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
    // mark here
    queue.offer(new int[] {nr, nc});
}`,
  ),
  t(
    'bfs-level-size',
    'Graphs and BFS',
    'Level-order BFS: freeze the number of nodes in the current level before the inner loop.',
    ['int size = queue.size();'],
    'The queue keeps growing as you add children. Reading queue.size() in the loop condition would mix levels together.\nCapture the size once per level, then poll exactly that many nodes.',
    'Read the size BEFORE the loop, because it changes inside.',
    r`while (!queue.isEmpty()) {
    // freeze level size here
    for (int i = 0; i < size; i++) {
        TreeNode node = queue.poll();
        // add children
    }
}`,
  ),
  t(
    'bfs-dirs',
    'Graphs and BFS',
    'Declare the four grid directions as an int[][] named dirs.',
    [
      'int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};',
      'int[][] dirs = new int[][] {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};',
    ],
    'A direction table keeps the loop body short: for each d, the neighbor is (r + d[0], c + d[1]). Add the four diagonals if the problem allows 8 directions.',
    'One loop over a dirs table, not four copies of code.',
  ),
  m(
    'bfs-bounds-order',
    'Graphs and BFS',
    'In the neighbor check, which order avoids an ArrayIndexOutOfBoundsException?',
    'Check the bounds first, then read grid[nr][nc] or visited[nr][nc]',
    ['Read grid[nr][nc] first, then check bounds', 'Check visited first', 'Catch the exception'],
    '&& short-circuits, so a failed bounds check stops the expression before the array access happens. Reversing the order reads outside the array.',
    'Bounds first, then data.',
  ),
  m(
    'bfs-multi-source',
    'Graphs and BFS',
    'Rotting Oranges and Walls and Gates start from many sources. How do you set up the queue?',
    'Enqueue ALL sources first, then run one BFS',
    [
      'Run a separate BFS from each source',
      'Run DFS from each source',
      'Sort the sources and run one at a time',
    ],
    'Starting every source together at distance zero spreads them in lockstep, so each cell gets its distance from the nearest source in one pass.\nSeparate runs cost far more and make taking the minimum harder.',
    'Many sources, one queue, all at distance 0.',
  ),
  m(
    'bfs-weighted',
    'Graphs and BFS',
    'Edges have different weights. Why does plain BFS fail for shortest paths?',
    'BFS counts edges, not total weight, so a path with fewer edges may cost more',
    ['BFS is always slower', 'BFS cannot handle cycles', 'BFS needs a sorted graph'],
    'BFS gives fewest hops. With weights you need Dijkstra (non-negative weights) or Bellman-Ford (negatives). A special case: weights of only 0 and 1 allow 0-1 BFS with a deque.',
    'Weighted graph: Dijkstra, not BFS.',
  ),
  t(
    'dij-stale',
    'Graphs and BFS',
    'Dijkstra with a PriorityQueue of {node, dist}: skip stale entries after polling (cur holds the polled pair).',
    ['if (cur[1] > dist[cur[0]]) continue;', 'if (cur[1] > dist[cur[0]]) { continue; }'],
    'Java PriorityQueue has no decrease-key, so the same node is added several times with different distances. When an old, larger entry is polled, it is outdated, so skip it.\nWithout the check the result stays correct but the work can grow.',
    'No decrease-key in Java: skip stale entries.',
    r`int[] cur = pq.poll();
// skip outdated entry here
for (int[] edge : graph[cur[0]]) { /* relax */ }`,
  ),
  m(
    'topo-processed',
    'Graphs and BFS',
    'Kahn algorithm: how do you detect a cycle at the end?',
    'The number of processed nodes is less than the number of nodes',
    ['The queue is empty', 'Any in-degree is 1', 'The output is not sorted'],
    'Nodes on a cycle never reach in-degree zero, so they are never queued. If fewer than n nodes were processed, a cycle exists.',
    'Count processed nodes and compare with n.',
  ),
  m(
    'dfs-cycle-states',
    'Graphs and BFS',
    'Detecting a cycle in a DIRECTED graph with DFS. What state do you need per node?',
    'Three states: unvisited, in progress, done',
    ['A single visited boolean', 'A parent pointer only', 'A distance array'],
    'A cycle exists when you reach a node that is still in progress (on the current path). A plain visited flag cannot tell a finished node from one on the stack, which gives false cycles for diamonds.',
    'Directed cycle: unvisited, visiting, visited.',
  ),
  m(
    'dfs-undirected-parent',
    'Graphs and BFS',
    'Detecting a cycle in an UNDIRECTED graph with DFS. What extra thing must you pass?',
    'The parent, so the edge back to the parent is not treated as a cycle',
    ['The depth', 'A second visited array', 'Nothing'],
    'In an undirected graph every edge appears in both directions, so the parent looks like a visited neighbor. Ignore exactly that one edge. (Multi-edges need edge ids.)',
    'Undirected: ignore the parent edge.',
  ),
  m(
    'graph-clone-map',
    'Graphs and BFS',
    'Clone Graph: what prevents infinite recursion on cycles?',
    'A map from original node to its clone, checked before recursing',
    ['A depth limit', 'Sorting the neighbors', 'Cloning only the first neighbor'],
    'Create the clone, store it in the map BEFORE visiting neighbors, and reuse mapped clones when you meet a node again. The map is both the visited set and the lookup for wiring neighbors.',
    'Put the clone in the map before exploring neighbors.',
  ),
  m(
    'graph-iterative-dfs',
    'Graphs and BFS',
    'A DFS over 10^5 nodes in a long chain crashes with StackOverflowError. What is the fix?',
    'Use an explicit stack (Deque) and iterate',
    ['Increase the array size', 'Use BFS with recursion', 'Add more memoization'],
    'Java recursion depth is limited (often around 10^4 frames). An explicit stack lives on the heap and handles deep inputs, with the same logic.',
    'Deep input: iterate with your own stack.',
  ),

  // Heap
  m(
    'heap-comparator-overflow',
    'Heap and comparators',
    'Why is `new PriorityQueue<>((a, b) -> b - a)` risky?',
    'The subtraction can overflow, so use Integer.compare(b, a)',
    [
      'It builds a min-heap',
      'PriorityQueue does not accept lambdas',
      'It makes the queue unsorted',
    ],
    'When a and b have large opposite signs, b - a overflows and flips the order. Integer.compare is always safe, as is Collections.reverseOrder() for a max-heap of Integers.',
    'Never subtract in a comparator.',
  ),
  t(
    'heap-size-k',
    'Heap and comparators',
    'Keep a min-heap at size k after each offer (the heap is named heap).',
    ['if (heap.size() > k) heap.poll();', 'if (heap.size() > k) { heap.poll(); }'],
    'The min-heap holds the k largest seen so far. When it grows past k, the smallest of them is no longer one of the k largest, so drop it.',
    'K largest: min-heap, poll when size exceeds k.',
    r`for (int x : nums) {
    heap.offer(x);
    // trim here
}`,
  ),
  m(
    'heap-two-balance',
    'Heap and comparators',
    'Median from a stream with two heaps. After inserting, what must always hold?',
    'Heap sizes differ by at most one, and every low value is at most every high value',
    [
      'Both heaps are exactly equal in size',
      'The low heap is a min-heap',
      'Only the max-heap is kept sorted',
    ],
    'The max-heap holds the lower half and the min-heap the upper half. Insert into one, move the top across to keep the ordering, then rebalance sizes. The median is a top or the average of the two tops.',
    'Low half max-heap, high half min-heap, sizes within 1.',
  ),
  m(
    'heap-iterate',
    'Heap and comparators',
    'You loop over a PriorityQueue with for-each and print it. What do you see?',
    'Heap array order, which is not sorted',
    ['Sorted ascending', 'Sorted descending', 'Insertion order'],
    'Only poll() returns elements in priority order. Iteration and toString show the internal array of the binary heap.',
    'Only poll gives sorted order.',
  ),
  m(
    'heap-lazy-delete',
    'Heap and comparators',
    'PriorityQueue.remove(x) is O(n). What do sliding-window median problems use instead?',
    'Lazy deletion: record removed values and discard them when they reach the top',
    ['Rebuild the heap every step', 'A linked list of the heap', 'Always poll until found'],
    'Mark the value as pending delete in a map. When it surfaces at the top, pop it then. Sizes need separate counters because the heap still holds the dead entries.',
    'Delete later, when it reaches the top.',
  ),
  m(
    'heap-k-closest',
    'Heap and comparators',
    'K Closest Points: which heap and which key?',
    'Max-heap of size k by squared distance',
    [
      'Min-heap of all points by distance',
      'Min-heap of size k by squared distance',
      'Max-heap of all points by x',
    ],
    'You want to evict the farthest point when the heap exceeds k, so the farthest must be on top: a max-heap. Squared distance avoids sqrt and keeps the same order.',
    'Keep the closest k: evict the farthest, so max-heap.',
  ),

  // Sliding window and two pointers
  m(
    'sw-shrink-while',
    'Sliding window and pointers',
    'The window can become invalid after adding one element. Which shrink is right?',
    'while (window is invalid) left++',
    ['if (window is invalid) left++', 'left++ once per element always', 'Reset left to right'],
    'One addition can break validity so badly that several removals are needed. An if may leave the window invalid, while a while loop shrinks until it is valid again.',
    'Shrink with while, not if.',
  ),
  m(
    'sw-update-answer',
    'Sliding window and pointers',
    'For the LONGEST valid window, where do you update the best length?',
    'After shrinking, when the window is valid again',
    ['Before shrinking', 'Only when left == 0', 'Only at the end of the array'],
    'Updating while the window is invalid records lengths that violate the rule. Record after the shrink loop so the window is valid.\nFor the shortest valid window, update inside the shrink loop instead.',
    'Longest: update after shrinking. Shortest: update while shrinking.',
  ),
  t(
    'sw-prefix-seed',
    'Sliding window and pointers',
    'Subarray Sum Equals K with a HashMap of prefix sums: seed the map so subarrays starting at index 0 count.',
    ['map.put(0, 1);'],
    'An empty prefix has sum 0, and it appears once. Without that entry, a prefix that equals k exactly is never counted, because prefix - k = 0 finds nothing.',
    'Seed the map with sum 0 seen once.',
    r`Map<Integer, Integer> map = new HashMap<>();
// seed here
int sum = 0, count = 0;`,
  ),
  t(
    'sw-deque-pop',
    'Sliding window and pointers',
    'Sliding Window Maximum: pop smaller values from the back of the deque before adding index i.',
    [
      'while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();',
      'while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();',
    ],
    'Smaller values behind a larger newer value can never be the maximum again, because the larger one stays in the window longer. Keeping the deque decreasing puts the maximum at the front.',
    'Pop everything smaller from the back, then push.',
    r`Deque<Integer> dq = new ArrayDeque<>(); // indexes, values decreasing
for (int i = 0; i < nums.length; i++) {
    // pop smaller values here
    dq.offerLast(i);
}`,
  ),
  m(
    'sw-deque-expire',
    'Sliding window and pointers',
    'Sliding Window Maximum: how do you expire an old index?',
    'Poll the front if its index is at most i - k',
    [
      'Poll the back if its value is small',
      'Rebuild the deque each step',
      'Never: indexes stay valid',
    ],
    'The deque stores indexes in order, so the oldest is at the front. When it falls out of the window (index <= i - k), remove it before reading the maximum.',
    'Store indexes so you can tell what expired.',
  ),
  m(
    'tp-3sum-dup',
    'Sliding window and pointers',
    '3Sum: how do you avoid duplicate triplets?',
    'Sort, then skip repeated values for the fixed index and for both pointers after a hit',
    [
      'Add every triplet to a HashSet of Lists',
      'Never sort, use a HashMap',
      'Only skip for the fixed index',
    ],
    'After sorting, equal values are adjacent. Skip equal fixed values (i > 0 and nums[i] == nums[i - 1]) and, after finding a triplet, move both pointers past their equal neighbors.\nA set of lists works but is slower and heavier.',
    'Sorted order makes duplicates adjacent: skip them everywhere.',
  ),
  m(
    'tp-move-weaker',
    'Sliding window and pointers',
    'Container With Most Water: which pointer moves inward?',
    'The one at the shorter bar',
    ['The one at the taller bar', 'Always the left', 'The one closer to the middle'],
    'The area is limited by the shorter bar. Moving the taller bar cannot help because the width shrinks while the height stays capped by the same short bar. Moving the shorter bar is the only chance to improve.',
    'Discard the weaker side.',
  ),
  m(
    'tp-trap-bound',
    'Sliding window and pointers',
    'Trapping Rain Water with two pointers: which side do you process?',
    'The side with the smaller max so far',
    ['The side with the larger max so far', 'Always the left', 'The taller current bar'],
    'The water above a bar is decided by the smaller of the two side maxima. If leftMax < rightMax, the left bar water is fully determined by leftMax, no matter what lies in between.',
    'Process the side whose max is smaller.',
  ),

  // Dynamic programming
  t(
    'dp-knapsack-direction',
    'Dynamic programming',
    '0/1 knapsack with one array: write the capacity loop so each item is used at most once (cap is the capacity, wt the item weight).',
    ['for (int w = cap; w >= wt; w--)'],
    'Looping the capacity DOWNWARD means dp[w - wt] still holds the value from before this item was added. Looping upward would read the updated value and use the item multiple times, which is unbounded knapsack.',
    '0/1: downward. Unbounded: upward.',
  ),
  m(
    'dp-unbounded-direction',
    'Dynamic programming',
    'Coin Change (unlimited coins) with a 1D array. Which loop direction?',
    'Upward: for (int a = coin; a <= amount; a++)',
    [
      'Downward: for (int a = amount; a >= coin; a--)',
      'Random order',
      'Only the last coin matters',
    ],
    'Going upward lets dp[a - coin] already include this coin, so the coin can be reused. That is exactly what unlimited supply needs.',
    'Unbounded reuses itself, so go upward.',
  ),
  t(
    'dp-coin-init',
    'Dynamic programming',
    'Coin Change: initialize dp for the minimum number of coins (amount is the target, dp has amount + 1 slots).',
    ['Arrays.fill(dp, amount + 1); dp[0] = 0;'],
    'Any valid answer uses at most amount coins, so amount + 1 works as "impossible" and cannot overflow when you add 1. Integer.MAX_VALUE + 1 would wrap negative.\nAt the end, return -1 if dp[amount] is still amount + 1.',
    'Infinity that survives +1: amount + 1, not MAX_VALUE.',
  ),
  m(
    'dp-order-combinations',
    'Dynamic programming',
    'Coin Change II counts COMBINATIONS. Which loop order?',
    'Coins in the outer loop, amounts in the inner loop',
    ['Amounts outer, coins inner', 'Either order gives the same count', 'Only one loop is needed'],
    'With coins outside, each coin is considered in a fixed order, so [1, 2] is counted once. With amounts outside, [1, 2] and [2, 1] are both counted, which gives the count of permutations.',
    'Combinations: items outside. Permutations: target outside.',
  ),
  m(
    'dp-lcs-size',
    'Dynamic programming',
    'For strings of length m and n, what size is the LCS table and why?',
    '(m + 1) by (n + 1), so row and column 0 represent the empty prefix',
    ['m by n', 'm by m', '(m - 1) by (n - 1)'],
    'The extra row and column hold the base case (empty string gives 0) so the recurrence never needs an index check at 0.',
    'Add one for the empty prefix.',
  ),
  m(
    'dp-lcs-substring',
    'Dynamic programming',
    'How does Longest Common SUBSTRING differ from subsequence in the DP?',
    'On a mismatch the cell resets to 0 instead of taking the max of neighbors',
    ['It uses a 1D array', 'It sorts the strings first', 'It needs three strings'],
    'A substring must be contiguous, so a mismatch breaks the run. Track the maximum over all cells instead of reading the bottom-right corner.',
    'Mismatch resets to 0, answer is the table maximum.',
  ),
  m(
    'dp-memo-check',
    'Dynamic programming',
    'Top-down DP is still exponential. What is the most likely mistake?',
    'The memo is never checked, or it is checked after the recursive calls',
    ['The recursion is too deep', 'The base case is correct', 'The array is too large'],
    'Memoization only helps if you return the cached value BEFORE recursing and store the result before returning. Also use a sentinel such as -1 that cannot be a real answer.',
    'Check memo first, store before returning.',
  ),
  m(
    'dp-rolling',
    'Dynamic programming',
    'A grid DP only reads the previous row. How do you cut space?',
    'Keep one or two rows and reuse them',
    ['Use recursion', 'Sort the grid', 'Store only the diagonal'],
    'If dp[r][c] depends only on row r - 1 (and the current row), a single array updated in the right direction does the same work in O(columns) space.',
    'Depends on the last row only: keep one row.',
  ),
  m(
    'dp-house-robber-circle',
    'Dynamic programming',
    'House Robber II (houses in a circle). What is the standard variation?',
    'Run the linear solution twice: without the first house and without the last, take the max',
    ['Run it once on the whole array', 'Run it on half the array', 'Add a dummy house'],
    'The first and last houses are adjacent in a circle, so they cannot both be robbed. Excluding one of them each time turns the circle into two lines. Handle n = 1 separately.',
    'Break the circle into two lines.',
  ),
  m(
    'dp-lis-search',
    'Dynamic programming',
    'LIS in O(n log n) keeps a tails array. What do you do with each number?',
    'Binary search for the first tail >= number and overwrite it (or append if none)',
    ['Append it always', 'Sort the tails again', 'Remove the smallest tail'],
    'tails[i] is the smallest possible ending value of an increasing subsequence of length i + 1. Replacing a larger tail with a smaller one keeps more room for extension. The array length is the LIS length, but the array itself is not a valid subsequence.',
    'First tail >= x gets replaced (strict increase).',
  ),
  m(
    'dp-mod-negative',
    'Dynamic programming',
    'You subtract inside a modulo computation and get a negative answer. What is the fix?',
    'Add the modulus before taking the remainder: ((a - b) % MOD + MOD) % MOD',
    ['Use an if to print abs', 'Use int instead of long', 'Skip the modulo'],
    'Java % keeps the sign of the dividend, so a negative difference stays negative. Add MOD to bring it into range, then mod again.',
    'Negative mod: add MOD, mod again.',
  ),

  // Linked list
  t(
    'll-dummy',
    'Linked lists',
    'Create a dummy head node and a tail pointer for building a result list.',
    ['ListNode dummy = new ListNode(0); ListNode tail = dummy;'],
    'A dummy node removes the special case for the first node, whether you are building, merging or deleting. Return dummy.next at the end.',
    'Dummy head, return dummy.next.',
  ),
  m(
    'll-reverse-save-next',
    'Linked lists',
    'Reversing a list: what must you do BEFORE changing cur.next?',
    'Save cur.next in a temporary variable',
    ['Set cur to null', 'Copy the list', 'Nothing'],
    'Pointing cur.next to prev destroys the only link to the rest of the list. Save the next node first, then rewire, then advance prev and cur.',
    'Save next, rewire, advance.',
    r`while (cur != null) {
    // save next here
    cur.next = prev;
    prev = cur;
    cur = nxt;
}`,
  ),
  m(
    'll-reverse-return',
    'Linked lists',
    'After the reverse loop ends (cur == null), what do you return?',
    'prev',
    ['cur', 'head', 'dummy'],
    'The loop ends when cur falls off the end. prev is then the last node processed, which is the new head. head is now the tail of the reversed list.',
    'The loop ends with cur null: the answer is prev.',
  ),
  t(
    'll-fast-condition',
    'Linked lists',
    'Write the loop condition for fast and slow pointers that never throws a NullPointerException.',
    ['while (fast != null && fast.next != null)'],
    'fast moves two steps, so you need both fast and fast.next to be non-null before reading fast.next.next. Check fast first, since && short-circuits.',
    'Guard fast, then fast.next.',
  ),
  m(
    'll-cut-tail',
    'Linked lists',
    'You split a list into two halves. What detail is easy to forget?',
    'Set the end of the first half to null (slow.next = null)',
    ['Reverse the second half', 'Create a new head', 'Nothing'],
    'Without cutting, the first half still points into the second half, so recursion or reversal later sees a longer list and may cycle.',
    'Cut the link after splitting.',
  ),
  m(
    'll-cycle-start',
    'Linked lists',
    'Linked List Cycle II: after slow and fast meet, how do you find the cycle start?',
    'Reset one pointer to head and move both one step at a time until they meet',
    ['Move fast two more steps', 'Count the cycle and subtract', 'Return the meeting node'],
    'By the Floyd argument, the distance from head to the cycle start equals the distance from the meeting point to the start going forward. Moving both at the same speed makes them meet at the start.',
    'Restart one at head, same speed.',
  ),
  m(
    'll-nth-end',
    'Linked lists',
    'Remove Nth From End: why is a dummy head needed?',
    'The node to delete might be the head itself',
    ['To make the list circular', 'To sort the list', 'To avoid recursion'],
    'Deleting needs the previous node. For the head there is no previous node, so a dummy gives one. Move fast n steps ahead, then move both until fast is at the last node.',
    'Deleting the head needs a dummy.',
  ),

  // Trees
  m(
    'tree-null-first',
    'Trees',
    'In a recursive tree method, what comes first?',
    'The null base case',
    ['The left recursion', 'The result calculation', 'The right recursion'],
    'Every recursive call may hit a null child. Return the neutral value first (0 for depth, true for validity, null for search) so the rest of the method can safely read node.val.',
    'Null check first.',
  ),
  m(
    'tree-bst-bounds',
    'Trees',
    'Validate BST: why can using int bounds fail?',
    'A node value can equal Integer.MIN_VALUE or MAX_VALUE, so use long or null bounds',
    ['int is too slow', 'Bounds are not needed', 'BST values are always positive'],
    'Starting with int bounds of MIN_VALUE and MAX_VALUE wrongly rejects a valid tree that contains those values. Use Long.MIN_VALUE and MAX_VALUE, or Integer wrapper bounds that start as null.',
    'Start the range open: long or null bounds.',
  ),
  m(
    'tree-max-path-return',
    'Trees',
    'Binary Tree Maximum Path Sum: what does the recursive method RETURN?',
    'The best downward path from this node using at most one child',
    [
      'The best path through this node using both children',
      'The global maximum',
      'The sum of the whole subtree',
    ],
    'A path that goes up to the parent can only continue through one child, so return node + max(0, best child gain). The path that uses both children is recorded in the global maximum, but never returned.\nClamp negative gains to 0.',
    'Return one branch up, record both at the node.',
  ),
  m(
    'tree-inorder-iter',
    'Trees',
    'Iterative inorder traversal: what is the loop shape?',
    'Push all left children, pop and visit, then move to the right child',
    ['Push the root and its children together', 'Use a queue', 'Pop the root first'],
    'The stack holds the path of ancestors still to visit. Going left as far as possible, then visiting a node and switching to its right subtree, produces the sorted order for a BST.',
    'Go left, pop, visit, go right.',
  ),
  m(
    'tree-height-check',
    'Trees',
    'Balanced Binary Tree in O(n). What is the trick?',
    'Return the height from the recursion and use -1 (or a flag) to signal imbalance',
    ['Compute height separately at every node', 'Sort the nodes first', 'Use BFS only'],
    'Recomputing the height at every node is O(n²). Doing the check inside the same post-order pass and propagating a sentinel keeps it O(n).',
    'Height and check in the same pass.',
  ),
  m(
    'tree-lca-bst-vs-bt',
    'Trees',
    'Lowest Common Ancestor: when can you skip recursion and just walk down?',
    'In a BST: go left if both values are smaller, right if both larger, else stop',
    ['In any binary tree', 'Never', 'Only for complete trees'],
    'BST order tells you which side holds both nodes. A plain binary tree has no order, so you need the post-order combine (return the node if it equals p or q, and the node where both sides report non-null is the LCA).',
    'BST gives direction, a plain tree needs both subtrees.',
  ),

  // Intervals
  m(
    'int-merge-condition',
    'Intervals',
    'Merge Intervals (sorted by start): when does the next interval merge into the last one?',
    'When next.start <= last.end',
    ['When next.start < last.end', 'When next.end <= last.end', 'When next.start == last.end only'],
    'Touching intervals like [1, 3] and [3, 5] merge, so use <=. When merging, set the end to max(last.end, next.end), because the next one can lie entirely inside the last.',
    'Use <= and take the max end.',
  ),
  m(
    'int-greedy-end',
    'Intervals',
    'Non-overlapping Intervals (fewest removals). What do you sort by?',
    'End time',
    ['Start time', 'Length', 'Random order'],
    'Keeping the interval that ends earliest leaves the most room for the rest (activity selection). Sorting by start can pick a very long interval that blocks many others.',
    'Maximum set of non-overlapping: sort by end.',
  ),
  m(
    'int-rooms',
    'Intervals',
    'Meeting Rooms II. When a meeting starts, how do you decide to reuse a room?',
    'If the earliest ending meeting (heap top) ends at or before the new start, pop it and reuse',
    ['Always allocate a new room', 'Compare with the longest meeting', 'Sort by length'],
    'A min-heap of end times gives the first room to free up. If it is free by the new start time, reuse it (pop then push the new end). The heap size at the end is the room count.',
    'Min-heap of end times: pop if free.',
  ),
  m(
    'int-insert',
    'Intervals',
    'Insert Interval into a sorted, non-overlapping list. What are the three phases?',
    'Copy those ending before it, merge all that overlap, copy the rest',
    ['Sort everything then merge', 'Binary search then shift', 'Merge from the right only'],
    'Because the list is already sorted, one pass works: intervals with end < new.start go first, the overlapping ones fold into the new interval (min start, max end), and the remaining ones follow.',
    'Before, overlap, after.',
  ),

  // Union-Find and trie
  t(
    'uf-compress',
    'Union-Find and trie',
    'Union-Find find with path compression.',
    ['int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }'],
    'Compression points every node on the path directly at the root, so later finds are almost constant time. Combined with union by size or rank, each operation is near O(1) amortized.',
    'Find: assign the root back on the way up.',
  ),
  m(
    'uf-union-check',
    'Union-Find and trie',
    'Redundant Connection: how does union tell you an edge forms a cycle?',
    'The two endpoints already have the same root',
    ['Their degrees are equal', 'One of them is a leaf', 'The edge weight is the largest'],
    'If both ends are already connected, adding this edge creates a cycle. Return the edge when the roots match, and merge otherwise. For component counts, decrement the counter only on a real merge.',
    'Same root before union means cycle.',
  ),
  m(
    'trie-end-flag',
    'Union-Find and trie',
    'A trie holds "apple". What distinguishes search("app") from startsWith("app")?',
    'search also requires the end-of-word flag at the last node',
    ['search walks fewer nodes', 'startsWith needs a HashMap', 'They are identical'],
    'Both walk the same path. A word is stored only if the last node is marked as an end. A prefix just needs the path to exist.',
    'Prefix: path exists. Word: path exists AND end flag.',
  ),
  m(
    'trie-index',
    'Union-Find and trie',
    'For lowercase words, how do you pick the child slot in a trie node?',
    "children[c - 'a']",
    ['children[c]', 'children[c + 1]', 'children[c % 2]'],
    "Subtracting 'a' maps a to 0 through z to 25 into a 26-slot array. Using c directly indexes up to 122 and may overflow the array.",
    "c minus 'a' gives 0 to 25.",
  ),

  // Java pitfalls
  m(
    'java-string-concat',
    'Java pitfalls',
    'You append to a String 100,000 times in a loop. What is the fix?',
    'Use a StringBuilder',
    ['Use String.format', 'Use += with final', 'Use intern()'],
    'Each += creates a new string and copies the old content, which is O(n²) in total. StringBuilder appends into one buffer in amortized O(1).',
    'Loop plus string means StringBuilder.',
  ),
  m(
    'java-list-remove',
    'Java pitfalls',
    'For `List<Integer> list`, what does list.remove(1) do?',
    'Removes the element at INDEX 1',
    ['Removes the value 1', 'Removes the last element', 'Throws a ClassCastException'],
    'The int overload remove(int index) wins over remove(Object). To remove the VALUE 1, call list.remove(Integer.valueOf(1)).',
    'int means index, Integer means value.',
  ),
  m(
    'java-integer-equals',
    'Java pitfalls',
    'Comparing two Integer objects holding 1000 with ==. What happens?',
    'It can be false: == compares references, and only small values (-128 to 127) are cached',
    ['It is always true', 'It always throws', 'It compares digits'],
    'Autoboxing reuses cached objects for small numbers, so tests pass on small inputs and fail on large ones. Use equals(), or compare as primitive ints.',
    'Boxed values: equals, not ==.',
  ),
  m(
    'java-string-equals',
    'Java pitfalls',
    'Why compare strings with equals instead of ==?',
    '== compares references, equals compares content',
    ['== is slower', 'equals ignores case', 'There is no difference'],
    '== can be true for interned literals and false for equal strings built at runtime, which makes bugs intermittent.',
    'Strings: always equals.',
  ),
  m(
    'java-overflow-long',
    'Java pitfalls',
    'Multiplying two ints that are each up to 10^5. What do you do?',
    'Cast one to long before multiplying: (long) a * b',
    ['Cast the result: (long) (a * b)', 'Use double', 'Nothing: int is enough'],
    'The int product overflows before the cast takes effect if you cast afterwards. Casting one operand first makes the multiplication happen in 64 bits.',
    'Cast BEFORE you multiply.',
  ),
  m(
    'java-abs-min',
    'Java pitfalls',
    'What does Math.abs(Integer.MIN_VALUE) return?',
    'Integer.MIN_VALUE (still negative), because +2^31 does not fit in an int',
    ['2147483648', '0', 'It throws'],
    'The negation overflows back to the same value. Watch for it when handling negative n in Pow(x, n): widen to long first.',
    'abs of MIN_VALUE is still negative.',
  ),
  m(
    'java-arrays-aslist',
    'Java pitfalls',
    'Arrays.asList(intArray) for an int[] gives a List of what?',
    'A List<int[]> with a single element, the array itself',
    ['A List<Integer> of its values', 'A List<Object>', 'It does not compile'],
    'Generics cannot hold primitives, so the whole array is one element. Use Arrays.stream(arr).boxed().toList() or an Integer[].',
    'Primitive arrays do not spread into asList.',
  ),
  m(
    'java-concurrent-mod',
    'Java pitfalls',
    'You remove from an ArrayList inside a for-each loop. What happens?',
    'ConcurrentModificationException (use removeIf or an iterator)',
    ['It works', 'It skips the removed element silently', 'A compile error'],
    'The iterator detects that the list changed under it. removeIf(predicate) or iterator.remove() are the safe ways.',
    'Remove while iterating: removeIf.',
  ),
  t(
    'java-to-array',
    'Java pitfalls',
    'Convert List<int[]> result to int[][].',
    [
      'result.toArray(new int[0][]);',
      'result.toArray(new int[result.size()][]);',
      'int[][] arr = result.toArray(new int[0][]);',
    ],
    'Pass an array of the target type so toArray returns int[][] instead of Object[]. The size argument is only a hint.',
    'toArray with new int[0][].',
  ),
  m(
    'java-array-key',
    'Java pitfalls',
    'You use an int[] as a HashMap or HashSet key. What goes wrong?',
    'Arrays use identity equals and hash, so equal-looking arrays are different keys',
    ['Nothing: arrays hash by content', 'It throws at put', 'It sorts the key'],
    'Convert the array to a List<Integer>, a String such as Arrays.toString(arr), or a record, so equals and hashCode use the contents.',
    'Arrays are poor keys: wrap or stringify.',
  ),
  t(
    'java-sort-chars',
    'Java pitfalls',
    'Canonical key for an anagram: sort the characters of s into a String key.',
    [
      'char[] c = s.toCharArray(); Arrays.sort(c); String key = new String(c);',
      'char[] c = s.toCharArray(); Arrays.sort(c); String key = String.valueOf(c);',
    ],
    'Strings are immutable, so convert to a char array, sort it, and build a new String. Arrays.sort on a char array is O(k log k).',
    'toCharArray, sort, new String.',
  ),
  m(
    'java-char-math',
    'Java pitfalls',
    "What is `'d' - 'a'` in Java?",
    '3',
    ["'3'", '100', 'A compile error'],
    'Characters are numbers, so subtracting gives the integer offset. This is how you index a 26-slot counts array.',
    "c minus 'a' is the index.",
  ),
  t(
    'design-lru',
    'Design',
    'LRU Cache with LinkedHashMap: write the constructor call that makes it access-ordered (capacity is cap).',
    ['super(cap, 0.75f, true);'],
    'The third argument true switches the map from insertion order to access order, so get and put move an entry to the end. Override removeEldestEntry to return size() > capacity, and the oldest entry is evicted automatically.',
    'Access order is the third constructor argument.',
    r`class LRU<K, V> extends LinkedHashMap<K, V> {
    private final int cap;
    LRU(int cap) {
        // call the super constructor
        this.cap = cap;
    }
    protected boolean removeEldestEntry(Map.Entry<K, V> e) { return size() > cap; }
}`,
  ),
];

export const criticalQuiz: Quiz = {
  slug: 'critical-checks',
  title: 'Critical Checks and Variations',
  description:
    'The one line or check that makes a solution correct, and the variation each classic problem needs: copying the path in backtracking, merge sort twists, BFS visited timing, DP loop direction and more.',
  source: {
    label: 'Recognise the Pattern (cheat sheet)',
    href: '/resources/ds-algorithms-cheat-sheet.html#start',
  },
  /** Ordered by importance: random rounds of N take the first N. */
  questions: rankQuestions(authored, criticalPriority),
};
