# Trick 异或哈希 学习笔记

## XOR Hashing 异或哈希

*部分资料引自 [OIWIKI](https://oi-wiki.org/)*

> 异或哈希是个很神奇的算法，利用了异或操作的特殊性和哈希降低冲突的原理，可以用于快速找到一个组合是否出现、序列中的数是否出现了k次

### 基本概念

异或 是计算机语言中的一个运算符，代码中用^表示，可以理解为不进位的二进制加法。
哈希（或称之为散列）算法是一种用于快速定位资源的算法。

> 在c++中，可以直接用 `unordered_map` 作为 hash 表，但是对于复杂的元素，需要重载 `==` 运算符以及 `hash` 函数才行。对于更复杂的数组，就不太适用了

例题：
> 给一个长度为 n 的数组 a，找到所有的连续子序列 [l,r] 满足：正好包含 1 到 r − l + 1 中的所有数

根据异或的交换律可知：一个数组的任何排列组合，它的异或结果都相同，看起来好像可以根据这个来判断两个数组是否是同一个排列组合，但是其实有很多其他的组合异或后也是相同的结果，本质原因是组合数的数量级在 $ n^2 $ 而异或的结果集只有 $n$ ，有什么办法可以解决呢？

#### 用哈希降低冲突

为了解决冲突我们可以利用哈希将异或的结果集扩大：将数字哈希成 64 位无符号整数，结果集就扩大为了 $2^{64}$ ，冲突的概率就微乎其微了。

### 进阶练习

之前提到，二进制的异或的本质是对每一位进行不进位的加法，也就是每一位相加对2取模，那按照类似的思路，可以拓展到K进制下的异或，以解决其他的问题（例如下面这道）

[传送门](https://codeforces.com/contest/1418/problem/G)

个人代码：

```C++
#include<iostream>
#include<map>
#include<vector>
#include<random>
#include<ctime>
using namespace std;

long long n,ans;
const uint64_t M=917354628531972864;
uint64_t hs[500010];
mt19937_64 rnd(42);

uint64_t kxor(uint64_t a,uint64_t b,int k)
{
	uint64_t res=0,p=1;
	while(a||b)
	{
		res+=((a+b)%M)%k*p;
		a/=k,b/=k;
		p*=k;
	}
	return res;
}

int main()
{
	ios::sync_with_stdio(0);
	cin.tie(0);
	cout.tie(0);
	
	cin>>n;
	vector<int> v(n+1); 
	for(int i=1;i<=n;i++)
		cin>>v[i];
	
	
	
	vector<uint64_t> pr(n+1);
	map<uint64_t,int> cnt;
	int vct[500010]={};
	
	
	for(int i=1;i<=n;i++)
		hs[i]=rnd()%M;
	
	
	
	int l=0;
	pr[0]=0;
	cnt[0]=1;
	for(int i=1;i<=n;i++)
	{
		pr[i]=kxor(hs[v[i]],pr[i-1],3);
		vct[v[i]]++;
		
		while(vct[v[i]]>4)
		{
			if(l) vct[v[l]]--;
			cnt[pr[l]]--;
			l++;
			//cout<<'K'<<endl;
		}
		
		ans+=cnt[pr[i]];
		//cout<<i<<' '<<v[i]<<' '<<cnt[pr[i]]<<' '<<l<<' '<<pr[i]<<endl;
		cnt[pr[i]]++;
		
	}
	cout<<ans<<endl;
	
	
	
	return 0;
}

```

> 上面代码大家会看到一个很神奇的内容 mt19937_64 rnd(time(0))，这是 c++ 自带的梅森旋转（Mersenne Twister）伪随机数，可以随机生成 64 位整数，随机的内容直到 $ 2^{19937} $ 次调用后才会出现重复，具体的原理这里不过多介绍。把他当成一个工具使用就行。
