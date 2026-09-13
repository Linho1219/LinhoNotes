# 3 一个项目如何生长

这一篇计划从单文件程序出发，逐步引入翻译单元、CMake、错误处理、测试、调试、代码检查、第三方依赖和持续集成。

本篇尚在编写中。

- **3.1 从一个文件到多个翻译单元**
  - 声明与定义
  - 头文件和源文件
  - include guard / `#pragma once`
  - 编译与链接
  - 符号、链接错误、ODR
  - 静态库和动态库只讲基本概念
- **3.2 使用 CMake 管理项目**
  - executable、library、target
  - `target_link_libraries`
  - `target_include_directories`
  - `PUBLIC` / `PRIVATE` / `INTERFACE`
  - CMake Presets
  - CTest
  - 引入第三方依赖
- **3.3 错误不是打印一句话然后退出**
  - 前置条件、断言
  - 返回值
  - `optional` / `expected`
  - exception
  - 哪些错误在哪一层处理
  - 日志与面向用户的错误提示不是一回事
  - 基本异常安全保证
- **3.4 测试一个 C++ 程序**
  - 单元测试是什么
  - 测试纯函数
  - 测试类的不变量
  - 边界条件与失败路径
  - 测试替身只作简介
  - 通过 CTest 运行测试
- **3.5 让工具替你抓虫**
  - 提高编译警告等级
  - 调试器中的断点、单步、调用栈和变量
  - AddressSanitizer、UndefinedBehaviorSanitizer
  - `clang-tidy`
  - `clang-format`
  - Debug/Release 行为差异
- **3.6 依赖、版本控制与持续集成**
  - 为什么不应把第三方源码随手复制进项目
  - `find_package`
  - vcpkg / Conan 介绍，选择一种用于示例
  - Git 分支、提交、代码评审
  - CI 中构建、测试、静态检查
  - README 应当告诉别人什么
