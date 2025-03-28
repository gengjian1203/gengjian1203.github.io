# GitHub Actions Secrets 配置说明

为了使博客自动部署功能正常工作，需要在 GitHub 仓库中配置以下 Secrets:

## 在 GitHub 仓库中配置 Secrets

1. 进入 GitHub 仓库页面
2. 点击 "Settings" 选项卡
3. 左侧菜单中选择 "Secrets and variables" -> "Actions"
4. 点击 "New repository secret" 按钮添加以下 Secrets

## 需要配置的 Secrets

### 阿里云服务器相关

```
SSH_HOST: 阿里云服务器IP地址
SSH_PORT: SSH端口，通常为22
SSH_USERNAME: SSH用户名
SSH_KEY: SSH私钥内容（不是文件路径，是私钥内容）
SERVER_HTML: 网站部署目录，例如 /var/www/html
SERVER_BACKUP_PATH: 备份文件临时存放目录，例如 /tmp
```

### 获取 SSH 私钥

如果尚未生成 SSH 密钥对，可以按照以下步骤操作：

1. 在本地终端执行：`ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
2. 将生成的公钥（通常是`~/.ssh/id_rsa.pub`）的内容添加到阿里云服务器的`~/.ssh/authorized_keys`文件中
3. 将私钥（通常是`~/.ssh/id_rsa`）的完整内容复制到 GitHub 的`SSH_KEY` Secret 中

## 配置 GITHUB_TOKEN

`GITHUB_TOKEN` 无需手动创建，GitHub Actions 会自动提供这个 secret 以用于访问仓库。

## 工作流功能说明

在设置好以上 Secrets 后，每当有新的变更推送到`hexo-source`分支，或者手动触发工作流时，将会：

1. **部署到 Master 分支**：会将 Hexo 生成的静态网站文件推送到仓库的 master 分支，以便 GitHub Pages 展示
2. **部署到阿里云**：会将 Hexo 生成的静态网站文件上传到阿里云服务器指定目录

## 环境部署说明

本工作流支持两种环境的部署：

### UAT 环境（测试环境）

- 当推送代码到`hexo-source`分支时，会自动部署到 UAT 环境
- 部署到阿里云服务器的文件夹名为：`uat/gengjian1203`
- 使用`_config_Web.yml`配置文件

### PROD 环境（生产环境）

- 需要手动在 GitHub Actions 界面选择触发，并选择"prod"环境
- 部署到阿里云服务器的文件夹名为：`gengjian1203`
- 使用`_config_Master.yml`配置文件

## 手动触发部署

除了通过推送代码触发部署外，还可以手动触发：

1. 进入 GitHub 仓库页面
2. 点击"Actions"选项卡
3. 左侧选择"Deploy Blog"工作流
4. 点击"Run workflow"
5. 选择部署环境（`uat`或`prod`）
6. 选择需要执行的部署类型（可选择只部署到 master 或只部署到阿里云）
7. 点击"Run workflow"按钮开始部署

## 注意事项

- 确保阿里云服务器防火墙允许从 GitHub Actions 的 IP 地址范围访问 SSH 端口
- 定期检查日志，确保部署过程正常
- UAT 和 PROD 环境使用不同文件夹，可以避免环境冲突
- 如果遇到问题，请查看 Actions 日志了解详细错误信息
