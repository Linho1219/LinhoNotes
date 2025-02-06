# 元组类型（Tuple Types） 学习笔记

### 基本形式

在不同语言中，**元组**（Tuple）通常用于表示一个固定长度的、不可变的元素集合，适合用于多个相关数据的组合。在 C++ 中，`std::tuple` 是泛型的，可用于组合任意数量和类型的元素。

在 C++ 中，这些二元组`std::tuple<int, int>`，三元组 `std::tuple<int, int, int>`，四元组`std::tuple<int, int, int, int>` 等类型通常统称为**元组类型（Tuple Types）**。由于元组可以包含任意数量和类型的元素，`std::tuple` 就是一个**通用元组容器**，可以用来将不同类型和数量的变量打包成一个单一的结构。

#### 使用解释

1. **定义**：`std::tuple<int, int, int>` 定义了一个元组，其包含三个整数元素。
2. **创建**：可以使用 `std::make_tuple` 快捷创建。
3. **访问**：`std::get<index>(tuple)` 用于访问特定位置的元素，`index` 从 `0` 开始。

#### 应用场景

`tuple<int, int, int>` 常用于需要将多个相关整数值打包处理时，例如返回多个计算结果，或在排序算法中临时存储多个比较值。

#### N 元组（任意数量的元素）

在 C++ 中可以创建任意长度的元组。例如，可以定义一个包含五个元素的 `tuple<int, int, int, int, int>` 或更多元素的组合。在这种情况下，通常是为了满足特定的业务逻辑需求，例如某种数据结构的存储，或在算法中传递大量相关的多元数据。

#### 使用元组的注意事项

1. **类型可以混合**：元组的元素类型不一定要相同，例如 `std::tuple<int, std::string, double>`。
2. **自动解构**：C++17 引入了结构化绑定，可以更方便地解构元组。

#### 使用例

```cpp
#include <tuple>
#include <iostream>

int main() {
    // 创建一个包含三个 int 元素的 tuple
    std::tuple<int, int, int> myTuple = std::make_tuple(10, 20, 30);

    // 使用 std::get 访问元素
    std::cout << "First element: " << std::get<0>(myTuple) << std::endl;
    std::cout << "Second element: " << std::get<1>(myTuple) << std::endl;
    std::cout << "Third element: " << std::get<2>(myTuple) << std::endl;

    return 0;
}
```

---

### 特殊形式 `std::pair`

`pair` 类型在 C++ 中是 `std::pair`，是一种特殊的**二元组类型（Binary Tuple Type）**，定义于头文件`#include <utility>` 。通常用来存储一对值。`std::pair` 也是 C++ 标准库中的一个泛型类模板，但和 `std::tuple` 不同，它只包含两个元素。这两个元素可以是任意类型，并且可以不同，因此 `std::pair` 常用于表达键值对、成对数据或二维坐标等场景。

#### 特点

1. **固定为两个元素**：`std::pair` 类型始终包含两个元素，因此可以理解为一个二元的特殊元组类型。
2. **元素访问**：元素使用 `.first` 和 `.second` 成员访问，而不像 `std::tuple` 需要使用 `std::get<index>(tuple)`。
3. **泛型支持**：`std::pair` 是模板类型，可以使用不同的类型参数，例如 `std::pair<int, double>` 或 `std::pair<std::string, int>`。

```cpp
	// 创建一个 pair，包含一个 string 和一个 int
    std::pair<std::string, int> student = {"Alice", 90};

    // 使用 .first 和 .second 访问元素
    std::cout << "Name: " << student.first << std::endl;
    std::cout << "Score: " << student.second << std::endl;
```

