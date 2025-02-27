# Codeforces Round 1006 (Div. 3)

[*传送门*](https://codeforces.com/contest/2072)

## [E. Do You Love Your Hero and His Two-Hit Multi-Target Attacks?](https://codeforces.com/contest/2072/problem/E)

## 游记&题解

最开始的时候以为是阶乘组合数，然后发现不太对，是$ \sum\limits_1^{n-1}{i} $ 的数量

换句话说就是，我们可以用 $n$ 个结点产生 $\frac {n\times (n-1)}{2}$ 组方案

那我们每次就找使得 $\frac {n\times (n-1)}{2}$ 最大并且不超过 $k$ 的 $n$  

每次构造方案之后，剩余需要被构造的点对数量会减少至 $2\sqrt n$ 以下

不难发现一次构造后最多剩余大概 $25^2$ ，二次后就是 $7^2$ ，三次后就是 $15$ ，剩下的补齐即可，一定不会使用超过 $500$ 个节点

还需注意，不同组构造方案之间的节点要避免对答案产生贡献

## AC代码

```c++
void solve(){
	ll k;
	cin>>k;
	
	if(k==0){
		cout<<0<<endl;
		return;
	}
	
	vector<pair<ll,ll>> ans;
	ll q=0;
	while(k){
		q++;
		ll p=sqrt(k*2);
		if(p*(p+1)/2>k) p--;
		for(ll i=0;i<=p;i++)
			ans.emplace_back(-(1e7)*q,(-1e7)*q+i);
		k-=p*(p+1)/2;
	}
	
	cout<<ans.size()<<endl;
	for(auto [x,y]:ans){
		cout<<x<<' '<<y<<endl;
	}
	
}
```

## [F. Goodbye, Banker Life ](https://codeforces.com/contest/2072/problem/F)

## 游记&题解

上手玩一玩，不难发现，只会有 $0$ 和 $k$ 两种数字

如果你曾经关注过分形（谢尔宾斯基三角形）或者帕斯卡三角的奇偶性性质，你应该马上就会发现这是一样的

> #### 为什么是这样？
>
> 其实我们关注异或运算的真值表，就会发现对两个数按位异或之后，和对两个数做**不进位的**加法是完全等价的
>
> 而在二进制中，进位与否不影响奇偶性
>
> 又因为题述构造方法与帕斯卡三角完全一致，所以帕斯卡三角的奇偶性就可以完全映射过来

根据帕斯卡三角的组合数学意义，所以我们需要判断的就是 $\dbinom{i-1}{n-1}$ 的奇偶性

这是有一个定理的：***卢卡斯定理***，这里不展开证明，了解之后即可$O(1)$判断奇偶性

## AC代码

```c++
void solve(){
	ll n,k;
	cin>>n>>k;
	for(ll i=1;i<=n;i++){
		if(__builtin_popcount(n-1)-__builtin_popcount(i-1)-__builtin_popcount(n-i)==0)
			cout<<k<<' ';
		else
			cout<<0<<' ';
	}
	cout<<endl;
}
```

## [G. I've Been Flipping Numbers for 300 Years and Calculated the Sum](https://codeforces.com/contest/2072/problem/G)

## 游记&题解

如果没学过**数论分块**，就去学一下，很简单的！

我们不难注意到：

- 当 $p>n$ 的时候，是只有一位的，反转后还是自己，所以直接求和即可
- 当 $p\le\lfloor\sqrt n\rfloor$ 的时候，只有 $\lfloor\sqrt n\rfloor\le600$ 个数，并且基本上只有三四位，经计算发现开销是完全可以接受的
- 那需要关注的就是  $\lfloor\sqrt n\rfloor\le p \le n$ 这个区间了
  - 我们不难发现在这个区间里，第二位是$\lfloor \frac np \rfloor$，第一位是$n \mod p$，所以我们考虑数论分块方法
  - 对于第二位确定为 $q$ 的区间，我们可以求出其长度 $l$ ，那么交换到第一位上之后的贡献就是 $l\times q$
  - 并且在这个区间里，第一位 $n \mod p$ 和 $p$ 都是等差数列，交换到第二位上的贡献就是两两相乘之后在求和，在这里我们可以用公式化简

假设两个数列首项为 $a_1,b_1$，公差为 $d_1,d_2$ ，项数均为 $m$ ，则有：
$$
\begin{aligned}
\sum_1^n{  a_i\times b_i} &=\sum_1^n{ \left\{ (a_1+(i-1)\times d_1)\times (b_1+(i-1)\times d_2) \right\}} \\

&=\sum_1^n{\left\{a_1 b_1 + (b_1 d_1+a_1 d_2)\times (i-1) +d_1 d_2\times (i-1)^2 \right\}}\\

&=n\times a_1 b_1 + \sum_1^n{(i-1)}\times(b_1 d_1+a_1 d_2)+\sum_1^n{(i-1)^2\times}d_1 d_2
\end{aligned}
$$
利用求和公式可以 $O(1)$  解决

## AC代码

```c++
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
ll pw[601][21];

ll sol1(ll n,ll p){
	ll res=0;
	vector<ll> tmp;
	ll g=0;
	while(n){
		tmp.emplace_back(n%p);
		n/=p;
		g++;
	}
	for(auto it:tmp)
		res=(res+it*pw[p][--g])%Mod;
	return res;
}

void solve(){
	ll n,k,ans=0;
	cin>>n>>k;
	ll q=min(k,(ll)sqrt(n));
	for(ll i=2;i<=q;i++)
		ans=(ans+sol1(n,i))%Mod;
	
	if(k>n)
		ans=(ans+n*((k-n)%Mod))%Mod;
	
	ll yy=min(k,n);
		
	auto qq=[&](ll a1,ll a2,ll b1,ll b2){
		if(a2==a1) return b1*a1;
		ll d=(b2-b1)/(a2-a1),ct=a2-a1+1;
		ll res=0;
		res=(((ct*a1%Mod*b1)%Mod   +(a1*d+b1)%Mod*(ct*(ct-1)/2%Mod)%Mod   +d*(ct*(ct-1)*(2*ct-1)/6%Mod))%Mod+Mod)%Mod;
		return res;
	};
	
	ll l=q+1,r=0;
	while(l<=yy){
		ll p=n/l;
		r=min(yy,n/p);
		ans=(ans+
			p*(r-l+1)+
			qq(l,r,n%l,n%r))
			%Mod;
		l=r+1;
	}
//	OOO
	cout<<ans<<endl;
}

int main() {
	ios::sync_with_stdio( 0 );
	cin.tie( 0 );
	cout.tie( 0 );
	
	for(ll i=1;i<=600;i++) pw[i][0]=1;
	for(ll i=1;i<=600;i++)
		for(ll j=1;j<=20;j++)
			pw[i][j]=pw[i][j-1]*i%Mod;
	
	cin >> tt;	//非多组测试数据时注释掉即可
	
	while ( tt-- ) {
		solve();
	}
	
	cout.flush();
	return 0;
}
```





