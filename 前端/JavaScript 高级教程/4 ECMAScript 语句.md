# ECMAScript 语句

> ECMA - 262 描述了 ECMAScript 的几种语句（statement）。
语句主要定义了 ECMAScript 的大部分语句，通常采用一个或多个关键字，完成给定的任务。
语句可以非常简单，例如通知函数退出，也可以非常复杂，如声明一组要反复执行的命令。
在《ECMAScript 语句》这一章，我们介绍了所有标准的 ECMAScript 语句。

## ECMAScript if 语句

> if 语句是 ECMAScript 中最常用的语句之一。

### if 语句
if 语句是 ECMAScript 中最常用的语句之一，事实上在许多计算机语言中都是如此。

if 语句的语法：

```js
if (condition) statement1 else statement2
```

其中 `condition` 可以是任何表达式，计算的结果甚至不必是真正的 `boolean` 值，ECMAScript 会把它转换成 `boolean` 值。

如果条件计算结果为 `true`，则执行 `statement1`；如果条件计算结果为 `false`，则执行 `statement2`。

每个语句都可以是单行代码，也可以是代码块。

例如：

```js
if (i > 30)
  {console.log("大于 30");}
else
  {console.log("小于等于 30");}
```

**提示：** 使用代码块被认为是一种最佳的编程实践，即使要执行的代码只有一行。这样做可以使每个条件要执行什么一目了然。

还可以串联多个 `if` 语句。就像这样：

```js
if (condition1) statement1 else if (condition2) statement2 else statement3
```

例如：

```js
if (i > 30) {
  console.log("大于 30");
} else if (i < 0) {
  console.log("小于 0");
} else {
  console.log("在 0 到 30 之间");
}
```

## ECMAScript 迭代语句
> 迭代语句又叫循环语句，声明一组要反复执行的命令，直到满足某些条件为止。
循环通常用于迭代数组的值（因此而得名），或者执行重复的算术任务。
本节为您介绍 ECMAScript 提供的四种迭代语句。

### do-while 语句
do-while 语句是后测试循环，即退出条件在执行循环内部的代码之后计算。这意味着在计算表达式之前，至少会执行循环主体一次。

它的语法如下：

```js
do {statement} while (expression);
```

例子：

```js
var i = 0;
do {i += 2;} while (i < 10);
```

### while 语句
while 语句是前测试循环。这意味着退出条件是在执行循环内部的代码之前计算的。因此，循环主体可能根本不被执行。

它的语法如下：

```js
while (expression) statement
```

例子：

```js
var i = 0;
while (i < 10) {
  i += 2;
}
```

### for 语句
for 语句是前测试循环，而且在进入循环之前，能够初始化变量，并定义循环后要执行的代码。

它的语法如下：

```js
for (initialization; expression; post-loop-expression) statement
```

**注意：** post-loop-expression 之后不能写分号，否则无法运行。

例子：

```js
iCount = 6;
for (var i = 0; i < iCount; i++) {
  console.log(i);
}
```

这段代码定义了初始值为 0 的变量 i。只有当条件表达式 `i < iCount` 的值为 `true` 时，才进入 for 循环，这样循环主体可能不被执行。如果执行了循环主体，那么将执行循环后表达式，并迭代变量 `i`。

### for-in 语句
for 语句是严格的迭代语句，用于枚举对象的属性。

它的语法如下：

```js
for (property in expression) statement
```

例子：

```js
for (sProp in window) {
  console.log(sProp);
}
```

这里，`for-in` 语句用于显示 `window` 对象的所有属性。

前面讨论过的 `PropertyIsEnumerable()` 是 ECMAScript 中专门用于说明属性是否可以用 `for-in` 语句访问的方法。

## ECMAScript 标签语句
### 有标签的语句
可以用下列语句给语句加标签，以便以后调用：

```js
label : statement
```

例如：

```js
start : i = 5;
```

在这个例子中，标签 start 可以被之后的 `break` 或 `continue` 语句引用。

**提示：**在下面的章节，我们将为您介绍 break 和 continue 语句。

## ECMAScript break 和 continue 语句
> `break` 和 `continue` 语句对循环中的代码执行提供了更严格的控制。

### break 和 continue 语句的不同之处
`break` 语句可以立即退出循环，阻止再次反复执行任何代码。

而 `continue` 语句只是退出当前循环，根据控制表达式还允许继续进行下一次循环。

例如：

```js
var iNum = 0;

for (var i=1; i<10; i++) {
  if (i % 5 == 0) {
    break;
  }
  iNum++;
}
console.log(iNum);	//输出 4
```

在以上代码中，for 循环从 1 到 10 迭代变量 i。在循环主体中，if 语句将（使用取模运算符）检查 `i` 的值是否能被 5 整除。如果能被 5 整除，将执行 break 语句。控制台显示 `4`，即退出循环前执行循环的次数。

如果用 `continue` 语句代替这个例子中的 `break` 语句，结果将不同：

```js
var iNum = 0;

for (var i=1; i<10; i++) {
  if (i % 5 == 0) {
    continue;
  }
  iNum++;
}
console.log(iNum);	//输出 "8"
```

这里，控制台将显示 `8`，即执行循环的次数。可能执行的循环总数为 9，不过当 `i` 的值为 5 时，将执行 `continue` 语句，会使循环跳过表达式 `iNum++`，返回循环开头。

### 与有标签的语句一起使用
`break` 语句和 `continue` 语句都可以与有标签的语句联合使用，返回代码中的特定位置。

通常，当循环内部还有循环时，会这样做，例如：

```js
var iNum = 0;

outermost:
for (var i=0; i<10; i++) {
  for (var j=0; j<10; j++) {
    if (i == 5 && j == 5) {
      break outermost;
    }
  iNum++;
  }
}

console.log(iNum);	//输出 55
```

在上面的例子中，标签 `outermost` 表示的是第一个 for 语句。正常情况下，每个 for 语句执行 10 次代码块，这意味着 `iNum++` 正常情况下将被执行 100 次，在执行完成时，`iNum` 应该等于 100。这里的 break 语句有一个参数，即停止循环后要跳转到的语句的标签。这样 break 语句不止能跳出内部 for 语句（即使用变量 `j` 的语句），还能跳出外部 for 语句（即使用变量 `i` 的语句）。因此，`iNum` 最后的值是 55，因为当 `i` 和 `j` 的值都等于 5 时，循环将终止。

可以以相同的方式使用 continue 语句：

```js
var iNum = 0;

outermost:
for (var i=0; i<10; i++) {
  for (var j=0; j<10; j++) {
    if (i == 5 && j == 5) {
    continue outermost;
    }
  iNum++;
  }
}

console.log(iNum);	//输出 "95"
```

在上例中，continue 语句会迫使循环继续，不止是内部循环，外部循环也如此。当 j 等于 5 时出现这种情况，意味着内部循环将减少 5 次迭代，致使 `iNum` 的值为 95。

**提示：** 可以看出，与 break 和 continue 联合使用的有标签语句非常强大，不过过度使用它们会给调试代码带来麻烦。要确保使用的标签具有说明性，同时不要嵌套太多层循环。

**提示：** 想了解什么是有标签语句，请阅读 ECMAScript 标签语句 这一节。

## ECMAScript with 语句
> with 语句用于设置代码在特定对象中的作用域。

它的语法：

```js
with (expression) statement
```

例如：

```js
var sMessage = "hello";
with(sMessage) {
  console.log(toUpperCase());	//输出 "HELLO"
}
```

在这个例子中，with 语句用于字符串，所以在调用 `toUpperCase()` 方法时，解释程序将检查该方法是否是本地函数。如果不是，它将检查伪对象 `sMessage`，看它是否为该对象的方法。然后，控制台输出 `"HELLO"`，因为解释程序找到了字符串 `"hello"` 的 `toUpperCase()` 方法。

**提示：** with 语句是运行缓慢的代码块，尤其是在已设置了属性值时。大多数情况下，如果可能，最好避免使用它。

## ECMAScript switch 语句
### switch 语句
switch 语句是 if 语句的兄弟语句。

开发者可以用 switch 语句为表达式提供一系列的情况（case）。

switch 语句的语法：

```js
switch (expression)
  case value: statement;
    break;
  case value: statement;
    break;
  case value: statement;
    break;
  case value: statement;
    break;
  //...
  case value: statement;
    break;
  default: statement;
```

每个情况（`case`）都是表示“如果 `expression` 等于 `value`，就执行 `statement`”。

关键字 `break` 会使代码跳出 `switch` 语句。如果没有关键字 `break`，代码执行就会继续进入下一个 `case`。

关键字 `default` 说明了表达式的结果不等于任何一种情况时的操作（事实上，它相对于 `else` 从句）。

`switch` 语句主要是为避免让开发者编写下面的代码：

```js
if (i == 20)
  console.log("20");
else if (i == 30)
  console.log("30");
else if (i == 40)
  console.log("40");
else
  console.log("other");
```

等价的 switch 语句是这样的：

```js
switch (i) {
  case 20: console.log("20");
    break;
  case 30: console.log("30");
    break;
  case 40: console.log("40");
    break;
  default: console.log("other");
}
```

### ECMAScript 和 Java 中的 switch 语句
ECMAScript 和 Java 中的 switch 语句有两点不同。在 ECMAScript 中，switch 语句可以用于字符串，而且 **能用不是常量的值** 说明情况：

```js
var BLUE = "blue", RED = "red", GREEN  = "green";

switch (sColor) {
  case BLUE: console.log("Blue");
    break;
  case RED: console.log("Red");
    break;
  case GREEN: console.log("Green");
    break;
  default: console.log("Other");
}
```

这里，switch 语句用于字符串 sColor，声明 case 使用的是变量 BLUE、RED 和 GREEN，这在 ECMAScript 中是完全有效的。
