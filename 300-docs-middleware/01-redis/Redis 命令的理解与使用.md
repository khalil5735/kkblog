## Redis 键管理

### 查看所有键：`keys *`

### 查看键总数：`dbsize`

dbsize命令会返回当前数据库中键的总数。
dbsize命令在计算键总数时不会遍历所有键，而是直接获取Redis内置的键总
数变量，所以dbsize命令的时间复杂度是O（1）。而keys命令会遍历所有键，所以
它的时间复杂度是O（n），当Redis保存了大量键时，线上环境禁止使用。

### 检查键是否存在：`exists key` 
存在返回1，不存在返回 0

### 删除键：`del key1 key2 ...keyn` 
- 删除键：`del key1 key2 ...keyn` , 返回成功删除的个数

### 键过期
#### 通过expire设置键等过期时间
可以给指定键设置过期时间，当超过过期时间后，键会被删除。
- `expire key seconds` 设置xx秒后键过期
- `expireat key timestamp` 键在时间戳timestamp后过期（秒级）
- `pexpire key milliseconds` 设置xx毫秒后键过期
- `pexpireat key milliseconds-timestamp` 键在时间戳timestamp后
过期（毫秒级）

#### 通过ttl和pttl查看键的剩余过期时间

- `ttl key` 查询键的剩余过期时间（秒级）
- `pttl key` 查询键等剩余过期时间（毫秒级）

可以使用`ttl key` 查看键剩余过期时间。
- 大于0的整数：剩余过期时间（秒）
- -1：表示键没有设置过期时间
- -2：表示键不存在

```bash

127.0.0.1:6379> set k1 v1 # 添加一个 k v
OK
127.0.0.1:6379> ttl k1  # 键没有设置过期时间，返回-1
(integer) -1
127.0.0.1:6379> expire k1 20 # 设置过期时间20s
(integer) 1
127.0.0.1:6379> ttl k1 # 检查当前剩余过期时间
(integer) 16
127.0.0.1:6379> ttl k1
(integer) 9
127.0.0.1:6379> ttl k1
(integer) 7
127.0.0.1:6379> ttl k1
(integer) 5
127.0.0.1:6379> ttl k1
(integer) 2
127.0.0.1:6379> ttl k1 # 键不存在，返回-2
(integer) -2
127.0.0.1:6379> ttl k1
(integer) -2
127.0.0.1:6379> get k1
(nil)
127.0.0.1:6379>
```

#### 通过persist 命令消除键的过期时间

#### setex 命令
setex 命令作为 set+expire 的组合，不但是原子执行，同时减少了一次网络通讯的时间。
```bash
127.0.0.1:6379> setex k1 30 v1
OK
127.0.0.1:6379> ttl k1
(integer) 21
127.0.0.1:6379> ttl k1
(integer) 20
127.0.0.1:6379> ttl k1
(integer) 17
127.0.0.1:6379>

```
#### 注意事项
关于键过期的注setex命令作为set+expire的组合，不但是原子执行，同时减少了一次网络
通讯的时间意事项：
- 如果设置过期时间为负数，会直接删除键，类似于直接执行`del key`
- 对于字符串类型键，执行set命令会去掉过期时间（其实就是覆盖更新了原来的键）


### 键重命名 `rename key new_key`

可以通过命令`rename old_k1 new_k2`，将键`old_k1` 重命名为 `new_k2`，需要注意的是如果键`new_k2`本来就存在，那么键`new_k2`的值将会被覆盖重写。

```bash
127.0.0.1:6379> set key1 value1
OK
127.0.0.1:6379> set key2 value2
OK
127.0.0.1:6379> keys key*
1) "key2"
2) "key1"
127.0.0.1:6379> rename key1 key3 # 将key1 重命名为 key3
OK
127.0.0.1:6379> keys key*
3) "key2"
4) "key3"
127.0.0.1:6379> rename key3 key2 # 将key3重命名key2
OK
127.0.0.1:6379> keys key*
5) "key2"
127.0.0.1:6379> get key2
"value1" # 原key2 已经被覆盖重写
127.0.0.1:6379>

```

为了防止被强行 `rename`，Redis 提供了`renamenx` 命令，确保只有 newKey 不存在时候才被覆盖。
```bash
127.0.0.1:6379> keys *
(empty array)
127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379> keys *
1) "k2"
2) "k1"
127.0.0.1:6379> renamenx k1 k2
(integer) 0 # 返回结果是0，表示操作没有成功
127.0.0.1:6379> keys *
3) "k2"
4) "k1"
127.0.0.1:6379> renamenx k1 k3
(integer) 1 # k3 原不存在，操作成功 
127.0.0.1:6379> keys *
5) "k3"
6) "k2"
127.0.0.1:6379>

```


### 随机返回一个键 `randomkey`

```bash

127.0.0.1:6379> set k1 v1
OK
127.0.0.1:6379> set k2 v2
OK
127.0.0.1:6379> set k3 v3
OK
127.0.0.1:6379> set k4 v4
OK
127.0.0.1:6379> keys *
1) "k3"
2) "k4"
3) "k2"
4) "k1"
127.0.0.1:6379> randomkey
"k2"
127.0.0.1:6379> randomkey
"k2"
127.0.0.1:6379> randomkey
"k3"
127.0.0.1:6379>

```


## 数据结构和内部编码
### 查看键的数据结构类型：`type key`

如果键不存在，则返回 none

### 查看键的数据结构内部编码

type命令实际返回的就是当前键的数据结构类型，它们分别是：string（字符
串）、hash（哈希）、list（列表）、set（集合）、zset（有序集合），但这些
只是Redis对外的数据结构。
实际上每种数据结构都有自己底层的内部编码实现，而且是多种实现，这样
Redis会在合适的场景选择合适的内部编码。

可以通过object encoding命令查询内部编
码
### Redis的5种数据结构

![[redis_key_types.png]]
### Redis数据结构和内部编码
![[redis-object-encoding.png]]

## Redis 单线程架构

Redis使用了单线程架构和I/O多路复用模型来实现高性能的内存数据库服务。

因为Redis是单线程来处理命令的，所以一条命令从客户端达到服务端不会立刻被执行，所有命令都会进入一个队列中，然后逐个被执行。
![[redis-exec-command.png]]


