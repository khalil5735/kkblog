

原文地址：https://www.cnblogs.com/ihaveastory/p/5931278.html



java 中使用 Scanner 类实现数据输入十分简单方便，Scanner 类中 next() 与 nextLine() 都可以实现字符串 String 的获取，所以我们会纠结二者之间的区别。



其实 next() 与 nextLine() 区别很明确：



next() 方法遇见第一个有效字符（非空格，非换行符）时，开始扫描，当遇见第一个分隔符或结束符 (空格或换行符) 时，结束扫描，获取扫描到的内容，即获得第一个扫描到的不含空格、换行符的单个字符串。



使用 nextLine() 时，则可以扫描到一行内容并作为一个字符串而被获取到。



举例说明一下：



```java
 1 import java.util.Scanner;
 2 
 3 public class ScannerTest {
 4     
 5     public static void main(String[] args) {
 6         System.out.println("---->Test1:");
 7         Scanner scanner = new Scanner(System.in);
 8         String nextStr = scanner.next();
 9         System.out.println("scanner.next()得到：" + nextStr);
10         String nextlineStr = scanner.nextLine();
11         System.out.println("scanner.nextLine()得到：" + nextlineStr);
12         
13         System.out.println("\n---->Test2:");
14         String nextlineStr2 = scanner.nextLine();
15         System.out.println("scanner.next()得到：" + nextlineStr2);
16         String nextStr2 = scanner.next();
17         System.out.println("scanner.next()得到：" + nextStr2);
18     }
19 }
```