# [Codeforces Global Round 28](https://codeforces.com/contest/2048) 赛后复盘

*喜欢一边打游戏一边打**contest**是吧，这下长记性了？*

## [D. Kevin and Competition Memories](https://codeforces.com/contest/2048/problem/D)

*一道应该不是很难想的建模题，但就是没整出来*

### 游记

赛时看到这道题的题面：略低于 $1e5$ 的数据范围，向下取整，对于连续的一系列值求和......要素拉满，给人这就是一道数论分块的题的直觉（确实用数论分块能做），但是赛后发现数论分块的做法其实不够优秀，而且构造起来不甚美观。而这其实就是一道简单的结论+排序累加求和......

### 题解

首先注意到，可以忽略那些 $rating$ 比自己低的选手，因为他们从不会对排名做出贡献

然后就能想到，在一场比赛当中，每个人做了多少题并不是必求的，我们只需要知道有多少个人比自己做的题多

于是就会有以下思考过程：

- 对于自己会的题，其他的人一定都会，拉不开差距，所以不用考虑
- 对于很难的题，会的人很少，甚至都没人会，所以也不是考虑的关键
- 接下来可以发现，越简单的题目会的人肯定越多，并且一定包含了能做难题的那些选手，进一步验证了上一步的想法
- 所以对于自己不会的题，具有一个类似于“可重复贡献”的性质
- 而其中贡献最多的，也是可以代表总贡献的，就是难度最低的那道题，他的贡献方法如下：
  - 如果全部选手中有 $x$ 位选手会做这道题，那么我们的排名就为 $x+1$ 
  - 因为此时有且仅有这 $x$ 位选手比我们做得题目多
- 此时又有：
  - 对于每一道题， $x$ 的值不变并且可以被提前求出
  - $x$ 的值随题目难度的提升严格非增，且我们最终关注的是 $x$ 
  - 即：我们可以将“考虑做不出来的难度最低的题”转化为“做不出来的 $x$ 最大的题”
- 所以我们需要做的就是在分配题目的时候，考虑每一组题目的 $x$ 最大的题，使得这些 $x$ 的总和最小
- 这样一来问题就好办多了，预处理出 $x$ 然后对其升序排序，对于每一个要求 $k$ 道题一组的比赛，我们只要求出 $  \large\sum\limits^{\lfloor { \frac{n}{k} }\rfloor}_{i=1} x_{i\cdot k}$ 即可。

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
	ll n,m,st,ln=0;
	cin>>n>>m;
	vector<ll> a(n+1),b(m+1),x(m+1);
	for(ll i=1;i<=n;i++)
		cin>>a[i];
	for(ll i=1;i<=m;i++)
		cin>>b[i];
	st=a[1];
	
	sort(a.begin()+1,a.end(),greater<ll>());
	sort(b.begin()+1,b.end(),greater<ll>());
	
	ll cur=0;
//	OOO
	for(ll i=1;i<=m;i++){
		while(cur<n&&a[cur+1]>=b[i]) cur++;
		x[i]=cur+1;
		if(b[i]<=st) x[i]=1;
//		cout<<x[i]<<" \n"[i==m];
	}
	sort(x.begin()+1,x.end());
//	OOO
	for(ll i=1;i<=m;i++){
		ll ans=0;
		for(ll j=i;j<=m;j+=i){
			ans+=x[j];
		}
		cout<<ans<<" \n"[i==m];
	}
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

## [E. Kevin and Bipartite Graph](https://codeforces.com/contest/2048/problem/E)

*神必题目了也是*

*这么简单没做出来，我也是神必*

### 游记

赛时看了一眼去打游戏了，what can I say？

### 题解

其实结论不难发现，只要用心去想想就能得到（真的，赛后来认真看的时候5min就想出来了）

- 图总共有 $2nm$ 条边，而每种颜色构成一个森林，因此对于一种颜色最多存在 $2n+m−1 $ 条边，那么总边数一定不超过 $(2n+m−1)$。于是得到条件：$(2n+m−1)n≥2nm$，化简得 $m≤2n−1$。
- 接下来我们只需构造出 $m=2n−1$ 的情况即可解决本题。
- 对于一种颜色，构造方法如下：
  - 第一个右节点，选择两个左节点连边
  - 随后每个右节点，都选择一个已经连了一条边的左节点与一个没连过边的左节点连边
- 由我们的数量限制可知，以这种形式可以完成单色的构造，并且此结构下多色之间不互相干扰，故充要性得证
