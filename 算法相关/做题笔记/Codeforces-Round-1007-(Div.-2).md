# Codeforces Round 1007 (Div. 2)

## [Problem - C - Codeforces](https://codeforces.com/contest/2071/problem/C)

## 游记

赛时看到这道题优先考虑了分治处理，但是发现这样会变得很麻烦，遂放弃

在手玩的过程中发现一定有解，于是考虑一个合理的构造方案

一个很自然的想法是把陷阱节点作为根节点来考虑，同时注意到对于任意三个节点组成的树，按照 DFS 序逆着取一定能够达成目标

随后发现拓展到其他情形也是正确的，赛时没有细想为什么就直接打出来过了

## 题解

接下来将证明这一策略的正确性

- 对于任意的子树，其树根一定是在其子树内最后被选中的

- 易知，对于叶子节点的父亲，若老鼠在其儿子上，选中之后可以把它“拉上来”

- 进而由数学归纳法得：对于任意一次操作，操作之后老鼠不会位于本次选择的节点的不含它自身的子树内
- 进而可以说明，最后选择根节点，则最后老鼠一定在根节点上

## AC代码

```C++
void solve(){
	ll n,st,en,tot=0;
	cin>>n>>st>>en;
	vector<ll> eg[n+1];
	vector<ll> dfn(n+1,0),rnk(n+1,0);
	for(ll i=1;i<n;i++){
		ll u,v;
		cin>>u>>v;
		eg[u].emplace_back(v);
		eg[v].emplace_back(u);
	}
	
	function<void(ll)> dfs=[&](ll u){
		dfn[u]=++tot;
		rnk[tot]=u;
		for(auto v:eg[u])
			if(!dfn[v])
				dfs(v);
	};
	
	dfs(en);
	for(ll i=n;i>=1;i--)
		cout<<rnk[i]<<' ';
	cout<<endl;
}
```

## [Problem - D1 - Codeforces](https://codeforces.com/contest/2071/problem/D1)

## 题解

根据异或的性质：异或两个相同的数，结果一样

可以发现在生成的数列中交替出现着某一个数（随 $n$ 的奇偶性，这个数的位置不一样）

那么其他的数 $a_m$ 就可以看作是这个数再异或上 $a_{\lfloor \frac m 2 \rfloor}$ 于是就可以递归求解

## AC代码

```C++
void solve(){
	ll n,l,r;
	cin>>n>>l>>r;
	vector<ll> v(n+1),prev(n+1);
	for(ll i=1;i<=n;i++)
		cin>>v[i],prev[i]=prev[i-1]^v[i];
	ll ans=0;
	
	function<ll(ll)> sol=[&](ll k)->ll{
		if(k<=n) return v[k];
		if(k/2<=n) return prev[k/2];
		if(n&1){
			if(k/2&1)
				return prev[n];
			else
				return prev[n]^sol(k/2);
		}
		else{
			if(k/2&1)
				return sol(n+1)^prev[n];
			else
				return sol(n+1)^prev[n]^sol(k/2);
		}
	};
```

## [Problem - D2 - Codeforces](https://codeforces.com/contest/2071/problem/D2)

## 题解

为了升级解决方案，我们定义了一个递归函数：

$ \text{sum}(m) = \left( \displaystyle\sum_{\substack{i \leq m \\ i \text{ even}}} a_i,\; \displaystyle\sum_{\substack{i \leq m \\ i \text{ odd}}} a_i \right).$

我们预先计算 $m \le 2n$ 的偶数和奇数前缀和。对于 $m \gt 2n$ 来说，接下来就是 $a_m$ 项：

$ a_m = \begin{cases} p & \text{if } \lfloor \frac{m}{2} \rfloor \text{ is odd}, \\ p \oplus a_{\lfloor \frac{m}{2} \rfloor} & \text{if } \lfloor \frac{m}{2} \rfloor \text{ is even}. \end{cases}$

为简单起见，假设 $m \equiv 1 \pmod{4}$ （如果不是，则继续递增 $m$ 并分别调整其贡献）。

定义 $e = \displaystyle\sum_{\substack{n &lt; i \leq m \ i \text{ even}}} a_i = a_{n + 1} + a_{n + 3} + \ldots + a_{\lfloor \frac{m}{2} \rfloor}$ 。这个和可以表示为

$e = \text{sum}(\lfloor \frac{m}{2} \rfloor)_{\text{even}} - prefix_{\text{even}}(n).$

我们有兴趣计算的数对是（请注意 $n$ 是奇数）：

$ a_{2n} = a_{2n + 1} = p$

$ a_{2n + 2} = a_{2n + 3} = p \oplus a_{n + 1}$

$ a_{2n + 4} = a_{2n + 5} = p$

$ a_{2n + 6} = a_{2n + 7} = p \oplus a_{n + 3}$

$ \vdots$

$ a_{m - 3} = a_{m - 2} = p$

$ a_{m - 1} = a_{m} = p \oplus a_{\lfloor \frac{m}{2} \rfloor}$

请注意，上述偶数和奇数指数之和相等，并且取决于 $p$ ：

$ both = \begin{cases} e & \text{if } p = 0, \\ (\lfloor \frac{m}{2} \rfloor - n + 1) - e & \text{if } p = 1. \end{cases}$

因此，最终的和为

$ \text{sum}(m)_{\text{even}} = prefix_{\text{even}}(2n - 1) + both$

$ \text{sum}(m)_{\text{odd}} = prefix_{\text{odd}}(2n - 1) + both$

因此，我们可以通过将 $m$ 减半直到 $m \le 2n$ 来递归计算 $\text{sum}(m)$ ，每一步都可以利用预先计算出的偶数和奇数前缀和。

总体时间复杂度为： $O(n+\log(m))$ 。

## AC代码

```C++
#include <bits/extc++.h>
#define OOO cout<<">>>>";	//调试标识

using namespace std;
using namespace __gnu_pbds;

mt19937_64 rnd( time( 0 ) );
typedef long long ll;
typedef uint64_t ull;
template <typename T> using vct = vector<T>;
template <typename T> using v2ct = vector<vector<T>>;
template <typename T> using v3ct = vector<vector<vector<T>>>;

template <typename T, typename Compare = std::less<T>>
using oset = tree<T, null_type, Compare, rb_tree_tag, tree_order_statistics_node_update>;

const ll INF = 4e18, Mod = 1e9+7;

ll tt=1;

void solve(){
	ll n,l,r;
	cin>>n>>l>>r;
	vector<ll> v(4*n+8,0),pres(4*n+8,0),pree(4*n+8,0),preo(n*4+8,0);
	for(ll i=1;i<=n;i++)
		cin>>v[i],pres[i]=pres[i-1]^v[i];
	for(ll i=n+1;i<=2*n+1;i++)
		v[i]=pres[i/2],pres[i]=pres[i-1]^v[i];
	n=2*n+1;
	for(ll i=n+1;i<=2*n;i++)
		v[i]=pres[i/2];
	
	ll p=pres[n];
	
	for(ll i=1;i<=2*n;i++){
		pree[i]=pree[i-1];
		preo[i]=preo[i-1];
		if(i%2==1) preo[i]+=v[i];
		else pree[i]+=v[i];
	}
	
	
	function<ll(ll)> sol=[&](ll k){
		if(k<=n) return v[k];
		if(k/2<=n) return pres[k/2];
		if(n&1){
			if(k/2&1)
				return pres[n];
			else
				return pres[n]^sol(k/2);
		}
		else{
			if(k/2&1)
				return sol(n+1)^pres[n];
			else
				return sol(n+1)^pres[n]^sol(k/2);
		}
	};
	
	function<ll(ll)> sume=[&](ll x){
		if(x<=2*n) return pree[x];
		if(x%4==0){
			return sume(x+1);
		}
		else if(x%4==2){
			return sume(x+3)-sol(x+2);
		}
		else if(x%4==3){
			return sume(x+2)-sol(x+1);
		}
		else if(p==0){
			return sume(x/2)-pree[n]+pree[n*2-1];
		}
		else{
			return x/2-n+1-sume(x/2)+pree[n]+pree[n*2-1];
		}
	};
	
	function<ll(ll)> sumo=[&](ll x){
		if(x<=2*n) return preo[x];
		if(x%4==0){
			return sumo(x+1)-sol(x+1);
		}
		else if(x%4==2){
			return sumo(x+3)-sol(x+3)-p;
		}
		else if(x%4==3){
			return sumo(x+2)-sol(x+2);
		}
		else if(p==0){
			return sume(x/2)-pree[n]+preo[n*2-1];
		}
		else{
			return x/2-n+1-sume(x/2)+pree[n]+preo[n*2-1];
		}
	};
	
	
//	OOO
//	cout<<sol(l)<<endl;
	cout<<sume(r)+sumo(r)-sume(l-1)-sumo(l-1)<<endl;
}

int main() {
	ios::sync_with_stdio( 0 );
	cin.tie( 0 );
	cout.tie( 0 );
	
	cin >> tt;	//非多组测试数据时注释掉即可
	while ( tt-- ) {
		solve();
	}
	
	cout.flush();
	return 0;
}
```

