## 相关网址

- Github https://github.com/quartz-scheduler/quartz
- Quartz官方文档-W3cschool https://www.w3cschool.cn/quartz_doc/

## Quartz VS Spring Task

Quartz 相比 Spring Task 的优势主要体现在其强大的调度能力和灵活性上，具体如下：

- 复杂调度策略：
  Quartz 支持复杂的调度规则，包括使用 Cron 表达式、链式执行任务等。Spring Task 虽然也支持 Cron 表达式，但在灵活性和可配置性上不如 Quartz。
- 任务持久化：
  Quartz 可以将任务的状态保存到数据库中，这使得即使应用程序重启或服务器崩溃后，未完成的任务仍然能够恢复执行。Spring Task 没有内置的任务持久化功能。
- 分布式支持：
  Quartz 支持集群模式，这意味着可以在多个节点之间共享任务调度负载，提高了系统的可用性和稳定性。Spring Task 本身不支持分布式调度，需要额外的开发工作来实现类似的功能。
- 高灵活性：
  Quartz 提供了更多的调度选项和更细致的控制，例如动态任务注册、任务优先级设置等功能。相比之下，Spring Task 更加轻量级，适用于简单的调度需求。
- 丰富的触发器类型：
  Quartz 提供了多种类型的触发器（如 SimpleTrigger 和 CronTrigger），可以满足不同的调度需求。而 Spring Task 主要通过注解方式提供定时任务调度，并且仅支持简单的固定频率或者 Cron 表达式。
- 错误处理机制：
  在 Quartz 中，如果某次任务执行抛出异常，不会影响下一次任务的执行。而在 Spring Task 中，一旦某个任务在执行过程中抛出异常，则整个定时器生命周期就可能结束，后续任务不再执行。
- 扩展性：
  Quartz 可以通过插件和其他扩展点进行定制，以适应特定的需求。它还允许用户编写自己的 JobStore 实现，从而控制任务数据的存储方式。

## 表结构说明

表结构 sql 地址：https://github.com/quartz-scheduler/quartz/tree/main/quartz/src/main/resources/org/quartz/impl/jdbcjobstore

Quartz在数据库中创建了一系列表来存储任务调度相关的信息，这些表包括：

1. qrtz_job_details：存储一个jobDetail信息。
2. qrtz_triggers：存储触发器的基本信息。
3. qrtz_blob_triggers：存储以Blob类型存储的触发器信息。
4. qrtz_cron_triggers：存储Cron类型的触发器信息。
5. qrtz_simple_triggers：存储简单触发器的信息。
6. qrtz_simprop_triggers：存储具有属性的简单触发器的信息。
7. qrtz_fired_triggers：存储已触发的触发器信息。
8. qrtz_calendars：存储日历信息，用于指定一个时间范围。
9. qrtz_paused_trigger_grps：存储暂停掉的触发器组信息。
10. qrtz_scheduler_state：存储调度器状态信息。
11. qrtz_locks：存储程序的悲观锁信息（如果使用了悲观锁）。

以下以 MySQL 示例，解释各表字段

```sql
DROP TABLE IF EXISTS QRTZ_FIRED_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_PAUSED_TRIGGER_GRPS;
DROP TABLE IF EXISTS QRTZ_SCHEDULER_STATE;
DROP TABLE IF EXISTS QRTZ_LOCKS;
DROP TABLE IF EXISTS QRTZ_SIMPLE_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_SIMPROP_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_CRON_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_BLOB_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_TRIGGERS;
DROP TABLE IF EXISTS QRTZ_JOB_DETAILS;
DROP TABLE IF EXISTS QRTZ_CALENDARS;

-- 存储每一个已配置的 Job 的详细信息
CREATE TABLE QRTZ_JOB_DETAILS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名
    JOB_NAME  VARCHAR(200) NOT NULL, -- 集群中job的名字
    JOB_GROUP VARCHAR(200) NOT NULL, -- 集群中job的所属组的名字
    DESCRIPTION VARCHAR(250) NULL, -- 描述
    JOB_CLASS_NAME   VARCHAR(250) NOT NULL, -- 集群中个note job实现类的完全包名,quartz就是根据这个路径到classpath找到该job类
    IS_DURABLE VARCHAR(1) NOT NULL, -- 是否持久化,把该属性设置为1，quartz会把job持久化到数据库中
    IS_NONCONCURRENT VARCHAR(1) NOT NULL, -- 是否并行，该属性可以通过注解配置
    IS_UPDATE_DATA VARCHAR(1) NOT NULL,
    REQUESTS_RECOVERY VARCHAR(1) NOT NULL, -- 当一个scheduler失败后，其他实例可以发现那些执行失败的Jobs，若是1，那么该Job会被其他实例重新执行，否则对应的Job只能释放等待下次触发
    JOB_DATA BLOB NULL, -- 一个blob字段，存放持久化job对象
    PRIMARY KEY (SCHED_NAME,JOB_NAME,JOB_GROUP)
);

-- 存储已配置的 Trigger 的信息
CREATE TABLE QRTZ_TRIGGERS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名，和配置文件org.quartz.scheduler.instanceName保持一致
    TRIGGER_NAME VARCHAR(200) NOT NULL, -- 触发器的名字
    TRIGGER_GROUP VARCHAR(200) NOT NULL, -- 触发器所属组的名字
    JOB_NAME  VARCHAR(200) NOT NULL, -- qrtz_job_details表job_name的外键
    JOB_GROUP VARCHAR(200) NOT NULL, -- qrtz_job_details表job_group的外键
    DESCRIPTION VARCHAR(250) NULL, -- 描述
    NEXT_FIRE_TIME BIGINT(13) NULL, -- 下一次触发时间
    PREV_FIRE_TIME BIGINT(13) NULL, -- 上一次触发时间
    PRIORITY INTEGER NULL, -- 线程优先级
    TRIGGER_STATE VARCHAR(16) NOT NULL, -- 当前trigger状态，设置为ACQUIRED,如果设置为WAITING,则job不会触发
    TRIGGER_TYPE VARCHAR(8) NOT NULL, -- 触发器类型
    START_TIME BIGINT(13) NOT NULL, -- 开始时间
    END_TIME BIGINT(13) NULL, -- 结束时间
    CALENDAR_NAME VARCHAR(200) NULL, -- 日历名称
    MISFIRE_INSTR SMALLINT(2) NULL, -- misfire处理规则，cornTrigger和SimpleTrigger含有不同的含义 参考：
    JOB_DATA BLOB NULL, -- JOB存储对象
    PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
    FOREIGN KEY (SCHED_NAME,JOB_NAME,JOB_GROUP)
        REFERENCES QRTZ_JOB_DETAILS(SCHED_NAME,JOB_NAME,JOB_GROUP)
);
-- 存储简单的trigger，包括重复次数，间隔，以及触发次数。
注意：TIMES_TRIGGERED用来记录执行了多少次了，此值被定义在SimpleTriggerImpl中，每次执行+1，这里定义的REPEAT_COUNT=5，实际情况会执行6次。因为第一次是在0开始。
CREATE TABLE QRTZ_SIMPLE_TRIGGERS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名 qrtz_triggers表sche_name的外键
    TRIGGER_NAME VARCHAR(200) NOT NULL, -- 触发器名，qrtz_triggers表trigger_name的外键
    TRIGGER_GROUP VARCHAR(200) NOT NULL, -- 触发器组，qrtz_triggers表trigger_group的外键
    REPEAT_COUNT BIGINT(7) NOT NULL, -- 重复次数
    REPEAT_INTERVAL BIGINT(12) NOT NULL, -- 重复间隔
    TIMES_TRIGGERED BIGINT(10) NOT NULL, -- 已触发次数
    PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
    FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
        REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

-- 存放cron类型的触发器
CREATE TABLE QRTZ_CRON_TRIGGERS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名 qrtz_triggers表sche_name的外键
    TRIGGER_NAME VARCHAR(200) NOT NULL, -- 调度器名,qrtz_triggers表trigger_name的外键
    TRIGGER_GROUP VARCHAR(200) NOT NULL, -- 触发器组，qrtz_triggers表trigger_group的外键
    CRON_EXPRESSION VARCHAR(200) NOT NULL, -- cron表达式
    TIME_ZONE_ID VARCHAR(80), -- 时区ID
    PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
    FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
        REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

-- 存储CalendarIntervalTrigger和DailyTimeIntervalTrigger两种类型的触发器
CREATE TABLE QRTZ_SIMPROP_TRIGGERS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名 qrtz_triggers表sche_name的外键
    TRIGGER_NAME VARCHAR(200) NOT NULL, -- 调度器名,qrtz_triggers表trigger_name的外键
    TRIGGER_GROUP VARCHAR(200) NOT NULL, -- 触发器组，qrtz_triggers表trigger_group的外键
    STR_PROP_1 VARCHAR(512) NULL,
    STR_PROP_2 VARCHAR(512) NULL,
    STR_PROP_3 VARCHAR(512) NULL,
    INT_PROP_1 INT NULL,
    INT_PROP_2 INT NULL,
    LONG_PROP_1 BIGINT NULL,
    LONG_PROP_2 BIGINT NULL,
    DEC_PROP_1 NUMERIC(13,4) NULL,
    DEC_PROP_2 NUMERIC(13,4) NULL,
    BOOL_PROP_1 VARCHAR(1) NULL,
    BOOL_PROP_2 VARCHAR(1) NULL,
    PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
    FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
    REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

-- 自定义的triggers使用blog类型进行存储，非自定义的triggers不会存放在此表中，Quartz提供的triggers包括：CronTrigger，CalendarIntervalTrigger，DailyTimeIntervalTrigger以及SimpleTrigger。
CREATE TABLE QRTZ_BLOB_TRIGGERS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名 qrtz_triggers表sche_name的外键
    TRIGGER_NAME VARCHAR(200) NOT NULL, -- 调度器名,qrtz_triggers表trigger_name的外键
    TRIGGER_GROUP VARCHAR(200) NOT NULL, -- 触发器组，qrtz_triggers表trigger_group的外键
    BLOB_DATA BLOB NULL,
    PRIMARY KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP),
    FOREIGN KEY (SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
        REFERENCES QRTZ_TRIGGERS(SCHED_NAME,TRIGGER_NAME,TRIGGER_GROUP)
);

-- 以 Blob 类型存储 Quartz 的 Calendar 信息
CREATE TABLE QRTZ_CALENDARS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名
    CALENDAR_NAME  VARCHAR(200) NOT NULL,
    CALENDAR BLOB NOT NULL,
    PRIMARY KEY (SCHED_NAME,CALENDAR_NAME)
);

-- 存储已暂停的 Trigger 组的信息
CREATE TABLE QRTZ_PAUSED_TRIGGER_GRPS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名
    TRIGGER_GROUP  VARCHAR(200) NOT NULL, -- 触发器组
    PRIMARY KEY (SCHED_NAME,TRIGGER_GROUP)
);

-- 存储与已触发的 Trigger 相关的状态信息，以及相联 Job 的执行信息，trigger随着时间的推移状态发生变化，直到最后trigger执行完成，从表中被删除；以SimpleTrigger为例重复3次执行为例。相同的trigger和job，每触发一次都会创建一个实例；从刚被创建的ACQUIRED状态，到EXECUTING状态，最后执行完从数据库中删除；
CREATE TABLE QRTZ_FIRED_TRIGGERS
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名称
    ENTRY_ID VARCHAR(95) NOT NULL, -- 运行Id
    TRIGGER_NAME VARCHAR(200) NOT NULL, -- 触发器名
    TRIGGER_GROUP VARCHAR(200) NOT NULL, -- 触发器组
    INSTANCE_NAME VARCHAR(200) NOT NULL, -- 集群中实例ID
    FIRED_TIME BIGINT(13) NOT NULL, -- 触发时间
    SCHED_TIME BIGINT(13) NOT NULL, --
    PRIORITY INTEGER NOT NULL, -- 线程优先级
    STATE VARCHAR(16) NOT NULL, -- 状态
    JOB_NAME VARCHAR(200) NULL, -- 任务名
    JOB_GROUP VARCHAR(200) NULL, -- 任务组
    IS_NONCONCURRENT VARCHAR(1) NULL, -- 是否并行
    REQUESTS_RECOVERY VARCHAR(1) NULL, -- 是否恢复
    PRIMARY KEY (SCHED_NAME,ENTRY_ID)
);

-- 调度器状态，记录了最后最新的检查时间，在quartz.properties中设置了CHECKIN_INTERVAL为1000，也就是每秒检查一次
CREATE TABLE QRTZ_SCHEDULER_STATE
  (
    SCHED_NAME VARCHAR(120) NOT NULL, -- 调度器名称，集群名
    INSTANCE_NAME VARCHAR(200) NOT NULL, -- 集群中实例ID，配置文件中org.quartz.scheduler.instanceId的配置
    LAST_CHECKIN_TIME BIGINT(13) NOT NULL, -- 上次检查时间
    CHECKIN_INTERVAL BIGINT(13) NOT NULL, -- 检查时间间隔
    PRIMARY KEY (SCHED_NAME,INSTANCE_NAME)
);

-- 存储程序的悲观锁的信息(假如使用了悲观锁) Quartz提供的锁表，为多个节点调度提供分布式锁，实现分布式调度，默认有2个锁：
-- STATE_ACCESS主要用在scheduler定期检查是否有效的时候，保证只有一个节点去处理已经失效的scheduler。
-- TRIGGER_ACCESS主要用在TRIGGER被调度的时候，保证只有一个节点去执行调度。
CREATE TABLE QRTZ_LOCKS
  (
    SCHED_NAME VARCHAR(120) NOT NULL,
    LOCK_NAME  VARCHAR(40) NOT NULL,
    PRIMARY KEY (SCHED_NAME,LOCK_NAME)
);
```

- https://www.jianshu.com/p/b94ebb8780fa
