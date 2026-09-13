# 重新认识现代 C++

C/C++ 作为现在仍广泛使用的编程语言「老大哥」，常常用于培训、教学和考试。但由于课程和教材的时效性，许多教学停留在早期的 C++，也很少介绍工程化开发。这就留下了一个问题：

> 我已经知道变量、循环、函数、指针这些是什么了。现在我想知道，在 2026 年，一个 C++ 程序员是怎么写 C++ 的。

这是本套笔记的目标。假设你已经从中学算法竞赛、大学基础课程等等渠道了解了基础的 C++ 知识，我们不再从 hello world 开始，而是从一个基础上开始我们的旅程。

## 我们的起点

这里假设你已经了解：

- `int`、`double`、`char`、`bool` 等基础类型；
- 变量声明、赋值、`const` 和常见运算；
- 数组、`struct`、指针和引用的基本语法；
- `if`、`for`、`while` 等流程控制；
- 函数的声明、定义和调用；
- 使用 `std::cin` 和 `std::cout` 完成简单输入输出。

你不必已经理解对象生命周期、面向对象、模板、构建系统或现代 C++ 标准库。它们正是后文要讨论的内容。

下面是一段典型的课堂或竞赛风格代码。它能工作，也足以表达需求，所以也不算什么「错误示例」。不过，当需求继续增加、程序需要交给别人维护时，它很快就会遇到困难。

```cpp
#include <iostream>

#define MAXCOUNT 100

using namespace std;

struct Student {
    int id;
    int score;
};

void print_input_heading(int count);
void print_output_heading();

int main() {
    int count = 0;
    Student students[MAXCOUNT];

    while (true) {
        cin >> count;
        if (count > MAXCOUNT) {
            cout << "Too many! Try again." << endl;
        } else {
            break;
        }
    }

    print_input_heading(count);
    for (int i = 0; i < count; ++i) {
        cin >> students[i].id >> students[i].score;
    }

    print_output_heading();
    for (int i = 0; i < count; ++i) {
        if (students[i].score < 60) {
            cout << "Student id " << students[i].id << " with score "
                 << students[i].score << endl;
        }
    }
}

void print_input_heading(int count) {
    cout << "Now type " << count << " student(s):" << endl;
}

void print_output_heading() {
    cout << "Here are the student(s) who failed the exam:" << endl;
}
```

在这趟旅程中，我们会不断对这段程序产生新的见解，学着用更现代的方式重新表达这样的逻辑。

## 善用搜索引擎和 AI

这份笔记的内容不可能面面俱到、覆盖所有细节。事实上任何一本书或讲义都做不到。

对于想要了解的内容，不妨使用搜索引擎查询，或询问大语言模型。
