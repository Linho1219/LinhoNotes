###### By FunnyAWM

> **运行环境说明**：该专栏的所有代码与命令都在 **Debian 12 ARM64** 下编写与执行，其他操作系统的执行结果可能会与专栏中给出的结果不同，具体以各操作系统下的执行结果为准。

# 1. 第一个C++程序

欢迎来到C++的世界！这是一门十分强大，但学习曲线较为陡峭的语言。我们来编写我们的第一个C++程序，这个程序输出一行Hello World并返回0：

```cpp
#include <iostream> // 预编译指令

using namespace std; // 声明使用std名称空间

int main() { // main函数是一切C++程序的起始点
	cout << "Hello World!" << endl;
	return 0; // 在C++新标准中可以不写这行
}
```

下面我们来详细讲解一下这个程序中出现的各种语句的含义。

1. #include \<iostream\>：预编译指令，这行代码告诉编译器：我们需要在这个程序中包含iostream头文件。
2. using namespace std;：using指令，告诉编译器默认包含std名称空间的所有函数与变量，不需要使用std::前缀指定；
3. int main()：main函数是所有C++程序的起点，所有C++程序必须包含main函数才能成功编译并运行。函数后面的大括号中括起来的部分称为函数体，描述了函数的行为。在这个例子中，main()函数的行为是：输出Hello World!并返回0。
4. cout语句：执行了输出"Hello World!"这一操作并换行。<<运算符在cout中表示将其后面的内容“推入”到前面的对象中。
5. return 0：描述了函数的返回结果。在这个例子中，main函数返回0，也是整个程序的返回结果。所有程序中的main函数返回值与程序返回值相同。main函数的返回值也可以用来表示错误原因。例如在一些系统中，0xC0000005返回值表示程序访问到了内存中不属于该程序的位置。在较新的C++标准中，如果main函数没有指定返回值，编译器会默认让程序返回0。

如果程序中不包含main函数，会发生什么呢？我们将上面程序中的main函数部分去除，再次编译，编译器输出如下：

```
[ 50%] Building CXX object CMakeFiles/expLinux.dir/main.cpp.o
[100%] Linking CXX executable expLinux
/usr/bin/ld: /usr/lib/gcc/aarch64-linux-gnu/12/../../../aarch64-linux-gnu/Scrt1.o: in function `_start':
(.text+0x1c): undefined reference to `main'
/usr/bin/ld: (.text+0x20): undefined reference to `main' # 这里提示了找不到main函数
collect2: error: ld returned 1 exit status
make[2]: *** [CMakeFiles/expLinux.dir/build.make:97: expLinux] Error 1
make[1]: *** [CMakeFiles/Makefile2:83: CMakeFiles/expLinux.dir/all] Error 2
make: *** [Makefile:91: all] Error 2
```

可以发现，编译器提示了我们没有main函数，因此拒绝继续编译程序。

# 2. C++中的注释

C++使用//来做单行注释，使用/\* 注释内容 \*/来写多行注释。多行注释的使用方法如下：

```cpp
/**
 * @brief 记录信息级别日志
 * @param message 要记录的日志消息
 */
void Logger::Info(const QString& message) {
    qInfo().noquote() << QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm:ss:zzz") << "[INFO]" << message;
}
```

在上面，我们将内容通过/\* ... \*/包含，实现了C++的多行注释。

# 3. include指令与C++中头文件的命名方式

在最开始时，我们使用#include包含的文件在C++中称为头文件。头文件是C++中十分重要的文件，用于描述各类基础库与用户自定义库的实现方式。C++中头文件的命名方式约定如下：
| 类型 | 命名约定 |
|--|--|
| C头文件（或C++中比较旧的头文件） | 用.h结尾，例如stdio.h |
| C++中较新的头文件 | 没有扩展名，例如iostream |
| C中迁移到C++的头文件 | 以c+旧头文件名命名，没有扩展名，例如math.h -> cmath |

# 4. using指令

using指令用于告诉编译器包含整个名称空间内的内容，或包含名称空间内的特定成员。例如：

```cpp
using namespace std; // 使用整个std名称空间

using std::cout; // 仅使用std中的cout
```

在实际的项目开发中，更推荐后者的写法，因为后者能够保证命名空间不被污染。

**命名空间污染：指在某个头文件中使用了整个名称空间，导致包含这个文件的所有源文件被迫使用了相同名称空间的现象。例如：在C++ OpenCV中，OpenCV对应的名称空间是cv2，但如果在某个头文件中使用了整个cv2名称空间，而源文件中又使用了自定义的同名名称空间，如果这两个名称空间中包含了相同的函数或变量名，同时包含这两个名称空间就会导致歧义。**

# 5. C++的变量

与其他编程语言相同，C++对变量也提供了丰富的支持。使用如下格式来声明变量：

```cpp
[数据类型] [变量名];
```

数据类型描述了这个变量存储的值类型，而变量名描述了访问这个变量的方式。例如我们用下面的代码声明一个变量：

```cpp
int value;
```

其中int描述了这个变量存储的值——整数；而value描述了访问变量的方式——通过value的名称进行访问。

需要注意的是，C++的变量没有固定的初始值，变量的初始值由使用变量时内存的内容决定（全局变量除外，将在后续说明），所以一般需要给变量赋初始值。

以上述的value为例，C++变量赋值的方式如下：

```cpp
value = 0;
```

当然我们也可以将变量声明与赋值组合，通过如下语句同时声明变量与赋初始值：

```cpp
int value = 0;
```

在C++中，变量需要声明才能访问。如果没有声明变量直接使用，编译器会指出变量未声明。例如我们需要编译下面的程序：

```cpp
#include <iostream>

using std::cout;
using std::endl;

int main() {
	cout << val << endl; // 这里会报错找不到变量
	return 0;
}
```

编译输出如下：

```
[ 50%] Building CXX object CMakeFiles/expLinux.dir/main.cpp.o
/home/orangepi/CLionProjects/expLinux/main.cpp: In function ‘int main()’:
/home/orangepi/CLionProjects/expLinux/main.cpp:7:17: error: ‘val’ was not declared in this scope
    7 |         cout << val << endl; // 这里会报错找不到变量
      |                 ^~~
make[2]: *** [CMakeFiles/expLinux.dir/build.make:76: CMakeFiles/expLinux.dir/main.cpp.o] Error 1
make[1]: *** [CMakeFiles/Makefile2:83: CMakeFiles/expLinux.dir/all] Error 2
make: *** [Makefile:91: all] Error 2
```

C++的这种特性被称为静态类型。与Python不同，Python允许不预先声明变量的情况下直接为变量赋值，这种情况下Python解释器会自动创建该变量。例如：

```python
    resp = requests.get(filelist_url, headers=headers)
    resp.raise_for_status()
    filelist_soup = BeautifulSoup(resp.content, "html.parser")
    res_list = [source.get('src') for source in filelist_soup.find_all('source', type="audio/mpeg")]
    i = 0
    if not res_list:
        with open("error.html", "w") as f:
            f.write(resp.text)
        logger.error("未找到任何可爬取音频")
        exit(1)
```

在这里，filelist_url和header已经提前定义，但我们并没有声明resp、res_list与i等变量。这种情况下Python解释器会自动创建这些变量并赋值，当我们访问这些变量时，这些变量的值就是我们为这些变量赋的值。

乍一看，我们似乎没法理解变量静态检查有什么好处。静态变量的写法更复杂、需要先声明后访问，远不如Python的就地创建易用。但是，如果我们意外写错了变量名称，C++编译器也会提醒我们，但Python在运行时会直接报错。例如上面的例子中，如果我们不小心将filelist写成了fi1elist，Python会在运行时抛出Traceback。

# 6. C++的输入输出

在C++中，输入输出主要依靠cout与cin实现。例如，输出语句的编写方式如下：

```cpp
cout << "Hello\n"; // 这里\n的作用与endl相同
cout << "World!\n";
```

上面语句的输出如下：

```
Hello
World!
```

双引号中以\开头的部分称为转义字符，转义字符能够实现丰富的文本输出功能。这里使用\n的好处是我们不需要额外声明使用endl，非常适合这样以字符串为结尾的内容。

在C++中，使用cin的方式如下：

```cpp
cin >> [要赋值的变量];
```

下面的程序会要求用户输入名字，并输出Hello：

```cpp
#include <iostream>
#include <string> // string头文件为C++提供了更易用的字符串支持

using std::cout;
using std::cin;
using std::string; // C++的字符串类型
using std::endl;

int main() {
	string name;
	cout << "Enter your name:";
	cin >> name;
	cout << "Hello, " << name << "!\n";
	return 0;
}
```

上面程序的输出如下：

```
Enter your name:Peter
Hello, Peter!
```

其中"Peter"是用户输入的名字。

# 7. C++的函数

在最开始的例子中，我们说明了main函数的作用，也知道了main函数是C++程序的起点。在C++中，我们可以声明与定义任意函数，格式如下：

```cpp
[返回类型] [函数名]([参数列表]) {
		// [函数体]
}
```

其中：

- 返回类型：我们期望函数调用后返回的数据类型；
- 函数名：我们调用这个函数的方式；
- 参数列表：我们期望交由函数处理的数据列表。

例如，我们需要定义一个add函数，这个函数接收2个整数，返回这两个整数相加的结果，代码如下：

```cpp
int add(int a, int b) {
	return a + b;
}
```

调用函数的代码如下：

```cpp
int c = 1;
int d = 2;
int e = add(c, d); // e的值是c和d调用add后的结果，这里为3
```

理论上，C++的函数参数列表可以由无限个参数组成，并且返回值也可以是任意类型。如果某个函数的返回类型为void，说明这个函数没有返回值。这在一些输出信息类的函数中很有用。我们可以定义一个函数，输出指定的参数。由于这个函数本来就不需要返回任何东西，所以我们能够将返回类型设定为void。在调用函数时，直接调用即可，无需额外定义变量来容纳返回结果。

C++的函数允许先声明后定义。例如，对于上述的add函数，有2种声明方式：

```cpp
int add(int a, int b); // 方式一
int add(int, int); // 方式二
```

其中方式2的声明方式更简洁，能够直观看到函数的返回类型与参数类型；方式1则更注重参数的语义，能够直观看到各参数作用。

两种写法的函数定义方式相同：

```cpp
int add(int a, int b) {
	return a + b;
}
```

在调用函数时，我们可以认为函数是一个黑盒，我们无法看到内部构造，但我们可以通过传入指定参数来获得预期输出。

# 8. C++程序的编译与运行

## 1. 直接使用编译器

在前面的内容中，我们大量提到了编译与运行结果。C++程序是怎样运行的？编译是什么？在下面的内容中，我们会逐一解答这些问题。

C++是一种编译型语言，也就是说，C++代码需要一个叫编译器的程序来将C++程序转换为可执行文件。与编译型语言相对的是解释型语言。

**编译型语言：指需要编译器将程序代码翻译为机器码后才能够执行程序的语言。例如C++、Rust、Go等。**

**解释型语言：指不需要编译，由解释器将程序代码实时翻译为机器码执行的语言。例如Python、JavaScript、R语言等。**

在Linux下，最常用的C++编译器为GCC。GCC全称GNU C Compiler，是编译C/C++语言的工具。在Linux下，我们通过如下命令安装适用于C++的编译器：

```bash
sudo apt install g++ # Ubuntu
sudo yum install gcc-c++ # RHEL/CentOS等
sudo zypper in gcc-c++ # OpenSUSE
sudo pacman -S g++ # Arch Linux
```

在安装完C++编译器后，我们便能够通过如下命令编译C++程序（假设我们要编译的文件名为main.cpp）：

```bash
g++ main.cpp
```

这行命令会在当前目录下生成一个a.out文件，这个a.out文件就是我们编写的程序的编译结果。

如果编译新的程序，那么原来的a.out就会被覆盖为新程序的代码。如果我们需要保留旧程序，该怎么做呢？一种方法是移动文件到另一个位置，例如：

```bash
mv a.out my_program
```

第二种方法是：通过-o参数指定输出文件位置。例如：

```bash
g++ -o my_program main.cpp
```

这样生成的程序就不会使用默认的a.out作为输出文件名，生成的可执行文件名为my_program。我们可以利用命令行来验证这一点：

```bash
orangepi@orangepi5pro:~/CLionProjects/expLinux$ file my_program
my_program: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=470aad7a798ab4b0025e09e585bdbafae8930655, for GNU/Linux 3.7.0, not stripped
```

结果显示my_program为针对ARM64平台编译的ELF可执行文件。根据编译时使用的计算机的CPU架构不同，file命令的结果也会发生变化。这里由于编译该程序的计算机为ARM64架构，所以file命令会显示为aarch64可执行文件。如果在常规的x86 PC上编译程序，file命令的结果会显示为amd64可执行文件（其中amd64表示这台x86 PC的CPU是64位架构）。

使用如下命令来执行我们刚刚编译好的程序：

```bash
./my_program # 具体文件名以自己设置的输出文件名为准
```

## 2. 使用现代化构建系统进行系统化编译

上面的方式让我们能够以最基础的方式编译C++程序，但是在一些项目（例如Linux内核、STM32或Arduino项目）中，代码的规模往往都十分庞大，仅仅依靠这种方式逐个文件编译程序是几乎不可能的，所以在一般的开发中，我们会使用一些现代化的构建系统（例如Make和CMake）等进行自动化编译与链接。

**链接：在C++程序中，我们能够指定在编译时输出链接文件，这样可以省去重复编译的时间。在修改某个或某些文件后，只需要重新编译这些文件并且与其他文件重新组合成可执行文件即可。将链接文件组合成可执行文件的过程叫做链接。**

下面以CMake为例，说明如何通过CMake进行项目的系统化编译。

**CMake：CMake是一个十分强大的跨平台编译工具链管理工具，支持将不同的源文件设置编译成不同的可执行文件、在编译前后执行自动化操作、链接第三方程序库、为不同操作系统、不同架构的CPU定制编译过程等功能。**

在使用CMake编译项目时，我们需要创建一个CMakeLists.txt文件，这个文件向CMake详细描述了要使用的C++标准、如何处理所有源文件、在编译前和编译后需要做什么等。对于上面的项目，我们可以这样编写CMakeLists.txt：

```cmake
cmake_minimum_required(VERSION 3.11) # 这里描述了CMake的最低版本，只有高于指定版本的CMake能够编译程序
project(my_program) # 这里描述了项目的名称

set(CMAKE_CXX_STANDARD 11) # 这里描述了我们要使用的C++标准是C++11

add_executable(my_program
        main.cpp) # 这里向CMake描述了如何处理源文件（这里是将main.cpp编译成my_program）
```

在编写好CMakeLists.txt后，我们便可以使用如下命令让CMake生成编译配置文件：

```bash
cmake -B build .
```

这里的“build”说明了我们希望将编译配置文件存放在build文件夹，而最后的.则说明了我们希望针对当前目录生成编译配置。CMake会自动检测系统中是否存在对应的编译器、生成编译配置文件。输出如下：

```
-- The C compiler identification is GNU 12.2.0
-- The CXX compiler identification is GNU 12.2.0
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working C compiler: /usr/bin/cc - skipped
-- Detecting C compile features
-- Detecting C compile features - done
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Configuring done
-- Generating done
-- Build files have been written to: /home/orangepi/CLionProjects/expLinux/build
```

接下来，我们移动到编译配置目录并编译程序：

```bash
cd build
make
```

命令行输出如下：

```
[ 50%] Building CXX object CMakeFiles/my_program.dir/main.cpp.o
[100%] Linking CXX executable my_program
[100%] Built target my_program
```

这时，我们就可以像之前一样执行我们的程序了。这样的流程对于只有一个源文件的程序来说稍显麻烦，但如果涉及到多个源文件以及有第三方库接入的项目来说，这样的管理工具就是十分有必要甚至不可或缺的。

# DLC1：C++的标准

C++的标准化工作始于1990年，最初由ANSI主导，后转为ISO与ANSI共同制定标准。最早制定的标准是C++98（ISO/IEC 14882:1998），该标准全面规范了C++语言特性，为不同编译器实现统一的程序行为提供了明确指导。ANSI/ISO C++还定义了标准类库，规定了所有合规C++系统库应具备的基本功能集。目前最新标准为C++26，但实际项目中普遍采用C++11或C++14版本，少数技术前瞻性项目会选择C++17或C++20标准，而采用C++23及以上标准的项目则极为罕见。

# DLC2：C++程序优化小技巧

可以通过命令行参数来对C++程序进行编译优化。例如：

```bash
g++ -O2 -o my_program main.cpp
```

C++编译优化有多个等级，例如O0（默认行为）、O1、O2、O3等。其中最常用的优化是O2优化，也被形象地称为“吸氧”。~~毕竟-O2也可以理解为减少氧气的量~~ ~~那-O3是不是吸臭氧~~

通过这些编译优化，编译器能够减少一些与程序运行无关的调试接口、调试量，减小程序体积，提高程序运行效率。
