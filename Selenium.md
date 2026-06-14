## Java 依赖
https://central.sonatype.com/artifact/org.seleniumhq.selenium/selenium-java

```xml
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.25.0</version>
</dependency>
```

## 八个基本组成部分

### 使用驱动开启实例会话
```java
 WebDriver driver = new ChromeDriver();
```

### 在浏览器上执行操作

### 请求浏览器信息
请求一系列关于浏览器的信息 , 包括窗口句柄、浏览器尺寸/位置、cookie、警报等.

### 建立等待策略
将代码与浏览器的当前状态同步 是Selenium面临的最大挑战之一, 做好它是一个高级主题.

基本上, 您希望在尝试定位元素之前, 确保该元素位于页面上, 并且在尝试与该元素交互之前, 该元素处于可交互状态.

### 发送命令查找元素
大多数Selenium会话中的主要命令都与元素相关, 如果不先找到元素, 就无法与之交互.

### 操作元素

### 获取元素信息

### 结束会话





## 驱动
### 使用 Microsoft Edge

### Initialize Edge Driver in Java with Selenium

下载驱动，注意与自己本机的Edge版本一致 
https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.edge.EdgeDriver;

public class EdgeDriverTest {
	public static void main(String[] args) {
		// Set the path to the Edge WebDriver executable
		System.setProperty("webdriver.edge.driver", "path/to/msedgedriver.exe");
		
		// Initialize the Edge WebDriver
		WebDriver driver = new EdgeDriver();
		
		// Open a website
		driver.get("https://www.example.com");
		
		// Maximize the browser window
		driver.manage().window().maximize();
		
		// Close the browser
		driver.quit();
	}
}
```


## 等待策略
