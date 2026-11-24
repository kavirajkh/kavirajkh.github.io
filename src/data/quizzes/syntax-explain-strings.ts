import type { Explanation } from './syntax-explanations-types';

export const stringExplanations: Record<string, Explanation> = {
  'str-1': {
    explain:
      '`s.charAt(0)` returns the character at index 0 as a `char`. Strings cannot be indexed with `s[0]` in Java, so `charAt` is the way in.\nIt throws StringIndexOutOfBoundsException when the index is outside the string.',
    remember: 'Arrays use brackets, Strings use a method: `s.charAt(i)`.',
  },
  'str-2': {
    explain:
      '`s.toCharArray()` copies the string into a new `char[]`. Strings are immutable, so this is how you get something you can edit, sort or swap in place.\nTo go back, use `new String(cs)` or `String.valueOf(cs)`.',
    remember: 'Need to change characters? "To char array, edit, then back to String."',
  },
  'str-3': {
    explain:
      '`s.substring(0, 5)` returns the characters from index 0 up to, but not including, index 5. For "Hello, World" that is "Hello".\nThe end index is exclusive, so the length of the result is end minus start.',
    remember: 'Same range rule as arrays and lists: from inclusive, to exclusive.',
  },
  'str-4': {
    explain:
      '`equals` compares the characters of two strings. The `==` operator compares references, which can be false even when the text is identical.\nPut the known string first, `"Hello, World".equals(s)`, if s might be null.',
    remember: '"Never `==` on Strings": always `.equals`.',
  },
  'str-5': {
    explain:
      '`s.indexOf("World")` returns the index where "World" first starts, or -1 if it is not there. It also accepts a single char, and a second argument for where to start searching.',
    remember: 'Found returns a position, not found returns -1. Check `>= 0` before using it.',
  },
  'str-6': {
    explain:
      'This cleans a line and splits it into words.\n- `trim()` removes spaces at both ends, so you do not get an empty first word.\n- `split("\\\\s+")` splits on one or more whitespace characters. The pattern is a regular expression, so the backslash is doubled inside the Java string.\nWith "  a  b c " you get {"a", "b", "c"}.',
    remember: 'Trim first, then split on `"\\\\s+"`. "Whitespace, one or more times."',
  },
  'str-7': {
    explain:
      "Characters are numbers underneath. Subtracting `'a'` gives the distance from the letter a, so 'a' becomes 0, 'b' becomes 1 and 'c' becomes 2.\nThat index lines up with a 26-slot counting array, such as `cnt[ch - 'a']++`.",
    remember: "Letter minus 'a' gives the index. Use 'A' as the base for uppercase.",
  },
  'str-8': {
    explain:
      "This is the reverse of the previous step. `'a' + i` is an int, so the cast `(char)` turns it back into a letter. For i = 2 you get 'c'.\nWithout the cast, the result is a number and the assignment will not compile.",
    remember: 'Index to letter is `(char) (\'a\' + i)`. "Add, then cast."',
  },
  'str-9': {
    explain:
      "The characters '0' to '9' sit next to each other in the character table. Subtracting `'0'` turns the digit character into its numeric value: '7' - '0' is 7.\nIt works only for the characters '0' to '9'.",
    remember: "Digit char minus '0' gives the number. It is the same trick as letters minus 'a'.",
  },
  'str-10': {
    explain:
      '`String.join("-", words)` glues the elements of the array together with the separator between them, giving "a-b-c". It also accepts any Iterable of strings, such as a List<String>.\nIt adds no separator at the start or end.',
    remember: '"Join with this, these things": separator first, then the collection.',
  },
  'str-11': {
    explain:
      '`"ab".repeat(3)` builds a new string with "ab" three times: "ababab". `repeat(0)` gives an empty string.\nIt exists since Java 11. On older Java you would use a loop with a StringBuilder.',
    remember: 'Python style `"ab" * 3` becomes `"ab".repeat(3)`.',
  },
  'str-12': {
    explain:
      'You cannot loop directly over a String with the for-each syntax, so you convert it first.\n- `s.toCharArray()` makes a char array.\n- `for (char c : ...)` visits each character in order.\nIf you also need the index, use a classic `for (int i = 0; i < s.length(); i++)` with `s.charAt(i)`.',
    remember: 'For-each over a string is "for char c in s.toCharArray()".',
  },
  'str-13': {
    explain:
      '`Character.isLetterOrDigit(c)` returns true for a letter or digit, which is the usual filter for palindrome and cleaning problems. It handles uppercase, lowercase and non-English letters too.',
    remember:
      'The `Character` class has the `is...` tests: `isLetter`, `isDigit`, `isLetterOrDigit`, `isUpperCase`.',
  },
  'str-14': {
    explain:
      "`Character.isDigit(c)` is true when c is '0' to '9' (and other Unicode digits). Use it before converting with `c - '0'`.",
    remember: 'The question "is it a digit?" is `Character.isDigit(c)`.',
  },
  'str-15': {
    explain:
      '`Character.toLowerCase(c)` returns the lowercase version of one char and leaves non-letters unchanged. It does not modify c, it returns a new value, so assign it.',
    remember:
      'Static helpers on `Character` take the char as an argument: `Character.toLowerCase(c)`.',
  },
  'str-16': {
    explain:
      '`s.toLowerCase()` returns a new string with every letter lowercased. Strings are immutable, so s itself is unchanged and you must use the returned value.',
    remember: 'Strings never change in place, so always capture the result.',
  },
  'str-17': {
    explain:
      '`s.startsWith("ab")` is true when s begins with "ab". There is a matching `endsWith`, and a version that takes a start offset.',
    remember: 'Reads like English: "s starts with ab".',
  },
  'str-18': {
    explain:
      '`s.contains("ab")` is true when "ab" appears anywhere in s. It accepts any CharSequence, so it works with a StringBuilder too.',
    remember: '"Does it contain it?" Use `indexOf` instead when you need the position.',
  },
  'str-19': {
    explain:
      '`s.substring(2)` with one argument takes everything from index 2 to the end of the string.',
    remember: 'One argument means "from here to the end".',
  },
  'str-20': {
    explain:
      '`a.compareTo(b)` compares two strings alphabetically by character code. It returns a negative number if a comes first, 0 if they are equal, and a positive number if a comes later.\nDo not depend on the exact size of the number, only its sign.',
    remember: 'Negative, zero or positive: a is before, equal to, or after b.',
  },
  'str-21': {
    explain:
      '`String.valueOf(c)` turns one char into a one-character String. `Character.toString(c)` and `"" + c` give the same result.\nYou need this when a method wants a String, such as map keys or `sb.append`-free concatenation.',
    remember: 'Anything to String is `String.valueOf(x)`.',
  },
  'str-22': {
    explain:
      '`s.isEmpty()` is true when the length is 0. It is slightly easier to read than `s.length() == 0`. It does not cover null, and it does not treat spaces as empty (use `isBlank()` on Java 11+).',
    remember: 'Empty means length 0, not just spaces.',
  },
  'str-23': {
    explain:
      '`s.replace("a", "b")` returns a new string with every occurrence of "a" replaced by "b". It treats the text literally. `replaceAll` takes a regular expression instead.',
    remember: '`replace` is plain text, `replaceAll` is regex.',
  },
  'str-24': {
    explain:
      '`s.lastIndexOf(c)` returns the index of the last occurrence of c, or -1 if it is missing. `indexOf` finds the first one.',
    remember: 'Last occurrence: `lastIndexOf`. It is handy for "last seen position" problems.',
  },
  'str-25': {
    explain:
      '`a.equalsIgnoreCase(b)` compares the text while ignoring uppercase and lowercase differences, so "Java" and "JAVA" are equal.',
    remember: 'Equals, but "ignore case".',
  },
  'str-26': {
    explain:
      "The digit characters are consecutive in the character table, so `c - '0'` gives the number the digit stands for. For '7' you get 7.",
    remember: "Digit char minus '0'. The same pattern as `ch - 'a'`.",
  },
  'str-27': {
    explain:
      "Adding 1 to a char produces an int. The cast `(char)` converts it back to a char, so 'a' + 1 becomes 'b'. Without the cast the assignment does not compile. (`c++` on a char variable would also work.)",
    remember: 'Arithmetic on chars gives ints, so cast back.',
  },
  'str-28': {
    explain:
      'Anagrams contain the same letters, so sorting the letters gives them all the same key.\n- `toCharArray()` copies the letters into an array.\n- `Arrays.sort(cs)` puts them in order.\n- `new String(cs)` builds the key string back.\nUse that key in a HashMap to group anagrams: "eat", "tea" and "ate" all become "aet".',
    remember: 'Anagram key = sorted letters. "Array, sort, string".',
  },
  'str-29': {
    explain:
      '`s.chars()` gives an IntStream of the characters (as int codes). `filter(ch -> ch == c)` keeps the ones equal to c, and `count()` returns how many remain as a `long`.\nA plain loop is faster and clearer in interviews, but this one-liner is useful to know.',
    remember: 'Stream of chars, filter, count. Note that `count()` returns `long`.',
  },
  'str-30': {
    explain:
      '`s.split("")` splits between every character, so you get an array of one-character strings. For char values, prefer `toCharArray()`.',
    remember: 'Empty separator means "split between each character".',
  },
  'str-31': {
    explain:
      'Compare characters with `==` because `charAt` returns the primitive `char`. This is the core test of palindrome checks, usually written inside a two-pointer loop with i moving forward and j moving back.',
    remember:
      'Chars are primitives, so `==` is correct for them. Strings are not primitives, so use `.equals`.',
  },
};
