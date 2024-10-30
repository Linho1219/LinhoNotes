# 私有扩展

私有扩展指的是由 VitePress 定义或由本仓库定义的 Markdown 扩展语法。

## 折叠块

使用 `::: details xxx` 标记折叠块。其中的 `xxx` 可略去，默认标题为“Details”。

```markdown
::: details 折叠块标题
被折叠的内容。
:::
```

::: details 渲染结果
::: details 折叠块标题
被折叠的内容。
:::

## 徽章

本仓库提供 14 个颜色的徽章。

<T c="red" t="红色" />
<T c="orange" t="橙色" />
<T c="yellow" t="黄色" />
<T c="green" t="绿色" />
<T c="blue" t="蓝色" />
<T c="indigo" t="靛青" />
<T c="purple" t="紫色" />
<br/>
<T c="pink" t="粉色" />
<T c="magenta" t="洋红" />
<T c="lime" t="青绿" />
<T c="olive" t="橄榄" />
<T c="cyan" t="青色" />
<T c="teal" t="茶色" />
<T c="gray" t="灰色" />

基本语法：

```markdown
<Tag color="red" text="文本" />
<T color="red" text="文本" />
<T c="red" t="文本" />
```

上面三种均合法。`Tag` 标签可简写为 `T`，标记标签元素。标签元素为自闭合标签。

`text` 属性可简写为 `t`，定义徽章显示的文本内容。

`color` 属性可简写为 `c`，定义徽章的颜色。下面是颜色与名称的对照表：

|           颜色            |   名称   |            颜色            |   名称    |
| :-----------------------: | :------: | :------------------------: | :-------: |
|  <T c="red" t="红色" />   |  `red`   |  <T c="pink" t="粉色" />   |  `pink`   |
| <T c="orange" t="橙色" /> | `orange` | <T c="magenta" t="洋红" /> | `magenta` |
| <T c="yellow" t="黄色" /> | `yellow` |  <T c="lime" t="青绿" />   |  `lime`   |
| <T c="green" t="绿色" />  | `green`  |  <T c="olive" t="橄榄" />  |  `olive`  |
|  <T c="blue" t="蓝色" />  |  `blue`  |  <T c="cyan" t="青色" />   |  `cyan`   |
| <T c="indigo" t="靛青" /> | `indigo` |  <T c="teal" t="茶色" />   |  `teal`   |
| <T c="purple" t="紫色" /> | `purple` |  <T c="gray" t="灰色" />   |  `gray`   |
