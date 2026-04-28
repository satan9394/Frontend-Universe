// Frontend Universe - 主JavaScript文件

class FrontendUniverse {
    constructor() {
        this.isAnimating = false;
        this.currentTheme = 'dark';
        this.layers = [];
        this.animationQueue = [];
        this.threeDController = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeLayers();
        this.startInitialAnimation();
        this.setupIntersectionObserver();
        this.initialize3DEffects();
    }

    setupEventListeners() {
        // 控制按钮事件
        const playBtn = document.getElementById('play-animation');
        const resetBtn = document.getElementById('reset-animation');
        const themeBtn = document.getElementById('toggle-theme');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.playAnimation());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAnimation());
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // 技术项目点击事件 - 使用事件委托
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tech-item')) {
                this.handleTechItemClick(e);
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // 窗口大小变化
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeLayers() {
        this.layers = Array.from(document.querySelectorAll('.tech-layer'));
        
        // 为每个层级添加编号和连接线
        this.layers.forEach((layer, index) => {
            // 添加层级编号
            const layerNumber = document.createElement('div');
            layerNumber.className = 'layer-number';
            layerNumber.textContent = index + 1;
            layer.appendChild(layerNumber);

            // 添加连接线（除了最后一层）
            if (index < this.layers.length - 1) {
                const connection = document.createElement('div');
                connection.className = 'layer-connection';
                layer.appendChild(connection);
            }

            // 添加数据流
            const dataStream = document.createElement('div');
            dataStream.className = 'data-stream';
            layer.appendChild(dataStream);
        });
    }

    startInitialAnimation() {
        // 延迟启动动画，让页面先加载完成
        setTimeout(() => {
            this.animateLogoEntrance();
            setTimeout(() => {
                this.animateLayersSequentially();
            }, 1000);
        }, 500);
    }

    animateLogoEntrance() {
        const logoContainer = document.querySelector('.logo-container');
        if (logoContainer) {
            logoContainer.style.opacity = '0';
            logoContainer.style.transform = 'translateY(-50px)';
            
            setTimeout(() => {
                logoContainer.style.transition = 'all 1s ease-out';
                logoContainer.style.opacity = '1';
                logoContainer.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    animateLayersSequentially() {
        this.layers.forEach((layer, index) => {
            setTimeout(() => {
                layer.classList.add('animate-layer');
                
                // 动画技术项目
                const techItems = layer.querySelectorAll('.tech-item');
                techItems.forEach((item, itemIndex) => {
                    setTimeout(() => {
                        item.classList.add('animate-tech');
                    }, itemIndex * 100);
                });

                // 触发特殊效果
                this.triggerLayerEffect(layer, index);
            }, index * 200);
        });
    }

    triggerLayerEffect(layer, index) {
        const layerId = layer.id;
        
        switch (layerId) {
            case 'foundation-layer':
                this.animateCodeGeneration(layer);
                break;
            case 'component-layer':
                this.animateComponentAssembly(layer);
                break;
            case 'build-layer':
                this.animateBuildProcess(layer);
                break;
            case 'network-layer':
                this.animateNetworkRequests(layer);
                break;
            case 'performance-layer':
                this.animatePerformanceMetrics(layer);
                break;
            case 'frontier-layer':
                this.animate3DEffects(layer);
                break;
        }
    }

    animateCodeGeneration(layer) {
        const techItems = layer.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('code-generation');
            }, index * 300);
        });
    }

    animateComponentAssembly(layer) {
        layer.classList.add('building');
        setTimeout(() => {
            layer.classList.remove('building');
        }, 3000);
    }

    animateBuildProcess(layer) {
        const techItems = layer.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            item.classList.add('build-animation');
        });
    }

    animateNetworkRequests(layer) {
        layer.classList.add('networking');
        
        // 创建网络脉冲效果
        const techItems = layer.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            const pulse = document.createElement('div');
            pulse.className = 'network-pulse';
            item.appendChild(pulse);
        });
    }

    animatePerformanceMetrics(layer) {
        layer.classList.add('optimizing');
        
        // 添加性能指标
        const techItems = layer.querySelectorAll('.tech-item');
        techItems.forEach(item => {
            const meter = document.createElement('div');
            meter.className = 'performance-meter';
            const bar = document.createElement('div');
            bar.className = 'performance-bar';
            meter.appendChild(bar);
            item.appendChild(meter);
        });
    }

    animate3DEffects(layer) {
        layer.classList.add('transform-3d');
        
        const techItems = layer.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
            setTimeout(() => {
                if (index % 2 === 0) {
                    item.classList.add('rotate-y');
                } else {
                    item.classList.add('rotate-x');
                }
            }, index * 200);
        });
    }

    playAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const playBtn = document.getElementById('play-animation');
        if (playBtn) {
            playBtn.textContent = '⏸ 暂停动画';
        }

        // 重新播放所有动画
        this.resetAnimation();
        setTimeout(() => {
            this.animateLayersSequentially();
            this.startDataFlowAnimation();
        }, 500);

        // 动画完成后重置按钮
        setTimeout(() => {
            this.isAnimating = false;
            if (playBtn) {
                playBtn.textContent = '▶ 播放动画';
            }
        }, this.layers.length * 200 + 3000);
    }

    resetAnimation() {
        // 移除所有动画类
        this.layers.forEach(layer => {
            layer.classList.remove('animate-layer', 'building', 'networking', 'optimizing', 'transform-3d');
            layer.style.opacity = '0';
            layer.style.transform = 'translateY(50px)';
            
            const techItems = layer.querySelectorAll('.tech-item');
            techItems.forEach(item => {
                item.classList.remove('animate-tech', 'code-generation', 'build-animation', 'rotate-y', 'rotate-x');
                
                // 移除动态添加的元素
                const pulse = item.querySelector('.network-pulse');
                const meter = item.querySelector('.performance-meter');
                if (pulse) pulse.remove();
                if (meter) meter.remove();
            });
        });

        // 重置按钮状态
        this.isAnimating = false;
        const playBtn = document.getElementById('play-animation');
        if (playBtn) {
            playBtn.textContent = '▶ 播放动画';
        }
    }

    startDataFlowAnimation() {
        // 创建数据流动画
        this.layers.forEach((layer, index) => {
            if (index < this.layers.length - 1) {
                setTimeout(() => {
                    const dataStream = layer.querySelector('.data-stream');
                    if (dataStream) {
                        dataStream.style.opacity = '1';
                        dataStream.style.animation = 'dataStream 2s ease-in-out';
                    }
                }, index * 300);
            }
        });
    }

    handleTechItemClick(event) {
        const techItem = event.currentTarget;
        const techType = techItem.dataset.tech;
        
        // 添加点击效果
        techItem.style.transform = 'translateY(-5px) scale(1.05)';
        setTimeout(() => {
            techItem.style.transform = '';
        }, 200);

        // 显示技术详情（可以扩展）
        this.showTechDetails(techType, techItem);
    }

    showTechDetails(techType, element) {
        // 创建详情弹窗
        const modal = document.createElement('div');
        modal.className = 'tech-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${this.getTechDisplayName(techType)}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${this.getTechDescription(techType)}</p>
                    <div class="tech-features">
                        ${this.getTechFeatures(techType)}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 添加关闭事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 添加模态框样式
        this.addModalStyles();
    }

    getTechDisplayName(techType) {
        const names = {
            'html5': 'HTML5',
            'css3': 'CSS3',
            'javascript': 'JavaScript ES6+',
            'react': 'React',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'webpack': 'Webpack',
            'vite': 'Vite',
            // 添加更多技术名称
        };
        return names[techType] || techType.toUpperCase();
    }

    getTechDescription(techType) {
        const descriptions = {
            'html5': '现代网页的结构基础，提供语义化标签和丰富的API支持。',
            'css3': '强大的样式表语言，支持动画、变换和响应式设计。',
            'javascript': '现代JavaScript，支持ES6+语法和异步编程。',
            'react': 'Facebook开发的组件化前端框架，拥有强大的生态系统。',
            'vue': '渐进式JavaScript框架，易学易用，适合各种规模的项目。',
            // 添加更多描述
        };
        return descriptions[techType] || '这是一个重要的前端技术。';
    }

    getTechFeatures(techType) {
        const features = {
            'html5': ['语义化标签', 'Canvas API', 'Web Storage', 'Geolocation'],
            'css3': ['Flexbox', 'Grid', 'Animation', 'Transform'],
            'javascript': ['箭头函数', 'Promise/Async', '模块化', '解构赋值'],
            'react': ['组件化', 'Virtual DOM', 'JSX', 'Hooks'],
            'vue': ['双向绑定', '组件系统', '指令', 'Composition API'],
            // 添加更多特性
        };
        
        const techFeatures = features[techType] || ['现代化', '高效', '易用'];
        return techFeatures.map(feature => `<span class="feature-tag">${feature}</span>`).join('');
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .tech-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: var(--bg-secondary);
                border: 1px solid var(--border-primary);
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                animation: scaleIn 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .modal-header h3 {
                color: var(--primary-blue);
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close:hover {
                color: var(--text-primary);
            }
            
            .modal-body p {
                color: var(--text-secondary);
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .tech-features {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .feature-tag {
                background: var(--primary-blue);
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.classList.toggle('light-theme');
        
        const themeBtn = document.getElementById('toggle-theme');
        if (themeBtn) {
            themeBtn.textContent = this.currentTheme === 'dark' ? '🌙 切换主题' : '☀️ 切换主题';
        }
    }

    handleKeyPress(event) {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                this.playAnimation();
                break;
            case 'r':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.resetAnimation();
                }
                break;
            case 't':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.toggleTheme();
                }
                break;
        }
    }

    handleResize() {
        // 响应式处理
        const width = window.innerWidth;
        
        if (width < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.layers.forEach(layer => {
            observer.observe(layer);
        });
    }

    // 初始化3D效果
    initialize3DEffects() {
        // 检查是否存在ThreeDEffectsController类
        if (typeof ThreeDEffectsController !== 'undefined') {
            try {
                this.threeDController = new ThreeDEffectsController();
                console.log('3D effects initialized successfully');
            } catch (error) {
                console.warn('Failed to initialize 3D effects:', error);
            }
        } else {
            console.warn('ThreeDEffectsController not found, 3D effects disabled');
        }
    }

    // 切换3D效果
    toggle3DEffects() {
        if (this.threeDController) {
            this.threeDController.toggle();
        }
    }

    // 获取3D效果状态
    get3DStatus() {
        return this.threeDController ? this.threeDController.getStatus() : null;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.frontendUniverse = new FrontendUniverse();
});

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrontendUniverse;
}