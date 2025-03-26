# GitHub上传准备指南

在上传此插件到您自己的GitHub仓库前，请完成以下步骤：

## 1. 个人信息替换

在以下文件中替换占位符信息：

### README.md
- 替换 `yourusername` 为您的GitHub用户名
- 更新预览图路径

### setup.py
- 填写您的姓名和电子邮件
- 更新GitHub仓库URL

### LICENSE
- 更新版权信息中的名称和年份

## 2. 创建预览图像

1. 在ComfyUI中安装并运行此插件
2. 截取曲线编辑器界面的屏幕截图
3. 保存截图到 `examples/images/preview.jpg`
4. 在README.md中更新图片路径

## 3. 清理临时文件

发布前删除以下文件：
- 此文件(UPLOAD_GUIDE.md)
- 任务清单.md
- 环境配置任务清单.md
- 当前进度总结.md
- 需求文档.md
- .cursor/目录（如存在）
- .vscode/目录（如不需要）

## 4. 创建GitHub仓库

1. 登录GitHub
2. 创建新仓库，命名为 `ComfyUI_Prompt-Weight-Timeline`
3. 不要添加README、.gitignore或LICENSE（我们已经有了）
4. 运行以下命令上传代码：

```bash
git remote add origin https://github.com/您的用户名/ComfyUI_Prompt-Weight-Timeline.git
git branch -M main
git push -u origin main
```

## 5. 检查发布

上传后检查：
- README是否正确显示
- 预览图是否可见
- 安装说明是否清晰

## 6. 测试安装

按照自己的安装指南，在新环境中测试插件安装，确保一切正常工作。

---

完成上述步骤后，您的插件将准备好与ComfyUI社区分享！ 