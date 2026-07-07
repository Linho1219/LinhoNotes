**By FunnyAWM**

> 运行环境说明：本章及以后章节换用Windows 64位x86 MinGW GCC编译器进行编译及运行。

在C++中，我们有一组绝大部分编译器都共有的文件，这些文件被称作标准库。其中STL也在标准库的范围内。这一章我们来具体探讨一下C++中的STL（标准模板库）容器与标准库函数。

在[这个仓库](https://github.com/FunnyAWM/MusicSyncTool)中可以找到大量对本章知识的应用。其中大部分容器出于Qt的限制改为了使用Qt提供的容器版本，与标准STL容器可能有部分不同（STL容器可能缺失了部分方法），仅供参考。
# 1. STL容器

## 1. 有哪些容器？

STL中包含的常用容器有string、vector、map、unordered_map等。受限于文章篇幅，我们在这一章里只重点讲述string与vector容器，其他容器可能会有提及。

## 2. string：C++的字符串容器

string容器应该是我们最常用的STL容器之一。string容器可以通过使用C字符串、复制、移动、使用有参构造函数等进行初始化。其中类提供的特殊有参构造函数如下：

| 函数 | 描述 |
|--|--|
| string(size_type n, char c) | 创建一个包含n个元素的string对象，其中每一个元素都被初始化为字符c |
| template\<class Iter\> string(Iter begin, Iter end) | 从迭代器范围创建string对象 |
| string(const string & str, string size_type pos = 0, size_type n = npos) | 创建string对象，数据为从pos位置开始的n个字符（如果n没有指定则为到结尾） |
| string(initializer_list\<char\> il) | 根据初始化列表创建对象（将在后面详细讲述容器初始化列表） |

我们可以直接使用cin或getline函数来向string对象中输入数据。string对象的长度是可变的，在对象空间不足时会自动扩容。例如：

```cpp
std::string str1;
std::cin >> str1;
std::getline(std::cin, str1); // 这种方式同样可以用于从文件流构造字符串
```

getline函数的第一个参数是一个istream流，它可以从用户键盘或文件中读取数据并初始化对应的对象。我们将在后续章节详细讲解C++的IO流。

由于string类重载了\[\]运算符，它也可以被当做常规的C字符串被访问。

string类提供了很多功能，包括查找子串、获取字符串长度、删除或替换字符等。STL类中的所有函数都能够在[Cpp Reference](https://zh.cppreference.com)找到，在这里不再赘述。

## 3. vector：C++的可变长数组

与string类似，vector也具有可变长度特性。vector属于我们之前提到的泛型类，它接受一个任意类型的模板参数，然后根据模板类型来初始化对象。

vector同样为我们提供了很多功能，包括获取元素数目、交换容器内容、获取容器的迭代器等。这里我们不再赘述其他方法，重点讲述一下STL容器中迭代器的概念。

## 4. 迭代器

迭代器可以被当做指向容器元素的指针使用，但其并不指向任何实际对象，常用于遍历整个容器。例如：

```cpp
void MSTDataSource::updateFavoriteBatch(const QList<FavoriteUpdate>& updates) {
	query.exec("BEGIN TRANSACTION");
	for (auto update = updates.begin(); update != updates.end(); ++update) {
		prepareStatement("UPDATE musicInfo SET favorite = :fav WHERE fileName = :fileName");
		bindValue(":fav", update->isFavorite);
		bindValue(":fileName", update->fileName);
		execQuery();
	}
	query.exec("COMMIT");
}
```

当然，由于QList具有迭代器与可迭代特性，上述代码也可以用C++的范围for循环进一步简化：

```cpp
void MSTDataSource::updateFavoriteBatch(const QList<FavoriteUpdate>& updates) {
	query.exec("BEGIN TRANSACTION");
	for (const auto& update : updates) {
		prepareStatement("UPDATE musicInfo SET favorite = :fav WHERE fileName = :fileName");
		bindValue(":fav", update.isFavorite);
		bindValue(":fileName", update.fileName);
		execQuery();
	}
	query.exec("COMMIT");
}
```

几乎所有具有迭代器的容器也都支持反向迭代操作。要实现反向迭代，只需要将begin()与end()改为rbegin()与rend()即可。

end()迭代器指向的对象都是容器中最后一个对象的后一对象。所有涉及到双迭代器的操作（后续用it1代表靠前的迭代器，用it2代表靠后的），其包含的范围都是\[it1, it2\)（包括it1指向的元素，但不包含it2指向的元素）。

迭代器有以下几个不同的类型：

- 输入迭代器：只读迭代器，单向移动，只能遍历一次，适用于从文件或输入流中读取数据；
- 输出迭代器：只写迭代器，单向移动，只能遍历一次，适用于将数据输出到文件或输出流中；
- 前向迭代器：结合了前两种迭代器的特点，同时支持了多次遍历；
- 双向迭代器：在前向迭代器的基础上实现了双向移动；
- 随机访问迭代器：在双向迭代器的基础上加入了任意位置跳转的能力。

随机访问迭代器支持常数时间的任意位置跳转（$O(1)$），而其他迭代器只能通过逐步移动来访问元素，从当前位置移动到任意位置的时间复杂度为 $O(n)$。

> [!INFO] 名词解释
> 时间复杂度：描述了某个算法或操作需要耗费的时间随输入规模的变化趋势。其中$O(1)$代表该算法或操作在使用任意参数时耗费的时间恒定，而$O(n)$代表该算法或操作需要的时间随需要进行该操作的元素数量呈线性增长。相似的表述还有$O(n^2)$（需要的时间随元素数呈二次增长）、$O(log n)$（需要的时间随元素数呈对数增长）、$O(n log n)$（需要的时间随元素数呈线性对数增长）、$O(2^n)$（需要的时间随元素数呈指数增长）、$O(n!)$（需要的时间随元素数呈阶乘增长）等。

> [!ERROR] 警告
> 当容器发生结构性变化（例如vector扩容、deque插入中间元素）时，针对当前容器的迭代器将全部失效，需要重新为其赋值。使用失效的迭代器可能会引起未定义行为。

# 2. 标准库算法

标准库算法为我们提供了一系列方便的功能，包括以下几方面：

- 非修改式序列操作（例如for_each()与find()等）；
- 修改式序列操作（例如transform()、random_shuffle()、any_of()、remove_if()等）；
- 排序、交换等及其相关操作（例如sort()与swap()等）；
- 通用数字运算。

这些函数主要集中在algorithm头文件，一些基础数学运算函数则在numeric头文件中。

以下我们选取几个典型函数进行详细讲解（所有函数的使用方法都能够在[Cpp Reference](https://zh.cppreference.com)找到）。

> [!INFO] 关于这些函数实现的说明
> any_of与remove_if函数于C++11中被实现，而random_shuffle函数已在C++17中被移除，在C++11及以后，更推荐使用std::shuffle。
## 1. for_each

该函数接收两个迭代器参数与一个函数指针或Lambda表达式，对迭代器范围内的所有对象执行函数或Lambda操作。

## 2. xxx_of宇宙与xxx_if宇宙

这些函数都是从C++11开始引入的算法，极大方便了对容器的元素筛选与整体判断操作。

any_of函数接收两个迭代器参数与一个函数指针或Lambda表达式，用于判断迭代器范围中是否有元素满足函数或Lambda表达式中描述的条件。其中函数指针或Lambda表达式必须满足谓词要求，即要求这个函数的返回类型必须为bool。

all_of对参数的要求同any_of，用于判断迭代器范围中是否所有元素都满足要求。

none_of对参数的要求同any_of，用于判断迭代器范围中是否没有元素满足要求。

以上所有函数在满足判断时返回true，不满足时返回false。

remove_if函数对参数的要求同any_of，但是remove_if的作用为：将所有不满足函数或Lambda表达式中描述的条件的元素移动到容器尾，并返回一个新范围结尾的尾迭代器。这个函数配合erase函数可以用于快速筛选满足指定要求的值，被称为擦除移除手法。例如：

```cpp
std::string str = "The quick brown fox jumps over the lazy dog";
str.erase(std::remove_if(str.begin(), str.end(), [](unsigned char ch){
  return std::isspace(ch); // 需要包含cctype以使用isspace函数
}), str.end()); // 这个操作移除了容器中的所有空格字符
```

从C++20开始，这个操作也可以被直接被erase_if替代，直接实现移除擦除手法（~~一步到位~~）。

## 3. 排序与交换

### 1. 排序

sort函数为我们提供了标准库内部支持的排序操作，对于可比较类型，直接调用sort函数即可。对于自定义类型，通常需要手动实现operator<以满足可比较特性，或手动传入返回bool类型的比较函数以满足可比较特性。如果没有实现可比较特性，编译器会在编译时抛出如下报错：

```cpp
// 示例代码
#include <list>
using namespace std;

struct MyStruct {
    int a;
};

int main() {
    std::list<MyStruct> list;
    list.sort(); // 这里使用的是list容器的sort成员函数而非std::sort，这是因为list无法满足标准sort函数的随机访问迭代器要求（list只有双向迭代器）
}
```

```text
In file included from E:/JetBrainsTools/CLion/bin/mingw/lib/gcc/x86_64-w64-mingw32/13.1.0/include/c++/list:65,
                 from C:/Users/11429/CLionProjects/toturial/main.cpp:2:
E:/JetBrainsTools/CLion/bin/mingw/lib/gcc/x86_64-w64-mingw32/13.1.0/include/c++/bits/stl_list.h: In instantiation of 'bool std::__detail::_Scratch_list::_Ptr_cmp<_Iter, void>::operator()(std::__detail::_List_node_base*, std::__detail::_List_node_base*) const [with _Iter = std::_List_iterator<MyStruct>]':
E:/JetBrainsTools/CLion/bin/mingw/lib/gcc/x86_64-w64-mingw32/13.1.0/include/c++/bits/stl_list.h:203:18:   required from 'void std::__detail::_Scratch_list::merge(std::__detail::_List_node_base&, _Cmp) [with _Cmp = _Ptr_cmp<std::_List_iterator<MyStruct>, void>]'
E:/JetBrainsTools/CLion/bin/mingw/lib/gcc/x86_64-w64-mingw32/13.1.0/include/c++/bits/list.tcc:515:23:   required from 'void std::__cxx11::list<_Tp, _Alloc>::sort() [with _Tp = MyStruct; _Alloc = std::allocator<MyStruct>]'
C:/Users/11429/CLionProjects/toturial/main.cpp:11:14:   required from here
E:/JetBrainsTools/CLion/bin/mingw/lib/gcc/x86_64-w64-mingw32/13.1.0/include/c++/bits/stl_list.h:188:34: error: no match for 'operator<' (operand types are 'MyStruct' and 'MyStruct')
  188 |           { return *_Iter(__lhs) < *_Iter(__rhs); }
      |                    ~~~~~~~~~~~~~~^~~~~~~~~~~~~~~
```

这里的报错原因是：由于我们既没有实现operator<，也没有实现自定义比较函数，sort函数由于无法建立严格弱序关系而报错。

#### DLC：从离散数学角度解释排序为什么要实现正确比较

STL的排序算法要求元素上存在一种严格弱序关系，从数学上讲，这要求operator<函数或自定义比较函数必须定义该集合上的一个二元关系 $R(a < b)$ 。

STL要求这样的$R$必须满足以下三条公理：

- 非自反性（Irreflexive）：对于集合中的任意元素 $a$, $a < a$ 恒为假。即任何元素都不能小于自身;
- 非对称性（Asymmetric）：对于任意元素$a, b$，如果$a<b$为真，那么$b<a$必然为假。不能出现“相互小于”这种左右脑互搏的情况。
- 传递性（Transitive）：对于任意元素$a,b,c$，如果$a<b$且$b<c$，那么$a<c$必然为真。

如果其中的任意一条公理无法满足，就会导致该$R$在集合上的关系不再是一个偏序关系。这将导致排序算法无法保证满足其不变式，进而导致算法结果不可预测。假设我们有以下代码：

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

struct Broken {
    int value;
};

int main() {
    auto broken_compare = [](const Broken& a, const Broken& b) {
        if (a.value % 2 == 0 && b.value % 2 == 1) return true;
        if (a.value % 2 == 1 && b.value % 2 == 0) return false;
        return a.value < b.value;
    };

    std::vector<Broken> vec = {{2}, {3}, {5}, {1}, {4}};
    std::sort(vec.begin(), vec.end(), broken_compare);

    // 结果不可预测，可能死循环或错误排序
    for (const auto& x : vec) {
        std::cout << x.value << " ";
    }
    return 0;
}
```

很明显上述代码中的broken_compare函数不满足偏序关系中要求的传递性，进而导致sort函数的结果不可预测，甚至导致未定义行为。

### 2. 交换

swap函数能够实现对任意相同类型变量的值交换操作，这要求元素必须实现可复制特性（即有能够使用的复制构造函数，即便它是默认的）。从C++11开始，swap函数会优先使用移动构造函数实现交换行为，如移动构造函数不可用，则会退化到复制行为。

对于STL容器，部分容器实现了自己的swap成员函数，用于快速交换整个容器，而不需要逐个交换元素。
