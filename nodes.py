import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PromptWeightTimeline:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "prompt": ("STRING", {"multiline": True, "default": "基本提示词"}),
                "frames": ("INT", {"default": 30, "min": 1, "max": 1000}),
                "start_weight": ("FLOAT", {"default": 1.0, "min": 0.0, "max": 5.0, "step": 0.1}),
                "end_weight": ("FLOAT", {"default": 1.0, "min": 0.0, "max": 5.0, "step": 0.1})
            },
            "optional": {
                "transition_type": (["线性", "平滑", "阶梯"], {"default": "线性"})
            }
        }
    
    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("timed_prompt",)
    FUNCTION = "process"
    CATEGORY = "提示词动画"
    
    def process(self, prompt, frames, start_weight, end_weight, transition_type="线性"):
        logger.info(f"处理提示词动画: {frames}帧, 从{start_weight}到{end_weight}, 过渡类型: {transition_type}")
        
        # 简单实现，后续会完善
        if transition_type == "线性":
            # 线性插值
            timed_prompt = ""
            for i in range(frames):
                weight = start_weight + (end_weight - start_weight) * (i / (frames - 1)) if frames > 1 else start_weight
                timed_prompt += f"({i}:{prompt}:{weight:.1f}),"
            
            # 去掉最后一个逗号
            timed_prompt = timed_prompt[:-1]
            return (timed_prompt,)
        else:
            # 暂时所有类型都使用线性
            logger.info(f"过渡类型 '{transition_type}' 暂未实现，使用线性过渡")
            timed_prompt = ""
            for i in range(frames):
                weight = start_weight + (end_weight - start_weight) * (i / (frames - 1)) if frames > 1 else start_weight
                timed_prompt += f"({i}:{prompt}:{weight:.1f}),"
            
            # 去掉最后一个逗号
            timed_prompt = timed_prompt[:-1]
            return (timed_prompt,)

NODE_CLASS_MAPPINGS = {
    "PromptWeightTimeline": PromptWeightTimeline
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptWeightTimeline": "提示词权重时间线"
} 