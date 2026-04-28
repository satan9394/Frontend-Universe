// Frontend Universe - 3D Effects and WebGPU Module

class ThreeDEffectsController {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.webgpuSupported = false;
        this.animationId = null;
        
        this.init();
    }

    async init() {
        await this.checkWebGPUSupport();
        this.setupThreeJS();
        this.createParticleSystem();
        this.setupEventListeners();
        this.startAnimation();
    }

    async checkWebGPUSupport() {
        if ('gpu' in navigator) {
            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) {
                    this.webgpuSupported = true;
                    console.log('WebGPU is supported!');
                    this.initWebGPU();
                }
            } catch (error) {
                console.log('WebGPU not available:', error);
            }
        }
    }

    setupThreeJS() {
        // 检查是否有Three.js库
        if (typeof THREE === 'undefined') {
            console.log('Three.js not loaded, using CSS 3D transforms instead');
            this.setupCSS3D();
            return;
        }

        // 创建场景
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // 添加到DOM
        const container = document.getElementById('three-container') || this.createThreeContainer();
        container.appendChild(this.renderer.domElement);

        // 设置相机位置
        this.camera.position.z = 5;
    }

    createThreeContainer() {
        const container = document.createElement('div');
        container.id = 'three-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(container);
        return container;
    }

    setupCSS3D() {
        // 使用CSS 3D变换作为后备方案
        this.createCSS3DParticles();
        this.animateCSS3DParticles();
    }

    createCSS3DParticles() {
        const container = document.createElement('div');
        container.id = 'css3d-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            perspective: 1000px;
        `;

        // 创建3D粒子
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'css3d-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #38BDF8, #A855F7);
                border-radius: 50%;
                transform-style: preserve-3d;
            `;
            
            // 随机位置
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const z = Math.random() * 500 - 250;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.transform = `translateZ(${z}px)`;
            
            container.appendChild(particle);
            this.particles.push({
                element: particle,
                x, y, z,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                vz: (Math.random() - 0.5) * 2
            });
        }

        document.body.appendChild(container);
    }

    animateCSS3DParticles() {
        const animate = () => {
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.z += particle.vz;

                // 边界检查
                if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
                if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
                if (particle.z < -250 || particle.z > 250) particle.vz *= -1;

                particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, ${particle.z}px)`;
            });

            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    createParticleSystem() {
        if (!this.scene) return;

        // 创建粒子几何体
        const geometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;
            positions[i + 1] = (Math.random() - 0.5) * 20;
            positions[i + 2] = (Math.random() - 0.5) * 20;

            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // 创建粒子材质
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        // 创建粒子系统
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particleSystem = particles;
    }

    async initWebGPU() {
        if (!this.webgpuSupported) return;

        try {
            const adapter = await navigator.gpu.requestAdapter();
            const device = await adapter.requestDevice();
            
            // 创建WebGPU渲染管道
            this.createWebGPUPipeline(device);
            
            // 显示WebGPU支持状态
            this.showWebGPUStatus(true);
        } catch (error) {
            console.error('WebGPU initialization failed:', error);
            this.showWebGPUStatus(false);
        }
    }

    createWebGPUPipeline(device) {
        // WebGPU着色器代码
        const shaderCode = `
            @vertex
            fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
                var pos = array<vec2<f32>, 3>(
                    vec2<f32>( 0.0,  0.5),
                    vec2<f32>(-0.5, -0.5),
                    vec2<f32>( 0.5, -0.5)
                );
                return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
            }

            @fragment
            fn fs_main() -> @location(0) vec4<f32> {
                return vec4<f32>(0.2, 0.7, 1.0, 1.0);
            }
        `;

        // 创建着色器模块
        const shaderModule = device.createShaderModule({
            code: shaderCode
        });

        console.log('WebGPU pipeline created successfully');
    }

    showWebGPUStatus(supported) {
        const frontierLayer = document.getElementById('frontier-layer');
        if (!frontierLayer) return;

        const statusElement = document.createElement('div');
        statusElement.className = 'webgpu-status';
        statusElement.innerHTML = `
            <div class="webgpu-indicator ${supported ? 'supported' : 'not-supported'}">
                <span class="status-icon">${supported ? '✅' : '❌'}</span>
                <span class="status-text">WebGPU ${supported ? 'Supported' : 'Not Available'}</span>
            </div>
        `;

        statusElement.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid ${supported ? '#22C55E' : '#EF4444'};
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.8rem;
            color: ${supported ? '#22C55E' : '#EF4444'};
            z-index: 10;
        `;

        frontierLayer.appendChild(statusElement);
    }

    startAnimation() {
        if (!this.renderer || !this.scene || !this.camera) return;

        const animate = () => {
            // 旋转粒子系统
            if (this.particleSystem) {
                this.particleSystem.rotation.x += 0.001;
                this.particleSystem.rotation.y += 0.002;
            }

            // 渲染场景
            this.renderer.render(this.scene, this.camera);
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    setupEventListeners() {
        // 窗口大小变化
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });

        // 鼠标移动效果
        document.addEventListener('mousemove', (event) => {
            if (this.camera) {
                const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                
                this.camera.position.x = mouseX * 0.5;
                this.camera.position.y = mouseY * 0.5;
            }
        });
    }

    // 创建量子场效果
    createQuantumField() {
        const frontierLayer = document.getElementById('frontier-layer');
        if (!frontierLayer) return;

        const quantumField = document.createElement('div');
        quantumField.className = 'quantum-field';
        quantumField.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.05) 0%, transparent 70%);
            animation: quantumPulse 4s ease-in-out infinite;
            pointer-events: none;
        `;

        frontierLayer.appendChild(quantumField);

        // 添加量子粒子
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #A855F7;
                border-radius: 50%;
                animation: quantumFloat ${2 + Math.random() * 3}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            quantumField.appendChild(particle);
        }
    }

    // 添加WebXR支持检测
    checkWebXRSupport() {
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                if (supported) {
                    this.showWebXRStatus(true);
                    this.createVRButton();
                } else {
                    this.showWebXRStatus(false);
                }
            });
        } else {
            this.showWebXRStatus(false);
        }
    }

    showWebXRStatus(supported) {
        const frontierLayer = document.getElementById('frontier-layer');
        if (!frontierLayer) return;

        const statusElement = document.createElement('div');
        statusElement.className = 'webxr-status';
        statusElement.innerHTML = `
            <div class="webxr-indicator ${supported ? 'supported' : 'not-supported'}">
                <span class="status-icon">${supported ? '🥽' : '❌'}</span>
                <span class="status-text">WebXR ${supported ? 'Ready' : 'Not Available'}</span>
            </div>
        `;

        statusElement.style.cssText = `
            position: absolute;
            top: 50px;
            right: 10px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid ${supported ? '#8B5CF6' : '#EF4444'};
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.8rem;
            color: ${supported ? '#8B5CF6' : '#EF4444'};
            z-index: 10;
        `;

        frontierLayer.appendChild(statusElement);
    }

    createVRButton() {
        const vrButton = document.createElement('button');
        vrButton.textContent = '🥽 Enter VR';
        vrButton.className = 'vr-button';
        vrButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #8B5CF6, #A855F7);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

        vrButton.addEventListener('click', () => {
            this.enterVR();
        });

        document.body.appendChild(vrButton);
    }

    async enterVR() {
        if (!navigator.xr) return;

        try {
            const session = await navigator.xr.requestSession('immersive-vr');
            console.log('VR session started');
            // 这里可以添加VR渲染逻辑
        } catch (error) {
            console.error('Failed to start VR session:', error);
        }
    }

    // 销毁方法
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // 清理DOM元素
        const containers = ['#three-container', '#css3d-container'];
        containers.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });
    }

    // 添加handleResize方法
    handleResize(width, height) {
        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
        
        if (this.renderer) {
            this.renderer.setSize(width, height);
        }
    }

    // 切换3D效果
    toggle() {
        const container = document.getElementById('three-container');
        if (container) {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
    }

    // 获取状态
    getStatus() {
        return {
            webgpuSupported: this.webgpuSupported,
            threeJSActive: !!this.renderer,
            css3DActive: !!document.querySelector('.css3d-particle')
        };
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes quantumPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
    }

    @keyframes quantumFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }

    .vr-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
    }
`;
document.head.appendChild(style);

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreeDEffectsController;
}

// 全局初始化
window.ThreeDEffectsController = ThreeDEffectsController;