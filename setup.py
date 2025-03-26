from setuptools import setup, find_packages

setup(
    name="comfyui_prompt_weight_timeline",
    version="0.1.0",
    description="A ComfyUI node for editing prompt weight animations with curves",
    author="Your Name",
    author_email="your.email@example.com",
    url="https://github.com/yourusername/ComfyUI_Prompt-Weight-Timeline",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.22.0",
        "pillow>=9.0.0"
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
) 