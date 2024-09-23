# ECMAScript 函数
## ECMAScript 函数概述
### 什么是函数？
> 函数是一组可以随时随地运行的语句。
函数是 ECMAScript 的核心。

函数是由这样的方式进行声明的：关键字 function、函数名、一组参数，以及置于括号中的待执行代码。

函数的基本语法是这样的：

```js
function functionName(arg0, arg1, ... argN) {
  statements
}
```

例如：

```js
function sayHi(sName, sMessage) {
  console.log("Hello " + sName + sMessage);
}
```

### 如何调用函数？
函数可以通过其名字加上括号中的参数进行调用，如果有多个参数。

如果您想调用上例中的那个函数，可以使用如下的代码：

```js
sayHi("David", " Nice to meet you!")
```

调用上面的函数 `sayHi()` 会生成一个控制台消息。您可以亲自试一试这个例子。

### 函数如何返回值？
函数 `sayHi()` 未返回值，不过不必专门声明它（像在 Java 中使用 `void` 那样）。

即使函数确实有值，也不必明确地声明它。该函数只需要使用 return 运算符后跟要返回的值即可。

```js
function sum(iNum1, iNum2) {
  return iNum1 + iNum2;
}
```

下面的代码把 `sum` 函数返回的值赋予一个变量：

```js
var iResult = sum(1,1);
console.log(iResult);	//输出 "2"
```

另一个重要概念是，与在 Java 中一样，函数在执行过 return 语句后立即停止代码。因此，return 语句后的代码都不会被执行。

例如，在下面的代码中，控制台就不会显示内容：

```js
function sum(iNum1, iNum2) {
  return iNum1 + iNum2;
  console.log(iNum1 + iNum2);
}
```

一个函数中可以有多个 return 语句，如下所示：

```js
function diff(iNum1, iNum2) {
  if (iNum1 > iNum2) {
    return iNum1 - iNum2;
  } else {
    return iNum2 - iNum1;
  }
}
```

上面的函数用于返回两个数的差。要实现这一点，必须用较大的数减去较小的数，因此用 if 语句决定执行哪个 return 语句。

如果函数无返回值，那么可以调用没有参数的 return 运算符，随时退出函数。

例如：

```js
function sayHi(sMessage) {
  if (sMessage == "bye") {
    return;
  }

  console.log(sMessage);
}
```

这段代码中，如果 `sMessage` 等于 `"bye"`，就永远不显示控制台消息。

**注释：** 如果函数无明确的返回值，或调用了没有参数的 `return` 语句，那么它真正返回的值是 `undefined`。

## ECMAScript Function 对象（类）
ECMAScript 的函数实际上是功能完整的对象。

### Function 对象（类）
ECMAScript 最令人感兴趣的可能莫过于函数实际上是功能完整的对象。

Function 类可以表示开发者定义的任何函数。

用 Function 类直接创建函数的语法如下：

```js
var function_name = new function(arg1, arg2, ..., argN, function_body)
```

在上面的形式中，每个 `arg` 都是一个参数，最后一个参数是函数主体（要执行的代码）。这些参数必须是字符串。

记得下面这个函数吗？

```js
function sayHi(sName, sMessage) {
  console.log("Hello " + sName + sMessage);
}
```

还可以这样定义它：

```js
var sayHi = new Function("sName", "sMessage", "console.log(\"Hello \" + sName + sMessage);");
```

虽然由于字符串的关系，这种形式写起来有些困难，但有助于理解函数只不过是一种引用类型，它们的行为与用 Function 类明确创建的函数行为是相同的。

> [!note]
>
> 尽量不要使用这种方式定义函数。
>
> **永远、永远、永远不要执行用户提供的代码字符串**！你不知道里面会是什么！

请看下面这个例子：

```js
function doAdd(iNum) {
  console.log(iNum + 20);
}

function doAdd(iNum) {
  console.log(iNum + 10);
}

doAdd(10);	//输出 20
```

如你所知，第二个函数重载了第一个函数，使 `doAdd(10)` 输出了 `20`，而不是 `30`。

如果以下面的形式重写该代码块，这个概念就清楚了：

```js
var doAdd = new Function("iNum", "console.log(iNum + 20)");
var doAdd = new Function("iNum", "console.log(iNum + 10)");
doAdd(10);
```

请观察这段代码，很显然，`doAdd` 的值被改成了指向不同对象的指针。函数名只是指向函数对象的引用值，行为就像其他对象一样。甚至可以使两个变量指向同一个函数：

```js
var doAdd = new Function("iNum", "console.log(iNum + 10)");
var alsodoAdd = doAdd;
doAdd(10);	//输出 "20"
alsodoAdd(10);	//输出 "20"
```

在这里，变量 `doAdd` 被定义为函数，然后 `alsodoAdd` 被声明为指向同一个函数的指针。用这两个变量都可以执行该函数的代码，并输出相同的结果——`20`。因此，如果函数名只是指向函数的变量，那么可以把函数作为参数传递给另一个函数吗？回答是肯定的！

```js
function callAnotherFunc(fnFunction, vArgument) {
  fnFunction(vArgument);
}

var doAdd = new Function("iNum", "console.log(iNum + 10)");

callAnotherFunc(doAdd, 10);	//输出 "20"
```

在上面的例子中，`callAnotherFunc()` 有两个参数——要调用的函数和传递给该函数的参数。这段代码把 `doAdd()` 传递给 `callAnotherFunc()` 函数，参数是 `10`，输出 `20`。

**注意：** 尽管可以使用 Function 构造函数创建函数，但最好不要使用它，因为用它定义函数比用传统方式要慢得多。不过，所有函数都应看作 Function 类的实例。

### Function 对象的 length 属性
如前所述，函数属于引用类型，所以它们也有属性和方法。

ECMAScript 定义的属性 `length` 声明了函数期望的参数个数。例如：

```js
function doAdd(iNum) {
  console.log(iNum + 10);
}

function sayHi() {
  console.log("Hi");
}

console.log(doAdd.length);	//输出 "1"
console.log(sayHi.length);	//输出 "0"
```

函数 `doAdd()` 定义了一个参数，因此它的 `length` 是 1；`sayHi()` 没有定义参数，所以 `length` 是 0。

记住，无论定义了几个参数，ECMAScript 可以接受任意多个参数（最多 25 个），这一点在《函数概述》这一章中讲解过。属性 `length` 只是为查看默认情况下预期的参数个数提供了一种简便方式。

**编者注：** 在 ECMAScript 6 中，函数的参数允许有默认值。

### Function 对象的方法
Function 对象也有与所有对象共享的 `valueOf()` 方法和 `toString()` 方法。这两个方法返回的都是函数的源代码，在调试时尤其有用。例如：

```js
function doAdd(iNum) {
  console.log(iNum + 10);
}

document.write(doAdd.toString());
```

上面这段代码输出了 `doAdd()` 函数的文本。

## ECMAScript 闭包
> ECMAScript 最易让人误解的一点是，它支持闭包（closure）。

闭包，指的是词法表示包括不被计算的变量的函数，也就是说，函数可以使用函数之外定义的变量。

### 简单的闭包实例
在 ECMAScript 中使用全局变量是一个简单的闭包实例。请思考下面这段代码：

```js
var sMessage = "hello world";

function sayHelloWorld() {
  console.log(sMessage);
}

sayHelloWorld();
```

在上面这段代码中，脚本被载入内存后，并没有为函数 `sayHelloWorld()` 计算变量 `sMessage` 的值。该函数捕获 `sMessage` 的值只是为了以后的使用，也就是说，解释程序知道在调用该函数时要检查 `sMessage` 的值。`sMessage` 将在函数调用 `sayHelloWorld()` 时（最后一行）被赋值，显示消息 `"hello world"`。

### 复杂的闭包实例
在一个函数中定义另一个会使闭包变得更加复杂。例如：

```js
var iBaseNum = 10;

function addNum(iNum1, iNum2) {
  function doAdd() {
    return iNum1 + iNum2 + iBaseNum;
  }
  return doAdd();
}
```

这里，函数 `addNum()` 包括函数 `doAdd()` （闭包）。内部函数是一个闭包，因为它将获取外部函数的参数 `iNum1` 和 `iNum2` 以及全局变量 `iBaseNum` 的值。 `addNum()` 的最后一步调用了 `doAdd()`，把两个参数和全局变量相加，并返回它们的和。

这里要掌握的重要概念是，`doAdd()` 函数根本不接受参数，它使用的值是从执行环境中获取的。

可以看到，闭包是 ECMAScript 中非常强大多用的一部分，可用于执行复杂的计算。

**提示：** 就像使用任何高级函数一样，使用闭包要小心，因为它们可能会变得非常复杂。

> [!note]
>
> 这里讲得不清不楚的。闭包的本质是词法作用域。建议看那本《你不知道的 JavaScript》。
