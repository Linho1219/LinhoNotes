# Codeforces Round 1001 赛后复盘

### [*传送门*](https://codeforces.com/contest/2062)

## [C. Cirno and Operations](https://codeforces.com/contest/2062/problem/C)

### 游记 & 解题思路

赛时很快出了思路，就是说：

- 每次我们将数组转化为差分数组，都相当于取了每相邻两个数之间的差值
- 又因为我们可以将数组逆转，所以我们可以让这个差值变为其相反数，进而数组总和也是相反数
- 注意到，按照这样操作，相邻两数之间的差值的绝对值始终不受“逆转”操作的影响
- 所以，我们只需要枚举进行取差分数组的操作的次数，然后把每次的数组总和的绝对值取最大值即可

### AC代码

```c++
void solve(){
	ll n,ans=0;
	cin>>n;
	vector<ll> a(n+1);
	for(ll i=1;i<=n;i++) cin>>a[i],ans+=a[i];
	
	for(ll i=1;i<n;i++){
		ll tmp=0;
		for(ll j=1;j<=n-i;j++) a[j]=a[j+1]-a[j],tmp+=a[j];
		a[n-i+1]=0;
		ans=max(ans,abs(tmp));
	}
	cout<<ans<<endl;
}
```

## [D. Balanced Tree](https://codeforces.com/contest/2062/problem/D)

*赛时一直没出思路......还不如摆烂.jpg*

### 题意

给一棵树，对于树上的点i的范围在 $l[i]$ 到 $r[i]$ 之间，给每个点先择一个在范围内的值，现有操作，可以自行选择根节点，然后选择其中的一棵子树上的点的值全部 $+1$ ，求最后所有点的值相同的最小值是多少。

### 解题思路

我们先考虑当所有节点的初始值都已经确定，并且将 1 号节点视作根节点的情况

这个时候，有：

- 对于任意一条边连着的两个节点，他们的差值只可能通过对这条边的两端进行操作来“消去”
- 而如果对 $(u,v),(v,u)$ 都进行一次操作，其效果是全部节点 $+1$ ，只会更劣，所以只会有其中一种操作，且操作次数就是差值的绝对值
- 以上两点证明了这种策略的必要性，接下来证明正确性：
- 考虑以 DFS 的顺序进行操作，就相当于自底向上逐步调节边两端两部分的差值，并且不改变这两部分内部任意两点的差值
- 同时有，我们操作的这条边中，有一个点的子树上的全部边均经过了调整，由数学归纳法易得这个子树上节点权值均相等
- 所以这个操作可以视作每次将一个结点并入一个权值均相等的点集中，易得经过 $n-1$ 次操作之后，全部点的权值均相等
- 确定了操作之后，此时的答案是多少呢？
- 就是此时 $a_1$ 的数值：$a_1+\sum\limits_{i=2}^n{\max(a_i-a_{fa(i)},0)}$ 

明确了上述部分之后，我们就考虑怎么选取初值：

- 对于某一节点是叶子节点，既然不限制操作次数，那就将其设为它的下界，反正可以通过操作来无限增大
- 那对于任一叶节点初值均已知的节点，他的初值就应该尽量使他与儿子的差值减小，同时考虑后效性，也就是他有父亲，要在保证前者的条件下尽量的小，原因如下：
  - 在恰好满足前者的条件下，如果增大当前点权值，那么不会影响和儿子之间的差值（仍然为 $0$ ），故绝不会更优，如果减小，那么其至少将影响与其一个儿子之间的差值，至多只将影响其与其父亲一个差值，故也不会更优
- 所以，同样采用 DFS 处理出初值：

$$
a_u=\min(r_u,max(l_u,\max\limits_{fa(v)=u}a_v))
$$

至此，此题得解

### AC代码

```c++
void solve(){
	ll n,ans=0;
	cin>>n;
	vector<ll> l(n+1),r(n+1),eg[n+1],vis(n+1),w(n+1);
	for(ll i=1;i<=n;i++){
		cin>>l[i]>>r[i];
	}
	for(ll i=1;i<n;i++){
		ll u,v;
		cin>>u>>v;
		eg[u].emplace_back(v);
		eg[v].emplace_back(u);
	}
	
	function<void(ll)> DFS=[&](ll x){
		vis[x]=1;
		ll tmp=0;
		vector<ll> son;
		for(auto it:eg[x]){
			if(vis[it]) continue;
			DFS(it);
			son.emplace_back(it);
			tmp=max(tmp,w[it]);
		}
		w[x]=min(r[x],max(l[x],tmp));
		for(auto it:son)
			ans+=max(w[it]-w[x],0ll);
	};
	DFS(1);
//	OOO
	cout<<ans+w[1]<<endl;
}
```

## [E. The Game (Easy Version)](https://codeforces.com/contest/2062/problem/E1)

### 解题思路

既然要求在第一回合就取胜，也就是说，在我取了之后，对方还有的取；并且此时对方的所有选择，均会让我没得取

很容易发现，我们不能取最大的，那开始考虑第二大的：如果最大的不在第二大的的子树内，那么我取完第二大的就只能取最大的，那我必胜

接下来，如果最大的在第二大的的子树内，但是最大的和第二大的**不都在**第三大的的子树内，那么我取第三大的，就必胜

以此类推，我们要找的就是最大的，满足“比我大的数不都在我的子树内”的节点，反过来想，也就是“在我子树之外有比我大的数”的节点，我们可以用 DFS 序 + 前后缀最值表来查询子树外的最大值，进而实现查找答案

如果所有的数都不满足条件，则输出 “0”

时间复杂度 $O(n)$

### AC代码

```c++
void solve(){
	ll n,cnt=0,ans=0;
	cin>>n;
	vector<ll> dfw(n+1),pre(n+1),suf(n+2);
	vector<ll> w(n+1),eg[n+1],vis(n+1),dfn(n+1),siz(n+1),book(n+1);
	
	for(ll i=1;i<=n;i++) cin>>w[i];
	for(ll i=1;i<n;i++){
		ll u,v;
		cin>>u>>v;
		eg[u].emplace_back(v);
		eg[v].emplace_back(u);
	}
	
	function<void(ll)> DFS=[&](ll x){
		vis[x]=1;
		siz[x]=1;
		dfn[x]=++cnt;
		for(auto it:eg[x]){
			if(vis[it]) continue;
			DFS(it);
			siz[x]+=siz[it];
		}
	};
	DFS(1);
	
	
	for(ll i=1;i<=n;i++) dfw[dfn[i]]=w[i];
	for(ll i=1;i<=n;i++) pre[i]=max(pre[i-1],dfw[i]);
	for(ll i=n;i>=1;i--) suf[i]=max(suf[i+1],dfw[i]);
	
//	OOO
//	for(ll i=1;i<=n;i++) cout<<suf[i]<<' ';cout<<endl;
	
	function<bool(ll)> check=[&](ll x){
		ll l=dfn[x],r=dfn[x]+siz[x]-1,tmp=0;
		tmp=max(tmp,max(pre[l-1],suf[r+1]));
		return tmp>w[x];
	};
	
	for(ll i=1;i<=n;i++)
		if(check(i))
			if(w[i]>w[ans])
				ans=i;
	
//	OOO
	cout<<ans<<endl;
}
```

