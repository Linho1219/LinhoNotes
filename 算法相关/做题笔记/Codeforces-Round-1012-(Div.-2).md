# [Codeforces Round 1012 (Div. 2)](https://codeforces.com/contest/2090)

## C. [Dining Hall](https://codeforces.com/contest/2090/problem/C)

### 思路

题目的意思结合图像应该能理解的比较清晰了，故不再赘述

不难发现，我们找桌子的优先级依据是 $需求类型>距离>X坐标>Y坐标$ 

于是我们考虑将足够多的桌子先加入 `set` 中，然后每次取出优先级最高的桌子来使用

但是需要考虑如下特殊情况：

- 首先是特殊的需求类型，也就是一定要找一张全空的桌子
- 然后要考虑到桌子的四个座位距离是不一样的，优先级为 $\begin{pmatrix}2&4\\1&3\end{pmatrix}$ 
- 对于 $X+Y$ 相差为 $1$ 的两张桌子，远处的 $1$ 位比近处的 $4$ 位来得更近 
- 对于 $X+Y$ 相差为 $1$ 的两张桌子，远处的 $2，3$ 位与近处的 $4$ 位根据横坐标 $X$ 存在不同的优先级

为了便于转移，将占了 $\{0\},\{1,2\},\{3\}$ 个位置的桌子分开保存，占满了的自然就可以不用管了

### AC代码

```c++
ll px[5]={0,1,1,2,2},py[5]={0,1,2,1,2};

struct Tb{
	ll x,y;
	ll lst;
	bool operator<(const Tb &a)const{
		if(x+y!=a.x+a.y)
			return x+y<a.x+a.y;
		else if(x!=a.x)
			return x<a.x;
		return y<a.y;
	}
};

void solve(){
	ll n;
	cin>>n;
	
	set<Tb> s0,s1,s4;
	
	for(ll i=0;i<=2*sqrt(n)+2;i++)
		for(ll j=0;j<=2*sqrt(n)+2;j++){
			Tb tmp;
			tmp.x=i;
			tmp.y=j;
			tmp.lst=1;
			s0.insert(tmp);
		}
			
	for(ll i=1;i<=n;i++){
		ll ty;
		cin>>ty;
		if(ty==0){
			auto t1=*s0.begin();
//			cout<<"S0 "<<t1.x<<' '<<t1.y<<endl;
			s0.erase(s0.begin());
			cout<<t1.x*3+px[t1.lst]<<' '<<t1.y*3+py[t1.lst]<<'\n';
			t1.lst++;
			s1.insert(t1);
		}
		else{
			auto t1=*s0.begin();
			if(!s1.empty()){
				auto t2=*s1.begin();
				if(t2.x+t2.y<t1.x+t1.y)
					swap (t2,t1);
			}
			if(!s4.empty()){
				auto t2=*s4.begin();
				if(t1.lst==1)
					if(t2.x+t2.y<t1.x+t1.y-1)
						swap (t2,t1);
				if(t1.lst>1){
					if(t2.x+t2.y<t1.x+t1.y-1)
						swap (t2,t1);
					else if(t2.x+t2.y==t1.x+t1.y-1)
						if(t2.x<t1.x||(t2.x==t1.x&&t1.lst==3))
							swap(t2,t1);
				}
					
			}
			
			cout<<t1.x*3+px[t1.lst]<<' '<<t1.y*3+py[t1.lst]<<'\n';
			
			if(t1.lst==1){
				s0.erase(s0.begin());
				t1.lst++;
				s1.insert(t1);
			}	
			else if(t1.lst==4){
				s4.erase(s4.begin());
			}
			else{
				s1.erase(s1.begin());
				t1.lst++;
				if(t1.lst==4)
					s4.insert(t1);
				else
					s1.insert(t1);
			}
		}
	}
	cout.flush();
}
```

## D. [Simple Permutation](https://codeforces.com/contest/2090/problem/D)

### 思路

很简单，选择一个靠近 $\lfloor \frac n2 \rfloor$ 的质数，然后以其为中心来枚举即可，正确性证明可以直接借助一个结论：

- $1e5$ 内最大相邻质数间隔小于 $100$ 
- $1000$ 内最大相邻质数间隔仅为 $20$
- 而 $100$ 内仅为 $8$

正确性就显然了

## AC代码

```c++
void solve(){
	ll n;
	cin>>n;
	
	if(n<6){
		for(ll i=1;i<=n;i++)
			cout<<i<<' ';
		cout<<endl;
		return;
	}
	
	ll k=3;
	for(ll i=0;i<prm.size();i++)
		if(prm[i]<=(n+1)/2)
			k=prm[i];
		else
			break;
	
	cout<<k<<' ';
	for(ll i=1;i<k;i++)
		cout<<k-i<<' '<<k+i<<' '; 
	for(ll i=2*k;i<=n;i++)
		cout<<i<<' ';
	cout<<endl;
	
}
```

## E1. [Canteen (Easy Version)](https://codeforces.com/contest/2090/problem/E1)

### 思路

这个题面比较抽象，于是考虑转化题意，找到比较自然的建模方法

发现如果存在一个起点为 $i$ ，长度为 $l$ 的区间 $[i,i+l-1]$ （当然是循环的），使得数组 $a$ 在这个区间上的和小于等于数组 $b$ 在这个区间上的和，那么就一定可以**在 $l$ 回合内**消去 $a[i]$ ，证明如下：

- 根据题目的描述， $a$ 数组在逐渐移动去和 $b$ 数组“消去”，假设移动的过程中这个区间不存在“浪费”，也就是 $b$ 数组的一些数以大于零的状态移出了这个区间，因为如果存在“浪费”就说明 $a$ 数组最开头的那个元素 $a[i]$ 一定已经等于零了
- 那么既然没有“浪费”，又有数组 $a$ 在这个区间上的和小于等于数组 $b$ 在这个区间上的和，就可知 $a[i]$ 后的数一定会留下足够总和大于 $a[i]$ 的数来消去 $a[i]$

***但这却不是必要条件，反例可以自己思考一下***

真正可以**在 $l$ 回合内**消去 $a[i]$ 的充要条件是，存在一个 $l'\le l$ 使上述条件对 $l'$ 成立，这个正确性是显而易见的

那我们将区间和计算转化为前缀和计算，则条件变为存在 $l'\le l$ ，使得
$$
pref_a[i+l'-1]-pref_a[i-1]\le pref_b[i+l'-1]-pref_b[i-1]
$$
移项得
$$
pref_a[i+l'-1]-pref_b[i+l'-1]\le pref_a[i-1]-pref_b[i-1]
$$
 不妨令 $pref[i]=pref_a[i]-pref_b[i]$，则条件等价于
$$
pref[i+l'-1]\le pref[i-1]
$$
于是判断能否在 $l$ 回合内结束就可以通过查询区间最值来高效 $O(n\log n)$ 进行

再加上二分答案，就可以以 $O(n\log^2 n)$ 结束战斗

### AC代码

```c++
void solve(){
	ll n,k;
	cin>>n>>k;
	vector<ll> a(2*n+2,0),b(2*n+2,0),pa(n*2+2,0),pb(n*2+2,0),pp(n*2+2,0);
	for(ll i=1;i<=n;i++)
		cin>>a[i],pa[i]=a[i]+pa[i-1];
	for(ll i=1;i<=n;i++)
		cin>>b[i],pb[i]=b[i]+pb[i-1];
	
	for(ll i=n+1;i<=2*n;i++){
		a[i]=a[i-n];
		b[i]=b[i-n];
		pa[i]=a[i]+pa[i-1];
		pb[i]=b[i]+pb[i-1];
	}
	
	for(ll i=1;i<=2*n;i++){
		pp[i]=pa[i]-pb[i];
	}
	
	H_Segment_tree<ll> sgm(n*2,pp);
	
	auto check=[&](ll x)->bool{
		ll res=1;
		ll tmp=k;
		for(ll i=1;i<=n&&res;i++){
			ll sa=0,sb=0;
			sa=pp[i-1];
			sb=sgm.query(i,i+x).min_val;
			if(sa<sb)
				res=0;
		}
		return res;
	};
	
	ll l=0,r=n-1;
	while(l<r){
		ll mid=(l+r)/2;
		ll flag=check(mid);
		if(flag) r=mid;
		else l=mid+1;
	}
//	OOO
	cout<<l+1<<endl;
}
```

## E2. [Canteen (Hard Version)](https://codeforces.com/contest/2090/problem/E2)

### 思路

和 `Ez_ver`  没差多少，也是二分答案，需要加一个能否恰好 $k$ 次消去使得不用操作就达成目标的特判

对于二分答案的部分，我们二分最小操作轮数，对每个 $a[i]$ 求出使得上述条件成立的最小开销，看看总开销是否小于等于条件给出的 $k$ 即可

> #### Question
>
> 这里其实有一个问题还蛮难想明白的：为什么我对一个数操作若干次使得他条件成立后，对其他数是没有影响的，这个时候不应该改变数组的值吗？

思考、思考、思考......

> #### Answer
>
> 我们需要对一个数操作，首先它在此前是不能被消去的，那显然操作之后，这个数也不会小于对应的 $b[i]$ ，所以任何操作的作用都可以看作只在第一轮生效，也就是不会给其他数影响
>
> 并且很好理解，这次 check 中对于其他数的“最优区间”一定不会包含这个数，因为任何多包含进来的，以这个数为起点的一段区间，因为长度小于 $l$ ，所以带来的开销一定是非负的，只会严格更劣

## AC代码

***（只改变了check与特判，就不全部再放一遍了）***

```c++
if(k==pa[n]){	//特判
		cout<<0<<endl;
		return;
	}

auto check=[&](ll x)->bool{
		ll res=1;
		ll tmp=k;
		for(ll i=1;i<=n&&tmp>=0;i++){
			ll sa=0,sb=0;
			sa=pp[i-1];
			sb=sgm.query(i,i+x).min_val;
			tmp-=max(0ll,sb-sa);
		}
		
		if(tmp<0) res=0;
		
		return res;
	};
```

