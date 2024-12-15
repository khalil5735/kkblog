# SpringMVC中方法Hanlder的注册过程

背景：看到一篇文章，将能不能使用@Service代替@Controller标注Controller类？



源码理解：

## 思路：SpringMVC 是如何调用我们编写的Controller中方法的

DispatcherServlet 处理请求，调用doDispatcher方法，其中有一步是获取到处理当前请求的Handler

```java
// org.springframework.web.servlet.DispatcherServlet#doDispatch
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
    HttpServletRequest processedRequest = request;
    HandlerExecutionChain mappedHandler = null;
    boolean multipartRequestParsed = false;

    WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);

    try {
        ModelAndView mv = null;
        Exception dispatchException = null;

        try {
            processedRequest = checkMultipart(request);
            multipartRequestParsed = (processedRequest != request);

            mappedHandler = getHandler(processedRequest);// 获取到处理当前请求的handler
            if (mappedHandler == null) {
                noHandlerFound(processedRequest, response);
                return;
            }
            ...
        }
    }
}
```

看一下方法getHandler

```java
// org.springframework.web.servlet.DispatcherServlet#getHandler	
@Nullable
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        for (HandlerMapping mapping : this.handlerMappings) {
            // 根据请求获取到 HandlerExecutionChain
            HandlerExecutionChain handler = mapping.getHandler(request);
            if (handler != null) {
                return handler;
            }
        }
    }
    return null;
}
```

在 AbstractHandlerMapping.getHandler() 中 getHandlerInternal 获取到hanlder，然后对其包装成HandlerExecutionChain

```java
// org.springframework.web.servlet.handler.AbstractHandlerMapping#getHandler

	@Override
	@Nullable
	public final HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
		// 获取到handler
        Object handler = getHandlerInternal(request);
		if (handler == null) {
			handler = getDefaultHandler();
		}
		if (handler == null) {
			return null;
		}
		// Bean name or resolved handler?
		if (handler instanceof String) {
			String handlerName = (String) handler;
			handler = obtainApplicationContext().getBean(handlerName);
		}

		// Ensure presence of cached lookupPath for interceptors and others
		if (!ServletRequestPathUtils.hasCachedPath(request)) {
			initLookupPath(request);
		}

		HandlerExecutionChain executionChain = getHandlerExecutionChain(handler, request);

		if (logger.isTraceEnabled()) {
			logger.trace("Mapped to " + handler);
		}
		else if (logger.isDebugEnabled() && !DispatcherType.ASYNC.equals(request.getDispatcherType())) {
			logger.debug("Mapped to " + executionChain.getHandler());
		}

		if (hasCorsConfigurationSource(handler) || CorsUtils.isPreFlightRequest(request)) {
			CorsConfiguration config = getCorsConfiguration(handler, request);
			if (getCorsConfigurationSource() != null) {
				CorsConfiguration globalConfig = getCorsConfigurationSource().getCorsConfiguration(request);
				config = (globalConfig != null ? globalConfig.combine(config) : config);
			}
			if (config != null) {
				config.validateAllowCredentials();
			}
			executionChain = getCorsHandlerExecutionChain(request, executionChain, config);
		}

		return executionChain;
	}
```

这里看一下 getHandlerInternal：

```java
// org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping#getHandlerInternal
@Override
@Nullable
protected HandlerMethod getHandlerInternal(HttpServletRequest request) throws Exception {
    request.removeAttribute(PRODUCIBLE_MEDIA_TYPES_ATTRIBUTE);
    try {
        return super.getHandlerInternal(request);
    }
    finally {
        ProducesRequestCondition.clearMediaTypesAttribute(request);
    }
}
```

```java
// org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#getHandlerInternal
@Override
@Nullable
protected HandlerMethod getHandlerInternal(HttpServletRequest request) throws Exception {
    String lookupPath = initLookupPath(request);
    this.mappingRegistry.acquireReadLock();
    try {
        // 拿到 HandlerMethod
        HandlerMethod handlerMethod = lookupHandlerMethod(lookupPath, request);
        return (handlerMethod != null ? handlerMethod.createWithResolvedBean() : null);
    }
    finally {
        this.mappingRegistry.releaseReadLock();
    }
}
```



```java
	protected HandlerMethod lookupHandlerMethod(String lookupPath, HttpServletRequest request) throws Exception {
		List<Match> matches = new ArrayList<>();
        // 根据 lookupPath 拿到匹配的
		List<T> directPathMatches = this.mappingRegistry.getMappingsByDirectPath(lookupPath);
		if (directPathMatches != null) {
			addMatchingMappings(directPathMatches, matches, request);
		}
		if (matches.isEmpty()) {
			addMatchingMappings(this.mappingRegistry.getRegistrations().keySet(), matches, request);
		}
		if (!matches.isEmpty()) {
			Match bestMatch = matches.get(0);
			if (matches.size() > 1) {
				Comparator<Match> comparator = new MatchComparator(getMappingComparator(request));
				matches.sort(comparator);
				bestMatch = matches.get(0);
				if (logger.isTraceEnabled()) {
					logger.trace(matches.size() + " matching mappings: " + matches);
				}
				if (CorsUtils.isPreFlightRequest(request)) {
					for (Match match : matches) {
						if (match.hasCorsConfig()) {
							return PREFLIGHT_AMBIGUOUS_MATCH;
						}
					}
				}
				else {
					Match secondBestMatch = matches.get(1);
					if (comparator.compare(bestMatch, secondBestMatch) == 0) {
						Method m1 = bestMatch.getHandlerMethod().getMethod();
						Method m2 = secondBestMatch.getHandlerMethod().getMethod();
						String uri = request.getRequestURI();
						throw new IllegalStateException(
								"Ambiguous handler methods mapped for '" + uri + "': {" + m1 + ", " + m2 + "}");
					}
				}
			}
			request.setAttribute(BEST_MATCHING_HANDLER_ATTRIBUTE, bestMatch.getHandlerMethod());
			handleMatch(bestMatch.mapping, lookupPath, request);
			return bestMatch.getHandlerMethod();
		}
		else {
			return handleNoMatch(this.mappingRegistry.getRegistrations().keySet(), lookupPath, request);
		}
	}
```

此时，指向了 org.springframework.web.servlet.handler.AbstractHandlerMethodMapping.MappingRegistry

查看MappingRegistry方法，会发现MappingRegistry中提供了register 方法，注册了Method和映射关系集合



什么时间调用的MappingRegistry.register？

```java
// org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#afterPropertiesSet
@Override
public void afterPropertiesSet() {
    initHandlerMethods();
}    
```



```java
// org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#initHandlerMethods
protected void initHandlerMethods() {
    for (String beanName : getCandidateBeanNames()) {
        if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX)) {
            processCandidateBean(beanName);
        }
    }
    handlerMethodsInitialized(getHandlerMethods());
}
```



```java
// org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#processCandidateBean
protected void processCandidateBean(String beanName) {
    Class<?> beanType = null;
    try {
        beanType = obtainApplicationContext().getType(beanName);
    }
    catch (Throwable ex) {
        // An unresolvable bean type, probably from a lazy bean - let's ignore it.
        if (logger.isTraceEnabled()) {
            logger.trace("Could not resolve type for bean '" + beanName + "'", ex);
        }
    }
    // isHandler 判断这个beanType 是不是需要处理的
    if (beanType != null && isHandler(beanType)) {
        // 处理handlerMethod
        detectHandlerMethods(beanName);
    }
}
```

```java
	@Override
	protected boolean isHandler(Class<?> beanType) {
        // 可以发现，这里的条件是：存在@Controller注解或RequestMapping注解
		return (AnnotatedElementUtils.hasAnnotation(beanType, Controller.class) ||
				AnnotatedElementUtils.hasAnnotation(beanType, RequestMapping.class));
	}
```



```java
// org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#detectHandlerMethods
protected void detectHandlerMethods(Object handler) {
		Class<?> handlerType = (handler instanceof String ?
				obtainApplicationContext().getType((String) handler) : handler.getClass());

		if (handlerType != null) {
			Class<?> userType = ClassUtils.getUserClass(handlerType);
			Map<Method, T> methods = MethodIntrospector.selectMethods(userType,
					(MethodIntrospector.MetadataLookup<T>) method -> {
						try {
							return getMappingForMethod(method, userType);
						}
						catch (Throwable ex) {
							throw new IllegalStateException("Invalid mapping on handler class [" +
									userType.getName() + "]: " + method, ex);
						}
					});
			if (logger.isTraceEnabled()) {
				logger.trace(formatMappings(userType, methods));
			}
			else if (mappingsLogger.isDebugEnabled()) {
				mappingsLogger.debug(formatMappings(userType, methods));
			}
			methods.forEach((method, mapping) -> {
                // AOP 处理
				Method invocableMethod = AopUtils.selectInvocableMethod(method, userType);
                // 进行注册
				registerHandlerMethod(handler, invocableMethod, mapping);
			});
		}
	}
```



```java
// org.springframework.web.servlet.handler.AbstractHandlerMethodMapping#registerHandlerMethod
protected void registerHandlerMethod(Object handler, Method method, T mapping) {
		this.mappingRegistry.register(mapping, handler, method);
	}
```



答案：

可以，但需要使用 @RequestMapping 标记





