# 3 AutoLISP 编程基础

> LISP 是 1958 年发明、以「列表处理」（LISt Processing）为核心的函数式编程语言家族，是仅次于 Fortran 的第二古老仍在使用的高级语言。 它以完全括号化的前缀语法、S-表达式、动态类型和强大的宏系统著称，并长期作为人工智能研究的主要语言。

AutoLISP 基于 LISP，是 AutoCAD 内嵌的脚本语言，可以用于自动化 AutoCAD 中的操作。

在 AutoCAD 中使用命令 `VLIDE` 可以启动 Visual LISP 编辑环境。在高版本的 AutoCAD 中也可以选择唤起 VSCode 进行编辑。

## 运算

所有运算符都以前缀形式表达。

```lisp
(+ x 3)  ; x+3
(- y 2)  ; y-2
(* m 4)  ; m*4
(/ n 2)  ; n/2
```

