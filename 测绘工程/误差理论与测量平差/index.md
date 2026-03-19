# 误差理论与测量平差

基于同济大学出版社《误差理论与测量平差》第三版。

可以认为本课程是 [测量学 / 测量误差及处理方法](../测量学/2-测量误差及处理方法) 的扩充。

## 前置知识

- 高等数学
  - 非线性方程线性化：$y=f(x)=f(x_0)+\dfrac{\mathrm df(x_0)}{\mathrm dx}(x-x_0)$
  - 拉格朗日数乘法：$L=f(x,y)+\lambda\varphi(x,y)$
- 线性代数
  - 矩阵的基本运算：$\boldsymbol A+\boldsymbol B$，$\boldsymbol A\boldsymbol B$，$\boldsymbol A^{\mathrm T}$，$\boldsymbol A^{-1}$
  - 矩阵的数字特征：$\operatorname {rank}(\boldsymbol A)$，$\operatorname {tr}(\boldsymbol A)$
- 概率论与数理统计
  - 随机变量的数字特征：$E(X)$，$D(X)$
  - 正态分布及其性质：$\dfrac1{\sqrt{2\pi}\sigma}\exp\left[-\dfrac{(x-\mu)^2}{2\sigma^2} \right]$

## 符号约定

- 矩阵使用方括号，例如 $\begin{bmatrix}a&b\\c&d\end{bmatrix}$
- 单位矩阵使用符号 $\boldsymbol I$
