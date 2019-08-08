# Mverything
utools 插件, 用于在 Mac 平台下提供与 Windows 平台下 Everything 插件类似的搜索体验.
插件基于`mdfind`命令, `mdfind`命令基于 Spotlight 构建索引, 所以, 如果禁用了 Spotlight, 那么插件也将无法使用.
这可以被看做是 Spotlight 文件搜索的一个封装, 直接用 Spotlight 应该是相同的效果, 不过 all in one 总是舒服一点.

另外科普一下 Everything 是基于 NTFS 文件系统的特性实现实时搜索, Mac 无论如何也是很难达到 Everything 的速度的, 所以插件直接使用了『回合制搜索』(即输入完成后需要按一下回车再开始搜索)而不是『实时搜索』, 反正也做不到干脆放弃.

# 版本
`0.0.1`

# 下载
[下载](https://www.lanzous.com/i5grdxe)

# 操作
## 关键字
`find`, `查找`

## 基本操作
| 操作 | 功能 |
| --- | --- |
| `Enter(回车)` | 搜索 |
| `Arrow Right(右方向键)` | 使用默认方式打开 |
| `Mouse Right(鼠标右击)` | 快捷菜单 |

## 条件查询
目前支持几个简单的条件, 使用方式为`key:搜索词`

| 操作 | 功能 |
| --- | --- |
| `f` | 文件(即排除文件夹) |
| `F` | 文件夹(即排除文件) |
| `p` | 仅搜索图片文件(png, jpg, jpeg, ico, bmp, gif, psd, svg, tif, eps, raw) |

## 高级查询
所谓高级查询就是`mdfind`命令自己支持的一些高级查询, 如`mdfind "kMDItemContentType=public.folder"`, 但是平心而论, 这些关键字实在是...一言难尽, 所以这些高级用法大家自己去找吧.

# 截图

![安装界面](https://user-gold-cdn.xitu.io/2019/8/7/16c6afdcdef7d7b7?w=870&h=666&f=png&s=47037)

![主界面](https://s2.ax1x.com/2019/08/07/e5TFxg.png)

![搜索界面](https://s2.ax1x.com/2019/08/07/e570kq.png)

![条件搜索](https://s2.ax1x.com/2019/08/07/e5O3QK.png)
