import type { Explanation } from './syntax-explanations-types';

export const arrayExplanations: Record<string, Explanation> = {
  'arr-1': {
    explain:
      'This creates an array of n ints. Java fills a new int array with zeros for you.\n- `int[] a` declares a variable that will hold an int array.\n- `new int[n]` allocates n slots on the heap, each starting at 0.\nThe size is fixed once created. If you need to grow, use an ArrayList or copy into a bigger array.',
    remember:
      'Say it as "type, brackets, name, equals, new, type, size in brackets". The size goes on the right side only: `int[] a = new int[n]`. Booleans start false, objects start null.',
  },
  'arr-2': {
    explain:
      'This creates a rectangular grid, 3 rows by 4 columns, all zeros.\n- `int[][]` means an array of int arrays.\n- `new int[3][4]` is rows first, then columns.\nSo `grid[r][c]` reads row r, column c, and `grid.length` is the row count.',
    remember:
      'Rows first, columns second, always: `[rows][cols]`. Picture a spreadsheet: you name the row, then the column.',
  },
  'arr-3': {
    explain:
      'This reads both dimensions in one statement.\n- `grid.length` is the number of rows.\n- `grid[0].length` is the length of the first row, which is the number of columns in a rectangular grid.\nA comma lets you declare two variables of the same type in one line.',
    remember:
      '"Length of the grid is rows, length of a row is columns." Guard the empty grid: `grid[0]` throws if there are no rows.',
  },
  'arr-4': {
    explain:
      '`Arrays.fill(a, -1)` writes -1 into every slot of a. It is the quick way to set a sentinel, such as -1 for "not computed yet" in a memo table, or `Integer.MAX_VALUE` for "infinite distance".\nIt works in place and returns nothing. For a 2D array you must fill each row separately.',
    remember:
      '"Fill the array with a value": `Arrays.fill(array, value)`. The array comes first, the value second.',
  },
  'arr-5': {
    explain:
      '`b.clone()` returns a new array with the same elements. Editing the copy does not touch the original.\nFor an array of arrays, clone is shallow: the inner arrays are shared, so copy each row if you need a deep copy.\n`Arrays.copyOf(b, b.length)` does the same thing.',
    remember: 'Arrays have a built-in `.clone()`, no import needed. Think "clone the clone".',
  },
  'arr-6': {
    explain:
      '`Arrays.copyOfRange(b, 1, 3)` copies the slice from index 1 up to, but not including, index 3. With b = {5, 3, 8, 1} the result is {3, 8}.\nThe end index is exclusive, the same convention as `substring` and `subList`.',
    remember:
      'Java ranges are "from inclusive, to exclusive". Length of the slice is simply `to - from`.',
  },
  'arr-7': {
    explain:
      '`Arrays.sort(b)` rearranges b into ascending order, in place, and returns nothing. For primitives it uses a fast dual-pivot quicksort that runs in O(n log n).\nIf you want descending order, you need an Integer[] and a comparator, because primitives cannot take one.',
    remember:
      'The array is the thing you sort, so it goes inside: `Arrays.sort(b)`. It does not return a new array.',
  },
  'arr-8': {
    explain:
      '`Arrays.binarySearch(b, 5)` does a binary search for 5 and returns its index. It only works on a sorted array.\nIf the value is missing it returns `-(insertion point) - 1`, which is always negative, so check `pos >= 0` before trusting it.',
    remember:
      '"Binary search needs sorted input", so sort first. A negative result means "not found".',
  },
  'arr-9': {
    explain:
      'Printing an array directly shows something like `[I@6d06d69c`, which is its type and hash code. `Arrays.toString(b)` builds the readable form `[1, 3, 5, 8]` that you can pass to println.',
    remember: 'Print = `Arrays.toString`. If your output looks like `[I@...`, you forgot it.',
  },
  'arr-10': {
    explain:
      '`Arrays.toString` on a 2D array would print the inner arrays as unreadable references. `Arrays.deepToString(grid)` walks into every nested array and prints `[[0, 0], [0, 0]]` style output.',
    remember: '2D means "deep": `deepToString`. One dimension uses `toString`.',
  },
  'arr-11': {
    explain:
      '`Arrays.equals(a, b)` returns true when both arrays have the same length and the same elements in the same order.\n`a == b` only asks whether they are the very same array object, and `a.equals(b)` on an array does the same reference check. Both give false for two separate arrays with equal contents.',
    remember:
      'Arrays compare by content only through `Arrays.equals`. For nested arrays use `Arrays.deepEquals`.',
  },
  'arr-12': {
    explain:
      '`dp` is an array of rows, so one `Arrays.fill` call cannot reach every cell. The loop visits each row and fills it.\n- `for (int[] row : dp)` takes each row in turn.\n- `Arrays.fill(row, Integer.MAX_VALUE)` sets every cell in that row.\nTypical use is to initialize a DP or distance table to "infinity" before relaxing values.',
    remember:
      'One fill per row. 2D fill = loop over rows + `Arrays.fill`. Careful with overflow when adding to `Integer.MAX_VALUE`.',
  },
  'arr-13': {
    explain:
      '`Arrays.copyOf(b, 10)` makes a new array of length 10. If b is shorter, the extra slots are zero-filled. If b is longer, the result is truncated.\nIt is the usual way to "grow" an array: copy into a bigger one.',
    remember:
      '`copyOf(array, newLength)`: the second argument is a length, not an end index. Compare with `copyOfRange(array, from, to)`.',
  },
  'arr-14': {
    explain:
      '`Arrays.sort(b, 1, 4)` sorts only the slice from index 1 up to, but not including, 4. The elements outside that range stay where they are.\nWith {5, 4, 3, 2, 1} it gives {5, 2, 3, 4, 1}.',
    remember: 'Same exclusive-end rule as every range: `sort(array, from, to)`.',
  },
  'arr-15': {
    explain:
      "This creates 26 counters, one per lowercase letter. You pair it with `ch - 'a'` to turn a letter into its slot: `cnt[ch - 'a']++`.\nIt is faster and lighter than a HashMap when the alphabet is small and fixed, and it is a classic tool for anagram and frequency problems.",
    remember: '26 letters means `new int[26]`. For all ASCII use 128, for any char use 256.',
  },
  'arr-16': {
    explain:
      'Giving only the first dimension creates 3 rows whose contents are not allocated yet: each row is null until you assign it.\nThat lets rows have different lengths, which is called a jagged array. Later you write `rows[0] = new int[2]`.',
    remember: 'Leave the second bracket empty for "rows of different sizes": `new int[3][]`.',
  },
  'arr-17': {
    explain:
      '`System.arraycopy(src, 0, dst, 2, 3)` copies 3 elements, starting at index 0 of src, into dst starting at index 2.\nThe arguments are: source, source start, destination, destination start, count. It is a fast native copy and it handles overlapping ranges correctly, which makes it handy for shifting elements.',
    remember:
      '"Source, where from, destination, where to, how many": src, srcPos, dst, dstPos, length.',
  },
  'arr-18': {
    explain:
      'Curly braces let you write an array literal when you declare it. The compiler works out the sizes: here 2 rows of 2 columns.\nThe short form `{{1, 2}, {3, 4}}` only works in a declaration. Elsewhere you need `new int[][]{{1, 2}, {3, 4}}`.',
    remember: 'Braces inside braces, one inner pair per row.',
  },
  'arr-19': {
    explain:
      'Java cannot return two values, so you wrap them in a new array. `new int[]{i, j}` creates an array with those two elements and `return` hands it back.\nThis is the standard return for Two Sum style problems.',
    remember:
      'Return pair = `return new int[]{i, j};`. For "no answer" return `new int[0]` or `new int[]{-1, -1}`.',
  },
  'arr-20': {
    explain:
      'The array length is a field, so there are no parentheses: `a.length`.\nStrings use a method, `s.length()`. Collections use `size()`. Mixing these up is one of the most common compile errors.',
    remember:
      'Array: length. String: length(). List: size(). "Array has a property, String has a method."',
  },
  'arr-21': {
    explain:
      'Collecting results in a List is easy, but some problems must return `int[][]`. `toArray` fills a new array from the list.\n- `res.size()` is how many int[] rows there are.\n- `new int[res.size()][]` is an array of that many rows, where each row type is int[].\nThe argument tells Java which array type to build.',
    remember:
      'List to array: pass an empty array of the target type, `res.toArray(new int[res.size()][])`.',
  },
  'arr-22': {
    explain:
      'This stores the four neighbor moves for a grid as (row change, column change) pairs: right, down, left, up.\nYou loop over it and add each pair to your current cell: `nr = r + d[0]`, `nc = c + d[1]`. It replaces four copy-pasted blocks in BFS and DFS.',
    remember:
      'Clockwise from right: right, down, left, up. For 8 directions, add the four diagonals.',
  },
  'arr-23': {
    explain:
      'Before you touch `grid[nr][nc]` you must make sure the cell exists.\n- `nr >= 0 && nr < m` keeps the row inside 0..m-1.\n- `nc >= 0 && nc < n` keeps the column inside 0..n-1.\n`&&` short-circuits, so nothing is read out of bounds. Many people write the opposite check with `||` followed by `continue`.',
    remember: '"Not negative and less than the size", once for the row and once for the column.',
  },
};
