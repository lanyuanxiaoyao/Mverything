# Mverything
utools 插件, 用于在 macOS 提供与 Windows 中 Everything 插件类似的搜索体验.
插件基于`mdfind`命令, `mdfind`命令基于 Spotlight 构建索引, 所以, 如果禁用了 Spotlight, 那么插件也将无法使用.
插件可以被看做是 Spotlight 文件搜索的一个封装, 直接用 Spotlight 应该是相同的效果, 不过 all in one 总是舒服一点.

另外科普一下, Everything 是基于 NTFS 文件系统的特性实现实时搜索, 在 macOS 上无论如何也是很难达到 Everything 的速度的, 所以插件直接使用了『回合制搜索』(即输入完成后需要按一下回车再开始搜索)而不是『实时搜索』, 反正也做不到干脆放弃.

# 版本
现在可以使用 macOS 原生预览啦!
- `0.1.2`
  1. 适配 utools 新版本 API
  2. 增加在搜索结果界面点击`esc`键自动选中搜索文本, 方便直接修改
  3. 增加使用 macOS 原生 QuickLook 进行文件预览, 设置中开启
  4. 调整一些键盘逻辑和样式
- `0.1.1`
  1. 增加在预览状态下直接通过上下方向键切换预览的文件
  2. 增加搜索当前文件夹, 可以通过复制文件夹和在文件夹选中状态下直接Tab键触发
  3. 增加自定义文本和图片格式的后缀名, 用于拓展文本和图片格式的预览
  4. 最近时间不多, 可能测试得不够, 可能会有没有照顾到的bug, 请及时反馈
- `0.1.0`
  各项功能的形式基本稳定下来, 以下为主要修改, 使用方法见后文
  1. **键盘操作**
  **Space(空格)** 作为预览按键, 贴近 macOS 操作模式
  **→ (右方向键)** 改回使用默认方式打开文件
  2. **样式**
  搜索结果将文件名放在首位, 一眼就能看到
  3. **预览**
  增加文本文件, 图片和文件夹的内容预览, 方便直接浏览文件内容确定要找的文件
  4. **快捷搜索**
  增加自定义快捷搜索, 使用**正则表达式**对**全路径**进行过滤, 快捷过滤搜索结果更加随心
  取消`f`和`F`关键词
  **仅搜索文件夹**只需要在输入框最前方加上**一个空格**
  **仅搜索文件**只需要在输入框最前面加上**两个空格**
  以上两种过滤可以和自定义快捷搜索组合使用
- `0.0.5`
  1. 优化按键操作, 详情面板可通过`esc`键关闭并激活输入框, 左方向键可以也可以关闭详情面板
- `0.0.4`
  1. 增加文件详情面板
  2. 修改快捷键逻辑, 单击右方向键为打开文件详情, 双击右方向键用默认方式打开文件
  3. 修改升序降序按钮为图标
- `0.0.3`
  1. 增加操作提示说明板面
  2. 增加按照文件名, 大小等信息过滤的按钮
  3. 美化一些样式
- `0.0.2`
调整不和谐的样式(底部蓝条, 宽度过大导致出现滚动条)
- `0.0.1`
基本功能

# 下载
[插件主页](https://yuanliao.info/d/595/13) - [下载最新版](https://github.com/lanyuanxiaoyao/Mverything/releases/latest) - [历史版本](https://github.com/lanyuanxiaoyao/Mverything/releases)

# 源码
没啥好敝帚自珍的.

传送门 → [Mverything](https://github.com/lanyuanxiaoyao/Mverything)

<div>
  <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/lanyuanxiaoyao/Mverything">
  <img alt="GitHub release version" src="https://img.shields.io/github/release/lanyuanxiaoyao/Mverything">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/lanyuanxiaoyao/Mverything">
  <img alt="GitHub" src="https://img.shields.io/github/license/lanyuanxiaoyao/Mverything">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/lanyuanxiaoyao/Mverything">
</div>

# 操作
## 关键字
`find`, `查找`

## 基本操作
| 操作 | 功能 |
| --- | --- |
| `Enter(回车)` | 搜索 |
| `Space(空格)` | 预览 |
| `Arrow Right(右方向键)` | 默认方式打开文件 |
| `Mouse Left(鼠标左键双击)` | 默认方式打开文件 |
| `Mouse Right(鼠标右键单击)` | 快捷菜单 |

## 快捷搜索
### 默认
插件自带的快捷搜索有两个: 仅搜索文件夹和仅搜索文件
**仅搜索文件夹**只需要在输入框最前方加上**一个空格**

![](https://s2.ax1x.com/2019/08/10/eOreXj.png)

**仅搜索文件**只需要在输入框最前面加上**两个空格**

![](https://s2.ax1x.com/2019/08/10/eOrK7q.png)

### 自定义
可以在设置中自定义属于自己的快捷搜索, 自定义快捷搜索使用正则表达式对搜索结果的全路径进行匹配, 全路径的意思即包含完整路径和文件名的单行文本, 如`/Users/lanyuanxiaoyao/Library/Mobile Documents/iCloud~QReader~MarginStudy/Documents/Head First Java 第二版.pdf`, 这就是这个PDF文件的全路径, 自定义的快捷搜索将会对这样的文本进行匹配.

下面将使用一个例子来说明.
如果我想要在搜索结果里面过滤出图片文件, 那么可以在自定义快捷搜索里面添加: `pic&png|jpg|jpeg|bmp|svg|webp$`, 其中以`&`作为分隔符, `pic`是快捷搜索时使用的关键字, `\.(png|jpg|jpeg|bmp|svg|webp)$`为执行快捷搜索时使用的正则表达式

![](https://s2.ax1x.com/2019/08/10/eOsgRU.png)

![](https://s2.ax1x.com/2019/08/10/eOs5ZR.png)

添加完成后, 就可以在搜索的时候使用这个快捷搜索了, 如下图所示, 在输入框中输入`pic:icon`, 就会把带有"icon"的图片全部搜索出来了.

![](https://s2.ax1x.com/2019/08/10/eOsId1.png)

*正则表达式的规则不再赘述, 可以自行百度*

### 其他
值得一提的是, 默认的快捷搜索和自定义的快捷搜索是可以组合使用的

## 高级查询
所谓高级查询就是`mdfind`命令自己支持的一些高级查询, 如`mdfind "kMDItemContentType=public.folder"`, 但是平心而论, 这些关键字实在是...一言难尽, 所以这些高级用法大家自己去找吧.

## 预览
目前可以对文本文件, 图片和文件夹进行预览

## 文本
![](https://s2.ax1x.com/2019/08/10/eO6bKe.png)

## 图片
![](https://s2.ax1x.com/2019/08/10/eO6XVA.png)

## 文件夹
![](https://s2.ax1x.com/2019/08/10/eOc9xS.png)

# 截图

![安装界面](https://s2.ax1x.com/2019/08/08/eHPtb9.png)

![主界面](https://s2.ax1x.com/2019/08/10/eOctG6.png)

![搜索界面](https://s2.ax1x.com/2019/08/10/eOc2z8.png)

![设置界面](https://s2.ax1x.com/2019/08/10/eOcWQS.png)
