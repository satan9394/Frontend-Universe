// 全局变量
let isAnimationPlaying = false;
let currentLayer = 0;
let animationProgress = 0;
let narrationEnabled = false;

// 音频配置
const ENABLE_AUDIO = false; // 设置为false禁用音频功能

// Canvas 上下文
let frameworkCanvas, dataFlowCanvas, networkCanvas, dimensionalCanvas;
let frameworkCtx, dataFlowCtx, networkCtx, dimensionalCtx;

// 动画帧ID
let animationFrameId;

// 音频元素
let backgroundMusic, narrationAudio;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvases();
    initializeAudio();
    setupEventListeners();
    createStarField();
    startBackgroundAnimations();
});

// 初始化Canvas
function initializeCanvases() {
    // 框架连接Canvas
    frameworkCanvas = document.getElementById('frameworkCanvas');
    if (frameworkCanvas) {
        frameworkCtx = frameworkCanvas.getContext('2d');
        resizeCanvas(frameworkCanvas);
    }

    // 数据流Canvas
    dataFlowCanvas = document.getElementById('dataFlowCanvas');
    if (dataFlowCanvas) {
        dataFlowCtx = dataFlowCanvas.getContext('2d');
        resizeCanvas(dataFlowCanvas);
    }

    // 网络Canvas
    networkCanvas = document.getElementById('networkCanvas');
    if (networkCanvas) {
        networkCtx = networkCanvas.getContext('2d');
        resizeCanvas(networkCanvas);
    }

    // 维度空间Canvas
    dimensionalCanvas = document.getElementById('dimensionalCanvas');
    if (dimensionalCanvas) {
        dimensionalCtx = dimensionalCanvas.getContext('2d');
        resizeCanvas(dimensionalCanvas);
    }

    // 窗口大小改变时重新调整Canvas
    window.addEventListener('resize', () => {
        if (frameworkCanvas) resizeCanvas(frameworkCanvas);
        if (dataFlowCanvas) resizeCanvas(dataFlowCanvas);
        if (networkCanvas) resizeCanvas(networkCanvas);
        if (dimensionalCanvas) resizeCanvas(dimensionalCanvas);
    });
}

// 调整Canvas大小
function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

// 初始化音频
function initializeAudio() {
    if (!ENABLE_AUDIO) {
        console.log('音频功能已禁用');
        return;
    }
    
    try {
        backgroundMusic = document.getElementById('backgroundMusic');
        narrationAudio = document.getElementById('narrationAudio');
        
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            backgroundMusic.loop = true;
        }
        
        if (narrationAudio) {
            narrationAudio.volume = 0.7;
        }
    } catch (error) {
        console.log('音频初始化失败，继续运行视觉效果:', error);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 滚动监听
    window.addEventListener('scroll', handleScroll);
    
    // 鼠标移动监听
    document.addEventListener('mousemove', handleMouseMove);
    
    // 键盘监听
    document.addEventListener('keydown', handleKeyDown);
}

// 开始探索按钮
function startJourney() {
    const introSection = document.getElementById('introSection');
    const techUniverse = document.getElementById('techUniverse');
    
    if (introSection && techUniverse) {
        introSection.classList.add('animate-out');
        setTimeout(() => {
            introSection.style.display = 'none';
            techUniverse.style.display = 'block';
            techUniverse.classList.add('animate-in');
            playAnimation();
        }, 500);
    }
}

// 播放动画
function playAnimation() {
    if (isAnimationPlaying) return;
    
    isAnimationPlaying = true;
    currentLayer = 0;
    animationProgress = 0;
    
    updateProgressIndicator();
    
    if (ENABLE_AUDIO && backgroundMusic && !backgroundMusic.paused) {
        try {
            backgroundMusic.play().catch(e => console.log('音频播放失败:', e));
        } catch (error) {
            console.log('背景音乐播放错误:', error);
        }
    }
    
    if (ENABLE_AUDIO && narrationEnabled && narrationAudio) {
        try {
            narrationAudio.play().catch(e => console.log('旁白播放失败:', e));
        } catch (error) {
            console.log('旁白播放错误:', error);
        }
    }
    
    animateToNextLayer();
}

// 暂停动画
function pauseAnimation() {
    isAnimationPlaying = false;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // 暂停音频
    if (ENABLE_AUDIO && backgroundMusic && !backgroundMusic.paused) {
        try {
            backgroundMusic.pause();
        } catch (error) {
            console.log('暂停背景音乐错误:', error);
        }
    }
    
    if (ENABLE_AUDIO && narrationAudio && !narrationAudio.paused) {
        try {
            narrationAudio.pause();
        } catch (error) {
            console.log('暂停旁白错误:', error);
        }
    }
    
    updateProgressText('动画已暂停');
}

// 重置动画
function resetAnimation() {
    isAnimationPlaying = false;
    currentLayer = 0;
    animationProgress = 0;
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // 重置所有层的状态
    const layers = document.querySelectorAll('.tech-layer');
    layers.forEach(layer => {
        layer.classList.remove('animate-in', 'active');
    });
    
    // 重置进度指示器
    updateProgressIndicator();
    updateProgressText('准备探索前端宇宙...');
    
    // 重置音频
    if (ENABLE_AUDIO && backgroundMusic) {
        try {
            backgroundMusic.currentTime = 0;
            backgroundMusic.pause();
        } catch (error) {
            console.log('重置背景音乐错误:', error);
        }
    }
    
    if (ENABLE_AUDIO && narrationAudio) {
        try {
            narrationAudio.currentTime = 0;
            narrationAudio.pause();
        } catch (error) {
            console.log('重置旁白错误:', error);
        }
    }
    
    // 显示开场
    const introSection = document.getElementById('introSection');
    const techUniverse = document.getElementById('techUniverse');
    
    if (introSection && techUniverse) {
        techUniverse.style.display = 'none';
        introSection.style.display = 'flex';
        introSection.classList.remove('animate-out');
        introSection.classList.add('animate-in');
    }
}

// 切换旁白
function toggleNarration() {
    if (!ENABLE_AUDIO) {
        console.log('音频功能已禁用');
        return;
    }
    
    narrationEnabled = !narrationEnabled;
    const btn = document.querySelector('.narration-btn');
    
    if (btn) {
        btn.textContent = narrationEnabled ? '🔇 关闭旁白' : '🎵 旁白';
        btn.style.background = narrationEnabled ? 
            'linear-gradient(45deg, rgba(255, 165, 0, 0.3), rgba(255, 140, 0, 0.3))' :
            'linear-gradient(45deg, rgba(0, 212, 255, 0.3), rgba(124, 58, 237, 0.3))';
    }
    
    if (narrationEnabled && isAnimationPlaying && narrationAudio) {
        try {
            narrationAudio.play().catch(e => console.log('旁白播放失败:', e));
        } catch (error) {
            console.log('旁白播放错误:', error);
        }
    } else if (narrationAudio) {
        try {
            narrationAudio.pause();
        } catch (error) {
            console.log('旁白暂停错误:', error);
        }
    }
}

// 动画到下一层
function animateToNextLayer() {
    if (!isAnimationPlaying || currentLayer >= 7) {
        if (currentLayer >= 7) {
            showConclusion();
        }
        return;
    }
    
    const layerNames = ['atomic', 'molecular', 'system', 'network', 'application', 'presentation', 'frontier'];
    const layerElement = document.getElementById(layerNames[currentLayer] + 'Layer');
    
    if (layerElement) {
        // 激活当前层
        layerElement.classList.add('animate-in', 'active');
        
        // 更新进度
        animationProgress = ((currentLayer + 1) / 7) * 100;
        updateProgressIndicator();
        
        // 执行特定层的动画
        switch(currentLayer) {
            case 0: animateAtomicLayer(); break;
            case 1: animateMolecularLayer(); break;
            case 2: animateSystemLayer(); break;
            case 3: animateNetworkLayer(); break;
            case 4: animateApplicationLayer(); break;
            case 5: animatePresentationLayer(); break;
            case 6: animateFrontierLayer(); break;
        }
        
        // 滚动到当前层
        layerElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // 设置下一层的延迟
        setTimeout(() => {
            currentLayer++;
            animateToNextLayer();
        }, 4000); // 每层4秒
    }
}

// 原子层动画
function animateAtomicLayer() {
    updateProgressText('构建基础语言原子...');
    
    const particles = document.querySelectorAll('.atomic-particles .particle');
    particles.forEach((particle, index) => {
        setTimeout(() => {
            particle.style.animation = 'particle-fusion 2s ease-in-out forwards';
        }, index * 500);
    });
    
    // 网页骨架构建动画
    setTimeout(() => {
        const skeleton = document.querySelector('.webpage-skeleton');
        if (skeleton) {
            skeleton.style.animation = 'skeleton-build 2s ease-in-out forwards';
        }
    }, 1500);
}

// 分子层动画
function animateMolecularLayer() {
    updateProgressText('框架能量核心聚合...');
    
    // 绘制框架连接线
    if (frameworkCtx) {
        drawFrameworkConnections();
    }
    
    // 激活框架核心
    const cores = document.querySelectorAll('.energy-core');
    cores.forEach((core, index) => {
        setTimeout(() => {
            core.style.animation = 'core-activation 2s ease-in-out forwards';
        }, index * 600);
    });
}

// 系统层动画
function animateSystemLayer() {
    updateProgressText('工程化管道构建中...');
    
    // 齿轮旋转动画
    const gears = document.querySelectorAll('.tool-gear');
    gears.forEach(gear => {
        gear.style.animation = 'gear-rotate 2s linear infinite';
    });
    
    // 数据流动画
    if (dataFlowCtx) {
        drawDataFlow();
    }
}

// 网络层动画
function animateNetworkLayer() {
    updateProgressText('网络脉冲传输中...');
    
    // 网络脉冲动画
    if (networkCtx) {
        drawNetworkPulses();
    }
    
    // 节点激活
    const nodes = document.querySelectorAll('.network-node');
    nodes.forEach((node, index) => {
        setTimeout(() => {
            node.style.animation = 'node-activation 1.5s ease-in-out forwards';
        }, index * 400);
    });
}

// 应用层动画
function animateApplicationLayer() {
    updateProgressText('应用组件装配中...');
    
    // 状态管理中心脉冲
    const stateHub = document.querySelector('.state-hub');
    if (stateHub) {
        stateHub.style.animation = 'state-hub-activation 2s ease-in-out forwards';
    }
    
    // 组件装配动画
    const components = document.querySelectorAll('.demo-component');
    components.forEach((component, index) => {
        setTimeout(() => {
            component.style.animation = 'component-assemble 1s ease-in-out forwards';
        }, index * 300);
    });
}

// 表现层动画
function animatePresentationLayer() {
    updateProgressText('性能优化与体验提升...');
    
    // 性能指标动画
    const metrics = document.querySelectorAll('.metric');
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            metric.style.animation = 'metric-boost 1.5s ease-in-out forwards';
        }, index * 200);
    });
    
    // PWA特性展示
    const pwaFeatures = document.querySelectorAll('.pwa-feature');
    pwaFeatures.forEach((feature, index) => {
        setTimeout(() => {
            feature.style.animation = 'pwa-activate 1s ease-in-out forwards';
        }, index * 400);
    });
}

// 前沿层动画
function animateFrontierLayer() {
    updateProgressText('探索未来前端边界...');
    
    // 维度空间动画
    if (dimensionalCtx) {
        drawDimensionalSpace();
    }
    
    // 技术门户激活
    const portals = document.querySelectorAll('.tech-portal');
    portals.forEach((portal, index) => {
        setTimeout(() => {
            portal.style.animation = 'portal-activation 2s ease-in-out forwards';
        }, index * 500);
    });
}

// 显示结论
function showConclusion() {
    updateProgressText('前端宇宙探索完成！');
    
    const conclusionSection = document.getElementById('conclusionSection');
    if (conclusionSection) {
        conclusionSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        setTimeout(() => {
            conclusionSection.classList.add('animate-in');
        }, 1000);
    }
    
    // 完成动画
    setTimeout(() => {
        isAnimationPlaying = false;
        updateProgressText('探索完成 - 欢迎重新开始！');
    }, 3000);
}

// Canvas绘制函数
function drawFrameworkConnections() {
    if (!frameworkCtx) return;
    
    const canvas = frameworkCanvas;
    frameworkCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制连接线
    frameworkCtx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
    frameworkCtx.lineWidth = 2;
    frameworkCtx.setLineDash([5, 5]);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    
    // 绘制三角形连接
    frameworkCtx.beginPath();
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
            frameworkCtx.moveTo(x, y);
        } else {
            frameworkCtx.lineTo(x, y);
        }
    }
    frameworkCtx.closePath();
    frameworkCtx.stroke();
    
    // 绘制中心点
    frameworkCtx.fillStyle = 'rgba(0, 212, 255, 0.8)';
    frameworkCtx.beginPath();
    frameworkCtx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    frameworkCtx.fill();
}

function drawDataFlow() {
    if (!dataFlowCtx) return;
    
    const canvas = dataFlowCanvas;
    let time = 0;
    
    function animate() {
        dataFlowCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制数据流
        const gradient = dataFlowCtx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(255, 165, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
        
        dataFlowCtx.fillStyle = gradient;
        
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 6) * (i + 1);
            const x = (Math.sin(time + i) * 100) + canvas.width / 2;
            
            dataFlowCtx.beginPath();
            dataFlowCtx.arc(x, y, 3, 0, 2 * Math.PI);
            dataFlowCtx.fill();
        }
        
        time += 0.1;
        
        if (isAnimationPlaying) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function drawNetworkPulses() {
    if (!networkCtx) return;
    
    const canvas = networkCanvas;
    let pulseTime = 0;
    
    function animate() {
        networkCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制网络节点
        const nodes = [
            { x: canvas.width * 0.2, y: canvas.height * 0.3 },
            { x: canvas.width * 0.8, y: canvas.height * 0.3 },
            { x: canvas.width * 0.2, y: canvas.height * 0.7 },
            { x: canvas.width * 0.8, y: canvas.height * 0.7 }
        ];
        
        // 绘制连接线
        networkCtx.strokeStyle = 'rgba(0, 255, 127, 0.4)';
        networkCtx.lineWidth = 2;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                networkCtx.beginPath();
                networkCtx.moveTo(nodes[i].x, nodes[i].y);
                networkCtx.lineTo(nodes[j].x, nodes[j].y);
                networkCtx.stroke();
            }
        }
        
        // 绘制脉冲
        nodes.forEach((node, index) => {
            const pulseRadius = (Math.sin(pulseTime + index) + 1) * 20 + 10;
            const alpha = (Math.sin(pulseTime + index) + 1) * 0.5;
            
            networkCtx.fillStyle = `rgba(0, 255, 127, ${alpha})`;
            networkCtx.beginPath();
            networkCtx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
            networkCtx.fill();
        });
        
        pulseTime += 0.1;
        
        if (isAnimationPlaying) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function drawDimensionalSpace() {
    if (!dimensionalCtx) return;
    
    const canvas = dimensionalCanvas;
    let spaceTime = 0;
    
    function animate() {
        dimensionalCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制维度网格
        dimensionalCtx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        dimensionalCtx.lineWidth = 1;
        
        const gridSize = 50;
        const offsetX = (spaceTime * 20) % gridSize;
        const offsetY = (spaceTime * 15) % gridSize;
        
        // 垂直线
        for (let x = -offsetX; x < canvas.width + gridSize; x += gridSize) {
            dimensionalCtx.beginPath();
            dimensionalCtx.moveTo(x, 0);
            dimensionalCtx.lineTo(x, canvas.height);
            dimensionalCtx.stroke();
        }
        
        // 水平线
        for (let y = -offsetY; y < canvas.height + gridSize; y += gridSize) {
            dimensionalCtx.beginPath();
            dimensionalCtx.moveTo(0, y);
            dimensionalCtx.lineTo(canvas.width, y);
            dimensionalCtx.stroke();
        }
        
        // 绘制能量门户
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const portalRadius = Math.sin(spaceTime) * 20 + 50;
        
        const gradient = dimensionalCtx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, portalRadius
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        dimensionalCtx.fillStyle = gradient;
        dimensionalCtx.beginPath();
        dimensionalCtx.arc(centerX, centerY, portalRadius, 0, 2 * Math.PI);
        dimensionalCtx.fill();
        
        spaceTime += 0.05;
        
        if (isAnimationPlaying) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// 创建星空背景
function createStarField() {
    const starsLayer = document.querySelector('.stars-layer');
    if (!starsLayer) return;
    
    // 动态创建更多星星
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.background = '#fff';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;
        star.style.animationDelay = Math.random() * 2 + 's';
        
        starsLayer.appendChild(star);
    }
}

// 开始背景动画
function startBackgroundAnimations() {
    // 星云漂移动画
    const nebulaLayer = document.querySelector('.nebula-layer');
    if (nebulaLayer) {
        setInterval(() => {
            const hue = Math.random() * 60 + 200; // 蓝紫色调
            nebulaLayer.style.filter = `hue-rotate(${hue}deg)`;
        }, 5000);
    }
}

// 处理滚动
function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // 视差效果
    const starsLayer = document.querySelector('.stars-layer');
    const nebulaLayer = document.querySelector('.nebula-layer');
    
    if (starsLayer) {
        starsLayer.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
    
    if (nebulaLayer) {
        nebulaLayer.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    
    // 检查层级可见性
    const layers = document.querySelectorAll('.tech-layer');
    layers.forEach((layer, index) => {
        const rect = layer.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible && !layer.classList.contains('visible')) {
            layer.classList.add('visible');
            
            // 更新进度指示器
            const indicators = document.querySelectorAll('.indicator');
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i <= index);
            });
        }
    });
}

// 处理鼠标移动
function handleMouseMove(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // 鼠标跟随效果
    const nebulaLayer = document.querySelector('.nebula-layer');
    if (nebulaLayer) {
        const offsetX = (mouseX - 0.5) * 20;
        const offsetY = (mouseY - 0.5) * 20;
        nebulaLayer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    
    // 粒子跟随效果
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const delay = index * 100;
        setTimeout(() => {
            const offsetX = (mouseX - 0.5) * 10;
            const offsetY = (mouseY - 0.5) * 10;
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }, delay);
    });
}

// 处理键盘输入
function handleKeyDown(e) {
    switch(e.key) {
        case ' ': // 空格键播放/暂停
            e.preventDefault();
            if (isAnimationPlaying) {
                pauseAnimation();
            } else {
                playAnimation();
            }
            break;
        case 'r': // R键重置
        case 'R':
            resetAnimation();
            break;
        case 'n': // N键切换旁白
        case 'N':
            toggleNarration();
            break;
        case 'ArrowRight': // 右箭头下一层
            if (!isAnimationPlaying && currentLayer < 7) {
                currentLayer++;
                animateToNextLayer();
            }
            break;
        case 'ArrowLeft': // 左箭头上一层
            if (!isAnimationPlaying && currentLayer > 0) {
                currentLayer--;
                animateToNextLayer();
            }
            break;
    }
}

// 更新进度指示器
function updateProgressIndicator() {
    const progressFill = document.querySelector('.progress-fill');
    const indicators = document.querySelectorAll('.indicator');
    
    if (progressFill) {
        progressFill.style.width = animationProgress + '%';
    }
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index < currentLayer);
    });
}

// 更新进度文本
function updateProgressText(text) {
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = text;
    }
}

// 添加CSS动画关键帧
const additionalStyles = `
@keyframes particle-fusion {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(180deg); }
    100% { transform: scale(1) rotate(360deg); }
}

@keyframes core-activation {
    0% { transform: scale(1); box-shadow: 0 0 20px rgba(97, 218, 251, 0.3); }
    50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(97, 218, 251, 0.6); }
    100% { transform: scale(1); box-shadow: 0 0 30px rgba(97, 218, 251, 0.5); }
}

@keyframes node-activation {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 0.9; }
}

@keyframes state-hub-activation {
    0% { transform: scale(1) rotate(0deg); }
    100% { transform: scale(1.1) rotate(360deg); }
}

@keyframes metric-boost {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1.1); }
}

@keyframes pwa-activate {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-10px) scale(1.1); }
    100% { transform: translateY(0px) scale(1); }
}

@keyframes portal-activation {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.9; }
}
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 导出函数供HTML调用
window.startJourney = startJourney;
window.playAnimation = playAnimation;
window.pauseAnimation = pauseAnimation;
window.resetAnimation = resetAnimation;
window.toggleNarration = toggleNarration;