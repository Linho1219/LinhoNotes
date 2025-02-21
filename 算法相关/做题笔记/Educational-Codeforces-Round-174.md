# Educational Codeforces Round 174

[*传送门*](https://codeforces.com/contest/2069)

## [E. A, B, AB and BA](https://codeforces.com/contest/2069/problem/E)

### 题解

不难意识到，A和B比AB和BA更泛用，所以我们考虑优先消耗AB和BA

对于每一个AB和BA，均能“节省”一个A和一个B，所以他们俩的优先级不受现有的A和B的数量的影响

那为了尽可能多地使用AB和BA，我们可以将字符串分成若干种子串：

1. AB....AB
   - 对于这种串，要尽可能多地利用AB/BA，最佳策略是全部用AB填满
   - 如果AB不足，剩下的就尽量用BA填，但是这样填不满，至少会剩A&B各一个
   - 最后剩下的部分只能用 A/B 填，记录需求量
2. BA....BA
   - 类比第一种
3. AB....BA
   - 尽可能多地使用 AB/BA 去填，在这里这两种是等价的，但是最后至少会剩一个A
   - 把剩下的记在 A/B 账上
4. BA....AB
   - 类比第三种

最后我们拿着统计的 A/B 需求量与给出的要求做对比，即可判断是否有解

### AC代码

```c++
void solve(){
	string s;
	cin>>s;
	ll n=s.size();
	vector<ll> AB,BA,ABA,BAB;
	ll a,b,ab,ba;
	cin>>a>>b>>ab>>ba;
 	for(ll i=0;i<n;i++){
		ll tmp=i;
		while(tmp<n-1&&s[tmp+1]!=s[tmp]) tmp++;
		if(tmp-i+1&1){
			if(s[i]=='A')
				ABA.emplace_back(tmp-i+1);
			else
				BAB.emplace_back(tmp-i+1);
		}
		else{
			if(s[i]=='A')
				AB.emplace_back(tmp-i+1);
			else
				BA.emplace_back(tmp-i+1);
		}
		i=tmp;
	}
	sort(AB.begin(),AB.end());
	sort(BA.begin(),BA.end());
	for(auto &it:BA){
		ll tmp=min(ba,it/2);
		it-=tmp*2;
		ba-=tmp;
		if(!ba&&ab&&it){
			tmp=min(ab,it/2-1);
			it-=tmp*2;
			ab-=tmp;
		}
		if(it){
			a-=it/2;
			b-=it/2;
			it=0;
		}
	}
	for(auto &it:AB){
		ll tmp=min(ab,it/2);
		it-=tmp*2;
		ab-=tmp;
		if(!ab&&ba&&it){
			tmp=min(ba,it/2-1);
			it-=tmp*2;
			ba-=tmp;
		}
		if(it){
			a-=it/2;
			b-=it/2;
			it=0;
		}
	}
	ll tot=ba+ab;
	for(auto &it:ABA){
		ll tmp=min(tot,it/2);
		it-=tmp*2;
		tot-=tmp;
		if(it){
			a-=it/2+1;
			b-=it/2;
			it=0;
		}
	}
	for(auto &it:BAB){
		ll tmp=min(tot,it/2);
		it-=tmp*2;
		tot-=tmp;
		if(it){
			a-=it/2;
			b-=it/2+1;
			it=0;
		}
	}
//	cout<<a<<' '<<b<<' '<<tot<<endl;
	if(a>=0&&b>=0)
		cout<<"YES"<<endl;
	else
		cout<<"NO"<<endl;
}
```

