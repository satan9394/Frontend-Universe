// Frontend Universe - 交互控制系统

class InteractionController {
    constructor() {
        this.activeLayer = null;
        this.selectedTech = null;
        this.isModalOpen = false;
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.keyboardShortcuts = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.setupTouchGestures();
        this.setupAccessibility();
        this.createModal();
    }

    setupEventListeners() {
        // 技术项点击事件
        document.addEventListener('click', (e) => {
            const techItem = e.target.closest('.tech-item');
            if (techItem) {
                this.handleTechItemClick(techItem, e);
                return;
            }

            const layer = e.target.closest('.tech-layer');
            if (layer) {
                this.handleLayerClick(layer, e);
                return;
            }

            // 控制按钮事件
            if (e.target.matches('.control-btn')) {
                this.handleControlClick(e.target);
                return;
            }

            // 主题切换
            if (e.target.matches('.theme-toggle')) {
                this.toggleTheme();
                return;
            }

            // 关闭模态框
            if (e.target.matches('.modal-overlay, .modal-close')) {
                this.closeModal();
                return;
            }
        });

        // 鼠标悬停事件
        document.addEventListener('mouseover', (e) => {
            const techItem = e.target.closest('.tech-item');
            if (techItem) {
                this.handleTechItemHover(techItem, true);
            }

            const layer = e.target.closest('.tech-layer');
            if (layer) {
                this.handleLayerHover(layer, true);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const techItem = e.target.closest('.tech-item');
            if (techItem) {
                this.handleTechItemHover(techItem, false);
            }

            const layer = e.target.closest('.tech-layer');
            if (layer) {
                this.handleLayerHover(layer, false);
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 滚动事件
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    setupKeyboardShortcuts() {
        // 定义键盘快捷键
        this.keyboardShortcuts.set('Space', () => this.togglePlayPause());
        this.keyboardShortcuts.set('KeyR', () => this.resetAnimation());
        this.keyboardShortcuts.set('KeyT', () => this.toggleTheme());
        this.keyboardShortcuts.set('Escape', () => this.closeModal());
        this.keyboardShortcuts.set('ArrowRight', () => this.nextLayer());
        this.keyboardShortcuts.set('ArrowLeft', () => this.previousLayer());
        this.keyboardShortcuts.set('ArrowUp', () => this.increaseSpeed());
        this.keyboardShortcuts.set('ArrowDown', () => this.decreaseSpeed());

        // 数字键选择层级
        for (let i = 1; i <= 11; i++) {
            this.keyboardShortcuts.set(`Digit${i}`, () => this.selectLayer(i));
        }

        document.addEventListener('keydown', (e) => {
            // 如果模态框打开或输入框聚焦，不处理快捷键
            if (this.isModalOpen || e.target.matches('input, textarea')) {
                return;
            }

            const handler = this.keyboardShortcuts.get(e.code);
            if (handler) {
                e.preventDefault();
                handler();
            }
        });
    }

    setupTouchGestures() {
        let startX, startY, startTime;

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            // 防止默认滚动行为（在特定情况下）
            if (e.target.closest('.tech-layer')) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // 检测手势
            if (deltaTime < 300) { // 快速手势
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // 水平滑动
                    if (Math.abs(deltaX) > 50) {
                        if (deltaX > 0) {
                            this.nextLayer();
                        } else {
                            this.previousLayer();
                        }
                    }
                } else {
                    // 垂直滑动
                    if (Math.abs(deltaY) > 50) {
                        if (deltaY > 0) {
                            this.decreaseSpeed();
                        } else {
                            this.increaseSpeed();
                        }
                    }
                }
            }

            // 双击检测
            if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                this.handleDoubleTap(e);
            }

            startX = startY = null;
        }, { passive: true });
    }

    setupAccessibility() {
        // 为技术项添加ARIA标签
        document.querySelectorAll('.tech-item').forEach((item, index) => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `技术项 ${index + 1}`);
            
            // 键盘导航支持
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTechItemClick(item, e);
                }
            });
        });

        // 为层级添加ARIA标签
        document.querySelectorAll('.tech-layer').forEach((layer, index) => {
            layer.setAttribute('role', 'region');
            layer.setAttribute('aria-label', `技术层级 ${index + 1}`);
        });

        // 为控制按钮添加ARIA标签
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.setAttribute('role', 'button');
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'tech-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="关闭">&times;</button>
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <div class="modal-category"></div>
                </div>
                <div class="modal-body">
                    <div class="tech-description"></div>
                    <div class="tech-features"></div>
                    <div class="tech-examples"></div>
                    <div class="tech-resources"></div>
                </div>
                <div class="modal-footer">
                    <button class="modal-demo-btn">查看演示</button>
                    <button class="modal-docs-btn">查看文档</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;

        // 模态框内的事件
        modal.querySelector('.modal-demo-btn').addEventListener('click', () => {
            this.showTechDemo();
        });

        modal.querySelector('.modal-docs-btn').addEventListener('click', () => {
            this.openTechDocs();
        });
    }

    handleTechItemClick(item, event) {
        event.stopPropagation();
        
        // 移除其他选中状态
        document.querySelectorAll('.tech-item.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // 选中当前项
        item.classList.add('selected');
        this.selectedTech = item;

        // 触发点击动画
        if (window.animationController) {
            window.animationController.animateTechItem(item);
        }

        // 显示技术详情
        this.showTechDetails(item);

        // 创建连接线到相关技术
        this.showRelatedConnections(item);

        // 播放音效（如果启用）
        this.playClickSound();
    }

    handleLayerClick(layer, event) {
        event.stopPropagation();

        // 移除其他激活状态
        document.querySelectorAll('.tech-layer.active').forEach(el => {
            el.classList.remove('active');
        });

        // 激活当前层
        layer.classList.add('active');
        this.activeLayer = layer;

        // 高亮相关层级
        this.highlightRelatedLayers(layer);

        // 更新控制面板
        this.updateControlPanel(layer);
    }

    handleTechItemHover(item, isEntering) {
        if (isEntering) {
            item.classList.add('hovered');
            this.showQuickPreview(item);
            
            // 创建悬停粒子效果
            if (window.particleSystem) {
                const rect = item.getBoundingClientRect();
                window.particleSystem.createBurst(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    5
                );
            }
        } else {
            item.classList.remove('hovered');
            this.hideQuickPreview();
        }
    }

    handleLayerHover(layer, isEntering) {
        if (isEntering) {
            layer.classList.add('layer-hovered');
            this.showLayerInfo(layer);
        } else {
            layer.classList.remove('layer-hovered');
            this.hideLayerInfo();
        }
    }

    handleControlClick(button) {
        const action = button.dataset.action;
        
        switch (action) {
            case 'play':
                this.togglePlayPause();
                break;
            case 'reset':
                this.resetAnimation();
                break;
            case 'step':
                this.stepAnimation();
                break;
            case 'speed-up':
                this.increaseSpeed();
                break;
            case 'speed-down':
                this.decreaseSpeed();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
            case 'settings':
                this.openSettings();
                break;
        }

        // 按钮反馈动画
        button.classList.add('btn-clicked');
        setTimeout(() => button.classList.remove('btn-clicked'), 200);
    }

    handleResize() {
        // 重新计算布局
        this.recalculateLayout();
        
        // 更新粒子系统
        if (window.particleSystem) {
            window.particleSystem.resizeCanvas();
        }

        // 更新数据流
        if (window.dataFlowParticles) {
            window.dataFlowParticles.resizeCanvas();
        }

        // 重新定位模态框
        if (this.isModalOpen) {
            this.repositionModal();
        }
    }

    handleScroll() {
        // 视差滚动效果
        const scrollY = window.scrollY;
        const layers = document.querySelectorAll('.tech-layer');
        
        layers.forEach((layer, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrollY * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });

        // 更新导航指示器
        this.updateScrollIndicator();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            this.pauseAnimations();
        } else {
            // 页面显示时恢复动画
            this.resumeAnimations();
        }
    }

    handleDoubleTap(event) {
        const target = event.target.closest('.tech-item, .tech-layer');
        if (target) {
            if (target.classList.contains('tech-item')) {
                this.showTechDetails(target);
            } else {
                this.focusLayer(target);
            }
        }
    }

    showTechDetails(item) {
        const techName = item.dataset.tech || item.querySelector('.tech-name')?.textContent;
        const techData = this.getTechData(techName);
        
        if (!techData) return;

        // 更新模态框内容
        this.modal.querySelector('.modal-title').textContent = techData.name;
        this.modal.querySelector('.modal-category').textContent = techData.category;
        this.modal.querySelector('.tech-description').innerHTML = techData.description;
        this.modal.querySelector('.tech-features').innerHTML = this.renderFeatures(techData.features);
        this.modal.querySelector('.tech-examples').innerHTML = this.renderExamples(techData.examples);
        this.modal.querySelector('.tech-resources').innerHTML = this.renderResources(techData.resources);

        // 显示模态框
        this.openModal();
    }

    getTechData(techName) {
        // 技术数据库
        const techDatabase = {
            'html5': {
                name: 'HTML5',
                category: '基础层',
                description: 'HTML5是构建Web页面的标准标记语言，提供了丰富的语义化元素和API。',
                features: ['语义化标签', 'Canvas绘图', 'Web Storage', 'Geolocation', 'Web Workers'],
                examples: ['<article>', '<section>', '<canvas>', 'localStorage'],
                resources: ['MDN文档', 'W3C规范', 'HTML5 Rocks']
            },
            'css3': {
                name: 'CSS3',
                category: '基础层',
                description: 'CSS3是样式表语言，用于描述HTML文档的呈现方式，支持动画、变换等高级特性。',
                features: ['Flexbox布局', 'Grid布局', 'CSS动画', '媒体查询', '自定义属性'],
                examples: ['display: flex', '@keyframes', 'transform', '@media'],
                resources: ['CSS-Tricks', 'MDN CSS', 'Can I Use']
            },
            'javascript': {
                name: 'JavaScript ES6+',
                category: '基础层',
                description: 'JavaScript是Web的编程语言，ES6+带来了现代化的语法和功能。',
                features: ['箭头函数', '模块系统', 'Promise/Async', '解构赋值', '类语法'],
                examples: ['const fn = () => {}', 'import/export', 'async/await'],
                resources: ['MDN JavaScript', 'ES6 Features', 'JavaScript.info']
            },
            'react': {
                name: 'React',
                category: '组件层',
                description: 'React是用于构建用户界面的JavaScript库，采用组件化和虚拟DOM设计。',
                features: ['组件化', '虚拟DOM', 'JSX语法', 'Hooks', '单向数据流'],
                examples: ['useState', 'useEffect', 'JSX', 'Components'],
                resources: ['React官方文档', 'React Hooks', 'Create React App']
            },
            'vue': {
                name: 'Vue.js',
                category: '组件层',
                description: 'Vue.js是渐进式JavaScript框架，易学易用，具有响应式数据绑定。',
                features: ['响应式数据', '模板语法', '组件系统', 'Vue Router', 'Vuex'],
                examples: ['v-model', 'v-for', '{{ }}', 'computed'],
                resources: ['Vue官方文档', 'Vue CLI', 'Nuxt.js']
            }
            // 可以继续添加更多技术数据...
        };

        return techDatabase[techName.toLowerCase()] || null;
    }

    renderFeatures(features) {
        if (!features) return '';
        
        return `
            <h4>主要特性</h4>
            <ul class="feature-list">
                ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
    }

    renderExamples(examples) {
        if (!examples) return '';
        
        return `
            <h4>代码示例</h4>
            <div class="example-list">
                ${examples.map(example => `<code class="example-code">${example}</code>`).join('')}
            </div>
        `;
    }

    renderResources(resources) {
        if (!resources) return '';
        
        return `
            <h4>学习资源</h4>
            <ul class="resource-list">
                ${resources.map(resource => `<li><a href="#" class="resource-link">${resource}</a></li>`).join('')}
            </ul>
        `;
    }

    openModal() {
        this.modal.classList.add('active');
        this.isModalOpen = true;
        document.body.classList.add('modal-open');
        
        // 聚焦到模态框
        this.modal.querySelector('.modal-content').focus();
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.isModalOpen = false;
        document.body.classList.remove('modal-open');
        
        // 返回焦点到触发元素
        if (this.selectedTech) {
            this.selectedTech.focus();
        }
    }

    showQuickPreview(item) {
        const preview = document.createElement('div');
        preview.className = 'quick-preview';
        preview.innerHTML = `
            <div class="preview-title">${item.dataset.tech || '技术'}</div>
            <div class="preview-description">点击查看详细信息</div>
        `;
        
        const rect = item.getBoundingClientRect();
        preview.style.cssText = `
            position: fixed;
            left: ${rect.right + 10}px;
            top: ${rect.top}px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(preview);
        this.currentPreview = preview;
        
        // 动画显示
        requestAnimationFrame(() => {
            preview.classList.add('show');
        });
    }

    hideQuickPreview() {
        if (this.currentPreview) {
            this.currentPreview.classList.remove('show');
            setTimeout(() => {
                if (this.currentPreview && this.currentPreview.parentNode) {
                    this.currentPreview.parentNode.removeChild(this.currentPreview);
                }
                this.currentPreview = null;
            }, 200);
        }
    }

    showRelatedConnections(item) {
        // 清除现有连接
        document.querySelectorAll('.connection-line').forEach(line => line.remove());
        
        const techName = item.dataset.tech;
        const relatedTechs = this.getRelatedTechnologies(techName);
        
        relatedTechs.forEach(relatedTech => {
            const relatedItem = document.querySelector(`[data-tech="${relatedTech}"]`);
            if (relatedItem) {
                this.createConnectionLine(item, relatedItem);
            }
        });
    }

    getRelatedTechnologies(techName) {
        const relations = {
            'react': ['jsx', 'redux', 'webpack', 'jest'],
            'vue': ['vuex', 'vue-router', 'vite'],
            'angular': ['typescript', 'rxjs', 'webpack'],
            'webpack': ['babel', 'eslint', 'sass'],
            'vite': ['rollup', 'esbuild'],
            // 添加更多关联关系...
        };
        
        return relations[techName] || [];
    }

    createConnectionLine(fromElement, toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        const fromX = fromRect.left + fromRect.width / 2;
        const fromY = fromRect.top + fromRect.height / 2;
        const toX = toRect.left + toRect.width / 2;
        const toY = toRect.top + toRect.height / 2;
        
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
        
        line.style.cssText = `
            position: fixed;
            left: ${fromX}px;
            top: ${fromY}px;
            width: ${length}px;
            height: 2px;
            background: linear-gradient(to right, #38BDF8, #A855F7);
            transform-origin: 0 50%;
            transform: rotate(${angle}deg);
            z-index: 100;
            animation: connectionPulse 2s ease-in-out infinite;
        `;
        
        document.body.appendChild(line);
        
        // 自动清除
        setTimeout(() => {
            if (line.parentNode) {
                line.parentNode.removeChild(line);
            }
        }, 3000);
    }

    // 控制方法
    togglePlayPause() {
        if (window.animationController) {
            if (window.animationController.isPlaying) {
                window.animationController.pauseSequence();
            } else {
                window.animationController.playSequence();
            }
        }
    }

    resetAnimation() {
        if (window.animationController) {
            window.animationController.resetSequence();
        }
    }

    stepAnimation() {
        if (window.animationController) {
            window.animationController.playStep();
        }
    }

    nextLayer() {
        const layers = document.querySelectorAll('.tech-layer');
        const currentIndex = Array.from(layers).indexOf(this.activeLayer);
        const nextIndex = (currentIndex + 1) % layers.length;
        
        this.selectLayer(nextIndex + 1);
    }

    previousLayer() {
        const layers = document.querySelectorAll('.tech-layer');
        const currentIndex = Array.from(layers).indexOf(this.activeLayer);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : layers.length - 1;
        
        this.selectLayer(prevIndex + 1);
    }

    selectLayer(layerNumber) {
        const layer = document.querySelector(`[data-layer="${layerNumber}"]`);
        if (layer) {
            layer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.handleLayerClick(layer, { stopPropagation: () => {} });
        }
    }

    increaseSpeed() {
        if (window.particleSystem) {
            window.particleSystem.setSpeed(1.2);
        }
        this.showSpeedIndicator('加速');
    }

    decreaseSpeed() {
        if (window.particleSystem) {
            window.particleSystem.setSpeed(0.8);
        }
        this.showSpeedIndicator('减速');
    }

    showSpeedIndicator(text) {
        const indicator = document.createElement('div');
        indicator.className = 'speed-indicator';
        indicator.textContent = text;
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 1000);
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        // 保存主题偏好
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // 更新主题按钮
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
            themeBtn.textContent = isLight ? '🌙' : '☀️';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // 辅助方法
    recalculateLayout() {
        // 重新计算布局相关的尺寸和位置
        const container = document.getElementById('universe-container');
        if (container) {
            const rect = container.getBoundingClientRect();
            // 更新全局布局变量
            window.universeWidth = rect.width;
            window.universeHeight = rect.height;
        }
    }

    pauseAnimations() {
        if (window.particleSystem) {
            window.particleSystem.stop();
        }
        if (window.dataFlowParticles) {
            window.dataFlowParticles.stop();
        }
    }

    resumeAnimations() {
        if (window.particleSystem) {
            window.particleSystem.start();
        }
        if (window.dataFlowParticles) {
            window.dataFlowParticles.start();
        }
    }

    playClickSound() {
        // 如果启用了音效，播放点击音效
        if (this.soundEnabled) {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.1;
            audio.play().catch(() => {}); // 忽略自动播放限制错误
        }
    }

    // 初始化时恢复用户偏好
    restoreUserPreferences() {
        // 恢复主题
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const themeBtn = document.querySelector('.theme-toggle');
            if (themeBtn) {
                themeBtn.textContent = '🌙';
            }
        }

        // 恢复其他用户偏好...
    }
}

// 初始化交互控制器
document.addEventListener('DOMContentLoaded', () => {
    window.interactionController = new InteractionController();
    window.interactionController.restoreUserPreferences();
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionController;
}