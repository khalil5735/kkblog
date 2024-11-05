# Redis 中 5 种数据类型

## 概述

Redis 中说的数据类型是 value 的数据类型，key 的类型都是字符串。

5 种数据类型：

- redis 字符串（String）
- redis 列表（List）
- redis 集合（Set）
- redis 哈希表（Hash）
- redis 有序集合（Zset）

redis 常用数据类型操作命令：

- [http://redis.cn/commands.html](http://redis.cn/commands.html)
- [Redis 命令参考 — Redis 命令参考](http://doc.redisfans.com/)
- [Redis 教程 | 菜鸟教程](https://www.runoob.com/redis/redis-tutorial.html)

## redis 键（key）

- `keys *`：查看当前库所有的 key
- `exists keyname`：判断某个 keyname 是否存在
- `type keyname`：查看你的 keyname 是什么类型
- `del keyname`：删除指定的 keyname 数据
- `unlink keyname`：根据 value 删除非阻塞删除，仅仅将 keys 从 keyspace 元数据中删除，真正的删除会在后续异步中操作。
- `expire keyname 10`：为指定的 keyname 设置有效期 10 秒
- `ttl keyname`：查看指定的 keyname 还有多少秒过期，-1：表示永不过期，-2：表示已过期
- `select dbindex`：切换数据库【0-15】，默认为 0
- `dbsize`：查看当前数据库 key 的数量
- `flushdb`：清空当前库
- `flushall`：通杀全部库

## redis 字符串（String）

### 简介

String 是 Redis 最基本的类型，你可以理解成与 Memcached 一模一样的类型，一个 key 对应一个 value。

String 类型是二进制安全的。意味着 Redis 的 string 可以包含任何数据。比如 jpg 图片或者序列化的对象。

String 类型是 Redis 最基本的数据类型，一个 Redis 中字符串 value 最多可以是 512M

### 常用命令

#### set：添加键值对

```bash
127.0.0.1:6379> set key value [EX seconds|PX milliseconds|EXAT timestamp|PXAT milliseconds-timestamp|KEEPTTL] [NX|XX] [GET]
```

- `NX`：当数据库中 key 不存在时，可以将 key-value 添加到数据库
- `XX`：当数据库中 key 存在时，可以将 key-value 添加数据库，与 NX 参数互斥
- `EX`：key 的超时秒数
- `PX`：key 的超时毫秒数，与 EX 互斥
- value 中若包含空格、特殊字符，需用双引号包裹

#### get：获取值

```bash
get <key>
```

示例

```bash
127.0.0.1:6379> set name ready
OK
127.0.0.1:6379> get name
"ready"
```

#### apend：追加值

```bash
append <key> <value>
```

将给定的 value 追加到原值的末尾。

示例

```bash
127.0.0.1:6379> set k1 hello
OK
127.0.0.1:6379> append k1 " world"
(integer) 11
127.0.0.1:6379> get k1
"hello world"
```

#### strlen：获取值的长度

```bash
strlen <key>
```

示例

```bash
127.0.0.1:6379> set name ready
OK
127.0.0.1:6379> strlen name
(integer) 5
```

#### setnx：key 不存在时，设置 key 的值

```bash
setnx <key> <value>
```

示例

```bash
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> setnx site "itsoku.com" #site不存在，返回1，表示设置成功
(integer) 1
127.0.0.1:6379> setnx site "itsoku.com" #再次通过setnx设置site，由于已经存在了，所以设置失败，返回0
(integer) 0
```

#### incr：原子递增 1

```bash
incr <key>
```

将 key 中存储的值增 1，只能对数字值操作，如果 key 不存在，则会新建一个，值为 1

示例

```bash
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> set age 30 #age值为30
OK
127.0.0.1:6379> incr age #age增加1，返回31
(integer) 31
127.0.0.1:6379> get age #获取age的值
"31"
127.0.0.1:6379> incr salary #salary不存在，自动创建一个，值为1
(integer) 1
127.0.0.1:6379> get salary #获取salary的值
"1"
```

#### decr：原子递减 1

```bash
decr <key>
```

将 key 中存储的值减 1，只能对数字值操作，如果为空，新增值为 - 1

示例

```bash
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> set age 30 #age值为30
OK
127.0.0.1:6379> decr age #age递减1，返回29
(integer) 29
127.0.0.1:6379> get age #获取age的值
"29"
127.0.0.1:6379> decr salary #salary不存在，自动创建一个，值为-1
(integer) -1
127.0.0.1:6379> get salary #获取salary
"-1"
```

#### incrby/decrby：递增或者递减指定的数字

```bash
incrby/decrby <key> <步长>
```

将 key 中存储的数字值递增指定的步长，若 key 不存在，则相当于在原值为 0 的值上递增指定的步长。

示例

```bash
127.0.0.1:6379> set salary 10000 #设置salary为10000
OK
127.0.0.1:6379> incrby salary 5000 #salary添加5000，返回15000
(integer) 15000
127.0.0.1:6379> get salary #获取salary
"15000"
127.0.0.1:6379> decrby salary 800 #salary减去800，返回14200
(integer) 14200
127.0.0.1:6379> get salary #获取salary
"14200"
```

#### mset：同时设置多个 key-value

```bash
mset <key1> <value1> <key2> <value2> ...
```

示例

```bash
127.0.0.1:6379> mset name ready age 30
OK
127.0.0.1:6379> get name
"ready"
127.0.0.1:6379> get age
"30"
```

#### mget：获取多个 key 对应的值

```bash
mget <key1> <key2> ...
```

示例

```bash
127.0.0.1:6379> mset name ready age 30 #同时设置name和age
OK
127.0.0.1:6379> mget name age #同时读取name和age的值
1) "ready"
2) "30"
```

#### msetnx：当多个 key 都不存在时，则设置成功

```bash
msetnx <key1> <value1> <key2> <value2> ...
```

原子性的，要么都成功，或者都失败。

示例

```bash
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> set k1 v1 #设置k1
OK
127.0.0.1:6379> msetnx k1 v1 k2 v2 #当k1和k2都不存在的时候，同时设置k1和k2，由于k1已存在，所以这个操作失败
(integer) 0
127.0.0.1:6379> mget k1 k2 #获取k1、k2，k2不存在
1) "v1"
2) (nil)
127.0.0.1:6379> msetnx k2 v2 k3 v3 #当k2、h3都不存在的时候，同时设置k2和k3，设置成功
(integer) 1
127.0.0.1:6379> mget k1 k2 k3 #后去k1、k2、k3的值
1) "v1"
2) "v2"
3) "v3"
```

#### getrange：获取值的范围，类似 java 中的 substring

```bash
getrange key start end
```

获取 [start,end] 返回为的字符串

示例

```bash
127.0.0.1:6379> set k1 helloworld
OK
127.0.0.1:6379> getrange k1 0 4
"hello"
```

#### setrange：覆盖指定位置的值

```bash
setrange <key> <起始位置> <value>
```

示例

```bash
127.0.0.1:6379> set k1 helloworld
OK
127.0.0.1:6379> get k1
"helloworld"
127.0.0.1:6379> setrange k1 1 java
(integer) 10
127.0.0.1:6379> get k1
"hjavaworld"
```

#### setex：设置键值 & 过期时间（秒）

```bash
setex <key> <过期时间(秒)> <value>
```

示例

```
127.0.0.1:6379> setex k1 100 v1 #设置k1的值为v1，有效期100秒
OK
127.0.0.1:6379> get k1 #获取k1的值
"v1"
127.0.0.1:6379> ttl k1 #获取k1还有多少秒失效
(integer) 96
```

#### getset：以新换旧，设置新值同时返回旧值

```
getset <key> <value>
127.0.0.1:6379> set name ready #设置name为ready
OK
127.0.0.1:6379> getset name tom #设置name为tom，返回name的旧值
"ready"
127.0.0.1:6379> getset age 30 #设置age为30，age未设置过，返回age的旧值为null
(nil)
```

### 数据结构

String 的数据结构为简单动态字符串（Simple Dynamic String，缩写 SDS）。是可以修改的字符串，内部结构上类似于 Java 的 ArrayList，采用分配冗余空间的方式来减少内存的频繁分配。

![image-20241105233242414](./assets/image-20241105233242414.png)

如图所示，内部为当前字符串实际分配的空间 capacity 一般要高于实际字符串长度 len。当字符串长度小于 1M 时，扩容都是加倍现有的空间，如果超过 1M，扩容时一次会多扩容 1M 的空间。

要注意的是字符串最大长度为 512M。

## redis 列表（List）

### 简介

单键多值

redis 列表是简单的字符串列表，按照插入顺序排序。

你可以添加一个元素到列表的头部（左边）或者尾部（右边）。

它的底层实际上是使用双向链表实现的，对两端的操作性能很高，通过索引下标操作中间节点性能会较差。

![image-20241105233318760](./assets/image-20241105233318760.png)

### 常用命令

#### lpush/rpush：从左边或者右边插入一个或多个值

```
lpush/rpush <key1> <value1> <key2> <value2> ...
```

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> rpush name java spring "springboot" "spring cloud" #列表name的左边插入4个元素
(integer) 4
127.0.0.1:6379> lrange name 1 2 #从左边取出索引位于[1,2]范围内的元素
1) "spring"
2) "springboot"
```

#### lrange：从列表左边获取指定范围内的值

```
lrange <key> <star> <stop>
```

返回列表 `key` 中指定区间内的元素，区间以偏移量 `start` 和 `stop` 指定。

下标 (index) 参数 `start` 和 `stop` 都以 `0` 为底，也就是说，以 `0` 表示列表的第一个元素，以 `1` 表示列表的第二个元素，以此类推。

你也可以使用负数下标，以 `-1` 表示列表的最后一个元素， `-2` 表示列表的倒数第二个元素，以此类推。

**返回值:**

一个列表，包含指定区间内的元素。

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush course java c c++ php js nodejs #course集合的右边插入6个元素
(integer) 6
127.0.0.1:6379> lrange course 0 -1 #取出course集合中所有元素
1) "java"
2) "c"
3) "c++"
4) "php"
5) "js"
6) "nodejs"
127.0.0.1:6379> lrange course 1 3 #获取course集合索引[1,3]范围内的元素
1) "c"
2) "c++"
3) "php"
```

#### lpop/rpop：从左边或者右边弹出多个元素

```
lpop/rpop <key> <count>
```

count：可以省略，默认值为 1

lpop/rpop 操作之后，弹出来的值会从列表中删除

值在键在，值光键亡。

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush course java c++ php js node js #集合course右边加入6个元素
(integer) 6
127.0.0.1:6379> lpop course #从左边弹出1个元素
"java"
127.0.0.1:6379> rpop course 2 #从右边弹出2个元素
1) "js"
2) "node"
```

#### rpoplpush：从一个列表右边弹出一个元素放到另外一个列表中

```
rpoplpush source destination
```

从 source 的右边弹出一个元素放到 destination 列表的左边

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush k1 1 2 3 #列表k1的右边添加3个元素[1,2,3]
(integer) 3
127.0.0.1:6379> lrange k1 0 -1 #从左到右输出k1列表中的元素
1) "1"
2) "2"
3) "3"
127.0.0.1:6379> rpush k2 4 5 6 #列表k2的右边添加3个元素[4,5,6]
(integer) 3
127.0.0.1:6379> lrange k2 0 -1 #从左到右输出k2列表中的元素
1) "4"
2) "5"
3) "6"
127.0.0.1:6379> rpoplpush k1 k2 #从k1的右边弹出一个元素放到k2的左边
"3"
127.0.0.1:6379> lrange k1 0 -1 #k1中剩下2个元素了
1) "1"
2) "2"
127.0.0.1:6379> lrange k2 0 -1 #k2中变成4个元素了
1) "3"
2) "4"
3) "5"
4) "6"
```

#### lindex：获取指定索引位置的元素（从左到右）

```
lindex key index
```

返回列表 `key` 中，下标为 `index` 的元素。

下标 (index) 参数 `start` 和 `stop` 都以 `0` 为底，也就是说，以 `0` 表示列表的第一个元素，以 `1` 表示列表的第二个元素，以此类推。

你也可以使用负数下标，以 `-1` 表示列表的最后一个元素， `-2` 表示列表的倒数第二个元素，以此类推。

如果 `key` 不是列表类型，返回一个错误。

**返回值:**

列表中下标为 `index` 的元素。

如果 `index` 参数的值不在列表的区间范围内 (out of range)，返回 `nil`

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush course java c c++ php #列表course中放入4个元素
(integer) 4
127.0.0.1:6379> lindex course 2 #返回索引位置2的元素
"c++"
127.0.0.1:6379> lindex course 200 #返回索引位置200的元素，没有
(nil)
127.0.0.1:6379> lindex course -1 #返回最后一个元素
"php"
```

#### llen：获得列表长度

```
llen key
```

返回列表 `key` 的长度。

如果 `key` 不存在，则 `key` 被解释为一个空列表，返回 `0` .

如果 `key` 不是列表类型，返回一个错误。

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush name ready tom jack
(integer) 3
127.0.0.1:6379> llen name
(integer) 3
```

#### linsert：在某个值的前或者后面插入一个值

```
linsert <key> before|after <value> <newvalue>
```

将值 `newvalue` 插入到列表 `key` 当中，位于值 `value`之前或之后。

当 `value` 不存在于列表 `key` 时，不执行任何操作。

当 `key` 不存在时， `key` 被视为空列表，不执行任何操作。

如果 `key` 不是列表类型，返回一个错误。

**返回值:**

如果命令执行成功，返回插入操作完成之后，列表的长度。

如果没有找到 `value` ，返回 `-1` 。

如果 `key` 不存在或为空列表，返回 `0` 。

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> rpush name ready tom jack #列表name中添加3个元素
(integer) 3
127.0.0.1:6379> lrange name 0 -1 #name列表所有元素
1) "ready"
2) "tom"
3) "jack"
127.0.0.1:6379> linsert name before tom lily #tom前面添加lily
(integer) 4
127.0.0.1:6379> lrange name 0 -1 #name列表所有元素
1) "ready"
2) "lily"
3) "tom"
4) "jack"
127.0.0.1:6379> linsert name before xxx lucy # 在元素xxx前面插入lucy，由于xxx元素不存在，插入失败，返回-1
(integer) -1
127.0.0.1:6379> lrange name 0 -1
1) "ready"
2) "lily"
3) "tom"
4) "jack"
```

#### lrem：删除指定数量的某个元素

```
LREM key count value
```

根据参数 `count` 的值，移除列表中与参数 `value` 相等的元素。

`count` 的值可以是以下几种：

- `count > 0` : 从表头开始向表尾搜索，移除与 `value` 相等的元素，数量为 `count` 。
- `count < 0` : 从表尾开始向表头搜索，移除与 `value` 相等的元素，数量为 `count` 的绝对值。
- `count = 0` : 移除表中所有与 `value` 相等的值。

**返回值：**

被移除元素的数量。

因为不存在的 `key` 被视作空表 (empty list)，所以当 `key` 不存在时，总是返回 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> rpush k1 v1 v2 v3 v2 v2 v1 #k1列表中插入6个元素
(integer) 6
127.0.0.1:6379> lrange k1 0 -1 #输出k1集合中所有元素
1) "v1"
2) "v2"
3) "v3"
4) "v2"
5) "v2"
6) "v1"
127.0.0.1:6379> lrem k1 2 v2 #k1集合中从左边删除2个v2
(integer) 2
127.0.0.1:6379> lrange k1 0 -1 #输出列表，列表中还有1个v2，前面2个v2干掉了
1) "v1"
2) "v3"
3) "v2"
4) "v1"
```

#### lset：替换指定位置的值

```
lset <key> <index> <value>
```

将列表 `key` 下标为 `index` 的元素的值设置为 `value` 。

当 `index` 参数超出范围，或对一个空列表 ( `key` 不存在) 进行 lset 时，返回一个错误。

**返回值：**

操作成功返回 `ok` ，否则返回错误信息。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> rpush name tom jack ready #name集合中放入3个元素
(integer) 3
127.0.0.1:6379> lrange name 0 -1 #输出name集合元素
1) "tom"
2) "jack"
3) "ready"
127.0.0.1:6379> lset name 1 lily #将name集合中第2个元素替换为liy
OK
127.0.0.1:6379> lrange name 0 -1 #输出name集合元素
1) "tom"
2) "lily"
3) "ready"
127.0.0.1:6379> lset name 10 lily #索引超出范围，报错
(error) ERR index out of range
127.0.0.1:6379> lset course 1 java #course集合不存在，报错
(error) ERR no such key
```

### 数据结构

List 的数据结构为快速链表 quickList

首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是 ziplist，也就是压缩列表。

它将所有的元素紧挨着一起存储，分配的是一块连续的内存。

当就比较多的时候才会改成 quickList。

因为普通的链表需要的附加指针空间太大，会比较浪费空间，比如这个列表里存储的只是 int 类型的书，结构上还需要 2 个额外的指针 prev 和 next。

![image-20241105233413860](./assets/image-20241105233413860.png)

redis 将链表和 ziplist 结合起来组成了 quicklist。也就是将多个 ziplist 使用双向指针串起来使用，这样既满足了快速的插入删除性能，又不会出现太大的空间冗余。

## redis 集合（Set）

### 简介

redis set 对外提供的功与 list 类似，是一个列表的功能，特殊之处在于 set 是可以自动排重的，当你需要存储一个列表数据，又不希望出现重复数据时，set 是一个很好的选择。

redis 的 set 是 string 类型的**无序集合**，他的底层实际是一个 value 为 null 的 hash 表，收益添加，删除，查找复杂度都是 O(1)。

一个算法，如果时间复杂度是 O(1)，那么随着数据的增加，查找数据的时间不变，也就是不管数据多少，查找时间都是一样的。

### 常用命令

#### sadd：添加一个或多个元素

```
sadd <key> <value1> <value2> ...
```

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd k1 v1 v2 v1 v3 v2 #k1中放入5个元素，会自动去重，成功插入3个
(integer) 3
```

#### smembers：取出所有元素

```
smembers <key>
```

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd k1 v1 v2 v1 v3 v2
(integer) 3
127.0.0.1:6379> smembers k1
1) "v2"
2) "v1"
3) "v3"
```

#### sismember：判断集合中是否有某个值

```
sismember <key> <value>
```

判断集合 key 中是否包含元素 value，1：有，0：没有

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd k1 v1 v2 v1 v3 v2 #k1集合中成功放入3个元素[v1,v2,v3]
(integer) 3
127.0.0.1:6379> sismember k1 v1 #判断k1中是否包含v1，1：有
(integer) 1
127.0.0.1:6379> sismember k1 v5 #判断k1中是否包含v5，0：无
(integer) 0
```

#### scard：返回集合中元素的个数

```
scard <key>
```

返回集合 `key` 的基数 (集合中元素的数量)

**返回值：**

集合的基数。

当 `key` 不存在时，返回 `0` 。

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd k1 v1 v2 v1 v3 v2
(integer) 3
127.0.0.1:6379> scard k1
(integer) 3
```

#### srem：删除多个元素

```
srem key member [member ...]
```

移除集合 `key` 中的一个或多个 `member` 元素，不存在的 `member` 元素会被忽略。

当 `key` 不是集合类型，返回一个错误。

**返回值:**

被成功移除的元素的数量，不包括被忽略的元素。

示例

```
127.0.0.1:6379> flushdb #清空db，方测试
OK
127.0.0.1:6379> sadd course java c c++ python #集合course中添加4个元素
(integer) 4
127.0.0.1:6379> smembers course #获取course集合所有元素
1) "python"
2) "java"
3) "c++"
4) "c"
127.0.0.1:6379> srem course java c #删除course集合中的java和c
(integer) 2
127.0.0.1:6379> smembers course #获取course集合所有元素，剩下2个了
1) "python"
2) "c++"
```

#### spop：随机弹出多个值

```
spop <key> <count>
```

随机从 key 集合中弹出 count 个元素，count 默认值为 1

**返回值:**

被移除的随机元素。

当 `key` 不存在或 `key` 是空集时，返回 `nil`

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd course java c c++ python #course集合中添加4个元素
(integer) 4
127.0.0.1:6379> smembers course #获取course集合中所有元素
1) "python"
2) "java"
3) "c++"
4) "c"
127.0.0.1:6379> spop course #随机弹出1个元素，被弹出的元素会被删除
"c++"
127.0.0.1:6379> spop course 2 #随机弹出2个元素
1) "java"
2) "python"
127.0.0.1:6379> smembers course #输出剩下的元素
1) "c"
```

#### srandmember：随机获取多个元素，不会从集合中删除

```
srandmember <key> <count>
```

从 key 指定的集合中随机返回 count 个元素，count 可以不指定，默认值是 1。

**srandmember 和 spop 的区别：**

都可以随机获取多个元素，srandmember 不会删除元素，而 spop 会删除元素。

**返回值:**

只提供 `key` 参数时，返回一个元素；如果集合为空，返回 `nil` 。

如果提供了 `count` 参数，那么返回一个数组；如果集合为空，返回空数组。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> sadd course java c c++ python #course中放入5个元素
(integer) 4
127.0.0.1:6379> smembers course #输出course集合中所有元素
1) "python"
2) "java"
3) "c++"
4) "c"
127.0.0.1:6379> srandmember course 3 #随机获取3个元素，元素并不会被删除
1) "python"
2) "c++"
3) "c"
127.0.0.1:6379> smembers course #输出course集合中所有元素，元素个数未变
1) "python"
2) "java"
3) "c++"
4) "c"
```

#### smove：将某个原创从一个集合移动到另一个集合

```
smove <source> <destination> member
```

将 `member` 元素从 `source` 集合移动到 `destination` 集合。

smove 是原子性操作。

如果 `source` 集合不存在或不包含指定的 `member` 元素，则 smove 命令不执行任何操作，仅返回 `0` 。否则， `member` 元素从 `source` 集合中被移除，并添加到 `destination` 集合中去。

当 `destination` 集合已经包含 `member` 元素时，smove 命令只是简单地将 `source` 集合中的 `member` 元素删除。

当 `source` 或 `destination` 不是集合类型时，返回一个错误。

**返回值:**

如果 `member` 元素被成功移除，返回 `1` 。

如果 `member` 元素不是 `source` 集合的成员，并且没有任何操作对 `destination` 集合执行，那么返回 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> sadd course1 java php js #集合course1中放入3个元素[java,php,js]
(integer) 3
127.0.0.1:6379> sadd course2 c c++ #集合course2中放入2个元素[c,c++]
(integer) 2
127.0.0.1:6379> smove course1 course2 js #将course1中的js移动到course2
(integer) 1
127.0.0.1:6379> smembers course1 #输出course1中的元素
1) "java"
2) "php"
127.0.0.1:6379> smembers course2 #输出course2中的元素
1) "js"
2) "c++"
3) "c"
```

#### sinter：取多个集合的交集

```
sinter key [key ...]
```

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd course1 java php js #集合course1：[java,php,js]
(integer) 3
127.0.0.1:6379> sadd course2 c c++ js #集合course2：[c,c++,js]
(integer) 3
127.0.0.1:6379> sadd course3 js html #集合course3：[js,html]
(integer) 2
127.0.0.1:6379> sinter course1 course2 course3 #返回三个集合的交集，只有：[js]
1) "js"
```

#### sinterstore：将多个集合的交集放到一个新的集合中

```
sinterstore destination key [key ...]
```

这个命令类似于`sinter`命令，但它将结果保存到 `destination` 集合，而不是简单地返回结果集。

**返回值:**

结果集中的成员数量。

#### sunion：取多个集合的并集，自动去重

```
sunion key [key ...]
```

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd course1 java php js #集合course1：[java,php,js]
(integer) 3
127.0.0.1:6379> sadd course2 c c++ js #集合course2：[c,c++,js]
(integer) 3
127.0.0.1:6379> sadd course3 js html #集合course3：[js,html]
(integer) 2
127.0.0.1:6379> sunion course1 course2 course3 #返回3个集合的并集，会自动去重
1) "php"
2) "js"
3) "java"
4) "html"
5) "c++"
6) "c"
```

#### sunionstore：将多个集合的并集放到一个新的集合中

```
sinterstore destination key [key ...]
```

这个命令类似于 sunion 命令，但它将结果保存到 `destination` 集合，而不是简单地返回结果集。

**返回值:**

结果集中的成员数量。

#### sdiff：取多个集合的差集

```
SDIFF key [key ...]
```

返回一个集合的全部成员，该集合是所有给定集合之间的差集。

不存在的 `key` 被视为空集。

示例

```
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> sadd course1 java php js #集合course1：[java,php,js]
(integer) 3
127.0.0.1:6379> sadd course2 c c++ js #集合course2：[c,c++,js]
(integer) 3
127.0.0.1:6379> sadd course3 js html #集合course3：[js,html]
(integer) 2
127.0.0.1:6379> sdiff course1 course2 course3 #返回course1中有的而course2和course3中都没有的元素
1) "java"
2) "php"
```

#### sdiffstore：将多个集合的差集放到一个新的集合中

```
sdiffstore destination key [key ...]
```

这个命令类似于 sdiff 命令，但它将结果保存到 `destination` 集合，而不是简单地返回结果集。

**返回值:**

结果集中的成员数量。

### 数据结构

set 数据结构是字典，字典是用 hash 表实现的。

Java 中的 HashSet 的内部实现使用 HashMap，只不过所有的 value 都指向同一个对象。

Redis 的 set 结构也是一样的，它的内部也使用 hash 结构，所有的 value 都指向同一个内部值。

## redis 哈希（Hash）

### 简介

Redis hash 是一个键值对集合。

Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象。

类似于 java 里面的 Map<String,Object>

### 常用命令

#### hset：设置多个 field 的值

```
hset key field value [field value ...]
```

将哈希表 `key` 中的域 `field` 的值设为 `value` 。

如果 `key` 不存在，一个新的哈希表被创建并进行 hset 操作。

如果域 `field` 已经存在于哈希表中，旧值将被覆盖。

**返回值：**

如果 `field` 是哈希表中的一个新建域，并且值设置成功，返回 `1` 。

如果哈希表中域 `field` 已经存在且旧值已被新值覆盖，返回 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
```

#### hget：获取指定 filed 的值

```
hget key field
```

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
127.0.0.1:6379> hget user name #获取user中的name
"ready"
```

#### hgetall：返回 hash 表所有的域和值

```
hgetall key
```

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
127.0.0.1:6379> hgetall user #获取user所有信息
1) "name"
2) "ready"
3) "age"
4) "30"
```

#### hmset：和 hset 类似（已弃用）

```
hmset key field value [field value ...]
```

#### hexists：判断给定的 field 是否存在，1：存在，0：不存在

```
hexists key field
```

查看哈希表 `key` 中，给定域 `field` 是否存在。

**返回值：**

如果哈希表含有给定域，返回 `1` 。

如果哈希表不含有给定域，或 `key` 不存在，返回 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
127.0.0.1:6379> hexists user name #user中存在name域
(integer) 1
127.0.0.1:6379> hexists user address #user中不存在address域，返回0
(integer) 0
127.0.0.1:6379> hexists user1 address #user1这个key不存在，返回0
(integer) 0
```

#### hkeys：列出所有的 filed

```
hkeys key
```

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
127.0.0.1:6379> hkeys user #获取user中的所有filed
1) "name"
2) "age"
```

#### hvals：列出所有的 value

```
hvals key
```

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
127.0.0.1:6379> hvals user #获取user中的所有filed的值列表
1) "ready"
2) "30"
```

#### hlen：返回 filed 的数量

```
HLEN key
```

返回哈希表 `key` 中域的数量。

**返回值：**

哈希表中域的数量。

当 `key` 不存在时，返回 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #哈希表user中设置2个域：name和age，name的值为ready，age的值为30
(integer) 2
127.0.0.1:6379> hlen user
(integer) 2
```

#### hincrby：filed 的值加上指定的增量

```
hincrby key field increment
```

为哈希表 key 中的域 field 的值加上增量 increment 。

增量也可以为负数，相当于对给定域进行减法操作。

如果 key 不存在，一个新的哈希表被创建并执行 HINCRBY 命令。

如果域 field 不存在，那么在执行命令前，域的值被初始化为 0 。

对一个储存字符串值的域 field 执行 HINCRBY 命令将造成一个错误。

**返回值：**

执行 hincrby 命令之后，哈希表 `key` 中域 `field` 的值。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset siteInfo site itsoku.com pv 1000 #hash表siteInfo中有2个域：{site:"itsoku.com",pv:1000}
(integer) 2
127.0.0.1:6379> hget siteInfo pv #获取siteInfo中pv的值
"1000"
127.0.0.1:6379> hincrby siteInfo pv 10 #siteInfo中的pv值增加10
(integer) 1010
127.0.0.1:6379> hget siteInfo pv #获取siteInfo中的pv
"1010"
127.0.0.1:6379> hincrby siteInfo uv 500 #siteInfo中的uv值增加500，uv这个域不存在，则会先添加，然后再执行hincrby
(integer) 500
```

#### hsetnx：当 filed 不存在的时候，设置 filed 的值

```
hsetnx key field value
```

将哈希表 `key` 中的域 `field` 的值设置为 `value` ，当且仅当域 `field` 不存在。

若域 `field` 已经存在，该操作无效。

如果 `key` 不存在，一个新哈希表被创建并执行 hsetnx 命令。

**返回值：**

设置成功，返回 `1` 。

如果给定域已经存在且没有操作被执行，返回 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> hset user name ready age 30 #创建user，包含2个域：name、age
(integer) 2
127.0.0.1:6379> hsetnx user name tom #name已存在，设置失败，返回0
(integer) 0
127.0.0.1:6379> hget user name #name依旧是ready
"ready"
127.0.0.1:6379> hsetnx user address shanghai #address不存在，设置成功
(integer) 1
127.0.0.1:6379> hget user address #输出address的值
"shanghai"
```

### 数据结构

Hash 类型对应的数据结构是 2 种：ziplist（压缩列表），hashtable（哈希表）。

当 field-value 长度较短个数较少时，使用 ziplist，否则使用 hashtable。

## redis 有序集合 zset（sorted set）

### 简介

redis 有序集合 zset 与普通集合 set 非常相似，是一个没有重复元素的字符串集合。

不同之处是有序集合的每个成员都关联了一个评分（score），这个评分（score）被用来按照从最低分到最高分的方式排序集合中的成员。

集合的成员是唯一的，但是评分是可以重复的。

因为元素是有序的，所以你可以很快的根据评分（score）或者次序（position）来获取一个范围的元素。

访问有序集合中的中间元素也是非常快的，因为你能够使用有序集合作为一个没有重复成员你的智能列表。

### 常用命令

#### zadd：添加元素

```
zadd <key> <score1> <member1> <score2> <member2> ...
```

将一个或多个 `member` 元素及其 `score` 值加入到有序集 `key` 当中。

如果某个 `member` 已经是有序集的成员，那么更新这个 `member` 的 `score` 值，并通过重新插入这个 `member` 元素，来保证该 `member` 在正确的位置上。

`score` 值可以是整数值或双精度浮点数。

如果 `key` 不存在，则创建一个空的有序集并执行 zadd 操作。

当 `key` 存在但不是有序集类型时，返回一个错误。

**返回值:**

被成功添加的新成员的数量，不包括那些被更新的、已经存在的成员。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topn 100 java 80 c 90 c++ 50 php 70 js #创建名称为topn的zset，添加了5个元素
(integer) 5
```

#### zrange：score 升序，获取指定索引范围的元素

```
zrange key start top [withscores]
```

- 返回存储在有序集合`key`中的指定范围的元素。 返回的元素可以认为是按 score 从最低到最高排列，如果得分相同，将按字典排序。

- 下标参数 `start` 和 `stop` 都以 `0` 为底，也就是说，以 `0` 表示有序集第一个成员，以 `1` 表示有序集第二个成员，以此类推。

  你也可以使用负数下标，以 `-1` 表示最后一个成员， `-2` 表示倒数第二个成员，以此类推。

- zrange key 0 -1：可以获取所有元素

- withscores：让成员和它的 `score` 值一并返回，返回列表以 `value1,score1, ..., valueN,scoreN` 的格式表示

**可用版本：**

\>= 1.2.0

**时间复杂度:**

O(log(N)+M)， `N` 为有序集的基数，而 `M` 为结果集的基数。

**返回值:**

指定区间内，带有 `score` 值 (可选) 的有序集成员的列表。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topn 100 java 80 c 90 c++ 50 php 70 js #创建名称为topn的zset，添加了5个元素
(integer) 5
127.0.0.1:6379> zrange topn 0 -1 #按score升序，返回topn中所有元素的值
1) "php"
2) "js"
3) "c"
4) "c++"
5) "java"
127.0.0.1:6379> zrange topn 0 -1 withscores #按score升序，返回所有元素的值以及score
 1) "php"
 2) "50"
 3) "js"
 4) "70"
 5) "c"
 6) "80"
 7) "c++"
 8) "90"
 9) "java"
10) "100"
127.0.0.1:6379> zrange topn 2 4 #返回索引范围[2,4]内的3个元素
1) "c"
2) "c++"
3) "java"
```

#### zrevrange：score 降序，获取指定索引范围的元素

```
zrevrange key start stop [WITHSCORES]
```

- 返回存储在有序集合`key`中的指定范围的元素。 返回的元素可以认为是按 score 最高到最低排列， 如果得分相同，将按字典排序。

- 下标参数 `start` 和 `stop` 都以 `0` 为底，也就是说，以 `0` 表示有序集第一个成员，以 `1` 表示有序集第二个成员，以此类推。

  你也可以使用负数下标，以 `-1` 表示最后一个成员， `-2` 表示倒数第二个成员，以此类推。

- withscores：让成员和它的 `score` 值一并返回，返回列表以 `value1,score1, ..., valueN,scoreN` 的格式表示

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topn 100 java 80 c 90 c++ 50 php 70 js #创建名称为topn的zset，添加了5个元素
(integer) 5
127.0.0.1:6379> zrevrange topn 0 -1 #按照score降序获取所有元素
1) "java"
2) "c++"
3) "c"
4) "js"
5) "php"
127.0.0.1:6379> zrevrange topn 0 2 #按照score降序获取前3名
1) "java"
2) "c++"
3) "c"
```

#### zrangebyscore：按照 score 升序，返回指定 score 范围内的数据

```
zrangebyscore key min max [WITHSCORES] [LIMIT offset count]
```

返回有序集 `key` 中，所有 `score` 值介于 `min` 和 `max` 之间 (包括等于 `min` 或 `max` ) 的成员。有序集成员按 `score` 值递增 (从小到大) 次序排列。

具有相同 `score` 值的成员按字典序来排列 (该属性是有序集提供的，不需要额外的计算)。

可选的 `LIMIT` 参数指定返回结果的数量及区间 (就像 SQL 中的 `SELECT LIMIT offset, count` )，注意当 `offset` 很大时，定位 `offset` 的操作可能需要遍历整个有序集，此过程最坏复杂度为 O(N) 时间。

可选的 `WITHSCORES` 参数决定结果集是单单返回有序集的成员，还是将有序集成员及其 `score` 值一起返回。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topn 100 java 80 c 90 c++ 50 php 70 js #创建名称为topn的zset，添加了5个元素
(integer) 5
127.0.0.1:6379> zrangebyscore topn 70 90 #score升序，获取score位于[70,90]区间中的元素值
1) "js"
2) "c"
3) "c++"
127.0.0.1:6379> zrangebyscore topn 70 90 withscores #score升序，获取score位于[70,90]区间中的元素值及score
1) "js"
2) "70"
3) "c"
4) "80"
5) "c++"
6) "90"
127.0.0.1:6379> zrangebyscore topn 70 90 withscores limit 1 2 #相当于：select value,score from topn集合 where score>=70 and score<=90 order by score asc limit 1,2
1) "c"
2) "80"
3) "c++"
4) "90"
```

#### zrevrangebyscore：按照 score 降序，返回指定 score 范围内的数据

```
zrevrangebyscore key max min [WITHSCORES] [LIMIT offset count]
```

返回有序集 `key` 中， `score` 值介于 `max` 和 `min` 之间 (默认包括等于 `max` 或 `min` ) 的所有的成员。有序集成员按 `score` 值递减 (从大到小) 的次序排列。

具有相同 `score` 值的成员按字典序的逆序排列。

除了成员按 `score` 值递减的次序排列这一点外， zrevrangebyscore 命令的其他方面和 zrangebyscore 命令一样。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topn 100 java 80 c 90 c++ 50 php 70 js #创建名称为topn的zset，添加了5个元素
(integer) 5
127.0.0.1:6379> zrevrangebyscore topn 100 90 #score降序，获取score位于[70,90]区间中的元素值
1) "java"
2) "c++"
127.0.0.1:6379> zrevrangebyscore topn 100 90 withscores #score降序，获取score位于[70,90]区间中的元素值及score
1) "java"
2) "100"
3) "c++"
4) "90"
```

#### zincrby：为指定元素的 score 加上指定的增量

```
zincrby key increment member
```

为有序集 `key` 的成员 `member` 的 `score` 值加上增量 `increment` 。

可以通过传递一个负数值 `increment` ，让 `score` 减去相应的值，比如 `ZINCRBY key -5 member` ，就是让 `member` 的 `score` 值减去 `5` 。

当 `key` 不存在，或 `member` 不是 `key` 的成员时， `ZINCRBY key increment member` 等同于 `ZADD key increment member` 。

当 `key` 不是有序集类型时，返回一个错误。

`score` 值可以是整数值或双精度浮点数。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ #集合topx中添加3个元素：java、c、c++，对应的score分别是：90、70、80
(integer) 3
127.0.0.1:6379> zrevrange topx 0 -1 withscores #输出集合topx中的元素，包含score
1) "java"
2) "90"
3) "c++"
4) "80"
5) "c"
6) "70"
127.0.0.1:6379> zincrby topx 5 java #对topx中的元素java的score加5，变成95了
"95"
127.0.0.1:6379> zrevrange topx 0 -1 withscores # 输出集合元素，注意java的score是95了
1) "java"
2) "95"
3) "c++"
4) "80"
5) "c"
6) "70"
```

#### zrem：删除集合中多个元素

```
zrem key member [member ...]
```

移除有序集 `key` 中的一个或多个成员，不存在的成员将被忽略。

当 `key` 存在但不是有序集类型时，返回一个错误。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ #集合topx中添加3个元素：java、c、c++，对应的score分别是：90、70、80
(integer) 3
127.0.0.1:6379> zrange topx 0 -1 #输出集合topx中所有元素
1) "c"
2) "c++"
3) "java"
127.0.0.1:6379> zrem topx c c++ #删除集合topx中的2个元素：c、c++
(integer) 2
127.0.0.1:6379> zrange topx 0 -1 #输出集合topx中所有元素
1) "java"
```

#### zremrangebyrank：根据索引范围删除元素

```
zremrangebyrank key start stop
```

移除有序集 `key` 中，指定排名 (rank) 区间内的所有成员。

区间分别以下标参数 `start` 和 `stop` 指出，包含 `start` 和 `stop` 在内。

下标参数 `start` 和 `stop` 都以 `0` 为底，也就是说，以 `0` 表示有序集第一个成员，以 `1` 表示有序集第二个成员，以此类推。

你也可以使用负数下标，以 `-1` 表示最后一个成员， `-2` 表示倒数第二个成员，以此类推。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ #集合topx中添加3个元素：java、c、c++，对应的score分别是：90、70、80
(integer) 3
127.0.0.1:6379> zrange topx 0 -1 #输出集合topx中所有元素
1) "c"
2) "c++"
3) "java"
127.0.0.1:6379> zremrangebyrank topx 0 1 #删除索引范围[0,1]的数据
(integer) 2
127.0.0.1:6379> zrange topx 0 -1 #输出鞂topx中所有元素
1) "java"
```

#### zremrangebyscore：根据 score 的范围删除元素

```
zremrangebyscore key min max
```

移除有序集 `key` 中，所有 `score` 值介于 `min` 和 `max` 之间 (包括等于 `min` 或 `max` ) 的成员

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ 50 php #topx集合中添加4个元素
(integer) 4
127.0.0.1:6379> zrange topx 0 -1 withscores #输出topx中所有元素值、score
1) "php"
2) "50"
3) "c"
4) "70"
5) "c++"
6) "80"
7) "java"
8) "90"
127.0.0.1:6379> zremrangebyscore topx 70 80 #删除score位于[70,80]区间的元素
(integer) 2
127.0.0.1:6379> zrange topx 0 -1 withscores #输出剩下的元素
1) "php"
2) "50"
3) "java"
4) "90"
```

#### zcount：统计指定 score 范围内元素的个数

```
zcount key min max
```

返回有序集 `key` 中， `score` 值在 `min` 和 `max` 之间 (默认包括 `score` 值等于 `min` 或 `max` ) 的成员的数量

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ 50 php #topx集合中添加4个元素
(integer) 4
127.0.0.1:6379> zcount topx 80 100 #统计score位于[80,100]区间中的元素个数
(integer) 2
```

#### zrank：按照 score 升序，返回某个元素在集合中的排名

```
zrank key member
```

返回有序集 `key` 中成员 `member` 的排名。其中有序集成员按 `score` 值递增 (从小到大) 顺序排列。

排名以 `0` 为底，也就是说， `score` 值最小的成员排名为 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ 50 php #topx集合中添加4个元素
(integer) 4
127.0.0.1:6379> zrank topx c #获取元素c的排名，返回1表示排名第2
(integer) 1
127.0.0.1:6379> zrange topx 0 -1 #输出集合中所有元素，看一下c的位置确实是2
1) "php"
2) "c"
3) "c++"
4) "java"
```

#### zrevrank：按照 score 降序，返回某个元素在集合中的排名

返回有序集 `key` 中成员 `member` 的排名。其中有序集成员按 `score` 值递减 (从大到小) 排序。

排名以 `0` 为底，也就是说， `score` 值最大的成员排名为 `0` 。

示例

```
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ 50 php #topx集合中添加4个元素
(integer) 4
127.0.0.1:6379> zrange topx 0 -1
1) "php"
2) "c"
3) "c++"
4) "java"
127.0.0.1:6379> zrevrank topx java #score降序，得到java的排名，排在第1位
(integer) 0
```

#### zscore：返回集合中指定元素的 score

```
zscore key member
```

返回有序集 `key` 中，成员 `member` 的 `score` 值。

如果 `member` 元素不是有序集 `key` 的成员，或 `key` 不存在，返回 `nil` 。

```bash
127.0.0.1:6379> flushdb #清空db，方便测试
OK
127.0.0.1:6379> zadd topx 90 java 70 c 80 c++ 50 php #topx集合中添加4个元素
(integer) 4
127.0.0.1:6379> zrange topx 0 -1 #输出topx集合所有元素
1) "php"
2) "c"
3) "c++"
4) "java"
127.0.0.1:6379> zscore topx java #获取集合topx中java的score
"90"
```

### 数据结构

SortedSet（zset）是 redis 提供的一个非常特别的数据结构，内部使用到了 2 种数据结构。

#### hash 表

类似于 java 中的 Map<String,score>，key 为集合中的元素，value 为元素对应的 score，可以用来快速定位元素定义的 score，时间复杂度为 O(1)

#### 跳表

跳表（skiplist）是一个非常优秀的数据结构，实现简单，插入、删除、查找的复杂度均为 O(logN)。

类似 java 中的 ConcurrentSkipListSet，根据 score 的值排序后生成的一个跳表，可以快速按照位置的顺序或者 score 的顺序查询元素。

这里我们来看一下跳表的原理：

首先从考虑一个有序表开始：

![image-20241105233800163](./assets/image-20241105233800163.png)

从该有序表中搜索元素 <23, 43, 59> ，需要比较的次数分别为 < 2, 4, 6 >，总共比较的次数为 2 + 4 + 6 = 12 次。有没有优化的算法吗? 链表是有序的，但不能使用二分查找。类似二叉搜索树，我们把一些节点提取出来，作为索引。得到如下结构：

![image-20241105233819885](./assets/image-20241105233819885.png)

这里我们把 <14, 34, 50, 72> 提取出来作为一级索引，这样搜索的时候就可以减少比较次数了。我们还可以再从一级索引提取一些元素出来，作为二级索引，变成如下结构：

![image-20241105233835835](./assets/image-20241105233835835.png)

这里元素不多，体现不出优势，如果元素足够多，这种索引结构就能体现出优势来了。
