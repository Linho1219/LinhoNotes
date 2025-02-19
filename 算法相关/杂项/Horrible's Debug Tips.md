# Horrible's Debug Tips

*这里记录了主播 ACM历程 上值得被 ~~嘲笑~~ 铭记 的一些错误，金石厚仁，警钟撅烂*

## 1. 统计因子

在使用枚举法统计因子的时候，注意不要遗漏或重复计数了 $\sqrt n$ 这个因子

正确的写法应为：

```c++
for(ll i=1;i*i<=n;i++){
    if(n%i==0) fct.emplace_back(i);
	if(n!=i*i) fct.emplace_back(n/i);
}	
```

## 2. 神秘的 ST 表

不要把 ST 表的两个维度用反了，检查的时候也需要注意这一点

一般默认第一维应该是 $\log n$ 级别的