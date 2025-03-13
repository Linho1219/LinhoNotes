# [Codeforces Round 994 (Div. 2)](https://codeforces.com/contest/2049) D题 标算

*我也想去香港站*

## D. Shift + Esc

[传送门](https://codeforces.com/contest/2049/problem/D)

### 题意

$n×m$ 的矩阵，你可以花费 $k$ 的代价将任意一行整体循环左移一位（可多次操作），然后从 $(1,1)$ 开始以最短路径移动到 $(n,m)$，代价为经过的数的和。求最小代价。$n,m\le200$。

### 思考

题目一看就是 DP，关键是怎么去 D

既然是 DP 了都，就要先看看操作的后效性，可以看出，左移是有后效性的，因为左移很明显会导致移动后后面的序列整体移动，所以左移要单独作为一个dp维度来操作

对于左移这个操作本身，只要把左移看作是下标 $+k$ 再 $%m$ ，就相当于看作是一个环

然后再看向右和向下移动，很容易联想到经典问题之数学三角形，统计路径cost

想到了数学三角形就不难看出 xy 坐标作为 DP 的维度是必要的，下一步就是确定方程了

对于坐标 $(i，j)$ ，显然只能由上方的 $(i-1，j)$ 和左边的 $(i，j-1)$ 转移而来，至于边界问题，只需要把到不了的地方全部 $memset$ 成 $0x3f$ 即可

于是就能得到初步的 DP 的转移方程了。(这里把题目给出的 $k$ 作为 $ck$ 来写)

$f[i][j][k]=min(min_{N=1}^{m}（f[i-1][j][N]+N*ck）,f[i][j-1][k]+a[i][(j+k)\%m])$

如果真这样写，会有两个问题

​	1.$int\ f[200][200][200]$ 太大了，$memset$ 会爆掉

​	2.每次遍历上一次让 $f[i][j]$ 最小的 $k$ 又让复杂度多乘了个 $m$

对于第一个问题，我们能看出它只会从上一行开始转移，所以用一个一维回滚就能解决，把它开成$int\ f[2][200][200]$

对于第二个问题，我们只用在上一次遍历的同时用一个二维数组取存 *到达当前$(i，j)$的最小花费*，每次转移就从这个数组里面转移就可以了

另外需要注意虽然 $k$ 和 $m$ 都是 $int$ 范围，但他们乘起来就不是 $int$ 范围了，得开成 $long\ long$

以及当 $i$ 为 1 的时候，不能从上转移

于是复杂度就变成了 $\Theta(n\cdot m^2)$ ， 就 a 掉这题了

### AC代码

```c++
#include <bits/stdc++.h>
typedef long long ll;
#define endl '\n'
using namespace std;
int T=1;
const int N=2e2+5;
ll a[N][N],f[2][N][N],ok[N][N];
void solve()
{
	ll n,m,ck;cin>>n>>m>>ck;
	for(int i=1;i<=n;i++)
		for(int j=0;j<m;j++) cin>>a[i][j];
	memset(f,0x3f,sizeof f);
	memset(ok,0x3f,sizeof ok);
	ok[0][0]=0;
	for(int i=1;i<=n;i++)
	{
		 for(int k=0;k<=m-1;k++)
		 {
		 	ll cost=k*ck;
			for(int j=0;j<m;j++)
			{
				ll left=0;
				if(j!=0)
				{
					left=f[i%2][j-1][k]+a[i][(j+k)%m];
					ll up=cost+ok[i-1][j]+a[i][(j+k)%m];
					f[i%2][j][k]=min(up,left);
				}
				else
				{
					f[i%2][j][k]=cost+ok[i-1][j]+a[i][(j+k)%m];
				}
				ok[i][j]=min(ok[i][j],f[i%2][j][k]);
			}
		 }
	}
	cout<<ok[n][m-1]<<endl;
}

int main()
{
	cin>>T;
	while(T--){
		solve();
	}
	return 0;
}
```

