在之前的章节中，我们简单提及了智能指针、RTTI与RAII的概念，但并没有深入进行讲解。这一章中我们来详细讲述C++的这3个概念。这3个概念都是现代C++中不可或缺的基石，是C++区别于“C With Classes”的关键。

# 1. 智能指针

## 1. auto_ptr：哎你怎么似了

首先是auto_ptr，这是C++中最早提出的智能指针，已经在C++11标准中被弃用，在C++17中被移除。它与之后要讲的unique_ptr都有一个共同的特性——它保证同一时刻只有一个智能指针拥有它管理的内存，并且会在析构时自动回收这块内存。但是在C++11标准提出以后，auto_ptr本身却有生以来第一次——似了。为什么这么好的概念被弃用了呢？准确来说，被弃用的是auto_ptr本身，而非智能指针这个概念。auto_ptr被弃用的原因如下：

- 引入时没有移动语义，但是看起来像复制：正所谓“领先一步是先驱，领先两步是先烈”，auto_ptr出现的时代还没有移动语义，但是C++标准委员会又希望auto_ptr实现当时认为的“移动”行为，于是就导致了以下惨案：由于当时还没有提出移动语义的概念，开发者以为对auto_ptr的拷贝复制是“复制”行为，但其实是“移动”，导致原指针被置空，产生未定义行为；更要命的是，等C++11真正引入了移动语义以后，auto_ptr的行为已经无法被更改了（因为要实现对之前标准的向下兼容，并且C++标准发布十分缓慢，还真不能说改就改），所以当移动语义被提出的时候，已经没人管auto_ptr的死活了。一刻也没有为auto_ptr的死感到哀悼，接下来赶到战场的是——unique_ptr和shared_ptr！
- 无法用于标准容器：由于auto_ptr的“复制即转移”特性，auto_ptr不符合STL容器对元素的可复制要求；
- 不支持数组：auto_ptr的析构写死了使用delete而非delete[]，如果使用auto_ptr指向数组，析构时会直接暴死。

鉴于上述原因，现在已经几乎没有人再去使用auto_ptr了，C++11引入的unique_ptr完全能够成为auto_ptr的上位替代。

## 2. unique_ptr：真正的auto_ptr

实际上，虽然当时auto_ptr随着移动语义的提出而直接C位出殡，但是没事：auto_ptr自己似了，但精神还活着——智能管理内存的需求尚未消退，且亟待解决。为了解决auto_ptr留下的历史遗留问题，C++选择直接新造了unique_ptr来替代auto_ptr（事实上在这几个智能指针被提出以后智能指针这一概念才真正逐步成熟），同时引入了shared_ptr来应对需要“多个指针指向同一内存块”的情况；以及weak_ptr作为补充，解决shared_ptr的循环引用问题。

要使用这些智能指针类，我们首先需要包含memory头文件，这个头文件实现了一切关于智能指针的类与函数。然后，我们可以像下面一样使用智能指针：

```cpp
std::unique_ptr<int> p(new int); // 这里利用了直接构造方法定义了一个拥有1个int存储空间的智能指针，并赋初值为10
std::unique_ptr<int[]> p(new int[10]); // 对于数组，使用这个模板
```

事实上，如果项目使用了C++14及以上标准，上面的定义还可以直接简化为：

```cpp
auto p = std::make_unique<int>(10);
auto p = std::make_unique<int[]>(10);
```

与STL容器一样，unique_ptr也是泛型类，初始化及声明时需要指定要特化的数据类型。

但是unique_ptr引入了一个新的问题——既然unique_ptr完全独占了它指向的数据，那么如果我需要把这块内存的所有权转移给其他unique_ptr对象，怎么做呢？答案也十分简单——使用移动语义：

```cpp
auto p1 = std::make_unique<int>(10);
auto p2 = std::move(p1);
```

所有智能指针类都能够当做普通指针来直接访问（weak_ptr除外，对于weak_ptr，需要先调用lock方法提升为shared_ptr才能直接使用）。例如针对上面的int指针p，要修改它的值，只需要这样写：

```cpp
*p = 20;
```

如果需要这个指针指向的内存块的原始地址用来和旧代码交互，只需要调用它的get方法即可。例如：

```cpp
int* raw = p.get();
```

这里可能有人要问了：主播主播，你不是说unique_ptr完全独占了这块内存，不允许其他指针指向它吗？怎么这里用普通指针类型又可以了？答案是——因为普通指针并不拥有数据的所有权。但是有一点需要注意——当智能指针自动释放或由我们手动释放内存后，调用get方法获取的地址也会无效，指向这个地址的所有指针都会变成野指针。除非需要和旧代码进行交互，否则尽量不要使用get方法获取原始地址给普通指针使用。

如果我们希望立即回收unique_ptr指针指向的内存，可以使用reset方法。在调用reset方法之后，unique_ptr指向的地址回到nullptr，同时使用的内存被回收。

release方法用于放弃该智能指针对数据的所有权，返回一个原始内存地址。可以通过这样的方式来转换unique_ptr指针到普通指针。

> [!ERROR] 警告
> 转换为普通指针后，这块内存会失去所有的智能指针特性，并且内存需要手动释放。除非需要与旧API交互，强烈不建议实施这样的转换。对于转移所有权的场合，直接使用移动语义会更好。

## 3. shared_ptr：共享内存

与unique_ptr相对，shared_ptr专门用于解决unique_ptr无法用多个指针指向同一内存块的问题。要初始化shared_ptr，除了直接调用构造函数进行初始化，还可以用以下方式：

```cpp
auto shared = std::make_shared<int>(10);
```

那么shared_ptr是怎么实现能够让多个指针指向同一内存块，还能在这些指针的生命周期全部结束时正确释放内存的？答案是引用计数。在shared_ptr内部，会维护一个计数器，这个计数器会统计这个shared_ptr指向的内存块还有多少智能指针指向。当有一个新的shared_ptr加入时，计数器计数+1，反之亦然。在最后一个shared_ptr即将被释放时，如果自己是最后一个指向这块内存的指针，它就会自动释放这块内存。

shared_ptr同样支持reset与release方法。不同点在于，reset与release方法只会重置或释放调用这些方法的指针对象的资源。除非引用计数降低到0，否则原先的内存不会被释放。
## 4. weak_ptr

weak_ptr用于解决shared_ptr的循环指向问题与不需要拥有资源，仅需要观察的场合。例如我们有一个双向链表结构体：

```cpp
template<typename T>
struct Node {
    std::shared_ptr<Node> next; // 持有下一个节点（拥有所有权）
    std::shared_ptr<Node> prev;   // 指向上一个节点
    T data;
};
```

这里存在一个问题：数据结构的知识告诉我们，双向链表一般在节点间都有一个指向环，前一个对象指向下一个对象，而下一个对象又指向前一个对象。这本身并没有问题，但是问题在于：当整个链表需要被析构时，前一个对象和后一个对象哪个应该先被析构？答案是——在使用shared_ptr时，两个都不会被析构。为什么？虽然指针本身被析构了，但是它所指向的对象根本没被析构——编译器认为仍然有指针指向这两块内存，所以不会回收它。那指向这两块内存的指针到底在哪呢？答案是——就是这个指针环本身。前一个对象的next指针仍然拥有着后一个对象，而后一个对象的prev指针仍然拥有着前一个对象。由于shared_ptr的特性，当两个节点需要被释放时，只会销毁指向它们本身的shared_ptr对象本身，因为根据shared_ptr的规则，Node内部的prev指针确实拥有了资源。

怎么解决这个问题呢？答案是将其中一个指针改为使用weak_ptr。由于weak_ptr并不像shared_ptr一样拥有资源（不增加引用计数），所以在对象被析构时能够被正常释放。假设我们将prev改为了使用weak_ptr（因为按理来说prev不应该拥有数据），又有以下的代码：

```cpp
shared_ptr<Node> node1 = std::make_shared<Node<int>>(1);
shared_ptr<Node> node2 = std::make_shared<Node<int>>(2);

node1->next = node2;
node2->prev = node1;
```

当node1和node2都要被释放时，它们就能够按照node1-node2的顺序被释放。

与shared_ptr不同，weak_ptr无法直接访问数据，需要先使用lock方法临时提升为shared_ptr才能访问：

```cpp
if (auto prevNode = node2->prev.lock()) {
    std::cout << "前一个节点的数据: " << prevNode->data << std::endl;
} else {
    std::cout << "前一个节点已被释放" << std::endl;
}
```

这里无需担心转换为shared_ptr的引用计数问题——因为在这里prevNode的生命周期只在if块中，if块结束后prevNode就会被回收，引用计数能够正常回落。

weak_ptr同样能够应用于观察者模式，因为各观察者不应该拥有主题，但需要从主题处获取信息。例如：

```cpp
#include <iostream>
#include <memory>
#include <vector>
#include <string>
#include <algorithm>

// 观察者抽象接口
class Observer {
public:
    virtual ~Observer() = default;
    // 当主题发生变化时调用，参数为主题的新信息
    virtual void update(const std::string& message) = 0;
};

// 主题类：包含一个 string 信息，并管理观察者
class Subject {
private:
    std::string message_;                                    // 主题信息
    std::vector<std::weak_ptr<Observer>> observers_;        // 观察者列表（弱引用）

public:
    // 注册观察者（将 shared_ptr 转为 weak_ptr 存储）
    void attach(std::shared_ptr<Observer> observer) {
        observers_.push_back(observer);
    }

    // 移除观察者（通过 shared_ptr 比较）
    void detach(std::shared_ptr<Observer> observer) {
        observers_.erase(
            std::remove_if(observers_.begin(), observers_.end(),
                [&observer](const std::weak_ptr<Observer>& wp) {
                    // 如果观察者已过期，直接移除；否则比较 shared_ptr 是否相等
                    auto sp = wp.lock();
                    return !sp || sp == observer;
                }),
            observers_.end()
        );
    }

    // 设置新信息，并通知所有观察者
    void setMessage(const std::string& newMsg) {
        message_ = newMsg;
        notify();
    }

    // 获取当前信息（可选）
    const std::string& getMessage() const {
        return message_;
    }

    // 通知所有有效的观察者，并清理已过期的观察者
    void notify() {
        for (auto it = observers_.begin(); it != observers_.end(); ) {
            auto observer = it->lock();   // 尝试提升为 shared_ptr
            if (observer) {
                observer->update(message_);   // 通知观察者
                ++it;
            } else {
                // 观察者已销毁，从列表中移除
                it = observers_.erase(it);
            }
        }
    }
};

// 具体观察者 A
class ConcreteObserverA : public Observer {
public:
    void update(const std::string& message) override {
        std::cout << "Observer A received: " << message << std::endl;
    }
};

// 具体观察者 B
class ConcreteObserverB : public Observer {
public:
    void update(const std::string& message) override {
        std::cout << "Observer B received: " << message << std::endl;
    }
};

// 演示
int main() {
    // 创建主题和观察者（使用 shared_ptr 管理生命周期）
    auto subject = std::make_shared<Subject>();
    auto observerA = std::make_shared<ConcreteObserverA>();
    auto observerB = std::make_shared<ConcreteObserverB>();

    // 注册观察者
    subject->attach(observerA);
    subject->attach(observerB);

    // 修改主题信息，触发通知
    subject->setMessage("John Wick excommunicado in effect 6 P.M. Eastern Standard Time");

    // 移除观察者 A
    subject->detach(observerA);

    // 再次修改，观察者 A 不会收到通知
    subject->setMessage("Marquis Gramont dead——Consequences");

    // observerA 离开作用域后自动销毁，但 subject 中的 weak_ptr 会变为空，
    // 下次 notify 时会自动清理。

    return 0;
}
```

## 5. 自定义删除函数与lambda表达式

从C++11开始，智能指针支持在构造传入参数时同时传入一个函数作为自定义删除函数，用于绑定一些可能需要的资源回收操作。这种函数既可以使用普通函数，也可以使用lambda表达式与仿函数实现。

### DLC1：Lambda表达式

Lambda表达式一般用于声明临时操作，属于函数式编程。Lambda表达式的声明格式如下：

```cpp
[]() { // []中写你要捕获的变量，()中写要传入的形参
	// 在这里写你要的操作
}
```

在Lambda表达式中，我们能够直接把这个表达式中要使用的上层变量直接传入，被称作捕获。如果需要上层的所有变量，\[=\]表示按值捕获所有上层变量，而\[&\]表示按引用捕获上层所有变量，\[\]表示不捕获任何变量。可以在\[\]中写你要捕获的变量，以及你希望捕获的方式。例如\[a, &b\]指定以值方式捕获a变量，以引用方式捕获b变量。Lambda表达式可以作为临时函数被调用，无捕获的Lambda表达式也可以作为函数指针被传入到其他对象中作为回调函数使用。而有捕获的Lambda表达式则要作为std::function或模板参数传递给其他对象，在使用智能指针的自定义删除器时非常常见。

### DLC2：仿函数

仿函数的存在形式是结构体，但仿函数与真正函数的区别为：仿函数通过重载()运算符实现了其功能。例如：

```cpp
#include <iostream>
#include <memory>

// 仿函数作为删除器（重载 operator()）
struct CustomDeleter {
    void operator()(int* p) const {
        std::cout << "自定义删除器（仿函数）被调用" << std::endl;
        delete p;
    }
};

int main() {
    std::unique_ptr<int, CustomDeleter> p(new int(42), CustomDeleter());
    return 0;
}
```

# 2. RTTI与安全转换——各种转换

RTTI中文翻译为运行时类型识别（RunTime Type Identification），是一种能在程序运行时得到某一变量类型，从而执行对应操作的特性。RTTI基于虚函数表机制，是C++能够实现多态的核心。RTTI本身只提供了dynamic_cast，但C++中还有static_cast、const_cast、reinterpret_cast等，我们把这几种转换放在一起来讲。

## 1. static_cast：静态类型转换

static_cast用于静态地将一种类型转换成另一种类型。这里可能有人要问：主播主播，这和直接用C++的强制转换有什么区别啊，不都是转换吗？

答案是——static_cast对比C++的强制转换有更多的限制。这些限制保证了转换是安全的、符合我们预期的。不用static_cast进行检查的话，由于显式转换还会混合const_cast、reinterpret_cast等的行为，在混乱的大项目中能够进行正确转换的概率极低（~~甚至比5级打野千珏Gank六神装狗熊的胜率还低（千珏：老弟等我上6）~~）。例如：

```cpp
const int a = 10;
auto b = int(a); // 这里丢失了const限定
auto c = static_cast<int*>(&a); // 错误！编译器不允许去除const
auto d = static_cast<const int*>(&a); // OK，保留了const限定
auto e = static_cast<char*>(&a); // 错误！不相关类型会导致混乱，编译器不允许转换
auto f = static_cast<int>(a); // OK，值拷贝不涉及对原类型的检查
```

这样，使用static_cast就能够确保我们能够实现我们真正想要的、确定的类型转换。

## 2. const_cast：临时移除const

> [!ERROR] 警告
> 临时移除const后对变量进行修改会导致未定义行为。除非你十分确定要使用const_cast变量的函数不会修改这个变量，否则不要使用const_cast。此外，不应在代码中滥用const_cast，应考虑使用其他方法（例如编写更合理的函数签名）来解决问题。

const_cast用于添加或移除变量的const或volatile限定。这个运算符只在特定场景下会被使用。例如我们要调用一个形参为非const的旧C函数，但对变量的const限定会导致传入时编译器报错，因为编译器发现传入的参数无法被修改。这时就能够使用这种方案来临时移除const限制供函数使用。

## 3. dynamic_cast

dynamic_cast是唯一一个应用了RTTI的类型转换。它专门用于多态类型的安全向下转换与交叉转换。同时由于dynamic_cast依赖RTTI特性，它只能用于指针与引用的转换。使用dynamic_cast时应确保编译器已启用RTTI（部分项目（尤其是嵌入式项目）会鉴于性能影响或资源占用而禁用RTTI），且dynamic_cast只能用于多态类型，不能用于普通类之间的转换。

> [!INFO] 名词解释
> 向下转换：从基类转换为派生类的过程
> 交叉转换：主要针对MI，通过同样的派生类将 一个基类转换为另一个不相关的基类

dynamic_cast在转换失败时，对于指针会返回nullptr，对于引用会抛出std::bad_cast异常。

## 4. reinterpret_cast：C++标准委员会的deep♂dark♂fantasy

reinterpret_cast是所有转换中最危险的一种——它会忽略所有的类型限制，直接令新类型使用原来类型的数据（~~无视风险，继续转换~~）。这种转换在非基本类型的转换中十分危险——它并不关心源类型与目标类型之间的语义关系。我们并不知道转换到的另一个类的内存布局是怎么样的，强制进行转换极易引发未定义行为或程序崩溃。

> [!ERROR] 警告
> 除非你明确清楚你在干什么，否则强烈不推荐使用reinterpret_cast。

reinterpret_cast可以用于以下场合：

- 与硬件或底层API交互（例如STM32嵌入式设计中将int转换为指针地址）；
- 序列化或反序列化场景中将字节流转换为结构体指针；
- 在性能极端敏感的场景中，规避类型系统的检查（例如两个struct拥有相同的内存布局，但类型转换禁止转换时可以使用reinterpret_cast进行转换。除非你知道你自己在做什么，否则不要使用这种方式）；

# 3. RAII

RAII的全称是“资源获取即初始化”，核心思想是——让资源的生命周期跟着对象的生命周期走。它强调利用对象的生命周期自动管理资源的生命周期，即资源的获取与对象初始化绑定，资源的释放与对象析构绑定。资源的获取并不强制要求在构造函数中，但应与构造这一过程绑定。RAII思想是异常安全的——即便程序抛出了异常，栈展开机制也能够确保资源能够被正确回收。典型的RAII利用有STL容器（例如string、array、map等 ）、我们之前讲到的智能指针、我们之后要讲的IO流类（例如fstream）等。
