import type { Quiz, QuizQuestion } from './types';
import { mc, q, r, rankQuestions } from './helpers';
import { javafpPriority } from './javafp-priority';

const emps = 'emps is a List<Employee>; Employee is a record (name, dept, age, salary, skills).';

const authored: QuizQuestion[] = [
  // Lambdas and the functional mindset
  mc(
    'lam-1',
    'Lambdas',
    'What makes an interface a functional interface?',
    'Exactly one abstract method',
    [
      'No methods at all',
      'At least one default method',
      'It is annotated with @FunctionalInterface and has no other methods',
    ],
    {
      note: 'Default, static and Object methods (equals, toString) do not count. The annotation only makes the compiler check it.',
    },
  ),
  mc(
    'lam-2',
    'Lambdas',
    'A lambda reads a local variable from the enclosing method. What must be true of that variable?',
    'It is effectively final',
    ['It is declared volatile', 'It is a static field', 'It is a primitive'],
    {
      note: 'Captured locals cannot be reassigned. Fields are different: they can change, which is why mutating them is a side effect to avoid.',
    },
  ),
  mc(
    'lam-3',
    'Lambdas',
    'Inside a lambda body, what does `this` refer to?',
    'The enclosing instance',
    ['The lambda object itself', 'The functional interface type', 'null'],
    { note: 'Unlike an anonymous class, a lambda does not introduce a new scope for this.' },
  ),
  mc(
    'lam-4',
    'Lambdas',
    'Does `Object o = () -> 42;` compile?',
    'No: a lambda needs a functional interface as its target type',
    [
      'Yes: Object accepts any value',
      'Yes: it becomes a Runnable',
      'Yes: it becomes a Supplier<Integer>',
    ],
  ),
  mc(
    'lam-5',
    'Lambdas',
    'Which method is pure?',
    'int add(int a, int b) { return a + b; }',
    [
      'boolean isExpired(Token t) { return t.exp() < System.currentTimeMillis(); }',
      'int next() { return counter++; }',
      'String read() { return reader.readLine(); }',
    ],
    {
      note: 'Pure means same input gives same output with no side effects. A clock, a counter and I/O all break that.',
    },
  ),
  mc(
    'lam-6',
    'Lambdas',
    'Why is incrementing an outer counter inside forEach a bad way to count matches?',
    'It is a side effect: unsafe in parallel streams and it hides intent. Use count()',
    [
      'forEach cannot access outer variables',
      'It is always slower than count()',
      'It changes the encounter order',
    ],
    {
      note: 'Prefer filter(...).count(). Lambdas cannot even assign a local int, so people reach for fields or arrays, which is the smell.',
    },
  ),

  // Functional interfaces
  mc(
    'fi-1',
    'Functional interfaces',
    'Which signature belongs to Function<T, R>?',
    'R apply(T t)',
    ['R get()', 'boolean test(T t)', 'void accept(T t)'],
    { remember: 'Function applies, Supplier gets, Predicate tests, Consumer accepts.' },
  ),
  mc(
    'fi-2',
    'Functional interfaces',
    'Which signature belongs to Predicate<T>?',
    'boolean test(T t)',
    ['T get()', 'R apply(T t)', 'void accept(T t)'],
  ),
  mc(
    'fi-3',
    'Functional interfaces',
    'Which interface takes nothing and returns a value?',
    'Supplier<T>',
    ['Consumer<T>', 'Function<T, R>', 'Runnable'],
    { note: 'Runnable takes nothing too, but returns void.' },
  ),
  mc(
    'fi-4',
    'Functional interfaces',
    'Which interface takes a value and returns nothing?',
    'Consumer<T>',
    ['Supplier<T>', 'Predicate<T>', 'UnaryOperator<T>'],
  ),
  mc(
    'fi-5',
    'Functional interfaces',
    'UnaryOperator<T> is a specialization of which interface?',
    'Function<T, T>',
    ['Supplier<T>', 'Predicate<T>', 'BiFunction<T, T, Boolean>'],
    { note: 'BinaryOperator<T> is BiFunction<T, T, T>.' },
  ),
  mc(
    'fi-6',
    'Functional interfaces',
    'Which type is best for an int to int function that should avoid boxing?',
    'IntUnaryOperator',
    ['Function<Integer, Integer>', 'UnaryOperator<Integer>', 'Supplier<Integer>'],
  ),
  mc(
    'fi-7',
    'Functional interfaces',
    'How does Callable differ from Runnable?',
    'Callable returns a value and may throw checked exceptions',
    ['Callable cannot be passed to an executor', 'Runnable returns a value', 'They are identical'],
  ),
  mc(
    'fi-8',
    'Functional interfaces',
    'What does @FunctionalInterface actually do?',
    'The compiler errors if the interface does not have exactly one abstract method',
    [
      'It makes lambdas faster',
      'It is required for a lambda to compile',
      'It adds default methods',
    ],
  ),
  mc(
    'fi-9',
    'Functional interfaces',
    'Which Predicate method inverts a condition?',
    'negate()',
    ['not()', 'invert()', 'reverse()'],
    {
      note: 'Predicate.not(p) is the static form, useful with method references: Predicate.not(String::isBlank).',
    },
  ),

  // Method references
  mc(
    'mr-1',
    'Method references',
    'What kind of reference is `String::length`?',
    'Unbound instance method: (s) -> s.length()',
    ['Static method', 'Bound instance method', 'Constructor reference'],
  ),
  mc(
    'mr-2',
    'Method references',
    'What kind of reference is `System.out::println`?',
    'Bound instance method on System.out',
    ['Static method', 'Unbound instance method', 'Constructor reference'],
  ),
  mc(
    'mr-3',
    'Method references',
    'What kind of reference is `Integer::parseInt`?',
    'Static method',
    ['Bound instance method', 'Unbound instance method', 'Constructor reference'],
  ),
  mc(
    'mr-4',
    'Method references',
    'Which is the constructor reference that supplies a new empty list?',
    'ArrayList::new',
    ['new::ArrayList', 'ArrayList::create', '() -> ArrayList'],
  ),

  // Composition
  mc(
    'cmp-1',
    'Composing functions',
    'For Function f and g, which expression computes g(f(x))?',
    'f.andThen(g)',
    ['f.compose(g)', 'g.andThen(f)', 'f.apply(g)'],
    {
      note: 'andThen runs this function first. compose runs the argument first, so f.compose(g) is f(g(x)).',
      remember: 'andThen reads left to right, like a pipe.',
    },
  ),
  mc(
    'cmp-2',
    'Composing functions',
    'What does Function.identity() return?',
    'A function that returns its argument unchanged: x -> x',
    [
      'A function that returns null',
      'A function that returns 0',
      'A function that returns a new object each call',
    ],
  ),
  mc(
    'cmp-3',
    'Composing functions',
    'What is the value?',
    '5',
    ['23', '6', 'It does not compile'],
    {
      context: r`Function<Integer, Function<Integer, Integer>> add = a -> b -> a + b;
int v = add.apply(2).apply(3);`,
      note: 'Currying: a function that returns a function.',
    },
  ),

  // Stream pipeline
  mc(
    'st-1',
    'Stream pipeline',
    'When does an intermediate operation like filter or map actually run?',
    'Only when a terminal operation is called',
    [
      'Immediately when it is declared',
      'When the stream is created',
      'At the end of the enclosing method',
    ],
    { note: 'Streams are lazy. No terminal operation means no work and no side effects.' },
  ),
  mc(
    'st-2',
    'Stream pipeline',
    'What happens if you reuse a stream after a terminal operation?',
    'IllegalStateException: stream has already been operated upon or closed',
    ['It restarts from the beginning', 'It returns an empty result', 'NoSuchElementException'],
    { note: 'Keep a Supplier<Stream<T>> such as list::stream and call get() for each use.' },
  ),
  mc(
    'st-3',
    'Stream pipeline',
    'What is printed?',
    'filter a, filter bb, map bb',
    [
      'filter a, filter bb, filter ccc, filter dddd, map bb, map ccc, map dddd',
      'map a, map bb',
      'filter a, map a, filter bb, map bb',
    ],
    {
      context: r`Stream.of("a", "bb", "ccc", "dddd")
    .filter(s -> { System.out.println("filter " + s); return s.length() > 1; })
    .map(s -> { System.out.println("map " + s); return s; })
    .findFirst();`,
      note: 'Each element flows through the whole pipeline before the next starts, and findFirst short-circuits as soon as bb arrives.',
    },
  ),
  mc(
    'st-4',
    'Stream pipeline',
    'What does this return?',
    '[1, 3, 9, 27, 81]',
    ['[3, 9, 27, 81, 243]', '[1, 3, 9, 27]', 'It never ends'],
    { context: r`Stream.iterate(1, x -> x * 3).limit(5).toList();` },
  ),
  mc('st-5', 'Stream pipeline', 'Which of these is an intermediate operation?', 'map', [
    'collect',
    'count',
    'forEach',
  ]),
  mc(
    'st-6',
    'Stream pipeline',
    'Stream.generate(() -> 1).toList() on its own will:',
    'Run forever (or until memory runs out) because the stream is infinite',
    ['Return an empty list', 'Return one element', 'Throw IllegalStateException'],
    { note: 'Add limit(n) or a short-circuiting terminal such as findFirst.' },
  ),

  // Intermediate operations
  mc(
    'im-1',
    'Intermediate operations',
    'Which operation turns each element into a stream and concatenates the results?',
    'flatMap',
    ['map', 'peek', 'mapToObj'],
    { remember: 'map is one-to-one. flatMap is one-to-many, then flatten.' },
  ),
  mc(
    'im-2',
    'Intermediate operations',
    'distinct() decides equality using:',
    'equals() and hashCode()',
    ['== reference comparison only', 'compareTo()', 'toString()'],
  ),
  mc(
    'im-3',
    'Intermediate operations',
    'sorted() on elements that are not Comparable throws:',
    'ClassCastException',
    ['IllegalArgumentException', 'NullPointerException', 'Nothing: order is unspecified'],
  ),
  mc(
    'im-4',
    'Intermediate operations',
    'What is the main intended use of peek()?',
    'Debugging: observing elements as they flow past',
    ['Mutating elements safely', 'Replacing forEach', 'Forcing the stream to run'],
  ),
  mc(
    'im-5',
    'Intermediate operations',
    'Which elements does skip(2).limit(3) keep from 1..10?',
    '3, 4, 5',
    ['1, 2, 3', '2, 3, 4', '3, 4, 5, 6, 7'],
  ),
  mc(
    'im-6',
    'Intermediate operations',
    'What does takeWhile give here?',
    '[1, 2]',
    ['[1, 2, 1, 2]', '[3]', '[1, 2, 3]'],
    {
      context: r`Stream.of(1, 2, 3, 1, 2).takeWhile(x -> x < 3).toList();`,
      note: 'takeWhile stops at the first failing element. filter would keep the later 1 and 2 as well.',
    },
  ),
  mc(
    'im-7',
    'Intermediate operations',
    'What does dropWhile give here?',
    '[3, 1, 2]',
    ['[1, 2]', '[1, 2, 1, 2]', '[3]'],
    { context: r`Stream.of(1, 2, 3, 1, 2).dropWhile(x -> x < 3).toList();` },
  ),
  mc(
    'im-8',
    'Intermediate operations',
    'When is mapMulti a better choice than flatMap?',
    'Each input yields only a few outputs, so you avoid allocating a temporary Stream per element',
    [
      'When you need parallel execution',
      'When the output must be sorted',
      'When elements may be null',
    ],
  ),

  // Terminal operations
  mc(
    'tm-1',
    'Terminal operations',
    'reduce(BinaryOperator) with no identity returns:',
    'Optional<T>',
    ['T', 'int', 'Stream<T>'],
    { note: 'There may be no elements, so there may be no result.' },
  ),
  mc(
    'tm-2',
    'Terminal operations',
    'What does allMatch return on an empty stream?',
    'true',
    ['false', 'null', 'It throws'],
    { note: 'Vacuous truth. anyMatch is false and noneMatch is true on an empty stream.' },
  ),
  mc(
    'tm-3',
    'Terminal operations',
    'Which is the better way to count matches?',
    'filter(...).count()',
    [
      'A forEach that increments an AtomicInteger',
      'A for loop over stream().toArray()',
      'reduce(0, (a, b) -> a + 1)',
    ],
  ),
  mc(
    'tm-4',
    'Terminal operations',
    'findAny() differs from findFirst() because:',
    'It may return any element, which allows more freedom in parallel streams',
    ['It returns a list', 'It never returns an empty Optional', 'It needs a sorted stream'],
  ),
  mc(
    'tm-5',
    'Terminal operations',
    'In a parallel stream, which keeps the encounter order while consuming?',
    'forEachOrdered',
    ['forEach', 'peek', 'findAny'],
  ),
  mc(
    'tm-6',
    'Terminal operations',
    'Which statement about Stream.toList() is true?',
    'It returns an unmodifiable list and allows null elements',
    ['It returns a modifiable ArrayList', 'It rejects null elements', 'It returns a Set'],
    { note: 'Collectors.toList() makes no guarantee about mutability, in practice an ArrayList.' },
  ),
  mc('tm-7', 'Terminal operations', 'max(Comparator) and min(Comparator) return:', 'Optional<T>', [
    'T',
    'int',
    'The index of the element',
  ]),

  // Collectors
  mc(
    'co-1',
    'Collectors',
    'What type does groupingBy(Employee::dept) produce?',
    'Map<String, List<Employee>>',
    ['Map<String, Employee>', 'Map<String, Long>', 'List<Map<String, Employee>>'],
  ),
  mc(
    'co-2',
    'Collectors',
    'What type does groupingBy(Employee::dept, counting()) produce?',
    'Map<String, Long>',
    ['Map<String, Integer>', 'Map<String, List<Employee>>', 'Map<Long, String>'],
    { note: 'counting() returns Long, not Integer.' },
  ),
  mc(
    'co-3',
    'Collectors',
    'partitioningBy always produces:',
    'A Map<Boolean, List<T>> that contains both the true and false keys',
    ['A Map that only has keys that matched', 'A Set<T>', 'A List of two lists with no map'],
  ),
  mc(
    'co-4',
    'Collectors',
    'toMap(Employee::dept, Employee::name) throws when two employees share a dept. What?',
    'IllegalStateException: duplicate key',
    ['The second value silently wins', 'NullPointerException', 'ConcurrentModificationException'],
    { note: 'Pass a merge function as the third argument, for example (a, b) -> a + "," + b.' },
  ),
  mc(
    'co-5',
    'Collectors',
    'How do you get a TreeMap with keys sorted from groupingBy?',
    'groupingBy(f, TreeMap::new, toList())',
    ['groupingBy(f).sorted()', 'groupingBy(f, toList()).toTreeMap()', 'groupingBy(f, sortedBy())'],
  ),
  mc(
    'co-6',
    'Collectors',
    'What does mapping do inside groupingBy?',
    'Transforms each element before it goes to the downstream collector',
    ['Sorts each group', 'Removes duplicates between groups', 'Merges groups with the same size'],
    {
      note: 'groupingBy(Employee::dept, mapping(Employee::name, toList())) gives dept to list of names.',
    },
  ),
  mc(
    'co-7',
    'Collectors',
    'Which collector combines the results of two collectors in a single pass?',
    'Collectors.teeing',
    ['Collectors.pairing', 'Collectors.zip', 'Collectors.combining'],
    { note: 'Added in Java 12: teeing(c1, c2, (r1, r2) -> ...).' },
  ),
  mc(
    'co-8',
    'Collectors',
    'collectingAndThen(toList(), Collections::unmodifiableList) does what?',
    'Runs a finisher function on the collected result',
    ['Collects twice', 'Sorts the list', 'Makes the stream parallel'],
  ),
  mc('co-9', 'Collectors', 'What is the result?', '[a, b, c]', ['a, b, c', '[a,b,c]', 'abc'], {
    context: r`Stream.of("a", "b", "c").collect(Collectors.joining(", ", "[", "]"));`,
  }),
  mc(
    'co-10',
    'Collectors',
    'Which collector returns count, sum, min, average and max together?',
    'summarizingInt (an IntSummaryStatistics)',
    ['reducing', 'teeing', 'counting'],
  ),
  mc('co-11', 'Collectors', 'toMap with a null value throws:', 'NullPointerException', [
    'IllegalStateException',
    'Nothing: null is stored',
    'IllegalArgumentException',
  ]),

  // Primitive streams
  mc(
    'pr-1',
    'Primitive streams',
    'What does IntStream.rangeClosed(1, 5).sum() return?',
    '15',
    ['10', '14', '5'],
    { note: 'range(1, 5) excludes the end and would give 10.' },
  ),
  mc('pr-2', 'Primitive streams', 'IntStream.average() returns:', 'OptionalDouble', [
    'double',
    'Optional<Double>',
    'int',
  ]),
  mc(
    'pr-3',
    'Primitive streams',
    'Which call converts an IntStream into a Stream<Integer>?',
    'boxed()',
    ['mapToObj()', 'asList()', 'toStream()'],
  ),
  mc(
    'pr-4',
    'Primitive streams',
    'Why prefer mapToInt/mapToDouble over map for numbers?',
    'It avoids boxing and gives sum(), average() and summaryStatistics()',
    ['It is required for parallel streams', 'It makes the stream lazy', 'It preserves null values'],
  ),
  mc(
    'pr-5',
    'Primitive streams',
    'What does "abc".chars() return?',
    'An IntStream of char values',
    ['A Stream<Character>', 'A char[]', 'A Stream<String>'],
    { note: 'Cast with (char) or use mapToObj(c -> (char) c) when you need characters.' },
  ),

  // Optional
  mc(
    'op-1',
    'Optional',
    'What does Optional.of(null) do?',
    'Throws NullPointerException',
    ['Returns an empty Optional', 'Returns Optional.of("null")', 'Returns null'],
    { note: 'Use Optional.ofNullable when the value may be null.' },
  ),
  mc(
    'op-2',
    'Optional',
    'What is the difference between orElse and orElseGet?',
    'orElse always evaluates its argument. orElseGet calls the supplier only when empty',
    [
      'orElseGet always evaluates, orElse is lazy',
      'orElse throws when empty',
      'There is no difference',
    ],
    {
      remember:
        'Get is for generating lazily: use orElseGet when the fallback is expensive or has side effects.',
    },
  ),
  mc(
    'op-3',
    'Optional',
    'Optional.orElseThrow() with no arguments (Java 10) throws:',
    'NoSuchElementException',
    ['NullPointerException', 'IllegalStateException', 'Nothing: it returns null'],
  ),
  mc(
    'op-4',
    'Optional',
    'When do you use flatMap instead of map on an Optional?',
    'When the function itself returns an Optional',
    [
      'When the value is a collection',
      'When the Optional is empty',
      'When you need the value as a primitive',
    ],
    { note: 'map would give Optional<Optional<T>>.' },
  ),
  mc(
    'op-5',
    'Optional',
    'Where should Optional normally be used?',
    'As a method return type',
    ['As an entity field', 'As a method parameter', 'As a collection element'],
    { note: 'It is not Serializable and adds noise as a field or parameter.' },
  ),
  mc(
    'op-6',
    'Optional',
    'Which Java 9 method runs one action when present and another when empty?',
    'ifPresentOrElse',
    ['ifPresent', 'orElseRun', 'whenPresent'],
  ),
  mc(
    'op-7',
    'Optional',
    'Which Java 9 Optional method lets you flatMap a list of Optionals into their present values?',
    'Optional::stream',
    ['Optional::toList', 'Optional::orElse', 'Optional::collect'],
    { note: 'optionals.stream().flatMap(Optional::stream) drops the empty ones.' },
  ),
  mc(
    'op-8',
    'Optional',
    'Optional.or(supplier) returns:',
    'This Optional if present, otherwise the Optional produced by the supplier',
    ['The value or the supplier result', 'A Stream', 'A boolean'],
  ),

  // Comparator and sorting
  mc(
    'cm-1',
    'Comparator',
    'Why does Comparator.comparing(e -> e.age()).reversed() fail to compile?',
    'There is no target type for the lambda, so e is inferred as Object',
    ['reversed() does not exist', 'age() is private', 'comparing needs a method reference'],
    {
      note: 'Use Comparator.comparing(Employee::age).reversed() or comparing(Employee::age, Comparator.reverseOrder()).',
    },
  ),
  mc(
    'cm-2',
    'Comparator',
    'Why is (a, b) -> a - b a risky int comparator?',
    'The subtraction can overflow. Use Integer.compare(a, b)',
    ['It sorts descending', 'It is slower than compare', 'It cannot be used with lists'],
  ),
  mc(
    'cm-3',
    'Comparator',
    'Which comparator factory avoids boxing for an int key?',
    'Comparator.comparingInt',
    ['Comparator.comparing', 'Comparator.thenInt', 'Comparator.intComparing'],
  ),
  mc('cm-4', 'Comparator', 'How do you break ties after sorting by name?', 'thenComparing(...)', [
    'andThen(...)',
    'orElse(...)',
    'alsoComparing(...)',
  ]),
  mc('cm-5', 'Comparator', 'Which wrapper sorts null elements last?', 'Comparator.nullsLast(...)', [
    'Comparator.lastNull(...)',
    'Comparator.naturalOrder() alone',
    'Comparator.reverseOrder() alone',
  ]),
  mc(
    'cm-6',
    'Comparator',
    'What is the result of sorting with nulls last and shortest first?',
    '[fig, pear, apple, null]',
    ['[null, fig, pear, apple]', '[apple, pear, fig, null]', '[fig, pear, null, apple]'],
    {
      context: r`Arrays.asList("pear", null, "apple", "fig")
    .sort(Comparator.nullsLast(Comparator.comparingInt(String::length)));`,
    },
  ),

  // Collection and Map APIs
  mc(
    'cl-1',
    'Collections and maps',
    'What does List.of(1, 2).add(3) do?',
    'Throws UnsupportedOperationException',
    ['Adds 3', 'Returns false', 'Returns a new list'],
  ),
  mc(
    'cl-2',
    'Collections and maps',
    'List.of(...) and null elements:',
    'List.of rejects null with NullPointerException',
    ['Nulls are allowed', 'Nulls become empty strings', 'Nulls are silently dropped'],
  ),
  mc(
    'cl-3',
    'Collections and maps',
    'On Arrays.asList(...), which operation works?',
    'set(i, x)',
    ['add(x)', 'remove(i)', 'clear()'],
    { note: 'It is fixed-size, backed by the array. Replacing is fine, resizing is not.' },
  ),
  mc(
    'cl-4',
    'Collections and maps',
    'When the key is absent, what does merge(key, 1, Integer::sum) do?',
    'Stores 1 without calling the function',
    ['Throws NullPointerException', 'Stores 0', 'Calls sum with a null'],
  ),
  mc(
    'cl-5',
    'Collections and maps',
    'What does putIfAbsent return when the key was absent?',
    'null',
    ['The new value', 'true', 'The key'],
    { note: 'It returns the previous value, so null means nothing was there.' },
  ),
  mc(
    'cl-6',
    'Collections and maps',
    'What is the difference between Collections.unmodifiableList(list) and List.copyOf(list)?',
    'unmodifiableList is a read-only view that reflects later changes. copyOf is an independent snapshot',
    [
      'They are the same',
      'copyOf is a view, unmodifiableList is a copy',
      'unmodifiableList rejects nulls, copyOf allows them',
    ],
  ),
  mc(
    'cl-7',
    'Collections and maps',
    'Which Map.Entry helper sorts entries by value?',
    'Map.Entry.comparingByValue()',
    ['Map.Entry.sortByValue()', 'Map.Entry.valueComparator()', 'Entry.byValue()'],
  ),

  // Parallel streams
  mc(
    'pl-1',
    'Parallel streams',
    'Which pool does a parallel stream use by default?',
    'The shared ForkJoinPool common pool',
    ['A new pool per stream', 'The virtual thread scheduler', 'The Tomcat request pool'],
    { note: 'It is shared by the whole JVM, so a slow task can starve other work.' },
  ),
  mc(
    'pl-2',
    'Parallel streams',
    'Which workload suits a parallel stream?',
    'CPU-bound, stateless work over a large, easily split source such as an ArrayList',
    ['Blocking REST calls', 'Tiny lists', 'Work that updates a shared mutable collection'],
  ),
  mc(
    'pl-3',
    'Parallel streams',
    'Which source splits poorly for parallel processing?',
    'LinkedList (or Stream.iterate)',
    ['ArrayList', 'int[] array', 'IntStream.range'],
  ),
  mc(
    'pl-4',
    'Parallel streams',
    'What breaks reduce in a parallel stream?',
    'A function that is not associative, or an identity that is not neutral',
    ['Using method references', 'Using a lambda', 'Using Optional'],
  ),

  // Java 9 to 25
  mc('jv-1', 'Newer Java features', 'In which Java version did records become final?', '16', [
    '14',
    '17',
    '21',
  ]),
  mc(
    'jv-2',
    'Newer Java features',
    'In which Java version did pattern matching for switch become final?',
    '21',
    ['16', '17', '25'],
  ),
  mc('jv-3', 'Newer Java features', 'In which Java version did text blocks become final?', '15', [
    '11',
    '16',
    '17',
  ]),
  mc('jv-4', 'Newer Java features', 'In which Java version was var introduced?', '10', [
    '8',
    '9',
    '11',
  ]),
  mc(
    'jv-5',
    'Newer Java features',
    'In which Java version did virtual threads become final?',
    '21',
    ['17', '19', '24'],
  ),
  mc(
    'jv-6',
    'Newer Java features',
    'In which Java version did Stream Gatherers become final?',
    '24',
    ['21', '22', '25'],
  ),
  mc(
    'jv-7',
    'Newer Java features',
    'In which Java version did unnamed variables (_) become final?',
    '22',
    ['17', '21', '25'],
  ),
  mc('jv-8', 'Newer Java features', 'Which Java version made scoped values final?', '25', [
    '21',
    '22',
    '24',
  ]),
  mc(
    'jv-9',
    'Newer Java features',
    'What does Gatherers.windowFixed(3) give on 1 to 7?',
    '[[1, 2, 3], [4, 5, 6], [7]]',
    ['[[1, 2, 3], [4, 5, 6]]', '[[1, 2, 3], [2, 3, 4], [3, 4, 5]]', '[1, 2, 3]'],
    { note: 'The last window may be smaller. Handy for batching ids into saveAll(chunk).' },
  ),
  mc(
    'jv-10',
    'Newer Java features',
    'What does Gatherers.windowSliding(2) give on 1 to 4?',
    '[[1, 2], [2, 3], [3, 4]]',
    ['[[1, 2], [3, 4]]', '[[1, 2, 3], [2, 3, 4]]', '[1, 2, 3, 4]'],
  ),
  mc(
    'jv-11',
    'Newer Java features',
    'What does Gatherers.scan(() -> 0, Integer::sum) give on 1 to 4?',
    '[1, 3, 6, 10]',
    ['[10]', '[0, 1, 3, 6, 10]', '[1, 2, 3, 4]'],
    { note: 'A running total. Gatherers.fold gives only the final [10].' },
  ),
  mc(
    'jv-12',
    'Newer Java features',
    'What does Gatherers.mapConcurrent(8, f) do?',
    'Maps with at most 8 tasks at once on virtual threads, keeping encounter order',
    [
      'Runs a parallel stream on 8 cores',
      'Batches elements in groups of 8',
      'Limits the stream to 8 elements',
    ],
  ),
  mc(
    'jv-13',
    'Newer Java features',
    'Why were Gatherers added?',
    'To allow custom stateful or many-to-many intermediate operations that streams could not express',
    [
      'To replace Collectors',
      'To make streams parallel by default',
      'To remove the need for lambdas',
    ],
  ),
  mc(
    'jv-14',
    'Newer Java features',
    'How is a ScopedValue different from a ThreadLocal?',
    'It is immutable and bound only for a bounded scope, which suits virtual threads',
    [
      'It is mutable and global',
      'It lives until the thread ends',
      'It cannot be read by child tasks',
    ],
  ),
  mc(
    'jv-15',
    'Newer Java features',
    'What do flexible constructor bodies (Java 25) allow?',
    'Statements such as validation before the call to super(...)',
    ['Constructors with no body', 'Constructors that return values', 'Calling this() twice'],
  ),
  mc(
    'jv-16',
    'Newer Java features',
    'What does `import module java.base;` do?',
    'Imports every package exported by the java.base module',
    ['Loads a module at runtime', 'Imports only java.lang', 'Declares a new module'],
  ),

  // Records and pattern matching
  mc(
    'rc-1',
    'Records and patterns',
    'What does a record generate for a component named name?',
    'A name() accessor, plus constructor, equals, hashCode and toString',
    ['A getName() accessor and setName()', 'Only a constructor', 'Only toString'],
  ),
  mc(
    'rc-2',
    'Records and patterns',
    'Which statement about records is true?',
    'They are implicitly final and their fields are final',
    ['They can extend any class', 'They allow setters by default', 'They are mutable'],
  ),
  mc(
    'rc-3',
    'Records and patterns',
    'What is a compact constructor for?',
    'Validating or normalizing components without repeating the parameter list',
    [
      'Creating a second record type',
      'Replacing the canonical accessors',
      'Making the record mutable',
    ],
  ),
  mc(
    'rc-4',
    'Records and patterns',
    'Why can a switch over a sealed interface skip the default branch?',
    'The compiler knows every permitted subtype, so it checks exhaustiveness',
    [
      'default is not allowed on switch expressions',
      'Sealed types make every case optional',
      'Sealed switches return null for missing cases',
    ],
  ),
  mc(
    'rc-5',
    'Records and patterns',
    'What does `when` do in `case Circle c when c.r() > 10 ->`?',
    'Adds a guard condition to the pattern',
    ['Declares a loop', 'Catches an exception', 'Starts a lambda'],
  ),
  mc(
    'rc-6',
    'Records and patterns',
    'What does `o instanceof Point(int x, int y)` do?',
    'Tests the type and binds x and y from the record components',
    ['Calls the Point constructor', 'Copies the point', 'Casts without checking'],
  ),
  mc(
    'rc-7',
    'Records and patterns',
    'What does `case null` allow in a pattern switch (Java 21)?',
    'Handling null explicitly instead of getting a NullPointerException',
    ['Skipping the default branch', 'Matching every type', 'Declaring a null record'],
  ),

  // CompletableFuture and virtual threads
  mc(
    'cf-1',
    'Async and virtual threads',
    'Which CompletableFuture method avoids CompletableFuture<CompletableFuture<T>>?',
    'thenCompose',
    ['thenApply', 'thenCombine', 'thenAccept'],
    { remember: 'thenApply is map, thenCompose is flatMap, thenCombine is zip.' },
  ),
  mc(
    'cf-2',
    'Async and virtual threads',
    'Which method joins two independent futures with a BiFunction?',
    'thenCombine',
    ['thenCompose', 'thenApply', 'thenRun'],
  ),
  mc(
    'cf-3',
    'Async and virtual threads',
    'supplyAsync without an executor runs on:',
    'The ForkJoinPool common pool',
    ['A new thread each call', 'The calling thread', 'A virtual thread'],
    { note: 'A few slow HTTP calls can starve it. Pass your own executor for blocking work.' },
  ),
  mc(
    'cf-4',
    'Async and virtual threads',
    'How do join() and get() differ?',
    'join throws an unchecked CompletionException. get throws checked exceptions',
    ['get never blocks', 'join takes a timeout', 'join returns a future'],
  ),
  mc(
    'cf-5',
    'Async and virtual threads',
    'Which of these can change the result and sees both the value and the exception?',
    'handle',
    ['exceptionally', 'whenComplete', 'thenAccept'],
    {
      note: 'exceptionally only runs on failure. whenComplete observes but does not change the result.',
    },
  ),
  mc(
    'cf-6',
    'Async and virtual threads',
    'CompletableFuture.allOf(a, b, c) returns:',
    'CompletableFuture<Void>',
    ['CompletableFuture<List<T>>', 'List<CompletableFuture<T>>', 'void'],
    { note: 'Call join() on each original future afterwards to read the results.' },
  ),
  mc(
    'cf-7',
    'Async and virtual threads',
    'Two independent calls run in parallel via CompletableFuture. What is the total latency?',
    'About the slower of the two',
    ['The sum of both', 'The faster of the two', 'Always zero'],
  ),
  mc(
    'cf-8',
    'Async and virtual threads',
    'Which Java 9 method fails a future if it does not complete in time?',
    'orTimeout',
    ['withTimeout', 'cancelAfter', 'timeoutAfter'],
  ),
  mc(
    'cf-9',
    'Async and virtual threads',
    'How do you start one virtual thread per task with an executor?',
    'Executors.newVirtualThreadPerTaskExecutor()',
    ['Executors.newFixedThreadPool(8)', 'Executors.newVirtualPool(8)', 'new VirtualThreadPool()'],
    { note: 'Do not pool virtual threads: they are cheap, create one per task.' },
  ),
  mc(
    'cf-10',
    'Async and virtual threads',
    'Which workload benefits most from virtual threads?',
    'Blocking I/O such as REST and JDBC calls',
    ['Heavy CPU number crunching', 'Tight loops with no waiting', 'Single-threaded scripts'],
  ),
  mc(
    'cf-11',
    'Async and virtual threads',
    'Which Spring Boot 3.2+ property turns on virtual threads for Tomcat and async work?',
    'spring.threads.virtual.enabled=true',
    ['spring.virtual-threads=on', 'server.threads.virtual=true', 'spring.async.virtual=true'],
  ),

  // Spring Boot usage
  mc(
    'sp-1',
    'Spring Boot usage',
    'Why can @Transactional behave unexpectedly inside a parallel stream or supplyAsync?',
    'The transaction context is thread-bound, so other threads do not share it',
    [
      'Transactions cannot use lambdas',
      'Parallel streams always roll back',
      'The transaction is copied to every thread',
    ],
  ),
  mc(
    'sp-2',
    'Spring Boot usage',
    'A Spring Data repository method returns Stream<Entity>. What must you do with it?',
    'Close it, for example with try-with-resources',
    ['Nothing: it closes itself', 'Call parallel() on it', 'Convert it to a List before returning'],
    { note: 'The stream holds a database cursor. It also needs an active transaction.' },
  ),

  // Typed code recall
  q(
    'code-1',
    'Code recall',
    'Names of employees older than 30, as an unmodifiable list.',
    ['List<String> names = emps.stream().filter(e -> e.age() > 30).map(Employee::name).toList();'],
    {
      context: emps,
      explain:
        'This is the standard filter, map, collect shape.\n- `emps.stream()` opens a stream over the list.\n- `filter(e -> e.age() > 30)` keeps only the matching employees.\n- `map(Employee::name)` turns each Employee into its name.\n- `toList()` (Java 16) ends the pipeline with an unmodifiable list.',
      remember:
        'Say it as a sentence: stream, keep the old ones, take their names, to a list. Keep matching, then transform, then collect.',
    },
  ),
  q(
    'code-2',
    'Code recall',
    'Total salary as a double using a primitive stream.',
    ['double total = emps.stream().mapToDouble(Employee::salary).sum();'],
    {
      context: emps,
      explain:
        '`mapToDouble` switches to a DoubleStream, which has `sum()`, `average()` and `max()` without boxing.',
      remember: 'Numbers want the primitive map: mapToInt, mapToLong, mapToDouble.',
    },
  ),
  q(
    'code-3',
    'Code recall',
    'Count employees older than 30 without mutating anything.',
    ['long count = emps.stream().filter(e -> e.age() > 30).count();'],
    {
      context: emps,
      explain: '`count()` returns a `long`. Do not increment a counter inside forEach.',
      remember: 'Filter then count: the answer is a long, never an int.',
    },
  ),
  q(
    'code-4',
    'Code recall',
    'Group employees by department into byDept.',
    [
      'Map<String, List<Employee>> byDept = emps.stream().collect(Collectors.groupingBy(Employee::dept));',
      'Map<String, List<Employee>> byDept = emps.stream().collect(groupingBy(Employee::dept));',
    ],
    {
      context: emps,
      explain:
        '`groupingBy(classifier)` builds a map from the classifier result to a list of the matching elements.\n- The key type is whatever the classifier returns (String here).\n- The value is a `List<Employee>` unless you pass a downstream collector.',
      remember: 'Group by the key, get a map of lists.',
    },
  ),
  q(
    'code-5',
    'Code recall',
    'Count employees per department into counts.',
    [
      'Map<String, Long> counts = emps.stream().collect(Collectors.groupingBy(Employee::dept, Collectors.counting()));',
      'Map<String, Long> counts = emps.stream().collect(groupingBy(Employee::dept, counting()));',
    ],
    {
      context: emps,
      explain:
        'A downstream collector as the second argument changes what each group becomes. `counting()` replaces the list with a `Long` count.',
      remember: 'groupingBy, then counting: the map value type is Long.',
    },
  ),
  q(
    'code-6',
    'Code recall',
    'Split employees into those earning over 100000 and the rest, into parts.',
    [
      'Map<Boolean, List<Employee>> parts = emps.stream().collect(Collectors.partitioningBy(e -> e.salary() > 100000));',
      'Map<Boolean, List<Employee>> parts = emps.stream().collect(partitioningBy(e -> e.salary() > 100000));',
    ],
    {
      context: emps,
      explain:
        '`partitioningBy` takes a Predicate and always returns both keys: `true` and `false`.',
      remember: 'Partition means two buckets: a Predicate in, a Map<Boolean, List> out.',
    },
  ),
  q(
    'code-7',
    'Code recall',
    'Sorted, distinct list of every skill across all employees (skills is a List<String>).',
    ['emps.stream().flatMap(e -> e.skills().stream()).distinct().sorted().toList();'],
    {
      context: emps,
      explain:
        '`flatMap` turns each employee into a stream of their skills and concatenates them into one stream. Then `distinct()` removes repeats and `sorted()` orders them.',
      remember: 'List of lists to one list is flatMap: each element becomes a stream.',
    },
  ),
  q(
    'code-8',
    'Code recall',
    'The highest-paid employee as an Optional.',
    ['Optional<Employee> top = emps.stream().max(Comparator.comparingDouble(Employee::salary));'],
    {
      context: emps,
      explain:
        '`max` needs a Comparator and returns an Optional, because the stream may be empty. `comparingDouble` avoids boxing the salary.',
      remember: 'max and min take a Comparator and hand back an Optional.',
    },
  ),
  q(
    'code-9',
    'Code recall',
    'Sort emps in place by name, then by age.',
    ['emps.sort(Comparator.comparing(Employee::name).thenComparing(Employee::age));'],
    {
      context: emps,
      explain:
        '`comparing` sets the primary key and `thenComparing` breaks ties. `List.sort` sorts the list itself, unlike `stream().sorted()`.',
      remember: 'Comparing first, thenComparing for ties.',
    },
  ),
  q(
    'code-10',
    'Code recall',
    'A curried add: a function that takes a and returns a function that takes b and returns a + b.',
    ['Function<Integer, Function<Integer, Integer>> add = a -> b -> a + b;'],
    {
      explain:
        'The type reads inside out: a Function from Integer to (a Function from Integer to Integer). `add.apply(2).apply(3)` gives 5.',
      remember: 'Two arrows in the lambda, two Function types in the declaration.',
    },
  ),
  q(
    'code-11',
    'Code recall',
    'Combine Function<String,String> f and g so f runs first, into both.',
    ['Function<String, String> both = f.andThen(g);'],
    {
      explain: '`andThen` runs the receiver first and feeds its result to the argument: g(f(x)).',
      remember: 'andThen reads left to right, like a pipe.',
    },
  ),
  q(
    'code-12',
    'Code recall',
    'A Predicate<String> that is true for non-blank strings, using a method reference.',
    ['Predicate<String> notBlank = Predicate.not(String::isBlank);'],
    {
      explain:
        '`Predicate.not` (Java 11) negates a predicate and works with method references, where `!` and a lambda would be noisier.',
      remember: 'Not a negation operator: Predicate dot not.',
    },
  ),
  q(
    'code-13',
    'Code recall',
    'Count word frequencies: add one to freq for word w, in one statement.',
    ['freq.merge(w, 1, Integer::sum);'],
    {
      explain:
        '`merge` stores 1 if the key is absent. Otherwise it calls `Integer::sum` with the old value and 1.',
      remember: 'Merge the key with 1, summing on a clash.',
    },
  ),
  q(
    'code-14',
    'Code recall',
    'Add value to the list stored under key, creating the list first if needed.',
    ['map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);'],
    {
      explain:
        '`computeIfAbsent` returns the existing list or creates and stores a new one, so you can chain `add` straight onto it.',
      remember: 'Compute if absent, then add to what it returns.',
    },
  ),
  q(
    'code-15',
    'Code recall',
    'City of an optional user, or "unknown", via the address (user is Optional<User>).',
    ['String city = user.map(User::address).map(Address::city).orElse("unknown");'],
    {
      explain:
        'Each `map` runs only if a value is present, so a missing user or a null city short-circuits to the `orElse` default.',
      remember: 'Chain maps, finish with orElse.',
    },
  ),
  q(
    'code-16',
    'Code recall',
    'Map dept to employee name, joining names with a comma when a dept repeats.',
    [
      'Map<String, String> m = emps.stream().collect(Collectors.toMap(Employee::dept, Employee::name, (a, b) -> a + "," + b));',
      'Map<String, String> m = emps.stream().collect(toMap(Employee::dept, Employee::name, (a, b) -> a + "," + b));',
    ],
    {
      context: emps,
      explain:
        'Without the third argument, `toMap` throws IllegalStateException on a duplicate key. The merge function decides what to keep.',
      remember: 'toMap needs three: key, value, and a merge for clashes.',
    },
  ),
  q(
    'code-17',
    'Code recall',
    'Sum of 1 to 100 using IntStream.',
    ['int sum = IntStream.rangeClosed(1, 100).sum();'],
    {
      explain: '`rangeClosed` includes the end. `range(1, 100)` would stop at 99.',
      remember: 'Closed means the end is in.',
    },
  ),
  q(
    'code-18',
    'Code recall',
    'Join futures user and orders into a Profile using its constructor.',
    ['CompletableFuture<Profile> p = user.thenCombine(orders, Profile::new);'],
    {
      explain:
        '`thenCombine` waits for both independent futures and passes their results to a BiFunction. `Profile::new` works as that BiFunction.',
      remember: 'Combine is zip: two futures in, one future out.',
    },
  ),
  q(
    'code-19',
    'Code recall',
    'Sliding windows of size 2 over 1, 2, 3, 4 using Gatherers.',
    ['Stream.of(1, 2, 3, 4).gather(Gatherers.windowSliding(2)).toList();'],
    {
      explain:
        '`gather` (Java 24) plugs a Gatherer into the pipeline as an intermediate step. Result: [[1, 2], [2, 3], [3, 4]].',
      remember: 'Sliding moves one at a time. Fixed jumps a whole window.',
    },
  ),
  q(
    'code-20',
    'Code recall',
    'Convert list to a String[] using a constructor reference.',
    ['String[] arr = list.toArray(String[]::new);'],
    {
      explain:
        '`String[]::new` is the array constructor reference that `toArray` uses to allocate the right type.',
      remember: 'toArray with the array type constructor.',
    },
  ),
  q(
    'code-21',
    'Code recall',
    'Remove every negative number from list in place.',
    ['list.removeIf(x -> x < 0);'],
    {
      explain:
        '`removeIf` takes a Predicate and removes matches without the ConcurrentModificationException of a manual loop.',
      remember: 'Remove if: the Predicate says yes, the element goes.',
    },
  ),
  q(
    'code-22',
    'Code recall',
    'Summary statistics (count, sum, min, avg, max) of the Integer list ages.',
    ['IntSummaryStatistics stats = ages.stream().mapToInt(Integer::intValue).summaryStatistics();'],
    {
      explain:
        '`mapToInt` gives an IntStream, and `summaryStatistics()` collects all five numbers in one pass.',
      remember: 'Unbox with mapToInt, then summaryStatistics.',
    },
  ),
];

export const javafpQuiz: Quiz = {
  slug: 'java-functional',
  title: 'Java Functional Programming',
  description:
    'Lambdas, streams, collectors, Optional, comparators, records, pattern matching and CompletableFuture from Java 8 to 25. Mostly multiple choice, plus code you type from memory.',
  source: {
    label: 'Java Functional Programming Study Book',
    href: '/resources/java-functional-programming-study-book.html',
  },
  /** Ordered by importance: random rounds of N take the first N. */
  questions: rankQuestions(authored, javafpPriority),
};
