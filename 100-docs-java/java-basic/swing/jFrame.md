## JFrame 居中显示

场景: 在利用 JAVA 的 Swing 开发 C/S 架构 的前端界面

目的: 想让 JFrame 居中显示在整个 屏幕的正中位置

```java
// 方法一:
JFrame frame = new JFrame("TEST");

frame.setSize(200,100);

Toolkit toolkit = Toolkit.getDefaultToolkit();

int x = (int)(toolkit.getScreenSize().getWidth()-f.getWidth())/2;

int y = (int)(toolkit.getScreenSize().getHeight()-f.getHeight())/2;

frame.setLocation(x, y);
```

```java
// 方法二:
JFrame frame = new JFrame("TEST");

frame.setSize(200,100);

frame.setLocationRelativeTo(null);

//传入参数null 即可让JFrame 位于屏幕中央, 这个函数若传入一个Component ,则JFrame位于该组件的中央
```
