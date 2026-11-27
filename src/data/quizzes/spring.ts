import type { Quiz, QuizQuestion } from './types';
import { mc, q, r } from './helpers';

/**
 * Every answer explains the same way: what it does, since which version, the common trap,
 * where it matters in real code or interviews, and where to read more in the study book.
 * The memory tip goes in `remember`. Questions are authored most-important first, so random
 * rounds of 10, 25 and 50 take the front of this list.
 */
type Detail = {
  what: string;
  since?: string;
  trap?: string;
  use?: string;
  ref: string;
  tip: string;
};

function explainOf(d: Detail): { explain: string; remember: string } {
  const lines = [d.what];
  if (d.since) lines.push(`- Since: ${d.since}`);
  if (d.trap) lines.push(`- Common trap: ${d.trap}`);
  if (d.use) lines.push(`- In real code and interviews: ${d.use}`);
  lines.push(`- Reference: ${d.ref}`);
  return { explain: lines.join('\n'), remember: d.tip };
}

/** Typed: write the annotation, property or snippet from memory. */
function t(
  id: string,
  section: string,
  prompt: string,
  answers: string[],
  d: Detail,
  context?: string,
): QuizQuestion {
  return q(id, section, prompt, answers, { ...explainOf(d), context });
}

/** Multiple choice: pick the correct behaviour, class or rule. */
function m(
  id: string,
  section: string,
  prompt: string,
  correct: string,
  wrong: [string, string, string],
  d: Detail,
  context?: string,
): QuizQuestion {
  return mc(id, section, prompt, correct, wrong, { ...explainOf(d), context });
}

const authored: QuizQuestion[] = [
  // ---------------------------------------------------------------- Core container
  m(
    'di-style',
    'Container and beans',
    'Which dependency injection style does Spring recommend for required dependencies?',
    'Constructor injection',
    [
      'Field injection with @Autowired',
      'Setter injection on every dependency',
      'Looking beans up with ApplicationContext.getBean()',
    ],
    {
      what: 'Constructor injection makes dependencies explicit, lets fields be final, works in plain unit tests without Spring, and fails at startup if something is missing.',
      since: 'a class with a single constructor needs no @Autowired from Spring 4.3.',
      trap: 'field injection hides dependencies, cannot be final and needs reflection or a Spring context to test.',
      use: 'the standard answer to "how do you inject dependencies" and the first thing reviewers check.',
      ref: 'Study book, section 1 (IoC, DI and bean definitions).',
      tip: 'Constructor = required and final. Setter = optional. Field = avoid.',
    },
  ),
  t(
    'primary',
    'Container and beans',
    'Which annotation marks a bean as the default choice when several beans match the injected type?',
    [r`@Primary`],
    {
      what: '`@Primary` on a bean (or its @Bean method) makes it the winner when injection by type finds more than one candidate.',
      trap: 'without @Primary or @Qualifier you get NoUniqueBeanDefinitionException at startup.',
      use: 'two DataSources, two clients, or a decorated and a plain implementation of the same interface.',
      ref: 'Study book, section 1.',
      tip: 'Primary = the default pick. Qualifier = the explicit pick.',
    },
  ),
  t(
    'qualifier',
    'Container and beans',
    'Inject the bean named "fastClient" into this constructor parameter. Write the annotation.',
    [r`@Qualifier("fastClient")`],
    {
      what: '`@Qualifier` chooses one candidate by qualifier value, which defaults to the bean name.',
      trap: 'a @Qualifier beats @Primary. If neither is given, Spring falls back to matching the parameter name to a bean name.',
      use: 'picking one of several implementations at the injection point.',
      ref: 'Study book, section 1.',
      tip: 'Resolution order: Qualifier, Primary, Priority, then name match.',
    },
    r`Client(@??? Client client) { ... }`,
  ),
  m(
    'proto-in-singleton',
    'Container and beans',
    'A prototype-scoped bean is injected into a singleton. How many prototype instances does the singleton get?',
    'One, created when the singleton is built',
    ['A new one on every method call', 'One per HTTP request', 'None, Spring refuses to wire it'],
    {
      what: 'Injection happens once, when the singleton is created, so the prototype is captured a single time.',
      trap: 'people assume "prototype" means fresh on every use. Fix it by injecting `ObjectProvider<T>` (call `getObject()`), or a scoped proxy.',
      use: 'a classic scopes interview question.',
      ref: 'Study book, section 2 (Scopes, lifecycle and circular dependencies).',
      tip: 'Scope applies at injection time, not at call time.',
    },
  ),
  t(
    'circular-prop',
    'Container and beans',
    'Write the property that re-allows circular bean references (discouraged).',
    [r`spring.main.allow-circular-references=true`, r`spring.main.allow-circular-references: true`],
    {
      what: 'Boot 2.6 turned circular references off by default because cycles hide design problems.',
      since: 'Boot 2.6 bans cycles by default.',
      trap: 'constructor cycles can never be resolved (BeanCurrentlyInCreationException). Turning the flag on only masks the design smell.',
      use: 'fix by extracting a third bean, publishing an event, or as a last resort @Lazy on one constructor parameter.',
      ref: 'Study book, section 2.',
      tip: 'If you reach for this flag, redesign instead.',
    },
  ),
  m(
    'bfpp-bpp',
    'Container and beans',
    'What is the difference between a BeanFactoryPostProcessor and a BeanPostProcessor?',
    'The first edits bean definitions before instances exist, the second wraps or changes instances (for example proxies)',
    [
      'The first runs at shutdown, the second at startup',
      'The first handles XML, the second handles annotations',
      'They are the same, one is just the older name',
    ],
    {
      what: 'BFPP works on metadata (for example resolving ${...} placeholders). BPP runs around initialisation of each bean and is how AOP proxies for @Transactional and @Async are created.',
      use: 'explains why proxy-based features behave the way they do.',
      ref: 'Study book, sections 2 and 11 (AOP and proxies).',
      tip: 'Factory post-processor = recipe. Bean post-processor = the cooked bean.',
    },
  ),
  t(
    'postconstruct',
    'Container and beans',
    'Which annotation runs a method once after the bean has been created and its dependencies injected?',
    [r`@PostConstruct`],
    {
      what: '`@PostConstruct` marks an init callback. Its partner `@PreDestroy` runs before the bean is destroyed.',
      since: 'Boot 3 uses jakarta.annotation.PostConstruct (javax before).',
      trap: 'it runs before AOP proxies for the bean are fully applied in some cases, so do not rely on @Transactional inside it.',
      use: 'warm a cache or validate configuration after injection.',
      ref: 'Study book, section 2.',
      tip: 'Post-construct = after wiring. Pre-destroy = before the end.',
    },
  ),
  t(
    'proxybeanmethods',
    'Container and beans',
    'Write the @Configuration annotation that turns off CGLIB proxying of the config class ("lite" mode).',
    [r`@Configuration(proxyBeanMethods = false)`],
    {
      what: 'With `false` Spring does not subclass the config class, so startup is faster and it suits native images. @Bean methods must not call each other directly.',
      since: 'Spring 5.2; all Boot auto-configurations use it.',
      trap: 'a direct call to another @Bean method then creates a second instance instead of returning the singleton.',
      use: 'inject collaborators as @Bean method parameters instead.',
      ref: 'Study book, section 3 (Java config, @Configuration proxies and profiles).',
      tip: 'proxyBeanMethods=false means: no inter-bean method calls.',
    },
  ),
  t(
    'conditional-missing',
    'Auto-configuration',
    'Which condition annotation makes a bean back off when the application already defines one of the same type?',
    [r`@ConditionalOnMissingBean`],
    {
      what: '`@ConditionalOnMissingBean` registers the bean only if no bean of that type exists yet. It is the heart of Boot "sensible defaults you can override".',
      trap: 'it is evaluated in registration order, so use it only in auto-configuration classes that load after user configuration.',
      use: 'writing your own starter.',
      ref: 'Study book, section 5 (Boot auto-configuration, starters and conditions).',
      tip: 'Your bean first, Boot default only if missing.',
    },
  ),
  m(
    'autoconfig-file',
    'Auto-configuration',
    'Where do Boot 3 auto-configurations get registered?',
    'META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports',
    [
      'META-INF/spring.factories under EnableAutoConfiguration',
      'application.properties under spring.autoconfigure.list',
      'The main class component scan',
    ],
    {
      what: 'One class name per line in the .imports file. Boot reads it to know which @AutoConfiguration classes to consider.',
      since:
        'introduced in Boot 2.7; spring.factories registration was removed for auto-config in Boot 3.0.',
      use: 'explains why Boot 2.7 was the bridge release to 3.0.',
      ref: 'Study book, section 5.',
      tip: 'Boot 3 = imports file, not spring.factories.',
    },
  ),
  m(
    'why-bean-missing',
    'Auto-configuration',
    'How do you find out why a Boot auto-configuration did or did not apply?',
    'Start with --debug or open /actuator/conditions to read the conditions report',
    [
      'Enable spring.main.show-beans=true',
      'Read the heap dump',
      'Add @EnableAutoConfigurationReport',
    ],
    {
      what: 'The conditions report lists every auto-configuration as positive or negative match with the exact reason.',
      use: 'the first move in "my bean is not created" or "why did Boot pick this DataSource" questions.',
      ref: 'Study book, section 5.',
      tip: '--debug to read, /actuator/conditions to query.',
    },
  ),
  m(
    'springbootapp',
    'Auto-configuration',
    'What does @SpringBootApplication combine?',
    '@Configuration, @EnableAutoConfiguration and @ComponentScan',
    [
      '@Component, @Service and @Repository',
      '@EnableWebMvc, @EnableJpaRepositories and @EnableCaching',
      '@Bean, @Primary and @Profile',
    ],
    {
      what: 'It marks a configuration class, turns on auto-configuration, and scans the package of the annotated class and its subpackages.',
      trap: 'a main class in the wrong package means your beans are not scanned.',
      use: 'keep the main class in the root package of the application.',
      ref: 'Study book, section 5.',
      tip: 'Three in one: config, auto-config, scan.',
    },
  ),

  // ---------------------------------------------------------------- Configuration
  t(
    'configprops',
    'Configuration',
    'Bind all properties under app.payments to a class. Write the annotation.',
    [
      r`@ConfigurationProperties(prefix = "app.payments")`,
      r`@ConfigurationProperties("app.payments")`,
    ],
    {
      what: 'Type-safe, relaxed binding of a property subtree to a class or record, with optional validation via @Validated.',
      since:
        'records bind through the constructor automatically from Boot 3.0 (@ConstructorBinding before, 2.2+).',
      trap: 'register it with @ConfigurationPropertiesScan or @EnableConfigurationProperties, or it is never bound.',
      use: 'preferred over scattered @Value fields for any group of settings.',
      ref: 'Study book, section 4 (@ConfigurationProperties and externalised configuration).',
      tip: 'One prefix, one class, validated at startup.',
    },
  ),
  t(
    'value',
    'Configuration',
    'Inject the property server.port into a field with a default of 8080. Write the annotation.',
    ['@Value("${server.port:8080}")'],
    {
      what: '`@Value` resolves a placeholder; the text after the colon is the default.',
      trap: '@Value does not support relaxed binding the way @ConfigurationProperties does and offers no validation.',
      use: 'fine for one-off values, but group related settings in a properties class.',
      ref: 'Study book, section 4.',
      tip: '${key:default}, with the default after the colon.',
    },
  ),
  m(
    'config-precedence',
    'Configuration',
    'Which source wins when the same property is set in several places?',
    'Command-line argument, then environment variable, then application-{profile}.yml, then application.yml',
    [
      'application.yml, then environment variable, then command-line argument',
      'Environment variable, then application.yml, then command-line argument',
      'The file that was loaded first always wins',
    ],
    {
      what: 'Higher sources override lower ones. Relaxed names mean `APP_PAYMENTS_MAXRETRIES` can silently override `app.payments.max-retries` in YAML.',
      trap: 'a forgotten environment variable overriding YAML is a classic production surprise.',
      use: 'one immutable image, with environment-specific values supplied from outside.',
      ref: 'Study book, section 4.',
      tip: 'The closer to the process, the higher the priority.',
    },
  ),
  t(
    'profile',
    'Configuration',
    'Register a bean only when the "local" profile is active. Write the annotation.',
    [r`@Profile("local")`],
    {
      what: '`@Profile` includes a bean or configuration only for matching profiles. Activate with `spring.profiles.active=local`.',
      since: 'Spring 3.1; profile expressions like `!prod` are supported.',
      trap: 'profile-specific logic spread through code is hard to test; prefer configuration files per profile.',
      use: 'local H2 or stub clients that must never be active in production.',
      ref: 'Study book, section 3.',
      tip: 'Profile = switch a bean on by environment name.',
    },
  ),
  t(
    'activate-profile',
    'Configuration',
    'Write the property that activates the prod profile.',
    [r`spring.profiles.active=prod`, r`spring.profiles.active: prod`],
    {
      what: 'Set it in a file, on the command line (`--spring.profiles.active=prod`) or via the `SPRING_PROFILES_ACTIVE` environment variable.',
      use: 'containers usually pass it as an environment variable.',
      ref: 'Study book, section 3.',
      tip: 'spring.profiles.active, plural and dotted.',
    },
  ),

  // ---------------------------------------------------------------- Web and REST
  t(
    'restcontroller',
    'Web and REST',
    'Which single annotation combines @Controller and @ResponseBody?',
    [r`@RestController`],
    {
      what: 'Return values are written straight to the response body (usually JSON through Jackson) instead of being treated as view names.',
      since: 'Spring 4.0.',
      use: 'every REST endpoint class.',
      ref: 'Study book, section 6 (Spring Web MVC) and section 27 (annotations).',
      tip: 'RestController = Controller + ResponseBody.',
    },
  ),
  t(
    'valid-body',
    'Web and REST',
    'Write the parameter that binds the JSON body to a CreateOrder named body and validates it.',
    [r`@Valid @RequestBody CreateOrder body`, r`@RequestBody @Valid CreateOrder body`],
    {
      what: '`@RequestBody` deserialises the JSON with Jackson. `@Valid` triggers Bean Validation, and a failure raises `MethodArgumentNotValidException` (a 400).',
      trap: 'validation annotations on the record fields do nothing unless @Valid (or @Validated) is present.',
      use: 'every create or update endpoint.',
      ref: 'Study book, section 7 (Validation and error handling).',
      tip: 'No @Valid, no validation.',
    },
  ),
  t(
    'validated-class',
    'Web and REST',
    'Which class-level annotation makes constraints on @RequestParam and @PathVariable take effect?',
    [r`@Validated`],
    {
      what: '`@Validated` turns on method-level validation for the bean. Failures surface as `HandlerMethodValidationException` (Spring 6.1+) or `ConstraintViolationException` before that.',
      trap: '@Valid on a parameter alone does not validate request parameters of a controller method in older versions.',
      use: 'range checks like `@Min(0) int page`.',
      ref: 'Study book, section 7.',
      tip: '@Valid for bodies, @Validated on the class for simple params.',
    },
  ),
  t(
    'advice',
    'Web and REST',
    'Which annotation creates one global place to map exceptions to JSON error responses?',
    [r`@RestControllerAdvice`],
    {
      what: '`@RestControllerAdvice` is @ControllerAdvice plus @ResponseBody. Methods annotated with @ExceptionHandler convert exceptions into responses for all controllers.',
      use: 'one consistent error format for the whole API.',
      ref: 'Study book, section 7.',
      tip: 'Advice = cross-cutting for controllers.',
    },
  ),
  t(
    'exception-handler',
    'Web and REST',
    'Handle NotFoundException in an advice method. Write the annotation.',
    [r`@ExceptionHandler(NotFoundException.class)`],
    {
      what: 'The annotated method receives the exception and returns the response, for example a `ProblemDetail` with status 404.',
      trap: 'handlers match the most specific exception type, so a broad Exception handler does not hide a specific one.',
      use: 'map domain exceptions to HTTP status codes in one class.',
      ref: 'Study book, section 7.',
      tip: 'One handler per exception family.',
    },
  ),
  t(
    'problemdetail-prop',
    'Web and REST',
    'Write the property that makes built-in MVC errors return RFC 7807 ProblemDetail bodies.',
    [r`spring.mvc.problemdetails.enabled=true`, r`spring.mvc.problemdetails.enabled: true`],
    {
      what: 'Standard exceptions (400, 405, 415 ...) then use the problem+json format.',
      since: 'Spring 6 / Boot 3.0.',
      trap: 'never put stack traces or SQL in the `detail` field.',
      use: 'consistent machine-readable error bodies across services.',
      ref: 'Study book, section 7.',
      tip: 'problemdetails (plural) enabled=true.',
    },
  ),
  m(
    'created-status',
    'Web and REST',
    'What should a POST that creates a resource return?',
    '201 Created with a Location header pointing to the new resource',
    ['200 OK with an empty body', '204 No Content', '202 Accepted with the object in the body'],
    {
      what: '`ResponseEntity.created(uri).body(dto)` sets 201 and the Location header in one call.',
      use: 'also map optimistic lock failures to 409 and validation failures to 400 or 422.',
      ref: 'Study book, section 26 (REST API design).',
      tip: 'Create = 201 + Location.',
    },
  ),
  m(
    'restclient',
    'Web and REST',
    'Which HTTP client should new blocking code use in Spring 6.1+ and Boot 3.2+?',
    'RestClient',
    ['RestTemplate', 'WebClient, always', 'java.net.HttpURLConnection'],
    {
      what: 'RestClient has the fluent API of WebClient without requiring reactive types. RestTemplate is in maintenance mode.',
      since: 'Spring 6.1 / Boot 3.2.',
      use: 'use WebClient only when the surrounding code is reactive.',
      ref: 'Study book, section 8 (HTTP clients).',
      tip: 'Blocking and new: RestClient.',
    },
  ),
  t(
    'httpexchange',
    'Web and REST',
    'Which annotation turns a Java interface into a declarative HTTP client?',
    [r`@HttpExchange`],
    {
      what: 'Put `@HttpExchange` on the interface and `@GetExchange` or `@PostExchange` on methods, then build a proxy with `HttpServiceProxyFactory`.',
      since: 'Spring 6.0 (RestClient adapter from 6.1).',
      use: 'a lighter alternative to Feign inside plain Spring.',
      ref: 'Study book, section 8.',
      tip: 'Interface + @HttpExchange = a client for free.',
    },
  ),
  m(
    'client-timeouts',
    'Web and REST',
    'What is the biggest risk of calling another service without connect and read timeouts?',
    'Threads pile up waiting on a slow dependency and the failure cascades',
    [
      'The JSON may not parse',
      'Spring closes the connection automatically after 1 second',
      'The request is retried forever by default',
    ],
    {
      what: 'An unbounded wait ties up a request thread per call. When the dependency slows down, your thread pool is exhausted and you fail too.',
      use: 'set timeouts on every outbound client, then add a circuit breaker.',
      ref: 'Study book, sections 8 and 18 (Resilience).',
      tip: 'Every client call gets a timeout.',
    },
  ),
  m(
    'filter-order',
    'Web and REST',
    'In what order do these run for a request?',
    'Servlet Filter, DispatcherServlet, HandlerInterceptor.preHandle, controller',
    [
      'HandlerInterceptor, Servlet Filter, controller, DispatcherServlet',
      'DispatcherServlet, controller, Servlet Filter, HandlerInterceptor',
      'Controller, then filters on the way in only',
    ],
    {
      what: 'Filters belong to the Servlet container and see every request (Spring Security lives here). Interceptors belong to Spring MVC and only see requests that reach the DispatcherServlet.',
      use: 'put auth and correlation ids in filters, controller-aware checks in interceptors.',
      ref: 'Study book, section 32 (Life of a REST request).',
      tip: 'Outside in: filter, servlet, interceptor, controller.',
    },
  ),

  // ---------------------------------------------------------------- Data and transactions
  t(
    'tx-readonly',
    'Data and transactions',
    'Write the @Transactional annotation for a read-only service method.',
    [r`@Transactional(readOnly = true)`],
    {
      what: 'A hint to the persistence layer: Hibernate can skip dirty checking and flush, and a read replica can be chosen.',
      trap: 'it is only a hint, so it does not stop a write on every driver.',
      use: 'default queries to readOnly and open a normal transaction only for writes.',
      ref: 'Study book, section 10 (Transactions).',
      tip: 'Reads get readOnly = true.',
    },
  ),
  t(
    'tx-rollbackfor',
    'Data and transactions',
    'Make @Transactional roll back on checked exceptions too. Write the annotation.',
    [r`@Transactional(rollbackFor = Exception.class)`],
    {
      what: 'By default only RuntimeException and Error roll back. `rollbackFor` widens the rule.',
      trap: 'a checked exception thrown from a @Transactional method commits the transaction.',
      use: 'a frequent "why was the data saved even though it failed" question.',
      ref: 'Study book, section 10.',
      tip: 'Checked exceptions commit unless you say otherwise.',
    },
  ),
  t(
    'tx-requires-new',
    'Data and transactions',
    'Run an audit method in its own independent transaction. Write the annotation.',
    [r`@Transactional(propagation = Propagation.REQUIRES_NEW)`],
    {
      what: 'REQUIRES_NEW suspends the current transaction and starts a new one that commits or rolls back independently.',
      trap: 'it holds a second database connection, so heavy use can exhaust the pool.',
      use: 'audit logs that must survive a rollback of the main work.',
      ref: 'Study book, section 10.',
      tip: 'REQUIRES_NEW = a second, separate transaction.',
    },
  ),
  m(
    'tx-ignored',
    'Data and transactions',
    'Why is @Transactional silently ignored when a method calls another method of the same class?',
    'The call goes through this, not the proxy, so the transactional advice never runs',
    [
      'Spring only supports one @Transactional per class',
      'Transactions only work on public interfaces',
      'The second method must be static',
    ],
    {
      what: '@Transactional is applied by a proxy around the bean. A self-invocation bypasses the proxy. Private methods, objects built with `new`, and other threads have the same problem.',
      use: 'move the method to another bean. Do not use hacks.',
      ref: 'Study book, sections 10 and 11.',
      tip: 'Proxy bypassed means no transaction.',
    },
  ),
  m(
    'tx-default-rollback',
    'Data and transactions',
    'Which exceptions roll back a @Transactional method by default?',
    'Unchecked exceptions (RuntimeException) and Errors',
    [
      'Every exception including checked ones',
      'Only checked exceptions',
      'Only exceptions listed in noRollbackFor',
    ],
    {
      what: 'This mirrors EJB rules: checked exceptions are treated as recoverable business outcomes.',
      use: 'add `rollbackFor = Exception.class` when your service throws checked exceptions.',
      ref: 'Study book, section 10.',
      tip: 'Runtime rolls back, checked commits.',
    },
  ),
  t(
    'entitygraph',
    'Data and transactions',
    'Fetch the items association together with the order in a repository method. Write the annotation.',
    [r`@EntityGraph(attributePaths = "items")`, r`@EntityGraph(attributePaths = {"items"})`],
    {
      what: '`@EntityGraph` adds a fetch join for the named associations, replacing one extra query per row (the N+1 problem) with a single query.',
      trap: 'fetch-joining a collection with paging makes Hibernate page in memory. Use a separate id query or batch fetching.',
      use: 'the standard N+1 fix, together with `join fetch` and DTO projections.',
      ref: 'Study book, section 9 (Spring Data JPA).',
      tip: 'N+1 cure: graph or join fetch.',
    },
  ),
  t(
    'version',
    'Data and transactions',
    'Which JPA annotation on a field enables optimistic locking?',
    [r`@Version`],
    {
      what: 'Hibernate adds the version to the UPDATE condition. If another transaction changed the row, no row matches and an `OptimisticLockingFailureException` is thrown.',
      use: 'map that exception to HTTP 409 and let the client retry.',
      ref: 'Study book, section 9.',
      tip: 'Version column = lock-free conflict detection.',
    },
  ),
  t(
    'oiv',
    'Data and transactions',
    'Write the property that turns off Open Session In View.',
    [r`spring.jpa.open-in-view=false`, r`spring.jpa.open-in-view: false`],
    {
      what: 'With open-in-view on (the default, with a startup warning) a database connection stays bound to the request until the view is rendered.',
      trap: 'lazy loading then works in controllers and hides N+1 queries and long connection holds.',
      use: 'turn it off and fetch what you need in the service layer.',
      ref: 'Study book, section 9.',
      tip: 'Turn off OSIV, fetch deliberately.',
    },
  ),
  t(
    'modifying',
    'Data and transactions',
    'Which annotation marks a @Query as an update or delete rather than a select?',
    [r`@Modifying`],
    {
      what: '`@Modifying` makes the repository execute the statement as an update. Add `clearAutomatically = true` so stale entities leave the persistence context.',
      trap: 'bulk updates bypass the persistence context, so loaded entities can be out of date.',
      use: 'bulk status changes.',
      ref: 'Study book, section 9.',
      tip: 'Modifying = not a select.',
    },
  ),

  // ---------------------------------------------------------------- Security
  m(
    'security-chain',
    'Security',
    'How do you configure HTTP security in Spring Security 6?',
    'Declare a SecurityFilterChain bean and use the lambda DSL',
    [
      'Extend WebSecurityConfigurerAdapter',
      'Put rules in web.xml',
      'Annotate controllers with @EnableWebSecurity only',
    ],
    {
      what: '`WebSecurityConfigurerAdapter` was removed in Security 6. A `SecurityFilterChain` bean built from `HttpSecurity` replaces it.',
      since: 'recommended from Security 5.7, removed in 6.0.',
      trap: 'order matters in `authorizeHttpRequests`: first match wins, so `anyRequest()` goes last.',
      use: 'one chain per concern (API vs actuator) is also common.',
      ref: 'Study book, section 12 (Spring Security fundamentals).',
      tip: 'Bean of SecurityFilterChain, not a subclass.',
    },
  ),
  t(
    'enable-method-security',
    'Security',
    'Which annotation on a configuration class enables @PreAuthorize on methods?',
    [r`@EnableMethodSecurity`],
    {
      what: 'It switches on method-level authorization checks with @PreAuthorize and @PostAuthorize.',
      since: 'Security 5.6; replaces @EnableGlobalMethodSecurity.',
      trap: 'it is proxy-based, so self-invocation is not checked.',
      use: 'fine-grained rules such as owner-only access.',
      ref: 'Study book, section 12.',
      tip: 'Enable first, then PreAuthorize.',
    },
  ),
  t(
    'preauthorize',
    'Security',
    'Allow a method only for users with the ADMIN role. Write the annotation.',
    [r`@PreAuthorize("hasRole('ADMIN')")`, r`@PreAuthorize("hasAuthority('ROLE_ADMIN')")`],
    {
      what: '`@PreAuthorize` evaluates a SpEL expression before the method runs. `hasRole` adds the ROLE_ prefix for you.',
      use: 'owner checks: `#userId == authentication.name`.',
      ref: 'Study book, section 12.',
      tip: 'hasRole adds ROLE_ automatically.',
    },
  ),
  t(
    'jwt-issuer',
    'Security',
    'Write the property key used to configure the JWT issuer URI for a resource server.',
    [r`spring.security.oauth2.resourceserver.jwt.issuer-uri`],
    {
      what: 'Boot fetches the discovery document from the issuer, learns the JWKS URL and validates the signature and issuer of every token.',
      trap: 'an issuer mismatch between the token and the configured URI is the most common 401 cause.',
      use: 'a stateless API protected by an identity provider.',
      ref: 'Study book, section 13 (OAuth2 / OIDC and JWT).',
      tip: 'issuer-uri is all Boot needs to find the keys.',
    },
  ),
  m(
    'csrf-api',
    'Security',
    'When is it acceptable to disable CSRF protection?',
    'For stateless APIs that authenticate with a bearer token, not with cookies',
    [
      'Whenever the API is behind a firewall',
      'For any endpoint that accepts JSON',
      'Never, it must always be on',
    ],
    {
      what: 'CSRF abuses the browser sending cookies automatically. A bearer token in the Authorization header is not sent automatically.',
      trap: 'if you use cookie-based sessions, keep CSRF protection on.',
      use: 'a standard "why did you disable CSRF" interview question.',
      ref: 'Study book, section 12.',
      tip: 'Cookies need CSRF. Bearer tokens do not.',
    },
  ),

  // ---------------------------------------------------------------- Testing
  t(
    'webmvctest',
    'Testing',
    'Test only the web layer of OrderController. Write the test annotation.',
    [r`@WebMvcTest(OrderController.class)`],
    {
      what: 'A slice test that loads controllers, converters and security config but not services or repositories, which you mock.',
      use: 'fast tests for status codes, validation and JSON shape with MockMvc.',
      ref: 'Study book, section 14 (Testing).',
      tip: 'Smallest slice that proves the behaviour.',
    },
  ),
  t(
    'mockitobean',
    'Testing',
    'Replace a bean with a Mockito mock in a Spring test. Write the annotation used in Spring 6.2 and Boot 3.4.',
    [r`@MockitoBean`],
    {
      what: '`@MockitoBean` registers a mock in the application context for the test.',
      since: 'Spring 6.2 / Boot 3.4; it replaces @MockBean, which is deprecated.',
      trap: 'different mock setups create different contexts and slow the test suite.',
      use: 'mock services in @WebMvcTest.',
      ref: 'Study book, section 14.',
      tip: 'MockBean is the old name, MockitoBean the new one.',
    },
  ),
  t(
    'serviceconnection',
    'Testing',
    'Which annotation on a Testcontainers container field auto-wires its connection details into Spring Boot?',
    [r`@ServiceConnection`],
    {
      what: 'Boot derives the JDBC URL, user and password from the container, so you no longer need a @DynamicPropertySource method.',
      since: 'Boot 3.1.',
      use: 'tests against a real PostgreSQL or Kafka instead of H2.',
      ref: 'Study book, section 14.',
      tip: 'Container + @ServiceConnection = zero property wiring.',
    },
  ),
  t(
    'datajpatest',
    'Testing',
    'Which annotation sets up only the JPA layer for a repository test?',
    [r`@DataJpaTest`],
    {
      what: 'It scans entities and repositories only and rolls each test back. By default it swaps in an embedded database.',
      trap: 'add `@AutoConfigureTestDatabase(replace = Replace.NONE)` to use your real engine from Testcontainers.',
      use: 'repository query and mapping tests.',
      ref: 'Study book, section 14.',
      tip: 'Repository tests: DataJpaTest, real database if the SQL matters.',
    },
  ),

  // ---------------------------------------------------------------- Runtime features
  t(
    'virtual-threads',
    'Runtime features',
    'Write the property that runs request handling on virtual threads.',
    [r`spring.threads.virtual.enabled=true`, r`spring.threads.virtual.enabled: true`],
    {
      what: 'Tomcat and the default task executors use virtual threads, so blocking calls are cheap.',
      since: 'Boot 3.2 on Java 21.',
      trap: 'long `synchronized` blocks can pin the carrier thread (improved in newer Java), and a small connection pool is still your real limit.',
      use: 'a simple way to scale blocking MVC code without going reactive.',
      ref: 'Study book, section 20 (Concurrency: virtual threads).',
      tip: 'One property, Java 21, Boot 3.2.',
    },
  ),
  t(
    'graceful',
    'Runtime features',
    'Write the property that finishes in-flight requests before the server stops.',
    [r`server.shutdown=graceful`, r`server.shutdown: graceful`],
    {
      what: 'On SIGTERM the server stops accepting new requests and waits up to `spring.lifecycle.timeout-per-shutdown-phase` for active ones.',
      use: 'avoid dropped requests during Kubernetes rolling deployments.',
      ref: 'Study book, section 21 (Packaging and operations).',
      tip: 'Graceful shutdown + a termination grace period.',
    },
  ),
  t(
    'cacheable',
    'Runtime features',
    'Cache the result of a method in a cache named "prices". Write the annotation.',
    [
      r`@Cacheable("prices")`,
      r`@Cacheable(cacheNames = "prices")`,
      r`@Cacheable(value = "prices")`,
    ],
    {
      what: 'The proxy checks the cache by key (the method arguments by default) before calling the method.',
      trap: 'it needs @EnableCaching, a TTL and a size bound, and it is proxy-based so self-invocation skips it.',
      use: 'read-heavy lookups, with @CacheEvict on writes.',
      ref: 'Study book, section 16 (Caching).',
      tip: 'Cache with a limit, or it is a memory leak.',
    },
  ),
  t(
    'async',
    'Runtime features',
    'Run a method on a separate thread pool. Write the annotation (after @EnableAsync is set).',
    [r`@Async`],
    {
      what: 'The proxy submits the call to a task executor. Return void or `CompletableFuture<T>`.',
      trap: 'self-invocation, private methods and a missing @EnableAsync all make it run synchronously. The default executor settings are rarely right for production.',
      use: 'fire-and-forget work such as sending an email.',
      ref: 'Study book, sections 11 and 20.',
      tip: 'Async is a proxy too. Same limits.',
    },
  ),
  t(
    'tx-event',
    'Runtime features',
    'React to an event only after the surrounding transaction commits. Write the annotation with its phase.',
    [
      r`@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`,
      r`@TransactionalEventListener`,
    ],
    {
      what: 'The listener runs at the chosen transaction phase. AFTER_COMMIT is the default.',
      trap: 'if there is no active transaction the event is dropped unless `fallbackExecution = true`.',
      use: 'send an email or publish to Kafka only when the database change really committed.',
      ref: 'Study book, section 15 (Messaging and events).',
      tip: 'No commit, no side effect.',
    },
  ),
  m(
    'scheduled-multi',
    'Runtime features',
    'You run three instances of a service with a @Scheduled method. How often does the job run per cycle?',
    'Three times, once on every instance, unless you add a lock',
    [
      'Once, Spring elects a leader',
      'Once, on the instance that started first',
      'Never, @Scheduled is disabled when clustered',
    ],
    {
      what: '@Scheduled knows nothing about other instances.',
      use: 'use ShedLock or a database lock, or run the job in a single dedicated instance.',
      ref: 'Study book, section 17 (Scheduling and Spring Batch).',
      tip: 'N instances, N executions.',
    },
  ),
  t(
    'circuit-breaker',
    'Runtime features',
    'Protect a call with a Resilience4j circuit breaker named "payments". Write the annotation.',
    [
      r`@CircuitBreaker(name = "payments")`,
      r`@CircuitBreaker(name = "payments", fallbackMethod = "fallback")`,
    ],
    {
      what: 'After the failure rate crosses a threshold the breaker opens and calls fail fast instead of piling up.',
      trap: 'retries multiply load, so combine them with a circuit breaker, backoff and a timeout, and only for idempotent calls.',
      use: 'calling any unreliable downstream.',
      ref: 'Study book, section 18 (Resilience).',
      tip: 'Timeout, retry with backoff, then breaker.',
    },
  ),
  t(
    'actuator-expose',
    'Runtime features',
    'Expose only the health and info actuator endpoints over HTTP. Write the property.',
    [
      r`management.endpoints.web.exposure.include=health,info`,
      r`management.endpoints.web.exposure.include: health,info`,
    ],
    {
      what: 'By default only health is exposed over the web. List exactly what you need.',
      trap: '`*` exposes env, heapdump and more. Put actuator on a separate port or behind authentication.',
      use: 'health probes plus metrics for Prometheus.',
      ref: 'Study book, section 19 (Observability).',
      tip: 'Expose the minimum, protect the rest.',
    },
  ),

  // ---------------------------------------------------------------- Versions and migration
  m(
    'boot3-baseline',
    'Versions',
    'What are the two big changes when moving from Boot 2.7 to Boot 3.0?',
    'Java 17 minimum and the javax.* to jakarta.* namespace',
    [
      'Kotlin only and XML configuration removed',
      'Java 21 minimum and the end of auto-configuration',
      'Reactive only and the removal of Tomcat',
    ],
    {
      what: 'Boot 3 sits on Spring Framework 6, which requires Java 17 and Jakarta EE 9+ packages. Hibernate moves to 6.',
      use: 'upgrade to the latest 2.7 first, fix deprecations, then move to 3.0.',
      ref: 'Study book, section 22 (Boot 2 to 3 migration).',
      tip: 'Java 17 and jakarta. That is the jump.',
    },
  ),
  t(
    'jakarta-import',
    'Versions',
    'Write the Boot 3 import for the JPA @Entity annotation.',
    [r`import jakarta.persistence.Entity;`],
    {
      what: 'Everything formerly under `javax.persistence`, `javax.servlet` and `javax.validation` moved to `jakarta.*`.',
      since: 'Boot 3.0 / Spring Framework 6.',
      trap: 'old libraries that still use javax fail at runtime, not compile time. Use a migration tool such as OpenRewrite.',
      use: 'the first compile errors you hit when upgrading.',
      ref: 'Study book, section 22.',
      tip: 'javax became jakarta in Boot 3.',
    },
  ),
  m(
    'boot4-spring7',
    'Versions',
    'Which Spring Framework version does Spring Boot 4.0 build on?',
    'Spring Framework 7',
    ['Spring Framework 6.2', 'Spring Framework 5.3', 'Spring Framework 8'],
    {
      what: 'Boot 4 builds on Spring Framework 7 with a modularised auto-configuration and Jackson 3 support.',
      since: 'Boot 4.0 (late 2025).',
      trap: 'always say "verify against the release notes" rather than quoting exact dates from memory.',
      use: 'know the version pairs: Boot 2.x with Spring 5, Boot 3.x with Spring 6, Boot 4 with Spring 7.',
      ref: 'Study book, section 23 and the version table in "At a glance".',
      tip: 'Boot 2, 3, 4 pairs with Spring 5, 6, 7.',
    },
  ),
];

export const springQuiz: Quiz = {
  slug: 'spring-boot',
  title: 'Spring and Spring Boot',
  description:
    'Annotations, properties and rules you need cold: the container, auto-configuration, configuration, web and REST, data and transactions, security, testing and runtime features. Each answer has the version, the common trap and a memory tip.',
  source: {
    label: 'Spring Framework and Spring Boot study book',
    href: '/resources/spring-springboot-study-book.html',
  },
  /** Authored most-important first: random rounds of N take the first N. */
  questions: authored,
};
