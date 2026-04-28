// 全局变量
let animationState = {
    isPlaying: false,
    currentLayer: 0,
    totalLayers: 6,
    animationId: null
};

// 能量流画布
let energyCanvas;
let energyCtx;
let energyParticles = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initEnergyCanvas();
    initParticles();
    setupIntersectionObserver();
    startBackgroundAnimations();
});

// 初始化能量流画布
function initEnergyCanvas() {
    energyCanvas = document.getElementById('energyCanvas');
    if (energyCanvas) {
        energyCtx = energyCanvas.getContext('2d');
        
        // 设置画布尺寸
        function resizeCanvas() {
            const rect = energyCanvas.getBoundingClientRect();
            energyCanvas.width = rect.width;
            energyCanvas.height = rect.height;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // 开始绘制能量流
        drawEnergyFlow();
    }
}

// 初始化粒子系统
function initParticles() {
    energyParticles = [];
    for (let i = 0; i < 50; i++) {
        energyParticles.push({
            x: Math.random() * (energyCanvas?.width || 800),
            y: Math.random() * (energyCanvas?.height || 400),
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            color: `hsl(${Math.random() * 60 + 40}, 100%, 70%)` // 金色系
        });
    }
}

// 绘制能量流
function drawEnergyFlow() {
    if (!energyCtx || !energyCanvas) return;
    
    // 清空画布
    energyCtx.clearRect(0, 0, energyCanvas.width, energyCanvas.height);
    
    // 绘制连接线
    energyCtx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    energyCtx.lineWidth = 1;
    energyCtx.beginPath();
    
    for (let i = 0; i < energyParticles.length; i++) {
        for (let j = i + 1; j < energyParticles.length; j++) {
            const dx = energyParticles[i].x - energyParticles[j].x;
            const dy = energyParticles[i].y - energyParticles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const opacity = (100 - distance) / 100 * 0.5;
                energyCtx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
                energyCtx.beginPath();
                energyCtx.moveTo(energyParticles[i].x, energyParticles[i].y);
                energyCtx.lineTo(energyParticles[j].x, energyParticles[j].y);
                energyCtx.stroke();
            }
        }
    }
    
    // 绘制粒子
    energyParticles.forEach(particle => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界检测
        if (particle.x < 0 || particle.x > energyCanvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > energyCanvas.height) particle.vy *= -1;
        
        // 绘制粒子
        energyCtx.beginPath();
        energyCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        energyCtx.fillStyle = particle.color;
        energyCtx.globalAlpha = particle.opacity;
        energyCtx.fill();
        energyCtx.globalAlpha = 1;
        
        // 绘制光晕
        const gradient = energyCtx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        energyCtx.beginPath();
        energyCtx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        energyCtx.fillStyle = gradient;
        energyCtx.globalAlpha = particle.opacity * 0.3;
        energyCtx.fill();
        energyCtx.globalAlpha = 1;
    });
    
    // 继续动画
    requestAnimationFrame(drawEnergyFlow);
}

// 设置交叉观察器（用于滚动触发动画）
function setupIntersectionObserver() {
    const options = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                triggerLayerAnimation(entry.target);
            }
        });
    }, options);
    
    // 观察所有层级
    document.querySelectorAll('.layer').forEach(layer => {
        observer.observe(layer);
    });
}

// 触发特定层级的动画
function triggerLayerAnimation(layer) {
    const layerId = layer.id;
    
    switch(layerId) {
        case 'htmlLayer':
            animateHTMLLayer();
            break;
        case 'cssLayer':
            animateCSSLayer();
            break;
        case 'jsLayer':
            animateJSLayer();
            break;
        case 'frameworkLayer':
            animateFrameworkLayer();
            break;
        case 'toolingLayer':
            animateToolingLayer();
            break;
        case 'performanceLayer':
            animatePerformanceLayer();
            break;
    }
}

// HTML层动画
function animateHTMLLayer() {
    const tags = document.querySelectorAll('.tag-element');
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.animation = 'none';
            tag.offsetHeight; // 触发重排
            tag.style.animation = 'tagAppear 0.8s ease forwards, float 3s ease-in-out infinite';
            tag.style.animationDelay = `${index * 0.1}s, ${index * 0.1 + 0.8}s`;
        }, index * 100);
    });
}

// CSS层动画
function animateCSSLayer() {
    const waves = document.querySelectorAll('.wave');
    const layoutItems = document.querySelectorAll('.layout-showcase > div');
    
    // 重启波纹动画
    waves.forEach((wave, index) => {
        wave.style.animation = 'none';
        wave.offsetHeight;
        wave.style.animation = `waveMove 2s linear infinite`;
        wave.style.animationDelay = `${index * -0.7}s`;
    });
    
    // 布局展示动画
    layoutItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1.1)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 300);
        }, index * 200);
    });
}

// JavaScript层动画
function animateJSLayer() {
    const nodes = document.querySelectorAll('.energy-node');
    
    nodes.forEach((node, index) => {
        setTimeout(() => {
            // 创建能量爆发效果
            createEnergyBurst(node);
            
            // 节点动画
            node.style.animation = 'none';
            node.offsetHeight;
            node.style.animation = 'energyBurst 1s ease forwards, energyPulse 2s ease-in-out infinite';
            node.style.animationDelay = `0s, 1s`;
        }, index * 300);
    });
    
    // 增强粒子效果
    energyParticles.forEach(particle => {
        particle.vx *= 2;
        particle.vy *= 2;
        particle.opacity = Math.min(particle.opacity * 1.5, 1);
    });
    
    setTimeout(() => {
        energyParticles.forEach(particle => {
            particle.vx *= 0.5;
            particle.vy *= 0.5;
            particle.opacity *= 0.7;
        });
    }, 2000);
}

// 框架层动画
function animateFrameworkLayer() {
    const planets = document.querySelectorAll('.planet');
    
    planets.forEach((planet, index) => {
        setTimeout(() => {
            planet.style.animation = 'none';
            planet.offsetHeight;
            planet.style.animation = 'planetAppear 1s ease forwards, planetRotate 10s linear infinite';
            planet.style.animationDelay = `0s, 1s`;
            
            // 创建组件网络连线
            createComponentNetwork();
        }, index * 500);
    });
}

// 工程化层动画
function animateToolingLayer() {
    const gears = document.querySelectorAll('.gear');
    
    gears.forEach((gear, index) => {
        setTimeout(() => {
            gear.style.animation = 'none';
            gear.offsetHeight;
            gear.style.animation = 'gearAppear 0.8s ease forwards, gearRotate 4s linear infinite';
            gear.style.animationDelay = `0s, 0.8s`;
        }, index * 300);
    });
    
    // 创建数据流效果
    createDataFlow();
}

// 性能层动画
function animatePerformanceLayer() {
    const devices = document.querySelectorAll('.device');
    const metrics = document.querySelectorAll('.metric');
    
    devices.forEach((device, index) => {
        setTimeout(() => {
            device.style.animation = 'deviceRise 1s ease forwards';
        }, index * 200);
    });
    
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            metric.style.animation = 'none';
            metric.offsetHeight;
            metric.style.animation = 'metricActivate 0.8s ease forwards, metricPulse 2s ease-in-out infinite';
            metric.style.animationDelay = `0s, 0.8s`;
        }, index * 300 + 1000);
    });
}

// 创建能量爆发效果
function createEnergyBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'energy-burst-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 10) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// 创建组件网络连线
function createComponentNetwork() {
    const networkContainer = document.querySelector('.component-network');
    if (!networkContainer) return;
    
    networkContainer.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `;
    
    // 创建连接线
    for (let i = 0; i < 5; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', Math.random() * 100 + '%');
        line.setAttribute('y1', Math.random() * 100 + '%');
        line.setAttribute('x2', Math.random() * 100 + '%');
        line.setAttribute('y2', Math.random() * 100 + '%');
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        line.setAttribute('stroke-width', '2');
        line.style.animation = `lineAppear 2s ease ${i * 0.3}s forwards`;
        
        svg.appendChild(line);
    }
    
    networkContainer.appendChild(svg);
}

// 创建数据流效果
function createDataFlow() {
    const dataFlowContainer = document.querySelector('.data-flow');
    if (!dataFlowContainer) return;
    
    dataFlowContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const flow = document.createElement('div');
        flow.style.cssText = `
            position: absolute;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, transparent, #8dd6f9, transparent);
            top: ${30 + i * 20}%;
            animation: dataFlowMove 3s linear infinite;
            animation-delay: ${i * -1}s;
        `;
        
        dataFlowContainer.appendChild(flow);
    }
}

// 开始背景动画
function startBackgroundAnimations() {
    // 星空闪烁增强
    const starfield = document.querySelector('.starfield');
    if (starfield) {
        setInterval(() => {
            starfield.style.opacity = 0.8 + Math.random() * 0.2;
        }, 2000);
    }
}

// 主要控制函数
function startAnimation() {
    if (animationState.isPlaying) return;
    
    animationState.isPlaying = true;
    animationState.currentLayer = 0;
    
    updateProgressBar(0);
    updateProgressText('开始演示...');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 依次激活每个层级
    animateSequentially();
}

function animateSequentially() {
    const layers = document.querySelectorAll('.layer');
    
    function activateNextLayer() {
        if (animationState.currentLayer >= layers.length) {
            completeAnimation();
            return;
        }
        
        const currentLayer = layers[animationState.currentLayer];
        const progress = (animationState.currentLayer + 1) / layers.length * 100;
        
        // 滚动到当前层级
        currentLayer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // 激活动画
        setTimeout(() => {
            currentLayer.classList.add('active');
            triggerLayerAnimation(currentLayer);
            updateProgressBar(progress);
            updateProgressText(`正在展示: ${getLayerName(animationState.currentLayer)}`);
        }, 800);
        
        animationState.currentLayer++;
        
        // 设置下一层级的延迟
        setTimeout(activateNextLayer, 3000);
    }
    
    activateNextLayer();
}

function pauseAnimation() {
    animationState.isPlaying = false;
    updateProgressText('演示已暂停');
}

function resetAnimation() {
    animationState.isPlaying = false;
    animationState.currentLayer = 0;
    
    // 重置所有层级
    document.querySelectorAll('.layer').forEach(layer => {
        layer.classList.remove('active');
    });
    
    // 重置进度
    updateProgressBar(0);
    updateProgressText('准备开始...');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function completeAnimation() {
    animationState.isPlaying = false;
    updateProgressBar(100);
    updateProgressText('演示完成！');
    
    // 显示完成效果
    setTimeout(() => {
        createCompletionEffect();
    }, 500);
}

// 辅助函数
function updateProgressBar(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.setProperty('--progress', `${percentage}%`);
        progressBar.querySelector('::after') || 
        (progressBar.style.background = `linear-gradient(90deg, #00d4ff ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)`);
    }
}

function updateProgressText(text) {
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = text;
    }
}

function getLayerName(index) {
    const names = [
        'HTML结构层',
        'CSS表现层', 
        'JavaScript逻辑层',
        '框架宇宙',
        '工程化系统',
        '性能体验层'
    ];
    return names[index] || '未知层级';
}

function createCompletionEffect() {
    // 创建庆祝粒子效果
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: hsl(${Math.random() * 360}, 100%, 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: 50%;
            top: 50%;
        `;
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300;
        const duration = 2000 + Math.random() * 1000;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// 添加CSS动画关键帧
const additionalStyles = `
@keyframes tagAppear {
    0% { opacity: 0; transform: translateY(30px) rotateX(-90deg); }
    100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
}

@keyframes energyBurst {
    0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
    50% { transform: scale(1.3); box-shadow: 0 0 50px rgba(255, 215, 0, 0.8); }
    100% { transform: scale(1); box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }
}

@keyframes planetAppear {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes gearAppear {
    0% { opacity: 0; transform: scale(0); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes deviceRise {
    0% { opacity: 0; transform: translateY(50px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes metricActivate {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes lineAppear {
    0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
    100% { stroke-dasharray: 1000; stroke-dashoffset: 0; }
}

@keyframes dataFlowMove {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
}
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 添加鼠标交互效果
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-glow') || createCursorGlow();
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

function createCursorGlow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
    `;
    document.body.appendChild(cursor);
    return cursor;
}