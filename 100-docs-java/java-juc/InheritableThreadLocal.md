## **InheritableThreadLocal可以做什么**

我们知道ThreadLocal解决的是让每个线程读取的ThreadLocal变量是相互独立的。通俗的讲就是，比如我再线程1中set了ThreadLocal的值，那我在线程2中是get不到线程1设置的值的，只能读到线程2自己set的值。

ThreadLocal有一个需求不能满足：就是子线程无法直接复用父线程的ThreadLocal变量里的内容。



## InheritableThreadLocal 使用

InheritableThreadLocal 是ThreadLocal 的子类，在ThreadLocal 基础上可以让子线程从父线程中取得值。但是有一点需要注意：如果子线程创建后，主线程将值进行更改，那么子线程取得的值还是旧值。

```java
package com.hanliukui.example.threadlocaltest;

/**
 * @Author hanliukui
 * @Date 2022/4/4 15:22
 * @Description xxx
 */
public class Main {

    static ThreadLocal<String> local = new InheritableThreadLocal<>();

    public static void main(String[] args) {
        local.set("MainA");

        Thread threadA = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    System.out.println("ThreadA获取值："+local.get());
                }
            }
        });

        Thread threadB = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    System.out.println("ThreadB获取值："+local.get());
                }
            }
        });

        threadA.start();
        threadB.start();

        // 父线程改变值
        local.set("MainB");
        System.out.println("Main获取值："+local.get());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

Main获取值：MainB

ThreadB获取值：MainA

ThreadA获取值：MainA

ThreadB获取值：MainA

ThreadA获取值：MainA

ThreadB获取值：MainA

ThreadA获取值：MainA

ThreadB获取值：MainA

ThreadA获取值：MainA

ThreadA获取值：MainA

ThreadA获取值：MainA

ThreadA获取值：MainA

ThreadA获取值：MainA

ThreadB获取值：MainA

ThreadA获取值：MainA

ThreadB获取值：MainA

ThreadA获取值：MainA

ThreadB获取值：MainA

ThreadB获取值：MainA

ThreadB获取值：MainA

ThreadB获取值：MainA



Process finished with exit code 0



### InheritableThreadLocal 原理



InheritableThreadLocal 其实就是重写ThreadLocal 的3个方法。

```java
public class InheritableThreadLocal<T> extends ThreadLocal<T> {
    protected T childValue(T parentValue) {
        return parentValue;
    }
    ThreadLocalMap getMap(Thread t) {
       return t.inheritableThreadLocals;
    }
    void createMap(Thread t, T firstValue) {
        t.inheritableThreadLocals = new ThreadLocalMap(this, firstValue);
    }
}
```



首先，当我们调用 get 方法的时候，由于子类没有重写，所以我们调用了父类的 get 方法：

```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```

这里会有一个`getMap(t) `  方法，所以就会得到这个线程 threadlocals。 但是，由于子类 InheritableThreadLocal 重写了 getMap()方法，再看上述代码，我们可以看到：其实不是得到 threadlocals，而是得到 inheritableThreadLocals。



inheritableThreadLocals 之前一直没提及过，其实它也是 Thread 类的一个 ThreadLocalMap 类型的 属性，如下 Thread 类的部分代码：

```java
ThreadLocal.ThreadLocalMap threadLocals = null;
ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;
```

那么，这里看 InheritableThreadLocal 重写的方法，感觉 inheritableThreadLocals 和 threadLocals 几乎是一模一样的作用，只是换了个名字而且，那么究竟为什么在新的线程中通过 `threadlocal.get() `方法还能得到值呢？



当 我们 new 一个 线程的时候：

```java
public Thread() {
    init(null, null, "Thread-" + nextThreadNum(), 0);
}
```

然后：

```java
private void init(ThreadGroup g, Runnable target, String name,
                      long stackSize) {
    init(g, target, name, stackSize, null);
}
```

然后：

```java
private void init(ThreadGroup g, Runnable target, String name,
                      long stackSize, AccessControlContext acc) {
    ......
    Thread parent = currentThread();
    ......
    if (parent.inheritableThreadLocals != null)
        this.inheritableThreadLocals =
            ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
    ......
    }
```

这时候有一句 'ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);' ，然后:

```java
static ThreadLocalMap createInheritedMap(ThreadLocalMap parentMap) {
    return new ThreadLocalMap(parentMap);
}

private ThreadLocalMap(ThreadLocalMap parentMap) {
    Entry[] parentTable = parentMap.table;
    int len = parentTable.length;
    setThreshold(len);
    table = new Entry[len];
 
    for (int j = 0; j < len; j++) {
        Entry e = parentTable[j];
        if (e != null) {
            @SuppressWarnings("unchecked")
            ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
            if (key != null) {
                Object value = key.childValue(e.value);
                Entry c = new Entry(key, value);
                int h = key.threadLocalHashCode & (len - 1);
                while (table[h] != null)
                    h = nextIndex(h, len);
                    table[h] = c;
                    size++;
                }
            }
        }
    }
```

当我们创建一个新的线程的时候X，X线程就会有 ThreadLocalMap 类型的 inheritableThreadLocals ，因为它是 Thread 类的一个属性。然后先得到当前线程存储的这些值，例如 `Entry[] parentTable = parentMap.table; `。再通过一个 for 循环，不断的把当前线程的这些值复制到我们新创建的线程X 的inheritableThreadLocals 中。就这样，就ok了。