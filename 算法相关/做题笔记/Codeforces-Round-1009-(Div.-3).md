# Codeforces Round 1009 (Div. 3)

## [Problem - D - Codeforces](https://codeforces.com/contest/2074/problem/D)

## 游记&题解

*赛时被xkm锐评做题做少了*

赛时看到这道题的时候：“沟槽的计算几何，怎么还带容斥，这怎么做啊？”

然后注意到一个不平凡的点：$m$ 的范围极其地小，所以就开始考虑这有什么用

很自然能想到的一点就是：我不用去求一个圆内的点数了，我完全可以 枚举横坐标 + 勾股定理 来确定每个横坐标处有多少个点在这个圆内

然后就是重复贡献的问题，也很好解决：开一个 `map` 来保存每一个位置上的最大值，维护总和即可

PS：需要注意浮点数精度问题

## AC代码

```c++
void solve(){
	ll n,m;
	cin>>n>>m;
	vector<pair<ll,ll>> v(n+1);
	map<ll,ll> ans;
	ll sum=0;
	
	for(ll i=1;i<=n;i++)
		cin>>v[i].first;
	for(ll i=1;i<=n;i++)
		cin>>v[i].second;
	
	for(ll i=1;i<=n;i++){
		auto &[x,R]=v[i];
		ll l=x-R,r=x+R;
		for(ll j=l;j<=r;j++){
			sum-=ans[j];
			ans[j]=max(ans[j],(ll)sqrtl(R*R-abs(j-x)*abs(j-x)+0.0000001)*2+1);
			sum+=ans[j];
		}
	}
//	OOO
	cout<<sum<<endl;
}
```

## [Problem - E - Codeforces](https://codeforces.com/contest/2074/problem/E)

*傻逼题目，不做评价*

## 游记&题解

见上方斜体部分

## AC代码

```c++
void solve(){
	ll n;
	cin>>n;
	vector<ll> book(n+1,0);
	ll a,b,c;
	
	ll tmp=rnd()%n+1;
	while(book[tmp]) tmp=rnd()%n+1;
	a=tmp;
	book[a]=1;
	while(book[tmp]) tmp=rnd()%n+1;
	b=tmp;
	book[b]=1;
	while(book[tmp]) tmp=rnd()%n+1;
	c=tmp;
	book[c]=1;
	for(ll i=1;i<=75;i++){
		ll f;
		cout<<"? "<<a<<' '<<b<<' '<<c<<endl;
		cin>>f;
		if(f==0){
			cout<<"! "<<a<<' '<<b<<' '<<c<<endl;
			return;
		}
		else{
			book[f]=1;
			if(i%3==0)
				a=f;
			else if(i%3==1)
				b=f;
			else
				c=f;
		}
	}
}
```

## [Problem - F - Codeforces](https://codeforces.com/contest/2074/problem/F)

*没有任何创意的低质题目*

## 题解

有两个方法，一个是学过线段树就会类比的递归法，在递归过程中统计答案即可，注意因为是二维的所以统计的时候需要两个维度上相乘

另一个就是题解给出的，直接枚举横纵坐标上的区段，然后对每两个区段的交，统计答案

## AC代码（真不想写，几乎抄的）

```c++
int get1side(int n, int k) {
	int ans = 0;
	for (int i = 1; i <= k; i *= 2) {
		if (n & i) {
			ans += k / i;
		}
	}
	return ans;
}

int get(int l1, int r1, int l2, int r2, int k) {
	if (l1 >= k || r1 <= 0 || l2 >= k || r2 <= 0) {
		return 0;
	}
	if (l1 <= 0 && r1 >= k && l2 <= 0 && r2 >= k) {
		return 1;
	}
	if (l1 <= 0 && r1 >= k && l2 <= 0) {
		return get1side(r2, k);
	}
	if (l1 <= 0 && r1 >= k && r2 >= k) {
		return get1side(k - l2, k);
	}
	if (l2 <= 0 && r2 >= k && l1 <= 0) {
		return get1side(r1, k);
	}
	if (l2 <= 0 && r2 >= k && r1 >= k) {
		return get1side(k - l1, k);
	}
	assert(k > 1);
	return get(l1, r1, l2, r2, k / 2) + get(l1, r1, l2 - k / 2, r2 - k / 2, k / 2) + get(l1 - k / 2, r1 - k / 2, l2, r2, k / 2) + get(l1 - k / 2, r1 - k / 2, l2 - k / 2, r2 - k / 2, k / 2);
}

void solve() {
	int l1, r1, l2, r2;
	cin >> l1 >> r1 >> l2 >> r2;
	cout << get(l1, r1, l2, r2, 1 << 20) << "\n";
}
```

## [Problem - G - Codeforces](https://codeforces.com/contest/2074/problem/G)

## 题解

面积不交叉相当于边不交叉，也就是不能存在两条边互相“跨越”

因为是环上的问题，考虑复制原数组，断环为链进行处理

记 $dp[i][j]$ 为从第 $i$ 个顶点到第 $j$ 个顶点的最高分数，那我们对于一个新区间 $dp[l][r]$ 的转移，就有以下两种情况：

- 直接来源于已知的最优解 $\max_{k=l}^{r-1} dp[l][k]+dp[k+1][r]$
- 在原来区间最优解的基础上添加三角形，因为是新的三角形，所以一定包含 $l,r$ 两个顶点，于是就有新的方案 $\max_{k=l+1}^{r-1} a_l\times a_r\times a_k +dp[l+1][k-1]+dp[k+1][r-1]$

总体时间复杂度 $O(n^3)$

## AC代码

```c++
void solve(){
	ll n,ans=0;
	cin>>n;
	
	vector<ll> v(2*n+1);
	v2ct<ll> dp(2*n+1,vector<ll>(2*n+1,0));
	for(ll i=1;i<=n;i++)
		cin>>v[i],v[n+i]=v[i];
	
	for(ll i=2;i<=n-1;i++)
		for(ll j=1;j+i<=2*n;j++){
			ll l=j,r=j+i;
			for(ll k=l;k<=r-1;k++)
				dp[l][r]=max(dp[l][r],dp[l][k]+dp[k+1][r]);
			for(ll k=l+1;k<=r-1;k++)
				dp[l][r]=max(dp[l][r],dp[l+1][k-1]+dp[k+1][r-1]+v[l]*v[r]*v[k]);
		}
	for(ll i=1;i<=n;i++)
		ans=max(ans,dp[i][i+n-1]);
//	OOO
	cout<<ans<<endl;
}
```

