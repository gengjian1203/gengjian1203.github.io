---
title: 31.记录几个操作git仓库的命令
date: 2022-04-09 23:34:34
tags:
  - git
---

### 运用背景

正常情况下，我们的项目只会跟一个仓库关联，  
然后对这个仓库的分支进行拉去，推送等操作。

可是开发过程中，总会有些奇葩的场景。  
比如：  
代码需要统一迁移到一个 group 下，  
再比如：  
代码需要同步推送到另一个仓库的分支，  
通过 sonar 来扫代码计(keng)算(die)代码量。

在这里也十分感谢组内大佬分享。  
我记录下来，以防后续还会有这种奇葩情况发生。

<!-- more -->

### 仓库迁移其他 group 方法

1. 本地新建一个 mirrorGit 目录，用于存放需要迁移项目的临时目录。

```bash
mkdir mirrorGit
```

2. 进入 mirrorGit 目录后，将待迁移的仓库 clone 到本地

```bash
git clone --mirror https://github.com/gengjian1203/module-test.git
```

3. 进入该目录

```bash
cd module-test.git
```

4. 设置要即将迁移的仓库地址(需要提前将仓库建好)

```bash
git remote set-url --push origin https://github.com/gengjian0312/module-test.git
```

5. 获取老仓库的代码

```bash
git fetch -p origin
```

6. 将代码推送到新仓库

```bash
git push --mirror
```

7. 后续如果老仓库代码还有更新  
   只需要再次执行 5、6 两个步骤，  
   即可再次同步将老仓库代码推送到新仓库。

最后总结一下，这波操作最后的核心就是：  
代码拉取操作是会向老仓库发起请求拉取，  
代码推送则会向新仓库发起推送。  
而这个本地临时项目就是一个中转站搬运工的作用~

```bash
git remote -v
origin	https://github.com/gengjian1203/module-test.git (fetch)
origin	https://github.com/gengjian0312/module-test.git (push)
```

### 修改代码同步推送到其他仓库的分支

1. 进入项目，将本地代码新增绑定另一个仓库的地址

```bash
git remote add origin-0312 https://github.com/gengjian0312/module-test.git
```

2. 查看项目绑定状态

```bash
git remote -v

origin-0312	https://github.com/gengjian0312/module-test.git (fetch)
origin-0312	https://github.com/gengjian0312/module-test.git (push)
origin	https://github.com/gengjian1203/module-test.git (fetch)
origin	https://github.com/gengjian1203/module-test.git (push)
```

3. 从老仓库拉取代码

```bash
git pull origin master
```

4. 将代码同步推送到新绑定的仓库

```bash
git push origin-0312 master
```

### 后记

后续有复杂的 git 管理需求，同步记录下来。
