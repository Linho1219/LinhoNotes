**By FunnyAWM**

在之前的章节中，我们详细探讨了C++中类的各种机制，包括封装、友元、继承、多态等。这一章节作为对之前C++中类的补充讲解，继续探究C++中类的特殊函数。

# 1. 构造函数

我们在之前已经详细讲解过构造函数与初始化列表的用法、它们的调用顺序以及C++中类生命周期的开始标志。这一节我们来继续探究C++中一些其他的构造函数。

## 1. 复制构造函数

首先是复制构造函数。复制构造函数在对象被复制时调用，用于执行一些相关的I/O与内存操作。

这里可能有人会问：主播主播，对象的复制行为不是就把所有值从原对象复制到新对象就可以了吗？复制构造函数的存在意义是什么呢？我们来看下面一段代码：

```cpp
#include <cstring>
#include <iostream>

using std::cout;
using std::endl;

class String {
  char* content;
public:
  String() {
    content = nullptr;
  };
  explicit String(const char* str) { // 为构造函数添加explicit限定能够防止隐式转换导致的意外赋值
    content = new char[strlen(str) + 1];
    strcpy(content, str);
  }
  ~String() {
    delete[] content;
  }
  void print() {
  	if (!content) return;
    cout << content << endl;
  }
}
```

然后我们又有下面的代码：

```cpp
String str1("hello");
String str2 = str1;
```

这里的代码存在一个很严重的问题：在使用默认复制构造函数的情况下，复制构造函数会将所有变量的**字面值**赋值给新对象。也就是说，str1和str2的content存储的是同一个地址！这种情况在C++中被称作浅拷贝，意为只复制了内存地址而非完整复制其内容。

那么在这里的代码里，浅拷贝会导致什么后果呢？由于我们指定了析构函数的行为是回收内存，也就是说，当str1被销毁时，str2指向的地址已经失效；此时str2再进行销毁就会导致双释放，进而导致未定义行为。

> [!INFO] 名词解释
> 双释放：同一个内存地址被delete两次的行为。

那么要怎么解决这个问题呢？答案是手动定义复制构造函数，令其实现深拷贝。深拷贝与浅拷贝相对，它为新对象开辟了一块新的内存块，令新对象的指针指向这块新内存，然后把旧对象中的值完整复制到新对象中。针对上面的类，我们可以这样定义复制构造函数：

```cpp
// 类定义省略，只写复制构造函数
String(const String& other) {
  if(other.content) {
    content = new char[strlen(other.content)+1];
    strcpy(content, other.content);
  } else content = nullptr;
}
```

这样我们就通过复制构造函数部分解决了双释放问题。为什么说是部分解决呢？我们可以考虑一下下面的调用：

```cpp
String str1("hello");
String str2(str1); // OK，调用了复制构造函数
String str3 = str1; // OK，编译器自动选择了我们的复制构造函数
String str4;
str4 = str1; // 错误！=运算符的行为未使用我们的复制构造函数
```

这里=运算符装糖阴了我们一手，因为我们并没有指定=运算符的行为，而其默认行为与默认的复制构造函数几乎相同。区别在于，严格来说复制构造函数执行的操作是初始化，而=运算符执行的是赋值操作。也就是说我们利用手动定义的复制构造函数搭建了一条马奇诺防线，却被=轻松绕过了。这个问题其实也十分容易解决——我们只需要重载=运算符即可。我们补充下面的函数：

```cpp 
String& operator=(const String& other) {
    if (this != &other) {
        delete[] content; // 释放旧资源
        if (other.content) {
            content = new char[strlen(other.content) + 1];
            strcpy(content, other.content);
        } else {
            content = nullptr;
        }
    }
    return *this;
}
```

这样我们就能够彻底解决由赋值与拷贝导致的浅拷贝行为了。

## 2. 移动构造函数

移动构造函数主要供通过std::move等原地移动对象时调用。 我们之前在C++11的移动语义中讲过，对对象的移动行为的目的是转移资源的所有权，从而避免不必要的内存分配与数据拷贝，提升运行效率。在这个类中，我们可以这样写移动构造函数：

```cpp
String(String&& other) noexcept : content(other.content) { // 直接夺取原对象对资源的所有权
  other.content = nullptr; // 置空原对象的数据指针，防止析构时释放已有的资源
}
```

为什么移动构造函数要置空原对象的数据指针呢？原因在于：我们在初始化列表中指定了目标与原对象的数据指针指向的内存地址相同。这没有问题，毕竟移动语义的出现本来就是为了避免不必要的值复制，那么对于动态内存，当然是能够使用原来的内存块最好。问题在于：右值本来就是即将被销毁的值，如果我们没有将other的数据指针置空，那么在这个右值涉及的表达式执行完成以后，这个右值会立即被释放（因为它的生命周期即将结束，这个操作不由移动构造函数决定），调用它的析构函数，把我们移动好的数据一起带走。~~这样我们的移动操作就会全部木大~~

与复制构造函数的情况相似，我们定义了移动构造函数后，并不代表=运算符也会直接使用我们的移动构造函数。所以我们要补充一个移动赋值运算符重载：

```cpp
String& operator=(String&& other) noexcept {
	if (this != other) {
		delete[] content;
		content = other.content;
		other.content = nullptr;
	}
	return *this;
}
```
> [!TIPS] 关于返回\*this的说明
> 这里返回\*this是为了支持链式赋值（例如`String str1 = str2 = str3`这样的情况）。


## 3. explicit关键字

explicit关键字用于防止类型隐式转换造成的对象意外赋值。假设我们对上面的String类进行了扩充，添加了一项新的长度成员，考虑以下代码（我们假设String的所有函数都没有explicit，且长度需要手动传入以适应预分配内存的需要）：

```cpp
class String {
    char* content;
    size_t length;
public:
    // 非 explicit 构造函数
    String(const char* str) {
        length = strlen(str);
        content = new char[length + 1];
        strcpy(content, str);
    }
};

void process(const String& s) {
    std::cout << "String version" << std::endl;
}

void process(bool b) {
    std::cout << "Bool version" << std::endl;
}

int main() {
    process("hello");
}
```

这段代码在运行时会输出这个字符串是bool类型。为什么？因为"hello"这个字符串不仅可以被隐式转换为一个String对象，也可以作为一个bool类型的量被传入。

这个时候有人可能就要问了：主播主播，明明这个"hello"是一个字符串啊，为什么这个字符串能被转换成bool呢？这俩明明八竿子打不着，主播你是不是在乱说啊？

别急兄弟，别急。还记得我们之前讲过的数组退化吗？在这里，"hello"这个字符串的完整类型应该是一个char数组，因为C++并不像Java一样会将字符串统一转换为String类型。这样做的目的是为了兼容旧的C代码，因为C++标准规定任意合法的C代码也应该是合法的C++代码。而根据我们之前讲过的数组退化的规则，这个字符数组应该会退化为一个const char*类型，指向的是这个“字符串”的首个字符。同时，C++98标准的4.12中有如下规定：

> [!TIPS] C++标准
> A prvalue of arithmetic, enumeration, pointer, or pointer to member type can be converted to a prvalue of type bool. A zero value, null pointer value, or null member pointer value is converted to false; any other value is converted to true.
> 翻译：算术、枚举、指针或成员指针类型的纯右值可以转换为bool类型的纯右值。零值、空指针值或空成员指针值转换为false；任何其他值转换为true。

而且我们还要补充一个重要的事实：这条规则的优先级高于基础类型向自定义类型转换的转换等级。也就是说，这条规则会先于向我们自定义的String类型的转换而被执行（~~我\*这C++标准怎么这么坏~~）。而这个被转换的bool刚好对应上了我们的第二个process函数，进而导致了这样的输出。如果我们在构造函数中加入explicit，就能够通过更严格的限定条件来限制process函数的行为。怎么做呢？只需要这样调用process函数：

```cpp
process(String("hello"));
```

这样process函数就能够稳定调用针对String类型编写的重载，输出我们想要的结果了。
## 4. const函数与mutable关键字

在C++中，我们可以通过将成员函数声明为const来避免任何对类成员的意外修改。如果我们已经确定了某个函数中只涉及读操作，就可以使用这个关键字。这会在这个函数内部“锁定”所有成员变量，禁止对其进行任何修改。例如：

```cpp
const char* String::content() const {
  return content;
}
```

同时，如果我们希望对一些变量进行必要的修改，C++语言也提供了一个例外情况。const函数限定对mutable变量无效——声明为mutable的变量在所有成员函数中始终可写，同时不会影响对其他变量的“锁定”。这里我们也可以看出，对函数的const限定只是对其中的变量进行逻辑上的“锁定”，它只是一种编译期约定，并不会影响程序运行的内存布局。

> [!TIPS] 跨语言对比
> 现在越来越多的语言已经引入了“默认不可变”特性。例如Rust语言：
> ```rust
> fn main() {
>   let a:i32 = 123;
>   a = 456; // 错误！a并未被声明为可变变量
>   let mut b:i32 = 456;
>   b = 789; // OK，已显式指定b可变
> }
> ```

## 5. noexcept关键字

在C++11中新增了noexcept关键字，它的语义为：该函数永远不应抛出异常（将在后续详细讲解C++的异常机制）。在STL容器扩容时，如果移动构造函数有noexcept限定，容器会优先采用移动而非复制。如果没有这个限定，容器的扩容行为会退化为复制以求扩容时不会抛出异常。

> [!CAUTION] 注意
> 由于noexcept函数在异常逃逸出函数边界时会直接终止程序运行，除非确定函数在所有情况下都不会抛出异常，否则不要使用noexcept。

noexcept还可以作为运算符，在编译期检查表达式是否会抛出异常，常用于模板元编程。
## DLC：C++中关于类设计的3规则、5规则与0规则

在C++早期与移动语义引入时，曾经有人制定过关于这些函数定义的一些规则，这些规则现在已经被C++核心指南与Cpp Reference收录。其中：

- 3规则：如果类需要显式定义析构函数、复制构造函数与拷贝赋值运算符中的其中一个，那么通常说明你也需要定义其他两个。
- 5规则：在3规则的基础上，针对C++11的移动语义进行了扩充，5规则中包含了移动构造函数和移动赋值运算符重载。如果你需要手动定义这5个函数中的任意一个，那么通常说明你也要定义其他4个。
- 0规则：尽量不要手动定义任何特殊成员函数，完全依赖编译器生成的默认版本；涉及到资源管理的，直接使用具有RAII语义的STL容器，例如std::string、std::vector等（将在后续简单讲解STL容器）。

# 2. 运算符重载：不止>符号

根据C++标准的规定：能够实现重载的运算符有这些：

```
+    -    *    /    %    ^    &    |    ~
!    =    <    >    +=   -=   *=   /=   %=
^=   &=   |=   <<   >>   >>=  <<=  ==   !=
<=   >=   &&   ||   ++   --   ,    ->*  ->
()   []   new  delete  new[]  delete[]
```

不能的有这些：

```
.    .*   ::   ?:   sizeof   typeid
```

并且运算符重载有以下规则：

1. 重载后的函数必须以成员函数或全局函数存在，其中=、\[\]、\(\)、->运算符只能以成员函数形式存在；
2. 运算符重载不能改变运算符的优先级、结合性、操作数个数；
3. 只能针对现有运算符重载，不能发明新的运算符。

我们之前说过，C++中的cout与cin重载了<<与>>运算符用来输出与输入数据。那么我们能不能也重载这两个运算符，让cout和cin变成我们的形状呢？答案是可以。我们同样也可以通过在我们自己的对象里重载这两个运算符来实现输入或输出功能。以输出为例，如果我们想要上面的String对象在被cout输出时直接输出content，怎么做呢？~~通过查看iostream源文件，我们注意到~~通过百度查询，我们得知cout对象的本质是ostream标准类的实例化。接下来的事情就十分简单了——因为以cout为代表的ostream对象的输出可以拼接，我们可以通过让这个重载函数也返回ostream对象的方式来输出我们想要的内容。我们可以这样定义函数：

```cpp
#include <iostream>
using std::ostream;
ostream& operator<<(ostream& os,const String& output) {
	if (output.content() != nullptr) {
    os << output.content(); // 假设我们定义content函数能够拿到这个类的字符串内容，没有内容的时候返回nullptr
  }
	return os;
}
```

这样我们就可以美美编写以下的代码直接调用这个重载：

```cpp
String str("hello world");
cout << str << endl;
```

这样cout的输出就变成了我们自定义类型的形状了。在这里，cout会直接输出str的字符内容，符合我们的重载定义。实际上，由于ostream对象有拼接特性，我们能够对任意自定义类都这么做，还能在里面加入一些自定义的格式信息。

# 3. 模板类与泛型——大卫戴这一块

在类设计中，我们可以结合模板实现能够存放任意类型数据的数据容器。例如我们可以修改我们之前的栈定义，使其能够接受任意类型的数据：

```cpp
#include <cassert>

template<typename T>
class Stack {
private:
    static const int MAX_SIZE = 100;   // 常量定义最大栈大小
    T data[MAX_SIZE];                 // 静态数组存储元素
    int topIndex;                        // 栈顶索引，-1 表示空栈

public:
    // 构造函数：初始化为空栈
    Stack() : topIndex(-1) {}

    // 入栈：成功返回 true，栈满返回 false
    bool push(const T& value) {
        if (isFull()) {
            return false;
        }
        data[++topIndex] = value;
        return true;
    }

    // 出栈：成功返回 true，栈空返回 false
    bool pop() {
        if (isEmpty()) {
            return false;
        }
        --topIndex;
        return true;
    }

    // 非 const 版本：可以修改栈顶元素
    T& top() {
        assert(!isEmpty() && "Stack is empty, cannot get top.");
        return data[topIndex];
    }

    // const 版本：只读访问
    const T& top() const {
        assert(!isEmpty() && "Stack is empty, cannot get top.");
        return data[topIndex];
    }
    // 判断栈是否为空
    bool isEmpty() const {
        return topIndex == -1;
    }

    // 判断栈是否已满
    bool isFull() const {
        return topIndex == MAX_SIZE - 1;
    }

    // 返回当前栈中元素个数
    int size() const {
        return topIndex + 1;
    }
};
```

这样我们就能够在定义这个栈变量时通过指定不同的数据类型来让这个容器存储不同类型的数据：

```cpp
Stack<int> intStack; // 这个栈可以存储int数据
Stack<std::string> stringStack; // 这个栈可以存储字符串
Stack<String> customStringStack; // 这个栈可以存储我们自己的String类
```

这也就是STL容器能够存储任意类型数据的秘密——通过泛型编程，我们可以让这些容器存储任意类型的数据，只需要在定义变量时指定要存储的类型即可。在C++中，编译器会通过为使用了泛型的类型各生成一套对应的类代码来实现泛型特性，这是C++标准的主动选择。这种实现方法对比Java虽然增加了些许的编译时的时间与空间成本，但能够实现对任意数据类型的支持。

> [!TIPS] 跨语言对比
> 在Java中，泛型通过编译时类型擦除来实现。对于任意泛型代码，Java在编译时会令所有泛型类型（即菱形括号中包含的类型）全部退化成这个类的上界类，如果这个类没有明显的上界类，它就会被擦除成Object类，这是整个Java中所有类的基类。Java能够实现类型擦除机制的基础是"Object类是所有类的基类"这个事实，而C++虽然要所有类型生成多份实例化代码，但这也造就了C++泛型模板对所有类型的兼容性。Java的泛型并不能应用于int、double等基础数据类型，必须通过装箱类装箱成Integer类、Double类等才能使用泛型特性。与其争论这两种方法谁优谁劣，不如接受这两种方法为两种语言独特的设计哲学。
