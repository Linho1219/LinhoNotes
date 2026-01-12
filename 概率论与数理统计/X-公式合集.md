# 概率统计公式合集

## 常用分布

### 二项分布

- 符号：$X\sim B(n,p)$
- 概率：$P(X=k)=\mathrm C_n^kp^k(1-p)^{n-k}$
- 期望：$E(X)=np$
- 方差：$\operatorname{Var}(X)=np(1-p)$

### 泊松分布

- 符号：$X\sim P(\lambda)$
- 概率：$P(X=k)=\dfrac{\lambda^k}{k!}e^{-\lambda}$，$k=0,1,2,\cdots$
- 期望：$E(X)=\lambda$
- 方差：$\operatorname{Var}(X)=\lambda$

**二项分布的泊松近似**：若二项分布的 $n$ 充分大且 $p$ 充分小，$B(n,p)$ 可近似为 $P(np)$。

**泊松分布的可加性**：若有 $X,Y$ 相互独立且 $X\sim P(\lambda_1)$，$Y\sim P(\lambda_2)$，则有 $X+Y\sim P(\lambda_1+\lambda_2)$。

### 均匀分布

- 符号：$X\sim U(a,b)$
- $f(x)=\begin{cases}\dfrac1{b-a},&a<x<b\\0,&其他\end{cases}$
- $E(X)=\dfrac{a+b}2$
- $E(X^2)=\dfrac{a^2+ab+b^2}3$
- $\operatorname{Var}(X)=E(X^2)-[E(X)]^2=\dfrac{(b-a)^2}{12}$

### 正态分布

符号：$X\sim N(\mu,\sigma^{\color{orange}2})$，表示期望为 $\mu$、方差为 $\sigma^2$ 的正态分布。其密度函数为：

$$
\Large
f(x)=\dfrac1{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

对于 $X\sim N(\mu,\sigma^2)$，有

$$
P(a<X<b)=\varPhi\left(\frac{b-\mu}\sigma \right)-\varPhi\left(\frac{a-\mu}\sigma \right)
$$

另有**标准正态的 $k$ 阶原点矩公式**：

$$
E(X^k)=\begin{cases}
0 &k\,为奇数\\
(k-1)!! &k\,为偶数
\end{cases}
$$

**正态分布的可加性**：设随机变量 $X$ 与 $Y$ 相互独立，且 $X\sim N(\mu_1,\sigma_1^2)$，$X_2\sim N(\mu_2,\sigma_2^2)$，则有

$$
X+Y\sim N(\mu_1+\mu_2,\sigma_1^2+\sigma_2^2)
$$

### 二维正态分布

对于 $(X,Y)\sim N(\mu_1,\mu_2,\sigma_1^2,\sigma_2^2,\rho)$，有

$$
f(x,y)=\frac1{2\pi\sigma_1\sigma_2\sqrt{1-\rho^2}}
\exp\left\{
    -\frac1{2(1-\rho^2)}
    \left[
		\frac{(x-\mu_1)^2}{\sigma_1^2}
		-\frac{2\rho(x-\mu_1)(y-\mu_2)}{\sigma_1\sigma_2}
		+\frac{(y-\mu_2)^2}{\sigma_2^2}
    \right]
\right\}
$$

其中 $\rho$ 表示两个随机变量 $X,Y$ 的相关系数。

### 指数分布

- 符号：$X\sim E(\lambda)$
- $f(x)=\begin{cases}\lambda e^{-\lambda x},&x>0\\0,&其他\end{cases}$
- $F(x)=\begin{cases}1-e^{-\lambda x},&x\ge0\\0,&其他\end{cases}$
- $E(X)=\dfrac1\lambda$
- $\operatorname{Var}(X)=\dfrac1{\lambda^2}$

指数分布具有**无记忆性**。即 $P(X>s+t\operatorname|X>s)=P(X>t)$。

### $\chi^2$ 分布

设 $X_1,X_2,\cdots,X_n$ 为独立同分布随机变量，有 $X_i\sim N(0,1)$。则定义随机变量 $U=\sum\limits_{i=1}^nX_i^2$ 服从自由度为 $n$ 的 $\chi^2$ 分布，记为 $U\sim\chi^2(n)$。

- 期望 $E(X)=n$
- 方差 $\operatorname {Var}(X)=2n$
- 若 $X\sim N(0,1)$，则 $X^2\sim\chi^2(1)$
- 自由度为 $2$ 的 $\chi^2$ 分布就是参数为 $\dfrac12$ 的 [指数分布](./3-连续型随机变量#指数分布)，即 $E\left(\dfrac12\right)=\chi^2(2)$。

**$\chi^2$ 分布的可加性**：若 $Y_1\sim\chi^2(m)$，$Y_2\sim\chi^2(n)$，且 $Y_1,Y_2$ 相互独立，则有 $Y_1+Y_2\sim\chi^2(m+n)$。

### t 分布

**定义** 设随机变量 $X\sim N(0,1),Y\sim\chi^2(n)$ 且 $X,Y$ 相互独立，称随机变量 $T=\dfrac{X}{\sqrt{Y/n}}$ 所服从的分布为自由度 $n$ 的 t 分布，记为 $T\sim t(n)$。

当 $n\ge30$ 时，t 分布可使用标准正态分布近似替代。

期望 $E(X)=0$。

### F 分布

**定义** 设随机变量 $U\sim\chi^2(m),V\sim\chi^2(n)$ 且 $U,V$ 相互独立，则称随机变量 $F=\dfrac{U/m}{V/n}$ 服从自由度为 $(m,n)$ 的 F 分布，记为 $F\sim F(m,n)$。

## 协方差

$$
\begin{gathered}
\operatorname {Cov}(X,Y)=E\{[X-E(X)][Y-E(Y)]\} \\
\operatorname {Cov}(X,Y)=E(XY)-E(X)E(Y) \\
\operatorname {Cov}(X,X)=\operatorname {Var}(X)\\
\operatorname {Cov}(kX,lY)=kl\operatorname {Cov}(X,Y)\\
\operatorname {Var}(X\pm Y)=\operatorname {Var}(X)+\operatorname {Var}(Y)\pm 2\operatorname {Cov}(X,Y) \\
\operatorname {Cov}\left(\sum_{i=1}^m X_i,\sum_{j=1}^n Y_j \right)=\sum_{i=1}^m \sum_{j=1}^n\operatorname {Cov}(X_i,Y_j)\\
\operatorname {Cov}(X,Y)=\operatorname {Cov}(Y,X)
\end{gathered}
$$

## 大数定律与中心极限定理

**马尔可夫不等式**：对于**非负**随机变量 $X$，$\forall p,e>0$ 有

$$
P(X\ge\varepsilon)\le\frac{E(X^p)}{\varepsilon^p}
$$

**切比雪夫不等式**：对于**非负**随机变量 $X$，$\forall \varepsilon>0$ 有

$$
P(|X-E(X)|\ge\varepsilon)\le\frac{\operatorname {Var}(x)}{\varepsilon^2}
$$

设有随机变量 $X_1,X_2,\cdots,X_n,\cdots$，记 $\bar X=\dfrac1n\sum\limits_{i=0}^nX_i$，如果满足 $\bar X-E(\bar X)\xrightarrow P0$，称随机变量序列 $X_1,X_2,\cdots,X_n,\cdots$ 服从大数定律。

**马尔可夫大数定律**：如果随机变量序列满足 $\lim\limits_{n\to\infty}\dfrac1{n^2}\operatorname {Var}\left(\sum\limits_{i=1}^nX_i\right)=0$，则服从大数定律。

**辛钦大数定律**：独立同分布的随机变量序列，只要期望存在，就服从大数定律。

对于**独立同分布**随机变量 $X_1,\cdots,X_n,\cdots$，有

$$
(\bar X)^*
=({\textstyle\sum} X_i)^*
=\frac{\bar X-\mu}{\sigma/\sqrt n}
\xrightarrow LN(0,1)
$$

或者也可以表达为：

$$
\bar X\xrightarrow L N\left(\mu,\frac{\sigma^2}n \right)
$$

## 统计量

$$
\sum_{i=1}^n(X_i-\bar X)^2=\sum_{i=1}^n(X_i-c)^2-n(\bar X-c)^2
$$

通常 $c$ 取 $0$：

$$
\sum_{i=1}^n(X_i-\bar X)^2=\sum_{i=1}^nX_i^2-n\bar X^2
$$

### 最大次序统计量

$$
\begin{align}
X_{(n)}&=\max_{1\le i\le n}X_i \\
\Rightarrow F_{X_{(n)}}(x)&=[F(x)]^n \\
\Rightarrow f_{X_{(n)}}(x)&=\frac{\mathrm d}{\mathrm dx}F_{X_{(n)}}(x)=n[F(x)]^{n-1}f(x)\\
\end{align}
$$

### 最小次序统计量

$$
\begin{align}
X_{(1)}&=\min_{1\le i\le n}X_i \\
\Rightarrow F_{X_{(1)}}(x)&=1-[1-F(x)]^n \\
\Rightarrow f_{X_{(1)}}(x)&=\frac{\mathrm d}{\mathrm dx}F_{X_{(1)}}(x)=n[1-F(x)]^{n-1}f(x)\\
\end{align}
$$

## 正态分布抽样定理

设 $(X_1,\cdots,X_n)$ 是取自正态总体 $N(\mu,\sigma^2)$ 的一个样本，有

- $\bar X\sim N\left(\mu,\dfrac{\sigma^2}n\right)$，即 $\dfrac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$
- $\dfrac{\bar X-\mu}{S/\sqrt n}\sim t(n-1)$
- $\dfrac{(n-1)S^2}{\sigma^2}\sim\chi^2(n-1)$
