# `numeric_limits` 学习笔记

## 标准库中提供数值型别的类型：`numeric_limits<>`

一般来说，数值型别（Numeric types）的极值是一个和平台相关的特性，不同平台上运行的程序，其开辟的每种数据类型的大小也是不一样的。

而在标准库中通过`numeric_limits<>`提供这些极值，来取代传统C语言所采用的预处理器常数（preprocessor constants）。当然在C++中也是可以使用后者的（整型常数定义于`<climits>`，浮点常数定义于            `<cfloat>`）。

## `numeric_limits<>`所提出的极值概念的优点

- 提供了更好的型别安全性
- 可借此写出一些`templates`以核定这些极值

## `numeric_limits<>`的运用

`numeric_limits<>`本身可以理解为一个模板类，这个模板类中具体的成员函数按照什么实现，还要根据数据的输入类型。如下，是通过`numeric_limits<>`来判断类型的极限大小：

```cpp
#include <iostream>
#include <limits>//numeric_limits<>定义于此
#include <string>
using namespace std;
 
int main()
{
	// use textual representation for bool
	cout << boolalpha;
 
	// print maximum of integral types
	cout << "max(short): " << numeric_limits<short>::max() << endl;
	cout << "max(int):   " << numeric_limits<int>::max() << endl;
	cout << "max(long):  " << numeric_limits<long>::max() << endl;
	cout << endl;
 
	// print maximum of floating-point types
	cout << "max(float):       "
		<< numeric_limits<float>::max() << endl;
	cout << "max(double):      "
		<< numeric_limits<double>::max() << endl;
	cout << "max(long double): "
		<< numeric_limits<long double>::max() << endl;
	cout << endl;
 
	// print whether char is signed
	cout << "is_signed(char): "
		<< numeric_limits<char>::is_signed << endl;
	cout << endl;
 
	// print whether numeric limits for type string exist
	cout << "is_specialized(string): "
		<< numeric_limits<string>::is_specialized << endl;
	system("pause");
}
```

