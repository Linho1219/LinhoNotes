# [Codeforces Round 1013 (Div. 3)](https://codeforces.com/contest/2091)

## F. [Igor and Mountain](https://codeforces.com/contest/2091/problem/F)

### 思路

很简单，考虑动态规划，注意到每次最多跨越一层且 $d$ 是正整数，所以相当于可以从前一层的 $[x-d+1,x+d-1]$ 的范围内，转移过来，所以本质上是一个区间求和，那就可以通过对前一行做一个前缀和之后 $O(1)$ 处理

再考虑“一行内最多使用两个节点”的条件，其实不难发现就是可以在一行内磨蹭一次，这个磨蹭的范围是 $[x-d,x+d]$ ，又看样例发现不能从自己再到自己，所以还是一个区间求和，再用一次前缀和就好，实现的时候注意边界，具体实现看代码吧

### AC代码

```c++
#include <bits/extc++.h>
#define OOO cout<<">>>>";cout.flush();	//调试标识
#define H_test(x) println("---> {} <---",x);	//调试输出

using namespace std;
using namespace __gnu_pbds;

typedef long long ll;
typedef uint64_t ull;
using pll = pair<ll,ll>;
template <typename T> using v2ct = vector<vector<T>>;
template <typename T> using v3ct = vector<vector<vector<T>>>;

template <typename T, typename Compare = std::less<T>>
using oset = tree<T, null_type, Compare, rb_tree_tag, tree_order_statistics_node_update>;

const ll INF = 4e18, Mod = 998244353;
mt19937_64 rnd( (uintptr_t)(char*)(&INF)+time(0) );

ll tt=1;

void solve(){
	ll n,m,d,ans=0;
	cin>>n>>m>>d;
	v2ct<ll> v(n+1,vector<ll>(m+1,0)),dp(n+1,vector<ll>(m+1,0)),pdp(n+1,vector<ll>(m+1,0));
	for(ll i=1;i<=n;i++){
		string s;
		cin>>s;
		for(ll j=1;j<=m;j++)
			v[i][j]=(s[j-1]=='X'?1:0);
	}
	
	for(ll i=1;i<=m;i++){
		if(v[1][i]==1)
			dp[1][i]=1;
		pdp[1][i]=pdp[1][i-1]+dp[1][i];
	}
	
	for(ll i=1;i<=m;i++)if(v[1][i])
		dp[1][i]=pdp[1][min(i+d,m)]-pdp[1][max(0ll,i-d-1)];
	
	
	for(ll k=2;k<=n;k++){
		for(ll i=1;i<=m;i++)
			pdp[k-1][i]=pdp[k-1][i-1]+dp[k-1][i];
		
		for(ll i=1;i<=m;i++)if(v[k][i])
			dp[k][i]=(pdp[k-1][min(i+d-1,m)]-pdp[k-1][max(0ll,i-d)]+Mod)%Mod;
		
		for(ll i=1;i<=m;i++)
			pdp[k][i]=pdp[k][i-1]+dp[k][i];
		
		for(ll i=1;i<=m;i++)if(v[k][i])
			dp[k][i]=(pdp[k][min(i+d,m)]-pdp[k][max(0ll,i-d-1)]+Mod)%Mod;
	}
	
	for(ll i=1;i<=m;i++)if(v[n][i])ans+=dp[n][i];
	
//	OOO
	cout<<ans%Mod<<endl;
	
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

## G. [Gleb and Boating](https://codeforces.com/contest/2091/problem/G)

### 思路

做法很简单，就是硬模拟就好了，看这一轮哪些地方可以达到，如果到得了终点就输出，难的是怎么证明时间复杂度是正确的

根据简单的数论推导（方法太多）可知当 $s\ge k^2$ 的时候，一定有 $k-2$ 是可行的

那只考虑 $s\le k^2$ 的情况，此时有：

- 前进 $k$ 对于模 $k-2$ 的影响是 $+2$ ，而后退 $k-1$ 的影响是 $-1$
- 设 $n_1=\lfloor \frac sk \rfloor$ ，于是我们可以通过前进 $n'\times k$ 再后退 $n'\times(k-1)$ 来达到所有 $[1,n_1]$ 的位置
- 接下来一轮，因为有 $n_2=\lfloor \frac {s-n_1}{k-2} \rfloor\ge \lfloor \frac sk \rfloor =n_1$ ，所以就可以达到所有 $[2,2n_1]$ 的位置，以此类推，$\lceil \frac k{n_1} \rceil$ 轮之后就可以达到长度大于 $(n_1-1)\times\lceil \frac k{n_1} \rceil \ge k-2\times \lceil \frac k{n_1} \rceil$  的连续区间，就必有一个数与 $s$ 关于 $k-2\times \lceil \frac k{n_1} \rceil$ 同余，也就是必有解
- 于是一个问题的开销量就是 $\lceil \frac k{n_1} \rceil \times 2s=\lceil \frac {k^2}s \rceil \times 2s \approx 2k^2$ 
- 这个时间复杂度绰绰有余

## AC代码

```c++
#include <bits/extc++.h>
#define OOO cout<<">>>>";cout.flush();	//调试标识
#define H_test(x) println("---> {} <---",x);	//调试输出

using namespace std;
using namespace __gnu_pbds;

typedef long long ll;
typedef uint64_t ull;
using pll = pair<ll,ll>;
template <typename T> using v2ct = vector<vector<T>>;
template <typename T> using v3ct = vector<vector<vector<T>>>;

template <typename T, typename Compare = std::less<T>>
using oset = tree<T, null_type, Compare, rb_tree_tag, tree_order_statistics_node_update>;

const ll INF = 4e18, Mod = 1e9+7;
mt19937_64 rnd( (uintptr_t)(char*)(&INF)+time(0) );

ll tt=1;

void solve(){
	ll s,k;
	cin>>s>>k;
	
//	OOO
	if(s%k==0){
		cout<<k<<endl;
		return;
	}
	else if(s>k*k){
		cout<<max(1ll,k-2)<<endl;
		return;
	}
	vector<ll> v(s+1,0);
	v[0]=1;
	for(ll i=k;i>=1;i--){
		if(k-i&1){
			for(ll j=0;j<=s;j++)
				v[j]=j+i<=s&&v[j+i];
			for(ll j=s-i;j>=0;j--)
				v[j]|=v[j+i];
		}
		else{
			for(ll j=s;j>=0;j--)
				v[j]=j-i>=0&&v[j-i];
			for(ll j=i;j<=s;j++)
				v[j]|=v[j-i];
		}
		if(v[s]){
			cout<<i<<endl;
			return;
		}
	}
	cout<<1<<endl;
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

##   