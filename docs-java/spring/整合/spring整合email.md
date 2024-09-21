Spring框架为发送电子邮件提供了一个有用的工具库，它使你免受底层邮件系统的影响，并负责代表客户端进行低级别的资源处理。

`org.springframework.mail` 包是 Spring 框架的电子邮件支持的根包。发送邮件的中心接口是 `MailSender` 接口。`SimpleMailMessage` 类是一个简单的值对象，它封装了简单邮件的属性，如 `from` 和 `to`（加上许多其他属性）。这个包还包含了一个检查异常的层次结构，它为低级别的邮件系统异常提供了更高层次的抽象，其根异常是 `MailException`。



`org.springframework.mail.javamail.JavaMailSender` 接口增加了专门的JavaMail功能，例如对 `MailSender` 接口（继承自该接口）的 MIME 消息支持。`JavaMailSender` 还提供了一个名为 `org.springframework.mail.javamail.MimeMessagePreparator` 的回调接口，用于准备 `MimeMessage`。



## 基本的 `MailSender` 和 `SimpleMailMessage` 用法

```java
public class SimpleOrderManager implements OrderManager {

    private MailSender mailSender;
    private SimpleMailMessage templateMessage;

    public void setMailSender(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void setTemplateMessage(SimpleMailMessage templateMessage) {
        this.templateMessage = templateMessage;
    }

    public void placeOrder(Order order) {
        SimpleMailMessage msg = new SimpleMailMessage(this.templateMessage);
        msg.setTo(order.getCustomer().getEmailAddress());
        msg.setText(
            "Dear " + order.getCustomer().getFirstName()
                + order.getCustomer().getLastName()
                + ", thank you for placing order. Your order number is "
                + order.getOrderNumber());
        try {
            this.mailSender.send(msg);
        }
        catch (MailException ex) {
            // simply log it and go on...
            System.err.println(ex.getMessage());
        }
    }

}
```



```xml
<bean id="mailSender" class="org.springframework.mail.javamail.JavaMailSenderImpl">
    <property name="host" value="mail.mycompany.example"/>
</bean>

<!-- this is a template message that we can pre-load with default state -->
<bean id="templateMessage" class="org.springframework.mail.SimpleMailMessage">
    <property name="from" value="customerservice@mycompany.example"/>
    <property name="subject" value="Your order"/>
</bean>

<bean id="orderManager" class="com.mycompany.businessapp.support.SimpleOrderManager">
    <property name="mailSender" ref="mailSender"/>
    <property name="templateMessage" ref="templateMessage"/>
</bean>
```

## 使用 `JavaMailSender` 和 `MimeMessagePreparator`

这是 `OrderManager` 的另一个实现，它使用了 `MimeMessagePreparator` 回调接口。在下面的例子中，`mailSender` 属性的类型是 `JavaMailSender`，这样我们就能使用 JavaMail 的 `MimeMessage` 类：

```java
public class SimpleOrderManager implements OrderManager {

    private JavaMailSender mailSender;

    public void setMailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void placeOrder(final Order order) {
        // Do the business calculations...
        // Call the collaborators to persist the order...

        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                mimeMessage.setRecipient(Message.RecipientType.TO,
                        new InternetAddress(order.getCustomer().getEmailAddress()));
                mimeMessage.setFrom(new InternetAddress("mail@mycompany.example"));
                mimeMessage.setText("Dear " + order.getCustomer().getFirstName() + " " +
                        order.getCustomer().getLastName() + ", thanks for your order. " +
                        "Your order number is " + order.getOrderNumber() + ".");
            }
        };

        try {
            this.mailSender.send(preparator);
        }
        catch (MailException ex) {
            // simply log it and go on...
            System.err.println(ex.getMessage());
        }
    }

}
```

## 使用 JavaMail `MimeMessageHelper`

`org.springframework.mail.javamail.MimeMessageHelper` 是一个在处理 JavaMail 消息时非常方便的类，它使你不必使用冗长的 JavaMail API。使用 `MimeMessageHelper`，创建一个 `MimeMessage` 是非常容易的，如下例所示：

```java
// of course you would use DI in any real-world cases
JavaMailSenderImpl sender = new JavaMailSenderImpl();
sender.setHost("mail.host.com");

MimeMessage message = sender.createMimeMessage();
MimeMessageHelper helper = new MimeMessageHelper(message);
helper.setTo("test@host.com");
helper.setText("Thank you for ordering!");

sender.send(message);
```

## 发送附件和内联资源

Multipart 电子邮件允许使用附件和内联资源。内联资源的例子包括你想在邮件中使用的图片或样式表，但你不希望以附件形式显示。

### 附件

下面的例子告诉你如何使用 `MimeMessageHelper` 来发送一封带有单个 JPEG 图像附件的电子邮件：

```java
JavaMailSenderImpl sender = new JavaMailSenderImpl();
sender.setHost("mail.host.com");

MimeMessage message = sender.createMimeMessage();

// use the true flag to indicate you need a multipart message
MimeMessageHelper helper = new MimeMessageHelper(message, true);
helper.setTo("test@host.com");

helper.setText("Check out this image!");

// let's attach the infamous windows Sample file (this time copied to c:/)
FileSystemResource file = new FileSystemResource(new File("c:/Sample.jpg"));
helper.addAttachment("CoolImage.jpg", file);

sender.send(message);
```

### 内联资源

下面的例子告诉你如何使用 `MimeMessageHelper` 来发送一封带有内联图像的电子邮件：

```java
JavaMailSenderImpl sender = new JavaMailSenderImpl();
sender.setHost("mail.host.com");

MimeMessage message = sender.createMimeMessage();

// use the true flag to indicate you need a multipart message
MimeMessageHelper helper = new MimeMessageHelper(message, true);
helper.setTo("test@host.com");

// use the true flag to indicate the text included is HTML
helper.setText("<html><body><img src='cid:identifier1234'></body></html>", true);

// let's include the infamous windows Sample file (this time copied to c:/)
FileSystemResource res = new FileSystemResource(new File("c:/Sample.jpg"));
helper.addInline("identifier1234", res);

sender.send(message);
```

> 内联资源是通过使用指定的 `Content-ID`（上例中的标识符 `1234`）添加到 `MimeMessage` 中。添加文本和资源的顺序是非常重要的。一定要先添加文本，然后再添加资源。如果你反其道而行之，就不会成功



## 通过使用模板库创建电子邮件内容

在前面的例子中，通过使用 `message.setText(..)` 这样的方法调用，代码明确地创建了电子邮件的内容。这对于简单的情况来说是没有问题的，在前面提到的例子中也是可以的，其目的是向你展示API的最基本内容。

不过，在你的典型企业应用中，由于一些原因，开发人员通常不会通过使用前面所示的方法来创建电子邮件的内容：

- 在Java代码中创建基于HTML的电子邮件内容是很繁琐的，而且容易出错。
- 显示逻辑和业务逻辑之间没有明确的分离。
- 改变电子邮件内容的显示结构需要编写 Java 代码，重新编译，重新部署，等等。

通常，解决这些问题的方法是使用一个模板库（如FreeMarker）来定义电子邮件内容的显示结构。这使得你的代码只负责创建要在电子邮件模板中显示的数据，并发送电子邮件。当你的邮件内容变得适度复杂时，这绝对是一个最佳实践，而且，有了Spring框架对 FreeMarker 的支持类，它变得非常容易做到。



## 常见问题

### 理解 multipart 类型

在电子邮件中，`multipart` 类型是一种MIME（Multipurpose Internet Mail Extensions）标准的实现方式，它允许邮件包含多个部分，每部分可以有不同的内容类型，如普通文本、HTML文本、图片、附件等。这样做的目的是为了让邮件客户端能够正确解析并显示复杂结构的邮件内容。`multipart` 类型的邮件通常由以下几个常见的子类型组成：

> **multipart/mixed**： 
>  这是最基本的多部分类型，用于组合不同类型的实体，特别是当邮件需要包含附件时。邮件的各部分可以自由排序，通常包括普通的文本内容以及一个或多个作为附件的二进制数据。邮件客户端会尝试识别并处理这些不同的部分。
>
> **multipart/alternative**： 
> 当邮件内容有多种表现形式（例如，纯文本和HTML版本的同一封信）时，使用此类型。邮件客户端会选择最合适的形式显示给用户，如果支持HTML，则显示HTML版本，如果不支持，则退回到纯文本版本。
>
>  **multipart/related**： 
> 当邮件中的某些部分（如HTML正文）引用了其他部分（如内嵌图片或样式表）时使用。这种类型确保引用的资源与主文档一起被视为一个整体，并且不会被单独处理或分开显示。



除了上述常见的类型外，还有如**multipart/report**等其他类型，用于特定目的，比如返回邮件投递状态报告等。

通过使用`multipart`类型，电子邮件能够更加丰富和灵活，适应不同的展示需求和接收者的环境。

### 问题：javax.mail 报错 501 mail from address must be same as authorization user 解决方法

可能原因：未设置发件人，或设置的发件人与认证的用户不符

解决方式：mailSender.setFrom("真实要发送的邮箱账户")



### 问题：Passed-in Resource contains an open stream: invalid argument. JavaMail requires an InputStreamSource that creates a fresh stream for every call.

使用 javax.mail.util.ByteArrayDataSource 构建附件信息

```java
InputStream pic1 = getClass().getClassLoader().getResourceAsStream("images/dancedog.png");
InputStream pic2 = getClass().getClassLoader().getResourceAsStream("images/dancecat.png");

// 报错的代码
// messageHelper.addAttachment("跳舞的小狗.png", new InputStreamResource(pic1));
// messageHelper.addAttachment("跳舞的小猫.png", new InputStreamResource(pic2));

// 使用 ByteArrayDataSource 构建附件
messageHelper.addAttachment("跳舞的小狗.png", new ByteArrayDataSource(pic1, "application/octet-stream"));
messageHelper.addAttachment("跳舞的小猫.png", new ByteArrayDataSource(pic2, "application/octet-stream"));
```