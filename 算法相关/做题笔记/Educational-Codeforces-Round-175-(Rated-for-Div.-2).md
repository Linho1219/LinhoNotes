# Educational Codeforces Round 175 (Rated for Div. 2)

## [Problem - C - Codeforces](https://codeforces.com/contest/2070/problem/C)

## 游记&题解

因为判断的是最大的惩罚值，所以考虑二分答案

每次二分答案可以知道哪些块是这次 check 中 “可以涂错的”

然后我们统计剩下的色块能不能在 $k$ 次操作内全部填涂正确，进而更新答案

## AC代码

*PS：这份是赛时代码，修改的比较乱，这题实现难度不大，尽量自己调吧*

```c++
void solve(){
	ll n,k;
	cin>>n>>k;
	vector<ll> tar(n+1),pn(n+1);
	string s;
	cin>>s;
	for(ll i=1;i<=n;i++)
		tar[i]=(s[i-1]=='B');
	
	for(ll i=1;i<=n;i++)
		cin>>pn[i];
	
	if(k==0){
		ll mxx=0;
		for(ll i=1;i<=n;i++){
//			cout<<tar[i]<<endl;
			if(tar[i]==1)
				mxx=max(mxx,pn[i]);
		}
		cout<<mxx<<endl;
		return;
	}
	
	vector<pair<ll,ll>> ans;
	ll B=0,cnt=0;
	for(ll i=1;i<=n;i++){
		ll tmp=i,mx=pn[i];
		if(tar[i]==1) B++;
		while(tmp<n&&tar[tmp+1]==tar[i]) tmp++,mx=max(mx,pn[tmp]);
		
//		cout<<mx<<endl;
		i=tmp;
		if((cnt==0&&tar[i]==0)||(tmp==n&&tar[i]==0)) continue;
		ans.emplace_back(mx,++cnt);
	}
	
//	OOO
	if(B<=k){
		cout<<0<<endl;
	}
	else{
		ll l=1,r=1e9;
		while(l<r){
			ll mid=(l+r-1)/2;
			ll flag=0;
			ll ct=0;
			vector<ll> vis(cnt+1,0);
			for(ll i=1;i<=cnt;i++){
				if(vis[i-1]==0&&ans[i-1].first<=mid) ct++,vis[i]=1;
			}
//			cout<<"!!!"<<cnt<<endl;
			if(ct>=B-k) flag=1;
			
			if(flag) r=mid;
			else l=mid+1;
		}
		cout<<l<<endl;
	}
}
```

## [Problem - D - Codeforces](https://codeforces.com/contest/2070/problem/D)

*显然比 C 简单多了*

## 游记&题解

思路很好想，以一个点为终点的合法方案数就是以其深度 $-1$ 的所有点为终点的方案数总和减去以其父亲为终点的方案数

计数有一个要求，就是在此之前要把比他深度小的所有点都统计出来，这点可以靠 BFS 实现

最后的总方案数就是以所有点为终点的方案数之和

## AC代码

```c++
void solve(){
	ll n;
	cin>>n;
	vector<ll> eg[n+1],fa(n+1);
	for(ll i=2;i<=n;i++){
		ll x;
		cin>>x;
		fa[i]=x;
		eg[x].emplace_back(i);
		eg[i].emplace_back(x);
	}
	vector<ll> dep(n+1),cnt(n+1),vis(n+1);
	dep[1]=1;
	queue<ll> que;
	map<ll,ll> mp;
	que.push(1);
	while(que.size()){
		ll u=que.front();
		que.pop();
		vis[u]=1;
		if(u==1||fa[u]==1){
			cnt[u]=1;
			mp[dep[u]]++;
		}
		else{
			cnt[u]=((mp[dep[u]-1]-cnt[fa[u]])%Mod+Mod)%Mod;
			mp[dep[u]]=(mp[dep[u]]+cnt[u])%Mod;
		}
		for(auto v:eg[u]){
			if(vis[v]) continue;
			dep[v]=dep[u]+1;
			que.push(v);
		}
	}
	
	ll ans=0;
	for(ll i=1;i<=n;i++)
		ans=(ans+cnt[i])%Mod;
//	OOO
	cout<<ans<<endl;
	
}
```

## [Problem - E - Codeforces](https://codeforces.com/contest/2070/problem/E)

## 题解

很好玩的一道题

下称第一个玩家为 A ，第二个玩家为 B

首先不难发现，A 只能拿 00 ，而 B 能拿 01/10/11 

手玩几把还可以意识到，只要场面上有 1 并且剩余字符大于一个，B就一定有方案拿

进而可以意识到 B 要尽量保证场上有剩余的 1 

又因为 A 无法影响场上 1 的数量，并且只要场上有 0 有 1 ，B就一定可以取走 10/01

所以对于 B 来说，最优操作就是取 10/01

而对 A 来说只能取 00 

所以只要场上 1 和 0 数量都足够用，那么每一轮一定是取走三个 0 一个 1

然后考察剩下的局面，不难发现此时：

- 如果没有 1 ，那么剩下 0 的个数多于 1 的时候 A必胜，其余时刻必败
- 如果有一个 1 ，那么剩下 0 的个数为 2 的时候 A 必胜，其余时刻必败
- 如果有多于一个 1 ，那么 A 必败

于是我们就知道了怎么判断一个局面是否必胜



接下来考虑怎么统计答案

一个很自然的思路是将 0 对应的项赋值为 $1$ ，1 对应的项赋值为 $-3$ ，于是胜局就是区间之和为 $-1$ 或大于等于 $2$ 的方案数

考虑用前缀和转化区间和，于是就是统计下标在此之后的，满足区间条件的位置的个数

而这个可以从树状数组，线段树，平衡树等数据结构中任选一个来维护

## AC代码

```c++
void solve(){
	ll n,ans=0;
	cin>>n;
	string s;
	cin>>s;
	vector<ll> v(n+1,0);
	oset<pair<ll,ll>> st;
	for(ll i=1;i<=n;i++)
		v[i]=v[i-1]+(s[i-1]=='1'?-3:1),st.insert(make_pair(v[i],i));
	for(ll i=0;i<n;i++){
		ans+=st.order_of_key(make_pair(v[i]-1,INF))-st.order_of_key(make_pair(v[i]-1,0))+(n-i)-st.order_of_key(make_pair(v[i]+2,0));
		st.erase(make_pair(v[i+1],i+1));
	}
	cout<<ans<<endl;
}
```

