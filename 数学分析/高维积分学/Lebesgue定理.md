# Lebesgue 定理

## $\mathbb R^n$ 中的零测集

### Lebesgue 零测集

**定义 1.** 对于一个集合 $E$，若存在 $n$ 维区间 $\set{\stackrel{\varepsilon}{J}_{\alpha}}_{\alpha \in \mathbb N}$，满足
$$
\begin{cases}
E \subset \bigcup\limits_{\alpha = 1}^{+\infty} \stackrel{\varepsilon}{J}_{\alpha} \\
\sum\limits_{\alpha = 1}^{+\infty} |\stackrel{\varepsilon}{J}_{\alpha}|< \varepsilon
\end{cases},
$$
则称集合 $E$ 为 Lebesgue 零测集。

**引理 1.** （1）单点集合、有限个点的集合都是 Lebesgue 零测集。

（2）有限个或可列个 Lebesgue 零测集的并集也是 Lebesgue 零测集。

（3）Lebesgue 零测集的子集本身也是 Lebesgue 零测集。

（4）非退化区间 $[a, b] \subset \mathbb R^n$ 不是 Lebesgue 零测集。

证明：（1）对于有限个点的集合，考虑对每个点作 $\varepsilon-$邻域覆盖，若该集合有 $N$ 个点，则上述覆盖的体积和为
$$
\sum_{\alpha = 1}^{N} |\stackrel{\varepsilon} J_{\alpha}| = N \varepsilon.
$$
故含有有限个点的集合为 Lebesgue 零测集；更进一步地，为 Jordan 零测集。

（2）不妨设 $E = \bigcup\limits_{i} E_i$ 是可列个 Lebesgue 零测集的并。对 $E_i$，作覆盖 $\set{\stackrel{\varepsilon}{J}_{i\alpha}}_{\alpha \in \mathbb N}$，满足
$$
\sum_{\alpha = 1}^{+\infty} |\stackrel{\varepsilon}J_{i \alpha}| < \frac{\varepsilon}{2^i},i = 1, 2, \cdots
$$
则这些覆盖的总体积和为
$$
\sum_{i = 1}^{n} \sum_{\alpha = 1}^{+\infty} |\stackrel{\varepsilon}J_{i\alpha}| < (\frac{1}{2^1} + \frac{1}{2^2} + \cdots + \frac{1}{2^n}) \varepsilon < \varepsilon.
$$
此处 $n$ 可以为有限数或者无穷。

故 $E$ 为 Lebesgue 零测集。

（3）显然。

（4）根据有界闭集的覆盖定理，在有界闭集 $[a, b]$ 的所有开覆盖中，总是可以抽取出一个有限的开覆盖。

可以观察到，开覆盖的体积和应当要大于原区间的体积。下面利用归纳法证明这一事实。

当 $n = 1$ 时，作开区间 $(\alpha, \beta) \supset [a, b]$，显然有 $\alpha^i < a^i, \forall i \in \set{1, \cdots, n}$，$\beta^j > b^j, \forall j \in \set{1, \cdots, n}$. 故 $(\alpha, \beta)$ 的体积大于 $[a, b]$ 的体积。

设命题对 $n = 1, 2, \cdots, k$ 均已成立。考虑由 $(k + 1)$ 个开区间构成的覆盖。取点 $a$ 的开覆盖 $(a_1, a_2)$，显然有 $a_1 < a$.

- 若 $a_2 > b$，结论已经成立；

- 若 $a < a_2 < b$，则区间 $[a_2, b]$ 可以用 $k$ 个开区间构成覆盖。根据归纳假设，这 $(k + 1)$ 个开覆盖的体积和为
  $$
  V > |a_2 - a_1|_{\mathbb R^n} + |b - a_2|_{\mathbb R^n} > |b - a|_{\mathbb R^n}.
  $$

故闭区间 $[a, b]$ 的开覆盖的体积和大于 $b - a$. 因此不可能为 Lebesgue 零测集。$\square$

**例 1.** $\mathbb R^n$ 中的有理点集是可列集，因而为 Lebesgue 零测集。

**例 2.** 设 $f: I \to \mathbb R$ 是定义在 $(n - 1)$ 维欧氏空间 $I \subset \mathbb R^{n - 1}$ 上的连续实值函数。证明：它在 $\mathbb R^n$ 中的图象是 $n$ 维 Lebesgue 零测集。

证明：由 $f$ 在 $I$ 上一致连续，$\forall \varepsilon > 0, \exists \delta_{\varepsilon} > 0$，有
$$
|f(\boldsymbol x_1) - f(\boldsymbol x_2)|_{\mathbb R^{n - 1}} < \varepsilon, \forall \boldsymbol x_1, \boldsymbol x_2 \in I, |\boldsymbol x_1 - \boldsymbol x_2|_{\mathbb R^{n - 1}} < \delta_{\varepsilon}.
$$
如果考虑作分割 $P$，$|P| < \delta_{\varepsilon}$，那么函数 $f$ 在每一个分割区间 $I_{i}$ 上的振幅都小于 $\varepsilon$.

$\forall \boldsymbol x_i \in I_i$，取 $n$ 维区间 $\tilde I_i = I_i \times [f(x_i) - \varepsilon, f(x_i) + \varepsilon]$，则 $\tilde I_i$ 显然包含 $I_i$ 区间上 $f$ 的图象。因此 $\tilde I_i$ 的并集 $\bigcup\limits_i \tilde I_i$ 覆盖了区间 $I$ 上 $f$ 的图象。

现在计算 $\tilde I_i$ 的体积和
$$
\sum_i |\tilde I_i| = \sum_{i}|I_i| \cdot 2 \varepsilon = 2 \varepsilon |I| = C \varepsilon.
$$
故 $f$ 在 $\mathbb R^n$ 中的图象为 Lebesgue 零测集。$\square$

**Rm.** 上面这个映照其实就是 $\mathbb R^n$ 中曲面的 Monge 型表示。这也就是说，Monge 型曲面是 Lebesgue 零测集。

## Cantor 定理的一个推广

- 集合上的振幅：$\omega(f; E) := \sup\limits_{x_1, x_2 \in E} |f(x_1) - f(x_2)|$.
- 点上的振幅：$\omega(f; x) := \lim\limits_{\delta \to 0+0} \omega(f; B_{\delta}(x) \cap E)$.

**引理 2.** 若对紧集 $K$ 上的每一个点，函数 $f: K \to R$ 都满足关系式 $\omega(f; x) \le \omega_0$，则对任意 $\varepsilon > 0$，可以找到 $\delta_{\varepsilon} > 0$，使得不等式 $\omega(f; B_{\delta}(x) \cap K) < \omega_0 + \varepsilon$ 对任意 $x \in K$ 都成立。

证明：
$$
\omega(f; x) := \lim_{\delta \to 0} \omega(f; B_{\delta}(x) \cap K).
$$
这等价于 $\forall \varepsilon > 0, \exists \delta_{\varepsilon} > 0, \forall \delta < \delta_{\varepsilon}$，均有
$$
|\omega(f; B_{\delta}(x) \cap K) - \omega(f; x)| < \varepsilon.
$$
即
$$
\omega(f; B_{\delta}(x) \cap K) < \omega(f; x) + \varepsilon < \omega_0 + \varepsilon.
$$
$\square$

## Lebesgue 定理

如果某个性质几乎在集合 $M$ 上所有点成立，或者说在 $M$ 上几乎处处成立，这句话的意思也就是==使这个性质不成立的 $M$ 的子集是 Lebesgue 零测集==。

**定理 1.** （Lebesgue 定理）$f \in \Re(I) \Leftrightarrow f$ 在 $I$ 上有界，且 $f$ 在 $I$ 上几乎处处连续。

### 必要性

显然需有 $f$ 在 $I$ 上连续。下面证明不连续点的全集为 Lebesgue 零测集。

设不连续点的全集为 $\Lambda_f = \set{x_{\star} \in I|\omega(f; x_{\star}) > 0}$.

我们可以将其表示为 $\Lambda_f = \bigcup\limits_{n = 1}^{+\infty} \Lambda_n$，其中 $\Lambda_n = \set{x_{\star} \in I | \omega(f; x_{\star}) \ge \frac{1}{n}}$.

我们利用反证法。假设 $\Lambda_f$ 不是 Lebesgue 零测集。

引理 1（2）的逆否命题为：若集合 $E = \bigcup\limits_{i} E_i$ 不是 Lebesgue 零测集，则必有至少一个子集 $E_i$ 不是 Lebesgue 零测集。

根据上面这个命题，由于 $\Lambda_f$ 不是 Lebesgue 零测集，$\exists n_{\star} \in \mathbb N$，使得 $\Lambda_{n_{\star}}$ 不是 Lebesgue 零测集。

$f \in \Re(I) \Leftrightarrow \Omega(f; I) = 0$.

为了推出矛盾，我们的目标是说明 $\Omega(f; I) > 0$.
$$
\Omega(f; I) := \lim_{|P| \to 0} \sum_{\alpha = 1}^{N} \omega(f; I_{\alpha}) |I_{\alpha}|.
$$
不妨设 $x_{\star} \in \Lambda_{n_{\star}}$，以下我们对 $x_{\star}$ 在分割区间内的位置进行讨论。

- $x_{\star} \in \mathring I_{\alpha}$，则有
  $$
  \omega(f; I_{\alpha}) \ge \omega(f; x_{\star}) \ge \frac{1}{n_{\star}}.
  $$

- $x_{\star} \in \partial I_{\alpha}$，则有
  $$
  \omega(f; I_{\alpha} \cup I_{\alpha + 1}) \ge \omega(f; x_{\star}) \ge \frac{1}{n_{\star}}.
  $$
  则必有两个区间上的振幅必定有一个（不妨设为 $I_{\alpha}$ 上的振幅）满足
  $$
  \omega(f; I_{\alpha}) \ge \frac{1}{2n_{\star}}.
  $$

 则有
$$
\Omega(f; P) \ge \frac{1}{2n_{\star}} \sum_{i = 1}^{N_{n_{\star}}}|I_i|.
$$
其中 $I_i$ 是与 $\Lambda_{n_{\star}}$ 交集非空的集合，同时满足
$$
\Lambda_{n_{\star}} \subset \bigcup_{i = 1}^{N_{n_{\star}}} I_i.
$$
由于 $\Lambda_{n_{\star}}$ 不是 Lebesgue 零测集，故其开覆盖的体积和必定大于零，即
$$
\inf \set{\sum_{\alpha = 1}^{+\infty} |J_{\alpha}|\ | \Lambda_{n_{\star}} \subset \bigcup_{\alpha = 1}^{+ \infty}} > 0.
$$
因此有
$$
\sum_{i = 1}^{N_{n_{\star}}} |I_i| > 0.
$$
因此
$$
\Omega(f; P) > 0.
$$
这与 $f \in \Re(I)$ 相矛盾！因此 $\Lambda_f$ 是 Lebesgue 零测集。

### 充分性

考虑作 $\Lambda_{\varepsilon} = \set{x_{\star} \in I|\omega(f; x_{\star}) \ge \varepsilon} \subset \Lambda_f$.

由 $\Lambda_f$ 是 Lebesgue 零测集，$\Lambda_{\varepsilon}$ 也是 Lebesgue 零测集。由于其为有界闭集，故为 Jordan 零测集。根据零测集的定义，$\exists \set{J_{\alpha}^{\varepsilon}}_{\alpha = 1}^{N}$，满足
$$
\begin{cases}
\Lambda_{\varepsilon} \subset \bigcup\limits_{\alpha = 1}^{N} J_{\alpha}^{\varepsilon} \\
\sum\limits_{\alpha = 1}^{N} | J_{\alpha}^{\varepsilon} | < \varepsilon.
\end{cases}
$$
下面分两部分对振幅和进行估计：包含 $\Lambda_{\varepsilon}$ 中的点，以及不包含两种情况。

- 处理不包含 $\Lambda_{\varepsilon}$ 中的点的情况。作 $K = I - \bigcup\limits_{\alpha = 1}^{N} \lambda \mathring J_{\alpha}^{\varepsilon}$，其中 $\lambda > 1$.

  显然，$K$ 是一个闭集。$K$ 上的点满足以下性质：
  $$
  \omega(f; x) < \varepsilon, \forall x \in K.
  $$
  根据闭集上广义 Cantor 定理，$\forall \varepsilon > 0, \exists \delta_{\varepsilon} > 0, \text{ s.t. }$
  $$
  |f(\tilde x) - f(\hat x)| < 2\varepsilon, \forall \tilde x, \hat x \in K, |\tilde x - \hat x|_{\mathbb R^n} < \delta_{\varepsilon}.
  $$
  对任意分割 $P$，若 $I_{\alpha} \subset K$，则我们可以将 $I_{\alpha}$ 上的振幅控制到小量！

- 处理包含 $\Lambda_{\varepsilon}$ 中的点的情况。

  若 $I_{\alpha} \cap \lambda \mathring J_{\alpha}^{\varepsilon} \neq \varnothing$，由于 $f$ 在 $I$ 上有界，则其振幅必然有界；由于 $\lambda J_{\alpha}^{\varepsilon}$ 为 Jordan 零测集，这部分的体积可以控制到小量！

综合以上两方面的考虑，对任意的分割 $P$，我们都可以把振幅和 $\Omega(f;P)$ 控制到小量。因此有
$$
f(x) \in \Re(I).
$$
$\square$

