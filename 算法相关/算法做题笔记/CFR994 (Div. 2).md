# [Codeforces Round 994 (Div. 2)](https://codeforces.com/contest/2049) 赛后复盘

*形式一片大好，还要越来越好*

## D. Shift + Esc

[传送门](https://codeforces.com/contest/2049/problem/D)

### 题意

$n×m$ 的矩阵，你可以花费 $k$ 的代价将任意一行整体循环左移一位（可多次操作），然后从 $(1,1)$ 开始以最短路径移动到 $(n,m)$，代价为经过的数的和。求最小代价。$n,m\le200$。

### 游记

赛时卡了很久，先是按照传统 DP 的思路去思考了，最朴素的 DP 的时间复杂度显然是 $\Theta(n\cdot m^3)$ ，但是看到数据范围这样做显然会超时，于是开始考虑优化

想了很久......

发现对于一行内，一次相同的移动距离的更新，我们选择不同段进行更新的代价是这一段的区间和加上若干个 $k$ 

亦即：假设一行有 $7$ 格，更新某一行从第 $3$ 格到第 $5$ 格的答案，那么备选方案就是（设 $a_{i,j}$ 为这一行第 $i$ 至第 $j$ 格的代价之和，可能会越界至行头）：

- $a_{3,5}$ ，$a_{4,6}+k$ ，$a_{5,7}+2k$ ，$a_{6,1}+3k$ ，$a_{7,2}+4k$ ，$a_{1,3}+5k$ ，$a_{2,4}+6k$ 
- 而每次我们更换我们要更新的位置（不改变段的长度）时，会将当前位置的段变为 $+(m-1)\cdot k$ 代价，而将其他所有的段的代价 $ -k$ 

进而就能想到，在这个过程中大部分的相对大小是不变的，会改变相对大小的只有“将当前位置的段变为 $+(m-1)\cdot k$ 代价”这一操作

所以我们的策略就是把这一步用两个`set`来维护相对最小的一项，而 $ -x\cdot k$ 的操作就在`set`外进行。

时间复杂度优化为 $\Theta(n\cdot m^2\cdot \log m)$ ，实测能过。

### AC代码

```c++
#include <bits/extc++.h>
#define OOO cout<<">>>>";	//调试标识

using namespace std;
using namespace __gnu_pbds;

mt19937_64 rnd( time( 0 ) );
typedef long long ll;
typedef uint64_t ull;
template <typename T, typename Compare = std::less<T>>
using oset = tree<T, null_type, Compare, rb_tree_tag, tree_order_statistics_node_update>;

const ll INF = 1e18, Mod = 1e9+7;

ll tt=1;

void solve(){
	ll n,m,k;
	cin>>n>>m>>k;
	vector<vector<ll>> mp(n+1,vector<ll>(m+1)),dp(n+1,vector<ll>(m+1,INF)),pre(n+1,vector<ll>(m+1));
	
	vector<vector<vector<ll>>> tl(n+1,vector<vector<ll>>(m+1,vector<ll>(m+1,INF)));
	
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			cin>>mp[i][j];

	dp[0][1]=0;
	
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			pre[i][j]=pre[i][j-1]+mp[i][j];
	
	for(ll i=1;i<=n;i++){
		for(ll len=1;len<=m;len++){
			
			multiset<ll> s1,s2;
			vector<ll> w(m+1);
			for(ll j=1;j<=m;j++){
				if(j+len-1<=m) w[j]=pre[i][j+len-1]-pre[i][j-1];
				else w[j]=pre[i][m]-pre[i][j-1]+pre[i][j+len-1-m];
			}
			
			for(ll j=1;j<=m;j++)
				s1.insert(w[j]+(j-1)*k);
			
			for(ll l=1;l+len-1<=m;l++){
				tl[i][l][l+len-1]=min((s1.size()?(*s1.begin()):INF)-(l-1)*k,(s2.size()?(*s2.begin()):INF)-l*k);
				s1.erase(s1.find(w[l]+(l-1)*k));
				s2.insert(w[l]+(m+l)*k);
//				cout<<"!!! "<<i<<' '<<l<<' '<<' '<<l+len-1<<" : "<<tl[i][l][l+len-1]<<endl;
			}
		}
	}
	
	for(ll i=1;i<=n;i++)
		for(ll l=1;l<=m;l++)
			for(ll r=l;r<=m;r++)
				dp[i][r]=min(dp[i][r],dp[i-1][l]+tl[i][l][r]);
//	OOO
	cout<<dp[n][m]<<endl;
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

