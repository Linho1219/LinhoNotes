**By FunnyAWM**

在上一章中，我们在讲解友元时讲解了面向对象的三大核心特性——封装、继承与多态。接下来我们来继续讲解C++中的继承与多态特性。
# 1. 继承

## 1. 继承的概念

我们可以通过继承来提高代码的可复用程度。例如下面的代码：

```cpp
class Person {
	string name;
	int age;
	string gender;
public:
	Person(string name_, int age_, string gender_);
	~Person() = default;
	// 以下省略对数据操作使用的方法
}

class Student : public Person {
	string className;
	int grade;
public:
	Student(Person p);
	Student(string name_, int age_, string gender_, string className_, int grade_);
	~Student() = default;
	// 以下省略对数据操作使用的方法
}
```

其中Student类基于Person类为对象引入了一些新的特性，类似这样的写法就是继承。其中被继承的类被称作基类（部分教程中也称作父类），继承基类的类被称为派生类（部分教程中也称作子类）。

## 2. 继承的分类

继承有多种形式，包括is-a继承、has-a继承、uses-a继承等。在这一节中，我们先讨论is-a继承的情况，后续再行讨论has-a和uses-a继承。

一般情况下，继承分为以下几个情况：

- public继承：基类中的所有成员与方法的访问等级不变；
- protected继承：基类中的所有public成员与方法在派生类中变为protected等级；
- private继承：基类中的所有成员与方法在派生类中变为private等级。

与一般类相同，派生类也无法访问在基类中的private成员与方法，但整个继承链中的类都可以访问基类的protected对象。对于基类中的private对象，派生类需要使用基类的公有方法来实现间接访问。

此外，C++中还存在多重继承、虚继承等，将在后续进行讲解。

既然是派生类继承了基类的成员成员与方法，那么派生类能否访问基类的成员与方法呢派生类能否转换为基类呢？反过来呢？答案是：

**派生类完全可以转换为基类，也可以访问基类中的成员与方法；基类的指针或引用可以向下转换为派生类，但必须保证该基类的指针或引用实际指向的是派生类对象；强烈不推荐使用基类对象强制转换为派生类，这会导致未定义行为。正确的做法是使用static_cast或dynamic_cast进行安全转换，同时基类对象本身不能访问派生类的成员与方法。**

这其实也十分容易理解：派生类本来就包含所有在基类中的成员与方法，能够调用也是情理之中；派生类转换为基类意味着派生类需要丢弃不在基类中的所有数据；基类在转换为派生类时需要使用dynamic_cast这种RTTI转换（将在后续详细讲解RTTI），且转换后所有派生类对象都处于未初始化状态；基类无法访问派生类的成员与方法（即便通过指针或引用也是如此，且编译器不允许派生类指针或引用指向基类），因为这种行为是不合理且无意义的（基类没有派生类特有的成员，在基类直接对派生类成员操作没有意义）。

同时，继承还引入了一个新的问题：派生类并不能直接调用基类的构造函数，因为没有一个对应的关键字表示基类的构造函数调用。那么我们该 如何在派生类中初始化基类呢？答案是——使用初始化列表。

## 3. 初始化列表

初始化列表可以用于派生类调用基类的构造函数，同时可以用于初始化任意类中const成员。const成员无法在构造函数中初始化的原因是：构造函数在初始化成员时const成员已被创建且值不可变，这时在构造函数中直接初始化const成员会引起报错。初始化列表可以确保在const成员创建时即携带指定的初始值。以上面的Student类为例，我们可以这样初始化它的基类成员：

```cpp
Student::Student(string name_, int age_, string gender_, string className_, int grade_) 
	: Person(name_, age_, gender_) {
	className = className_;
	grade = grade_;
}
```

而对于const成员，也可以 使用初始化列表进行成员初始化。例如我们在Student类中有一个const string schoolName，只需要这样初始化（我们在上面类的基础上加上针对schoolName的参数）：

```cpp
Student::Student(string name_, int age_, string gender_, string className_, int grade_, string schoolName_) 
	: Person(name_, age_, gender_), schoolName(schoolName_) {
	className = className_;
	grade = grade_;
}
```

同样的，如果我们的构造函数只包含成员赋值的工作，我们可以全部使用初始化列表进行成员初始化，这样我们就可以将构造函数留置为空体，例如：

```cpp
Student::Student(string name_, int age_, string gender_, string className_, int grade_) 
	: Person(name_, age_, gender_), className(className_), grade(grade_) {}
```

### DLC：为什么const变量要在初始化列表里初始化，而非构造函数？

为什么const变量一定要放在初始化列表里才能初始化呢？这与C++执行初始化列表和构造函数的时机以及类的生命周期有关。这个过程在C++98标准的12.6.2节中描述如下：

> [!TIPS] C++标准
> Initialization shall proceed in the following order:
> — First, and only for the constructor of the most derived class as described below, virtual base classes shall be initialized in the order they appear on a depth-first left-to-right traversal of the directed acyclic graph of base classes, where “left-to-right” is the order of appearance of the base class names in the derived class base-specifier-list.
> — Then, direct base classes shall be initialized in declaration order as they appear in the base-specifier-list (regardless of the order of the mem-initializers).
> — Then, nonstatic data members shall be initialized in the order they were declared in the class definition(again regardless of the order of the mem-initializers).
> — Finally, the body of the constructor is executed.
> \[Note: the declaration order is mandated to ensure that base and member subobjects are destroyed in the reverse order of initialization. \]
> 翻译：
> 初始化应按以下顺序进行：
> · 首先，且仅对于最终派生类的构造函数（如下所述），虚基类应按照它们在基类的有向无环图的深度优先、从左至右的遍历中出现的顺序进行初始化，其中的“从左至右”是指派生类的基类说明符列表（base-specifier-list）中基类名称的出现顺序。
> · 然后，直接基类应按照它们在基类说明符列表中出现的声明顺序进行初始化（无论成员初始化器（mem-initializers）的顺序如何）。
> · 然后，非静态数据成员应按照它们在类定义中声明的顺序进行初始化（同样无论成员初始化器的顺序如何）。
> · 最后，执行构造函数的函数体。
> \[注：声明顺序是强制要求的，以确保基类和成员子对象按初始化的相反顺序销毁。\]


从上面的描述中我们可以发现，初始化列表（上面翻译为初始化器）的执行永远先于构造函数的函数体。而在C++98标准中，初始化列表中对数据成员的操作都被视为“初始化”而非在构造函数中的“赋值”。但是如果初始化列表的操作才是真正的“初始化”，那么构造函数存在的意义是什么呢？要回答这个问题，我们需要查看C++98标准中对于类生命周期开始的定义。在C++98标准中，类生命周期开始的标准如下：
> [!TIPS] C++标准
> The lifetime of an object is a runtime property of the object. The lifetime of an object of type T begins when:
> — storage with the proper alignment and size for type T is obtained, and
> — if T is a class type with a non-trivial constructor (12.1), the constructor call has completed.
> 翻译：
> 对象的生命周期是对象的一个运行时属性。类型 T 的对象的生命周期在以下条件满足时开始：
> · 已获得为类型 T 准备的、具有适当对齐方式和大小的存储空间；并且
> · 如果 T 是带有非平凡构造函数（non-trivial constructor）（见 12.1）的类类型，则该构造函数的调用已完成。

在标准中我们不难看出，在初始化列表完成执行以后，虽然类内的成员都已经通过初始化列表完成了初始化，但类本身还没有完成。类本身的初始化需要等到构造函数执行完成后才结束，这一定义明确了类生命周期的边界。而构造函数存在的意义就是为了补充初始化列表做不到的一系列操作（例如条件检查、资源分配、I/O操作等）。同时由于标准中对对象生命周期的规定，即便我们利用初始化列表置空了构造函数，它仍然会被执行。

## 4. 继承中对象的生命周期

在继承中，构造函数与析构函数的调用顺序严格相反，具体表现如下：

- 在对象构建中，会先调用基类的构造函数，再调用派生类的构造函数；
- 在对象销毁中，会先调用派生类的析构函数，再调用基类的析构函数；

我们不难发现，这样的调用顺序与栈的数据插入/移除行为十分相似。这是为了确保在构造和析构过程中程序能够正确初始化（或销毁）所有成员。

## 5. 继承中的名称隐藏

当派生类中定义了与基类同名的函数时，派生类会覆盖这个基类函数，即使它们拥有不同的参数与返回类型。也就是说，在派生类中调用这个同名函数时，如果没有特殊指定则始终调用派生类函数。如果我们希望在派生类中访问基类的函数版本，可以使用using关键字来指定要调用哪个函数版本。例如：

```cpp
class Base {
public:
    void print(int x);
    void print(double y);
};

class Derived : public Base {
public:
		using Base::print; // 这里引入了print函数与它的所有重载函数 
    void print(const string& s);
};

Derived d;
d.print(10);
```
## 6. 多重继承与虚继承

### 1. 多重继承

在C++中，允许一个类继承两个及以上的类，这种特性被称为多重继承。与单继承相同，多重继承也属于is-a继承。

> [!ERROR] 注意
> 除非实在没有其他选择，否则尽量避免使用多重继承。多重继承会带来许多新问题，包括不同基类的同名方法冲突、菱形继承问题等。这也就是Java为什么禁用了多重继承，仅允许类进行单继承。

例如我们基于上面的Person与Student类，在Person的基础上新建了Competitor类，那么我们就应该这样写类定义：

```cpp
class StudentInCompetition : public Student, public Competitor {
	// 类定义省略
};
```

现在假设我们的Competitor类和Student里都有一个getGrade方法，并且这两个方法的参数列表完全相同，那么当我们在StudentInCompetition类上调用getGrade方法，会发生什么呢？答案是编译器会直接抛出二义性错误。因为编译器根本不知道我们要调用哪个基类的getGrade方法。为了解决这个问题，我们需要指定在调用方法时到底要调用哪个基类的方法。例如我们要重写getGrade方法输出作为学生的成绩，只需要写：
```cpp
int StudentInCompetition::getGrade() {
	return Student::getGrade();
}
```

这样可以在一定程度解决二义性问题，但如果需要同时输出其他信息，可能会引起重复操作。例如我们在Student类和Competitor类中都有输出完整信息的功能，这个方法输出了Person类和这两个类本身的信息。这个时候如果我们在StudentInCompetition类中直接重写这个方法为调用两个基类的方法各一次，就会造成Person类的信息被重复输出。更糟糕的是，Student基类和Competitor基类可能是基于两个不同的Person数据构建的，再把这两个类多重继承过来就会存在数据不一致的问题。为了解决这个问题，C++同时引入了一项称为虚继承的技术。

### 2. 虚继承

虚继承专门用于解决菱形继承导致的重复对象构造与状态不一致问题。在上面的例子中，我们令Student类和Competitor类虚继承Person类，代码如下：

```cpp
class Student : virtual public Person {...};
class Competitor : virtual public Person {...};
```

这样在StudentInCompetition类中就只存在一个Person基类（由Student和Competitor基类共享），也就解决了菱形继承问题。虚继承到底是怎么解决这个问题的呢？答案很简单——在StudentInCompetition类中，编译器会直接忽略Student与Competitor对Person类的初始化代码，而使用StudentInCompetition定义的规则。这同时代表着如果Person类没有默认构造函数，我们就需要为StudentInCompetition类编写Person类的初始化列表。只要我们在这个类中定义好如何初始化Person对象，那么虚继承就会保证只有一个Person对象被创建。而且这与我们上面提到的C++标准也并不冲突——这个类会先初始化虚基类，然后按从左到右的顺序初始化Student与Competitor类。

## 7. has-a继承与uses-a继承

在C++（以及其他所有面向对象语言中），has-a继承一般指在一个类中包含另一个类。例如：

```cpp
class Banana {...};
class Bread {...};
class Lunch {
private:
	Banana banana;
	Bread bread;
public:
	// 后续省略
};
```

而uses-a继承一般指在一个类中调用了另一个类的方法，可以通过将整个类作为参数传入等方法完成。例如在上面的例子中，我们为Banana与Bread类添加eat方法，在Lunch类中我们可以这样使用这两个类的方法：

```cpp
class Lunch {
// 这里不再包含Banana与Bread对象
public:
	void eat(Banana banana, Bread bread) {
		banana.eat();
		bread.eat();
	}
}
```

## 8. 抽象基类

有些时候，我们可能希望创建一个基类，描述这个继承树中的所有类都应该重写的函数，然后等待其他类来继承这个类。同时我们又不希望能够直接用这个类创建对象，因为这是无意义的。这个时候我们就可以使用抽象基类来实现这一特性。

如何创建一个抽象基类呢？我们可以通过在这个基类中引入纯虚函数实现。例如下面的代码：

```cpp
class ApiBase {
public:
	ApiBase() = default;
	virtual string chat(string message) = 0;
	virtual string info() = 0;
};
```

上面的chat函数和info函数都是纯虚函数。当一个类拥有任何纯虚函数时，就算这个类还拥有其他普通成员函数，这个类也将自然成为抽象基类。抽象基类无法被实例化，我们只能实例化继承了这个抽象基类的类，且继承了这个抽象基类的类要重写这个基类中的所有纯虚函数。如果这个派生类也没有实现这些纯虚函数，那么这个派生类也将成为一个抽象基类。

纯虚函数也可以有定义，作为默认行为提供给各派生类。例如：如果我们的一个派生类对info方法没有特殊需求，只想满足接口的实现要求，就可以在函数实现中直接指定调用ApiBase的info方法来输出默认信息。

乍一听，这样的概念似乎与Java的抽象类和接口有些相似。这个直觉确实没错，但区别在于Java对接口和抽象类做了更严格的区分。在C++中，由于抽象基类允许普通成员函数存在，这使得C++中的抽象基类概念在Java中更接近抽象类，而不是接口。在Java中，我们使用abstract关键字来声明抽象类：

```java
abstract class ApiBase {
	public abstract String chat(String message);
	public abstract String info();
}
```

而我们使用interface关键字来声明接口：

```java
interface AICallable {
	public String chat(String message);
	public String info();
}
```

如果我们需要使用这个接口来规范类的行为，只要写：

```java
class OpenAIProvider implements AICallable {...} // 这里这个类需要重写接口中的所有方法，否则无法编译
```

抽象基类的作用是用于规范其子类的行为，提供一个统一的接口契约供子类遵守。在上面的例子中，我们可以基于ApiBase创建多个行为相同，但参数与配置不同的LLM API调用适配器，根据上层应用的需要无缝切换底层的适配器类，同时上层并不需要知道到底使用了哪个适配器，只需要调用基类的统一方法并关注返回结果即可。由于存在“基类指针可指向派生类”与虚函数表的规则，且创建抽象基类指针并不属于实例化，我们可以这样使用这些接口：

```cpp
// 上面的抽象基类保持不变
class OpenAIProvider : public ApiBase {
// API调用需要的参数省略
public:
	string chat(string message) override;
	string info() override;
};

class AnthropicProvider : public ApiBase {
// 省略，同上
public:
	string chat(string message) override;
	string info() override;
};
```

这样我们就可以在底下这样调用它们重写的方法：

```cpp
ApiBase* provider = new OpenAIProvider(); // 使用AnthropicProvider也可以
string result = provider->chat("你好，你是哪个模型？");
// 在上面的代码中，如果provider指向的是OpenAIProvider，那么就会请求OpenAI API端点（假设参数设置正确）且使用OpenAI的请求负载；如果是AnthropicProvider，那么就会请求Anthropic API端点且使用Anthropic的请求负载。
```

上面的示例代码同样也说明了多态的核心作用之一——隐藏底层抽象细节，使开发者有更多精力关注上层构建。类似上面的策略在设计模式中更接近策略模式。

> [!INFO] 名词解释
> 策略模式：通过统一的接口封装不同的算法或实现，使得上层代码在运行时可以无缝切换具体策略。

如果我们此时再配合C++的协变返回类型，创建一个类用于根据不同的配置返回不同的派生类，那么我们就能够实现配置文件、派生类与上层代码的彻底解耦。前面描述的策略在设计模式中被称为工厂方法模式。

> [!INFO] 名词解释
> 工厂方法模式：定义一个用于创建对象的接口，但由子类决定实例化哪一个具体类。工厂方法将对象的创建延迟到子类中，从而使一个类的实例化延迟到其子类。

## 9. 继承的终止
在C++11中，提供了一个final关键字用于将继承终止在该类。例如：

```cpp
class OpenAIProvider : public ApiBase final {...};
```

这样任何类都不能继续继承OpenAIProvider来实现扩展功能。这个关键字同样可以对虚函数使用，意为禁止重写该函数以实现另外的功能。要使用这个关键字，只需要在函数声明最后添加final即可。这个关键字为继承提供了一个明确的终止边界：当我们不希望后续有开发者继承该类并篡改该类行为时，就可以利用final关键字。

final和override可以组合使用，意为“这个函数已经被重写，且禁止后续重写”。

> [!TIPS] 跨语言对比
> 在Java中，除了与C++相同的用途，final关键字还可以用于声明常量。例如：
> ```java
> public class Main {
> 	public static void main() {
> 		final double PI = 3.141592654; // PI的值无法再被修改
> 	}
> }
> ```

## 10. 对象切片

虽然将派生类转换为基类可以安全使用按值转换，但会导致这个被转换的对象丢失所有派生类成员。这种现象被称作对象切片。例如：
```cpp
Student s("Alice", 20, "Female", "Math", 90);
Person p = s;  // OK，但 p 丢失了 className 和 grade（切片）
```

> [!CAUTION] 注意
> 对于使用指针与引用的场合，对象切片不会发生。
# 2. 多态

在上一章中，我们对多态的描述如下：

> [!INFO] 名词解释
> 多态：同一个操作作用在不同对象上会有不同的表现，一般通过重写实现。

那么多态如何在继承中体现呢？答案是在继承中使用虚函数。

## 1. 虚函数

在C++中，我们可以用virtual关键字标记会被派生类重写的函数。例如我们有一个Date类与DateTime类，其中DateTime类继承了Date类实现额外的时间存储功能，定义如下：

```cpp
class Date {
	// 成员省略
public:
	Date(...);
	virtual ~Date();
	virtual void display();
};

class DateTime : public Date {
	// 成员省略
public:
	DateTime(...);
	~DateTime();
	void display();
};
```

当我们使用virtual关键字对基类中的函数进行限定时，相当于告诉编译器：这个函数允许被子类进行重写以实现不同的功能。与直接重载不同，通过virtual进行声明的函数在被派生类覆盖时必须拥有完全相同的参数类型与个数，同时C++编译器会根据指针或引用指向的的对象的实际类型执行对应的覆盖函数。这种特性被称为动态联编，是C++实现多态的核心。相对的，通过函数重载实现的不同行为在编译期就已经被确定，称为静态联编。

在C++11及以后的标准中，我们可以利用override关键字来确保派生类函数重写了基类函数。这与Java中的Override注解类似。

> [!TIPS] 跨语言对比
> 在Java中，@Override同样用于保证基类函数被派生类重写。如果函数包含@Override注解但没有重写基类函数，javac会在编译java文件为字节码期间输出编译报错。例如：
> ```java
> class A {
> 	public void display() {}
> }
> 
> class B extends A {
> 	@Override
> 	public void  display() {} // 如果这里的display函数没有重写任何基类的函数，代码将无法通过编译
> }
> ```

### DLC1：虚函数表与虚指针

为什么virtual关键字就能够实现动态联编呢？答案是编译器使用了虚函数表。当基类函数被声明为virtual时，编译器会为这个类生成一个虚函数表，其中存储了这个类所有虚函数的地址。每个对象（包括基类对象与派生类对象）都会持有一个指向该表的指针，称为虚指针。当通过基类的指针以后引用调用虚函数时，程序会在运行时自动查找vtable，并调用正确的函数版本。

### DLC2：C++中的协变返回类型
我们刚才讲到：重写函数必须具有与原函数完全相同的参数类型、个数、顺序与返回类型，但这条规则存在一个例外：当返回类型是指针或引用时，重写函数的返回类型允许是基类所属继承链条中的任意子类。这一特性被称为协变返回类型，在工厂方法模式、克隆模式等设计模式中十分有用。但是需要注意：C++中的协变返回类型不允许反协变，也就是说，重写函数的返回类型不允许为这个类的任意向上基类。协变返回类型同样不支持按值返回，只能用于返回指针与引用。

为什么C++不允许反协变呢？原因在于——反协变会彻底橄榄C++静态类型系统的安全性，同时违反我们之前提到过的SOLID中的LSP。假设我们有这样的代码：

> [!CAUTION] 注意
> 接下来这部分内容会比较难理解，如果不想知道C++为什么不允许反协变，可以直接跳过。

```cpp
class Base {
public:
    // 基类承诺：返回一个 Derived*（一个派生类对象）
    virtual Derived* get() {
        return new Derived();
    }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    // 逆变覆盖：返回 Base*（基类类型）
    virtual Base* get() override {  // 假设编译器允许
        return new Base();
    }
};
```

然后我们有这样的调用：

```cpp
Base* ptr = new Derived();   // 基类指针指向派生类对象
Derived* d = ptr->get();     // 期望得到 Derived*
```

我们来逐步分析这个调用。在第一步，我们正常令基类指针指向了派生类对象，这并没有问题。问题在第二个调用。根据虚函数的调用机制，现在ptr指向的实际类型是Derived类型，所以会调用Derived类的get函数。这里真正鬼畜的地方在于：Derived类的get函数会返回一个Base*，但是现在指向这个Base对象的是一个Derived指针。而且根据Base类里get()的声明，编译器认为它会返回一个Derived指针，因为编译器并不知道现在这个Base指针底下到底是什么牛鬼蛇神。神奇的一幕发生了——因为ptr的类型是Base*，编译器直接相信了ptr的get()返回的就是Base类里写的那样返回Derived*，但函数这个时候已经被动态联编牛了（~~纯爱战士应声倒地~~）——动态联编查虚函数表返回了Base*，和Base类的签名冲突。但是程序直接把这个返回值给了d，没有任何类型检查，因为编译器认为这是正确的。这个时候如果我们再调用Derived类特有的方法，那么整个程序就非常令人愉悦地炸了，而这个程序的所有部分都觉得编译结果完全没逝（~~毕竟动态联编能有什么坏心思呢~~）。

## 2. 虚析构函数

在上面的代码中，我们能找到以下声明：

```cpp
virtual ~Date();
```

为什么我们要在这里把析构函数也声明为virtual呢？这与我们之前的行为有关。在我们之前的描述中，我们假设了这样一种情况：基类的指针指向了派生类对象。当调用基类的virtual函数时，动态联编会自动查找正确的重写版本。这并没有问题，问题在于整个类的非virtual部分。如果这个函数没有被声明为virtual的话，调用行为会退化到静态联编，也就是说，如果没有virtual，基类指针会忽略对象的实际类型，而只会执行基类的对应函数。如果这些函数只是普通成员函数，那么这并不会导致任何运行时缺陷，最多只会导致一些非预期结果（例如我们希望调用派生类函数但调用了基类函数）。但是如果这个函数是析构函数呢？那么我们就会看到非常鬼畜的一幕：由于我们没有将析构函数声明为virtual，调用基类指针的析构函数时，析构函数不在虚函数表里，因此调用始终只会调用基类的析构函数。这会使得派生类的析构函数在这种情况下无法被执行，从而无法完成派生类特有的一些资源回收步骤，可能会导致未定义行为或内存泄漏。

这里有人可能要问：主播主播，上面不是说了派生类在销毁时会先执行派生类的析构函数吗？为什么在这种情况下派生类的析构函数无法被执行呢？问题在于——这个指针本身根本不知道它自己指向的是一个什么牛鬼蛇神类型的对象。这个指针会把它指向的任意对象当做这个类型的对象看待，因此这个指针根本不知道派生类析构函数的存在，也就不会执行它。这个原因叠加上静态联编的特性，就造成了这种十分鬼畜的情况。

好消息是，我们只需要在最底层的基类里将析构函数写成virtual，所有基于这个类的派生类（甚至基于这些派生类再次派生的类）都会被当做virtual函数看待。这个规则也适用于所有其他函数，这与我们之前描述过的虚函数表有关。
