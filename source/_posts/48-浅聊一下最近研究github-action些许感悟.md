---
title: 48.浅聊一下最近研究github action些许感悟
date: 2025-01-02 16:58:49
tags:
  - CI/CD
  - GitHub
---

### 聊聊起源

最近自己在随便折腾项目的时候，发现自己每次都需要手动部署网站实在是太麻烦了，  
每次都是一样的操作流程：本地构建、上传资源、重启服务...  
这一系列重复性的工作着实让人头大。

随着项目越来越多，这种重复性工作更是增加了不少负担。  
于是想着能不能将这些流程自动化起来，  
一番调研后发现了 GitHub Actions 这个神器，  
决定好好研究一番，解放双手。

<!-- more -->

### 简单 workflows

Actions 的工作流程文件（workflow）需要存放在项目的 `.github/workflows` 目录下，  
使用 YAML 格式定义。一个最基础的 workflow 如下：

```yaml
name: Basic Workflow

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16.x'
    - name: Install dependencies
      run: npm ci
    - name: Build project
      run: npm run build
```

这个简单的 workflow 会在每次推送到 main 分支时触发，  
执行检出代码、安装 Node.js、安装依赖和构建项目的步骤。  
非常简单，但已经能够满足很多基础需求了。

在实践中，我发现这些简单的 workflow 能够帮我解决约 80% 的自动化需求，  
比如自动运行测试、自动构建等。

### 使用 secrets 的 workflows

当需要在 workflow 中使用敏感信息（如服务器账号密码、API 密钥等）时，  
直接在 workflow 文件中明文编写这些信息显然是不安全的。  
这时候，GitHub 提供的 secrets 功能就派上用场了。

首先在项目的 Settings -> Secrets and variables -> Actions 中添加需要的密钥，  
然后在 workflow 中通过 `secrets` 上下文来访问：

```yaml
steps:
  - name: Deploy to server
    uses: appleboy/ssh-action@master
    with:
      host: ${{ secrets.SERVER_HOST }}
      username: ${{ secrets.SERVER_USERNAME }}
      key: ${{ secrets.SERVER_SSH_KEY }}
      script: |
        cd /path/to/project
        git pull
        npm install
        npm run build
```

这样就能在不暴露敏感信息的情况下，  
实现自动部署到服务器的功能，真的很方便。

### 可以页面主动触发的 workflows

有时候，我们需要手动触发 workflow，而不是等待代码推送或其他事件。  
GitHub Actions 提供了 `workflow_dispatch` 事件类型，允许从 GitHub 页面手动触发 workflow：

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
```

这样配置后，在 GitHub 仓库的 Actions 标签页中就能看到手动触发按钮，  
还可以传入自定义参数，非常灵活。

我发现这个功能特别适合那些不需要频繁执行，  
但偶尔需要手动触发的任务，比如将测试环境的代码部署到生产环境。

### 封装公共 workflows

随着使用的深入，我发现很多项目的 workflow 有大量相似之处。  
为了避免重复编写，GitHub Actions 提供了复用机制：composite actions 和 reusable workflows。

1. Composite Actions  
   将一组常用的步骤打包成一个可复用的 action：

```yaml
# .github/actions/build-and-test/action.yml
name: 'Build and Test'
description: '构建并测试项目'
runs:
  using: "composite"
  steps:
    - name: Install dependencies
      run: npm ci
      shell: bash
    - name: Run tests
      run: npm test
      shell: bash
```

2. Reusable Workflows  
   创建可在多个仓库间共享的 workflow：

```yaml
# .github/workflows/reusable-build.yml
name: Reusable build workflow
on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '16.x'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ...build steps
```

通过这种方式，我成功将多个项目中重复的 CI/CD 流程统一起来，  
大大减少了维护成本，也保证了各项目间 CI/CD 实践的一致性。

### 如何本地调试 workflows

GitHub Actions 的一大痛点是无法在本地直接调试，  
每次修改都需要提交到远程仓库才能看到效果，效率比较低。

经过一番探索，我找到了两种本地调试的方法：

1. 使用 [act](https://github.com/nektos/act) 工具  
   这是一个能在本地运行 GitHub Actions 的开源工具：
   (个人尝试失败了, 还得本地安装 Docker, 安装镜像啥的, 电脑硬盘太小了, 只能算了.)

```bash
# 安装
brew install act

# 在项目根目录运行
act
```

2. 使用 GitHub Actions 的 step debug 日志  
   在仓库中添加 secret `ACTIONS_STEP_DEBUG` 并设为 `true`，  
   这样 workflow 运行时会输出更详细的日志，有助于排查问题。

虽然这些方法无法完全替代远程运行，  
但在开发阶段可以帮助我们快速发现并解决一些基本问题，  
避免过多的远程测试提交。

### 后记

通过使用 GitHub Actions，我将很多原本需要手动操作的工作流程自动化了，  
极大地提高了开发效率，也减少了人为操作带来的错误。

从最初的简单构建部署，tar直接拽到服务器上；到现在的跨仓库复用、条件执行、手动触发等高级用法，  
GitHub Actions 为我提供了一个强大而又灵活的 CI/CD 工具。

当然，使用过程中也遇到了不少问题，比如运行时间限制、复杂工作流调试困难等，  
但总体来说，投入产出比非常高，值得每一位开发者去学习和使用。

最后分享一个小技巧：GitHub Actions 的 marketplace 有大量现成的 actions，  
很多常见需求都能找到对应的解决方案，不必重复造轮子。  
比如部署到 GitHub Pages、发布 npm 包、发送通知等，都有对应的 actions 可以直接使用。
