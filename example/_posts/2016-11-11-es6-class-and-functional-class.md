---
date: 2016-11-11 20:44:40
tags: 
  - JavaScript
author: ULIVZ
location: Foshan
---

# ES6 Class 和 Function Class 

## 从一个小测试说起

在ES6中用 class 来定义的方法，和直接用 prototype 定一个方法究竟有什么不同呢？

举例来说：

```js
function FunctionPerson(name) {
  this.name = name
}
Person.prototype.say = () => {
	console.log(`I am ${this.name}`)
}
```

和

```js
class ES6Person {
  constructor(name) {
  	  this.name = name
  }
  say(){
  	  console.log(`I am ${this.name}`)
  }
}
```

接下来，让我们在浏览器中做个测试吧！

- function Class：

```js
// 测试代码

let ulivz = new FunctionPerson('ulivz')
ulivz
```

![image](https://user-images.githubusercontent.com/23133919/38618627-d05fedf2-3dcc-11e8-941f-84c631647db9.png)

- ES6 Class：

```js
// 测试代码

let ulivz = new ES6Person('ulivz')
ulivz
```

![image](https://user-images.githubusercontent.com/23133919/38618768-223359de-3dcd-11e8-8a82-054d8e014082.png)

好像看到了什么不同！在 `function Class` 中，say 的颜色没有透明度，而在 ES6 class中，say已经是带有透明度的了。那么这个透明度到底指什么呢？

### enumerable

实际上，在Chrome调试台中，**带透明度的字段说明其为不可枚举字段，而纯色的字段即为可枚举字段**！接下来，我们来验证它。

此时，`Object.defineProperty()` 这位大兄弟又要出场了！

回顾一些语法：Object.defineProperty(obj, prop, descriptor)，还没忘记吧。。。

重点是第三个参数 ---- 属性描述符!

- configurable，为true时，该属性描述符才能被改变！
- enumerable：为true时，属性才能够出现在对象的枚举属性中，默认是false！
- value：任意的javascript值，默认值是undefined
- writable：当且仅当该属性的writable为true时，value才能被改变！
- get：不多说了
- set：同～

注意：如果一个描述符同时有(value或writable)和(get或set)关键字，将会产生一个异常。

接着，闭关多年的 `Object.getOwnPropertyDescriptor(obj, prop)` 也要出场了。

`Object.getOwnPropertyDescriptor(ulivz.__proto__, 'say')`

prototype 类的结果：

```js
{
	"writable":true,
	"enumerable":true,
	"configurable":true
	"value": () => { console.log(`I am ${this.name}`) }
}
```

ES6 的结果：

```js
{
	"writable":true,
	"enumerable":false,  // => 这就是不同点！！
	"configurable":true
	"value": () => { console.log(`I am ${this.name}`) }
}
```

## 如何区分ES6 Class 和 Function Class

这是一个有意思的话题，很多人的第一直觉是用 `Object.prototype.toString`，但很不幸地告诉你，对于这两种类型的class，其结果都是一样的：

```
Object.prototype.toString.call(FunctionPerson) // "[object Function]"
Object.prototype.toString.call(ES6Person) // "[object Function]"
```

其实，我们忽略了函数和class本身具有 toString 这个方法，测试一下：

对于 Function Class:

![image](https://user-images.githubusercontent.com/23133919/38619262-5d785aa2-3dce-11e8-94a5-58b382ace451.png)

对于 ES6 Class:

![image](https://user-images.githubusercontent.com/23133919/38619287-6a9e92be-3dce-11e8-8078-4b70cea64806.png)

既然能直接打印出源码，那就可以这样做了：

```js
function isES6Class(klass) {
   return klass.toString().startsWith('class')
}
```

测试一下：

```
isES6Class(FunctionPerson) // false
isES6Class(ES6Person) // true
```

注意，这里并没有尝试去检测 function class, 因为 function 存在两种定义方式, 参见 #14 

大功告成，谢谢阅读！





