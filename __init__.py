import os
import folder_paths

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}

# 导入本插件的主要节点
from .nodes import PromptWeightCurveEditor

# 注册节点
NODE_CLASS_MAPPINGS["PromptWeightCurveEditor"] = PromptWeightCurveEditor
NODE_DISPLAY_NAME_MAPPINGS["PromptWeightCurveEditor"] = "提示词权重曲线编辑器"

# 声明插件所需变量
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']

# 注册Web目录
WEB_DIRECTORY = "./web"
__file__ = os.path.realpath(__file__)
JS_DIRECTORY = os.path.join(os.path.dirname(os.path.dirname(__file__)), "js")

def get_ext_dir(subpath=None, mkdir=False):
    ext_dir = os.path.dirname(__file__)
    if subpath:
        ext_dir = os.path.join(ext_dir, subpath)
    if mkdir and not os.path.exists(ext_dir):
        os.makedirs(ext_dir)
    return ext_dir

# 复制JavaScript文件到web目录
def copy_js_files():
    import shutil
    web_dir = get_ext_dir(WEB_DIRECTORY, True)
    js_dir = get_ext_dir("js")
    
    for file in os.listdir(js_dir):
        if file.endswith(".js"):
            src_file = os.path.join(js_dir, file)
            dst_file = os.path.join(web_dir, file)
            shutil.copy2(src_file, dst_file)
            print(f"Copied {file} to web directory")
    
# 在插件加载时复制JS文件
copy_js_files() 