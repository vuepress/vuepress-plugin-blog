---
date: 2016-10-20 20:44:40
tags: 
  - JavaScript
  - DOM
author: ULIVZ
location: Foshan
---

# 详解 DOM 事件绑定和事件冒泡

::: slot intro
Prototype, but that's all ...
:::

## 绑定事件

### DOM0和DOM2

在DOM的事件中，事件分为DOM0和DOM2事件，下面给出了两种不同模式的绑定方式：

```js
var btn = document.getElementById('submit');
// DOM0事件
btn.onclick = onClickFn;
// DOM2事件    
btn.addEventListener('click', onClickFn, false);
```

直接在HTML上绑定事件也是采用的DOM0事件，那么DOM0和DOM2到底有什么区别呢？简单来说，DOM0的事件绑定方法只能给一个事件绑定一个响应函数，重复绑定会覆盖之前的绑定。而DOM2则可以给一个元素绑定多个事件处理函数。

### 兼容性

事实上，低于IE9是不支持 `addEventListener` 这个方法的，下面，采用外观模式（门面模式）来解决兼容性：
```js
function addEvent(el, type, fn) {
	// 对于支持DOM2事件优先用DOM2
  if(el.addEventListener){
  	// 第三个参数为 false 表示事件的监听函数将在冒泡阶段执行
  	// 为true的话则，会在冒泡阶段执行
  	el.addEventListener(type, fn, false)
  	// 对于不支持addEventListener但支持attachEvent的
  } else if(el.attachEvent){
  	el.attachEvent('on'+type, fn)
  	// 对于不支持addEventListener也不支持attachEvent的
  } else {
  	el['on'+type] = fn;
  }
}
```

## 事件传递机制

一个事件的传递过程包含三个阶段，分别称为：

- 捕获阶段(IE8以下不支持)
- 目标阶段
- 冒泡阶段

用一个例子来说明这个三个阶段：

``` html
<div id="btn-wrapper">
	<button id="btn">BUTTON</button>
</div>
```

``` js
var body = document.getElementsByTagName('body')[0]
var btnWrapper = document.getElementById('btn-wrapper')
var btn = document.getElementById('btn')

function triggerEvent(event) {
  // 获取当前事件捕获/目标/冒泡的DOM元素的tagName
  let tagName = event.currentTarget.tagName
  // 获取当前事件的阶段
  let stage = event.eventPhase
  console.log(tagName)
  console.log(stage)
}

addEvent(body, 'click', triggerEvent)
addEvent(btnWrapper, 'click', triggerEvent)
addEvent(btn, 'click', triggerEvent)
```

控制台输出如下结果：

```console
"BUTTON"
2
"DIV"
3
"BODY"
3
```

首先，关于`event.eventPhase`与当前事件的阶段的对应关系如下：
 
- 1: 捕获阶段
- 2: 目标阶段
- 3: 冒泡阶段

由此我们可以总结出以下结论：

> 事件捕获机制决定是否找到目标的原则是“深度优先”，如果元素仍有后代绑定了事件，那么捕获阶段则不会停止，直至找到后代没有绑定事件的那个节点为止。

综上，上述的代码可以总结为以下这张图，就是这样：

<img width="402" alt="js-01" src="https://user-images.githubusercontent.com/23133919/38630757-609fa0fc-3dea-11e8-830f-21e8115cd13d.png">

那么，问题来了，如何将上述事件的事件监听函数的执行顺序颠倒过来呢？

> 当然这种奇葩的需求，我们只能在 DOM2 级事件中，设定 `addEventListener` 的第三个参数为 `true`。

再强调一遍`addEventListener`的第三个参数的作用：

- `true` 表示该元素在事件的“捕获阶段”（由外往内传递时）响应事件；
- `false` 表示该元素在事件的“冒泡阶段”（由内向外传递时）响应事件。

## 事件截获

在移动端开发时，我们常常会遇到这样一种需求：在一个 `list` 的 `item` 中，点击 `item` 本身进入查看详情，点击右侧的`button`执行某个业务相关的功能，如下图：

<img width="395" alt="js-02" src="https://user-images.githubusercontent.com/23133919/38630778-6eb80ecc-3dea-11e8-9219-d1561de7b8c9.png">

当右侧的`button`并未脱离文档流，且属于`item`的某个子节点，当点击了右侧的`button`后，初学者往往会感到郁闷，我只是想触发`button`的事件，为什么连`item`的事件也触发了。

现在，我们很好结合两节的知识来阐述原因了——事件冒泡机制。

那么，如何截获事件呢？DOM2级事件为我们提供了一个阻止事件冒泡的函数—— `stopPropagation()`

在上一节事件的处理函数的最后一行加上以下代码：

```js
function triggerEvent(event) {
  let tagName = event.currentTarget.tagName
  let stage = event.eventPhase
  event.stopPropagation()
}
```

在此点击按钮，控制台便得到了以下输出：

```console
BUTTON
2 
```

是不是很好地解决了开始的需求？

> 再次强调兼容性问题，这种只适用于`DOM2`级事件，`DOM0`的事件请绕道。此外，IE对应的阻止事件冒泡的方法是 `event.cancelbubble()`

## 其他

1. `target` 和 `currentTarget` 有什么区别？

引用自`MDN`的官方解释：

> Identifies the current target for the event, as the event traverses the DOM. It always refers to the element to which the event handler has been attached, as opposed to event.target which identifies the element on which the event occurred.

`currentTarget` 在事件流的捕获，目标及冒泡阶段。只有当事件流处在目标阶段的时候，两个的指向才是一样的， 而当处于捕获和冒泡阶段的时候，`target`指向被单击的对象而`currentTarget` 指向当前事件活动的对象(注册该事件的对象)（一般为父级）。`this` 指向永远和 `currentTarget` 指向一致（只考虑 `this` 的非箭头函数调用）。
