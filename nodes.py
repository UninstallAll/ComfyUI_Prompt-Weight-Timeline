import logging
import numpy as np
import json
import os
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PromptWeightCurveEditor:
    """提示词权重曲线编辑器节点"""
    
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "frames": ("INT", {"default": 30, "min": 1, "max": 1000}),
                "prompts_json": ("STRING", {
                    "multiline": True, 
                    "default": json.dumps([
                        {"prompt": "blue sky", "points": [[0, 0.5], [1, 1.5]], "curve_type": "bezier", "visible": True, "color": "#3498db"},
                        {"prompt": "clouds", "points": [[0, 1.0], [1, 0.5]], "curve_type": "bezier", "visible": True, "color": "#e74c3c"}
                    ], indent=2)
                }),
            },
            "optional": {
                "input_sequence_length": ("INT", {"default": 0, "min": 0, "max": 10000}),
            }
        }
    
    RETURN_TYPES = ("STRING", "STRING", )
    RETURN_NAMES = ("formatted_prompts", "prompts_json", )
    FUNCTION = "process"
    CATEGORY = "提示词工具"

    # 添加自定义UI标记，告诉前端此节点需要自定义UI
    CUSTOM_UI = True
    
    def process(self, frames, prompts_json, input_sequence_length=0):
        """处理提示词权重曲线数据并生成格式化的提示词序列"""
        try:
            # 如果提供了输入序列长度且大于0，使用它作为帧数
            if input_sequence_length > 0:
                frames = input_sequence_length
                
            # 解析JSON中的提示词和曲线数据
            prompts_data = json.loads(prompts_json)
            
            # 存储每一帧的提示词和权重
            frame_prompts = []
            for frame_idx in range(frames):
                frame_t = frame_idx / (frames - 1) if frames > 1 else 0
                frame_prompts.append([])
                
                # 计算每个提示词在当前帧的权重
                for prompt_data in prompts_data:
                    if not prompt_data.get("visible", True):
                        continue
                        
                    prompt_text = prompt_data.get("prompt", "")
                    points = prompt_data.get("points", [])
                    curve_type = prompt_data.get("curve_type", "linear")
                    
                    if not points:
                        continue
                        
                    # 计算权重
                    weight = self._calculate_weight(frame_t, points, curve_type)
                    frame_prompts[-1].append({"text": prompt_text, "weight": weight})
            
            # 生成格式化的提示词序列
            formatted_output = self._format_prompt_string(frame_prompts)
            
            return (formatted_output, prompts_json)
            
        except Exception as e:
            logger.error(f"处理提示词权重曲线数据时出错: {str(e)}")
            return ("", prompts_json)
    
    def _calculate_weight(self, t, points, curve_type="linear"):
        """计算给定时间点的权重值"""
        # 按x坐标排序点
        sorted_points = sorted(points, key=lambda p: p[0])
        
        # 如果没有点或只有一个点，返回默认值或单点值
        if not sorted_points:
            return 1.0
        elif len(sorted_points) == 1:
            return sorted_points[0][1]
        
        # 找到t所在的区间
        left_idx = 0
        right_idx = 0
        for i in range(len(sorted_points) - 1):
            if sorted_points[i][0] <= t <= sorted_points[i+1][0]:
                left_idx = i
                right_idx = i + 1
                break
        
        # 如果t在范围外，使用边界值
        if t <= sorted_points[0][0]:
            return sorted_points[0][1]
        elif t >= sorted_points[-1][0]:
            return sorted_points[-1][1]
        
        # 获取区间端点
        x0, y0 = sorted_points[left_idx]
        x1, y1 = sorted_points[right_idx]
        
        # 计算区间内的相对位置
        if x1 - x0 == 0:
            local_t = 0
        else:
            local_t = (t - x0) / (x1 - x0)
        
        # 根据曲线类型计算权重
        if curve_type == "linear":
            # 线性插值
            return y0 + local_t * (y1 - y0)
        elif curve_type == "bezier":
            # 简单的缓入缓出曲线
            local_t = 3 * local_t**2 - 2 * local_t**3
            return y0 + local_t * (y1 - y0)
        elif curve_type == "step":
            # 阶梯函数
            return y0 if local_t < 0.5 else y1
        else:
            # 默认线性
            return y0 + local_t * (y1 - y0)
    
    def _format_prompt_string(self, frame_prompts):
        """将提示词权重数据格式化为字符串"""
        result = []
        
        for i, prompts in enumerate(frame_prompts):
            if not prompts:
                result.append(f"({i}:empty:1.0)")
                continue
                
            frame_parts = []
            for p in prompts:
                # 确保权重值格式化为一位小数
                weight = round(p["weight"], 1)
                frame_parts.append(f"{p['text']}:{weight}")
            
            # 将同一帧的所有提示词合并
            joined_prompts = ", ".join(frame_parts)
            result.append(f"({i}:{joined_prompts})")
        
        # 将所有帧组合在一起
        return "\n".join(result)

# 注册节点
NODE_CLASS_MAPPINGS = {
    "PromptWeightCurveEditor": PromptWeightCurveEditor
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptWeightCurveEditor": "提示词权重曲线编辑器"
} 