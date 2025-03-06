# WeakMap 与 Map 的区别

## WeakMap 解决什么问题

初看 WeakMap 的定义似乎有些费解。不可遍历、键是弱引用。但应当注意到这些都是外在的。我们应当关注 WeakMap 存在的原因以及使用它的理由，这样才能在使用时正确地选择。

提 WeakMap 时提得最多的就是其对键的弱引用。弱引用与垃圾回收机制时紧密相关的 —— 弱引用不会阻止垃圾回收。

考虑如下几个场景：

- Vue 中的响应式对象需要绑定作用函数，这样可以在数据修改时调用这些函数，实现实时更新；
- 需要在 DOM 对象上记录一些信息，例如一个帖子的删除按钮，希望在删除按钮上记录帖子的信息（例如 ID）等；
- ……

等等这些都是需要记录某个对象相关的信息。当然，你可以在对象上添加属性、在 DOM 上添加属性实现，但有时出于类型安全等考虑，这些方法的效果并不太理想。

我们可以采用 Map 来存储。将对象作为键（key），需要存储的内容作为值（value）。这样建立起二者的对应关系，可以很方便地取用数据。

但是使用 Map 有一个问题。这些作为键的对象很多时候是「不可靠」的。例如，ref 对象在某个块作用域中，这个块作用域结束之后就没有别人能访问了；又或者是 DOM 节点随着页面内容更新可能被移除。由于 Map 持有这些对象的引用并且是可遍历的，因此我们总能通过 Map 找到这些对象，因此这些对象只要不手动删除，就会一直留在 Map 中，留在内存中，不会被回收。

这时候，处理这些作为键的对象的生命周期就是一件很棘手的事情了。我们需要时刻关注这些对象是否还有用，并在没用的时候手动删除它们。

而 WeakMap 提供了解决该问题的捷径。WeakMap 是不可遍历的，因此不能通过 WeakMap 获取这些键。所以 WeakMap 对这些键持有的是「弱引用」—— 即 WeakMap 不影响这些对象的垃圾回收。如果某些键除了 WeakMap 之外没人持有引用了，那这些对象就会被回收，并且随着键的回收，对应的 WeakMap 值也会被自动回收。这样，我们就不必考虑键值对的生命周期问题了，一切都交给垃圾回收机制处理。

## WeakMap 的行为

WeakMap 是不可遍历的，用 `console.log` 也打印不出内容。但是在浏览器的调试控制台中可以看到内容。

你可以将下面的代码复制到控制台中运行：

```js
const someNormalMap = new Map();
const someWeakMap = new WeakMap();
const foo = { value: 1 };
someNormalMap.set(foo, 1);
someWeakMap.set(foo, 1);
(() => {
  const bar1 = { value: 2 };
  const bar2 = { value: 2 };
  someNormalMap.set(bar1, 2);
  someWeakMap.set(bar2, 2);
})();
```

然后在控制台中分别输入 `someNormalMap` 和 `someWeakMap` 来查看它们的内容：

```ansi
[1m[90m->[39m[0m someNormalMap
[1m[90m<-[39m[0m [90m▼[39m [3mMap(2) { {…} => [35m1[39m, {…} => [35m2[39m }[0m
     [90m▼[39m [2m[[Entries]][0m
       [90m▶[39m [94m0[39m: {Object => 1}
       [90m▶[39m [94m1[39m: {Object => 2}
       [2m[94msize[39m[0m: [35m2[39m
     [90m▶[39m [2m[[Prototype]][0m: Map
[1m[90m->[39m[0m someWeakMap
[1m[90m<-[39m[0m [90m▼[39m [3mWeakMap(2) { {…} => [35m1[39m }[0m
     [90m▼[39m [2m[[Entries]][0m
       [90m▶[39m [94m0[39m: {Object => 1}
       [2m[94msize[39m[0m: [35m1[39m
     [90m▶[39m [2m[[Prototype]][0m: WeakMap
```

`bar1` 和 `bar2` 都定义在 IIFE 内。当 IIFE 运行结束之后，`someNormalMap` 持有对 `bar1` 的引用，`someWeakMap` 持有对 `bar2` 的引用。

IIFE 运行结束之后，由于可以通过 `someNormalMap.entries()` 找到 `bar1`，因此 `bar1` 不能回收。而 WeakMap 持有弱引用，现在已经没有办法访问 `bar2` 了。因此，`bar2` 被引擎回收，使得 `bar2` 对应的键值对也被回收。可以看到，`someWeakMap` 中已经没有 `2` 这个值了。

为了保持示例的简单，这里的 `bar1` 和 `bar2` 都很小，是否回收其实问题都不大。但是实际应用中，作为键的对象可能会很多、占用大量空间。此时如果还使用 Map，就会造成比较严重的性能问题。

由于 WeakMap 是专为内存回收机制特化的，因此 WeakMap 只接受对象和非全局注册的符号作为键。

## 拓展阅读

有关作用域的更多内容，可参阅 [作用域、闭包与隐式块](./作用域与闭包)。你也可以在 [MDN: WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) 上阅读与 WeakMap 有关的更多内容。

此外 WeakSet 也有类似的行为。你可以在 [MDN: WeakSet](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 中了解更多。
