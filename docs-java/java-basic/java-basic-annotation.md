## 注解概述
### 什么是注解
什么是注解（Annotation）？注解是放在Java源码的类、方法、字段、参数前的一种用作标注的“元数据”。

### 注解的作用
从JVM的角度看，注解本身对代码逻辑没有任何影响，如何使用注解完全由工具决定。

Java的注解可以分为三类：

第一类是由编译器使用的注解，例如：

+ `@Override`：让编译器检查该方法是否正确地实现了覆写；
+ `@SuppressWarnings`：告诉编译器忽略此处代码产生的警告。

这类注解不会被编译进入`.class`文件，它们在编译后就被编译器扔掉了。



第二类是由工具处理`.class`文件使用的注解，比如有些工具会在加载`class`的时候，对`class`做动态修改，实现一些特殊的功能。这类注解会被编译进入`.class`文件，但加载结束后并不会存在于内存中。这类注解只被一些底层库使用，一般我们不必自己处理。



第三类是在程序运行期能够读取的注解，它们在加载后一直存在于JVM中，这也是最常用的注解。例如，一个配置了`@PostConstruct`的方法会在调用构造方法后自动被调用（这是Java代码读取该注解实现的功能，JVM并不会识别该注解）。



## 定义注解
Java语言使用@interface语法来定义注解（Annotation），它的格式如下：

```java
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

注解的参数类似无参数方法，可以用default设定一个默认值（强烈推荐）。最常用的参数应当命名为value。

### 注解的参数
定义一个注解时，还可以定义配置参数。配置参数可以包括：

+ 所有基本类型；
+ String；
+ 枚举类型；
+ 基本类型、String、Class以及枚举的数组。

因为配置参数必须是常量，所以，上述限制保证了注解在定义时就已经确定了每个参数的值。

注解的配置参数可以有默认值，缺少某个配置参数时将使用默认值。

此外，大部分注解会有一个名为`value`的配置参数，对此参数赋值，可以只写常量，相当于省略了`value`参数。如果只写注解，相当于全部使用默认值。



举个栗子，对以下代码：

```java
public class Hello {
    @Check(min=0, max=100, value=55)
    public int n;

    @Check(value=99)
    public int p;

    @Check(99) // @Check(value=99)
    public int x;

    @Check
    public int y;
}
```

`@Check`就是一个注解。第一个`@Check(min=0, max=100, value=55)`明确定义了三个参数，第二个`@Check(value=99)`只定义了一个`value`参数，它实际上和`@Check(99)`是完全一样的。最后一个`@Check`表示所有参数都使用默认值。



### 元注解
有一些注解可以修饰其他注解，这些注解就称为元注解（meta annotation）。Java标准库已经定义了一些元注解，我们只需要使用元注解，通常不需要自己去编写元注解。



#### @Target
最常用的元注解是`@Target`。使用`@Target`可以定义`Annotation`能够被应用于源码的哪些位置：

+ 类或接口：`ElementType.TYPE`；
+ 字段：`ElementType.FIELD`；
+ 方法：`ElementType.METHOD`；
+ 构造方法：`ElementType.CONSTRUCTOR`；
+ 方法参数：`ElementType.PARAMETER`。

例如，定义注解`@Report`可用在方法上，我们必须添加一个`@Target(ElementType.METHOD)`:

```java
@Target(ElementType.METHOD)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

定义注解`@Report`可用在方法或字段上，可以把`@Target`注解参数变为数组`{ ElementType.METHOD, ElementType.FIELD }`：

```java
@Target({
    ElementType.METHOD,
    ElementType.FIELD
})
public @interface Report {
    ...
}
```

实际上`@Target`定义的`value`是`ElementType[]`数组，只有一个元素时，可以省略数组的写法。

#### @Retention
另一个重要的元注解`@Retention`定义了`Annotation`的生命周期：

+ 仅编译期：`RetentionPolicy.SOURCE`；
+ 仅class文件：`RetentionPolicy.CLASS`；
+ 运行期：`RetentionPolicy.RUNTIME`。

如果`@Retention`不存在，则该`Annotation`默认为`CLASS`。因为通常我们自定义的`Annotation`都是`RUNTIME`，所以，务必要加上`@Retention(RetentionPolicy.RUNTIME)`这个元注解：

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

#### @Repeatable
使用`@Repeatable`这个元注解可以定义`Annotation`是否可重复。这个注解应用不是特别广泛。

```java
@Repeatable(Reports.class)
@Target(ElementType.TYPE)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}

@Target(ElementType.TYPE)
public @interface Reports {
    Report[] value();
}
```

经过`@Repeatable`修饰后，在某个类型声明处，就可以添加多个`@Report`注解：

```java
@Report(type=1, level="debug")
@Report(type=2, level="warning")
public class Hello {
}
```

#### @Inherited
使用`@Inherited`定义子类是否可继承父类定义的`Annotation`。`@Inherited`仅针对`@Target(ElementType.TYPE)`类型的`annotation`有效，并且仅针对`class`的继承，对`interface`的继承无效：

```java
@Inherited
@Target(ElementType.TYPE)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

在使用的时候，如果一个类用到了`@Report`：

```java
@Report(type=1)
public class Person {
}
```

则它的子类默认也定义了该注解：

```java
public class Student extends Person {
}
```

### 如何定义Annotation
我们总结一下定义`Annotation`的步骤：

第一步，用@interface定义注解：

```java
public @interface Report { } 
```

第二步，添加参数、默认值：

```java
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

把最常用的参数定义为`value()`，推荐所有参数都尽量设置默认值。

第三步，用元注解配置注解：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

其中，必须设置`@Target`和`@Retention`，`@Retention`一般设置为`RUNTIME`，因为我们自定义的注解通常要求在运行期读取。一般情况下，不必写`@Inherited`和`@Repeatable`。

## 处理注解
如何使用注解完全由工具决定。`SOURCE`类型的注解主要由编译器使用，因此我们一般只使用，不编写。`CLASS`类型的注解主要由底层工具库使用，涉及到`class`的加载，一般我们很少用到。只有`RUNTIME`类型的注解不但要使用，还经常需要编写。以下示例如何读取`RUNTIME`类型的注解。



因为注解定义后也是一种`class`，所有的注解都继承自`java.lang.annotation.Annotation`，因此，读取注解，需要使用反射API。



Java提供的使用反射API读取`Annotation`的方法包括：

1. 判断某个注解是否存在于`Class`、`Field`、`Method`或`Constructor`：
+ `Class.isAnnotationPresent(Class)`
+ `Field.isAnnotationPresent(Class)`
+ `Method.isAnnotationPresent(Class)`
+ `Constructor.isAnnotationPresent(Class)`



2. 使用反射API读取`Annotation`：
+ `Class.getAnnotation(Class)`
+ `Field.getAnnotation(Class)`
+ `Method.getAnnotation(Class)`
+ `Constructor.getAnnotation(Class)`



读取Class的注解：

```java
//Class cls = Person.class;
//if (cls.isAnnotationPresent(Report.class)) {
//    Report report = cls.getAnnotation(Report.class);
//    ...
//}

Class cls = Person.class;
Report report = cls.getAnnotation(Report.class);
if (report != null) {
   ...
}
```

读取方法、字段和构造方法的`Annotation`和`Class`类似。但要读取方法参数的`Annotation`就比较麻烦一点，因为方法参数本身可以看成一个数组，而每个参数又可以定义多个注解，所以，一次获取方法参数的所有注解就必须用一个二维数组来表示。例如，对于以下方法定义的注解：

```java
// 获取Method实例:
Method m = ...
// 获取所有参数的Annotation:
Annotation[][] annos = m.getParameterAnnotations();
// 第一个参数（索引为0）的所有Annotation:
Annotation[] annosOfName = annos[0];
for (Annotation anno : annosOfName) {
    if (anno instanceof Range) { // @Range注解
        Range r = (Range) anno;
    }
    if (anno instanceof NotNull) { // @NotNull注解
        NotNull n = (NotNull) anno;
    }
}
```

### 测试
定义注解：

```java
package com.hanliukui.annotationtest;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Author hanliukui
 * @Date 2022/5/5 17:04
 * @Description xxx
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ClassAnnotation {
    String value() default "";
}

```

```java
package com.hanliukui.annotationtest;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Author hanliukui
 * @Date 2022/5/5 16:43
 * @Description xxx
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface FieldAnnotation {

    int min() default 1;

    int max() default 999;

}

```

```java
package com.hanliukui.annotationtest;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Author hanliukui
 * @Date 2022/5/5 17:04
 * @Description xxx
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface ParamAnnotationNotNull {
    boolean value() default false;
}

```

在类上使用注解：

```java
package com.hanliukui.annotationtest;

/**
 * @Author hanliukui
 * @Date 2022/5/5 16:58
 * @Description xxx
 */
@ClassAnnotation("aaa")
public class AppInfo {

    @FieldAnnotation(min = 3,max = 888)
    private Integer price;

    AppInfo(Integer price){
        this.price = price;
    }

    public void sale(@ParamAnnotationNotNull(value = true) String username){
        System.out.println(username+"1111");
    }


}

```

测试：

```java
package com.hanliukui.annotationtest;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * @Author hanliukui
 * @Date 2022/5/5 16:43
 * @Description xxx
 */
public class AnnotationTest {
    public static void main(String[] args) {

        AppInfo appInfo = new AppInfo(20);

        Class<? extends AppInfo> aClass = appInfo.getClass();
        Field[] fields = aClass.getDeclaredFields();

        for (Field f:fields){
            FieldAnnotation fieldAnnotation = f.getAnnotation(FieldAnnotation.class);
            if (fieldAnnotation !=null){
                int max = fieldAnnotation.max();
                int min = fieldAnnotation.min();
                System.out.println("max="+max);
                System.out.println("min="+min);
            }
        }

        ClassAnnotation classAnnotation = aClass.getAnnotation(ClassAnnotation.class);
        System.out.println(classAnnotation.value());

        Method[] methods = aClass.getDeclaredMethods();
        for (Method method:methods){
            Annotation[][] parameterAnnotations = method.getParameterAnnotations();
            for (Annotation[] annotations:parameterAnnotations){
                for (Annotation annotation:annotations){
                    if (annotation instanceof ParamAnnotationNotNull){
                        ParamAnnotationNotNull annotationNotNull = (ParamAnnotationNotNull) annotation;
                        System.out.println(annotationNotNull.value());
                    }
                }
            }
        }
    }
}

// max=888
// min=3
// aaa
// true
```

