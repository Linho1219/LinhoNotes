# [Codeforces Round 1014 (Div. 2)](https://codeforces.com/contest/2092)

## D. [Mishkin Energizer](https://codeforces.com/contest/2092/problem/D)

### 思路

考虑对两个不同的字符中的前一个操作，一定会产生两个不同于前一个字符的字符：

- $\text{LI} \rightarrow  \text{LTI}\rightarrow \text{LITI}$ 
- 这样就等效于前一个字符的数量减少了一个

不难意识到，对后一个字符操作两次，也有相同的效果，所以我们可以用两次操作使得一个字符被消去或者说“成功匹配”

那解法就很清晰了，统计每种字符出现的个数然后找到前后字符不同的地方，如果出现的前后字符中有尚未被匹配的，就是用若干次上述操作使得这种字符全部匹配

同时需要注意维护字符串，实施迭代操作的位置

### AC代码

```c++
void solve(){
	ll n,cnt[4]={0,0,0,0};
	cin>>n;
	string s;
	cin>>s;
	vector<ll> v(n+1,0);
	for(ll i=1;i<=n;i++){
		if(s[i-1]=='L') v[i]=1;
		else if(s[i-1]=='I') v[i]=2;
		else v[i]=3;
		cnt[v[i]]++;
	}
	vector<ll> ans;
	ll sum=0;
	
	for(ll i=1;i<n;i++){
		if(v[i]!=v[i+1]){
			if(cnt[v[i]]>0){
				ll tp=i+sum;
				while(cnt[v[i]]){
					cnt[v[i]]--;
					ans.emplace_back(tp);
					ans.emplace_back(tp);
					sum+=2;
				}
			}
			
			if(cnt[v[i+1]]>0){
				while(cnt[v[i+1]]){
					cnt[v[i+1]]--;
					ans.emplace_back(i+sum);
					ans.emplace_back(i+sum+1);
					sum+=2;
				}
			}
		}
		if(cnt[1]+cnt[2]+cnt[3]==0) break;
	}
	if(cnt[1]+cnt[2]+cnt[3]>0)
		cout<<-1<<endl;
	else{
		cout<<sum<<endl;
		for(auto it:ans)
			cout<<it<<endl;
	}
}
```

## E. [She knows...](https://codeforces.com/contest/2092/problem/E)

### 思路

不难发现，其实不同相邻方格对数的奇偶性与四角和中心（不沾边界）的格子无关，证明如下：

- 这还要证？你翻转这些格子的颜色，只会做偶数次改变，当然不影响奇偶性！

所以只需要考虑边界且非四角的那些格子

又不难发现，不同相邻方格对数的奇偶性与边界且非四角的那些格子中某种颜色格子的奇偶性相同，证明如下：

- 这还要证？你都知道与其他不同了，你假设其他全为单色，那不同的相邻方格对的数量不就是那些格子中某种颜色格子的数量？

那结论就很简单，假设未被涂色的格子有 $x$ 个：

1. 如果边界上全部被确定了：
   1. 如果某种颜色是奇数，输出 $0$ ，因为不合法
   2. 否则输出空余格子的组合数，也就是 $2^x$ 
2. 如果边界上没有全部被确定了，那其余部分随便涂，边界上的涂法对奇偶性有要求，由二项式展开的奇偶项分别求和相等可知，答案是总组合数的一半，也就是 $2^{x-1}$

搞定了，就是这样

### AC代码

```c++
void solve(){
	ll n,m,k;
	cin>>n>>m>>k;
	
	ll bcnt[2]={};
	
	for(ll i=1;i<=k;i++){
		ll x,y,c;
		cin>>x>>y>>c;
		if(((x==1||x==n)&&(y>1&&y<m))||((y==1||y==m)&&(x>1&&x<n)))
			bcnt[c]++;
	}
	
	ll bsum=2*(n-2)+2*(m-2);
	
	if(bcnt[1]+bcnt[0]==bsum&&bcnt[0]%2==1){
		cout<<0<<endl;
		return;
	}
	else if(bcnt[1]+bcnt[0]==bsum&&bcnt[0]%2==0){
		ll tot=0;
		tot=n*m-k;
		ll c=2,ans=1;
		while(tot){
			if(tot&1ll){
				ans=ans*c%Mod;
			}
			c=c*c%Mod;
			tot/=2;
		}
		cout<<ans<<endl;
	}
	else{
		ll tot=0;
		tot=n*m-k-1;
		ll c=2,ans=1;
		while(tot){
			if(tot&1ll){
				ans=ans*c%Mod;
			}
			c=c*c%Mod;
			tot/=2;
		}
		cout<<ans<<endl;
	}
}
```

