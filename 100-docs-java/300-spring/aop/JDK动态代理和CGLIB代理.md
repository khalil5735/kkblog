# JDK动态代理和CGLIB代理

> 原文地址 [itsoku.com](http://itsoku.com/course/11/112)


说的简单点，spring 中的 aop 就是依靠代理实现的各种功能，通过代理来对 bean 进行增强。

spring 中的 aop 功能主要是通过 2 种代理来实现的

1.  jdk 动态代理
2.  cglib 代理

继续向下之前，必须先看一下这篇文章：[Spring 系列第 15 篇：代理详解（Java 动态代理 & cglib 代理）？](http://itsoku.com/course/5/97)

spring aop 中用到了更多的一些特性，上面这边文章中没有介绍到，所以通过本文来做一个补充，这 2 篇文章看过之后，再去看 spring aop 的源码，理解起来会容易一些，这 2 篇算是最基础的知识，所以一定要消化理解，不然 aop 那块的原理你很难了解，会晕车，

jdk 动态代理
--------

### 特征

1.  只能为接口创建代理对象
2.  创建出来的代理都是 java.lang.reflect.Proxy 的子类

### 案例

案例源码位置：

```
com.javacode2018.aop.demo1.JdkAopTest1
```

有 2 个接口

```
interface IService1 {
    void m1();
}
interface IService2 {
    void m2();
}

```

下面的类实现了上面 2 个接口

```
public static class Service implements IService1, IService2 {
    @Override
    public void m1() {
        System.out.println("我是m1");
    }
    @Override
    public void m2() {
        System.out.println("我是m2");
    }
}

```

下面通过 jdk 动态代理创建一个代理对象，实现上面定义的 2 个接口，将代理对象所有的请求转发给 Service 去处理，需要在代理中统计 2 个接口中所有方法的耗时。

比较简单，自定义一个 InvocationHandler

```
public static class CostTimeInvocationHandler implements InvocationHandler {
    private Object target;
    public CostTimeInvocationHandler(Object target) {
        this.target = target;
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        long startime = System.nanoTime();
        Object result = method.invoke(this.target, args); //将请求转发给target去处理
        System.out.println(method + "，耗时(纳秒):" + (System.nanoTime() - startime));
        return result;
    }
}

```

测试方法

```
{
    Service target = new Service();
    CostTimeInvocationHandler costTimeInvocationHandler = new CostTimeInvocationHandler(target);
    //创建代理对象
    Object proxyObject = Proxy.newProxyInstance(
            target.getClass().getClassLoader(),
            new Class[]{IService1.class, IService2.class}, //创建的代理对象实现了2个接口
            costTimeInvocationHandler);
    //判断代理对象是否是Service类型的，肯定是false咯
    System.out.println(String.format("proxyObject instanceof Service = %s", proxyObject instanceof Service));
    //判断代理对象是否是IService1类型的，肯定是true
    System.out.println(String.format("proxyObject instanceof IService1 = %s", proxyObject instanceof IService1));
    //判断代理对象是否是IService2类型的，肯定是true
    System.out.println(String.format("proxyObject instanceof IService2 = %s", proxyObject instanceof IService2));
    //将代理转换为IService1类型
    IService1 service1 = (IService1) proxyObject;
    //调用IService2的m1方法
    service1.m1();
    //将代理转换为IService2类型
    IService2 service2 = (IService2) proxyObject;
    //调用IService2的m2方法
    service2.m2();
    //输出代理的类型
    System.out.println("代理对象的类型:" + proxyObject.getClass());
}

```

运行输出

```
proxyObject instanceof Service = false
proxyObject instanceof IService1 = true
proxyObject instanceof IService2 = true
我是m1
public abstract void com.javacode2018.aop.demo1.JdkAopTest1$IService1.m1()，耗时(纳秒):225600
我是m2
public abstract void com.javacode2018.aop.demo1.JdkAopTest1$IService2.m2()，耗时(纳秒):36000
代理对象的类型:class com.javacode2018.aop.demo1.$Proxy0

```

m1 方法和 m2 方法被`CostTimeInvocationHandler#invoke`给增强了，调用目标方法的过程中统计了耗时。

最后一行输出可以看出代理对象的类型，类名中包含了`$Proxy`的字样，所以以后注意，看到这种字样的，基本上都是通过 jdk 动态代理创建的代理对象。

下面来说 cglib 代理的一些特殊案例。

cglib 代理
--------

### cglib 的特点

1.  cglib 弥补了 jdk 动态代理的不足，jdk 动态代理只能为接口创建代理，而 cglib 非常强大，不管是接口还是类，都可以使用 cglib 来创建代理
2.  cglib 创建代理的过程，相当于创建了一个新的类，可以通过 cglib 来配置这个新的类需要实现的接口，以及需要继承的父类
3.  cglib 可以为类创建代理，但是这个类不能是 final 类型的，cglib 为类创建代理的过程，实际上为通过继承来实现的，相当于给需要被代理的类创建了一个子类，然后会重写父类中的方法，来进行增强，继承的特性大家应该都知道，final 修饰的类是不能被继承的，final 修饰的方法不能被重写，static 修饰的方法也不能被重写，private 修饰的方法也不能被子类重写，而其他类型的方法都可以被子类重写，被重写的这些方法可以通过 cglib 进行拦截增强

### cglib 整个过程如下

1.  Cglib 根据父类, Callback, Filter 及一些相关信息生成 key
2.  然后根据 key 生成对应的子类的二进制表现形式
3.  使用 ClassLoader 装载对应的二进制, 生成 Class 对象, 并缓存
4.  最后实例化 Class 对象, 并缓存

### 案例 1：为多个接口创建代理

代码比较简单，定义了 2 个接口，然后通过 cglib 来创建一个代理类，代理类会实现这 2 个接口，通过 setCallback 来对 2 个接口的方法进行增强。

```
public class CglibTest1 {
    interface IService1 {
        void m1();
    }
    interface IService2 {
        void m2();
    }
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        //设置代理对象需要实现的接口
        enhancer.setInterfaces(new Class[]{IService1.class, IService2.class});
        //通过Callback来对被代理方法进行增强
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                System.out.println("方法：" + method.getName());
                return null;
            }
        });
        Object proxy = enhancer.create();
        if (proxy instanceof IService1) {
            ((IService1) proxy).m1();
        }
        if (proxy instanceof IService2) {
            ((IService2) proxy).m2();
        }
        //看一下代理对象的类型
        System.out.println(proxy.getClass());
        //看一下代理类实现的接口
        System.out.println("创建代理类实现的接口如下：");
        for (Class<?> cs : proxy.getClass().getInterfaces()) {
            System.out.println(cs);
        }
    }
}

```

运行输出

```
方法：m1
方法：m2
class com.javacode2018.aop.demo2.CglibTest1$IService1$$EnhancerByCGLIB$$1d32a82
创建代理类实现的接口如下：
interface com.javacode2018.aop.demo2.CglibTest1$IService1
interface com.javacode2018.aop.demo2.CglibTest1$IService2
interface org.springframework.cglib.proxy.Factory

```

上面创建的代理类相当于下面代码

```
public class CglibTest1$IService1$$EnhancerByCGLIB$$1d32a82 implements IService1, IService2 {
    @Override
    public void m1() {
        System.out.println("方法：m1");
    }
    @Override
    public void m2() {
        System.out.println("方法：m2");
    }
}

```

### 案例 2：为类和接口同时创建代理

下面定义了 2 个接口：IService1 和 IService2，2 个接口有个实现类：Service，然后通过 cglib 创建了个代理类，实现了这 2 个接口，并且将 Service 类作为代理类的父类。

```
public class CglibTest2 {
    interface IService1 {
        void m1();
    }
    interface IService2 {
        void m2();
    }
    public static class Service implements IService1, IService2 {
        @Override
        public void m1() {
            System.out.println("m1");
        }
        @Override
        public void m2() {
            System.out.println("m2");
        }
    }
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        //设置代理类的父类
        enhancer.setSuperclass(Service.class);
        //设置代理对象需要实现的接口
        enhancer.setInterfaces(new Class[]{IService1.class, IService2.class});
        //通过Callback来对被代理方法进行增强
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                long startime = System.nanoTime();
                Object result = methodProxy.invokeSuper(o, objects); //调用父类中的方法
                System.out.println(method + "，耗时(纳秒):" + (System.nanoTime() - startime));
                return result;
            }
        });
        //创建代理对象
        Object proxy = enhancer.create();
        //判断代理对象是否是Service类型的
        System.out.println("proxy instanceof Service" + (proxy instanceof Service));
        if (proxy instanceof Service) {
            Service service = (Service) proxy;
            service.m1();
            service.m2();
        }
        //看一下代理对象的类型
        System.out.println(proxy.getClass());
        //输出代理对象的父类
        System.out.println("代理类的父类：" + proxy.getClass().getSuperclass());
        //看一下代理类实现的接口
        System.out.println("创建代理类实现的接口如下：");
        for (Class<?> cs : proxy.getClass().getInterfaces()) {
            System.out.println(cs);
        }
    }
}

```

运行输出

```
proxy instanceof Servicetrue
m1
public void com.javacode2018.aop.demo2.CglibTest2$Service.m1()，耗时(纳秒):14219700
m2
public void com.javacode2018.aop.demo2.CglibTest2$Service.m2()，耗时(纳秒):62800
class com.javacode2018.aop.demo2.CglibTest2$Service$$EnhancerByCGLIB$$80494536
代理类的父类：class com.javacode2018.aop.demo2.CglibTest2$Service
创建代理类实现的接口如下：
interface com.javacode2018.aop.demo2.CglibTest2$IService1
interface com.javacode2018.aop.demo2.CglibTest2$IService2
interface org.springframework.cglib.proxy.Factory

```

输出中可以代理对象的类型是：

```
class com.javacode2018.aop.demo2.CglibTest2$Service$$EnhancerByCGLIB$$80494536
```

带有`EnhancerByCGLIB`字样的，在调试 spring 的过程中，发现有这样字样的，基本上都是 cglib 创建的代理对象。

上面创建的代理类相当于下面代码

```
public class CglibTest2$Service$$EnhancerByCGLIB$$80494536 extends Service implements IService1, IService2 {
    @Override
    public void m1() {
        long starttime = System.nanoTime();
        super.m1();
        System.out.println("方法m1，耗时(纳秒):" + (System.nanoTime() - starttime));
    }
    @Override
    public void m2() {
        long starttime = System.nanoTime();
        super.m1();
        System.out.println("方法m1，耗时(纳秒):" + (System.nanoTime() - starttime));
    }
}

```

### 案例 3：LazyLoader 的使用

LazyLoader 是 cglib 用于实现懒加载的 callback。当被增强 bean 的方法初次被调用时，会触发回调，之后每次再进行方法调用都是对 LazyLoader 第一次返回的 bean 调用，hibernate 延迟加载有用到过这个。

看案例吧，通过案例理解容易一些。

```
public class LazyLoaderTest1 {
    public static class UserModel {
        private String name;
        public UserModel() {
        }
        public UserModel(String name) {
            this.name = name;
        }
        public void say() {
            System.out.println("你好：" + name);
        }
    }
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(UserModel.class);
        //创建一个LazyLoader对象
        LazyLoader lazyLoader = new LazyLoader() {
            @Override
            public Object loadObject() throws Exception {
                System.out.println("调用LazyLoader.loadObject()方法");
                return new UserModel("路人甲java");
            }
        };
        enhancer.setCallback(lazyLoader);
        Object proxy = enhancer.create();
        UserModel userModel = (UserModel) proxy;
        System.out.println("第1次调用say方法");
        userModel.say();
        System.out.println("第1次调用say方法");
        userModel.say();
    }
}

```

运行输出

```
第1次调用say方法
调用LazyLoader.loadObject()方法
你好：路人甲java
第1次调用say方法
你好：路人甲java

```

当第 1 次调用 say 方法的时候，会被 cglib 拦截，进入 lazyLoader 的 loadObject 内部，将这个方法的返回值作为 say 方法的调用者，loadObject 中返回了一个`路人甲Java`的 UserModel，cglib 内部会将 loadObject 方法的返回值和 say 方法关联起来，然后缓存起来，而第 2 次调用 say 方法的时候，通过方法名去缓存中找，会直接拿到第 1 次返回的 UserModel，所以第 2 次不会进入到 loadObject 方法中了。

将下代码拆分开来

```
System.out.println("第1次调用say方法");
userModel.say();
System.out.println("第1次调用say方法");
userModel.say();

```

相当于下面的代码

```
System.out.println("第1次调用say方法");
System.out.println("调用LazyLoader.loadObject()方法");
userModel = new UserModel("路人甲java");
userModel.say();
System.out.println("第1次调用say方法");
userModel.say();

```

下面通过 LazyLoader 实现延迟加载的效果。

### 案例 4：LazyLoader 实现延迟加载

博客的内容一般比较多，需要用到内容的时候，我们再去加载，下面来模拟博客内容延迟加载的效果。

```
public class LazyLoaderTest2 {
    //博客信息
    public static class BlogModel {
        private String title;
        //博客内容信息比较多，需要的时候再去获取
        private BlogContentModel blogContentModel;
        public BlogModel() {
            this.title = "spring aop详解!";
            this.blogContentModel = this.getBlogContentModel();
        }
        private BlogContentModel getBlogContentModel() {
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(BlogContentModel.class);
            enhancer.setCallback(new LazyLoader() {
                @Override
                public Object loadObject() throws Exception {
                    //此处模拟从数据库中获取博客内容
                    System.out.println("开始从数据库中获取博客内容.....");
                    BlogContentModel result = new BlogContentModel();
                    result.setContent("欢迎大家和我一起学些spring，我们一起成为spring高手！");
                    return result;
                }
            });
            return (BlogContentModel) enhancer.create();
        }
    }
    //表示博客内容信息
    public static class BlogContentModel {
        //博客内容
        private String content;
        public String getContent() {
            return content;
        }
        public void setContent(String content) {
            this.content = content;
        }
    }
    public static void main(String[] args) {
        //创建博客对象
        BlogModel blogModel = new BlogModel();
        System.out.println(blogModel.title);
        System.out.println("博客内容");
        System.out.println(blogModel.blogContentModel.getContent()); //@1
    }
}

```

> @1：调用 blogContentModel.getContent() 方法的时候，才会通过 LazyLoader#loadObject 方法从 db 中获取到博客内容信息

运行输出

```
spring aop详解!
博客内容
开始从数据库中获取博客内容.....
欢迎大家和我一起学些spring，我们一起成为spring高手！

```

### 案例 5：Dispatcher

Dispatcher 和 LazyLoader 作用很相似，区别是用 Dispatcher 的话每次对增强 bean 进行方法调用都会触发回调。

看案例代码

```
public class DispatcherTest1 {
    public static class UserModel {
        private String name;
        public UserModel() {
        }
        public UserModel(String name) {
            this.name = name;
        }
        public void say() {
            System.out.println("你好：" + name);
        }
    }
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(LazyLoaderTest1.UserModel.class);
        //创建一个Dispatcher对象
        Dispatcher dispatcher = new Dispatcher() {
            @Override
            public Object loadObject() throws Exception {
                System.out.println("调用Dispatcher.loadObject()方法");
                return new LazyLoaderTest1.UserModel("路人甲java," + UUID.randomUUID().toString());
            }
        };
        enhancer.setCallback(dispatcher);
        Object proxy = enhancer.create();
        LazyLoaderTest1.UserModel userModel = (LazyLoaderTest1.UserModel) proxy;
        System.out.println("第1次调用say方法");
        userModel.say();
        System.out.println("第1次调用say方法");
        userModel.say();
    }
}

```

运行输出

```
第1次调用say方法
调用Dispatcher.loadObject()方法
你好：路人甲java,514f911e-06ac-4e3b-aee4-595f82c16a5f
第1次调用say方法
调用Dispatcher.loadObject()方法
你好：路人甲java,bc062990-bc16-4226-97e3-b1b321a03468

```

### 案例 6：通过 Dispathcer 对类扩展一些接口

下面有个 UserService 类，我们需要对这个类创建一个代理。

代码中还定义了一个接口：IMethodInfo，用来统计被代理类的一些方法信息，有个实现类：DefaultMethodInfo。

通过 cglib 创建一个代理类，父类为 UserService，并且实现 IMethodInfo 接口，将接口 IMethodInfo 所有方法的转发给 DefaultMethodInfo 处理，代理类中的其他方法，转发给其父类 UserService 处理。

这个代码相当于对 UserService 这个类进行了增强，使其具有了 IMethodInfo 接口中的功能。

```
public class DispatcherTest2 {
    public static class UserService {
        public void add() {
            System.out.println("新增用户");
        }
        public void update() {
            System.out.println("更新用户信息");
        }
    }
    //用来获取方法信息的接口
    public interface IMethodInfo {
        //获取方法数量
        int methodCount();
        //获取被代理的对象中方法名称列表
        List<String> methodNames();
    }
    //IMethodInfo的默认实现
    public static class DefaultMethodInfo implements IMethodInfo {
        private Class<?> targetClass;
        public DefaultMethodInfo(Class<?> targetClass) {
            this.targetClass = targetClass;
        }
        @Override
        public int methodCount() {
            return targetClass.getDeclaredMethods().length;
        }
        @Override
        public List<String> methodNames() {
            return Arrays.stream(targetClass.getDeclaredMethods()).
                    map(Method::getName).
                    collect(Collectors.toList());
        }
    }
    public static void main(String[] args) {
        Class<?> targetClass = UserService.class;
        Enhancer enhancer = new Enhancer();
        //设置代理的父类
        enhancer.setSuperclass(targetClass);
        //设置代理需要实现的接口列表
        enhancer.setInterfaces(new Class[]{IMethodInfo.class});
        //创建一个方法统计器
        IMethodInfo methodInfo = new DefaultMethodInfo(targetClass);
        //创建会调用器列表，此处定义了2个，第1个用于处理UserService中所有的方法，第2个用来处理IMethodInfo接口中的方法
        Callback[] callbacks = {
                new MethodInterceptor() {
                    @Override
                    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                        return methodProxy.invokeSuper(o, objects);
                    }
                },
                new Dispatcher() {
                    @Override
                    public Object loadObject() throws Exception {
                        /**
                         * 用来处理代理对象中IMethodInfo接口中的所有方法
                         * 所以此处返回的为IMethodInfo类型的对象，
                         * 将由这个对象来处理代理对象中IMethodInfo接口中的所有方法
                         */
                        return methodInfo;
                    }
                }
        };
        enhancer.setCallbacks(callbacks);
        enhancer.setCallbackFilter(new CallbackFilter() {
            @Override
            public int accept(Method method) {
                //当方法在IMethodInfo中定义的时候，返回callbacks中的第二个元素
                return method.getDeclaringClass() == IMethodInfo.class ? 1 : 0;
            }
        });
        Object proxy = enhancer.create();
        //代理的父类是UserService
        UserService userService = (UserService) proxy;
        userService.add();
        //代理实现了IMethodInfo接口
        IMethodInfo mf = (IMethodInfo) proxy;
        System.out.println(mf.methodCount());
        System.out.println(mf.methodNames());
    }
}

```

运行输出

```
新增用户
2
[add, update]

```

### 案例 7：cglib 中的 NamingPolicy 接口

接口 NamingPolicy 表示生成代理类的名字的策略，通过`Enhancer.setNamingPolicy`方法设置命名策略。

默认的实现类：DefaultNamingPolicy， 具体 cglib 动态生成类的命名控制。

DefaultNamingPolicy 中有个 getTag 方法。

DefaultNamingPolicy 生成的代理类的类名命名规则：

```
被代理class name + "$$" + 使用cglib处理的class name + "ByCGLIB" + "$$" + key的hashcode
```

如：

```
com.javacode2018.aop.demo2.DispatcherTest2$UserService$$EnhancerByCGLIB$$e7ec0be5@17d10166
```

自定义 NamingPolicy，通常会继承 DefaultNamingPolicy 来实现，spring 中默认就提供了一个，如下

```
public class SpringNamingPolicy extends DefaultNamingPolicy {
    public static final SpringNamingPolicy INSTANCE = new SpringNamingPolicy();
    @Override
    protected String getTag() {
        return "BySpringCGLIB";
    }
}

```

案例代码

```
public class NamingPolicyTest {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(NamingPolicyTest.class);
        enhancer.setCallback(NoOp.INSTANCE);
        //通过Enhancer.setNamingPolicy来设置代理类的命名策略
        enhancer.setNamingPolicy(new DefaultNamingPolicy() {
            @Override
            protected String getTag() {
                return "-test-";
            }
        });
        Object proxy = enhancer.create();
        System.out.println(proxy.getClass());
    }
}

```

输出

```
class com.javacode2018.aop.demo2.NamingPolicyTest$$Enhancer-test-$$5946713
```

Objenesis：实例化对象的一种方式
--------------------

先来看一段代码，有一个有参构造函数：

```
public static class User {
    private String name;
    public User(String name) {
        this.name = name;
    }
    @Override
    public String toString() {
        return "User{" +
                " + name + '\'' +
                '}';
    }
}

```

**大家来思考一个问题：如果不使用这个有参构造函数的情况下，如何创建这个对象？**

通过反射？大家可以试试，如果不使用有参构造函数，是无法创建对象的。

cglib 中提供了一个接口：Objenesis，通过这个接口可以解决上面这种问题，它专门用来创建对象，即使你没有空的构造函数，都木有问题，它不使用构造方法创建 Java 对象，所以即使你有空的构造方法，也是不会执行的。

用法比较简单：

```
@Test
public void test1() {
    Objenesis objenesis = new ObjenesisStd();
    User user = objenesis.newInstance(User.class);
    System.out.println(user);
}

```

输出

```
User{name='null'}
```

大家可以在 User 类中加一个默认构造函数，来验证一下上面的代码会不会调用默认构造函数？

```
public User() {
    System.out.println("默认构造函数");
}

```

再次运行会发现，并不会调用默认构造函数。

如果需要多次创建 User 对象，可以写成下面方式重复利用

```
@Test
public void test2() {
    Objenesis objenesis = new ObjenesisStd();
    ObjectInstantiator<User> userObjectInstantiator = objenesis.getInstantiatorOf(User.class);
    User user1 = userObjectInstantiator.newInstance();
    System.out.println(user1);
    User user2 = userObjectInstantiator.newInstance();
    System.out.println(user2);
    System.out.println(user1 == user2);
}

```

运行输出

```
User{name='null'}
User{name='null'}
false
```