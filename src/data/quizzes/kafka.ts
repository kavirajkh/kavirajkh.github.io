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

/** Typed: write the property, command or snippet from memory. */
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

/** Multiple choice: pick the correct behaviour or rule. */
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
  // ---------------------------------------------------------------- Core model
  m(
    'order-scope',
    'Core model',
    'Where does Kafka guarantee record ordering?',
    'Only within a single partition',
    [
      'Across the whole topic',
      'Across all topics in a cluster',
      'Only when the topic has one replica',
    ],
    {
      what: 'Each partition is an append-only log, and offsets are only meaningful inside one partition. Records with the same key go to the same partition, so they stay in order.',
      trap: 'assuming a global order across partitions, or across a restart that changes the partition count.',
      use: 'choose the key (orderId, accountId) so everything that must be ordered shares a partition.',
      ref: 'Study book, sections 2 and 8 (Topics, partitions, offsets; Ordering and key design).',
      tip: 'Order lives inside a partition. The key picks the partition.',
    },
  ),
  m(
    'parallelism',
    'Core model',
    'A topic has 6 partitions and one consumer group has 10 consumers. How many consumers read data?',
    'Six, the other four are idle',
    [
      'Ten, partitions are split further',
      'Ten, extra consumers share partitions by key range',
      'One, only a single consumer per group reads',
    ],
    {
      what: 'Within a group a partition is assigned to at most one consumer, so the maximum useful parallelism equals the partition count.',
      use: 'plan partitions from the target throughput divided by what one consumer can handle.',
      ref: 'Study book, sections 4 and 8.',
      tip: 'Consumers in a group <= partitions.',
    },
  ),
  m(
    'why-fast',
    'Core model',
    'Why is Kafka fast?',
    'Sequential disk I/O, the OS page cache, zero-copy transfer and batching',
    [
      'It keeps all data in memory only',
      'It stores data in a relational index',
      'It compresses nothing and avoids the network',
    ],
    {
      what: 'Appends and reads are sequential, the page cache serves hot data, sendfile avoids copying through user space, and batching amortises requests.',
      trap: 'saying "it is in-memory". It is disk-based. TLS defeats zero-copy.',
      use: 'a standard opening architecture question.',
      ref: 'Study book, section 1 (Architecture and why Kafka is fast).',
      tip: 'Sequential + page cache + zero-copy + batch.',
    },
  ),
  m(
    'partition-decrease',
    'Core model',
    'What can you do with the partition count of an existing topic?',
    'Increase it only, and that changes the key-to-partition mapping',
    ['Increase or decrease it at any time', 'Decrease it only', 'Nothing, it is fixed forever'],
    {
      what: 'Partitions can be added but never removed. After adding, `hash(key) % partitions` changes, so existing keys may move and per-key order across the change is lost.',
      use: 'over-provision a little at creation instead of resizing under load.',
      ref: 'Study book, section 2.',
      tip: 'Partitions only go up.',
    },
  ),
  t(
    'create-topic',
    'Core model',
    'Write the command that creates topic orders with 6 partitions and replication factor 3 (use the options in that order: topic, partitions, replication-factor).',
    [
      r`kafka-topics.sh --bootstrap-server localhost:9092 --create --topic orders --partitions 6 --replication-factor 3`,
      r`kafka-topics --bootstrap-server localhost:9092 --create --topic orders --partitions 6 --replication-factor 3`,
    ],
    {
      what: '`kafka-topics.sh` talks to the brokers with `--bootstrap-server`. Apache tarballs use the `.sh` suffix, Confluent packages do not.',
      since: 'the old `--zookeeper` option was removed; always use `--bootstrap-server`.',
      use: 'add `--config min.insync.replicas=2` for durable topics.',
      ref: 'Study book, "Commonly used code snippets", number 1.',
      tip: 'bootstrap-server, create, topic, partitions, replication-factor.',
    },
  ),

  // ---------------------------------------------------------------- Producer
  t(
    'acks-all',
    'Producer',
    'Write the producer setting that waits for all in-sync replicas to acknowledge a write.',
    [r`acks=all`, r`acks: all`, r`acks = all`],
    {
      what: 'The leader answers only after every in-sync replica has the record. `acks=-1` is the same thing.',
      trap: 'acks=all is only as strong as `min.insync.replicas`. With min.insync.replicas=1 it still allows a single copy.',
      use: 'the base of every durable-write answer.',
      ref: 'Study book, section 3 (Producers).',
      tip: 'Durability = acks=all + min.insync.replicas=2.',
    },
  ),
  t(
    'min-isr',
    'Producer',
    'Write the topic setting that requires at least 2 in-sync replicas for a write with acks=all to succeed.',
    [r`min.insync.replicas=2`, r`min.insync.replicas: 2`, r`min.insync.replicas = 2`],
    {
      what: 'With replication factor 3 and min.insync.replicas=2 you tolerate one broker down and still accept writes. If fewer replicas are in sync, producers get `NotEnoughReplicas`.',
      trap: 'setting it equal to the replication factor means one failed broker stops all writes.',
      use: 'the standard "rf=3, min.isr=2, acks=all" trio.',
      ref: 'Study book, sections 3 and 9 (Replication and durability).',
      tip: 'Three copies, two must agree.',
    },
  ),
  t(
    'idempotence',
    'Producer',
    'Write the producer setting that prevents duplicates caused by retries.',
    [r`enable.idempotence=true`, r`enable.idempotence: true`, r`enable.idempotence = true`],
    {
      what: 'The broker de-duplicates by producer id and sequence number per partition.',
      since: 'introduced in 0.11, on by default since Kafka 3.0 (it needs acks=all).',
      trap: 'idempotence covers retries of one producer session to one partition. It is not exactly-once end to end.',
      use: 'say it together with acks=all.',
      ref: 'Study book, section 3.',
      tip: 'Idempotent = no retry duplicates per partition.',
    },
  ),
  t(
    'unclean',
    'Producer',
    'Write the broker setting that forbids electing an out-of-sync replica as leader.',
    [r`unclean.leader.election.enable=false`, r`unclean.leader.election.enable: false`],
    {
      what: 'With false the partition stays unavailable rather than electing a stale replica that would lose acknowledged data.',
      trap: 'true trades durability for availability. Choose deliberately.',
      use: 'finance and payments: consistency over availability.',
      ref: 'Study book, section 9.',
      tip: 'Unclean election = allowed data loss.',
    },
  ),
  t(
    'linger',
    'Producer',
    'Write the producer setting that waits up to 10 ms to fill a batch before sending.',
    [r`linger.ms=10`, r`linger.ms: 10`, r`linger.ms = 10`],
    {
      what: 'A small wait lets the producer group more records per request, which raises throughput and compression ratio at the cost of a little latency. It works with `batch.size`.',
      since: 'the default was 0 ms for a long time; Kafka 4.0 changed it to 5 ms.',
      use: 'a throughput tuning lever, with compression.',
      ref: 'Study book, section 18 (Performance tuning).',
      tip: 'linger.ms + batch.size trade latency for throughput.',
    },
  ),
  t(
    'compression',
    'Producer',
    'Write the producer setting that compresses batches with lz4.',
    [r`compression.type=lz4`, r`compression.type: lz4`, r`compression.type = lz4`],
    {
      what: 'Compression applies per batch, so bigger batches compress better. Common choices are lz4 (fast), zstd (best ratio), snappy and gzip.',
      use: 'cuts network and disk use, and often improves throughput.',
      ref: 'Study book, section 18.',
      tip: 'Big batches + compression = more throughput.',
    },
  ),
  t(
    'send',
    'Producer',
    'With the plain Java producer, send value to topic orders with key (write the call, ignoring the callback).',
    [
      r`producer.send(new ProducerRecord<>("orders", key, value));`,
      r`producer.send(new ProducerRecord<String, String>("orders", key, value));`,
    ],
    {
      what: '`send()` is asynchronous and returns a Future. The record goes into a buffer and is sent in a batch.',
      trap: 'ignoring the result or callback means silent data loss on failure. Always handle the callback.',
      use: 'pass a lambda as the second argument to log failures.',
      ref: 'Study book, "Commonly used code snippets", number 2.',
      tip: 'Topic, key, value. Always a callback.',
    },
    r`KafkaProducer<String, String> producer = ...;
String key = "o-1", value = "{}";`,
  ),
  m(
    'key-choice',
    'Producer',
    'What makes a good record key?',
    'A stable, well-distributed entity id such as orderId or accountId',
    [
      'A timestamp, so keys are always unique',
      'A constant such as "orders"',
      'A random UUID for every record, to keep related events together',
    ],
    {
      what: 'The key decides the partition. A stable entity id keeps that entity ordered, while good spread avoids hot partitions.',
      trap: 'a low-cardinality or skewed key (for example a country) creates a hot partition. A null key spreads records with no ordering.',
      use: 'salt the key only when you can give up strict per-key order.',
      ref: 'Study book, section 8.',
      tip: 'Key = ordering unit.',
    },
  ),

  // ---------------------------------------------------------------- Consumer
  t(
    'auto-commit',
    'Consumer',
    'Write the consumer setting that stops Kafka committing offsets automatically.',
    [r`enable.auto.commit=false`, r`enable.auto.commit: false`, r`enable.auto.commit = false`],
    {
      what: 'Auto commit runs on a timer inside `poll()`, which can commit records you have not processed yet.',
      trap: 'a crash after an auto commit but before processing loses those records (at-most-once for them).',
      use: 'commit manually after processing for at-least-once.',
      ref: 'Study book, section 6 (Offset commits).',
      tip: 'Process first, commit second.',
    },
  ),
  t(
    'offset-reset',
    'Consumer',
    'Write the consumer setting that starts from the beginning when the group has no committed offset.',
    [
      r`auto.offset.reset=earliest`,
      r`auto.offset.reset: earliest`,
      r`auto.offset.reset = earliest`,
    ],
    {
      what: 'It applies only when there is no committed offset (a new group) or the offset is out of range. The default is `latest`.',
      trap: 'it does not rewind a group that already has committed offsets. Use the reset tool for that.',
      use: 'new groups that must read history.',
      ref: 'Study book, section 6.',
      tip: 'Only for groups with nothing committed.',
    },
  ),
  m(
    'commit-semantics',
    'Consumer',
    'You process a record and then commit. If the app crashes between processing and commit, what happens?',
    'The record is delivered again after restart (at-least-once)',
    [
      'The record is lost (at-most-once)',
      'The record is delivered exactly once automatically',
      'The consumer group is deleted',
    ],
    {
      what: 'The committed offset still points before the record, so the next poll returns it again.',
      trap: 'commit before processing gives at-most-once, the opposite trade-off.',
      use: 'make consumers idempotent because redelivery is normal.',
      ref: 'Study book, sections 6 and 7 (Delivery semantics).',
      tip: 'Process then commit = at-least-once.',
    },
  ),
  m(
    'committed-offset',
    'Consumer',
    'After processing the record at offset 41, which offset do you commit?',
    '42, the next record to read',
    ['41, the last processed offset', '40, the previous one', '0, always the start'],
    {
      what: 'A committed offset means "start reading here next time", so it is the last processed offset plus one.',
      trap: 'committing the processed offset itself re-reads one record after every restart. The Java consumer in `commitSync()` without arguments handles this for you.',
      use: 'matters when you commit explicit offsets per partition.',
      ref: 'Study book, section 6.',
      tip: 'Commit the next offset, not the last one.',
    },
  ),
  t(
    'poll',
    'Consumer',
    'Poll for records waiting up to 500 ms. Write the call that returns the records.',
    [
      r`ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));`,
      r`var records = consumer.poll(Duration.ofMillis(500));`,
    ],
    {
      what: '`poll()` fetches records, sends heartbeats from a background thread and takes part in group coordination.',
      since: 'the `poll(long)` variant was replaced by `poll(Duration)` in 2.0.',
      trap: 'if you do not call poll again within `max.poll.interval.ms` the member is removed and the group rebalances.',
      use: 'keep processing per poll short, or lower `max.poll.records`.',
      ref: 'Study book, section 4.',
      tip: 'Keep polling, or be kicked out.',
    },
  ),
  t(
    'commit-sync',
    'Consumer',
    'Commit the offsets returned by the last poll and wait for the broker. Write the call.',
    [r`consumer.commitSync();`],
    {
      what: '`commitSync()` blocks until the broker confirms and retries on recoverable errors. `commitAsync()` is faster but gives no retry ordering guarantee.',
      use: 'use async in the loop and one `commitSync()` in the shutdown path.',
      ref: 'Study book, section 6.',
      tip: 'Sync is safe, async is fast. Finish with sync.',
    },
  ),
  m(
    'rebalance-cause',
    'Consumer',
    'Which of these commonly triggers an unwanted rebalance?',
    'Processing takes longer than max.poll.interval.ms between polls',
    [
      'Using a key on every record',
      'Enabling compression',
      'Creating a topic with more partitions than consumers',
    ],
    {
      what: 'The coordinator thinks the member is dead and reassigns its partitions. Deployments (rolling restarts) and session timeouts trigger them too.',
      use: 'use the CooperativeStickyAssignor, static membership (`group.instance.id`) and sensible timeouts.',
      ref: 'Study book, section 5 (Rebalancing).',
      tip: 'Slow processing equals a rebalance storm.',
    },
  ),
  t(
    'static-membership',
    'Consumer',
    'Write the consumer property key that enables static group membership.',
    [r`group.instance.id`],
    {
      what: 'A stable id lets a restarting member rejoin without triggering a rebalance, as long as it returns within `session.timeout.ms`.',
      since: 'Kafka 2.3.',
      use: 'rolling restarts on Kubernetes with stable pod names.',
      ref: 'Study book, section 5.',
      tip: 'Static id = restart without reshuffle.',
    },
  ),
  m(
    'assignor',
    'Consumer',
    'Which partition assignor reduces stop-the-world rebalances?',
    'CooperativeStickyAssignor',
    ['RangeAssignor only', 'RoundRobinAssignor', 'RandomAssignor'],
    {
      what: 'Cooperative rebalancing moves only the partitions that must move, instead of revoking everything first (the eager protocol).',
      since:
        'Kafka 2.4. Kafka 4.0 adds the new KIP-848 group protocol that moves the logic to the broker.',
      use: 'the first fix for rebalance pain.',
      ref: 'Study book, section 5.',
      tip: 'Cooperative = revoke only what moves.',
    },
  ),
  m(
    'lag',
    'Consumer',
    'What does consumer lag measure?',
    'How far the group is behind: the latest offset minus the committed offset',
    [
      'The network latency to the broker',
      'The time a producer waits for acks',
      'The number of partitions without a leader',
    ],
    {
      what: 'Lag is the difference between the end of the log and the group committed offset, per partition.',
      use: 'the number to watch, and its trend. Growing lag means consumers cannot keep up.',
      ref: 'Study book, section 19 (Monitoring and operations).',
      tip: 'Lag = end offset - committed offset.',
    },
  ),
  t(
    'describe-group',
    'Consumer',
    'Write the command that shows the lag of consumer group billing.',
    [
      r`kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group billing`,
      r`kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group billing`,
    ],
    {
      what: 'It prints each partition with current offset, log end offset and lag, plus the member holding it.',
      use: 'the first command in a "consumers are slow" incident.',
      ref: 'Study book, "Commonly used code snippets", number 1.',
      tip: 'consumer-groups --describe --group.',
    },
  ),

  // ---------------------------------------------------------------- Delivery semantics
  m(
    'eos-scope',
    'Delivery semantics',
    'What does Kafka exactly-once cover?',
    'Reading from and writing to Kafka topics inside one transaction, not external side effects',
    [
      'The whole path including database and email side effects',
      'Only the producer to the broker network hop',
      'Only the consumer deserialiser',
    ],
    {
      what: 'Idempotent producer plus transactions plus `isolation.level=read_committed` make consume-transform-produce atomic inside Kafka.',
      trap: 'claiming end-to-end exactly-once. A database write or an HTTP call can still happen twice.',
      use: 'say "effectively once": idempotent side effects or the outbox pattern.',
      ref: 'Study book, section 7.',
      tip: 'Exactly-once stops at Kafka. Beyond it, idempotency.',
    },
  ),
  t(
    'read-committed',
    'Delivery semantics',
    'Write the consumer setting so that it does not see records from aborted transactions.',
    [
      r`isolation.level=read_committed`,
      r`isolation.level: read_committed`,
      r`isolation.level = read_committed`,
    ],
    {
      what: 'The consumer only returns records from committed transactions. The default is `read_uncommitted`.',
      trap: 'a long-running open transaction holds back the last stable offset and delays all read_committed consumers.',
      use: 'always pair with transactional producers.',
      ref: 'Study book, section 7.',
      tip: 'Transactions need read_committed on the consumer.',
    },
  ),
  t(
    'transactional-id',
    'Delivery semantics',
    'Write the producer property key that turns on transactions.',
    [r`transactional.id`],
    {
      what: 'A stable id per producer instance lets the broker fence zombie producers and make writes across partitions atomic. In Spring Boot you set `spring.kafka.producer.transaction-id-prefix`.',
      use: 'consume-transform-produce pipelines.',
      ref: 'Study book, sections 7 and 16.',
      tip: 'transactional.id = a fenced, atomic producer.',
    },
  ),
  m(
    'outbox',
    'Delivery semantics',
    'What problem does the transactional outbox pattern solve?',
    'Updating the database and publishing an event atomically without a distributed transaction',
    [
      'Compressing large messages',
      'Choosing the partition for a key',
      'Speeding up consumer rebalancing',
    ],
    {
      what: 'The service writes the business change and an event row in one database transaction. A relay (or Debezium CDC) then publishes the row to Kafka.',
      trap: 'publishing is at-least-once, so consumers must be idempotent. Clean up processed outbox rows.',
      use: 'the standard answer to "how do you avoid dual writes".',
      ref: 'Study book, section 14 (Kafka Connect, Debezium CDC and the outbox pattern).',
      tip: 'One local transaction, then publish from the table.',
    },
  ),

  // ---------------------------------------------------------------- Storage and replication
  m(
    'high-watermark',
    'Storage and replication',
    'Which records can a consumer read?',
    'Only records below the high watermark, replicated to all in-sync replicas',
    [
      'Every record the leader has written',
      'Only records older than retention.ms',
      'Only records from compacted topics',
    ],
    {
      what: 'The high watermark is the offset up to which all in-sync replicas have the data. Records above it could still be lost if the leader fails.',
      use: 'explains why consumer visibility lags slightly behind producer acknowledgement settings.',
      ref: 'Study book, section 9.',
      tip: 'Consumers see only what is safely replicated.',
    },
  ),
  m(
    'kraft',
    'Storage and replication',
    'What happened to ZooKeeper in Kafka 4.0?',
    'It was removed. Kafka runs in KRaft mode only',
    [
      'It became mandatory for all clusters',
      'It was replaced by Redis',
      'It is optional and used only for security',
    ],
    {
      what: 'KRaft uses a Raft-based controller quorum inside Kafka itself. It has been production-ready since 3.3.',
      since: 'Kafka 4.0 removes ZooKeeper support.',
      trap: 'do not invent version numbers. Say "around 3.x (verify)" when unsure.',
      use: 'migration questions: move to KRaft on 3.x before upgrading to 4.0.',
      ref: 'Study book, section 10 (KRaft vs ZooKeeper).',
      tip: '4.0 = KRaft only.',
    },
  ),
  t(
    'compact',
    'Storage and replication',
    'Write the topic setting that keeps only the latest value per key.',
    [r`cleanup.policy=compact`, r`cleanup.policy: compact`, r`cleanup.policy = compact`],
    {
      what: 'Compaction removes older records with the same key and keeps the latest. A record with a null value is a tombstone and deletes the key after `delete.retention.ms`.',
      trap: 'compaction never touches the active segment, so old values may remain for a while.',
      use: 'changelog topics, config and reference data, `__consumer_offsets`.',
      ref: 'Study book, section 11 (Retention, log compaction, tombstones).',
      tip: 'Compact = latest per key. Null value = delete.',
    },
  ),
  t(
    'retention',
    'Storage and replication',
    'Write the topic setting for 7 days of retention in milliseconds.',
    [r`retention.ms=604800000`, r`retention.ms: 604800000`, r`retention.ms = 604800000`],
    {
      what: '7 days x 24 hours x 3,600,000 ms = 604,800,000.',
      trap: 'retention deletes whole closed segments, so a record can outlive `retention.ms` until its segment rolls (`segment.ms`, `segment.bytes`).',
      use: 'size and time limits both apply, and the first one reached wins.',
      ref: 'Study book, section 11.',
      tip: 'Retention drops segments, not single records.',
    },
  ),
  t(
    'under-replicated',
    'Storage and replication',
    'Write the command that lists under-replicated partitions.',
    [
      r`kafka-topics.sh --bootstrap-server localhost:9092 --describe --under-replicated-partitions`,
      r`kafka-topics --bootstrap-server localhost:9092 --describe --under-replicated-partitions`,
    ],
    {
      what: 'These partitions have followers that fell out of sync. The list should normally be empty.',
      use: 'an alert, together with consumer lag, on every cluster.',
      ref: 'Study book, section 19.',
      tip: 'Healthy cluster: this list is empty.',
    },
  ),
  m(
    'isr-meaning',
    'Storage and replication',
    'What is the ISR (in-sync replica set)?',
    'The leader plus the followers that are caught up with it',
    [
      'Every broker in the cluster',
      'The replicas stored in another data centre',
      'The set of consumers in a group',
    ],
    {
      what: 'A follower leaves the ISR if it falls behind for longer than `replica.lag.time.max.ms`. Only ISR members can become leader when unclean election is off.',
      use: 'ties together acks=all, min.insync.replicas and leader election.',
      ref: 'Study book, section 9.',
      tip: 'ISR = replicas you can safely promote.',
    },
  ),

  // ---------------------------------------------------------------- Spring for Apache Kafka
  t(
    'kafkalistener',
    'Spring Kafka',
    'Consume topic orders in consumer group billing with Spring Kafka. Write the annotation.',
    [
      r`@KafkaListener(topics = "orders", groupId = "billing")`,
      r`@KafkaListener(groupId = "billing", topics = "orders")`,
    ],
    {
      what: 'Spring creates a listener container that polls in the background and calls your method for each record.',
      trap: 'throwing from the method triggers the error handler. Without one the record is retried and finally skipped by default.',
      use: 'set `concurrency` to run several consumer threads, up to the partition count.',
      ref: 'Study book, section 15 (Spring for Apache Kafka).',
      tip: 'Topic + group, and an error handler.',
    },
  ),
  t(
    'template-send',
    'Spring Kafka',
    'Publish event with key orderId to topic orders using KafkaTemplate. Write the call.',
    [r`template.send("orders", orderId, event);`],
    {
      what: 'The key keeps events of one order in one partition. In Spring Kafka 3.0+ `send()` returns a `CompletableFuture`, so use `whenComplete` for failures.',
      since: 'Spring Kafka 3.0 (ListenableFuture before).',
      use: 'log or retry on failure, never ignore the future.',
      ref: 'Study book, section 15.',
      tip: 'template.send(topic, key, value).',
    },
    r`KafkaTemplate<String, OrderEvent> template = ...;
String orderId = "o-1";
OrderEvent event = ...;`,
  ),
  t(
    'dlt-recoverer',
    'Spring Kafka',
    'Create the recoverer that publishes failed records to a dead-letter topic using KafkaTemplate template.',
    [
      r`var recoverer = new DeadLetterPublishingRecoverer(template);`,
      r`DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(template);`,
    ],
    {
      what: 'It sends the failed record to `<topic>.DLT` (same partition by default) with headers for the exception and the original topic, partition and offset.',
      use: 'pass it into a `DefaultErrorHandler` together with a backoff.',
      ref: 'Study book, section 16 (Error handling, retry topics, DLT).',
      tip: 'Recoverer = where failed records go.',
    },
  ),
  t(
    'retryable-topic',
    'Spring Kafka',
    'Retry a failing listener 4 times through separate retry topics. Write the annotation.',
    [r`@RetryableTopic(attempts = "4")`],
    {
      what: 'Failed records move to retry topics with a delay, so the main partition keeps flowing. After the last attempt they go to the DLT.',
      trap: 'retried records lose ordering relative to newer ones. `attempts` is a String in the annotation.',
      use: 'non-blocking retries for transient errors.',
      ref: 'Study book, section 16.',
      tip: 'Retry topics unblock the partition but break order.',
    },
  ),
  m(
    'blocking-vs-retry-topic',
    'Spring Kafka',
    'What is the trade-off between DefaultErrorHandler blocking retries and @RetryableTopic?',
    'Blocking retries keep order but stall the partition. Retry topics keep flowing but break order',
    [
      'Blocking retries break order and retry topics keep it',
      'There is no difference, both are blocking',
      'Retry topics are faster but lose messages',
    ],
    {
      what: 'A blocking backoff pauses the partition until the record succeeds or is recovered. Retry topics park the record elsewhere and continue.',
      trap: 'a poison pill with a long blocking backoff delays every record behind it.',
      use: 'choose by whether order matters more than latency.',
      ref: 'Study book, sections 16 and 17.',
      tip: 'Order or flow. Pick one.',
    },
  ),
  m(
    'poison-pill',
    'Spring Kafka',
    'What is a poison pill and how do you handle it?',
    'A record that always fails (for example bad JSON). Send it to a dead-letter topic instead of retrying forever',
    [
      'A very large record. Increase message.max.bytes',
      'A record with a null key. Add a key',
      'A duplicate record. Turn on idempotence',
    ],
    {
      what: 'Retrying cannot fix it, so the consumer would be stuck on one offset. Mark such exceptions as not retryable and route the record to a DLT.',
      trap: 'a dead-letter topic nobody monitors is a slower data-loss path. Alert on its depth.',
      use: 'use `ErrorHandlingDeserializer` so deserialisation errors become handled errors.',
      ref: 'Study book, section 17 (Error handling patterns).',
      tip: 'Poison pill = skip to DLT, then alert.',
    },
  ),
  t(
    'embedded-kafka',
    'Spring Kafka',
    'Start an in-memory broker with one partition and topic orders in a Spring test. Write the annotation.',
    [r`@EmbeddedKafka(partitions = 1, topics = "orders")`],
    {
      what: 'Spring Kafka test starts an embedded broker for the test class. Use Awaitility to wait for asynchronous results, never `Thread.sleep`.',
      use: 'for real broker semantics such as transactions or compaction prefer Testcontainers with `@ServiceConnection`.',
      ref: 'Study book, "Commonly used code snippets", number 9.',
      tip: 'Embedded for speed, Testcontainers for realism.',
    },
  ),
  m(
    'trusted-packages',
    'Spring Kafka',
    'Why set spring.json.trusted.packages to specific packages instead of "*"?',
    'A wildcard lets a producer make the consumer instantiate any class (deserialisation risk)',
    [
      'It makes JSON parsing faster',
      'It is required for the broker to start',
      'It enables compression',
    ],
    {
      what: 'JsonDeserializer uses type headers sent by the producer. Restricting trusted packages limits which classes can be created.',
      use: 'prefer Avro or Protobuf with Schema Registry for evolving payloads.',
      ref: 'Study book, sections 12 and 15.',
      tip: 'Trust packages by name, not star.',
    },
  ),

  // ---------------------------------------------------------------- Schemas, Streams, Connect
  m(
    'backward-compat',
    'Schemas, Streams and Connect',
    'With BACKWARD compatibility in Schema Registry, which side do you upgrade first?',
    'Consumers first, because the new schema can read data written with the old one',
    ['Producers first, always', 'Brokers first', 'Neither, schemas never change'],
    {
      what: 'BACKWARD means a consumer with the new schema can read old data. Adding a field with a default is backward compatible.',
      trap: 'removing a required field or changing a type breaks readers.',
      use: 'pick the compatibility mode to match your rollout order.',
      ref: 'Study book, section 12 (Schema Registry).',
      tip: 'Backward = new reader, old data.',
    },
  ),
  m(
    'copartition',
    'Schemas, Streams and Connect',
    'What must be true for Kafka Streams to join two topics?',
    'They must be co-partitioned: same partition count and the same partitioning of keys',
    [
      'They must have different keys',
      'They must be in different clusters',
      'They must use different serdes',
    ],
    {
      what: 'A join needs records with the same key in the same partition number of both inputs, so a task can see both sides.',
      trap: 'changing the key (selectKey) creates a repartition topic automatically.',
      use: 'check partition counts before designing a join.',
      ref: 'Study book, section 13 (Kafka Streams and ksqlDB).',
      tip: 'Join = co-partition.',
    },
  ),
  t(
    'streams-stream',
    'Schemas, Streams and Connect',
    'Read topic orders as a KStream named orders with a StreamsBuilder named builder. Write the line.',
    [
      r`KStream<String, String> orders = builder.stream("orders");`,
      r`var orders = builder.<String, String>stream("orders");`,
    ],
    {
      what: '`builder.stream` creates a record stream. Then chain `filter`, `groupByKey().count()` and so on.',
      trap: 'aggregations are stateful: they use a state store and a changelog topic.',
      use: 'tell the interviewer about repartition and changelog topics.',
      ref: 'Study book, section 13.',
      tip: 'Builder, stream, topic.',
    },
    r`StreamsBuilder builder = new StreamsBuilder();`,
  ),
  m(
    'connect-debezium',
    'Schemas, Streams and Connect',
    'What does Debezium do?',
    'Reads a database transaction log and streams row changes into Kafka (CDC)',
    [
      'Runs SQL queries from Kafka',
      'Compresses Kafka segments',
      'Balances partitions across brokers',
    ],
    {
      what: 'Debezium is a Kafka Connect source connector for change data capture. With the outbox event router it publishes the outbox table as clean events.',
      use: 'avoids polling and dual writes.',
      ref: 'Study book, section 14.',
      tip: 'Debezium = database log to Kafka.',
    },
  ),

  // ---------------------------------------------------------------- Design and comparison
  m(
    'hot-partition',
    'Design',
    'One partition is much busier than the others. What is the usual cause and fix?',
    'A skewed key. Choose a better-distributed key or add a controlled salt if order allows',
    [
      'Too many consumers. Delete some partitions',
      'Compression is turned off. Enable gzip',
      'The topic has too many replicas',
    ],
    {
      what: 'A few keys (a big customer) send most of the traffic to one partition, which caps throughput and builds lag.',
      use: 'check partition-level byte rates and lag before resizing.',
      ref: 'Study book, section 8.',
      tip: 'Hot partition = hot key.',
    },
  ),
  m(
    'kafka-vs-queue',
    'Design',
    'What is the key difference between Kafka and a traditional queue like RabbitMQ or SQS?',
    'Kafka keeps a replayable log: consumers track offsets and many groups can read the same data',
    [
      'Kafka deletes each message as soon as it is read',
      'Kafka cannot scale beyond one node',
      'Kafka only supports one consumer',
    ],
    {
      what: 'Retention, not consumption, removes data. Consumers pull and can rewind, so replay and multiple independent subscribers are natural.',
      trap: 'Kafka has no per-message acknowledgement or priority queues, so routing, delays and per-message retry need design.',
      use: 'pick a queue for task distribution and Kafka for event streams and replay.',
      ref: 'Study book, section 23 (Kafka vs RabbitMQ vs SQS vs Pulsar vs Kinesis).',
      tip: 'Queue = work to do. Log = events that happened.',
    },
  ),
];

export const kafkaQuiz: Quiz = {
  slug: 'kafka',
  title: 'Apache Kafka',
  description:
    'Settings, commands and rules you need cold: partitions and ordering, durable producers, consumers and offsets, delivery semantics, storage and replication, and Spring for Apache Kafka. Each answer has the version, the common trap and a memory tip.',
  source: {
    label: 'Apache Kafka study book',
    href: '/resources/kafka-study-book.html',
  },
  /** Authored most-important first: random rounds of N take the first N. */
  questions: authored,
};
