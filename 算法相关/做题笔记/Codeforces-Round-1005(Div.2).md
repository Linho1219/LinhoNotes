# Codeforces Round 1005 (Div. 2)

[*传送门*](https://codeforces.com/contest/2064)

## [D. Eating](https://codeforces.com/contest/2064/problem/D)

*挺新颖的一道题，引导很弱，如果不头脑风暴一下可能想不到做法*

### 游记&题解

根据题意，容易发现在一个推进的过程中是不会碰上 **最高位比自己高的数** 的，因为这样的数一定比自己大，同时也一定不用特别处理 **最高位比自己低的数** 因为一定能够吞并

那我们就考虑关注 **最高位和自己相同的数** ， 不难发现我们最多只能够吞并一次这样的数，因为此后我们最高位就降低了，它就变成 **最高位比自己高的数** 了

又不难发现，这样的 **降位** 只会发生不超过 $30$ 次，所以开销是正确的

维护也很好维护，异或后的数用前缀异或和 $\rm O(1)$ 处理 ，并且预处理出每个位置的下一个第 $i$ 位为 $1$ 的数的位置，就可以实现 $\rm O(1)$ 跳转

### AC代码

```c++
void solve(){
	ll n,q;
	cin>>n>>q;
	vector<ll> w(n+2),hg(n+1),xum(n+2);
	for(ll i=1;i<=n;i++) cin>>w[i];
	for(ll i=1;i<=n;i++) hg[i]=__lg(w[i])+1;
	for(ll i=n;i>=1;i--) xum[i]=xum[i+1]^w[i];
	
	v2ct<ll> nxt(31,vector<ll>(n+2));	//包括自己的下一个第i位上是1 
	
	for(ll i=1;i<=30;i++){
		for(ll j=1;j<=n+1;j++){
			if((w[j]>>(i-1))&1) nxt[i][j]=j;
			else nxt[i][j]=nxt[i][j-1];
		}
//		cout<<i<<' '<<nxt[i][n+1]<<endl;
	}
	
	for(ll i=1;i<=q;i++){
		ll x,ans=0,cur=n+1;
		cin>>x;
		ll clg=__lg(x)+1;
		for(ll j=clg+1;j<=30;j++)
			ans=max(ans,nxt[j][n+1]);
//		cout<<clg<<' '<<ans<<endl;
		while(clg>0&&cur>0){
//			cout<<"!!!"<<endl;
			if(nxt[clg][cur-1]==0){
				cur=1;
//				cout<<"!!!"<<endl;
				break;
			}
			else{
				if((x^xum[nxt[clg][cur-1]+1])<w[nxt[clg][cur-1]]){
					cur=nxt[clg][cur-1]+1;
					break;
				}
				else{
					ll tmp=x^xum[nxt[clg][cur-1]];
					if(tmp==0){
						cur=nxt[clg][cur-1];
						break;
					}
					for(ll j=__lg(tmp)+2;j<=clg;j++)
						ans=max(ans,nxt[j][nxt[clg][cur-1]-1]);
					cur=nxt[clg][cur-1];
					clg=__lg(tmp)+1;
				}
			}
		}
//		OOO
		cout/*<<ans<<' '<<cur<<' '*/<<min(n-ans,n+1-cur)<<endl;
	}
	
}
```

## [E. Mycraft Sand Sort](https://codeforces.com/contest/2064/problem/E)

### 题解

不难发现我们不能改变 $c_i$ ，并且只能交换相同颜色的 $p_i$

进一步发现，两个 $p_i$ 能交换的充要条件是其间所有异色的 $p_i$ 都比他俩小，所以我们可以从小到大枚举 $p_i$ ，用并查集维护其能到达的集合大小，进而求出每个 $p_i$ 可交换的策略数，并在此后将其删除表示 “不影响更大的”

### AC代码

```c++
void solve(){
	ll n,ans=1;
	cin>>n;
	vector<ll> c(n+2),p(n+2),pre(n+2),nxt(n+2),siz(n+2),fa(n+2);
	vector<pair<ll,ll>> od(n+1);
	
	function<ll(ll)> Gf=[&](ll x){
		if(fa[x]==x) return x;
		return fa[x]=Gf(fa[x]);
	};
	
	auto merge=[&](ll x,ll y){
		if(Gf(x)==Gf(y)) return;
		siz[Gf(x)]+=siz[Gf(y)];
		fa[Gf(y)]=Gf(x);
	};
	
	for(ll i=1;i<=n;i++) cin>>p[i];
	for(ll i=1;i<=n;i++){
		od[i].first=p[i];
		od[i].second=i;
		cin>>c[i];
		pre[i]=i-1;
		nxt[i]=i+1;
		siz[i]=1;
		fa[i]=i;
	}
	c[n+1]=INF;
	c[0]=-INF;
	sort(od.begin()+1,od.end());
	for(ll i=2;i<=n;i++)
		if(c[i]==c[i-1])
			merge(i,i-1);
	for(ll i=1;i<=n;i++){
		ll cur=od[i].second;
		ans=ans*siz[Gf(cur)]%Mod;
		siz[Gf(cur)]--;
		if(c[nxt[cur]]==c[pre[cur]]) merge(nxt[cur],pre[cur]);
		nxt[pre[cur]]=nxt[cur];
		pre[nxt[cur]]=pre[cur];
	}
//	OOO
	cout<<ans<<endl;
}
```

