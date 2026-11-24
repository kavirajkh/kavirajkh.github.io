import type { Explanation } from './syntax-explanations-types';

export const numExplanations: Record<string, Explanation> = {
  'num-1': {
    explain:
      '`Integer.MAX_VALUE` is the largest int, 2,147,483,647 (about 2.1 billion). It is the standard "infinity" when you search for a minimum, for example the starting best distance.\nAdding 1 to it overflows to a large negative number, so be careful with `MAX_VALUE + x`.',
    remember:
      'MAX_VALUE is the usual "infinity". Pair it with `MIN_VALUE` for "negative infinity".',
  },
  'num-2': {
    explain:
      'The cast must happen before the multiplication. `(long) big * 2` turns big into a long first, so the multiply happens in 64 bits.\nWriting `(long) (big * 2)` is too late: the int multiplication has already overflowed.',
    remember: 'Cast first, then multiply: `(long) a * b`.',
  },
  'num-3': {
    explain:
      'Integer division drops the remainder, which rounds down. Adding `divisor - 1` before dividing pushes any leftover up to the next whole number, giving the ceiling.\nFor 7 and 3: (7 + 3 - 1) / 3 = 9 / 3 = 3. This works for positive numbers.',
    remember: 'Ceiling division = `(a + b - 1) / b`.',
  },
  'num-4': {
    explain:
      'In Java the remainder `%` keeps the sign of the left number, so `-7 % 3` is -1. `Math.floorMod(-7, 3)` returns a result that always has the sign of the divisor, so you get 2.\nThis matters for circular indexes and hashing.',
    remember: 'Negative numbers? Use `Math.floorMod`. The alternative is `((a % m) + m) % m`.',
  },
  'num-5': {
    explain:
      '`Integer.parseInt("-42")` converts the text into the int -42. It throws NumberFormatException when the text is not a valid number. A second argument sets the base.',
    remember: 'String to int: `Integer.parseInt`.',
  },
  'num-6': {
    explain:
      '`String.valueOf(42)` returns the text "42". `Integer.toString(42)` and `"" + 42` give the same result.',
    remember: 'Anything to text: `String.valueOf`.',
  },
  'num-7': {
    explain:
      '`Integer.toBinaryString(10)` returns "1010", the base-2 digits without leading zeros. Related helpers are `toHexString` and `toOctalString`.',
    remember: 'int to binary text: `toBinaryString`.',
  },
  'num-8': {
    explain:
      '`Integer.parseInt("1010", 2)` reads the text in base 2, giving 10. The second argument is the radix (base).',
    remember: 'parseInt with a second argument for the base.',
  },
  'num-9': {
    explain:
      '`Integer.bitCount(7)` counts the 1 bits in the binary form of the number. 7 is 111, so the answer is 3. It is used in bitmask and "Hamming weight" problems.',
    remember: 'Count the ones: `bitCount`.',
  },
  'num-10': {
    explain:
      '`1L << 40` shifts the long value 1 left by 40 bits, giving 2^40. The `L` makes the 1 a long. Without it, the shift happens on an int and wraps around.\n`Math.pow` would return a double, which can lose precision for big values.',
    remember: 'Power of two = `1L << k`. The L is the important part.',
  },
  'num-11': {
    explain:
      '`Math.max(a, b)` returns the larger value. `Math.min` returns the smaller. It has versions for int, long, float and double.',
    remember: 'Two arguments only. For more, nest them: `Math.max(a, Math.max(b, c))`.',
  },
  'num-12': {
    explain:
      '`Math.abs(x)` returns the absolute value. Careful: `Math.abs(Integer.MIN_VALUE)` is still negative because +2,147,483,648 does not fit in an int.',
    remember: 'Absolute value is `Math.abs`. Watch the MIN_VALUE corner case.',
  },
  'num-13': {
    explain:
      '`Math.sqrt(n)` returns the square root as a double. For an integer root, cast the result: `(int) Math.sqrt(n)`.',
    remember: 'Square root: `Math.sqrt`, always a double.',
  },
  'num-14': {
    explain:
      '`Math.pow(2, 10)` returns 1024.0 as a double. For exact integer powers, especially big ones, use a shift or a loop to avoid floating-point rounding.',
    remember: '`Math.pow` returns double. Cast if you need an int.',
  },
  'num-15': {
    explain:
      'The textbook midpoint `(lo + hi) / 2` can overflow when both are large. `lo + (hi - lo) / 2` never goes beyond hi, so it is safe.\nIt is the line to use in every binary search.',
    remember: 'Midpoint = low plus half the gap.',
  },
  'num-16': {
    explain:
      '`Integer.MIN_VALUE` is the smallest int, -2,147,483,648. It is the starting value when you search for a maximum.',
    remember: 'MAX and MIN pair up: MIN_VALUE for "start of max search".',
  },
  'num-17': {
    explain:
      '`Long.MAX_VALUE` is the largest long, about 9.2 x 10^18. Use it as "infinity" when int is not large enough, for example for path sums.',
    remember: 'Bigger than int: `Long.MAX_VALUE`.',
  },
  'num-18': {
    explain:
      'A power of two has exactly one 1 bit, such as 1000. Subtracting 1 flips that bit and sets all the lower bits (0111), so `x & (x - 1)` becomes 0.\n`x > 0` rules out zero and negative numbers.',
    remember: 'One bit set means `x & (x - 1) == 0`.',
  },
  'num-19': {
    explain:
      '`x & (x - 1)` clears the lowest set bit. For 12 (1100), x - 1 is 1011, the AND gives 1000, which is 8.\nRepeating it until x is 0 counts the set bits, one per loop.',
    remember: '"x and x-minus-one" wipes the lowest 1.',
  },
  'num-20': {
    explain:
      '`x & -x` keeps only the lowest set bit. Negative numbers are stored as the complement plus one, so everything above the lowest 1 is flipped and cancels out in the AND.\nFor 12 (1100) the result is 4 (0100). It is the core step of a Fenwick tree.',
    remember: 'Lowest bit = `x & -x`.',
  },
  'num-21': {
    explain:
      'To test bit i, shift mask right i places so that bit lands in position 0, then `& 1` keeps only that bit.\nThe other common form is `(mask & (1 << i)) != 0`. Both read the same bit.',
    remember: '"Shift it down, mask with 1." Bits count from 0 on the right.',
  },
  'num-22': {
    explain:
      '`1 << i` makes a number with only bit i set. OR-ing it into mask turns that bit on and leaves the others as they were. `|=` is the compound form.',
    remember: 'OR sets a bit, AND-NOT clears it: `mask &= ~(1 << i)`.',
  },
  'num-23': {
    explain:
      'With n items there are 2^n subsets, and each number from 0 to 2^n - 1 is a mask where bit i says "item i is in the subset". `1 << n` is 2^n.\nInside the loop you test each bit to see which items are chosen.',
    remember: 'All subsets: `mask < (1 << n)`.',
  },
  'num-24': {
    explain:
      '`a ^ b` is bitwise XOR: a result bit is 1 where the inputs differ. Useful facts: `x ^ x == 0`, `x ^ 0 == x`, which is why XOR finds the single non-duplicated number in an array.',
    remember: 'XOR cancels pairs.',
  },
  'num-25': {
    explain:
      'Many problems ask for the answer modulo 1,000,000,007 (a prime near 10^9) to keep numbers small. The underscores are only for readability: `1_000_000_007` is the same as `1000000007`.\nMake it `final` so it cannot change.',
    remember:
      'The magic number is 10^9 + 7. Write it with underscores so you do not miscount zeros.',
  },
  'num-26': {
    explain:
      'Two ints below 10^9 can multiply to about 10^18, which overflows an int. So convert first.\n- `(long) a * b` multiplies in 64 bits.\n- `% MOD` brings it back under the modulus.\n- `(int)` casts the small result down to int.',
    remember: 'Cast to long, multiply, mod, then cast back.',
  },
  'num-27': {
    explain:
      '`(int) total` narrows a long to an int by keeping the lower 32 bits. If the value does not fit, you get a wrong number without any error, so make sure it is in range first.',
    remember: 'Narrowing needs an explicit cast.',
  },
  'num-28': {
    explain:
      'Same ceiling trick as before: add `b - 1` to a before dividing. On Java 18 and newer, `Math.ceilDiv(a, b)` does it for you.',
    remember: 'Ceiling division = `(a + b - 1) / b`.',
  },
  'num-29': {
    explain:
      "`Character.getNumericValue(c)` returns the digit value of a character: '7' gives 7. It also handles letters in higher bases (a gives 10). `c - '0'` is the common shortcut for plain digits.",
    remember: "Either `c - '0'` or `Character.getNumericValue(c)`.",
  },
  'num-30': {
    explain:
      'A temporary variable holds one value while the other is overwritten. The order matters: save a, copy b into a, then put the saved value into b.',
    remember: 'Three moves: tmp = a; a = b; b = tmp.',
  },
  'num-31': {
    explain:
      'The ternary operator `condition ? valueIfTrue : valueIfFalse` is an expression that picks one of two values. Here it assigns the larger of a and b to m.',
    remember: 'Read it as "if a is greater than b, then a, else b".',
  },
  'num-32': {
    explain:
      "This is Euclid's algorithm. The gcd of a and b equals the gcd of b and a modulo b. When b reaches 0, a is the answer.\nThe ternary returns a when b is 0 and recurses otherwise. For lcm use `a / gcd(a, b) * b`.",
    remember: 'gcd(a, b) = gcd(b, a % b), stop at b = 0.',
  },
};

export const cmpExplanations: Record<string, Explanation> = {
  'cmp-1': {
    explain:
      'Comparators work on objects, so the array must be `Integer[]`, not `int[]`. `Collections.reverseOrder()` is the ready-made comparator for largest first.\nTo sort an `int[]` descending, sort it ascending and then reverse it.',
    remember: 'A comparator needs boxed types.',
  },
  'cmp-2': {
    explain:
      'Each interval is an `int[]` such as {start, end}. The lambda gets two of them, x and y, and `Integer.compare(x[0], y[0])` orders them by start, smallest first.\nSorting intervals by start is the first step of merge-intervals and meeting-rooms problems.',
    remember:
      'Sort a 2D array: `Arrays.sort(arr, (x, y) -> Integer.compare(x[i], y[i]))`. Swap x and y for descending.',
  },
  'cmp-3': {
    explain:
      'Swapping the two arguments reverses the order. `Integer.compare(y.length(), x.length())` puts the longer string first.\nSorting strings with a lambda works because String[] is an object array.',
    remember: 'Ascending is (x, y), descending is (y, x).',
  },
  'cmp-4': {
    explain:
      'The lambda uses x first. If the x values differ, they decide the order. If they are equal, the y values break the tie.\nThe ternary `a[0] != b[0] ? ... : ...` makes that choice. `Comparator.comparingInt(...).thenComparingInt(...)` is the longer alternative.',
    remember: 'Two keys: compare the first, and only if tied compare the second.',
  },
  'cmp-5': {
    explain:
      '`list.sort(Collections.reverseOrder())` sorts the list in place from largest to smallest. Lists have their own `sort` method that takes a comparator.',
    remember: 'List sort descending: `list.sort(Collections.reverseOrder())`.',
  },
  'cmp-6': {
    explain:
      '`Arrays.sort(ws)` sorts strings alphabetically using their natural order (character codes, so uppercase sorts before lowercase).',
    remember: 'Natural order needs no comparator.',
  },
  'cmp-7': {
    explain:
      'The lambda swaps the operands to get descending order: `b[1]` first, `a[1]` second. Lists have the `sort` method built in, so you do not need `Collections.sort`.',
    remember: 'Descending = swap the operands.',
  },
  'cmp-8': {
    explain:
      'The entries come from `map.entrySet()`. The comparator reads each entry\'s value with `getValue()` and compares them with the operands swapped, so the biggest value is first.\nThis is how "sort the map by frequency" is done, since a HashMap cannot be sorted itself.',
    remember: 'Maps cannot be sorted: copy the entries into a list, then sort the list.',
  },
};
