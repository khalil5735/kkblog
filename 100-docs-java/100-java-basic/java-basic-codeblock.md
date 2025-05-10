

[TOC]

## 局部代码块
局部代码块是定义在方法或语句中
demo：
```java
public class BlockDemo {
	public static void main(String[] args) {
		
		//局部代码块：存在于方法中，控制变量的生命周期（作用域）
		 {
			for(int x = 0;x < 10;x++) {
				System.out.println("我爱Java");
			}
			int num = 10;
		}
		//System.out.println(num);//无法访问num,超出num的作用域范围
 
	}
}

```
## 构造代码块
构造代码块是定义在类中成员位置的代码块
demo:
```java
package com.itheima_04;
class Teacher {
	String name;
	int age;
	
    // 构造代码块
	{
		for(int x = 0;x < 10;x++) {
			System.out.println("我爱Java");
		}
		System.out.println("我爱Java");
	} 
	
	
	public Teacher() {
		System.out.println("我是无参空构造");
	}
	
	public Teacher(String name,int age) {
		System.out.println("我是有参构造");
		
		this.name = name;
		this.age = age;
	}
	
	
}


```
## 静态代码块
静态代码块是定义在成员位置，使用static修饰的代码块
demo:
```java
class Teacher {
	String name;
	int age;
 
	//静态代码块：随着类的加载而加载，只加载一次，加载类时需要做的一些初始化，比如加载驱动
	static {
		System.out.println("我爱Java");
	}
	
	public Teacher() {
		System.out.println("我是无参空构造");
	}
	
	public Teacher(String name,int age) {
		System.out.println("我是有参构造");
		
		this.name = name;
		this.age = age;
	}
	
	
}

```
## 每种代码块特点
### 局部代码块:
以”{}”划定的代码区域，此时只需要关注作用域的不同即可
方法和类都是以代码块的方式划定边界的
### 构造代码块
优先于构造方法执行，构造代码块用于执行所有对象均需要的初始化动作
每创建一个对象均会执行一次构造代码块。
### 静态代码块
它优先于主方法执行、优先于构造代码块执行，当以任意形式第一次使用到该类时执行。
该类不管创建多少对象，静态代码块只执行一次。
可用于给静态变量赋值，用来给类进行初始化。


### 执行顺序
```java
package com.itheima_04;

/* 
 *   BlockTest静态代码块执行 --- BlockTest的主函数执行了 --- Coder静态代码块执行 --- Coder构造代码块执行 --- Coder无参空构造执行
 *   Coder构造代码块执行 --- Coder无参空构造执行
 * 
 */
public class BlockTest {
	static {
		System.out.println("BlockTest静态代码块执行");
	}
	
	{
		System.out.println("BlockTest构造代码块执行");
	}
	

	public BlockTest(){
		System.out.println("BlockTest无参构造执行了");
	}
	
	public static void main(String[] args) {
		System.out.println("BlockTest的主函数执行了");
		Coder c = new Coder();
		Coder c2 = new Coder();
	}
}

class Coder {
	
	static {
		System.out.println("Coder静态代码块执行");
	}
	
	{
		System.out.println("Coder构造代码块执行");
	}
	
	public Coder() {
		System.out.println("Coder无参空构造执行");
	}	
	
}

```
```java
BlockTest静态代码块执行
BlockTest的主函数执行了
Coder静态代码块执行
Coder构造代码块执行
Coder无参空构造执行
Coder构造代码块执行
Coder无参空构造执行
```
## JAVA中静态块、静态变量加载顺序
如果类是第一次加载：

1. 先执行父类的静态代码块和静态变量初始化，并且静态代码块和静态变量的执行顺序只跟代码中出现的顺序有关。
1. 执行子类的静态代码块和静态变量初始化。 并且静态代码块和静态变量的执行顺序只跟代码中出现的顺序有关。
1. 执行父类的代码块
1. 执行父类的实例变量初始化 。
1. 执行父类的构造函数
1. 执行子类的代码块
1. 执行子类的实例变量初始化
1. 执行子类的构造函数
1. 如果类已经被加载：



**则静态代码块和静态变量就不用重复执行，再创建类对象时，只执行与实例相关的代码块、变量初始化和构造方法。**
**
### demo
```java
public class Parent {

    static {
        System.out.println("parent 执行static代码块！");
    }

    {
        System.out.println("parent 执行局部代码块！");
    }

    public Parent(){
        System.out.println("parent 执行构造函数！");
    }
}

public class Child  extends Parent{

    static {
        System.out.println("child 执行static代码块！");
    }

    {
        System.out.println("child 执行局部代码块！");
    }

    public Child(){
        System.out.println("child 执行构造函数！");
    }

}

public class Main {

    public static void main(String[] args) {
	// write your code here
        Child child1 = new Child();

        Child child2 = new Child();
    }
}

```


> parent 执行static代码块！

> child 执行static代码块！

> parent 执行局部代码块！

> parent 执行构造函数！

> child 执行局部代码块！

> child 执行构造函数！

> parent 执行局部代码块！

> parent 执行构造函数！

> child 执行局部代码块！

> child 执行构造函数！

