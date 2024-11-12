# Bean的生命周期回调

## Bean 生命周期机制
从Spring 2.5开始，你有三个选项来控制Bean的生命周期行为。
- InitializingBean 和 DisposableBean callback 接口。
- 自定义 init() and destroy() 方法。
- @PostConstruct 和 @PreDestroy 注解。你可以结合这些机制来控制一个特定的Bean。

## InitializingBean 和 DisposableBean callback 接口
实现Spring InitializingBean 和 DisposableBean 接口。容器为前者调用 afterPropertiesSet()，为后者调用 destroy()，让Bean在初始化和销毁你的Bean时执行某些动作
```java
public class MyBeanA implements InitializingBean, DisposableBean {

    public MyBeanA() {
        System.out.println(getClass().getSimpleName() + ">>constructor...");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>destroy...");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>afterPropertiesSet...");
    }
}
```

## JSR-250的 @PostConstruct 和 @PreDestroy
Spring 2.5中引入了对这些JRS250中注解 @PostConstruct 和 @PreDestroy 的支持，为初始化回调和销毁回调中描述的生命周期回调机制提供了一种替代方案。
- 基于注解的Bean配置，基于XML的不可以

```java
public class MyBeanB {

    public MyBeanB() {
        System.out.println(getClass().getSimpleName() + ">>constructor...");
    }

    @PostConstruct
    public void postConstruct() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>postConstruct...");
    }

    @PreDestroy
    public void preDestroy() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>preDestroy...");
    }
}
```
```java
@Configuration
public class BeanLifecycleCallbackApplication {

    @Bean
    public MyBeanB myBeanB() {
        return new MyBeanB();
    }


    public static void main(String[] args) {
//        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean-lifecycle-callback.xml");
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(BeanLifecycleCallbackApplication.class);
        System.out.println("iterate beanDefinitionName start...");
        for (String beanDefinitionName : context.getBeanDefinitionNames()) {
            System.out.println("- " + beanDefinitionName);
        }
        System.out.println("iterate beanDefinitionName end...");
        context.close();
    }
}
```


## bean 定义元数据 init-method 和 destroy-method 
在基于XML的配置元数据中，你可以使用 init-method 和 destroy-method 属性来指定具有 void 无参数签名的方法的名称。对于Java配置，你可以使用 @Bean 的 initMethod 和 deestroyMethid 属性。

- 基于注解@Bean配置
```java
public class MyBeanC {

    public MyBeanC() {
        System.out.println(getClass().getSimpleName() + ">>constructor...");
    }

    public void myInitMethod() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>myInitMethod...");
    }

    public void myDestroyMethod() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>myDestroyMethod...");
    }
}
```
```java
@Configuration
public class BeanLifecycleCallbackApplication {

    @Bean(initMethod = "myInitMethod", destroyMethod = "myInitMethod")
    public MyBeanC myBeanC() {
        return new MyBeanC();
    }


    public static void main(String[] args) {
//        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean-lifecycle-callback.xml");
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(BeanLifecycleCallbackApplication.class);
        System.out.println("iterate beanDefinitionName start...");
        for (String beanDefinitionName : context.getBeanDefinitionNames()) {
            System.out.println("- " + beanDefinitionName);
        }
        System.out.println("iterate beanDefinitionName end...");
        context.close();
    }
}
```

- 基于XML配置
```xml
<bean id="myBeanC" class="com.kui.demo_spring_core.bean_lifecycle_callback.MyBeanC" init-method="myInitMethod"
          destroy-method="myInitMethod">
</bean>
```

另外在教育XML的配置Bean元数据中，可以在 `<beans/>` 中配置defaut-init-method 和 default-destroy-method 指定默认的回调执行，如果Bean类有这样的方法，它就会在适当的时候被调用。当然也可以通过使用 `<bean/>` 本身的 init-method 和 destroy-method 属性来指定（在XML中）方法的名称，从而覆盖默认值。

```java
public class MyBeanD {

    public MyBeanD() {
        System.out.println(getClass().getSimpleName() + ">>constructor...");
    }

    public void myDestroyMethod() throws Exception {
        System.out.println(getClass().getSimpleName() + ">>myDestroyMethod...");
    }

    public void init() {
        System.out.println(getClass().getSimpleName() + ">>init...");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd"
       default-init-method="init">

    <bean id="myBeanD" class="com.kui.demo_spring_core.bean_lifecycle_callback.MyBeanD"
          destroy-method="myDestroyMethod">
    </bean>

</beans>
```


## Bean 配置多个生命周期回调的执行顺序
为同一个Bean配置的多个生命周期机制，具有不同的初始化方法，其调用方式如下。

1. 注解了 @PostConstruct 的方法。
2. afterPropertiesSet()，如 InitializingBean 回调接口所定义。
3. 一个自定义配置的 init() 方法。

销毁方法的调用顺序是一样的。

1. 注解了 @PreDestroy 的方法。
2. destroy()，正如 DisposableBean 回调接口所定义的那样。
3. 一个自定义配置的 destroy() 方法。

> NOTE：    
如果为一个bean配置了多个生命周期机制，并且每个机制都配置了不同的方法名称，那么每个配置的方法都会按照本说明后面列出的顺序运行。然而，如果同一方法名称被配置—​例如，init() 为一个初始化方法—​用于多个这些生命周期机制，则该方法将被运行一次