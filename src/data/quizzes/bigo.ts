import type { Quiz, QuizQuestion } from './types';
import { mc, r, rankQuestions } from './helpers';
import { bigoPriority } from './bigo-priority';
import { bigoExplanations } from './bigo-explanations';

const authored: QuizQuestion[] = [
  // Reading constraints
  mc(
    'con-1',
    'Reading constraints',
    'n is up to 10^5. Which complexity is the target?',
    'O(n log n) or better',
    ['O(n²)', 'O(2^n)', 'O(n!)'],
    {
      note: 'About 10^8 simple operations fit in a second: n² would be 10^10.',
    },
  ),
  mc(
    'con-2',
    'Reading constraints',
    'n is up to 1,000. Which complexity is comfortably fine?',
    'O(n²)',
    ['O(2^n)', 'O(n!)', 'O(3^n)'],
  ),
  mc(
    'con-3',
    'Reading constraints',
    'Which constraint hints that subsets or backtracking over all choices is intended?',
    'n ≤ 20',
    ['n ≤ 10^5', 'n ≤ 10^6', 'n ≤ 10^9'],
    {
      note: '2^20 is about a million, so exponential is affordable only for tiny n.',
    },
  ),
  mc(
    'con-4',
    'Reading constraints',
    'A single number n goes up to 10^9. Which complexity will NOT run in time?',
    'O(n)',
    ['O(log n)', 'O(√n)', 'O(1)'],
  ),
  mc('con-5', 'Reading constraints', 'n is up to 10^6. Which complexity is too slow?', 'O(n²)', [
    'O(n)',
    'O(n log n)',
    'O(log n)',
  ]),
  mc(
    'con-6',
    'Reading constraints',
    'Roughly how many simple operations can a judge run in about a second?',
    'About 10^8',
    ['About 10^5', 'About 10^11', 'About 10^13'],
  ),
  mc(
    'con-7',
    'Reading constraints',
    'n is up to 40 and you need all subsets. What classic technique brings 2^40 down?',
    'Meet in the middle (two halves of 2^20)',
    ['Binary search on the answer', 'A bigger heap', 'Sorting the input'],
  ),

  // Java collections
  mc(
    'col-1',
    'Java collections',
    'Average time of HashMap.get or put?',
    'O(1)',
    ['O(log n)', 'O(n)', 'O(n log n)'],
    {
      note: 'Worst case is bad hashing: O(n), or O(log n) once a bucket treeifies (Java 8+).',
    },
  ),
  mc('col-2', 'Java collections', 'Average time of HashSet.contains?', 'O(1)', [
    'O(log n)',
    'O(n)',
    'O(n²)',
  ]),
  mc('col-3', 'Java collections', 'Time of TreeMap.get or TreeSet.contains?', 'O(log n)', [
    'O(1)',
    'O(n)',
    'O(n log n)',
  ]),
  mc('col-4', 'Java collections', 'Time of PriorityQueue offer and poll?', 'O(log n)', [
    'O(1)',
    'O(n)',
    'O(n log n)',
  ]),
  mc('col-5', 'Java collections', 'Time of PriorityQueue peek?', 'O(1)', [
    'O(log n)',
    'O(n)',
    'O(n log n)',
  ]),
  mc(
    'col-6',
    'Java collections',
    'Time of PriorityQueue.remove(Object)?',
    'O(n)',
    ['O(1)', 'O(log n)', 'O(n log n)'],
    {
      note: 'It scans for the element first. Use a lazy-deletion set if you need many removals.',
    },
  ),
  mc(
    'col-7',
    'Java collections',
    'Time to build a PriorityQueue from n existing elements in one constructor call (heapify)?',
    'O(n)',
    ['O(log n)', 'O(n log n)', 'O(n²)'],
    {
      note: 'Adding n elements one by one costs O(n log n); bulk heapify is O(n).',
    },
  ),
  mc('col-8', 'Java collections', 'Time of ArrayList.get(i)?', 'O(1)', [
    'O(log n)',
    'O(n)',
    'O(i)',
  ]),
  mc(
    'col-9',
    'Java collections',
    'Time of ArrayList.add(x) at the end?',
    'O(1) amortized',
    ['O(log n)', 'O(n) always', 'O(n log n)'],
    {
      note: 'The backing array doubles occasionally, so the average cost per add is constant.',
    },
  ),
  mc(
    'col-10',
    'Java collections',
    'Time of ArrayList.add(0, x) or remove(0)?',
    'O(n)',
    ['O(1)', 'O(log n)', 'O(n log n)'],
    {
      note: 'Every element shifts. Use ArrayDeque if you need cheap front operations.',
    },
  ),
  mc('col-11', 'Java collections', 'Time of ArrayList.contains(x)?', 'O(n)', [
    'O(1)',
    'O(log n)',
    'O(n log n)',
  ]),
  mc('col-12', 'Java collections', 'Time of ArrayDeque push, pop, offer and poll?', 'O(1)', [
    'O(log n)',
    'O(n)',
    'O(n log n)',
  ]),
  mc(
    'col-13',
    'Java collections',
    'Time of LinkedList.get(i)?',
    'O(n)',
    ['O(1)', 'O(log n)', 'O(i²)'],
    {
      note: 'Walks the nodes from an end. LinkedList is rarely the right choice.',
    },
  ),
  mc(
    'col-14',
    'Java collections',
    'Time of Collections.sort or Arrays.sort on n elements?',
    'O(n log n)',
    ['O(n)', 'O(log n)', 'O(n²)'],
  ),
  mc('col-15', 'Java collections', 'Time of TreeSet.floor or ceiling?', 'O(log n)', [
    'O(1)',
    'O(n)',
    'O(n log n)',
  ]),
  mc(
    'col-16',
    'Java collections',
    'Time of Arrays.fill, Arrays.copyOf or array.clone() on n elements?',
    'O(n)',
    ['O(1)', 'O(log n)', 'O(n log n)'],
  ),
  mc('col-17', 'Java collections', 'Time of Collections.reverse(list) for n elements?', 'O(n)', [
    'O(1)',
    'O(log n)',
    'O(n log n)',
  ]),
  mc(
    'col-18',
    'Java collections',
    'Time of list.sublist copy via new ArrayList<>(list.subList(a, b)) with k elements?',
    'O(k)',
    ['O(1)', 'O(log k)', 'O(n)'],
  ),

  // Strings
  mc(
    'str-1',
    'Strings',
    'Cost of building a String by s += c in a loop of n iterations?',
    'O(n²)',
    ['O(n)', 'O(n log n)', 'O(1)'],
    {
      note: 'Each concatenation copies the whole string. Use StringBuilder.',
    },
  ),
  mc('str-2', 'Strings', 'Cost of n appends to a StringBuilder?', 'O(n) total', [
    'O(n²)',
    'O(n log n)',
    'O(log n)',
  ]),
  mc(
    'str-3',
    'Strings',
    'Time of s.substring(i, j)?',
    'O(j - i)',
    ['O(1)', 'O(log n)', 'O(1) amortized'],
    {
      note: 'Since Java 7u6 it copies the characters instead of sharing the array.',
    },
  ),
  mc('str-4', 'Strings', 'Time of s.charAt(i) and s.length()?', 'O(1)', [
    'O(i)',
    'O(n)',
    'O(log n)',
  ]),
  mc('str-5', 'Strings', 'Time of s.equals(t) for strings of length n?', 'O(n)', [
    'O(1)',
    'O(log n)',
    'O(n²)',
  ]),
  mc(
    'str-6',
    'Strings',
    'A HashMap<String, V> with keys of length k: what does get cost?',
    'O(k)',
    ['O(1) regardless of k', 'O(log k)', 'O(k²)'],
    {
      note: 'Hashing and comparing a string walks its characters.',
    },
  ),
  mc(
    'str-7',
    'Strings',
    'Sorting n words of length k each into groups by sorted characters costs?',
    'O(n · k log k)',
    ['O(n log n)', 'O(n · k)', 'O(k log n)'],
    {
      note: 'Each word is sorted in O(k log k). Counting letters instead makes it O(n · k).',
    },
  ),
  mc('str-8', 'Strings', 'Worst-case time of s.indexOf(t) with |s| = n and |t| = m?', 'O(n · m)', [
    'O(n + m)',
    'O(n)',
    'O(log n)',
  ]),

  // Analyzing code
  mc(
    'code-1',
    'Analyzing code',
    'What is the time complexity?',
    'O(n)',
    ['O(log n)', 'O(n²)', 'O(1)'],
    {
      context: r`for (int i = 0; i < n; i++) {
    sum += i;
}`,
    },
  ),
  mc(
    'code-2',
    'Analyzing code',
    'What is the time complexity?',
    'O(n²)',
    ['O(n)', 'O(n log n)', 'O(2n)'],
    {
      context: r`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        count++;`,
    },
  ),
  mc(
    'code-3',
    'Analyzing code',
    'What is the time complexity?',
    'O(n²)',
    ['O(n)', 'O(n log n)', 'O(n / 2)'],
    {
      context: r`for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        check(i, j);`,
      note: 'About n(n-1)/2 pairs. Constants and lower terms drop out.',
    },
  ),
  mc(
    'code-4',
    'Analyzing code',
    'What is the time complexity?',
    'O(log n)',
    ['O(n)', 'O(√n)', 'O(n log n)'],
    {
      context: r`for (int i = 1; i < n; i *= 2) {
    work();
}`,
    },
  ),
  mc(
    'code-5',
    'Analyzing code',
    'What is the time complexity?',
    'O(n)',
    ['O(n / 2)', 'O(log n)', 'O(n²)'],
    {
      context: r`for (int i = 0; i < n; i += 2) {
    work();
}`,
      note: 'O(n / 2) is just O(n): constant factors are ignored.',
    },
  ),
  mc(
    'code-6',
    'Analyzing code',
    'What is the time complexity?',
    'O(n log n)',
    ['O(n)', 'O(n²)', 'O(log n)'],
    {
      context: r`for (int i = 0; i < n; i++)
    for (int j = 1; j < n; j *= 2)
        work();`,
    },
  ),
  mc(
    'code-7',
    'Analyzing code',
    'What is the time complexity?',
    'O(n)',
    ['O(n²)', 'O(n log n)', 'O(2^n)'],
    {
      context: r`for (int i = 0; i < n; i++) a();
for (int j = 0; j < n; j++) b();`,
      note: 'Sequential loops add: O(n) + O(n) = O(n).',
    },
  ),
  mc(
    'code-8',
    'Analyzing code',
    'What is the time complexity?',
    'O(n · m)',
    ['O(n + m)', 'O(n²)', 'O(max(n, m))'],
    {
      context: r`for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        work();`,
    },
  ),
  mc(
    'code-9',
    'Analyzing code',
    'What is the time complexity?',
    'O(log n)',
    ['O(n)', 'O(n / 2)', 'O(√n)'],
    {
      context: r`while (n > 1) {
    n /= 2;
}`,
    },
  ),
  mc(
    'code-10',
    'Analyzing code',
    'What is the time complexity?',
    'O(√n)',
    ['O(n)', 'O(log n)', 'O(n log n)'],
    {
      context: r`for (int i = 1; (long) i * i <= n; i++) {
    work();
}`,
      note: 'Typical of divisor and primality checks.',
    },
  ),
  mc(
    'code-11',
    'Analyzing code',
    'What is the time complexity?',
    'O(n)',
    ['O(26 · n²)', 'O(n log n)', 'O(n · 26!)'],
    {
      context: r`for (char c : s.toCharArray()) {
    for (int k = 0; k < 26; k++)
        cnt[k] += (c - 'a' == k) ? 1 : 0;
}`,
      note: 'The inner loop is a constant 26, so it does not grow with n.',
    },
  ),
  mc(
    'code-12',
    'Analyzing code',
    'What is the time complexity?',
    'O(n³)',
    ['O(n²)', 'O(3n)', 'O(n log n)'],
    {
      context: r`for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++)
        for (int k = 0; k < n; k++)
            work();`,
    },
  ),
  mc(
    'code-13',
    'Analyzing code',
    'What is the time complexity?',
    'O(n)',
    ['O(n²)', 'O(n log n)', 'O(n · m)'],
    {
      context: r`for (int right = 0; right < n; right++) {
    while (left < right && bad(left, right)) left++;
}`,
      note: 'Sliding window: left only moves forward, so both pointers travel at most n steps in total.',
    },
  ),
  mc(
    'code-14',
    'Analyzing code',
    'What is the time complexity?',
    'O(n)',
    ['O(n²)', 'O(n log n)', 'O(2^n)'],
    {
      context: r`for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i])
        stack.pop();
    stack.push(i);
}`,
      note: 'Monotonic stack: each index is pushed once and popped at most once.',
    },
  ),

  // Recursion
  mc(
    'rec-1',
    'Recursion',
    'Time of naive recursive fib(n) = fib(n-1) + fib(n-2)?',
    'O(2^n)',
    ['O(n)', 'O(n²)', 'O(log n)'],
    {
      note: 'About 1.6^n calls, written O(2^n) as an upper bound.',
    },
  ),
  mc('rec-2', 'Recursion', 'Time of fib(n) with memoization?', 'O(n)', [
    'O(2^n)',
    'O(log n)',
    'O(n²)',
  ]),
  mc(
    'rec-3',
    'Recursion',
    'Recurrence T(n) = T(n/2) + O(1). What is T(n)?',
    'O(log n)',
    ['O(n)', 'O(n log n)', 'O(1)'],
    {
      note: 'Binary search.',
    },
  ),
  mc(
    'rec-4',
    'Recursion',
    'Recurrence T(n) = 2T(n/2) + O(n). What is T(n)?',
    'O(n log n)',
    ['O(n)', 'O(n²)', 'O(log n)'],
    {
      note: 'Merge sort.',
    },
  ),
  mc(
    'rec-5',
    'Recursion',
    'Recurrence T(n) = T(n-1) + O(1). Time and call-stack space?',
    'O(n) time, O(n) stack',
    ['O(1) time, O(1) stack', 'O(log n) time, O(log n) stack', 'O(n²) time, O(1) stack'],
  ),
  mc(
    'rec-6',
    'Recursion',
    'Recursion stack space of DFS on a skewed (linked-list-like) binary tree of n nodes?',
    'O(n)',
    ['O(log n)', 'O(1)', 'O(n²)'],
  ),
  mc(
    'rec-7',
    'Recursion',
    'Recursion stack space of DFS on a balanced binary tree of n nodes?',
    'O(log n)',
    ['O(n)', 'O(1)', 'O(n log n)'],
  ),
  mc(
    'rec-8',
    'Recursion',
    'Time of generating all subsets of n items and copying each?',
    'O(n · 2^n)',
    ['O(2^n)', 'O(n²)', 'O(n!)'],
  ),
  mc(
    'rec-9',
    'Recursion',
    'Time of generating all permutations of n items and copying each?',
    'O(n · n!)',
    ['O(n!)', 'O(2^n)', 'O(n²)'],
  ),

  // Algorithms
  mc('alg-1', 'Algorithms', 'Time of binary search on a sorted array?', 'O(log n)', [
    'O(n)',
    'O(n log n)',
    'O(1)',
  ]),
  mc(
    'alg-2',
    'Algorithms',
    'Time of merge sort, and its extra space?',
    'O(n log n) time, O(n) space',
    ['O(n²) time, O(1) space', 'O(n log n) time, O(1) space', 'O(n) time, O(n) space'],
  ),
  mc(
    'alg-3',
    'Algorithms',
    'Quick sort: average and worst-case time?',
    'O(n log n) average, O(n²) worst',
    ['O(n log n) both', 'O(n) average, O(n²) worst', 'O(n²) average, O(n log n) worst'],
  ),
  mc(
    'alg-4',
    'Algorithms',
    'Time of BFS or DFS on a graph stored as adjacency lists?',
    'O(V + E)',
    ['O(V · E)', 'O(V²)', 'O(E log V)'],
  ),
  mc('alg-5', 'Algorithms', 'Time of BFS or DFS over an m by n grid?', 'O(m · n)', [
    'O(m + n)',
    'O((m · n)²)',
    'O(m · n · log(m · n))',
  ]),
  mc(
    'alg-6',
    'Algorithms',
    "Time of Dijkstra's algorithm with a binary-heap priority queue?",
    'O((V + E) log V)',
    ['O(V + E)', 'O(V · E)', 'O(V²) always'],
  ),
  mc(
    'alg-7',
    'Algorithms',
    'Time of topological sort with in-degree counting (Kahn)?',
    'O(V + E)',
    ['O(V²)', 'O(E log V)', 'O(V · E)'],
  ),
  mc(
    'alg-8',
    'Algorithms',
    'Cost per operation of Union-Find with path compression and union by rank?',
    'Near O(1) amortized (inverse Ackermann)',
    ['O(log n)', 'O(n)', 'O(n log n)'],
  ),
  mc(
    'alg-9',
    'Algorithms',
    'Time to find the k-th largest of n numbers with a min-heap of size k?',
    'O(n log k)',
    ['O(n)', 'O(n log n)', 'O(k log n)'],
  ),
  mc('alg-10', 'Algorithms', 'Average time of quickselect for the k-th element?', 'O(n)', [
    'O(log n)',
    'O(n log n)',
    'O(n²)',
  ]),
  mc(
    'alg-11',
    'Algorithms',
    'Build a prefix-sum array, then answer q range-sum queries. Total time?',
    'O(n + q)',
    ['O(n · q)', 'O(q log n)', 'O(n log n + q)'],
  ),
  mc('alg-12', 'Algorithms', 'Time to insert or search a word of length L in a Trie?', 'O(L)', [
    'O(1)',
    'O(log n)',
    'O(n)',
  ]),
  mc(
    'alg-13',
    'Algorithms',
    'Time of the classic 0/1 knapsack DP with n items and capacity W?',
    'O(n · W)',
    ['O(n + W)', 'O(2^n)', 'O(n log W)'],
  ),
  mc(
    'alg-14',
    'Algorithms',
    'Time of longest common subsequence DP for strings of length m and n?',
    'O(m · n)',
    ['O(m + n)', 'O(2^(m + n))', 'O(max(m, n))'],
  ),
  mc('alg-15', 'Algorithms', 'Time of Floyd-Warshall all-pairs shortest paths?', 'O(V³)', [
    'O(V²)',
    'O(V · E)',
    'O(V log V)',
  ]),
  mc('alg-16', 'Algorithms', 'Time of merging two sorted lists of lengths n and m?', 'O(n + m)', [
    'O(n · m)',
    'O((n + m) log(n + m))',
    'O(max(n, m)²)',
  ]),
  mc('alg-17', 'Algorithms', "Time of Kadane's maximum subarray?", 'O(n)', [
    'O(n log n)',
    'O(n²)',
    'O(log n)',
  ]),
  mc(
    'alg-18',
    'Algorithms',
    'Two Sum: the HashMap solution versus brute force?',
    'O(n) versus O(n²)',
    ['O(n log n) versus O(n²)', 'O(1) versus O(n)', 'O(n²) versus O(n³)'],
  ),
  mc(
    'alg-19',
    'Algorithms',
    'Two Sum on an already sorted array with two pointers: time and extra space?',
    'O(n) time, O(1) space',
    ['O(n log n) time, O(1) space', 'O(n) time, O(n) space', 'O(n²) time, O(1) space'],
  ),
  mc('alg-20', 'Algorithms', 'Time of a heap sort on n elements?', 'O(n log n)', [
    'O(n)',
    'O(n²)',
    'O(log n)',
  ]),
  mc(
    'alg-21',
    'Algorithms',
    'Time of counting sort with n elements and values in 0..k?',
    'O(n + k)',
    ['O(n log n)', 'O(n · k)', 'O(k log n)'],
  ),
  mc('alg-22', 'Algorithms', 'Time of schoolbook n by n matrix multiplication?', 'O(n³)', [
    'O(n²)',
    'O(n² log n)',
    'O(n log n)',
  ]),
  mc(
    'alg-23',
    'Algorithms',
    'Operations on a balanced BST cost O(log n). What if it is skewed?',
    'O(n)',
    ['O(1)', 'O(log n) still', 'O(n log n)'],
  ),

  // Concepts
  mc('cpt-1', 'Concepts', 'Which notation describes an upper bound on growth?', 'Big-O', [
    'Big-Omega',
    'Big-Theta',
    'Little-o',
  ]),
  mc(
    'cpt-2',
    'Concepts',
    'Which of these simplifies O(3n² + 5n + 10)?',
    'O(n²)',
    ['O(3n²)', 'O(n² + n)', 'O(n³)'],
    {
      note: 'Drop constants and lower-order terms.',
    },
  ),
  mc(
    'cpt-3',
    'Concepts',
    'A loop over array a (length n), then a separate loop over array b (length m). Total time?',
    'O(n + m)',
    ['O(n · m)', 'O(n²)', 'O(max(n, m)²)'],
  ),
  mc(
    'cpt-4',
    'Concepts',
    'What does "amortized O(1)" mean?',
    'Any sequence of n operations costs O(n) total, even if a single one is occasionally expensive',
    [
      'Every single operation is O(1)',
      'The average over random inputs is O(1)',
      'The best case is O(1)',
    ],
  ),
  mc(
    'cpt-5',
    'Concepts',
    'Order these from fastest to slowest growth.',
    'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!)',
    [
      'O(1) < O(n) < O(log n) < O(n log n) < O(n²) < O(2^n) < O(n!)',
      'O(log n) < O(1) < O(n) < O(n²) < O(n log n) < O(2^n) < O(n!)',
      'O(1) < O(log n) < O(n) < O(n²) < O(n log n) < O(n!) < O(2^n)',
    ],
  ),
  mc(
    'cpt-6',
    'Concepts',
    'You can trade memory for speed. Which change typically does that?',
    'Cache results in a HashMap to avoid recomputing (memoization)',
    [
      'Sort the input in place',
      'Use a StringBuilder instead of a String',
      'Replace a loop with recursion',
    ],
  ),
  mc('cpt-7', 'Concepts', 'A HashMap<Integer, Integer> with n entries uses what space?', 'O(n)', [
    'O(1)',
    'O(log n)',
    'O(n²)',
  ]),
  mc(
    'cpt-8',
    'Concepts',
    'Space used by an n by m DP table?',
    'O(n · m)',
    ['O(n + m)', 'O(max(n, m))', 'O(1)'],
    {
      note: 'If each row depends only on the previous row, you can keep two rows for O(m).',
    },
  ),
];

export const bigoQuiz: Quiz = {
  slug: 'big-o',
  title: 'Big-O and Complexity',
  description:
    'Multiple choice: read constraints, know the cost of Java collection operations, analyze loops and recursion, and recall the complexity of classic algorithms.',
  source: {
    label: 'DS & Algorithms Cheat Sheet',
    href: '/resources/ds-algorithms-cheat-sheet.html',
  },
  /** Ordered by importance: random rounds of N take the first N. */
  questions: rankQuestions(
    authored.map((item) => ({ ...item, ...bigoExplanations[item.id] })),
    bigoPriority,
  ),
};
