import { app } from "../../../scripts/app.js";
import { api } from "../../../scripts/api.js";

// 曲线编辑器类
class CurveEditor {
    constructor(node, container) {
        this.node = node;
        this.container = container;
        
        // 创建canvas元素
        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.style.border = "1px solid #333";
        this.ctx = this.canvas.getContext("2d");
        
        // 添加到容器
        this.container.appendChild(this.canvas);
        
        // 曲线数据
        this.prompts = [];
        this.selectedPromptIndex = -1;
        this.selectedPointIndex = -1;
        
        // 视图状态
        this.viewState = {
            offsetX: 0,
            offsetY: 0,
            scale: 1,
            dragging: false,
            lastX: 0,
            lastY: 0
        };
        
        // 网格设置
        this.gridSettings = {
            majorLineInterval: 0.2,
            minorLineInterval: 0.05,
            majorLineColor: "#444",
            minorLineColor: "#333",
            majorLineWidth: 1,
            minorLineWidth: 0.5
        };
        
        // 初始化交互事件
        this.initEvents();
        
        // 添加控制UI
        this.createControls();
        
        // 尝试加载数据
        this.loadPromptsFromNode();
        
        // 首次渲染
        this.render();
    }
    
    // 加载节点数据
    loadPromptsFromNode() {
        try {
            // 从节点输入获取JSON
            const promptsJson = this.node.widgets.find(w => w.name === "prompts_json");
            if (promptsJson && promptsJson.value) {
                this.prompts = JSON.parse(promptsJson.value);
                console.log("加载了提示词数据:", this.prompts);
            }
        } catch (error) {
            console.error("加载提示词数据失败:", error);
        }
    }
    
    // 保存数据到节点
    savePromptsToNode() {
        try {
            const promptsJson = this.node.widgets.find(w => w.name === "prompts_json");
            if (promptsJson) {
                promptsJson.value = JSON.stringify(this.prompts, null, 2);
                if (typeof promptsJson.callback === "function") {
                    promptsJson.callback(promptsJson.value);
                }
            }
        } catch (error) {
            console.error("保存提示词数据失败:", error);
        }
    }
    
    // 创建编辑器控件
    createControls() {
        const controlsDiv = document.createElement("div");
        controlsDiv.style.marginTop = "10px";
        controlsDiv.style.display = "flex";
        controlsDiv.style.gap = "10px";
        
        // 添加提示词按钮
        const addPromptBtn = document.createElement("button");
        addPromptBtn.textContent = "添加提示词";
        addPromptBtn.onclick = () => this.addPrompt();
        
        // 删除提示词按钮
        const deletePromptBtn = document.createElement("button");
        deletePromptBtn.textContent = "删除提示词";
        deletePromptBtn.onclick = () => this.deleteSelectedPrompt();
        
        // 加入控件
        controlsDiv.appendChild(addPromptBtn);
        controlsDiv.appendChild(deletePromptBtn);
        
        this.container.appendChild(controlsDiv);
    }
    
    // 添加新提示词
    addPrompt() {
        // 生成随机颜色
        const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        
        // 创建新提示词
        const newPrompt = {
            prompt: "新提示词" + (this.prompts.length + 1),
            points: [[0, 1.0], [1, 1.0]],  // 默认水平线
            curve_type: "bezier",
            visible: true,
            color: randomColor
        };
        
        this.prompts.push(newPrompt);
        this.selectedPromptIndex = this.prompts.length - 1;
        this.savePromptsToNode();
        this.render();
    }
    
    // 删除选中的提示词
    deleteSelectedPrompt() {
        if (this.selectedPromptIndex >= 0 && this.selectedPromptIndex < this.prompts.length) {
            this.prompts.splice(this.selectedPromptIndex, 1);
            this.selectedPromptIndex = -1;
            this.selectedPointIndex = -1;
            this.savePromptsToNode();
            this.render();
        }
    }
    
    // 初始化交互事件
    initEvents() {
        // 鼠标按下
        this.canvas.addEventListener("mousedown", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 检查是否点击了控制点
            const clickResult = this.checkPointClick(x, y);
            if (clickResult.promptIndex !== -1) {
                this.selectedPromptIndex = clickResult.promptIndex;
                this.selectedPointIndex = clickResult.pointIndex;
                this.viewState.dragging = true;
                this.render();
            } else {
                // 开始拖动视图
                this.viewState.dragging = true;
                this.viewState.lastX = x;
                this.viewState.lastY = y;
            }
        });
        
        // 鼠标移动
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.viewState.dragging) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.selectedPointIndex !== -1 && this.selectedPromptIndex !== -1) {
                // 移动控制点
                const worldPos = this.screenToWorld(x, y);
                
                // 限制在0-1范围内
                worldPos.x = Math.max(0, Math.min(1, worldPos.x));
                // 限制权重在0-5范围内
                worldPos.y = Math.max(0, Math.min(5, worldPos.y));
                
                // 更新点坐标
                this.prompts[this.selectedPromptIndex].points[this.selectedPointIndex] = [worldPos.x, worldPos.y];
                this.savePromptsToNode();
            } else {
                // 移动视图
                const dx = x - this.viewState.lastX;
                const dy = y - this.viewState.lastY;
                this.viewState.offsetX += dx / this.viewState.scale;
                this.viewState.offsetY += dy / this.viewState.scale;
                this.viewState.lastX = x;
                this.viewState.lastY = y;
            }
            
            this.render();
        });
        
        // 鼠标抬起
        this.canvas.addEventListener("mouseup", () => {
            this.viewState.dragging = false;
        });
        
        // 鼠标离开
        this.canvas.addEventListener("mouseleave", () => {
            this.viewState.dragging = false;
        });
        
        // 鼠标滚轮缩放
        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 缩放因子
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            
            // 在鼠标位置缩放
            const worldPos = this.screenToWorld(x, y);
            this.viewState.scale *= factor;
            
            // 调整偏移以保持鼠标下的点不变
            const newWorldPos = this.screenToWorld(x, y);
            this.viewState.offsetX += worldPos.x - newWorldPos.x;
            this.viewState.offsetY += worldPos.y - newWorldPos.y;
            
            this.render();
        });
        
        // 双击添加点
        this.canvas.addEventListener("dblclick", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (this.selectedPromptIndex !== -1) {
                const worldPos = this.screenToWorld(x, y);
                
                // 限制在0-1范围内
                worldPos.x = Math.max(0, Math.min(1, worldPos.x));
                // 限制权重在0-5范围内
                worldPos.y = Math.max(0, Math.min(5, worldPos.y));
                
                // 添加新点
                const points = this.prompts[this.selectedPromptIndex].points;
                points.push([worldPos.x, worldPos.y]);
                
                // 按x坐标排序
                points.sort((a, b) => a[0] - b[0]);
                
                // 找到新添加点的索引
                this.selectedPointIndex = points.findIndex(p => p[0] === worldPos.x && p[1] === worldPos.y);
                
                this.savePromptsToNode();
                this.render();
            }
        });
    }
    
    // 检查是否点击了控制点
    checkPointClick(screenX, screenY) {
        const hitRadius = 10; // 点击判定半径
        
        for (let i = 0; i < this.prompts.length; i++) {
            if (!this.prompts[i].visible) continue;
            
            const points = this.prompts[i].points;
            for (let j = 0; j < points.length; j++) {
                const worldX = points[j][0];
                const worldY = points[j][1];
                const screenPos = this.worldToScreen(worldX, worldY);
                
                const distance = Math.sqrt(
                    Math.pow(screenPos.x - screenX, 2) + 
                    Math.pow(screenPos.y - screenY, 2)
                );
                
                if (distance <= hitRadius) {
                    return { promptIndex: i, pointIndex: j };
                }
            }
        }
        
        return { promptIndex: -1, pointIndex: -1 };
    }
    
    // 世界坐标转屏幕坐标
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX + this.viewState.offsetX) * this.viewState.scale,
            y: this.canvas.height - (worldY + this.viewState.offsetY) * this.viewState.scale
        };
    }
    
    // 屏幕坐标转世界坐标
    screenToWorld(screenX, screenY) {
        return {
            x: screenX / this.viewState.scale - this.viewState.offsetX,
            y: (this.canvas.height - screenY) / this.viewState.scale - this.viewState.offsetY
        };
    }
    
    // 渲染曲线编辑器
    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制背景
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(0, 0, width, height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制坐标轴
        this.drawAxes();
        
        // 绘制曲线
        this.drawCurves();
        
        // 绘制控制点
        this.drawControlPoints();
    }
    
    // 绘制网格
    drawGrid() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.save();
        
        // 主要网格线 (0.2为间隔)
        ctx.strokeStyle = this.gridSettings.majorLineColor;
        ctx.lineWidth = this.gridSettings.majorLineWidth;
        
        for (let x = 0; x <= 1; x += this.gridSettings.majorLineInterval) {
            const screenX = this.worldToScreen(x, 0).x;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= 5; y += this.gridSettings.majorLineInterval) {
            const screenY = this.worldToScreen(0, y).y;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
        }
        
        // 次要网格线 (0.05为间隔)
        ctx.strokeStyle = this.gridSettings.minorLineColor;
        ctx.lineWidth = this.gridSettings.minorLineWidth;
        
        for (let x = 0; x <= 1; x += this.gridSettings.minorLineInterval) {
            const screenX = this.worldToScreen(x, 0).x;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= 5; y += this.gridSettings.minorLineInterval) {
            const screenY = this.worldToScreen(0, y).y;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 绘制坐标轴
    drawAxes() {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 2;
        
        // X轴 (Time)
        const xAxisY = this.worldToScreen(0, 0).y;
        ctx.beginPath();
        ctx.moveTo(0, xAxisY);
        ctx.lineTo(this.canvas.width, xAxisY);
        ctx.stroke();
        
        // Y轴 (Weight)
        const yAxisX = this.worldToScreen(0, 0).x;
        ctx.beginPath();
        ctx.moveTo(yAxisX, 0);
        ctx.lineTo(yAxisX, this.canvas.height);
        ctx.stroke();
        
        // 绘制刻度和标签
        ctx.font = "12px Arial";
        ctx.fillStyle = "#aaa";
        ctx.textAlign = "center";
        
        // X轴刻度
        for (let x = 0; x <= 1; x += 0.2) {
            const screenX = this.worldToScreen(x, 0).x;
            
            ctx.beginPath();
            ctx.moveTo(screenX, xAxisY);
            ctx.lineTo(screenX, xAxisY + 5);
            ctx.stroke();
            
            ctx.fillText(x.toFixed(1), screenX, xAxisY + 20);
        }
        
        // Y轴刻度
        ctx.textAlign = "right";
        for (let y = 0; y <= 5; y += 0.5) {
            const screenY = this.worldToScreen(0, y).y;
            
            ctx.beginPath();
            ctx.moveTo(yAxisX, screenY);
            ctx.lineTo(yAxisX - 5, screenY);
            ctx.stroke();
            
            ctx.fillText(y.toFixed(1), yAxisX - 10, screenY + 4);
        }
        
        // 坐标轴标签
        ctx.textAlign = "center";
        ctx.fillText("时间", this.canvas.width / 2, this.canvas.height - 5);
        
        ctx.save();
        ctx.translate(15, this.canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("权重", 0, 0);
        ctx.restore();
        
        ctx.restore();
    }
    
    // 绘制曲线
    drawCurves() {
        const ctx = this.ctx;
        
        for (let i = 0; i < this.prompts.length; i++) {
            const promptData = this.prompts[i];
            if (!promptData.visible) continue;
            
            const points = promptData.points;
            if (points.length < 2) continue;
            
            // 设置曲线样式
            ctx.strokeStyle = promptData.color || "#fff";
            ctx.lineWidth = i === this.selectedPromptIndex ? 3 : 2;
            
            ctx.beginPath();
            
            // 获取第一个点
            const firstPoint = this.worldToScreen(points[0][0], points[0][1]);
            ctx.moveTo(firstPoint.x, firstPoint.y);
            
            // 根据曲线类型绘制
            if (promptData.curve_type === "linear") {
                // 线性插值
                for (let j = 1; j < points.length; j++) {
                    const point = this.worldToScreen(points[j][0], points[j][1]);
                    ctx.lineTo(point.x, point.y);
                }
            } else if (promptData.curve_type === "step") {
                // 阶梯插值
                for (let j = 1; j < points.length; j++) {
                    const prevPoint = this.worldToScreen(points[j-1][0], points[j-1][1]);
                    const currPoint = this.worldToScreen(points[j][0], points[j][1]);
                    
                    // 水平线
                    ctx.lineTo(currPoint.x, prevPoint.y);
                    // 垂直线
                    ctx.lineTo(currPoint.x, currPoint.y);
                }
            } else {
                // 默认贝塞尔曲线
                // 绘制100个点的平滑曲线
                const steps = 100;
                
                for (let t = 1; t <= steps; t++) {
                    const localT = t / steps;
                    let x = 0;
                    let y = 0;
                    
                    // 找到localT对应的区间
                    let segment = 0;
                    for (let j = 1; j < points.length; j++) {
                        if (localT <= points[j][0]) {
                            segment = j - 1;
                            break;
                        }
                    }
                    
                    // 如果t超出了最大点
                    if (segment === 0 && localT > points[points.length - 1][0]) {
                        segment = points.length - 2;
                    }
                    
                    const x0 = points[segment][0];
                    const y0 = points[segment][1];
                    const x1 = points[segment + 1][0];
                    const y1 = points[segment + 1][1];
                    
                    // 区间内的相对位置
                    let segmentT = 0;
                    if (x1 - x0 !== 0) {
                        segmentT = (localT - x0) / (x1 - x0);
                    }
                    
                    // 贝塞尔缓动曲线
                    segmentT = 3 * segmentT * segmentT - 2 * segmentT * segmentT * segmentT;
                    
                    // 插值计算
                    x = x0 + (x1 - x0) * segmentT;
                    y = y0 + (y1 - y0) * segmentT;
                    
                    const screenPos = this.worldToScreen(x, y);
                    ctx.lineTo(screenPos.x, screenPos.y);
                }
            }
            
            ctx.stroke();
            
            // 绘制提示词名称
            if (points.length > 0) {
                const lastPoint = this.worldToScreen(points[points.length - 1][0], points[points.length - 1][1]);
                ctx.font = "12px Arial";
                ctx.fillStyle = promptData.color || "#fff";
                ctx.textAlign = "left";
                ctx.fillText(promptData.prompt, lastPoint.x + 5, lastPoint.y);
            }
        }
    }
    
    // 绘制控制点
    drawControlPoints() {
        const ctx = this.ctx;
        
        for (let i = 0; i < this.prompts.length; i++) {
            const promptData = this.prompts[i];
            if (!promptData.visible) continue;
            
            const points = promptData.points;
            const isSelected = (i === this.selectedPromptIndex);
            
            for (let j = 0; j < points.length; j++) {
                const screenPos = this.worldToScreen(points[j][0], points[j][1]);
                
                // 点的样式
                ctx.fillStyle = promptData.color || "#fff";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1.5;
                
                // 绘制点
                ctx.beginPath();
                const radius = (isSelected && j === this.selectedPointIndex) ? 8 : 6;
                ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // 如果是选中的点，显示坐标值
                if (isSelected && j === this.selectedPointIndex) {
                    ctx.font = "12px Arial";
                    ctx.fillStyle = "#fff";
                    ctx.textAlign = "center";
                    const infoText = `(${points[j][0].toFixed(2)}, ${points[j][1].toFixed(2)})`;
                    ctx.fillText(infoText, screenPos.x, screenPos.y - 15);
                }
            }
        }
    }
}

// 注册自定义组件
app.registerExtension({
    name: "ComfyUI.PromptWeightCurveEditor",
    async nodeCreated(node) {
        // 如果是我们的节点类型
        if (node.comfyClass === "PromptWeightCurveEditor") {
            // 等待下一帧以确保DOM已经准备好
            setTimeout(() => {
                // 查找节点的内容区域
                const nodeElement = document.getElementById(node.id);
                if (!nodeElement) return;
                
                // 查找中间内容区
                const htmlContainer = nodeElement.querySelector(".litegraph-node-content");
                if (!htmlContainer) return;
                
                // 清空原有内容
                htmlContainer.innerHTML = "";
                
                // 创建曲线编辑器
                const editor = new CurveEditor(node, htmlContainer);
                
                // 存储编辑器实例到节点
                node.curveEditor = editor;
            }, 50);
        }
    }
});

console.log("提示词权重曲线编辑器已加载"); 