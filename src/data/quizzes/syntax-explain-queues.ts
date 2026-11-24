import type { Explanation } from './syntax-explanations-types';

export const dequeExplanations: Record<string, Explanation> = {
  'dq-1': {
    explain:
      'This makes a stack. `ArrayDeque` is a resizable array that is fast at both ends, so it works as a stack (last in, first out) and as a queue.\nThe variable is typed as `Deque`, which gives you `push`, `pop` and `peek`. The old `Stack` class is slow because it is synchronized, so avoid it.',
    remember: 'Stack in Java = `Deque` + `ArrayDeque`. "Not Stack, never Stack."',
  },
  'dq-2': {
    explain:
      '`stack.push(1)` adds 1 to the top of the stack, which is the front of the deque. The next `pop` will return it.',
    remember: 'Push puts on top, pop takes from top.',
  },
  'dq-3': {
    explain:
      '`stack.peek()` returns the top element without removing it. On an empty stack it returns null, so assigning to a primitive `int` would throw. Check `isEmpty()` first.',
    remember: 'Peek = look, do not take.',
  },
  'dq-4': {
    explain:
      'BFS needs a queue (first in, first out). Using `Queue<int[]>` lets each entry carry a pair like {row, col}.\nThe variable is typed `Queue`, so only queue methods (`offer`, `poll`, `peek`) are visible. `ArrayDeque` is the fast implementation behind it.',
    remember:
      'BFS queue = `Queue<int[]> q = new ArrayDeque<>()`. Memorize this line, it appears in every grid problem.',
  },
  'dq-5': {
    explain:
      '`q.offer(new int[]{0, 0})` adds a new two-element array to the back of the queue. Each array is the pair (row, col) of the start cell.\n`offer` is preferred over `add` on a Queue because it signals failure with false instead of an exception (ArrayDeque never fails).',
    remember: 'Offer an array literal: `offer(new int[]{r, c})`.',
  },
  'dq-6': {
    explain:
      '`q.poll()` removes and returns the head of the queue. On an empty queue it returns null instead of throwing, unlike `remove()`.\nSince the element type is `int[]`, the variable can hold null.',
    remember: '"Poll = polite": returns null. "Remove = rude": throws.',
  },
  'dq-7': {
    explain:
      '`dq.offerFirst(1)` inserts 1 at the front of the deque. `offerLast` (or `offer`) inserts at the back. `addFirst` does the same thing but throws on failure instead of returning false.',
    remember: 'A deque has two ends: first and last. Add with `offerFirst`/`offerLast`.',
  },
  'dq-8': {
    explain:
      '`dq.peekLast()` returns the last element without removing it, or null when empty. `peekFirst` reads the front.',
    remember: 'Peek + which end: `peekFirst`, `peekLast`.',
  },
  'dq-9': {
    explain:
      '`LinkedList` implements Queue, so it works for a simple queue and also allows null elements. `ArrayDeque` is usually faster and uses less memory, so prefer it unless you need nulls.',
    remember:
      'You will see `Queue<Integer> queue = new LinkedList<>()` in lots of solutions. Both forms are fine.',
  },
  'dq-10': {
    explain:
      '`queue.offer(1)` adds an element at the tail. If the queue is size-limited it returns false instead of throwing. It is the standard enqueue call.',
    remember: 'Enqueue = `offer`.',
  },
  'dq-11': {
    explain:
      '`queue.poll()` removes and returns the element at the head, or null if the queue is empty. The variable is `Integer` (not `int`) because the result may be null.',
    remember: 'Dequeue = `poll`. Use `Integer` if it can be null.',
  },
  'dq-12': {
    explain:
      '`stack.pop()` removes the top element and returns it. On an empty deque it throws NoSuchElementException, so test `isEmpty()` first.',
    remember: 'Pop takes the top and throws on empty.',
  },
  'dq-13': {
    explain:
      '`stack.isEmpty()` is true when there are no elements. Prefer it over `size() == 0`: it reads better and is just as fast.',
    remember: 'Guard every pop or peek with `!stack.isEmpty()`.',
  },
  'dq-14': {
    explain:
      '`dq.pollLast()` removes and returns the last element, or null if the deque is empty. `removeLast()` does the same but throws on empty.\nIt is the core move of a sliding-window maximum, where you drop smaller values from the back.',
    remember: '`poll` is the null-returning one: `pollFirst`, `pollLast`.',
  },
  'dq-15': {
    explain:
      'BFS by levels must process exactly the nodes that were in the queue when the level started. New nodes are added during the loop, so the size is read once before it.\n- `int s = queue.size()` captures the level size once.\n- `s > 0; s--` runs the loop that many times.\nThe alternative form stores `size` in a variable and loops `for (int i = 0; i < size; i++)`.',
    remember: 'Freeze the size, then loop that many times. "Size first, then loop."',
  },
  'dq-16': {
    explain:
      'This is the heart of the "next greater element" pattern. The stack holds indexes whose values are waiting for something bigger.\n- `!stack.isEmpty()` makes sure there is a top to look at.\n- `nums[stack.peek()] < nums[i]` means the new value beats the value at the top index, so that top is resolved and gets popped.\nThe `&&` order matters: check empty first.',
    remember:
      '"While there is a top and the top is smaller than the current, pop." Check empty first.',
  },
  'dq-17': {
    explain:
      '`while (!queue.isEmpty())` keeps running until every queued element has been processed. It is the outer loop of BFS and of any "process until nothing is left" task.',
    remember: 'Loop until empty: `while (!queue.isEmpty())`.',
  },
  'dq-18': {
    explain:
      '`new boolean[n]` creates n flags, all false. In graph and grid searches it records which nodes you have already seen, so you do not visit them twice.\nIndex it by node number.',
    remember:
      'Visited array: `boolean[] visited = new boolean[n]`. For a grid, `new boolean[m][n]`.',
  },
};

export const pqExplanations: Record<string, Explanation> = {
  'pq-1': {
    explain:
      'A PriorityQueue is a heap. With no comparator it is a min-heap: `poll` always returns the smallest element.\n`peek` is O(1), while `offer` and `poll` are O(log n).',
    remember: 'Default PriorityQueue = min-heap.',
  },
  'pq-2': {
    explain:
      'To flip the order you pass a comparator. `Collections.reverseOrder()` is the ready-made one that sorts from largest to smallest, so the largest element sits at the top.',
    remember: 'Max-heap = min-heap + `Collections.reverseOrder()`.',
  },
  'pq-3': {
    explain:
      'The lambda `(x, y) -> Integer.compare(x[1], y[1])` tells the heap how to rank two arrays: by the value at index 1, smallest first.\n`Integer.compare` returns a negative, zero or positive number safely. Writing `x[1] - y[1]` can overflow with large or negative values.',
    remember: 'Compare the field you care about with `Integer.compare`, never with subtraction.',
  },
  'pq-4': {
    explain:
      '`minHeap.peek()` returns the smallest element without removing it, or null when empty. It is O(1).',
    remember: 'Peek the top, poll the top.',
  },
  'pq-5': {
    explain:
      '`minHeap.poll()` removes and returns the smallest element in O(log n), or null if empty. It is how Dijkstra and merge-k-lists keep taking the next best item.',
    remember: 'Poll gives the next smallest from a min-heap.',
  },
  'pq-6': {
    explain:
      'Same as before: passing `Collections.reverseOrder()` reverses the natural ordering, so the heap hands out the largest value first.',
    remember: 'Reverse order = max-heap.',
  },
  'pq-7': {
    explain:
      '`minHeap.offer(5)` inserts 5 and the heap restores its ordering in O(log n). `add` works too and does the same thing.',
    remember: 'Insert with `offer`, same word as the queue.',
  },
  'pq-8': {
    explain:
      '`minHeap.size()` returns how many elements the heap holds. It is O(1) and is what you compare against k in top-k problems.',
    remember: 'Collections: `size()`. Arrays: `length`.',
  },
  'pq-9': {
    explain:
      'The lambda orders the arrays by their first element, ascending. The two parameters are two arrays being compared, so `a[0]` and `b[0]` read their first values.\nThe equivalent shorter form is `Comparator.comparingInt(a -> a[0])`.',
    remember: 'Comparator lambda = "(a, b) -> compare their key".',
  },
  'pq-10': {
    explain:
      'This heap ranks keys by how often they occur, lowest frequency first.\n- `map.get(a)` is the frequency of key a.\n- The comparator subtracts to order ascending.\nKeep it at size k, removing the smallest each time it grows, and what remains are the k most frequent keys.',
    remember: 'Top-k frequent = min-heap of size k ordered by frequency.',
  },
  'pq-11': {
    explain:
      'After each `offer`, if the heap has more than k elements, `poll` throws away the smallest. Over time the heap keeps the k largest values, and its top is the k-th largest.\nTotal cost is O(n log k), better than sorting everything.',
    remember: '"K largest = min-heap of size k." You evict the smallest each time.',
  },
};
