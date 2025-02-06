# 妙妙小工具：Android

_记录一下常用的「妙妙小工具」及其下载方式（如果 Google Play 上没有的话），减轻装机的痛苦_

关于付费情况：

- <T red>付费</T> 付费软件，或者不付费时重要功能缺失
- <T orange>内购</T> 免费软件，但包含部分合理的内购功能
- <T lime>免费</T> 完全免费
- <T green>开源</T> 开源并且完全免费

以及特殊权限要求（只列出最低权限需求）：

- <T yellow>ROOT</T> 需要 ROOT 权限，包括直接调用或通过 Xposed 框架
- <T purple>ADB</T> 需要通过 ADB 启动，或通过 Shizuku 激活
- <T blue>DeviceOwner</T> 需要 DeviceOwner 权限，或通过 Dhizuku / 炼妖壶等软件激活

## 文件管理

### 保存副本

【**包名**】`app.rikka.savecopy`

【**介绍**】注册为文件打开方式，选择打开后自动保存副本到下载文件夹。解决部分软件未提供「另存为」功能的问题。

### 存储空间隔离 <T yellow>ROOT</T>

【**包名**】`moe.shizuku.redirectstorage`

【**介绍**】将流氓应用访问的手机存储重定向到其自身的数据存储目录，防止其在公共存储中乱拉屎。同时提供可访问白名单、目录导出等选项。

## 应用管理

### 黑<PY>阈</PY> <T purple>ADB</T>

【**包名**】`me.piebridge.brevent`

【**介绍**】杀后台工具。在应用处于后台时执行停用或待机指令，节省电量，提升流畅度。
