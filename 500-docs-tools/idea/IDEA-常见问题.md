## IDEA 打开 maven 项目没有识别加载 maven

问题：在idea中打开maven项目时, 有侧边栏没有出现maven, pom.xml文件也没有识别, 导致idea无法加载依赖包。
解决方法：右键 pom.xml 文件, 选择 「add as maven project」

### IDEA maven项目没有.iml 文件导致打开失败

IDEA中的.iml文件是项目标识文件，缺少了这个文件，IDEA就无法识别项目。跟Eclipse的.project文件性质是一样的。并且这些文件不同的设备上的内容也会有差异，所以我们在管理项目的时候，.project和.iml文件都需要忽略掉。

如果误删除了 iml 文件如何重新生成iml文件？
方式 1：点击右侧的Maven Projects，点击Reimport All Maven Projects，重新导入即可
方式 2：在缺少 `.iml` 文件项目下运行 `mvn idea:module`，完成后将自动生成 `.iml` 文件

## Thymeleaf 在IDEA中的红色波浪线问题

在File->Settings->Editor->inspections 右边找到 Thymeleaf 下的 Expression variables validation，取消勾选
https://blog.csdn.net/wifi74262580/article/details/82833017
