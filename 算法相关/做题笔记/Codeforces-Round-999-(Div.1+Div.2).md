# Codeforces Round 999 赛后复盘

## [C. Kevin and Puzzle](https://codeforces.com/contest/2061/problem/C)

### 游记

刚刚开出来的时候没认出来是dp，当成组合数学来想了

后面发现不太能做，因为限制太多了，限制多意味着什么？

- 转移的方法就少了啊！
- 那就可以考虑 DP

很简单，我们

- 设 $dp1[i]$ 表示到第 $i$ 人为止且这个人是骗子的组合数 
- 设 $dp0[i]$ 表示到第 $i$ 人为止且这个人是老实人的组合数

转化的时候，考虑当前人是骗子/老实人的要求，检查 $v[i]$ ，具体看代码

### AC代码

```c++
void solve(){
	ll n;
	cin>>n;
	vector<ll> v(n+1);
	for(ll i=1;i<=n;i++) cin>>v[i];
	vector<ll> dp0(n+1),dp1(n+1);	//T F
	if(v[1]==0) dp0[1]=1;
	dp1[1]=1;
	
	for(ll i=2;i<=n;i++){
		if(i==2){
			if(v[2]==1) dp0[2]+=dp1[1];
			if(v[2]==0&&v[1]==0) dp0[2]+=1;
			dp1[2]+=dp0[1];
		}
		else{
			dp1[i]=dp0[i-1];
			
			if(v[i]-v[i-2]==1) dp0[i]+=dp1[i-1];
			if(v[i]-v[i-1]==0) dp0[i]+=dp0[i-1];
		}
		dp0[i]%=Mod;
		dp1[i]%=Mod;
	}
	cout<<(dp1[n]+dp0[n])%Mod<<endl;
}
```

##  [D. Kevin and Numbers](https://codeforces.com/contest/2061/problem/D)

*感觉比 C 简单多了*

不难发现按照这样结合的要求，对某一个数逆着去分解也是唯一的

所以我们考虑逆过来做，即考虑能不能从B分解出A

一个很容易想到的策略就是，把B中在A内的数一一匹配，剩下的数分解后继续匹配直到全部小于A，此时一定无解

这样想有一个问题，如果B里只有一个数，他又很大（如样例最后一组），就会一直分解而匹配不了，这个时候特判即可

### AC代码

```c++
#include <bits/extc++.h>
#define OOO cout<<">>>>";	//调试标识
#define CY cout<<"YES"<<endl;	//输出宏
#define CN cout<<"NO"<<endl;	//输出宏

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
	ll n,m;
	cin>>n>>m;
	vector<ll> a(n+1),b(n+1);
	multiset<ll,greater<ll>> aa,bb;
	ll suma=0,sumb=0;
	for(ll i=1;i<=n;i++) cin>>a[i],aa.insert(a[i]),suma+=a[i];
	for(ll i=1;i<=m;i++) cin>>b[i],bb.insert(b[i]),sumb+=b[i];
	
	if(suma!=sumb){
		CN
		return;
	}
	
	while(aa.size()&&bb.size()){
		ll fb=*bb.begin(),fa=*aa.begin();
		if(fb==fa){
			bb.erase(bb.begin());
			aa.erase(aa.begin());
		}
		else if(fb>fa){
			bb.erase(bb.begin());
			bb.insert(fb/2);
			bb.insert((fb+1)/2);
		}
		else
			break;
	}
	if(aa.size()||bb.size()) CN
	else CY
	
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

## [E. Kevin and And](https://codeforces.com/contest/2061/problem/E)

*赛时只记得火箭毛毛虫了*

注意到 $m$ 的值是很小的，以至于 $2^m$ 仅有 $1e3$ 的数量级，疑似 $n\cdot 2^m$ 的操作量也不是不能接受

于是我们就可以预处理出 $dif[i][j]$ 表示对于第 $i$ 个数据，进行 $j$ 次操作后，对总和减少的最大贡献

再将其转化为自身的差分数组，容易发现：

- 差分数组一定是非增的，因为：
  - 每一个差分数组相当于相比于前一个方案多消掉了 $a[i]$ 的若干位，同时可能少消了若干位
  - 至少多消去一位，且多消去的那些位与少消去的位互斥，且这些位的最高位 $pos$ 一定是多消去的（否则不会减小）
  - 然后明确，如果存在高于 $pos$ 的位上为 $1$ ，那么这个位一定是无法消去的，否则一定会优先消去这一位而非 $pos$
  - 所以每次一定会消去不同且递减的 $pos$ ，使得差分数组的位数递减，进而非增

所以，从大到小选取贡献一定不会出现“越级”的非法操作

那就把所有差分数组的值丢到一个 `set` 里取最大的 $k$ 个就好了

### AC代码

```c++
#include <bits/extc++.h>
#define OOO cout<<">>>>";	//调试标识
#define CY cout<<"YES"<<endl;	//输出宏
#define CN cout<<"NO"<<endl;	//输出宏

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
	ll n,m,k,ans=0,sum=0;
	cin>>n>>m>>k;
	vector<ll> a(n+1),b(m+1);
	v2ct<ll> dif(n+1,vector<ll>(m+1,0));
	
	for(ll i=1;i<=n;i++) cin>>a[i],sum+=a[i];
	for(ll i=1;i<=m;i++) cin>>b[i];
	
	multiset<ll,greater<ll>> s;
	
	for(ll i=1;i<(1<<m);i++){
		ll tmp=(1<<30)-1,cnt=__builtin_popcount(i);
		
		for(ll j=0;j<m;j++)
			if((i>>j)&1)
				tmp&=b[j+1];
		
		for(ll j=1;j<=n;j++)
			dif[j][cnt]=max(dif[j][cnt],a[j]-(a[j]&tmp));
	}
	
//	for(ll i=1;i<=n;i++)
//		dif[i][0]=a[i];
	
	for(ll i=1;i<=n;i++)
		for(ll j=1;j<=m;j++)
			s.insert(dif[i][j]-dif[i][j-1]);
	
	while(k--){
		sum-=*s.begin();
		s.erase(s.begin());
	}
	
//	OOO
	cout<<sum<<endl;
	
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