# 提示词权重曲线编辑器 (Prompt Weight Curve Editor)

这是一个用于ComfyUI的节点插件，可以通过曲线编辑器界面来控制不同提示词在动画过程中的权重变化。类似于After Effects或Photoshop中的关键帧曲线编辑器，让您能够精确控制AI生成视频中提示词的权重变化。

![预览图](https://github.com/yourusername/ComfyUI_Prompt-Weight-Timeline/raw/main/examples/preview.jpg)

## 功能特点

- 支持多个提示词的权重曲线编辑
- 直观的可视化曲线编辑界面
- 支持多种曲线类型：线性、贝塞尔曲线、阶梯式
- 实时预览权重变化效果
- 可添加和拖动控制点精确调整曲线形状
- 支持缩放和平移视图
- 自定义提示词颜色，便于区分多个曲线
- 可导出为与其他节点兼容的格式

## 安装方法

### 方法1：通过Git安装（推荐）

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/yourusername/ComfyUI_Prompt-Weight-Timeline.git
cd ComfyUI_Prompt-Weight-Timeline
pip install -r requirements.txt
```

### 方法2：下载ZIP安装

1. 下载此仓库的ZIP文件
2. 解压到`ComfyUI/custom_nodes/`目录
3. 安装依赖: `pip install -r requirements.txt`

### 依赖项

本插件依赖于以下Python库:
- numpy >= 1.22.0
- pillow >= 9.0.0

## 使用方法

1. 启动ComfyUI
2. 在节点浏览器中搜索"提示词权重曲线编辑器"
3. 将节点添加到您的工作流中

### 基本操作

- **添加提示词**: 点击"添加提示词"按钮
- **删除提示词**: 选择提示词后点击"删除提示词"按钮
- **添加控制点**: 双击曲线上的位置
- **移动控制点**: 点击控制点并拖动
- **选择提示词**: 点击提示词的任意控制点
- **缩放视图**: 使用鼠标滚轮
- **平移视图**: 在空白处按住鼠标左键并拖动

### 曲线类型

插件支持多种曲线类型，适合不同的权重变化需求:
- **线性**: 直线连接各控制点，适合均匀变化
- **贝塞尔**: 平滑曲线过渡，适合自然渐变效果
- **阶梯**: 突变式变化，适合明确的场景切换

## 示例工作流

插件包含示例工作流，展示了基本用法:
1. 打开ComfyUI
2. 右键点击 -> Load -> 选择 `examples/basic_prompt_animation.json`

## 输出格式

节点生成格式化的提示词权重序列，可以直接与文本提示节点连接:

```
(0:蓝天:0.5, 白云:1.0, 山脉:0.2)
(1:蓝天:0.6, 白云:0.9, 山脉:0.3)
...
```

## 高级用法

- 结合AnimateDiff等动画插件创建复杂动画效果
- 使用多个曲线编辑器节点级联，控制不同参数组
- 结合ControlNet实现动态控制的图像生成

## 问题排查

- **问题**: 节点不显示在ComfyUI中
  **解决方案**: 确保插件安装在正确的目录，并重启ComfyUI

- **问题**: 曲线编辑器界面不显示
  **解决方案**: 检查浏览器控制台错误信息，可能需要清除浏览器缓存

- **问题**: 提示词权重不正确
  **解决方案**: 确保控制点在有效范围内(时间0-1，权重0-5)

## 贡献

欢迎提交问题和功能请求! 如有任何建议或改进，请提交PR或创建Issue。

## 许可证

MIT

## 联系方式

如有问题或建议，请提交issue或联系：youremail@example.com
