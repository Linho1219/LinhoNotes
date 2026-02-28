# Vue Proxy 与原对象

## 原对象与代理的引用不同

考虑这样一段代码：

```js
import { reactive } from "vue";

const foo = { bar: 1 };
const rArr = reactive([]);
rArr.push(foo);
console.log(rArr[0] === foo);
```

输出的结果是什么？答案是 `false` 而不是 `true`。

我们知道 Vue 的响应式是通过对象代理（proxy）实现的。因此当一个对象被「纳入」到响应式体系中的时候，Vue 会创建一个代理对象，接下来操作的都会是这个代理对象。这个代理对象与原对象的引用是**不同**的，Vue 不可能魔法般地把你手上的那个对象「偷换」成代理对象，因此会出现这样不相等的问题。

如果把它们打印出来，就很明显了：

```js
console.log(foo); // {bar: 1}
console.log(rArr[0]); // Proxy(Object) {bar: 1}
```

这样的「包装」发生在以任意形式「纳入」响应式体系时，例如成为响应式数组的元素、赋值到响应式对象的属性上等等，以及最基本的使用 `ref()` 或 `reactive()` 创建响应式对象。

## 操作原对象无法触发响应式更新

响应式的原理是通过 proxy 监听属性值更新。修改原对象不会经过 proxy，自然也无法触发响应式更新。

```js
import { nextTick, watch } from "vue";

watch(rArr, () => console.log("Watch fired"), { deep: true });
(async () => {
  await nextTick();
  console.log("Edit rFoo.bar:", ++rFoo.bar);
  await nextTick();
  console.log("Edit foo.bar:", ++foo.bar);
})();
```

## 避免引用不同的问题

不过一旦进入响应式体系，创建了代理之后，Vue 就会通过一个 WeakMap 保存已经创建的代理的引用，避免重复创建。也就是说，同一个对象，对应的响应式代理只会有一个。

```js
import { ref, reactive } from "vue";
const reactiveFoo = reactive(foo);
console.log(reactiveFoo === rArr[0]); // true

const refFoo = ref(foo);
console.log(refFoo.value === rArr[0]); // true
```

因此，解决方案是**对于所有即将进入响应式体系的对象，在定义时就套上 `reactive()` 或 `ref()`**。例如

```js
const betterFoo = reactive({ bar: 1 });
// instead of: const foo = { bar: 1 };
```

这样我们就只需要管理代理对象，不会再碰到原对象。对于 TS 中类型确定的对象，可以考虑使用工厂函数：

```ts
interface Foo {
  bar: number;
  baz?: string;
}

const defineFoo = (raw: Foo) => reactive(raw);
```

## 原对象的使用场景

`structuredClone` 方法不允许深拷贝含 proxy 的对象：

```js
structuredClone(foo);
// OK

structuredClone(rArr[0]);
// DataCloneError: Failed to execute 'structuredClone' on 'Window': #<Object> could not be cloned.
```

不过这也并不意味着我们必须一直持有原对象引用。Vue 提供了 `toRaw()` 函数，它可以把响应式的「壳」脱掉得到原本的对象：

```js
import { toRaw } from "vue";

console.log(toRaw(rArr[0]) === foo); // true

structuredClone(toRaw(rArr[0])); // OK
```

## 总结

- Vue 创建的响应式对象与原本传入的对象引用不同、不相等；
- 对于所有将要进入响应式体系的对象，在定义字面量时直接套上 `ref()` 或 `reactive()` 避免同时持有原对象与代理对象的引用，造成混淆；
- 对于需要使用原对象的边界情况，使用 `toRaw` 函数得到原始对象。
