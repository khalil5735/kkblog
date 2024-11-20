## ThreadLocal 为什么存在？

变量值的共享可以使用public static 的形式，但每个线程都可以进行访问。**如何实现每一个线程内的变量共享？**

**使用 ThreadLocal** 

类ThreadLocal主要解决的就是每个线程绑定自己的值，可以将ThreadLocal类比喻成全局存放数据的盒子，盒子中可以存储每个线程的私有数据。

## 设置值与取值

```java
// 赋值
public void set(T value);

// 取值，无值时返回null
public T get();
```

## 验证线程变量的隔离性

```java
package com.hanliukui.example.threadlocaltest;

/**
 * @Author hanliukui
 * @Date 2022/4/4 15:22
 * @Description xxx
 */
public class Main {

    static ThreadLocal<String> local = new ThreadLocal();

    public static void main(String[] args) {
        Thread threadA = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    local.set("ThreadA"+i);
                    System.out.println("ThreadA获取值："+local.get());
                }
            }
        });

        Thread threadB = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    local.set("ThreadB"+i);
                    System.out.println("ThreadB获取值："+local.get());
                }
            }
        });

        threadA.start();
        threadB.start();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

ThreadB获取值：ThreadB0

ThreadA获取值：ThreadA0

ThreadB获取值：ThreadB1

ThreadA获取值：ThreadA1

ThreadB获取值：ThreadB2

ThreadB获取值：ThreadB3

ThreadB获取值：ThreadB4

ThreadB获取值：ThreadB5

ThreadA获取值：ThreadA2

ThreadB获取值：ThreadB6

ThreadA获取值：ThreadA3

ThreadB获取值：ThreadB7

ThreadB获取值：ThreadB8

ThreadA获取值：ThreadA4

ThreadB获取值：ThreadB9

ThreadA获取值：ThreadA5

ThreadA获取值：ThreadA6

ThreadA获取值：ThreadA7

ThreadA获取值：ThreadA8

ThreadA获取值：ThreadA9



## 解决get()返回null的问题

创建子类重写 ThreadLocal 的 initialValue() 方法；

```java
protected T initialValue() {
    return null;
}
```