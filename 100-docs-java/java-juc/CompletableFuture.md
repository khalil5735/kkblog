CompletableFuture是 java8 中新增的一个类，算是对Future的一种增强，用起来很方便，也是会经常用到的一个工具类，熟悉一下。

## CompletionStage 接口

- **CompletionStage 代表异步计算过程中的某一个阶段**，一个阶段完成以后可能会触发另外一个阶段。
- 一个阶段的计算执行可以是一个Function，Consumer 或者 Runnable。比如：`stage.thenApply(x -> square(x)).thenAccept(x -> System.out.print(x)).thenRun(() -> System.out.println())`
- 一个阶段的执行可能是被单个阶段的完成触发，也可能是由多个阶段一起触发。

## CompletableFuture 类

- 在Java8中，CompletableFuture提供了非常强大的 Future 的扩展功能，可以帮助我们简化异步编程的复杂性，并且提供了**函数式编程的能力**，可以通过回调的方式处理计算结果，也提供了转换和组合 CompletableFuture 的方法。
- 它可能代表一个明确完成的Future，也有可能代表一个完成阶段（ CompletionStage ），它支持在计算完成以后触发一些函数或执行某些动作。
- 它实现了 Future 和 CompletionStage 接口

## 常见使用方法

### 创建一个异步操作 runAsync 和 supplyAsync 

`CompletableFuture` 提供了四个静态方法来创建一个异步操作。

```java
// 不支持返回值，使用默认线程池 ForkJoinPool.commonPool()
public static CompletableFuture<Void> runAsync(Runnable runnable)
// 不支持返回值，使用指定线程池 Executor
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)
// 支持返回值，使用默认线程池 ForkJoinPool.commonPool()
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
// 支持返回值，使用指定线程池 Executor
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

- `runAsync `方法不支持返回值。
- `supplyAsync` 可以支持返回值。
- 没有指定 `Executor` 的方法会默认使用 `ForkJoinPool.commonPool()` 作为它的线程池执行异步代码。如果指定线程池，则使用指定的线程池运行。以下所有的方法都类同。



示例代码：

```java
//无返回值
public static void runAsync() throws Exception {
    CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
        }
        System.out.println("run end ...");
    });
    future.get();
}
//有返回值
public static void supplyAsync() throws Exception {         
    CompletableFuture<Long> future = CompletableFuture.supplyAsync(() -> {
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
        }
        System.out.println("run end ...");
        return System.currentTimeMillis();
    });
    long time = future.get();
    System.out.println("time = "+time);
}
```

### 计算完成后回调 whenComplete 、whenCompleteAsync 和 exceptionally

当CompletableFuture的计算结果完成，或者抛出异常的时候，可以执行特定的Action。主要是下面的方法：

```java
// 任务执行完成后，
public CompletableFuture<T> whenComplete(BiConsumer<? super T,? super Throwable> action)

// 任务执行完成后，开启一个线程异步执行Consumer，默认是 ForkJoinPool.commonPool()线程池 
public CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T,? super Throwable> action)
// 任务执行完成后，开启一个线程异步执行Consumer，使用指定的线程池
public CompletableFuture<T> whenCompleteAsync(BiConsumer<? super T,? super Throwable> action, Executor executor)
public CompletableFuture<T> exceptionally(Function<Throwable,? extends T> fn)
```

- 可以看到Action的类型是 `BiConsumer<? super T,? super Throwable>` 它可以处理正常的计算结果，或者异常情况。
- whenComplete：是执行当前任务的线程执行继续执行 `whenComplete` 的任务。
- whenCompleteAsync：是执行把 whenCompleteAsync 这个任务继续提交给线程池来进行执行。



示例代码：

1、模拟没有异常时

```java
package luren.chapter30;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @Author kui
 * @Date 2024/8/10 19:28
 */
public class whenComplete {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 创建一个CompletableFuture，测试 whenComplete、whenCompleteAsync 和 exceptionally 方法
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000);
                // 读取当前线程名称，并打印
                System.out.println("Current thread: " + Thread.currentThread().getName());
                // 模拟异常
//                throw new RuntimeException("Error occurred.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "Hello";
        });
        future.whenComplete((result, exception) -> {
            System.out.println("whenComplete Result: " + result);
            // 读取当前线程名称，并打印
            System.out.println("whenComplete Current thread: " + Thread.currentThread().getName());
            System.out.println("whenComplete Exception: " + exception);
        });
        future.whenCompleteAsync((result, exception) -> {
            System.out.println("whenCompleteAsync Result: " + result);
            // 读取当前线程名称，并打印
            System.out.println("whenCompleteAsync Current thread: " + Thread.currentThread().getName());
            System.out.println("whenCompleteAsync Exception: " + exception);
        });
        // 指定线程池 FixedThreadPool（10）
        ThreadPoolExecutor executor = getExecutor();
        future.whenCompleteAsync((result, exception) -> {
            System.out.println("whenCompleteAsync2 Result: " + result);
            // 读取当前线程名称，并打印
            System.out.println("whenCompleteAsync2 Current thread: " + Thread.currentThread().getName());
            System.out.println("whenCompleteAsync2 Exception: " + exception);
        }, executor);

        future.exceptionally(throwable -> {
            System.out.println("exceptionally Exception: " + throwable);
            // 读取当前线程名称，并打印
            System.out.println("exceptionally Current thread: " + Thread.currentThread().getName());
            return "Error";
        });

        future.get();
        System.out.println("Main thread finished.");
        // 程序执行最后，关闭线程池
        TimeUnit.SECONDS.sleep(1);
        executor.shutdown();
    }

    private static ThreadPoolExecutor getExecutor() {
        return new ThreadPoolExecutor(10, 10, 0L, java.util.concurrent.TimeUnit.MILLISECONDS, new java.util.concurrent.LinkedBlockingQueue<>());
    }
}
```

Current thread: ForkJoinPool.commonPool-worker-1

whenComplete Result: Hello

whenComplete Current thread: main

whenComplete Exception: null

Main thread finished.

whenCompleteAsync Result: Hello

whenCompleteAsync Current thread: ForkJoinPool.commonPool-worker-1

whenCompleteAsync Exception: null

whenCompleteAsync2 Result: Hello

whenCompleteAsync2 Current thread: pool-1-thread-1

whenCompleteAsync2 Exception: null

- whenComplate 可以声明多次，多次回调互不影响，不会对操作结果产生影响
- 没有异常时，whenComplete 会使用父线程进行执行，whenComplete 使用异步线程执行
- 没有异常时，throwable 为 null





2、模拟有异常时

```java
package luren.chapter30;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @Author kui
 * @Date 2024/8/10 19:28
 */
public class whenComplete {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 创建一个CompletableFuture，测试 whenComplete、whenCompleteAsync 和 exceptionally 方法
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000);
                // 读取当前线程名称，并打印
                System.out.println("Current thread: " + Thread.currentThread().getName());
                // 模拟异常
                throw new RuntimeException("Error occurred.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "Hello";
        });
        future.whenComplete((result, exception) -> {
            System.out.println("whenComplete Result: " + result);
            // 读取当前线程名称，并打印
            System.out.println("whenComplete Current thread: " + Thread.currentThread().getName());
            System.out.println("whenComplete Exception: " + exception);
        });
        future.whenCompleteAsync((result, exception) -> {
            System.out.println("whenCompleteAsync Result: " + result);
            // 读取当前线程名称，并打印
            System.out.println("whenCompleteAsync Current thread: " + Thread.currentThread().getName());
            System.out.println("whenCompleteAsync Exception: " + exception);
        });
        // 指定线程池 FixedThreadPool（10）
        ThreadPoolExecutor executor = getExecutor();
        future.whenCompleteAsync((result, exception) -> {
            System.out.println("whenCompleteAsync2 Result: " + result);
            // 读取当前线程名称，并打印
            System.out.println("whenCompleteAsync2 Current thread: " + Thread.currentThread().getName());
            System.out.println("whenCompleteAsync2 Exception: " + exception);
        }, executor);

        future.exceptionally(throwable -> {
            System.out.println("exceptionally Exception: " + throwable);
            // 读取当前线程名称，并打印
            System.out.println("exceptionally Current thread: " + Thread.currentThread().getName());
            return "Error";
        });

        future.get();
        System.out.println("Main thread finished.");
        // 程序执行最后，关闭线程池
        TimeUnit.SECONDS.sleep(1);
        executor.shutdown();
    }

    private static ThreadPoolExecutor getExecutor() {
        return new ThreadPoolExecutor(10, 10, 0L, java.util.concurrent.TimeUnit.MILLISECONDS, new java.util.concurrent.LinkedBlockingQueue<>());
    }
}
```

执行结果：



Current thread: ForkJoinPool.commonPool-worker-1

exceptionally Exception: java.util.concurrent.CompletionException: java.lang.RuntimeException: Error occurred.

exceptionally Current thread: ForkJoinPool.commonPool-worker-1

whenComplete Result: null

whenComplete Current thread: ForkJoinPool.commonPool-worker-1

whenComplete Exception: java.util.concurrent.CompletionException: java.lang.RuntimeException: Error occurred.

whenCompleteAsync Result: null

whenCompleteAsync Current thread: ForkJoinPool.commonPool-worker-1

whenCompleteAsync2 Result: null

whenCompleteAsync2 Current thread: pool-1-thread-1

whenCompleteAsync Exception: java.util.concurrent.CompletionException: java.lang.RuntimeException: Error occurred.

whenCompleteAsync2 Exception: java.util.concurrent.CompletionException: java.lang.RuntimeException: Error occurred.

Exception in thread "main" java.util.concurrent.ExecutionException: java.lang.RuntimeException: Error occurred.

​	at java.util.concurrent.CompletableFuture.reportGet(CompletableFuture.java:357)

​	at java.util.concurrent.CompletableFuture.get(CompletableFuture.java:1908)

​	at luren.chapter30.whenComplete.main(whenComplete.java:55)

Caused by: java.lang.RuntimeException: Error occurred.

​	at luren.chapter30.whenComplete.lambda$main$0(whenComplete.java:21)

​	at java.util.concurrent.CompletableFuture$AsyncSupply.run(CompletableFuture.java:1604)

​	at java.util.concurrent.CompletableFuture$AsyncSupply.exec(CompletableFuture.java:1596)

​	at java.util.concurrent.ForkJoinTask.doExec(ForkJoinTask.java:289)

​	at java.util.concurrent.ForkJoinPool$WorkQueue.runTask(ForkJoinPool.java:1056)

​	at java.util.concurrent.ForkJoinPool.runWorker(ForkJoinPool.java:1692)

​	at java.util.concurrent.ForkJoinWorkerThread.run(ForkJoinWorkerThread.java:175)

- 异步操作存在异常后，whenComplete 依旧使用之前的线程，没有退出使用父线程
- whenComplete 和  whenCompleteAsync 依旧会回调，只不过值为 null



### thenAccept 消费处理结果

接收任务的处理结果，并消费处理，无返回结果。

```java
public CompletionStage<Void> thenAccept(Consumer<? super T> action);
public CompletionStage<Void> thenAcceptAsync(Consumer<? super T> action);
public CompletionStage<Void> thenAcceptAsync(Consumer<? super T> action,Executor executor);
```

示例代码：

```java
public static void thenAccept() throws Exception{
    CompletableFuture<Void> future = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            return new Random().nextInt(10);
        }
    }).thenAccept(integer -> {
        System.out.println(integer);
    });
    future.get();
}
```

从示例代码中可以看出，该方法只是消费执行完成的任务，并可以根据上面的任务返回的结果进行处理。并没有后续的输错操作。

和 whenComplete 相比，thenAccept 被用来打印处理过程中的信息，它只在成功的情况下被调用。whenComplete 则无论成功还是失败都会被调用，并且可以处理异常情况。



### thenRun 方法

跟 thenAccept 方法不一样的是，不关心任务的处理结果

```java
public CompletionStage<Void> thenRun(Runnable action);
public CompletionStage<Void> thenRunAsync(Runnable action);
public CompletionStage<Void> thenRunAsync(Runnable action,Executor executor);
```

示例代码：

```java
public static void thenRun() throws Exception{
    CompletableFuture<Void> future = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            return new Random().nextInt(10);
        }
    }).thenRun(() -> {
        System.out.println("thenRun ...");
    });
    future.get();
}
```

该方法同 thenAccept 方法类似。不同的是上个任务处理完成后，并不会把计算的结果传给 thenRun 方法。只是处理玩任务后，执行 thenRun 的后续操作。



### 线程串行化 thenApply

当一个线程依赖另一个线程时，可以使用 thenApply 方法来把这两个线程串行化。

```java
public <U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn)
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn)
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn, Executor executor)

// Function<? super T,? extends U>
// T：上一个任务返回结果的类型
// U：当前任务的返回值类型
```

示例代码：

```java
package luren.chapter30;

import java.util.concurrent.*;

/**
 * @Author kui
 * @Date 2024/8/10 20:04
 */
public class thenApply {
    public static void main(String[] args) throws InterruptedException {
        // 创建一个CompletableFuture,演示 thenApply 和 thenApplyAsync 的区别和使用

        ThreadPoolExecutor threadPool = createThreadPool();

        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            System.out.println("supplyAsync");
            // 打印当前线程名称
            System.out.println("supplyAsync Thread name: " + Thread.currentThread().getName());
            return "Hello";
        }).thenApply(s -> {
            System.out.println("thenApply");
            // 打印当前线程名称
            System.out.println("thenApply Thread name: " + Thread.currentThread().getName());
            return s + " thenApply";
        }).thenApplyAsync(s -> {
            System.out.println("thenApply");
            // 打印当前线程名称
            System.out.println("thenApplyAsync Thread name: " + Thread.currentThread().getName());
            return s + " thenApplyAsync";
        }).thenApplyAsync(s -> {
            System.out.println("thenApplyAsync2");
            // 打印当前线程名称
            System.out.println("thenApplyAsync2 Thread name: " + Thread.currentThread().getName());
            return s + " thenApplyAsync2";
        }, threadPool);

        String result = future.join();
        System.out.println("result = " + result);
        // 延迟main 线程，2s后关闭线程池，程序退出
        TimeUnit.SECONDS.sleep(2);
        threadPool.shutdown();
    }

    // 创建一个线程池，使用 ThreadPoolExecutor
    private static ThreadPoolExecutor createThreadPool() {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                5,
                10,
                60L,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(100),
                new ThreadPoolExecutor.AbortPolicy()
        );
        return executor;
    }
}
```

supplyAsync

supplyAsync Thread name: ForkJoinPool.commonPool-worker-1

thenApply

thenApply Thread name: main

thenApply

thenApplyAsync Thread name: ForkJoinPool.commonPool-worker-1

thenApplyAsync2

thenApplyAsync2 Thread name: pool-1-thread-1

result = Hello thenApply thenApplyAsync thenApplyAsync2



### 执行任务完成时对结果的处理 handle 

handle 是执行任务完成时对结果的处理。handle 方法和 thenApply 方法处理方式基本一样。不同的是 handle 是在任务完成后再执行，还可以处理异常的任务。thenApply 只可以执行正常的任务，任务出现异常则不执行 thenApply 方法。

```java
public <U> CompletionStage<U> handle(BiFunction<? super T, Throwable, ? extends U> fn);
public <U> CompletionStage<U> handleAsync(BiFunction<? super T, Throwable, ? extends U> fn);
public <U> CompletionStage<U> handleAsync(BiFunction<? super T, Throwable, ? extends U> fn,Executor executor);
```

示例代码：

```java
public static void handle() throws Exception{
    CompletableFuture<Integer> future = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int i= 10/0;
            return new Random().nextInt(10);
        }
    }).handle(new BiFunction<Integer, Throwable, Integer>() {
        @Override
        public Integer apply(Integer param, Throwable throwable) {
            int result = -1;
            if(throwable==null){
                result = param * 2;
            }else{
                System.out.println(throwable.getMessage());
            }
            return result;
        }
     });
    System.out.println(future.get());
}
```

从示例中可以看出，在 handle 中可以根据任务是否有异常来进行做相应的后续处理操作。而 thenApply 方法，如果上个任务出现错误，则不会执行 thenApply 方法。

### thenCombine 合并任务

thenCombine 会把 两个 CompletionStage 的任务都执行完成后，把两个任务的结果一块交给 thenCombine 来处理。

```java
public <U,V> CompletionStage<V> thenCombine(CompletionStage<? extends U> other,BiFunction<? super T,? super U,? extends V> fn);
public <U,V> CompletionStage<V> thenCombineAsync(CompletionStage<? extends U> other,BiFunction<? super T,? super U,? extends V> fn);
public <U,V> CompletionStage<V> thenCombineAsync(CompletionStage<? extends U> other,BiFunction<? super T,? super U,? extends V> fn,Executor executor);
```

示例代码：

```java
private static void thenCombine() throws Exception {
    CompletableFuture<String> future1 = CompletableFuture.supplyAsync(new Supplier<String>() {
        @Override
        public String get() {
            return "hello";
        }
    });
    CompletableFuture<String> future2 = CompletableFuture.supplyAsync(new Supplier<String>() {
        @Override
        public String get() {
            return "hello";
        }
    });
    CompletableFuture<String> result = future1.thenCombine(future2, new BiFunction<String, String, String>() {
        @Override
        public String apply(String t, String u) {
            return t+" "+u;
        }
    });
    System.out.println(result.get());
}
```

### thenAcceptBoth

当两个CompletionStage都执行完成后，把结果一块交给thenAcceptBoth来进行消耗

```java
public <U> CompletionStage<Void> thenAcceptBoth(CompletionStage<? extends U> other,BiConsumer<? super T, ? super U> action);
public <U> CompletionStage<Void> thenAcceptBothAsync(CompletionStage<? extends U> other,BiConsumer<? super T, ? super U> action);
public <U> CompletionStage<Void> thenAcceptBothAsync(CompletionStage<? extends U> other,BiConsumer<? super T, ? super U> action,     Executor executor);
```

示例代码：

```java
private static void thenAcceptBoth() throws Exception {
    CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f1="+t);
            return t;
        }
    });
    CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f2="+t);
            return t;
        }
    });
    f1.thenAcceptBoth(f2, new BiConsumer<Integer, Integer>() {
        @Override
        public void accept(Integer t, Integer u) {
            System.out.println("f1="+t+";f2="+u+";");
        }
    });
}
```

### applyToEither 方法

两个CompletionStage，谁执行返回的结果快，我就用那个CompletionStage的结果进行下一步的转化操作。

```java
public <U> CompletionStage<U> applyToEither(CompletionStage<? extends T> other,Function<? super T, U> fn);
public <U> CompletionStage<U> applyToEitherAsync(CompletionStage<? extends T> other,Function<? super T, U> fn);
public <U> CompletionStage<U> applyToEitherAsync(CompletionStage<? extends T> other,Function<? super T, U> fn,Executor executor);
```

代码示例：

```java
private static void applyToEither() throws Exception {
    CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f1="+t);
            return t;
        }
    });
    CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f2="+t);
            return t;
        }
    });
    CompletableFuture<Integer> result = f1.applyToEither(f2, new Function<Integer, Integer>() {
        @Override
        public Integer apply(Integer t) {
            System.out.println(t);
            return t * 2;
        }
    });
    System.out.println(result.get());
}
```

### acceptEither 方法

两个CompletionStage，谁执行返回的结果快，我就用那个CompletionStage的结果进行下一步的消耗操作。

```java
public CompletionStage<Void> acceptEither(CompletionStage<? extends T> other,Consumer<? super T> action);
public CompletionStage<Void> acceptEitherAsync(CompletionStage<? extends T> other,Consumer<? super T> action);
public CompletionStage<Void> acceptEitherAsync(CompletionStage<? extends T> other,Consumer<? super T> action,Executor executor);
```

代码示例：

```java
private static void acceptEither() throws Exception {
    CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f1="+t);
            return t;
        }
    });
    CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f2="+t);
            return t;
        }
    });
    f1.acceptEither(f2, new Consumer<Integer>() {
        @Override
        public void accept(Integer t) {
            System.out.println(t);
        }
    });
}
```

### runAfterEither 方法

两个CompletionStage，任何一个完成了都会执行下一步的操作（Runnable）

```java
public CompletionStage<Void> runAfterEither(CompletionStage<?> other,Runnable action);
public CompletionStage<Void> runAfterEitherAsync(CompletionStage<?> other,Runnable action);
public CompletionStage<Void> runAfterEitherAsync(CompletionStage<?> other,Runnable action,Executor executor);
```

代码示例：

```java
private static void runAfterEither() throws Exception {
    CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f1="+t);
            return t;
        }
    });
    CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f2="+t);
            return t;
        }
    });
    f1.runAfterEither(f2, new Runnable() {
        @Override
        public void run() {
            System.out.println("上面有一个已经完成了。");
        }
    });
}
```

### runAfterBoth

两个CompletionStage，都完成了计算才会执行下一步的操作（Runnable）

```java
public CompletionStage<Void> runAfterBoth(CompletionStage<?> other,Runnable action);
public CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other,Runnable action);
public CompletionStage<Void> runAfterBothAsync(CompletionStage<?> other,Runnable action,Executor executor);
```

代码示例：

```java
private static void runAfterBoth() throws Exception {
    CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f1="+t);
            return t;
        }
    });
    CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(new Supplier<Integer>() {
        @Override
        public Integer get() {
            int t = new Random().nextInt(3);
            try {
                TimeUnit.SECONDS.sleep(t);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("f2="+t);
            return t;
        }
    });
    f1.runAfterBoth(f2, new Runnable() {
        @Override
        public void run() {
            System.out.println("上面两个任务都执行完成了。");
        }
    });
}
```

### thenCompose 方法

thenCompose 方法允许你对两个 CompletionStage 进行流水线操作，第一个操作完成时，将其结果作为参数传递给第二个操作。

```java
public <U> CompletableFuture<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn);
public <U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn) ;
public <U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn, Executor executor) ;
```

代码示例：

```java
private static void thenCompose() throws Exception {
        CompletableFuture<Integer> f = CompletableFuture.supplyAsync(new Supplier<Integer>() {
            @Override
            public Integer get() {
                int t = new Random().nextInt(3);
                System.out.println("t1="+t);
                return t;
            }
        }).thenCompose(new Function<Integer, CompletionStage<Integer>>() {
            @Override
            public CompletionStage<Integer> apply(Integer param) {
                return CompletableFuture.supplyAsync(new Supplier<Integer>() {
                    @Override
                    public Integer get() {
                        int t = param *2;
                        System.out.println("t2="+t);
                        return t;
                    }
                });
            }
        });
        System.out.println("thenCompose result : "+f.get());
    }
```



## 我的补充

### 相关知识点

- Future 异步返回值
- 线程池
- ForkJoinPool
- Runnable、Comsumer、Supplier 函数式编程

### 思维导图

![img](./assets/1723384078278-a0222027-fd45-466d-97f8-50d23559606d.jpeg)