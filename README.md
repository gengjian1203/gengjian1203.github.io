# 个人博客网站

这是我的个人博客网站源码，使用 Hexo 框架搭建。

## 仓库分支说明

- **hexo-source**: 博客源码分支，包含 Hexo 配置、Markdown 文章等源文件
- **master**: 由 GitHub Actions 自动部署的静态网站文件，用于 GitHub Pages 展示

## 部署方式

本博客有两种部署方式：

1. **GitHub Pages 部署**：

   - 静态网站文件会被自动部署到 master 分支
   - 通过 https://gengjian1203.github.io 访问

2. **阿里云服务器部署**：
   - 静态网站文件会被自动部署到阿里云服务器

## 环境说明

本项目支持两种环境部署：

1. **UAT 环境（测试环境）**：

   - 当推送代码到`hexo-source`分支时自动部署
   - 部署目录：`uat/gengjian1203`
   - 配置文件：`_config_Web.yml`

2. **PROD 环境（生产环境）**：
   - 需要通过 GitHub Actions 手动触发并选择 prod 环境
   - 部署目录：`gengjian1203`
   - 配置文件：`_config_Master.yml`

## 自动部署

本仓库使用 GitHub Actions 实现自动部署，具体触发方式：

1. **推送代码到 hexo-source 分支**：

   - 推送后会自动触发构建和部署到 UAT 环境

2. **手动触发部署**：
   - 在 GitHub 仓库 Actions 页面手动触发"Deploy Blog"工作流
   - 可选择部署环境（UAT 或 PROD）
   - 可选择部署目标（GitHub Pages 和/或阿里云服务器）

## GitHub Actions 配置说明

有关 GitHub Actions 所需的 Secrets 配置，请参考 [README_GITHUB_ACTIONS_SECRETS.md](./README_GITHUB_ACTIONS_SECRETS.md)

## 本地开发

Node Version: 18.18.0

```bash
# 安装依赖
npm install

# 本地预览
npm run server

# 生成静态文件
npm run build

# 部署（使用脚本部署）
npm run upload
```

## 常用命令

```bash
# 创建新文章
hexo new "文章标题"

# 创建新页面
hexo new page "页面名称"

# 清理缓存
hexo clean
```

## 主题

使用的是 Next 主题，配置文件位于 `themes/next/_config.yml`

## 许可证

MIT
