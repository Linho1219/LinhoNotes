# 大地测量基础

<Tag orange>更新中</Tag>

同济大学测绘专业基础课程，课号 `CSG330203` / `03034803`。

教材使用施一民《现代大地控制测量》（第二版）。

```mermaid
flowchart TB
  subgraph G0 [坐标]
    direction LR
    O1["坐标系"] --> K["地心<br>参心<br>站心<br>坐标变换"]
    O2["坐标系统"] --> 基准变换
  end
  
  G0 --- O3["大地测量常用基准"]
  
  O3 --> G1
  subgraph G1 [大地水准面]
    direction TB
    A["铅垂线<br>地轴"] --> B["地面观测<br>方向<br>角度<br>距离"]
  end
  
  O3 --> G2
  subgraph G2 [椭球面]
    direction TB
    C["法线<br>大地子午线"] --> D["椭球数学<br>大地主题解算"]
  end
  
  O3 --> G3
  subgraph G3 [平面]
    direction TB
    E["坐标北<br>中央子午线"] --> F["高斯投影<br>墨卡托投影"]
  end
```

## 记号

- 地心地固直角坐标 $(X,Y,Z)$
- 大地经度、纬度、椭球高 $(L,B,h)$，也常写作 $(\lambda,\varphi,h)$
- 长半轴、短半轴 $a,b$；第一偏心率 $e$；扁率 $f$
- 地球引力常数合并记作 $\mu=GM$
