# 离散对数 学习笔记

离散对数的定义方式和对数类似。取有原根的正整数模数 $m$，设其一个原根为 $g$. 对满足 $(a,m)=1$ 的整数 $a$，我们知道必存在唯一的整数 $0\leq k<\varphi(m)$ 使得

$$
g^k\equiv a\pmod m
$$

我们称这个 $k$ 为以 $g$ 为底，模 $m$ 的离散对数，记作 $k=\operatorname{ind}_g a$，在不引起混淆的情况下可记作 $\operatorname{ind} a$.

显然 $\operatorname{ind}_g 1=0$，$\operatorname{ind}_g g=1$.

## 性质

离散对数的性质也和对数有诸多类似之处。

> 设 $g$ 是模 $m$ 的原根，$(a,m)=(b,m)=1$，则：
> 1. $\operatorname{ind}_g(ab)\equiv\operatorname{ind}_g a+\operatorname{ind}_g b\pmod{\varphi(m)}$
>
>    进而 $(\forall n\in\mathbf{N}),~~\operatorname{ind}_g a^n\equiv n\operatorname{ind}_g a\pmod{\varphi(m)}$
>
> 2. 若 $g_1$ 也是模 $m$ 的原根，则 $\operatorname{ind}_g a\equiv\operatorname{ind}_{g_1}a \cdot \operatorname{ind}_g g_1\pmod{\varphi(m)}$
>
> 3. $a\equiv b\pmod m\iff \operatorname{ind}_g a=\operatorname{ind}_g b$

### 引入

**BSGS（baby-step giant-step）**，即**大步小步**算法，常用于求解离散对数问题。该算法可以在 $O(\sqrt p)$ 的时间复杂度内求解
$$
A^x\equiv B \pmod p
$$

### 方法

我们将求解的答案 $x$ 设为 $km−c (c<m)$ 的形式，即
$$
A^{km-c}\equiv B \pmod p
$$
也就是
$$
A^{km}\equiv BA^c \pmod p
$$
于是就可以用 `Meet in middle` 攻击了

### 进阶篇

对 $a,b\in\mathbf{Z}^+$，$p\in\mathbf{P}$，求解

$$
x^a \equiv b \pmod p
$$

该问题可以转化为 BSGS 求解的问题。

由于式子中的模数 $p$ 是一个质数，那么 $p$ 一定存在一个原根 $g$. 因此对于模 $p$ 意义下的任意的数 $x~(1\le x<p)$ 有且仅有一个数 $i~(0\le i<p-1)$ 满足 $x = g^i$.

#### 方法一

我们令 $x=g^c$，$g$ 是 $p$ 的原根（我们一定可以找到这个 $g$ 和 $c$），问题转化为求解 $(g^c)^a \equiv b \pmod p$. 稍加变换，得到

$$
(g^a)^c \equiv b \pmod p
$$

于是就转换成了 BSGS 的基本模型了，可以在 $O(\sqrt p)$ 解出 $c$，这样可以得到原方程的一个特解 $x_0\equiv g^c\pmod p$.

#### 方法二

我们仍令 $x=g^c$，并且设 $b=g^t$，于是我们得到

$$
g^{ac}\equiv g^t\pmod p
$$

方程两边同时取离散对数得到

$$
ac\equiv t\pmod{\varphi(p)}
$$

我们可以通过 BSGS 求解 $g^t\equiv b\pmod p$ 得到 $t$，于是这就转化成了一个线性同余方程的问题。这样也可以解出 $c$，求出 $x$ 的一个特解 $x_0\equiv g^c\pmod p$.

#### 找到所有解

在知道 $x_0\equiv g^{c}\pmod p$ 的情况下，我们想得到原问题的所有解。首先我们知道 $g^{\varphi(p)}\equiv 1\pmod p$，于是可以得到

$$
\forall\ t \in \mathbf{Z},\ x^a \equiv g^{ c \cdot a + t\cdot\varphi(p)}\equiv b \pmod p
$$

于是得到所有解为

$$
\forall\ t\in \mathbf{Z},a\mid t\cdot\varphi(p),\ x\equiv g^{c+\frac{t\cdot\varphi(p)}{a}}\pmod p
$$

对于上面这个式子，显然有 $\frac{a}{(a,\varphi(p))}  \mid t$. 因此我们设 $t=\frac{a}{(a,\varphi(p))}\cdot i$，得到

$$
\forall \ i\in \mathbf{Z},x\equiv g^{c+\frac{\varphi(p)}{(a,\varphi(p))}\cdot i}\pmod p
$$

这就是原问题的所有解。

## 扩展篇（扩展 BSGS）

对 $a,b,m\in\mathbf{Z}^+$，求解

$$
a^x\equiv b\pmod m
$$

其中 $a,m$ 不一定互质。

当 $(a, m)=1$ 时，在模 $m$ 意义下 $a$ 存在逆元，因此可以使用 BSGS 算法求解。于是我们想办法让他们变得互质。

具体地，设 $d_1=(a, m)$. 如果 $d_1\nmid b$，则原方程无解。否则我们把方程同时除以 $d_1$，得到

$$
\frac{a}{d_1}\cdot a^{x-1}\equiv \frac{b}{d_1}\pmod{\frac{m}{d_1}}
$$

如果 $a$ 和 $\frac{m}{d_1}$ 仍不互质就再除，设 $d_2=\left(a, \frac{m}{d_1}\right)$. 如果 $d_2\nmid \frac{b}{d_1}$，则方程无解；否则同时除以 $d_2$ 得到

$$
\frac{a^2}{d_1d_2}\cdot a^{x-2}≡\frac{b}{d_1d_2} \pmod{\frac{m}{d_1d_2}}
$$

同理，这样不停的判断下去，直到 $a\perp \dfrac{m}{d_1d_2\cdots d_k}$.

记 $D=\prod_{i=1}^kd_i$，于是方程就变成了这样：

$$
\frac{a^k}{D}\cdot a^{x-k}\equiv\frac{b}{D} \pmod{\frac{m}{D}}
$$

由于 $a\perp\dfrac{m}{D}$，于是推出 $\dfrac{a^k}{D}\perp \dfrac{m}{D}$. 这样 $\dfrac{a^k}{D}$ 就有逆元了，于是把它丢到方程右边，这就是一个普通的 BSGS 问题了，于是求解 $x-k$ 后再加上 $k$ 就是原方程的解啦。

注意，不排除解小于等于 $k$ 的情况，所以在消因子之前做一下 $\Theta(k)$ 枚举，直接验证 $a^i\equiv b \pmod m$，这样就能避免这种情况。

### 补充：小粉兔的另一种exBSGS

### [洛谷 P5345: 【XR-1】快乐肥宅 - 粉兔 - 博客园](https://www.cnblogs.com/PinkRabbit/p/LuoguP5345.html)

主要思想是特判“尾巴”，然后将环上的问题转化为朴素 `BSGS`