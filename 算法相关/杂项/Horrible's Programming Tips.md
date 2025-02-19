# Horrible's Programming Tips

*这里记录了一些编写程序时会用到的范式写法，规范化之后能减少出锅的概率，并且极大程度提高代码可读性与Debug效率*

## 1. 对两个数组的分指针求和

题目背景：[D. Game With Triangles](https://codeforces.com/contest/2063/problem/D)

最后要求取 $k$ 为 $1,2,3.....mk$ 时在 $A$ 和 $B$ 中共取 $k$ 个的最大总和
同时对在某一集合中取的元素数量有限制 $sx \& tx $

### 代码实现

```c++
for(ll i=1;i<=mk;i++){
    ll sx=n-i,tx=m-i;
    if(A[s+1]>=B[t+1])	//贪心，加入一个大的元素
        ans+=A[++s];
    else
        ans+=B[++t];

    while(s>sx){	//调整，如果超出限制就减少所选的元素数量
        ans-=A[s--];
        ans+=B[++t];
    }
    while(t>tx){
        ans-=B[t--];
        ans+=A[++s];
    }
    cout<<ans<<' ';	
		}
```

 