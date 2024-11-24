# CodeTON Round 9 赛后复盘

[传送门](https://codeforces.com/contest/2039)

## C2. Shohag Loves XOR (Hard Version)

*在赛时因为一处判断漏了相等的情况多调了20min，蠢死我得了......*

### 思路

我们可以选取从 $1$ 到 $2^{\lceil\log_2n\rceil}$ 的区间，统计出其中与 $x$ 异或后能被自身整除并且不能被 $x$ 整除的数的数量，作为答案的一部分

因为我们知道当 $k \cdot 2^{ \lceil \log_2n\rceil}<i \le (k+1)\cdot2^{\lceil\log_2n\rceil}$ 时，有 $k \cdot 2^{ \lceil \log_2n\rceil} < i\oplus x\le(k+1)\cdot2^{\lceil\log_2n\rceil}$ ，所以此时必有 $i$ 不能整除 $i\oplus x$ ，也就是除此之外不用再考虑与 $x$ 异或后能被自身整除的数的贡献

再考虑能被 $x$ 整除的部分，我们可以选取从 $1$ 到 $2^{\lceil\log_2n\rceil}$ 的区间，统计出其中与 $x$ 异或后对 $x$ 取模为 $m$ 的数的数量，那么这就是一个循环，当 $k \cdot 2^{ \lceil \log_2n\rceil}<i \le (k+1)\cdot2^{\lceil\log_2n\rceil}$ 时，考虑 $k \cdot 2^{ \lceil \log_2n\rceil}$ 对 $x$ 的余数，选取对应的符合要求的数的数量作为答案

但是这还有一个问题，循环的次数太多了，这时我们不难发现 $k$ 本身也存在周期为 $x$ 的循环，所以我们对过大的部分再进行分块

最后的代码逻辑就是：

- 先处理区间贡献
- 然后统计出 $k$ 循环贡献
- 计算原数列中 $k$ 循环贡献，此时剩余数列中不满一个 $k$ 循环
- 计算原数列中每个剩余 $k \cdot 2^{ \lceil \log_2n\rceil}<i \le (k+1)\cdot2^{\lceil\log_2n\rceil}$ 区间的贡献，此时剩余不满 $2^{\lceil\log_2n\rceil}$ 项
- 剩下的单独处理统计

### AC代码

```c++
#include<iostream>
#include<map>
#include<set>
#include<ctime>
#include<cmath>
#include<queue>
#include<vector>
#include<random>
#include<string>
#include<algorithm>
#define OOO cout<<">>>>";	//调试标识

using namespace std;

mt19937_64 rnd( time( 0 ) );

typedef long long ll;
typedef uint64_t ull;


const ll INF = 1e18,
Mod = 1e9+7;

ll tt;

int main() {
	ios::sync_with_stdio( 0 );
	cin.tie( 0 );
	cout.tie( 0 );
	
	cin >> tt;
	
	while ( tt-- ) {
		ll x,m,ans=0,ans1=0,ans2=0;
		cin>>x>>m;
		
		ll k=log2(x)+1;
		ll p=1ll<<k;
		
		vector<ll> cnt(p+1);
		
		for(ll i=1;i<=min(m,p);i++){
			if((x^i)%i==0&&(x^i)%x!=0) ans1++;
			cnt[(x^i)%x]++;
		}
		
		for(ll i=1;i*p<=m&&i<=x;i++)
			ans2+=cnt[(x-((i-1)*p)%x)%x];
		
		if(m>=x*p)
			ans+=(m/(x*p))*ans2;
		
		for(ll i=x*(m/(x*p))+1;i*p<=m;i++)
			ans+=cnt[(x-((i-1)*p)%x)%x];
		
		for(ll i=p*(m/p)+1;i<=m;i++)
			if((i^x)%x==0) ans++;
		
		cout<<ans+ans1<<endl;
	}
	
	cout.flush();
	
	return 0;
}
```

## D. Shohag Loves GCD

### 游记

*赛后复盘发现自己虽然对于条件的转化正确了，但是在求解的时候没有保证最优，然而实际上的思路还是很暴力的，感觉就是自己做题少了，懒死我得了......*

### 思路

在赛时的时候，想到了条件的等价：

- 对于 $1\le i\le n$ ，有 $a_i \ne \gcd(a_i,a_{k\cdot i})$

那由于我们要求的是字典序最大，所以对于 $a_i$ 和 $a_{k\cdot i}$ 必有  $a_i \ge a_{k\cdot i}$ ，则条件进一步被简化为

- 对于 $1\le i\le n$ ，有 $a_i \ne a_{k\cdot i}$

那做法其实就很明确了，对于每一个位置，我们处理出它不能取的值，然后为其赋值，如果对于某一位找不到合法的值，则说明数列不存在

### AC代码

```c++
#include<iostream>
#include<map>
#include<set>
#include<ctime>
#include<cmath>
#include<queue>
#include<vector>
#include<random>
#include<string>
#include<algorithm>
#define OOO cout<<">>>>";	//调试标识

using namespace std;

mt19937_64 rnd( time( 0 ) );

typedef long long ll;
typedef uint64_t ull;


const ll INF = 1e18,
Mod = 1e9+7;

ll tt;

int main() {
	ios::sync_with_stdio( 0 );
	cin.tie( 0 );
	cout.tie( 0 );
	
	cin >> tt;

	while ( tt-- ) {
		ll n,m;
		cin>>n>>m;
		vector<ll> v(m+1),ans(n+10);
		
		set<ll,greater<ll>> s;
		
		for(ll i=m;i>=1;i--)
			cin>>v[i],s.insert(v[i]);
		
		
		ans[1]=*s.begin();
		s.erase(s.begin());
		
		if(n>1&&s.empty()){
			cout<<-1<<endl;
			continue;
		}
		
		set<ll> k[n+1];
		
		for(ll i=1;i<=n;i++){
			for(ll j=1;j<=m&&(!ans[i]);j++)
				if(k[i].find(v[j])==k[i].end())
					ans[i]=v[j];
			for(ll j=2;i*j<=n;j++)
				k[i*j].insert(ans[i]);
			if(!ans[i]) break;
		}
		if(ans[n])
			for(ll i=1;i<=n;i++)
				cout<<ans[i]<<' ';
		else cout<<-1;
		cout<<endl;
	}
	
	cout.flush();
	
	return 0;
}
```

### 总结

- 要多做题，熟悉条件的转化和正确性的证明，漏掉其中任何一个都会让题目变得难做，或者让代码挂掉