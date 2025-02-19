# [Codeforces Round 996 (Div. 2)](https://codeforces.com/contest/2055) 赛后复盘

*可惜啊可惜，赛时D出思路了没时间码了*

## [C. The Trail](https://codeforces.com/contest/2055/problem/C)

### 游记

赛时卡了很久，后来看哥哥视频发现哥哥也坐牢了一阵子，遂释然

首先很容易可以想到，第一个格子确定了之后，后续所有的格子都可以唯一确定

所以最开始的想法就是第一个格子直接取 $0$ 

很快啊，啪的一个提交：

*" Wrong answer on pretest 1 "*

挂样例了？！

回来一看，首先递推的过程没出锅，看看挂了的数据，确实这样推不一定正确，说明第一个格子不能随意取，那就开始找限制条件

不难发现，每一个格子都决定了下一个格子，只有最后一个格子没有，然而在最后一个格子处有两个关系式：行上的和与列上的和

所以可以设 $x$ ，一路上推出格子的表达式，最后用这两个关系式来解出 $x$ 

正确性显然，也很好写，然而......

RE了（丢人）

思考了一阵之后，发现是当最后表达式上化简后 $x$ 的系数为零时，解方程的地方会出现除以零的运算导致炸机，于是加个特判，顺利AC

### 解题思路

赛时出标解，都在游记里了

### AC代码

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

const ll INF = 1e18, Mod = 1e9+7;

ll tt=1;

void solve(){
	ll n,m,st=0;
	cin>>n>>m;
	v2ct<ll> mp(n+1,vector<ll>(m+1,0)),mp2(n+1,vector<ll>(m+1,0));
	string s;
	cin>>s;
	
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			cin>>mp[i][j];
	
	mp2[1][1]=0;
	ll cx=1,cy=1;
	for(ll i=1;i<=n+m-2;i++){
		char ch;
		ch=s[i-1];
		
		if(i==1){
			if(ch=='D')
				for(ll i=1;i<=m;i++)
					st+=mp[1][i];
			else
				for(ll i=1;i<=n;i++)
					st+=mp[i][1];
		}
		
		if(ch=='D'){
			ll cur=0,cur1=0;
			for(ll i=1;i<=m;i++)
				cur+=mp[cx][i],cur1+=mp2[cx][i];
			mp[cx][cy]=st-cur;
			mp2[cx][cy]=1-cur1;
			cx++;
		}
		else{
			ll cur=0,cur1=0;
			for(ll i=1;i<=n;i++)
				cur+=mp[i][cy],cur1+=mp2[i][cy];
			mp[cx][cy]=st-cur;
			mp2[cx][cy]=1-cur1;
			cy++;
		}
	}
	
	ll x1=0,x2=0,k1=0,k2=0;
	for(ll i=1;i<=m;i++)
		k1+=mp[n][i],x1+=mp2[n][i];
	k1=st-k1,x1=1-x1;
	for(ll i=1;i<=n;i++)
		k1+=mp[i][m],x1+=mp2[i][m];
	k2=st-k2,x2=1-x2;
	ll ansx=(x2==x1?0:(k1-k2)/(x2-x1));
	
	k1=0;
	st+=ansx;
	for(ll i=1;i<=m;i++)
		k1+=mp[n][i]+ansx*mp2[n][i];
	mp[n][m]=st-k1;
	
//	OOO
//	cout<<k1<<' '<<k2<<' '<<x1<<' '<<x2<<endl;
//	cout<<mp2[n][m]<<endl;
	
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			cout<<mp[i][j]+ansx*mp2[i][j]<<" \n"[j==m];
	cout.flush();
	
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

## [D. Scarecrow](https://codeforces.com/contest/2055/problem/D)

### 游记

赛时看到这道题还剩 40 min，想了很多种构造手段和可能用于维护状态的数据结构，未果

最后 20 min 时，开始考虑二分的解法，开始想怎样进行 check

最后 12 min 二分的解法想出来了

抱着对自己码力十足的信心，深知自己写不完了，于是开始和其他人交流

交流的过程中，突然发现自己的 check 与二分的量没有任何关系

换句话说：直接遍历贪心就能出答案了

此时 距离比赛结束还有 8min ，煮波看开了，打开了 PUBG

### 解题思路

首先考虑最优解的一些性质：

- 一定不会强制要求改变稻草人之间的相对顺序，也就是不会要求两个稻草人“相向穿过”，因为一切的这种操作都可以与两个稻草人在相遇的一瞬间同时掉头等价
- 既然不会改变相对顺序，那么乌鸦一定是按顺序地一一“交接”给后面的稻草人的
- 显然地，乌鸦不会从后往前传递，因为这样明显更劣
- 对于第一个稻草人，其“最早接到乌鸦”的时间就是它赶到 0 处的时间，它也必须这样做否则乌鸦无法出发

既然这样，就很容易想到最优解是怎样生成的了：

- 我们将维护两个信息：
  - $tick$ 表示当前稻草人最早“接到”乌鸦的时间，易知 $tick$ 严格非降
  - $po$ 表示当前稻草人接到乌鸦时乌鸦的位置，易知 $po$ 严格非降
- 第一个稻草人的 $tick$ 和 $po$ 很容易求，问题在于如何维护后续的信息
- 我们将按照以下规则对 $tick$ 和 $po$ 进行维护：
  - 如果当前的稻草人在 $po$ 之前，并且在 $tick$ 时刻到不了乌鸦后 $k$ 单位处，那么显然说明这个稻草人对当前及之后的局面不可能有贡献
  - 如果他在 $po$ 之前 ，并且能在 $tick$ 时刻到达乌鸦前 $k$ 单位但是无法超过乌鸦，那它就能在 $tick$ 时刻接到乌鸦，并且 $po$ 将更新为此时稻草人的位置再加上 $k$
  - 如果当前稻草人在 $po$ 之后，并且能在 $tick$ 时刻前赶到 $po$ 处，那么他就能在 $tick$ 时刻直接在 $po$ 处接到乌鸦 ，即 $tick$ 不变，$po$ 将再加上 $k$
  - 最后，如果当前稻草人在 $po$ 之后，并且不能在 $tick$ 时刻前赶到 $po$ 处，那么此时最快的策略就是两个稻草人 双向奔赴 ，按照简单的小学数学：相遇问题来计算并更新信息
- 知道了怎么维护信息，就来看怎么生成答案，每次可以通过当前的 $tick$ 和 $po$ 计算当前答案，由于乌鸦不能回头，所以当 $po$ 超过目标时就可以停止维护，检查这次的 $po$ 如果距离目标不超过 $k$ ，就可以在当前的 $tick$ 时刻直接到达，最后取一次最小值，退出遍历
- 答案贴心地要求的是两倍时间，这是因为相遇会带来半个单位（可以思考一下为什么不会出现 1/4 个单位），解决方法也很简单：把数据全部放大至两倍即可

### AC代码

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

const ll INF = 1e18, Mod = 1e9+7;

ll tt=1;

void solve(){
	ll n,k,need;
	cin>>n>>k>>need;
	k*=2;
	need*=2;
	vector<ll> pos(n+1);
	for(ll i=1;i<=n;i++)
		cin>>pos[i],pos[i]*=2;
	ll tick=pos[1],po=k;
	ll ans=need-po+tick;
	for(ll i=2;i<=n;i++){
		if(pos[i]+tick<=po-k) continue;
		else if(pos[i]+tick<=po) po=pos[i]+tick+k;
		else if(pos[i]-tick<=po) po+=k;
		else {
			ll tmp=(pos[i]-tick-po)/2;
			tick+=tmp;
			po+=tmp+k;
		}
		if(po>=need){
			if(po-k<=need) ans=min(ans,tick);
			break;
		}
		ans=need-po+tick;	
	}
	cout<<ans<<endl;
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
