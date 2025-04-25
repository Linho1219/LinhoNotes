# Lebesgue定理——隶属分析理论

——基于Darboux和分析

## Lebesgue零测集和Jordan零测集

* Lebesgue零测集

设有$E\subset\mathbb{R},\forall\epsilon\in\mathbb{R}^+,\exists\{\stackrel{\epsilon}{J}_{\alpha}\}_{\alpha = 1}^{+\infty}$（一个闭区间列）。

$$
s.t.\ E\subset \bigcup_{\alpha = 1}^{+\infty}\stackrel{\epsilon}{J}_{\alpha = 1}
$$

且

$$
\sum\limits_{\alpha = 1}^{+\infty}|\stackrel{\epsilon}{J}_{\alpha}|<\epsilon
$$

则称$E$为Lebesgue零测集，$\{\stackrel{\epsilon}{J}_{\alpha}\}_{\alpha = 1}^{+\infty}$为$\epsilon-$可列区间覆盖。
***
* Jordan零测集（包含于Lebesgue零测集）

设有$E\subset\mathbb{R},\forall\epsilon\in\mathbb{R}^+,\exists\{\stackrel{\epsilon}{J}_{\alpha}\}_{\alpha = 1}^{N_{\epsilon}}$

$$
s.t.\ E\subset\bigcup_{\alpha = 1}^{N_{\epsilon}}\stackrel{\epsilon}{J}_{\alpha}
$$

且

$$
\sum\limits_{\alpha = 1}^{N_{\epsilon}}|\stackrel{\epsilon}{J}_{\alpha}|<\epsilon
$$

则称$E$为Jordan零测集，$\{\stackrel{\epsilon}{J}_{\alpha}\}_{\alpha = 1}^{N_{\epsilon}}$为$\epsilon-$有限区间覆盖。

::: example

$\{x_{n}\}\in\mathbb{R}$是Lebesgue零测集；

$\{x_{n}\}\in\mathbb{R},\ x_{n}\rightarrow x_{\star}\in\mathbb{R}$为Jordan零测集。

:::
***
## 开集与闭集
* **定义1** 设有集合$A$，若对任意的收敛数列 $\{a_{n}\}\subset A$，都有$\{a_n\}\rightarrow a_{\star}\in A$，则称A为闭集。

::: example

闭区间$[a,b]$是闭集。

:::

* **定义2** 设有集合$A$，若对$\forall a\in A$，都有$a$的邻域包含于$A$，则称A为开集。

::: example

$x_0$的邻域$B_{\epsilon}(x_0)$为开集。

:::

***
* **定理3** （有界闭集的覆盖定理）

设$F$为有界闭集，设有$\{U_{\alpha}\}_{\alpha\in\Lambda}$为开集簇（$\Lambda$为指标集），

$$
s.t.\ F\subset\bigcup_{\alpha\in\Lambda}U_{\alpha},
$$

则有
$$
F\subset\bigcup_{j=1}^{N}U_{\alpha_{j}}.
$$


文字叙述：有界闭集必有有限覆盖。（题中的“有限”体现在$j$的取值范围）

::: info 证明

用反证法。假设需要无限覆盖。

由于F有界，可作闭区间$[a_0,b_0]\supset F$.

利用Bolzano二分法，取区间中点$\frac{a_0+b_0}{2}$，两闭区间$[a_0,\frac{a_0+b_0}{2}],[\frac{a_0+b_0}{2},b_0]$必有至少一个区间需要无限覆盖，设为$[a_1,b_1].$

对$[a_1,b_1]$，取区间中点$\frac{a_1+b_1}{2}$，两闭区间$[a_1,\frac{a_1+b_1}{2}],[\frac{a_1+b_1}{2},b_1]$必有至少一个区间需要无限覆盖，设为$[a_2,b_2].$

一直做下去，得到闭区间套$[a_n,b_n].$

根据闭区间套定理，$\exists!\xi\in[a_n,b_n],\ s.t.\ \lim\limits_{n\rightarrow+\infty}a_n=\lim\limits_{n\rightarrow+\infty}b_n=\xi.$

且区间$a_n,b_n$都需要无限覆盖。

设有$\xi\in U_{\alpha_{\star}}$，$U_{\alpha_{\star}}$为开集，根据开集的性质，$\forall\epsilon>0$，$\xi$的邻域$B_{\epsilon}(\xi)\subset U_{\alpha_{\star}}$。

然而，$\forall\epsilon>0,\ \exists N_{\epsilon a}\in\mathbb{N}^+,\forall n>N_{\epsilon a},\ a_n\in B_{\epsilon}(\xi)$，

且有$\forall\epsilon>0,\ \exists N_{\epsilon b}\in\mathbb{N}^+,\forall n>N_{\epsilon b},\ b_n\in B_{\epsilon}(\xi)$.

故当$n>\max\{N_{\epsilon a},N_{\epsilon b}\}$时，闭区间$[a_n,b_n]$只需要一个开集$U_{\alpha_{\star}}$即可覆盖，与假设矛盾！

因此$F\subset\bigcup\limits_{j=1}^{N}U_{\alpha_{j}}.$

证毕。

:::

***
根据定理3可以得到以下推论。

* **推论4** 设$E$为Lebesgue零测集，$E$为有界闭集，则$E$为Jordan零测集。

::: info 证明

由E为Lebesgue零测集，有
$$
\forall\epsilon>0,\exists\{\stackrel{\epsilon}{J}_{\alpha}\}_{\alpha=1}^{+\infty},s.t.
$$

$$
E\subset\bigcup_{\alpha=1}^{+\infty}\stackrel{\epsilon}{J}_{\alpha}
$$

且

$$
\sum_{\alpha=1}^{+\infty}|\stackrel{\epsilon}{J}_{\alpha}|<\epsilon.
$$

为了运用定理3，我们需要把闭区间变为开集，且保持包含关系不变。

Step 1:将闭区间放大$\lambda(\lambda>1)$倍。

易得$E\subset\bigcup\limits_{\alpha=1}^{+\infty}\stackrel{\epsilon}{J}_{\alpha}\subset\bigcup\limits_{\alpha=1}^{+\infty}\lambda\stackrel{\epsilon}{J}_{\alpha}$

Step 2:将闭区间的端点去掉，变成开集。

$$
E\subset\bigcup_{\alpha=1}^{+\infty}\stackrel{————}{\lambda\stackrel{\epsilon}{J}_{\alpha}}.
$$

根据定理3，有界闭集必有有限覆盖，则有

$$
E\subset\bigcup_{j=1}^{N_{\epsilon}}\stackrel{————}{\lambda\stackrel{\epsilon}{J}_{\alpha_{j}}}.
$$

Step 3:补上端点，使其重新成为闭区间，符合Jordan零测集的定义。

$$
E\subset\bigcup_{j=1}^{N_{\epsilon}}\lambda\stackrel{\epsilon}{J}_{\alpha_{j}}.
$$

证毕。

:::

***
## 集合的度量

* **定义5** 设有$A\subset\mathbb{R}$,我们引入$|E|=\inf\{\sum\limits_{\alpha=1}^{+\infty}|J_{\alpha}|\ \ |E\subset\bigcup\limits_{\alpha=1}^{+\infty}J_{\alpha}\}$，称$|E|$为集合$E$的度量。

* **命题6** $|E|=0\Leftrightarrow E$为Lebesgue零测集。

此结论易证。
***
## Lebesgue定理

* **定义7** 点的振幅 $\omega(f;x_0)\triangleq \lim\limits_{\delta\rightarrow 0}\omega(f;B_{\delta}(x_0)\cap D_x).$

* **定理8** 设有$x_0\in D_x,\omega(f;x_0)=0\Leftrightarrow f(x)$在$x=x_0$处连续。

此结论易证。

* **定理9** （推广的Cantor定理）

设$K$为有界闭集，满足$\omega(f;x)<\lambda\in\mathbb{R}^+,\forall x\in K.$

则有

$$
\forall\epsilon>0,\exists\delta_{\epsilon}>0,\forall\tilde{x},\hat{x}\in K,|\tilde{x}-\hat{x}|<\delta_{\epsilon},
$$

$$
|f(\tilde{x})-f(\hat{x})|<\lambda+\epsilon.
$$

::: info 证明

用反证法。

假设$\exists\epsilon>0,\ \forall \delta_{\epsilon}>0,\exists\tilde{x},\hat{x}\in K,|\tilde{x}-\hat{x}|<\delta_{\epsilon},s.t.$

$$
|f(\tilde{x})-f(\hat{x})|\ge\lambda+\epsilon
$$

取$\delta_{\epsilon}=\frac{1}{n}$,则有$\exists\tilde{x},\hat{x}\in K,|\tilde{x}-\hat{x}|<\frac{1}{n},s.t.$

$$
|f(\tilde{x})-f(\hat{x})|\ge\lambda+\epsilon.
$$

由于$K$为有界闭集，根据Bolzano-Weierstrass定理，$\{\tilde{x}\},\{\hat{x}\}$必有收敛子列。

设有$\tilde{x}_{n_{k}}\rightarrow\tilde{x}_{\star},\hat{x}_{n_{k}}\rightarrow\hat{x}_{\star}.$

则

$$
\begin{align}
|\tilde{x}_{\star}-\hat{x}_{\star}|&=|\tilde{x}_{\star}-\tilde{x}_{n_{k}}+\tilde{x}_{n_{k}}-\hat{x}_{n_{k}}+\hat{x}_{n_{k}}-\hat{x}_{\star}|\\
&<|\tilde{x}_{\star}-\tilde{x}_{n_{k}}|+|\tilde{x}_{n_{k}}-\hat{x}_{n_{k}}|+|\hat{x}_{n_{k}}-\hat{x}_{\star}|\\
&<3\epsilon.
\end{align}
$$

由$\epsilon$的任意性，可知$\tilde{x}_{\star}=\hat{x}_{\star}:=x_{\star}.$

$\omega(f;[x_{\star}-\epsilon,x_{\star}+\epsilon])\ge |f(\tilde{x}_{n_{k}})-f(\hat{x}_{n_{k}})|\ge\lambda+\epsilon.$

令$\epsilon\rightarrow 0$，根据极限的保号性，则有

$\omega(f;x_{\star})\ge\lambda$，与$\omega(f;x)<\lambda,\forall x\in K$矛盾！

证毕。

:::

***
* **定理10** （Lebesgue定理）$f(x)\in\Re[a,b]\Leftrightarrow f(x)$几乎处处连续。

**Rm**:$f(x)$几乎处处连续的刻画：

设有集合$\Lambda=\{x\in D_{x}|\omega(f;x)>0\}$（即$f(x)$不连续点的全集），$f(x)$几乎处处连续$\Leftrightarrow \Lambda$是Lebesgue零测集。

::: info 必要性证明

用反证法。假设$\Lambda$不是Lebesgue零测集。

考虑将$\Lambda$进行分割，设有$\Lambda_{n}=\{x\in D_{x}|\omega(f;x)>\frac{1}{n}\}.$

则$\Lambda=\bigcup\limits_{n=1}^{+\infty}\Lambda_{n}.$

由于$\Lambda$不是Lebesgue零测集，由命题6，$|\Lambda|>0.$

我们断言：$\exists|\Lambda_{n_\star}|>0.$

为了不割裂本题的思维逻辑，这个事实我们将在必要性证明完后加以证明。

我们需要根据假设，推出$f(x)\notin\Re[a,b]$，即$\Omega(f;P)>0$，从而与题目所给条件矛盾。

考虑分割$P:a=x_0,\ x_1,\ x_2,\ ...\ ,\ x_{k-1},\ x_{k},\ x_{k+1},\ ...\ ,\ x_n=b.$

设有$\Lambda_{n_\star}\supset\{y_n\}$，且$y_i\in[x_{k-1},x_k].$

下面根据不连续点$y_i$对区间的影响，分两种情况讨论。

Case 1: 不连续点只影响一个区间，即$y_i\in(x_{k-1},x_{k})$。

$$
\omega(f;[x_{k-1},x_{k}])>\omega(f;y_i)>\frac{1}{n_{\star}}.
$$

Case 2: 不连续点影响两个区间，即$y_i = x_k.$

$$
\frac{1}{n_{\star}}<\omega(f;y_i)<\omega(f;[x_{k-1},x_{k+1}])\le\omega(f;[x_{k-1},x_{k}])+\omega(f;[x_{k},x_{k+1}]).
$$

则$\omega(f;[x_{k-1},x_{k}])$和$\omega(f;[x_{k},x_{k+1}])$必有一个是大于$\frac{1}{2n_{\star}}.$（可用反证法证明）

综上，有$y_i$所在区间的振幅$\omega>\frac{1}{2n_{\star}}.$

现估计振幅和$\Omega(f;P)$，现需要将其缩小，使其大于0（或者大于某个正数）。

$$
\Omega(f;P)\ge\sum\limits_{i}\omega(f;[x_{k_i-1},x_{k_i}])\Delta x_{k_i}\ge\frac{1}{2n_{\star}}|\Lambda_{\star}|>0.
$$
根据极限的保号性，$\lim\limits_{P\rightarrow 0}\Omega(f;P)>\frac{1}{2n_{\star}}|\Lambda_{\star}|.$

根据振幅和判别法，$f(x)\notin\Re[a,b]$，这与$f(x)\in\Re[a,b]$矛盾！

所以$f(x)$是Lebesgue零测集。

:::

**Rm**: 上面我们提到，$|\Lambda|>0\Rightarrow \exists|\Lambda_{\star}|>0.$

下面我们证明这个事实。

**引理** 设有$e_i$是Lebesgue零测集$\Leftrightarrow e=\bigcup\limits_{i=1}^{+\infty}e_{i}$是Lebesgue零测集。

::: info 引理的证明

充分性易证。现只证明必要性。

$e_i$是Lebesgue零测集$\Leftrightarrow \exists\{\stackrel{\epsilon}{J}_{\alpha}\},s.t.$

$$
e_i\subset\bigcup_{\alpha=1}^{+\infty}\stackrel{\epsilon}{J}_{\alpha_i}
$$

$$
\sum_{\alpha=1}^{+\infty}|\stackrel{\epsilon}{J}_{\alpha_i}|<\frac{\epsilon}{2^i}.
$$

故有

$$
e\subset\bigcup_{i=1}^{+\infty}\bigcup_{\alpha=1}^{+\infty}\stackrel{\epsilon}{J}_{\alpha_i}.
$$

$$
\sum_{i=1}^{+\infty}\sum_{\alpha=1}^{+\infty}\stackrel{\epsilon}{J}_{\alpha_i}=\sum_{i=1}^{+\infty}\frac{\epsilon}{2^i}<\epsilon.
$$

故有$e$也为Lebesgue零测集。#

引理的逆否命题为：如有$e=\bigcup\limits_{i=1}^{+\infty}e_i$不是Lebesgue零测集，则$\exists e_i$不是Lebesgue零测集。

由于引理成立，其逆否命题也成立，则$|\Lambda|>0\Rightarrow\exists|\Lambda_{\star}|>0.$该事实成立。

:::

下面我们对Lebesgue定理的充分性进行证明。

::: info 充分性证明

设有$\Lambda$为Lebesgue零测集，需证明$f(x)\in\Re[a,b]$，对应$\exists\lim\limits_{n\rightarrow+\infty}\omega(f;[x_{k-1},x_k])\Delta x_k.$

作$\Lambda_\lambda=\{x\in[a,b]|\omega(f;x)\ge\lambda\}$，表示振幅大于$\lambda$的点的全集。此处$\lambda>0.$

则有$\Lambda_\lambda\subset\Lambda.$

则有

①$\Lambda_\lambda$为Lebesgue零测集；

②$\Lambda_\lambda$为有界闭集。

根据推论4，有$\Lambda_\lambda$为Jordan零测集。

设有$\forall\epsilon>0,\exists\{\stackrel{\epsilon}{J}_{\alpha}\}_{\alpha=1}^{N_{\epsilon}},s.t.$

$$
\Lambda_\lambda\subset\bigcup_{\alpha=1}^{N_{\epsilon}}\stackrel{\epsilon}{J}_{\alpha}
$$

$$
\sum_{\alpha=1}^{N_{\epsilon}}|\stackrel{\epsilon}{J}_{\alpha}|<\epsilon.
$$

将闭区间列放大为$\bigcup\limits_{\alpha=1}^{N_{\epsilon}}C\stackrel{\epsilon}{J}_{\alpha}(C>1)$，并去除端点，设为

$$
\bigcup_{\alpha=1}^{N_{\epsilon}}\stackrel{————}{C\stackrel{\epsilon}{J}_{\alpha}}(*)
$$

显然，$(*)$为开集。

作$K=[a,b]-(*)$，$[a,b]$为闭集，$(*)$为开集，则$K$为闭集，且有$\forall x\in K,\omega(f;x)<\lambda.$

根据定理9，有$\forall\epsilon>0,\exists\delta_{\epsilon}>0,\forall\tilde{x},\hat{x}\in K,|\tilde{x}-\hat{x}|<\delta_{\epsilon},s.t.\ |f(\tilde{x})-f(\hat{x})|<\lambda+\epsilon<2\lambda\epsilon.$

则$\sum\limits_{k=1,x\in K}^{N}\omega(f;[x_{k-1},x_k])\Delta x_k<2|P|\lambda\epsilon.$

而对集合$(*)$,控制每一个小区间宽度$\Delta x_k<\frac{\epsilon}{|K|/|P|}.$

$$
\sum_{k = 1,x\in K}^{N'}\omega(f;[x_{k-1},x_{k}])\Delta x_k<N'C_{\star}\frac{\epsilon}{|K|/|P|}=C_{\star}\epsilon.
$$

所以有$0<\Omega(f;P)<(2\lambda+C_{\star})\epsilon.$

由夹逼性，$\Omega(f;P)\rightarrow 0.$

证毕。

:::