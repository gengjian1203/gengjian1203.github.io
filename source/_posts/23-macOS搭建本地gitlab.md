---
title: 23.macOS本地搭建gitlab服务
date: 2021-01-23 13:25:27
tags:
  - git
---

### 搭建背景

有时候想要调试一些公司的项目，  
不过公司的项目是没有办法传到 github 上的。  
以免有泄漏的风险。  
可是还需要借助 git 来管理，  
于是乎，就诞生了本地搭建 gitlab 的想法。

另外，gitlab 还是功能蛮强大的，  
拥有完善的权限管理系统，  
集成 wiki 等相关功能，  
以及具备 CI 持续集成、CD 持续部署等功能。  
正好也借此机会玩一玩 gitlab ，完善一下自身搭建团队的技能树。

<!-- more -->

### 配置步骤

由于 gitlab 只能在 Linux 内核环境下部署。  
手上也只有一台 MacBook 老爷机，  
只好在上面再按照一个沙盒（虚拟机）了。

1. 下载`Docker Desktop`。  
   市面上大部分教程都是推荐使用`Docker Desktop`。  
   页面集成化界面操作，已经相对之前部署容易了很多。  
   并且注册一个`Docker Hub`账号。

2. 下载`gitlab-ce`。  
   在仓库找到 gitlab-ce 并下载。 [https://hub.docker.com/r/gitlab/gitlab-ce](https://hub.docker.com/r/gitlab/gitlab-ce)  
   不过网上教程有一键下载的方式，不过我没有找到，最后还是通过命令行给安装上了。

   ```
   docker pull gitlab/gitlab-ce
   ```

   大概 800MB 大小，干脆挂机一宿下载完的。

3. 配置`gitlab`

   一早起来，就看到`Docker Desktop`的`Containers`里面已经静静的躺着个`gitlab/gitlab-ce`。  
   接下来就是按照教程配置 gitlab。  
   自带的 UI 页面有配置，不过依旧没有搞懂。  
   还是用命令行配置最简单。

   ```
   sudo docker run -d \
    --hostname xxx.gitlab.com \
    --name gitlab \
    --restart always \
    --publish 22:22 --publish 80:80 --publish 443:443 \
    --volume /Users/xxx/gitlab/config:/etc/gitlab \
    --volume /Users/xxx/gitlab/logs:/var/log/gitlab \
    --volume /Users/xxx/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest
   ```

4. 登录 gitlab  
   此刻通过浏览器输入：[http://localhost:80/](http://localhost:80/)，即可到登录页面。  
   第一次登录会让你输入超级管理员的密码。  
   账号：root。
   这个账号是最高权限。可以通过这个账号对 gitlab 配置一切。

5. 注册 gitlab 账号  
   不过我们也不能一直用着 root 就去开发。  
   那也也未免太过霸气侧漏了。  
   我们还是需要注册一个自己开发用的账号。  
   让我们退出登录。  
   在刚刚登录页面重新注册一个属于自己的账号、密码、邮箱。  
   此时这个账号注册还不能被使用登录。  
   我们需要通过 root 账户，对刚刚注册的账号进行授权通过，  
   这样新注册的账号才能被使用。

6. 配置 SSH-KEY  
   新账号在登录之后，需要配置 git 公钥。
   通过命令行

   ```
   ssh-keygen -t rsa -C "xxx@mail.com"
   ```

   在`.ssh/`目录下会生成两个文件`id_rsa.pub`和`id_rsa`，  
   我们需要将`id_rsa.pub`文件内的内容复制到 gitlab 中 `SSH-KEY`输入框中即可。

7. 搭建仓库  
   新建仓库，然后本地代码跟仓库相关联，跟 github 很相似了。在这里就不再赘述了。

### 踩坑相关

1. 下载`gitlab-ce`真的是太慢了。  
   估计镜像资源也不怎么好。

2. 登录 gitlab 的时候报错 502。  
   这个问题纠结了好久。  
   网上说的大部分情况都是端口冲突。  
   又是杀进程，又是改配置的，结果并没起作用。

   最后想到，可能我是通过 docker 配置的 gitlab。  
   应该是给 docker 分配的资源太少，导致的报错。  
   解决方法是：  
   在 docker 的`设置(Preferences)`->`Resource`->`ADVANCED`。  
   将`Swap`调整到了 `3GB`。  
   不过为了保险起见，其他硬件参数也都调高一些。  
   将`Memory`调整到了 `3.00GB`

### 后记

本来以为是一个很简单的事情，  
结果也折腾来折腾去的搞了大半天。  
不过终于搭建好仓库的时候，  
还是很嗨皮的。  
接下来有时间的时候可以好好玩一玩 CI 了~

### 参考资料

1. [在 mac 上使用 docker 部署 gitlab](http://billqiu.github.io/2016/07/08/%E5%9C%A8mac%E4%B8%8A%E4%BD%BF%E7%94%A8docker%E9%83%A8%E7%BD%B2gitlab/)
2. [基于 Docker 在 Mac OS X 系统中的部署和设置 GitLab](http://comdyn.hy.tsinghua.edu.cn/from-web/mac-os/570-docker-gitlat)
3. [Docker gitlab 502 解决办法](https://blog.csdn.net/rex1129/article/details/110119830)
4. [自建 gitlab 服务器以及出现 502 错误解决方案](https://blog.csdn.net/ianly123/article/details/82984736)
5. [调整 git 仓库的连接地址](https://blog.csdn.net/top_code/article/details/50381432)
6. [多个 git 账号的 SSH 配置](https://www.cnblogs.com/micrari/p/5659036.html)
