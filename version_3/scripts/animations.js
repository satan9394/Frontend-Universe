// Frontend Universe - 动画控制系统

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.timelines = new Map();
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 11; // 11个技术层级
        
        this.init();
    }

    init() {
        this.setupAnimationSequence();
        this.bindEvents();
    }

    setupAnimationSequence() {
        // 定义每个层级的动画序列
        this.animationSequence = [
            {
                name: 'foundation',
                layer: 1,
                duration: 2000,
                animations: ['htmlGeneration', 'cssLayout', 'jsLogic']
            },
            {
                name: 'styling',
                layer: 2,
                duration: 1500,
                animations: ['sassCompilation', 'tailwindGeneration', 'responsiveLayout']
            },
            {
                name: 'components',
                layer: 3,
                duration: 2500,
                animations: ['reactMounting', 'vueRendering', 'componentLifecycle']
            },
            {
                name: 'state',
                layer: 4,
                duration: 2000,
                animations: ['dataFlow', 'stateUpdate', 'subscriptionPulse']
            },
            {
                name: 'network',
                layer: 5,
                duration: 1800,
                animations: ['apiRequest', 'websocketConnection', 'dataStreaming']
            },
            {
                name: 'build',
                layer: 6,
                duration: 2200,
                animations: ['moduleBundle', 'hotReload', 'optimization']
            },
            {
                name: 'quality',
                layer: 7,
                duration: 1600,
                animations: ['linting', 'testing', 'cicdPipeline']
            },
            {
                name: 'ui',
                layer: 8,
                duration: 1400,
                animations: ['componentLibrary', 'designSystem', 'themeSwitch']
            },
            {
                name: 'performance',
                layer: 9,
                duration: 2000,
                animations: ['lazyLoading', 'caching', 'optimization']
            },
            {
                name: 'deployment',
                layer: 10,
                duration: 1800,
                animations: ['buildPipeline', 'deployment', 'monitoring']
            },
            {
                name: 'frontier',
                layer: 11,
                duration: 3000,
                animations: ['webgpu', 'webassembly', 'ai3d']
            }
        ];
    }

    bindEvents() {
        // 绑定控制按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.matches('.play-btn')) {
                this.playSequence();
            } else if (e.target.matches('.reset-btn')) {
                this.resetSequence();
            } else if (e.target.matches('.step-btn')) {
                this.playStep();
            }
        });

        // 绑定技术项点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tech-item')) {
                this.animateTechItem(e.target.closest('.tech-item'));
            }
        });
    }

    // 播放完整序列
    async playSequence() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.updatePlayButton(true);
        
        for (let i = 0; i < this.animationSequence.length; i++) {
            await this.playLayerAnimation(this.animationSequence[i]);
            this.currentStep = i + 1;
        }
        
        this.isPlaying = false;
        this.updatePlayButton(false);
    }

    // 播放单个步骤
    async playStep() {
        if (this.isPlaying || this.currentStep >= this.animationSequence.length) return;
        
        const step = this.animationSequence[this.currentStep];
        await this.playLayerAnimation(step);
        this.currentStep++;
    }

    // 重置序列
    resetSequence() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.updatePlayButton(false);
        
        // 重置所有层级状态
        document.querySelectorAll('.tech-layer').forEach(layer => {
            layer.classList.remove('active', 'completed');
            layer.style.transform = '';
            layer.style.opacity = '';
        });

        // 重置所有技术项
        document.querySelectorAll('.tech-item').forEach(item => {
            item.classList.remove('active', 'pulse');
            item.style.transform = '';
        });

        // 清除数据流
        if (window.dataFlowParticles) {
            window.dataFlowParticles.clearFlows();
        }
    }

    // 播放层级动画
    async playLayerAnimation(layerConfig) {
        const layer = document.querySelector(`[data-layer="${layerConfig.layer}"]`);
        if (!layer) return;

        // 激活当前层级
        layer.classList.add('active');
        
        // 执行层级特定动画
        await this.executeLayerAnimations(layer, layerConfig);
        
        // 标记完成
        layer.classList.add('completed');
        
        return new Promise(resolve => {
            setTimeout(resolve, 500); // 层级间间隔
        });
    }

    // 执行层级动画
    async executeLayerAnimations(layer, config) {
        const promises = [];

        switch (config.name) {
            case 'foundation':
                promises.push(this.animateHTMLGeneration(layer));
                promises.push(this.animateCSSLayout(layer));
                promises.push(this.animateJSLogic(layer));
                break;
                
            case 'styling':
                promises.push(this.animateSassCompilation(layer));
                promises.push(this.animateResponsiveLayout(layer));
                break;
                
            case 'components':
                promises.push(this.animateComponentLifecycle(layer));
                promises.push(this.animateFrameworkComparison(layer));
                break;
                
            case 'state':
                promises.push(this.animateDataFlow(layer));
                promises.push(this.animateStateManagement(layer));
                break;
                
            case 'network':
                promises.push(this.animateNetworkRequests(layer));
                promises.push(this.animateWebSocket(layer));
                break;
                
            case 'build':
                promises.push(this.animateModuleBundling(layer));
                promises.push(this.animateHotReload(layer));
                break;
                
            case 'quality':
                promises.push(this.animateCodeQuality(layer));
                promises.push(this.animateTesting(layer));
                break;
                
            case 'ui':
                promises.push(this.animateUILibrary(layer));
                promises.push(this.animateDesignSystem(layer));
                break;
                
            case 'performance':
                promises.push(this.animatePerformanceOptimization(layer));
                promises.push(this.animatePWA(layer));
                break;
                
            case 'deployment':
                promises.push(this.animateDeploymentPipeline(layer));
                promises.push(this.animateMonitoring(layer));
                break;
                
            case 'frontier':
                promises.push(this.animateWebGPU(layer));
                promises.push(this.animate3DEffects(layer));
                break;
        }

        await Promise.all(promises);
    }

    // HTML生成动画
    animateHTMLGeneration(layer) {
        return new Promise(resolve => {
            const items = layer.querySelectorAll('.tech-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('html-generation');
                    this.createCodeParticles(item, '<div>', '#E34F26');
                }, index * 200);
            });
            
            setTimeout(resolve, items.length * 200 + 500);
        });
    }

    // CSS布局动画
    animateCSSLayout(layer) {
        return new Promise(resolve => {
            const items = layer.querySelectorAll('.tech-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('css-layout');
                    this.animateLayoutChange(item);
                }, index * 150);
            });
            
            setTimeout(resolve, items.length * 150 + 800);
        });
    }

    // JavaScript逻辑动画
    animateJSLogic(layer) {
        return new Promise(resolve => {
            const items = layer.querySelectorAll('.tech-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('js-logic');
                    this.createLogicFlow(item);
                }, index * 100);
            });
            
            setTimeout(resolve, items.length * 100 + 1000);
        });
    }

    // Sass编译动画
    animateSassCompilation(layer) {
        return new Promise(resolve => {
            const sassItem = layer.querySelector('[data-tech="sass"]');
            if (sassItem) {
                this.createCompilationEffect(sassItem, 'SCSS → CSS');
            }
            setTimeout(resolve, 1200);
        });
    }

    // 响应式布局动画
    animateResponsiveLayout(layer) {
        return new Promise(resolve => {
            const container = layer.querySelector('.layer-content');
            if (container) {
                container.classList.add('responsive-demo');
                
                // 模拟不同屏幕尺寸
                const sizes = ['desktop', 'tablet', 'mobile'];
                sizes.forEach((size, index) => {
                    setTimeout(() => {
                        container.className = `layer-content responsive-demo ${size}`;
                    }, index * 400);
                });
            }
            setTimeout(resolve, 1500);
        });
    }

    // 组件生命周期动画
    animateComponentLifecycle(layer) {
        return new Promise(resolve => {
            const items = layer.querySelectorAll('.tech-item');
            const lifecycle = ['Mount', 'Update', 'Unmount'];
            
            items.forEach((item, index) => {
                lifecycle.forEach((phase, phaseIndex) => {
                    setTimeout(() => {
                        this.showLifecyclePhase(item, phase);
                    }, index * 300 + phaseIndex * 500);
                });
            });
            
            setTimeout(resolve, 2000);
        });
    }

    // 框架对比动画
    animateFrameworkComparison(layer) {
        return new Promise(resolve => {
            const frameworks = layer.querySelectorAll('[data-tech*="react"], [data-tech*="vue"], [data-tech*="angular"]');
            
            frameworks.forEach((framework, index) => {
                setTimeout(() => {
                    framework.classList.add('framework-highlight');
                    this.createFrameworkBadge(framework);
                }, index * 400);
            });
            
            setTimeout(resolve, 1600);
        });
    }

    // 数据流动画
    animateDataFlow(layer) {
        return new Promise(resolve => {
            const items = layer.querySelectorAll('.tech-item');
            
            // 创建数据流路径
            items.forEach((item, index) => {
                setTimeout(() => {
                    this.createDataStreamEffect(item);
                }, index * 200);
            });
            
            setTimeout(resolve, 1500);
        });
    }

    // 状态管理动画
    animateStateManagement(layer) {
        return new Promise(resolve => {
            const stateItems = layer.querySelectorAll('[data-tech*="redux"], [data-tech*="vuex"], [data-tech*="pinia"]');
            
            stateItems.forEach(item => {
                this.createStateTree(item);
            });
            
            setTimeout(resolve, 1200);
        });
    }

    // 网络请求动画
    animateNetworkRequests(layer) {
        return new Promise(resolve => {
            const networkItems = layer.querySelectorAll('.tech-item');
            
            networkItems.forEach((item, index) => {
                setTimeout(() => {
                    this.createNetworkPulse(item);
                }, index * 300);
            });
            
            setTimeout(resolve, 1500);
        });
    }

    // WebSocket动画
    animateWebSocket(layer) {
        return new Promise(resolve => {
            const wsItem = layer.querySelector('[data-tech*="websocket"]');
            if (wsItem) {
                this.createRealtimeConnection(wsItem);
            }
            setTimeout(resolve, 1000);
        });
    }

    // 模块打包动画
    animateModuleBundling(layer) {
        return new Promise(resolve => {
            const buildItems = layer.querySelectorAll('.tech-item');
            
            // 模拟模块收集和打包
            buildItems.forEach((item, index) => {
                setTimeout(() => {
                    this.createBundleEffect(item);
                }, index * 200);
            });
            
            setTimeout(resolve, 1800);
        });
    }

    // 热重载动画
    animateHotReload(layer) {
        return new Promise(resolve => {
            const viteItem = layer.querySelector('[data-tech*="vite"]');
            if (viteItem) {
                this.createHotReloadEffect(viteItem);
            }
            setTimeout(resolve, 1000);
        });
    }

    // 代码质量动画
    animateCodeQuality(layer) {
        return new Promise(resolve => {
            const qualityItems = layer.querySelectorAll('.tech-item');
            
            qualityItems.forEach((item, index) => {
                setTimeout(() => {
                    this.createQualityCheck(item);
                }, index * 250);
            });
            
            setTimeout(resolve, 1400);
        });
    }

    // 测试动画
    animateTesting(layer) {
        return new Promise(resolve => {
            const testItems = layer.querySelectorAll('[data-tech*="jest"], [data-tech*="cypress"]');
            
            testItems.forEach(item => {
                this.createTestRunner(item);
            });
            
            setTimeout(resolve, 1200);
        });
    }

    // UI库动画
    animateUILibrary(layer) {
        return new Promise(resolve => {
            const uiItems = layer.querySelectorAll('.tech-item');
            
            uiItems.forEach((item, index) => {
                setTimeout(() => {
                    this.createUIComponentDemo(item);
                }, index * 200);
            });
            
            setTimeout(resolve, 1200);
        });
    }

    // 设计系统动画
    animateDesignSystem(layer) {
        return new Promise(resolve => {
            const designItems = layer.querySelectorAll('.tech-item');
            
            // 展示设计令牌
            designItems.forEach(item => {
                this.showDesignTokens(item);
            });
            
            setTimeout(resolve, 1000);
        });
    }

    // 性能优化动画
    animatePerformanceOptimization(layer) {
        return new Promise(resolve => {
            const perfItems = layer.querySelectorAll('.tech-item');
            
            perfItems.forEach((item, index) => {
                setTimeout(() => {
                    this.createPerformanceMetrics(item);
                }, index * 300);
            });
            
            setTimeout(resolve, 1500);
        });
    }

    // PWA动画
    animatePWA(layer) {
        return new Promise(resolve => {
            const pwaItem = layer.querySelector('[data-tech*="pwa"]');
            if (pwaItem) {
                this.createPWAInstallation(pwaItem);
            }
            setTimeout(resolve, 1200);
        });
    }

    // 部署管道动画
    animateDeploymentPipeline(layer) {
        return new Promise(resolve => {
            const deployItems = layer.querySelectorAll('.tech-item');
            
            // 模拟CI/CD流程
            const stages = ['Build', 'Test', 'Deploy'];
            stages.forEach((stage, index) => {
                setTimeout(() => {
                    deployItems.forEach(item => {
                        this.showDeploymentStage(item, stage);
                    });
                }, index * 500);
            });
            
            setTimeout(resolve, 1800);
        });
    }

    // 监控动画
    animateMonitoring(layer) {
        return new Promise(resolve => {
            const monitorItems = layer.querySelectorAll('.tech-item');
            
            monitorItems.forEach(item => {
                this.createMonitoringDashboard(item);
            });
            
            setTimeout(resolve, 1000);
        });
    }

    // WebGPU动画
    animateWebGPU(layer) {
        return new Promise(resolve => {
            const gpuItem = layer.querySelector('[data-tech*="webgpu"]');
            if (gpuItem) {
                this.create3DVisualization(gpuItem);
            }
            setTimeout(resolve, 2000);
        });
    }

    // 3D效果动画
    animate3DEffects(layer) {
        return new Promise(resolve => {
            layer.classList.add('frontier-3d');
            this.createQuantumField(layer);
            setTimeout(resolve, 1500);
        });
    }

    // 辅助方法 - 创建代码粒子
    createCodeParticles(element, code, color) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'code-particle';
            particle.textContent = code;
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                color: ${color};
                font-family: 'Roboto Mono', monospace;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                animation: codeParticleFloat 2s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    // 辅助方法 - 布局变化动画
    animateLayoutChange(element) {
        const layouts = ['flex', 'grid', 'block'];
        let currentLayout = 0;
        
        const changeLayout = () => {
            element.style.display = layouts[currentLayout];
            element.classList.add('layout-change');
            currentLayout = (currentLayout + 1) % layouts.length;
            
            if (currentLayout !== 0) {
                setTimeout(changeLayout, 300);
            }
        };
        
        changeLayout();
    }

    // 辅助方法 - 创建逻辑流
    createLogicFlow(element) {
        const flowLine = document.createElement('div');
        flowLine.className = 'logic-flow';
        flowLine.style.cssText = `
            position: absolute;
            width: 2px;
            height: 0;
            background: linear-gradient(to bottom, #F7DF1E, transparent);
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            animation: logicFlowGrow 1s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.appendChild(flowLine);
        
        setTimeout(() => {
            flowLine.remove();
        }, 1000);
    }

    // 更新播放按钮状态
    updatePlayButton(isPlaying) {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.textContent = isPlaying ? '⏸️ 暂停' : '▶️ 播放';
            playBtn.disabled = isPlaying;
        }
    }

    // 技术项点击动画
    animateTechItem(item) {
        item.classList.add('tech-item-clicked');
        
        // 创建涟漪效果
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        item.appendChild(ripple);
        
        setTimeout(() => {
            item.classList.remove('tech-item-clicked');
            ripple.remove();
        }, 600);
        
        // 触发粒子爆发
        const rect = item.getBoundingClientRect();
        if (window.particleSystem) {
            window.particleSystem.createBurst(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                15
            );
        }
    }

    // 其他辅助动画方法...
    createCompilationEffect(element, text) {
        const effect = document.createElement('div');
        effect.className = 'compilation-effect';
        effect.textContent = text;
        element.appendChild(effect);
        
        setTimeout(() => effect.remove(), 1200);
    }

    showLifecyclePhase(element, phase) {
        const badge = document.createElement('div');
        badge.className = 'lifecycle-badge';
        badge.textContent = phase;
        element.appendChild(badge);
        
        setTimeout(() => badge.remove(), 500);
    }

    createFrameworkBadge(element) {
        const badge = document.createElement('div');
        badge.className = 'framework-badge';
        badge.textContent = '⚡';
        element.appendChild(badge);
        
        setTimeout(() => badge.remove(), 1600);
    }

    createDataStreamEffect(element) {
        element.classList.add('data-stream');
        setTimeout(() => element.classList.remove('data-stream'), 1500);
    }

    createStateTree(element) {
        element.classList.add('state-tree');
        setTimeout(() => element.classList.remove('state-tree'), 1200);
    }

    createNetworkPulse(element) {
        element.classList.add('network-pulse');
        setTimeout(() => element.classList.remove('network-pulse'), 1500);
    }

    createRealtimeConnection(element) {
        element.classList.add('realtime-connection');
        setTimeout(() => element.classList.remove('realtime-connection'), 1000);
    }

    createBundleEffect(element) {
        element.classList.add('bundle-effect');
        setTimeout(() => element.classList.remove('bundle-effect'), 1800);
    }

    createHotReloadEffect(element) {
        element.classList.add('hot-reload');
        setTimeout(() => element.classList.remove('hot-reload'), 1000);
    }

    createQualityCheck(element) {
        element.classList.add('quality-check');
        setTimeout(() => element.classList.remove('quality-check'), 1400);
    }

    createTestRunner(element) {
        element.classList.add('test-runner');
        setTimeout(() => element.classList.remove('test-runner'), 1200);
    }

    createUIComponentDemo(element) {
        element.classList.add('ui-demo');
        setTimeout(() => element.classList.remove('ui-demo'), 1200);
    }

    showDesignTokens(element) {
        element.classList.add('design-tokens');
        setTimeout(() => element.classList.remove('design-tokens'), 1000);
    }

    createPerformanceMetrics(element) {
        element.classList.add('performance-metrics');
        setTimeout(() => element.classList.remove('performance-metrics'), 1500);
    }

    createPWAInstallation(element) {
        element.classList.add('pwa-install');
        setTimeout(() => element.classList.remove('pwa-install'), 1200);
    }

    showDeploymentStage(element, stage) {
        const stageElement = document.createElement('div');
        stageElement.className = 'deployment-stage';
        stageElement.textContent = stage;
        element.appendChild(stageElement);
        
        setTimeout(() => stageElement.remove(), 500);
    }

    createMonitoringDashboard(element) {
        element.classList.add('monitoring-dashboard');
        setTimeout(() => element.classList.remove('monitoring-dashboard'), 1000);
    }

    create3DVisualization(element) {
        element.classList.add('webgpu-3d');
        setTimeout(() => element.classList.remove('webgpu-3d'), 2000);
    }

    createQuantumField(layer) {
        layer.classList.add('quantum-field');
        setTimeout(() => layer.classList.remove('quantum-field'), 1500);
    }
}

// 初始化动画控制器
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}