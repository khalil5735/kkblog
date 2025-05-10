JAVA反射机制
-------

在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为java语言的反射机制。

## Class类

Class是开启反射的源头.在Object类中定义了以下的方法，此方法将被所有子类继承：
```java
public final Class getClass();
```


以上的方法返回值的类型是一个Class类，此类是Java反射的源头，实际上所谓反射从程 序的运行结果来看也很好理解，即：可以通过对象反射求出类的名称。
![](https://cdn.nlark.com/yuque/0/2020/jpeg/1039463/1594439354288-c7774bea-3bb1-4a27-bab6-acce7fbccad8.jpeg#align=left&display=inline&height=136&margin=%5Bobject%20Object%5D&originHeight=131&originWidth=640&size=0&status=done&style=none&width=662)
### 获取Class类对象（四种方法）

（1）若已知具体的类，通过类的class属性获取，该方法最为安全可靠，程序性能最高:

```java
Class clazz = String.class;
```


（2）已知某个类的实例，调用该实例的getClass()方法获取Class对象:
```java
Person person = new Person();Class clazz = person.getClass();
```


（3）已知一个类的全类名，且该类在类路径下，可通过Class类的静态方法forName()获取，可能抛ClassNotFoundException:
```java
String className = "java.lang.String";
Class clazz = Class.forName(className);

```


（4）通过类加载器来获取:
```java
ClassLoader cl = this.getClass().getClassLoader();
Class clazz = cl.loadClass("类的全类名");
```


### 示例
```java
    public static void main(String[] args) throws IllegalAccessException, InstantiationException, ClassNotFoundException {
        //(1) 通过具体的类来实例化对象
        Class<Student> studentClass = Student.class;
        Student student = studentClass.newInstance();
        student.setName("李白");
        student.setAge(220);
        student.selfIntroduction();
        //(2) 通过类的实例化对象
        Student student1 = new Student("张飞", 22);
        Class<? extends Student> student1Class = student1.getClass();
        Student student2 = student1Class.newInstance();
        student2.selfIntroduction();

        //(3) 通过类路径（Class.forName）
        Class<Student> forName = (Class<Student>) Class.forName("com.haan.reflect.Student");
        Student student3 = forName.newInstance();
        student3.selfIntroduction();

        //(4) 通过类加载器+类路径
        ClassLoader classLoader = ClassTest.class.getClassLoader();
        Class<Student> loadClass = (Class<Student>) classLoader.loadClass("com.haan.reflect.Student");
        Student student4 = loadClass.newInstance();
        student4.selfIntroduction();
    }
```
### 调用 Class.newInstance()  创建实例

通过反射来创建新的实例，可以调用Class提供的newInstance()方法：

```java
Person p = Person.class.newInstance();
```

调用`Class.newInstance()`的局限是，它只能调用该类的public无参数构造方法。如果构造方法带有参数，或者不是public，就无法直接通过`Class.newInstance()`来调用。



## Field

### 通过 Class 实例获取字段信息

`Class`类提供了以下几个方法来获取字段：

- Field getField(name)：根据字段名获取某个public的field（包括父类）
- Field getDeclaredField(name)：根据字段名获取当前类的某个field（不包括父类）
- Field[] getFields()：获取所有public的field（包括父类）
- Field[] getDeclaredFields()：获取当前类的所有field（不包括父类）

### 获取字段基本信息

一个`Field`对象包含了一个字段的所有信息：

- `getName()`：返回字段名称，例如，`"name"`；
- `getType()`：返回字段类型，也是一个`Class`实例，例如，`String.class`；
- `getModifiers()`：返回字段的修饰符，它是一个`int`，不同的bit表示不同的含义。

### 读取设置字段值

使用`Field.get(Object)`获取指定实例的指定字段的值。注意，修改非`public`字段，存在访问限制，需要首先调用`setAccessible(true)`

通过`Field.set(Object, Object)`可以设置字段的值，其中第一个`Object`参数是指定的实例，第二个`Object`参数是待修改的值。注意，修改非`public`字段，存在访问限制，需要首先调用`setAccessible(true)`

> `setAccessible(true)`可能会失败。如果JVM运行期存在`SecurityManager`，那么它会根据规则进行检查，有可能阻止`setAccessible(true)`。例如，某个`SecurityManager`可能不允许对`java`和`javax`开头的`package`的类调用`setAccessible(true)`，这样可以保证JVM核心库的安全。



## Method

### 通过 Class 实例获取方法信息

`Class`类提供了以下几个方法来获取`Method`：

- `Method getMethod(name, Class...)`：获取某个`public`的`Method`（包括父类）
- `Method getDeclaredMethod(name, Class...)`：获取当前类的某个`Method`（不包括父类）
- `Method[] getMethods()`：获取所有`public`的`Method`（包括父类）
- `Method[] getDeclaredMethods()`：获取当前类的所有`Method`（不包括父类）



### 获取Method基本信息

一个`Method`对象包含一个方法的所有信息：

- `getName()`：返回方法名称，例如：`"getScore"`；
- `getReturnType()`：返回方法返回值类型，也是一个Class实例，例如：`String.class`；
- `getParameterTypes()`：返回方法的参数类型，是一个Class数组，例如：`{String.class, int.class}`；
- `getModifiers()`：返回方法的修饰符，它是一个`int`，不同的bit表示不同的含义。



### 执行Method调用

#### 普通方法 public

对`Method`实例调用`invoke`就相当于调用该方法，`invoke`的第一个参数是对象实例，即在哪个实例上调用该方法，后面的可变参数要与方法参数一致，否则将报错。

#### 普通方法 非 public

调用非public方法，需要通过设置`setAccessible(true)`来访问非`public`方法。

> `setAccessible(true)`可能会失败。如果JVM运行期存在`SecurityManager`，那么它会根据规则进行检查，有可能阻止`setAccessible(true)`。例如，某个`SecurityManager`可能不允许对`java`和`javax`开头的`package`的类调用`setAccessible(true)`，这样可以保证JVM核心库的安全。

#### 静态方法

如果获取到的Method表示一个静态方法，调用静态方法时，由于无需指定实例对象，所以`invoke`方法传入的第一个参数永远为`null`

### 多态

这样一种情况：一个`Person`类定义了`hello()`方法，并且它的子类`Student`也覆写了`hello()`方法，那么，从`Person.class`获取的`Method`，作用于`Student`实例时，调用的方法到底是哪个？

使用反射调用方法时，仍然遵循多态原则：即总是调用实际类型的覆写方法（如果存在）



## Constructor

可以调用Class提供的newInstance()方法来创建实例，但它只能调用该类的public无参数构造方法。如果构造方法带有参数，或者不是public，就无法直接通过`Class.newInstance()`来调用。

为了调用任意的构造方法，Java的反射API提供了`Constructor`对象，它包含一个构造方法的所有信息，可以创建一个实例。`Constructor`对象和Method非常类似，不同之处仅在于它是一个构造方法，并且，调用结果总是返回实例。



通过Class实例获取Constructor的方法如下：

- `getConstructor(Class...)`：获取某个`public`的`Constructor`；
- `getDeclaredConstructor(Class...)`：获取某个`Constructor`；
- `getConstructors()`：获取所有`public`的`Constructor`；
- `getDeclaredConstructors()`：获取所有`Constructor`。

注意`Constructor`总是当前类定义的构造方法，和父类无关，因此不存在多态的问题。



通过`Constructor`实例可以创建一个实例对象：`newInstance(Object... parameters)`； 

调用非`public`的`Constructor`时，必须首先通过`setAccessible(true)`设置允许访问。`setAccessible(true)`可能会失败。



## 继承关系

- `Class getSuperclass()`：获取父类类型；
- `Class[] getInterfaces()`：获取当前类实现的所有接口



- a.instanceof(A.class) 判断一个实例是否是某个类型时，正常情况下，使用`instanceof`操作符
- A.class.isAssignableFrom(B.class)  通过`Class`对象的`isAssignableFrom()`方法可以判断一个向上转型是否可以实现

- A.class.isInstance(obj)  判断对象obj 能不能被强转化为A



区分 instanceof 和 isInstance  [Java中instanceof和isInstance区别详解 - GreatAnt - 博客园 (cnblogs.com)](https://www.cnblogs.com/greatfish/p/6096038.html)

```java
class A {
}

class B extends A {
}

public class Test {
    public static void main(String[] args) {

        B b = new B();
        A a = new A();
        A ba = new B();
        System.out.println("1------------");
        System.out.println(b instanceof B);
        System.out.println(b instanceof A);
        System.out.println(b instanceof Object);
        System.out.println(null instanceof Object);
        System.out.println("2------------");
        System.out.println(b.getClass().isInstance(b));
        System.out.println(b.getClass().isInstance(a));
        System.out.println("3------------");
        System.out.println(a.getClass().isInstance(ba));
        System.out.println(b.getClass().isInstance(ba));
        System.out.println(b.getClass().isInstance(null));
        System.out.println("4------------");
        System.out.println(A.class.isInstance(a));
        System.out.println(A.class.isInstance(b));
        System.out.println(A.class.isInstance(ba));
        System.out.println("5------------");
        System.out.println(B.class.isInstance(a));
        System.out.println(B.class.isInstance(b));
        System.out.println(B.class.isInstance(ba));
        System.out.println("6------------");
        System.out.println(Object.class.isInstance(b));
        System.out.println(Object.class.isInstance(null));
    }
}
```

![](https://images2015.cnblogs.com/blog/966412/201611/966412-20161123232313846-1502917311.png)

## 处理注解

### 判断某个注解是否存在于 `Class`、`Field`、`Method`或`Constructor`

- Class.isAnnotationPresent(Class)
- Field.isAnnotationPresent(Class)
- Method.isAnnotationPresent(Class)
- Constructor.isAnnotationPresent(Class)

## 读取 Annotation

### 读取 `Class`、`Field`、`Method`或`Constructor` 上注解

- Class.getAnnotation(Class)
- Field.getAnnotation(Class)
- Method.getAnnotation(Class)
- Constructor.getAnnotation(Class)

直接读取`Annotation`，如果`Annotation`不存在，将返回`null`

### 读取方法参数的注解

读取方法参数的`Annotation`就比较麻烦一点，因为方法参数本身可以看成一个数组，而每个参数又可以定义多个注解，所以，一次获取方法参数的所有注解就必须用一个二维数组来表示。例如，对于以下方法定义的注解：

```java
public void hello(@NotNull @Range(max=5) String name, @NotNull String prefix) {
}
```

要读取方法参数的注解，我们先用反射获取`Method`实例，然后读取方法参数的所有注解：

```java
// 获取Method实例:
Method m = ...
// 获取所有参数的Annotation:
Annotation[][] annos = m.getParameterAnnotations();
// 第一个参数（索引为0）的所有Annotation:
Annotation[] annosOfName = annos[0];
for (Annotation anno : annosOfName) {
    if (anno instanceof Range r) { // @Range注解
        r.max();
    }
    if (anno instanceof NotNull n) { // @NotNull注解
        //
    }
}
```
