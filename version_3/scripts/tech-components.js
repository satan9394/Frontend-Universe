// 技术组件管理器
class TechComponentManager {
    constructor() {
        this.components = new Map();
        this.activeLayer = null;
        this.animationQueue = [];
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.loadTechData();
        this.setupEventListeners();
        this.createTechComponents();
    }

    loadTechData() {
        // 确保技术数据已加载
        if (typeof TECH_DATA === 'undefined') {
            console.error('TECH_DATA not loaded. Please include tech-data.js first.');
            return;
        }
        this.techData = TECH_DATA;
    }

    setupEventListeners() {
        // 技术项点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tech-item')) {
                const techItem = e.target.closest('.tech-item');
                const techId = techItem.dataset.tech;
                const layerId = techItem.closest('.tech-layer').dataset.layer;
                this.handleTechItemClick(techId, layerId);
            }
        });

        // 层级悬停事件
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.tech-layer')) {
                const layer = e.target.closest('.tech-layer');
                this.handleLayerHover(layer);
            }
        });

        // 层级离开事件
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.tech-layer')) {
                const layer = e.target.closest('.tech-layer');
                this.handleLayerLeave(layer);
            }
        });
    }

    createTechComponents() {
        Object.keys(this.techData).forEach((layerKey, index) => {
            const layerData = this.techData[layerKey];
            const layerElement = document.querySelector(`[data-layer="${index + 1}"]`);
            
            if (layerElement) {
                this.enhanceLayerElement(layerElement, layerData, layerKey);
                this.createTechItems(layerElement, layerData, layerKey);
            }
        });
    }

    enhanceLayerElement(layerElement, layerData, layerKey) {
        // 添加层级特定的CSS类
        layerElement.classList.add(`${layerKey}-layer`);
        
        // 设置CSS自定义属性
        layerElement.style.setProperty('--layer-color', layerData.color);
        
        // 添加层级描述
        const layerHeader = layerElement.querySelector('.layer-header');
        if (layerHeader && !layerHeader.querySelector('.layer-description')) {
            const description = document.createElement('div');
            description.className = 'layer-description';
            description.textContent = layerData.description;
            layerHeader.appendChild(description);
        }

        // 添加层级连接线
        this.createLayerConnections(layerElement, layerKey);
    }

    createTechItems(layerElement, layerData, layerKey) {
        const layerContent = layerElement.querySelector('.layer-content');
        if (!layerContent) return;

        // 清空现有内容（如果需要重新生成）
        // layerContent.innerHTML = '';

        Object.keys(layerData.technologies).forEach((techKey) => {
            const techData = layerData.technologies[techKey];
            let techItem = layerContent.querySelector(`[data-tech="${techKey}"]`);
            
            if (!techItem) {
                techItem = this.createTechItem(techKey, techData, layerKey);
                layerContent.appendChild(techItem);
            } else {
                this.enhanceTechItem(techItem, techData, layerKey);
            }
        });
    }

    createTechItem(techKey, techData, layerKey) {
        const techItem = document.createElement('div');
        techItem.className = 'tech-item';
        techItem.dataset.tech = techKey;
        techItem.dataset.layer = layerKey;

        techItem.innerHTML = `
            <div class="tech-icon">${techData.icon}</div>
            <div class="tech-name">${techData.name}</div>
            <div class="tech-description">${techData.description}</div>
            <div class="tech-features" style="display: none;">
                ${techData.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="tech-animation-indicator"></div>
        `;

        // 添加悬停效果
        this.addTechItemInteractions(techItem, techData);

        return techItem;
    }

    enhanceTechItem(techItem, techData, layerKey) {
        // 更新现有技术项的内容
        const iconElement = techItem.querySelector('.tech-icon');
        const nameElement = techItem.querySelector('.tech-name');
        const descElement = techItem.querySelector('.tech-description');

        if (iconElement) iconElement.textContent = techData.icon;
        if (nameElement) nameElement.textContent = techData.name;
        if (descElement) descElement.textContent = techData.description;

        // 添加特性标签（如果不存在）
        if (!techItem.querySelector('.tech-features')) {
            const featuresDiv = document.createElement('div');
            featuresDiv.className = 'tech-features';
            featuresDiv.style.display = 'none';
            featuresDiv.innerHTML = techData.features.map(feature => 
                `<span class="feature-tag">${feature}</span>`
            ).join('');
            techItem.appendChild(featuresDiv);
        }

        // 添加动画指示器（如果不存在）
        if (!techItem.querySelector('.tech-animation-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'tech-animation-indicator';
            techItem.appendChild(indicator);
        }

        this.addTechItemInteractions(techItem, techData);
    }

    addTechItemInteractions(techItem, techData) {
        // 悬停显示特性
        techItem.addEventListener('mouseenter', () => {
            const features = techItem.querySelector('.tech-features');
            if (features) {
                features.style.display = 'block';
                features.classList.add('fade-in');
            }
            
            // 添加悬停动画
            techItem.classList.add('tech-item-hover');
            this.showTechPreview(techItem, techData);
        });

        techItem.addEventListener('mouseleave', () => {
            const features = techItem.querySelector('.tech-features');
            if (features) {
                features.style.display = 'none';
                features.classList.remove('fade-in');
            }
            
            techItem.classList.remove('tech-item-hover');
            this.hideTechPreview();
        });

        // 点击动画
        techItem.addEventListener('click', () => {
            this.playTechAnimation(techItem, techData);
        });
    }

    createLayerConnections(layerElement, layerKey) {
        // 创建层级之间的连接线
        const layerIndex = parseInt(layerElement.dataset.layer);
        
        if (layerIndex > 1) {
            const connectionLine = document.createElement('div');
            connectionLine.className = 'layer-connection';
            connectionLine.dataset.from = layerIndex - 1;
            connectionLine.dataset.to = layerIndex;
            
            layerElement.appendChild(connectionLine);
        }

        // 添加数据流动画
        this.createDataFlowAnimation(layerElement, layerKey);
    }

    createDataFlowAnimation(layerElement, layerKey) {
        const dataFlow = document.createElement('div');
        dataFlow.className = 'data-flow-animation';
        dataFlow.innerHTML = `
            <div class="data-particle"></div>
            <div class="data-particle"></div>
            <div class="data-particle"></div>
        `;
        
        layerElement.appendChild(dataFlow);
    }

    handleTechItemClick(techId, layerId) {
        const layerKey = this.getLayerKeyByIndex(layerId);
        const techData = this.techData[layerKey]?.technologies[techId];
        
        if (techData) {
            this.showTechModal(techId, techData, layerKey);
            this.playTechSpecificAnimation(techId, techData);
        }
    }

    handleLayerHover(layerElement) {
        const layerId = layerElement.dataset.layer;
        const layerKey = this.getLayerKeyByIndex(layerId);
        
        // 高亮当前层级
        layerElement.classList.add('layer-active');
        
        // 显示层级连接
        this.highlightLayerConnections(layerId);
        
        // 播放层级预览动画
        this.playLayerPreviewAnimation(layerKey);
    }

    handleLayerLeave(layerElement) {
        layerElement.classList.remove('layer-active');
        this.clearLayerConnections();
    }

    showTechModal(techId, techData, layerKey) {
        // 创建技术详情模态框
        const modal = document.createElement('div');
        modal.className = 'tech-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="tech-icon-large">${techData.icon}</div>
                    <h2>${techData.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="tech-description-full">${techData.description}</p>
                    <div class="tech-features-list">
                        <h3>核心特性</h3>
                        <ul>
                            ${techData.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="tech-animation-demo">
                        <h3>动画演示</h3>
                        <div class="animation-preview" data-animation="${techData.animation}">
                            <button class="play-animation-btn">播放动画</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加关闭事件
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 播放动画按钮
        modal.querySelector('.play-animation-btn').addEventListener('click', () => {
            this.playTechSpecificAnimation(techId, techData);
        });

        // 显示模态框动画
        setTimeout(() => modal.classList.add('modal-show'), 10);
    }

    showTechPreview(techItem, techData) {
        // 创建快速预览提示
        const preview = document.createElement('div');
        preview.className = 'tech-preview';
        preview.innerHTML = `
            <div class="preview-content">
                <h4>${techData.name}</h4>
                <p>${techData.description}</p>
                <div class="preview-features">
                    ${techData.features.slice(0, 3).map(feature => 
                        `<span class="preview-tag">${feature}</span>`
                    ).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(preview);

        // 定位预览框
        const rect = techItem.getBoundingClientRect();
        preview.style.left = `${rect.right + 10}px`;
        preview.style.top = `${rect.top}px`;

        // 存储引用以便清理
        this.currentPreview = preview;
    }

    hideTechPreview() {
        if (this.currentPreview) {
            this.currentPreview.remove();
            this.currentPreview = null;
        }
    }

    playTechAnimation(techItem, techData) {
        // 播放技术特定的动画
        techItem.classList.add('tech-animating');
        
        const animationType = techData.animation;
        this.executeAnimation(animationType, techItem);

        // 动画完成后清理
        setTimeout(() => {
            techItem.classList.remove('tech-animating');
        }, 2000);
    }

    playTechSpecificAnimation(techId, techData) {
        const animationType = techData.animation;
        
        switch (animationType) {
            case 'structureGeneration':
                this.animateStructureGeneration();
                break;
            case 'styleTransition':
                this.animateStyleTransition();
                break;
            case 'logicFlow':
                this.animateLogicFlow();
                break;
            case 'componentLifecycle':
                this.animateComponentLifecycle();
                break;
            case 'stateFlow':
                this.animateStateFlow();
                break;
            case 'httpRequests':
                this.animateHttpRequests();
                break;
            case 'bundleProcess':
                this.animateBundleProcess();
                break;
            case 'codeAnalysis':
                this.animateCodeAnalysis();
                break;
            case 'designSystem':
                this.animateDesignSystem();
                break;
            case 'performanceAudit':
                this.animatePerformanceAudit();
                break;
            case 'deploymentPipeline':
                this.animateDeploymentPipeline();
                break;
            case 'gpuComputing':
                this.animateGpuComputing();
                break;
            default:
                this.animateDefault();
        }
    }

    // 具体动画实现方法
    animateStructureGeneration() {
        // HTML结构生成动画
        const particles = this.createCodeParticles('<div>', '<p>', '<span>');
        this.animateParticlesToStructure(particles);
    }

    animateStyleTransition() {
        // CSS样式转换动画
        const layers = document.querySelectorAll('.tech-layer');
        layers.forEach((layer, index) => {
            setTimeout(() => {
                layer.style.transform = 'rotateY(360deg)';
                setTimeout(() => {
                    layer.style.transform = '';
                }, 1000);
            }, index * 200);
        });
    }

    animateLogicFlow() {
        // JavaScript逻辑流动画
        this.createDataFlowBetweenLayers();
    }

    animateComponentLifecycle() {
        // 组件生命周期动画
        const componentLayer = document.querySelector('[data-layer="3"]');
        this.showLifecycleStages(componentLayer);
    }

    animateStateFlow() {
        // 状态流动画
        this.createStateFlowVisualization();
    }

    animateHttpRequests() {
        // HTTP请求动画
        this.createNetworkRequestVisualization();
    }

    animateBundleProcess() {
        // 打包过程动画
        this.createBundleVisualization();
    }

    animateCodeAnalysis() {
        // 代码分析动画
        this.createCodeAnalysisVisualization();
    }

    animateDesignSystem() {
        // 设计系统动画
        this.createDesignSystemVisualization();
    }

    animatePerformanceAudit() {
        // 性能审计动画
        this.createPerformanceVisualization();
    }

    animateDeploymentPipeline() {
        // 部署流水线动画
        this.createDeploymentVisualization();
    }

    animateGpuComputing() {
        // GPU计算动画
        this.createGpuVisualization();
    }

    animateDefault() {
        // 默认动画
        this.createDefaultVisualization();
    }

    // 辅助方法
    getLayerKeyByIndex(layerId) {
        const layerKeys = Object.keys(this.techData);
        return layerKeys[parseInt(layerId) - 1];
    }

    highlightLayerConnections(layerId) {
        const connections = document.querySelectorAll('.layer-connection');
        connections.forEach(connection => {
            if (connection.dataset.to === layerId || connection.dataset.from === layerId) {
                connection.classList.add('connection-active');
            }
        });
    }

    clearLayerConnections() {
        const connections = document.querySelectorAll('.layer-connection');
        connections.forEach(connection => {
            connection.classList.remove('connection-active');
        });
    }

    createCodeParticles(...codes) {
        return codes.map(code => {
            const particle = document.createElement('div');
            particle.className = 'code-particle';
            particle.textContent = code;
            particle.style.position = 'absolute';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            document.body.appendChild(particle);
            return particle;
        });
    }

    executeAnimation(type, element) {
        // 执行具体的动画逻辑
        element.classList.add(`animation-${type}`);
        
        setTimeout(() => {
            element.classList.remove(`animation-${type}`);
        }, 2000);
    }

    // 清理方法
    destroy() {
        this.components.clear();
        this.animationQueue = [];
        this.isAnimating = false;
        
        if (this.currentPreview) {
            this.currentPreview.remove();
        }
    }
}

// 初始化技术组件管理器
document.addEventListener('DOMContentLoaded', () => {
    window.techComponentManager = new TechComponentManager();
});

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechComponentManager;
} else if (typeof window !== 'undefined') {
    window.TechComponentManager = TechComponentManager;
}