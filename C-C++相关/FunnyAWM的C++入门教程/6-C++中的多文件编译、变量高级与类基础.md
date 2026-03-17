###### By FunnyAWM

# 1. 多文件编译

## 1. 多个文件的编译与链接

C++编译器允许将多个源文件在一起编译。假设我们有一个头文件，里面放置了需要的所有函数的声明；有一个源文件，里面放置了这些函数的定义，还有一个源文件包含了main函数。这样的文件结构在C++项目中其实十分常见（例如Qt的默认CMake项目模板就仅在main函数中创建了QApplication与主窗体以及显示主窗体与退出的逻辑，主窗体的头文件与源文件分离，由UIC（UI编译组件）与MOC（用于信号等的编译组件）编译的头文件与原头文件分离）。这样的项目该如何进行编译呢？

我们在第一章讲过CMake的使用方法。对于这样的多文件编译，我们只需要在add_executable中添加上我们需要添加到目标可执行文件的源文件，例如：

```cmake
add_executable(my_program
        main.cpp server.cpp client.cpp)
```

> **注意**：一般不把头文件放在添加的源文件列表。

这样的话，在CMake生成配置文件时，就会生成将这三个源文件编译成一个可执行文件的配置。在使用构建工具（例如Make或Ninja）时，如果部分源文件已经编译并生成了链接文件，构建工具会自动跳过没有更改的源代码，只对修改后的文件进行重新编译，最后链接成可执行文件。

这样的做法在Linux内核等C/C++项目中极为常见，这是因为我们希望无关的功能与功能之间不要过于紧密地联系，同时我们希望将所有功能相关的代码放在一起，以便在编写代码时进行查找。这样的原则在面向对象编程中叫做“高内聚、低耦合”，是编写高可维护程度代码的基础。

> 内聚：某一模块内部各元素的关联程度。一般来说，内聚更高的代码在修改时对外部影响较小，这是我们想要的结果。
> 耦合：程序模块之间各元素的关联程度。除非必要，我们一般希望模块之间的耦合越低越好，避免对某一模块的修改影响其他模块行为。

## 2. 预编译指令

在最开始的时候，我们已经学过了我们的第一个预编译指令——#include。它的语义为：将我们指定的头文件包含至目标源文件中。在我们自己编写头文件时，我们就不能用\<\>来包含头文件了。这是因为\<\>是针对编译器的头文件路径进行包含的，对于我们自己的头文件来说，应该使用""。例如：

```cpp
#include "my_header.h"
```

这样编写，编译器就会在源文件的目录中查找my_header.h头文件。这样查找的路径被称为相对路径，这里的相对指的是相对头文件路径而言的文件路径。例如，假设我们包含下面的头文件：

```cpp
#include "src/my_header.h"
```

编译器会在这个源文件同级的文件中查找src文件夹，再在src文件夹下查找my_header.h头文件。

除了#include以外，还有很多常用的预编译指令，例如#ifndef、#ifdef、#define、#endif、#pragma等。

#ifndef与#define组合使用可以防止头文件被多重包含。例如在上面的my_header.h中，我们编写了以下内容：

```cpp
#ifndef MY_HEADER_H
#define MY_HEADER_H
int add(int a, int b);
#endif
```

这样在编译器编译程序时，如果已经定义过my_header.h中的内容，再次包含这个头文件时，编译器会自动跳过这个定义步骤。

#ifdef检查编译器是否定义了这个变量。这个指令可以用于操作系统检测。例如：

```cpp
#ifndef LINUXSINGLEINSTANCE_H
#define LINUXSINGLEINSTANCE_H
#include <QCoreApplication>
#include "Logger.h"

// 根据平台选择不同的头文件
#if defined(_WIN32) or defined(_WIN64)
#include <Windows.h>
#elif defined(__linux)
#include <QString>
#include <fcntl.h>
#include <sys/stat.h>
#include <unistd.h>
#endif

#if defined(_WIN32) or defined(_WIN64)
/**
 * @brief Windows平台的单实例检查函数
 * 使用Windows互斥量(Mutex)来确保应用程序只运行一个实例
 * @param mutex 互斥量句柄的引用，用于返回创建的互斥量
 * @return 如果是第一个实例返回true，否则返回false
 */
inline bool singleInstance(HANDLE& mutex) {
    // 创建命名互斥量，名称为应用程序名称
    mutex = CreateMutex(nullptr, TRUE, QCoreApplication::applicationName().toStdWString().c_str());

    // 检查是否已存在同名互斥量
    if (GetLastError() == ERROR_ALREADY_EXISTS) {
        CloseHandle(mutex);  // 关闭句柄
        return false;        // 表示已有实例在运行
    }
    return true;  // 表示这是第一个实例
}

#elif defined(__linux)
/**
 * @brief Linux平台的单实例检查函数
 * 使用文件锁来确保应用程序只运行一个实例
 * @return 成功时返回文件描述符，失败时返回-1
 */
inline int singleInstance() {
    // 构建锁文件路径：/tmp/应用程序名.lock
    QString lockFileBuilder = "/tmp/";
    lockFileBuilder += QCoreApplication::applicationName();
    lockFileBuilder += ".lock";

    // 创建或打开锁文件
    const int fd = open(lockFileBuilder.toStdString().c_str(), O_RDWR | O_CREAT, 0666);
    if (fd == -1) {
        Logger::Warn("Failed to open lock file: " + lockFileBuilder);
        return -1;
    }

    // 设置文件锁结构
    flock lock{};
    lock.l_type = F_WRLCK;    // 写锁类型
    lock.l_whence = SEEK_SET; // 从文件开始位置
    lock.l_start = 0;         // 偏移量为0
    lock.l_len = 0;           // 锁定整个文件

    // 尝试获取文件锁
    int result = fcntl(fd, F_SETLK, &lock);
    if (result == -1) {
        Logger::Warn("Failed to lock file: " + lockFileBuilder);
        close(fd);
        return -1;  // 锁定失败，表示已有实例在运行
    }

    // 截断文件并写入当前进程ID
    ftruncate(fd, 0);
    result = static_cast<int>(write(fd, QString::number(getpid()).toStdString().c_str(),
                                   QString::number(getpid()).length()));
    if (result == -1) {
        Logger::Warn("Failed to write lock file: " + lockFileBuilder);
        close(fd);
        return -1;
    }

    return fd;  // 返回文件描述符，表示成功获取锁
}
#endif

#endif // LINUXSINGLEINSTANCE_H
```

上面的代码中，我们通过判断是否定义\_WIN32或\_WIN64来判断编译器是否运行在Windows系统下，通过判断是否定义\_\_linux来判断编译器是否运行在Linux系统下。

这样的代码在Windows下与Linux下的编译结果不同——Windows使用互斥句柄来锁定唯一进程实例，Linux使用文件锁来锁定唯一进程实例。

这样的策略在跨平台应用编写下十分有用——不同的操作系统的底层实现可能不同，可以用这种方式区分不同系统的不同底层实现，称为条件编译。

#pragma用于为编译器指定一些特殊参数。例如在部分较新的编译器实现下，还可以通过这样的方式防止头文件被多重包含：

```cpp
#pragma once
// 编写你需要的代码
```

# 2. 变量的高级应用

## 1. 跨文件使用变量

可以使用extern关键字标识需要跨文件访问的变量。例如我们有如下变量定义：

```cpp
int value = 1;
```

如果我们希望在其他源文件中使用这个变量，只需要写：

```cpp
extern int value;
```

这样编译器就会将该变量的引用保留到链接阶段处理。值得注意的是，如果我们要将一个变量声明为外部文件可使用，那么这个变量必须是全局变量。换言之，声明为外部文件可用的变量不能仅存在于某个函数或代码块中——它必须在整个文件中都可用。

当使用extern使用外部文件的变量时，我们只能对该变量进行声明，不能在声明变量时修改它的值。例如下面的写法就是不正确的：

```cpp
extern int value = 2;
```

在C++17及以后，我们还可以使用inline来定义变量。它的语义是：在多个源文件同时使用这个头文件中的inline变量时，仅为这个变量保留一份实例。

## 2. 变量类型推导

我们可以使用auto关键字来令编译器在编译时自行推导变量类型。例如我们有下面的变量定义：

```cpp
std::vector<std::string> vec;
std::vector<std::string>::iterator it = vec.begin();
```

上面的代码声明了一个针对存储string的vector对象的迭代器（将在后续讲解STL容器与迭代器模式）。如果我们每次要声明迭代器时都需要写这么一长串比命还长的类型，那多这么来几次我们就会疯的。我们可以用auto来简化上面的迭代器声明：

```cpp
std::vector<std::string> vec;
auto it = vec.begin();
```

但是用auto也有一个缺点。例如我们要推导以下的类型：

```cpp
const int val = 114;
const int& valRef = val;
auto valAuto = valRef; // 这里会丢失const限定符与引用类型导致意外的值复制
```

C++11开始引入了decltype关键字来解决这个问题。在C++11下，我们可以将上面的声明改写成：

```cpp
const int val = 114;
const int& valRef = val;
decltype(valRef) valDecl = valRef;
```

这样声明的valDecl仍然是引用类型，同时不会丢失const限定。

从C++14开始，我们可以将decltype与auto一起使用，上面的声明可以写成：

```cpp
decltype(auto) valDeclAuto = valRef;
```

这样我们可以保留完整的变量类型，可以在后续结合前面提到过的右值引用、移动语义等实现完美转发等操作。例如：

```cpp
template<typename T>
decltype(auto) forward_example(T&& t) {
    return std::forward<T>(t);
}
```

这样我们可以将任意类型的变量通过这个函数转换成右值引用，再调用std::forward函数实现完美转发。

> 完美转发：将一个函数参数以原样转发给另一个函数，同时不丢失限定条件（例如引用标识、CV限定符等）。完美转发的变量可以当做传递给原函数的变量使用。

decltype结合模板能够实现根据传入参数类型自动调整返回值类型。例如：

```cpp
template<typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {
    return a + b; // 返回类型取决于 a+b 的结果类型，例如 int+double 将返回 double
}
```

这样可以极大减少我们的工作量，实现更高的程序编写效率。

## 3. CV限定符

我们可以用CV限定符为变量添加限制条件。CV限定符只有2个——const与volatile。const的含义我们之前已经详细讲述过，这里解释volatile的含义。

volatile适用于在程序中不会显式变化，但会由外部操作（例如硬件、其他线程运行的程序）进行变化的量。例如：

```cpp
// 定义引脚
const int ledPin = 13;      // LED连接到数字引脚13（板载LED）
const int buttonPin = 2;    // 按钮连接到数字引脚2（对应中断0）

// 中断标志，必须用 volatile 修饰
volatile bool buttonPressed = false;

// 中断服务函数（ISR），应尽量简短
void handleInterrupt() {
  buttonPressed = true;     // 仅设置标志，不做其他操作
}

void setup() {
  pinMode(ledPin, OUTPUT);                  // 设置LED引脚为输出
  pinMode(buttonPin, INPUT_PULLUP);         // 启用内部上拉电阻，按钮按下时为LOW
  // 将中断附加到按钮引脚，下降沿触发
  attachInterrupt(digitalPinToInterrupt(buttonPin), handleInterrupt, FALLING);
}

void loop() {
  if (buttonPressed) {                        // 检查是否有中断发生
    delay(50);                                // 简单延时，避开机械抖动
    // 再次确认按钮是否真的按下（可选，但能增强可靠性）
    if (digitalRead(buttonPin) == LOW) {
      // 切换LED状态
      digitalWrite(ledPin, !digitalRead(ledPin));
    }
    buttonPressed = false;                    // 清除标志，准备下一次触发
  }
  // 此处可放置其他需要循环执行的代码
}
```

这里我们将按钮的两边分别连接至D2口与GND，同时启用D2的内置上拉电阻，这个电阻能够在没有外部信号输入时将对应GPIO口的读数保持在高电平。attachInterrupt函数设定微处理器在D2口被拉至低电平时执行handleInterrupt函数，这里attachInterrupt传入的函数的存在形式是我们之前说过的函数指针。

那么D2在什么情况下能够被下拉至低电平呢？还记得我们的那个按钮吗？那个按钮的两边分别连接了D2与GND。当按钮被按下时，电路导通，电流全部流向GND，因此D2的电压直接被拉至0V，被识别为下拉至低电平。而我们的中断函数被设置为D2下拉时触发（下降沿触发），此时执行中断例程函数，改变LED灯的状态。虽然我们并没有在程序中显式修改buttonPressed的值，但这个值会随着按钮按下被硬件自动更改。

虽然我们详细描述了volatile的用法，但volatile的准确语义是什么呢？计算机组成原理的知识告诉我们，现代处理器为了能够快速读取内存中的热点数据，会在处理器单元与内存之间加上一块容量非常小，但速度非常快的内存块，称为缓存。缓存又可以通过内部读写速度的不同分为一级、二级、三级等X级缓存（即常说的LX缓存）。例如在英特尔酷睿i7-13620H中，CPU拥有24M的三级缓存。

缓存的优点显而易见：我们能够将常用的热点数据放在缓存中，从而提升程序的运行速度。缺点在于，由于缓存拥有更新周期，如果我们在访问某些变量时访问到了缓存中的值，但内存中的值已经更新，就会导致缓存与内存中数据的不一致状态。

在C++程序运行时，操作系统一般会选择将程序中的热点数据放入缓存，volatile关键字告诉操作系统，不要将数据放入缓存，每次使用变量时从内存中读取最新值。

在C++11及以后的标准中，由于C++提供了atomic头文件，多线程同步变量不再使用volatile，通常使用atomic对象创建原子变量。

# 3. 类与对象

## 1. 类简介

在日常生活中，有一些事物拥有相同或类似的属性（例如不同品牌的汽车、不同班的学生等）。在程序中，与函数相似，也可能会有一些代码表现出相同或相似的特性与行为，我们可以将这些代码统一使用类来表达这些特性与行为，这些同时拥有特定特性与行为的类型的集合称为对象。类是用于描述对象特性与行为的代码，将一些表现出相同或相似的特性与行为的代码归为一类的过程被称为抽象。

在C++中，通常用以下代码来创建类：

```cpp
class Example {
private:
    int a;
    float b; // 在这里出现的所有变量称为成员
public:
    Example(); // 特殊：构造函数
    ~Example(); // 特殊：析构函数
    void doA();
    void doB(); // 在这里出现的所有函数称为方法
};
```

上面的例子创建了C++中的一个简单类。类实例化后的产物称为对象。

> 实例化：由类初始化在代码中可以访问的变量的过程。

代码中的private:与public:称为访问控制符，其中private、public、protected为C++关键字，描述了在这些标签下的数据的可访问性。其中：

- private：表示标记为该等级的成员和方法仅能被此对象访问（友元类除外，将在后续说明）；
- public：表示标记为该等级的成员和方法能被以任意方式访问；
- protected：表示标记为该等级的成员和方法仅能被此对象及此对象派生的对象访问（将在后续讲解类的继承机制）

我们能够在类的内部定义类函数，也可以在类声明中先声明函数，再在类外进行定义。如果需要在类内部定义函数，只需要修改上面的示例，添加上函数定义即可。下面的例子说明了在类内定义函数的方式：

```cpp
// 上面的代码与创建类的代码相同
    doB() {
        printf("B done!\n");
    }; // 在这里出现的所有函数称为方法
```

在类外部定义类内的函数时，需要说明函数定义的作用域。例如：

```cpp
void Example::doB() { // 这里的Example::说明了我们需要定义Example类内的函数
    printf("B done!");
}
```

> 作用域：描述了变量或函数在整个程序中的作用范围。在上面的例子中，Example::doB说明了我们需要定义Example类中的doB函数，如果不带Example::，则doB函数与Example类无关，可以在所有包含了这些代码的范围内调用，同时调用Example类中的doB函数也不会调用全局内的doB函数。

## 2. 接口与抽象

在程序开发中，与函数类似，我们希望有代码能在部分场合下提供一种通用的类，这些类被称为接口。例如：

```cpp
class AudioPlayer {
private:
    bool status; // 播放状态，true代表正在播放，false代表暂停或播放完毕
public:
    playMP3(string path);
    playFLAC(string path);
    playWAV(string path); // 这里假设所有函数都在类外定义，且能够实现预期功能
}
```

这样，如果我们需要播放任何MP3音频，只需要先创建AudioPlayer对象，再调用对应的方法即可。例如我们在/home/user下有一个bgm.mp3文件，要在代码中播放它，只需要写：

```cpp
AudioPlayer player;
player.playMP3("/home/user/bgm.mp3");
```

公共库中一般都有丰富的接口。例如在TagLib（用于音频元数据读取）库中，就有能够读取各类音频文件标题、艺术家、专辑、年份等的接口。这些接口极大地降低了我们的开发成本，方便了我们的开发过程，这也是公共接口的存在意义。

最常被使用的公共接口是系统内核，系统内核提供了一系列函数用于操作硬件，例如读取鼠标与键盘的输入、将输出显示在屏幕上、根据优先级调度CPU完成任务等。同时由于内核直接操作硬件，编写能够良好运行、适配各种硬件的内核是一项十分困难的工作。

## 3. 特殊函数：构造函数、析构函数

在上面的例子中，有两个函数被注释标记为特殊函数：

```cpp
Example(); // 特殊：构造函数
~Example(); // 特殊：析构函数
```

这些函数有其特定的格式与调用时机，称为构造函数与析构函数。

构造函数在创建对象时调用。构造函数没有返回值，且函数名与类名相同。例如在上面的Example类中，我们将构造函数定义如下：

```cpp
Example::Example() { // 不要忘记指定作用域
    a = 100;
    b = 200.0;
    printf("a=%d, b=%.1f\n", a, b);
}
```

那么每次Example被创建时，程序都会有如下输出：

```text
a=100, b=200.0
```

并且如果在Example内部调用a与b时，会发现a的初始值为100，b的初始值为200。

析构函数在销毁对象时调用。析构函数同样没有返回值，以~[类名]的格式声明。例如在上面的Example类中，我们将析构函数定义如下：

```cpp
Example::~Example() { // 不要忘记指定作用域
    printf("队友呢 队友呢 救一下啊！\n");
}
```

再加上下面的代码：

```cpp
if (true) {
    Example e;
}
```

上面的代码输出就应该是：

```text
a=100, b=200.0
队友呢 队友呢 救一下啊！
```

这里Example被销毁的原因是：由于Example在if块创建，Example类的生存周期就是if块内。当if块执行完毕时，Example的生存周期结束，于是被销毁，占用的内存被回收。

## 4. this指针

在类内访问类自己的成员不需要指定作用域。例如，我们有如下类定义：

```cpp
class Number {
    int value; // 如果最开始没有指定范围限定，则直到指定限定为止的所有成员和方法都是private属性
public:
    Number() = default; // C++11标准开始，构造函数/析构函数如果等于default，则使用对象的默认行为，这里的默认行为是什么也不做
    ~Number() = default; // 同上
    Number greater(Number num);
    int value() { return value };
    void setValue(int _value) { value = _value } // 我们能够直接在类内使用它自己的成员
}
```

这里，我们希望greater函数对传入的num对象和自身进行比较，以Number对象的形式返回其中的较大者。但是在函数定义中，我们遇到了一个问题：

```cpp
Number Number::greater(Number num) {
    if (num.value() > value) {
        return num;
    } else {
        return ????? //这里我们应该让函数返回什么呢？
    }
}
```

在上面的代码块中，我们需要一种方法来访问类实例化后的对象自身，但是我们并不知道该如何表达这个自身。那么可能有人就要问了：主播主播，在C++里有没有这样的概念呢？

有的兄弟，有的。

在C++中，使用this指针来表示类实例化后的对象自身。这样，我们就能将上面的函数写成：

```cpp
Number Number::greater(Number num) {
    if (num.value() > value) {
        return num;
    } else {
        return *this;
    }
}
```

这样我们就能够用greater函数比较两个对象，将较大的那个Number对象返回了。这项工作能够使用运算符重载更加优雅的完成（将在后续介绍运算符重载）。

## 5. 类作用域

类内所有变量的作用域是类自身，也就是说，如果我们有上面的Number类定义，我们可以在Number类外定义value变量，并且不会报错，类外的value变量与类内的无关。

### 1. 类内的常量

如果我们想在类内定义常量，该怎么做呢？例如，我们有一个公共的Math接口用来完成数学相关的计算工作，类定义如下：

```cpp
class Math { // 通常情况下，如果C++有Math类，这个Math类不应该要求实例化，这里仅作为示例
    const float PI = 3.141592654;
public:
    float sin(float val);
    float cos(float val);
}
```

这样的代码会在定义float常量时报错。这是因为声明只告诉了编译器该怎么做，创建对象是另外的代码。因此在创建对象前，没有内存空间用来存储PI的值。我们可以这样做：

```cpp
class Math { // 通常情况下，如果C++有Math类，这个Math类不应该要求实例化，这里仅作为示例
    static const float PI = 3.141592654;
public:
    float sin(float val);
    float cos(float val);
}
```

这里我们使用了static关键字定义了一个静态常量，这个常量会在程序初始化时创建，而且在所有Math对象中共享。

## 6. 抽象数据类型

类的另一个非常有用的用途是创建抽象数据类型(Abstract Data Type, ADT)，这样的类逻辑在语言间通用。例如，我们需要创建一个栈的定义，该怎么做呢？

首先，我们需要知道栈的一些基本特征：

- 栈的本质是线性表（即一般认为的数组）；
- 对栈能够进行两种操作：入栈、出栈；
- 栈是后进先出(LIFO)的；

这样我们就能够写出这样的栈定义：

```cpp
#include <cassert>

class Stack {
private:
    static const int MAX_SIZE = 100;   // 常量定义最大栈大小
    int data[MAX_SIZE];                 // 静态数组存储元素
    int topIndex;                        // 栈顶索引，-1 表示空栈

public:
    // 构造函数：初始化为空栈
    Stack() : topIndex(-1) {}

    // 入栈：成功返回 true，栈满返回 false
    bool push(int value) {
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

    // 返回栈顶元素（调用前应确保栈非空）
    int top() const {
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

类还能够实现更多抽象数据类型，例如链表、字符串、图等。

## 6. 设计类的原则

在设计C++类的时候，我们应该遵循下面的一些基本原则，这些原则对其他面向对象的程序语言也一样适用：

- SOLID原则：面向对象程序设计的最基本的原则，包括：
    - 单一职责原则（Single Responsibility Principle，SRP）：一个类只应该专注于做一件事情。
    - 开闭原则（Open-Close Principle，OCP）：一个类应当对扩展开放，对修改关闭。我们应该对原有的抽象类进行扩展来扩展类的行为，而不是通过修改其功能来适应需要。
    - 里氏替换原则（Liskov Substitution Principle，LSP）：子类可以扩展父类的功能，但不能改变父类原有的功能实现。这样可以确保我们在使用所有同级子类时，这些子类可以随意替换来适应不同的场景。
    - 接口隔离原则（Interface Segregation Principle，ISP）：客户端不应该被迫依赖它不使用的方法。例如如果我们的应用需要一个访问LLM API端点的接口实现文本聊天，那么这个接口就不应该同时包含图像识别和工具调用功能。
    - 依赖反转原则（Dependency Inversion Principle，DIP）：高层模块不应依赖低层模块，二者都应依赖抽象接口。抽象不应依赖细节，细节应该依赖抽象。这能降低类之间的耦合。例如我们可以通过为所有API提供商创建一个ApiBase抽象类，这个抽象类描述了所有API提供商应该实现的方法以及应有的必要数据，而具体的数据填充与操作执行由抽象类上层的提供商类进行。

其他原则包括迪米特法则（最少知识原则，指一个对象应对其他对象有最小的了解，有助于降低耦合）、高内聚低耦合原则（前面已经详细介绍过）等等。这些原则为我们设计可复用性更高、调试成本更低的类提供了行为指导。
