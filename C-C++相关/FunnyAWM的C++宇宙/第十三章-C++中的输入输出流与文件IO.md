**By FunnyAWM**

在C++中，输入与输出流同样是由标准库提供的。其中包含负责输入输出到屏幕或文件的类的头文件有iostream与fstream。这一章我们来详细讲解如何使用C++中的IO功能。

# 1. C++的流缓冲区与iostream

## 1. iostream中的类与对象

在iostream头文件中，C++以以下方式实现了IO流类：

- 首先，我们有一个独立的streambuf类，这个类负责为IO流提供缓冲区内存，并提供了用于填充、访问、刷新、管理缓冲区的方法；
- 然后，ios_base类表示了流的一般特征；
- 之后，ios类基于ios_base类进行派生，其中包含了一个streambuf指针，这个指针指向的对象将作为这个ios对象的缓冲区；
- 然后，ostream类和istream类分别继承了ios类，分别实现了输出方法与输入方法；
- 最后，iostream多重继承了ostream与istream，从这两个类中继承了输入与输出方法。

我们常用的cout、cin等就是这些类实例化的结果。那么到底有几个对象呢？这些对象都被用于做些什么？我们接下来一个一个来看：

- cin用于标准输入流，其输入来源一般是标准输入设备（通常是键盘）；
- cout用于标准输出流，其输出目标一般是标准输出设备（通常是屏幕）；
- cerr用于标准错误流，其输出目标一般是标准输出设备（通常是屏幕）；
- clog同样用于标准错误流，输出目标同上。clog与cerr的区别在于：cerr没有缓冲区，一切由cerr处理的输出将直接被打印到屏幕上。

同时，这些对象都有一个宽变种，用于处理宽字符。

我们之前说过，iostream中的输入与输出类通过重载了<<与>>运算符实现了输入与输出功能，同时由于这些重载返回的是ostream或istream对象，这也赋予了cout与cin拼接输出或输入的能力。

## 2. 缓冲区

为什么cout、cin等对象都要有缓冲区呢？其实这里的streambuf是一个独立的抽象基类，用于提供流缓冲区。缓冲区常被用于暂存从高速存储部分传入的数据，以低速存储部分能够接受的速度进行输出。例如在内存写回到硬盘时，硬盘一般会有一个高速缓冲区，用于暂存内存的数据，然后以硬盘的速度写入到硬盘。如果硬盘没有缓冲区的话，内存将被迫使用硬盘的速度进行数据写入，拖慢内存的运行效率。这种现象一般被描述为“硬盘存在IO性能瓶颈”（硬盘缓冲区是硬件层级的，而cout的缓冲区是在用户态由C++标准库管理的，但两者的设计思路相同）。

~~内存：我的很大（指数据），你要忍一下~~
~~硬盘：豪大大数据\~豪大大数据\~~~

而cout、cin等对象存在缓冲区的原因还有一个——降低系统调用次数。操作系统的知识告诉我们，计算机操作系统的进程一般会分为两种状态：用户态与内核态。操作系统运行必要的应用程序一般都在内核态，而几乎一切外部组件与用户运行的程序都在用户态。这样做极大提高了操作系统内核的安全性，能够有效防止恶意程序直接向内核注入指定代码片段。系统调用的作用就是从用户态临时提升当前单个操作为内核态，然后调用内核对应的操作。如果没有缓冲区，cout输出到屏幕的行为将导致程序频繁在用户态与内核态进行模式切换，显著降低了程序的运行效率。缓冲区的出现使得C++程序能够在缓冲区满后再使用系统调用将当前缓冲区中的内容一次性输出到屏幕，显著降低了系统调用的次数。

对于cout，缓冲区刷新的时机在输出到屏幕时一般为行缓冲，即遇到endl或"\n"时刷新缓冲区；而对于文件则是全缓冲，即在关闭文件或利用flush操作符手动刷新缓冲区时刷新缓冲区（此时endl可以刷新缓冲区，但"\n"不行）；cerr的行为是“无缓冲区”，立即调用系统调用输出到屏幕。cerr这样做的原因是：故障信息一般需要高即时性，此时引入缓冲区会导致即时性损失。

对于cin，其缓冲区刷新时机默认使用了tie方法与cout绑定，这意味着在cin >>操作被执行之前，cout的缓冲区会立刻刷新，以便用户看到提示信息。

## 3. 重定向

我们可以利用操作系统的能力来将程序的输出改变到文件或其他IO设备中。这种功能被称作重定向，在Windows、MacOS与Linux中都可以使用。一般使用>来改变输出到文件或其他IO设备，使用<来改变输入来源为文件或其他IO设备。这个过程是由操作系统完成的，与我们运行的C++程序本身无关。

> [!INFO] 如何在IDE中实现重定向
> 在Visual Studio中，要实现程序输出重定向，只需要在项目属性中的调试选项中，添加命令参数即可。其他支持调整运行时参数的IDE基本都可以通过这种方式实现输入或输出的重定向。

## 4. cout的高级应用

我们可以通过使用dec、hex与oct控制符来指定cout以十进制、十六进制或八进制输出，这样的设置仅影响整数输出。例如：

```cpp
cout << hex; // 现在cout会输出十六进制整数
```

需要注意的是：这种操作是持久的，在当前程序之后的执行中，cout都会保持这个设置。

width函数可以用于设定下一个输出的最小宽度。例如：

```cpp
cout.width(4);
cout << 114 << endl;
cout << 114 << endl;
cout.width(4);
cout << 114514;
```

这段代码的输出为：

```text
 114
114
114514
```

由上面的输出可见，width函数只影响接下来输出的一个项目，然后将最小宽度重置回默认值。同时我们可以发现，width函数只是规定了输出的最小宽度，当输出的宽度大于这个设定的最小宽度，cout也不会截断数据。

默认情况下，width函数使用空格填充字符串前部来满足最小宽度要求。如果我们希望使用另外的字符填充，只需要调用fill函数即可。例如：

```cpp
cout.width(4);
cout.fill('*');
cout << 114 << endl;
cout.width(4);
cout << 514 << endl;
```

程序输出如下：

```text
*114
*514
```

由此可见，fill方法与hex等控制符一样都是持久操作。

cout的precision方法用于设定浮点数的允许输出位数，默认为6位。例如：

```cpp
cout.setf(std::ios::showpoint); // 这一行设置cout强制显示小数点，当输出位数不满足precision要求时，会通过在后面补0来满足要求
cout.precision(4);
cout << 11.4 << endl;
cout.precision(2);
cout << 514.0 << endl;
```

程序输出如下：

```text
11.40
5.1e+02
```

为什么第二个输出换用了科学计数法来输出数据呢？这是因为precision在默认浮点数格式下指定的是有效数字的总位数（包括整数部分和小数部分）。当整数部分的位数超过precision时，cout会自动切换为科学计数法来输出数据。

setf方法可以用于设置cout输出的格式。例如：

- boolalpha可以设置bool值不以整数输出，而使用true与false；
- showbase可以设置输出使用基数前缀（例如我们之前已经见到过的0x）；
- showpoint用于显示浮点数末尾的小数点；
- uppercase用于设置十六进制输出与e表示法使用大写字母；
- showpos用于在正数前加上正号。

利用setf修改的格式与fill一样是持久操作，不过setf执行的操作可以用unsetf来撤销，只需要传入相同的参数即可。同时，这些参数都可以通过输出控制符的方式来使用。

## 5. cin的高级应用

可以调用cin的getline方法来获取整行输入（包括空格）。例如：

```cpp
char input[5];
cin.getline(input, 5);
```

这种方法不适用于string；对于string，应直接调用std::getline方法，并设定cin为输入流。例如：

```cpp
string str;
getline(cin, str); // 需要string头文件
```

在cin中，有一个描述流状态的数据成员，由3个ios_base元素组成：eofbit、badbit或failbit。当cin尝试读取但流已经到文件末尾时会设置eofbit，而操作未能获取到预期字符或IO操作失败时会设置failbit，而在一些无法确定原因的错误破坏流时则会设置badbit。

> [!CAUTION] 注意
> 由于一些编译器实现并不严格区分failbit与badbit的使用场合，在检查输入是否完整时，推荐使用fail函数把这两个位都检查一次。

可以调用cin的good函数来确定是否设置了这3位的任意一位。如果这3位都没有被设置，那么good函数将返回true；当eofbit被设置时，调用eof方法将返回true；对bad与fail方法的调用同理。可以调用clear方法来清理这3个位，以便执行后续操作（例如重新读取等）。

exception方法可以设置一个异常掩码，当流状态中对应位被设置时，自动抛出std::ios_base::failure异常。只需要写以下代码：

```cpp
cin.exception(ios::badbit | ios::failbit); // 当badbit和failbit被设置时抛出异常
```

这样当这些位被设置时就会抛出一个std::ios_base::failure异常。可以使用rdstate函数获取这3个位的状态，它返回一个iostate值。

当输入触发了failbit或者badbit时，有什么方式能够恢复cin的使用呢？正确方法是使用clear方法与ignore方法直接跳过这个异常输入。例如：

```cpp
int value;
while (!(cin >> value)) {
    cin.clear();                 // 清除错误状态
    cin.ignore();                // 忽略错误字符
    cout << "请输入有效数字: ";
}
```

# 2. C++的文件IO

## 1. 如何使用文件IO

在C++中，由于我们拥有了针对流对象的IO，针对文件的IO也只是复用了这些接口而已。区别在于，要实现文件IO，我们就不能使用ostream和istream了——C++标准库中有一个fstream文件，我们需要使用里面的ofstream与ifstream类。例如：

```cpp
#include <fstream>
#include <iostream>
#include <string>

using std::ofstream;
using std::ifstream;
using std::string;
using std::cout;
using std::endl;


int main() {
    ofstream fout;
    fout.open("output.txt");
    fout << "Hello World!";
    fout.close();
    ifstream fin;
    fin.open("output.txt");
    string line;
    getline(fin, line);
    fin.close();
    fin.clear();
    cout << "文件中的内容：" << line << endl;
}
```

这样我们就实现了一个完整的程序功能，这个程序将"Hello World!"写入到程序目录中的output.txt文件中，然后再使用ifstream来读取它。

## 2. 文件IO的高级操作

### 1. 读写模式

在C++的文件IO中，我们有一个虚拟的指针概念，它指向了这个文件中的内容。它的作用有点像Word等字编辑器中的光标，准备往文件指针的位置插入或从文件指针的位置向前或向后读取文件内容。在读取文件时，我们可以通过为文件IO流类构造时指定一些读取模式参数来实现对文件指针的控制。例如：

```cpp
ifstream fin("output.txt", ios_base::in | ios_base::binary); // 打开文件，针对二进制文件读
ofstream fout("input.txt", ios_base::out | ios_base::trunc); // 打开文件以写入，如果文件已经存在则直接截断（清空文件内容）
```

各常量及其意义如下：

| 常量 | 含义 |
|--|--|
| ios_base::in | 打开文件以读取 |
| ios_base::out | 打开文件以写入 |
| ios_base::ate | 打开文件并移动到文件尾 |
| ios_base::app | 追加到文件结尾 |
| ios_base::trunc | 如果文件存在则截断（清空）文件 |
| ios_base::binary | 打开二进制文件 |

ate标记打开文件并将文件指针移动到文件尾字符，而app标记会移动到文件尾后的一个字符，以便随时可以利用这个对象进行写入。

trunc标记的语义为：如果文件不存在则新建文件，如果已经存在则直接截断文件。

> [!ERROR] 警告
> 截断文件会直接抹除文件的所有内容，除非确定需要截断，否则不要使用trunc标记。

binary标记用于写入二进制序列到文件，配合reinterpret_cast可以用于类或结构体的序列化与反序列化。例如：

```cpp
// 假设我们这里有一个已经序列化的struct MyStruct
ifstream fin("snapshot.bin", ios_base::in | ios_base::binary);
MyStruct structSnapshot;
fin.read(reinterpret_cast<char*>(&structSnapshot), sizeof(MyStruct));
```

> [!ERROR] 警告
> 由于我们并不知道其他架构或同一架构下其他编译器的实现（例如内存对齐规则、字节序规则等），这种方式仅能用作同一平台的本地存储。强烈不建议使用这种方式进行跨设备数据传输。对于跨设备数据传输场合，使用JSON或Protocol Buffers等通用性更强的方案会更好。

binary标记还可以用于实现程序特有的二进制文件格式，例如zip格式使用的哈夫曼编码就可以通过这种方式进行写入。
### 2. 文件指针与随机文件IO

我们之前讲到过，文件中存在一个文件指针，它的作用类似Word中的光标，用于定位操作点在文件中的位置。但是如果我们希望能够随意移动这个文件指针，如何操作呢？文件指针虽然类似常规指针，但我们无法直接操作文件指针，只能通过一些ifstream和ofstream的成员函数进行操作。使用什么成员函数呢？答案是——使用ssekp或seekg函数。

#### 1. seekg与seekp

在seekg与seekp中，用于移动文件指针需要的参数几乎是相同的——使用文件指针的绝对位置或使用起始位置与偏移量的相对位置。这两个函数都允许使用单个参数调用，其含义为直接移动到参数指定的绝对位置（单位为字节）。当使用相对位置时，需要指定文件相对哪个位置移动。可以使用的起始位置有文件开头、当前位置与文件末尾，分别是ios::beg、ios::cur和ios::end。例如：
```cpp
#include <iostream>
#include <fstream>

std::ifstream fin("data.bin", std::ios::binary);

fin.seekg(0, std::ios::beg); // 移动到文件头

fin.seekg(0, std::ios::end); // 移动到文件尾，此时可以获取文件大小，将在后续进行说明

fin.seekg(-5, std::ios::cur); // 文件指针向前移动5个字节

fin.seekg(3, std::ios::cur); // 文件指针向后移动3个字节
```

从上面的代码中我们已经能够知道seekg函数的用法了。那么seekp的用法是什么样的呢？答案是——两者的用法与参数相同。那么这两个函数有什么区别呢？答案是——两个函数的使用场合不同。一般来说，seekg函数用于ifstream等输入流，而seekp用于ofstream等输出流。

同时我们需要注意一点：当ifstream或ofstream使用了app模式打开文件时，文件每次在写入时文件指针都会回到 文件尾，此时的操作一般会无视seekg函数。ate模式不受该限制影响。

#### 2. tellg与tellp

之前我们说到，seek系列函数在将文件指针移动到文件尾时可以获取文件大小。怎么做呢？答案是使用tell系列函数。tell系列函数的限制与上述seek系列相同，相同的后缀也与上面对应。它返回一个std::streampos类型，用于存储文件在调用函数时的位置以及一些其他信息。如果需要取出偏移量整数用于其他处理，需要先转换为std::streamoff再使用static_cast转换为long long类型。

然而，在保存文件位置时，直接使用streampos类型传入seekg即可，seekg可以自行处理这个文件位置并将文件指针放置在正确的位置，不需要转换为整数。例如：

```cpp
std::streampos pos = fin.tellg(); // 记住当前位置
// ... 执行一些读取操作 ...
fin.seekg(pos);                   // 恢复到之前记住的位置
```
