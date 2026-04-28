// Frontend Universe - 性能优化模块

class PerformanceOptimizer {
    constructor() {
        this.isOptimized = false;
        this.observers = new Map();
        this.throttledFunctions = new Map();
        this.deferredAnimations = [];
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0
        };
        
        this.init();
    }

    init() {
        this.measurePerformance();
        this.setupLazyLoading();
        this.optimizeAnimations();
        this.setupResponsiveDesign();
        this.enableVirtualScrolling();
        this.setupMemoryManagement();
    }

    // 性能测量
    measurePerformance() {
        // 页面加载时间
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.performanceMetrics.loadTime = loadTime;
            console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
        });

        // 首次内容绘制 (FCP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`首次内容绘制: ${entry.startTime.toFixed(2)}ms`);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }

        // 内存使用监控
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage = memory.usedJSHeapSize;
                
                // 内存使用过高时警告
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('内存使用过高，建议清理');
                    this.cleanupMemory();
                }
            }, 10000);
        }
    }

    // 懒加载设置
    setupLazyLoading() {
        // 图片懒加载
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '50px' });

        // 观察所有带有data-src的图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // 组件懒加载
        const componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    if (component.dataset.lazyComponent) {
                        this.loadComponent(component);
                        componentObserver.unobserve(component);
                    }
                }
            });
        }, { rootMargin: '100px' });

        document.querySelectorAll('[data-lazy-component]').forEach(component => {
            componentObserver.observe(component);
        });

        this.observers.set('image', imageObserver);
        this.observers.set('component', componentObserver);
    }

    // 动画优化
    optimizeAnimations() {
        // 减少动画频率
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
            document.documentElement.style.setProperty('--transition-duration', '0.1s');
        }

        // 动画帧优化
        let animationFrameId;
        const optimizedAnimationFrame = (callback) => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(callback);
        };

        // 批量DOM操作
        this.batchDOMUpdates = this.debounce(() => {
            this.deferredAnimations.forEach(animation => animation());
            this.deferredAnimations = [];
        }, 16);
    }

    // 响应式设计优化
    setupResponsiveDesign() {
        // 断点管理
        const breakpoints = {
            mobile: '(max-width: 768px)',
            tablet: '(min-width: 769px) and (max-width: 1024px)',
            desktop: '(min-width: 1025px)'
        };

        Object.entries(breakpoints).forEach(([name, query]) => {
            const mediaQuery = window.matchMedia(query);
            
            const handleBreakpointChange = (e) => {
                if (e.matches) {
                    document.body.setAttribute('data-breakpoint', name);
                    this.optimizeForBreakpoint(name);
                }
            };

            mediaQuery.addListener(handleBreakpointChange);
            handleBreakpointChange(mediaQuery);
        });

        // 视口变化优化
        const resizeObserver = new ResizeObserver(this.throttle((entries) => {
            entries.forEach(entry => {
                const { width, height } = entry.contentRect;
                this.handleViewportChange(width, height);
            });
        }, 100));

        resizeObserver.observe(document.documentElement);
        this.observers.set('resize', resizeObserver);
    }

    // 虚拟滚动
    enableVirtualScrolling() {
        const virtualScrollContainers = document.querySelectorAll('[data-virtual-scroll]');
        
        virtualScrollContainers.forEach(container => {
            const itemHeight = parseInt(container.dataset.itemHeight) || 50;
            const items = Array.from(container.children);
            const visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
            
            let scrollTop = 0;
            let startIndex = 0;
            
            const updateVisibleItems = () => {
                const newStartIndex = Math.floor(scrollTop / itemHeight);
                const endIndex = Math.min(newStartIndex + visibleCount, items.length);
                
                if (newStartIndex !== startIndex) {
                    startIndex = newStartIndex;
                    
                    // 隐藏不可见项目
                    items.forEach((item, index) => {
                        if (index < startIndex || index >= endIndex) {
                            item.style.display = 'none';
                        } else {
                            item.style.display = '';
                            item.style.transform = `translateY(${index * itemHeight}px)`;
                        }
                    });
                }
            };

            container.addEventListener('scroll', this.throttle(() => {
                scrollTop = container.scrollTop;
                updateVisibleItems();
            }, 16));

            updateVisibleItems();
        });
    }

    // 内存管理
    setupMemoryManagement() {
        // 清理未使用的事件监听器
        const cleanupEventListeners = () => {
            // 移除已分离的DOM元素的事件监听器
            const elements = document.querySelectorAll('[data-cleanup-listeners]');
            elements.forEach(element => {
                if (!document.contains(element)) {
                    // 清理事件监听器
                    element.removeEventListener('click', null);
                    element.removeEventListener('mouseover', null);
                    element.removeEventListener('mouseout', null);
                }
            });
        };

        // 定期清理
        setInterval(cleanupEventListeners, 30000);

        // 页面隐藏时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    // 工具函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 断点优化
    optimizeForBreakpoint(breakpoint) {
        switch (breakpoint) {
            case 'mobile':
                this.enableMobileOptimizations();
                break;
            case 'tablet':
                this.enableTabletOptimizations();
                break;
            case 'desktop':
                this.enableDesktopOptimizations();
                break;
        }
    }

    enableMobileOptimizations() {
        // 减少动画复杂度
        document.documentElement.style.setProperty('--particle-count', '20');
        document.documentElement.style.setProperty('--animation-complexity', 'low');
        
        // 禁用某些效果
        const heavyEffects = document.querySelectorAll('.heavy-effect');
        heavyEffects.forEach(effect => {
            effect.style.display = 'none';
        });
    }

    enableTabletOptimizations() {
        document.documentElement.style.setProperty('--particle-count', '50');
        document.documentElement.style.setProperty('--animation-complexity', 'medium');
    }

    enableDesktopOptimizations() {
        document.documentElement.style.setProperty('--particle-count', '100');
        document.documentElement.style.setProperty('--animation-complexity', 'high');
        
        // 启用所有效果
        const heavyEffects = document.querySelectorAll('.heavy-effect');
        heavyEffects.forEach(effect => {
            effect.style.display = '';
        });
    }

    // 视口变化处理
    handleViewportChange(width, height) {
        // 更新粒子系统
        if (window.particleSystem) {
            window.particleSystem.resize(width, height);
        }

        // 更新3D效果
        if (window.frontendUniverse && window.frontendUniverse.threeDController) {
            window.frontendUniverse.threeDController.handleResize(width, height);
        }
    }

    // 组件懒加载
    loadComponent(element) {
        const componentType = element.dataset.lazyComponent;
        
        switch (componentType) {
            case 'tech-details':
                this.loadTechDetails(element);
                break;
            case 'animation-preview':
                this.loadAnimationPreview(element);
                break;
            default:
                console.warn(`未知的懒加载组件类型: ${componentType}`);
        }
    }

    loadTechDetails(element) {
        // 动态加载技术详情组件
        const techId = element.dataset.techId;
        if (techId && window.TECH_DATA && window.TECH_DATA[techId]) {
            const techData = window.TECH_DATA[techId];
            element.innerHTML = `
                <div class="tech-details-content">
                    <h3>${techData.title}</h3>
                    <p>${techData.description}</p>
                </div>
            `;
            element.classList.add('loaded');
        }
    }

    loadAnimationPreview(element) {
        // 动态加载动画预览
        const animationType = element.dataset.animationType;
        element.innerHTML = `
            <div class="animation-preview-content">
                <div class="preview-placeholder">
                    动画预览: ${animationType}
                </div>
            </div>
        `;
        element.classList.add('loaded');
    }

    // 动画控制
    pauseAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }

    // 内存清理
    cleanupMemory() {
        // 清理缓存
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('temp')) {
                        caches.delete(name);
                    }
                });
            });
        }

        // 强制垃圾回收（如果可用）
        if (window.gc) {
            window.gc();
        }
    }

    // 获取性能报告
    getPerformanceReport() {
        return {
            ...this.performanceMetrics,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // 销毁
    destroy() {
        this.observers.forEach(observer => {
            if (observer.disconnect) {
                observer.disconnect();
            }
        });
        this.observers.clear();
        this.throttledFunctions.clear();
        this.deferredAnimations = [];
    }
}

// 初始化性能优化器
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}