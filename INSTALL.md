# 提示词权重曲线编辑器安装指南

本文档提供了详细的安装步骤，帮助您在ComfyUI中安装和使用提示词权重曲线编辑器插件。

## 系统要求

- ComfyUI（最新版本）
- Python 3.8+
- 足够的显存运行Stable Diffusion模型

## 安装步骤

### 方法1：通过Git安装（推荐）

1. 打开命令行终端
2. 导航到ComfyUI的custom_nodes目录:
   ```bash
   cd 路径/到/ComfyUI/custom_nodes
   ```

3. 克隆仓库:
   ```bash
   git clone https://github.com/yourusername/ComfyUI_Prompt-Weight-Timeline.git
   ```

4. 进入插件目录:
   ```bash
   cd ComfyUI_Prompt-Weight-Timeline
   ```

5. 安装依赖:
   ```bash
   pip install -r requirements.txt
   ```

### 方法2：通过ZIP文件安装

1. 从GitHub上下载ZIP文件
   - 访问 https://github.com/yourusername/ComfyUI_Prompt-Weight-Timeline
   - 点击 "Code" 按钮，然后选择 "Download ZIP"

2. 解压ZIP文件到ComfyUI的custom_nodes目录:
   ```
   ComfyUI/
   └── custom_nodes/
       └── ComfyUI_Prompt-Weight-Timeline/
           ├── __init__.py
           ├── nodes.py
           └── ...
   ```

3. 打开命令行终端，进入插件目录:
   ```bash
   cd 路径/到/ComfyUI/custom_nodes/ComfyUI_Prompt-Weight-Timeline
   ```

4. 安装依赖:
   ```bash
   pip install -r requirements.txt
   ```

### 方法3：通过pip安装

```bash
pip install git+https://github.com/yourusername/ComfyUI_Prompt-Weight-Timeline.git
```

## 验证安装

1. 启动或重启ComfyUI
2. 在节点浏览器中搜索"提示词权重曲线编辑器"
3. 如果能找到并添加该节点，则表示安装成功

## 问题排查

如果您遇到安装问题:

1. 确保您的ComfyUI是最新版本
2. 检查Python版本是否兼容（3.8+）
3. 确认所有依赖已正确安装
4. 检查浏览器控制台是否有JavaScript错误

如果问题仍然存在，请在GitHub上创建issue，提供以下信息:
- 操作系统版本
- Python版本
- ComfyUI版本
- 错误信息或日志

## 更新插件

要更新到最新版本:

```bash
cd 路径/到/ComfyUI/custom_nodes/ComfyUI_Prompt-Weight-Timeline
git pull
pip install -r requirements.txt
``` 