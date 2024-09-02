## 简述

- final 是 Java 中的一个关键字，它所表示的是“这部分是无法修改的”。
- final 关键字可以用来修饰类、方法和字段。

## 修饰类

用`final`修饰的类不能被继承。简称为 “断子绝孙类”。比如常用的 String 类就是最终类。

如果一个类不希望任何其他类继承自它，那么可以把这个类本身标记为`final`。用`final`修饰的类不能被继承：

```java
final class Person {
    protected String name;
}

// compile error: 不允许继承自Person
class Student extends Person {
}
```



`final`修饰的field必须在创建对象时初始化，随后不可修改。

## 修饰变量

对于一个类的实例字段，同样可以用`final`修饰。用`final`修饰的字段在初始化后不能被修改。

```java
class Person {
    public final String name = "Unamed";
}
```

对`final`字段重新赋值会报错：

```java
Person p = new Person();
p.name = "New Name"; // compile error!
```

可以在构造方法中初始化final字段）：

```java
class Person {
    public final String name;
    public Person(String name) {
        this.name = name;
    }
}
```

这种方法更为常用，因为可以保证实例一旦创建，其`final`字段就不可修改。



```
1. final修饰的非静态的字段, 在虚拟机为它开辟空间时必须得保证它会被显式赋值一次且只被赋值一次, 不管是在初始化块时 (代码块), 显式初始化时, 还是构造方法初始化时。
也就是说：
- 如果在在初始化块中对final修饰的字段进行了初始化, 那么就不能进行显示初始化, 也不能使用构造方法初始化。
- 如果在定义字段时就显式赋值了, 那么同理不能进行初始化块初始化和构造方法初始化
- 如果使用构造方法初始化时, 要注意必须在每一个构造器中都对final修饰的字段初始化, 不然就存在该字段可能没有赋值的可能(编译器会报错)。

2. final修饰的静态字段只能被静态初始化块或者显示初始化初始化, 同样的也只能被初始化一次.

所以并不是final修饰的字段就一定能被构造器初始化，还是要分情况的，总的来说，必须保证final字段有且仅有一次能够被初始化

总结：final修饰符的字段只能赋值一次且必须赋值
```



- 如果引用为基本数据类型，则该引用为常量，该值无法修改；

- 如果引用为引用数据类型，比如对象、数组，则该对象、数组本身可以修改，但指向该对象或数组的地址的引用不能修改。

- final修饰的变量，必须赋值(包含 初始块赋值、显式赋值和构造函数赋值)，否则编译会报错。



## 修饰方法

如果一个父类不允许子类对它的某个方法进行覆写，可以把该方法标记为`final`。用`final`修饰的方法不能被`Override`。

当使用 final 修饰方法时，这个方法将成为最终方法，无法被子类重写。但是，该方法仍然可以被继承。

```java
class Person {
    public final void say() {
        System.out.println("说....");
    }
    public void eat() {
        System.out.println("吃...");
    }
}
class Teacher extends Person {
    //1. final修饰的方法不能被重写，但此方法仍然被继承
    /*@Override
    public void say() {
        System.out.println("老师在一本正经的说...");
    }*/
    
}

public class Demo02 {
    public static void main(String[] args) {
        Teacher t = new Teacher();
        t.say();
    }    
}

```



总结：

- `final`修饰的方法可以阻止被覆写；
- `final`修饰的class可以阻止被继承；
- `final`修饰的field必须在创建对象时初始化，随后不可修改



