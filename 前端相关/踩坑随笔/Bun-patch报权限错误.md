# Bun patch 报权限错误

## 症状

在 Windows 下使用 `bun patch --commit <package>` 时报错：

```
bun patch vX.X.X (XXXXXXXX)
error: failed renaming patch file to patches dir EPERM: Operation not permitted (copyfile())
```

这是 Bun 本身的问题。当 Bun 缓存目录（默认在系统盘也就是 C 盘）和当前项目所在的盘不一样时，就会出现这个问题。

相关联的 issue：

- <https://github.com/oven-sh/bun/issues/12200>
- <https://github.com/oven-sh/bun/issues/12882>

## 解决

~~在系统盘开发项目，这样两个当然就在同一个盘里了。~~

Bun 的缓存目录可以通过环境变量或命令行参数配置，将缓存目录配置到和当前项目同一个盘的某个位置就可以了。

### 使用环境变量

Powershell 下，执行（注意这里 `X:` 要换成你项目所在的盘符）：

```ps1
$Env:BUN_INSTALL_CACHE_DIR = "X:\.bun\install\cache"
```

然后 **在当前终端会话下** 可以正常 patch。

### 使用命令行参数

在 patch 开始和提交时带上 `--cache-dir` 选项（注意这里 `X:` 要换成你项目所在的盘符）：

```ps1
bun patch <package> --cache-dir="X:\.bun\install\cache"

bun patch --commit <package> --cache-dir="X:\.bun\install\cache"
```
