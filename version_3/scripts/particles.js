// Frontend Universe - 粒子系统

class ParticleSystem {
    constructor(container) {
        this.container = container || document.getElementById('particle-background');
        this.particles = [];
        this.maxParticles = 100;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        this.createCanvas();
        this.setupParticles();
        this.start();
        this.setupEventListeners();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
    }

    setupParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            color: this.getRandomColor(),
            life: Math.random() * 100 + 50,
            maxLife: 100,
            type: Math.floor(Math.random() * 3) + 1
        };
    }

    getRandomColor() {
        const colors = [
            '#38BDF8', // 科技蓝
            '#A855F7', // 紫能量
            '#FACC15', // 高亮黄
            '#22C55E', // 绿色
            '#EC4899'  // 粉色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticle(particle) {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测和重生
        if (particle.x < 0 || particle.x > this.width || 
            particle.y < 0 || particle.y > this.height) {
            this.resetParticle(particle);
        }

        // 生命周期
        particle.life--;
        if (particle.life <= 0) {
            this.resetParticle(particle);
        }

        // 透明度变化
        particle.opacity = (particle.life / particle.maxLife) * 0.7;
    }

    resetParticle(particle) {
        const side = Math.floor(Math.random() * 4);
        
        switch (side) {
            case 0: // 顶部
                particle.x = Math.random() * this.width;
                particle.y = -10;
                particle.vy = Math.random() * 0.5 + 0.1;
                particle.vx = (Math.random() - 0.5) * 0.3;
                break;
            case 1: // 右侧
                particle.x = this.width + 10;
                particle.y = Math.random() * this.height;
                particle.vx = -(Math.random() * 0.5 + 0.1);
                particle.vy = (Math.random() - 0.5) * 0.3;
                break;
            case 2: // 底部
                particle.x = Math.random() * this.width;
                particle.y = this.height + 10;
                particle.vy = -(Math.random() * 0.5 + 0.1);
                particle.vx = (Math.random() - 0.5) * 0.3;
                break;
            case 3: // 左侧
                particle.x = -10;
                particle.y = Math.random() * this.height;
                particle.vx = Math.random() * 0.5 + 0.1;
                particle.vy = (Math.random() - 0.5) * 0.3;
                break;
        }

        particle.life = particle.maxLife;
        particle.color = this.getRandomColor();
        particle.size = Math.random() * 2 + 0.5;
        particle.type = Math.floor(Math.random() * 3) + 1;
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        
        switch (particle.type) {
            case 1: // 圆形粒子
                this.drawCircleParticle(particle);
                break;
            case 2: // 星形粒子
                this.drawStarParticle(particle);
                break;
            case 3: // 方形粒子
                this.drawSquareParticle(particle);
                break;
        }
        
        this.ctx.restore();
    }

    drawCircleParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        // 添加发光效果
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = particle.size * 2;
        this.ctx.fill();
    }

    drawStarParticle(particle) {
        const spikes = 5;
        const outerRadius = particle.size;
        const innerRadius = particle.size * 0.5;
        
        this.ctx.beginPath();
        this.ctx.translate(particle.x, particle.y);
        
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        this.ctx.translate(-particle.x, -particle.y);
    }

    drawSquareParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.life * 0.02);
        
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        
        this.ctx.restore();
    }

    drawConnections() {
        // 绘制粒子间的连接线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.1;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = '#38BDF8';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // 绘制连接线
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupEventListeners() {
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.setupParticles();
        });

        // 鼠标交互
        this.canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        // 鼠标附近的粒子会被吸引
        this.particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100 * 0.01;
                particle.vx += dx * force;
                particle.vy += dy * force;
                
                // 限制速度
                const maxSpeed = 2;
                const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > maxSpeed) {
                    particle.vx = (particle.vx / speed) * maxSpeed;
                    particle.vy = (particle.vy / speed) * maxSpeed;
                }
            }
        });
    }

    // 创建爆发效果
    createBurst(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x;
            particle.y = y;
            
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 2 + 1;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.life = 30;
            particle.maxLife = 30;
            
            this.particles.push(particle);
        }
        
        // 移除多余的粒子
        if (this.particles.length > this.maxParticles + count) {
            this.particles.splice(0, count);
        }
    }

    // 设置粒子密度
    setDensity(density) {
        this.maxParticles = Math.max(10, Math.min(200, density));
        this.setupParticles();
    }

    // 设置粒子速度
    setSpeed(speedMultiplier) {
        this.particles.forEach(particle => {
            particle.vx *= speedMultiplier;
            particle.vy *= speedMultiplier;
        });
    }

    // 销毁粒子系统
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
    }

    // 添加resize方法
    resize(width, height) {
        if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
            this.width = width;
            this.height = height;
        }
    }
}

// 数据流粒子系统
class DataFlowParticles {
    constructor() {
        this.flows = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.start();
    }

    createCanvas() {
        this.canvas = document.getElementById('data-flow-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'data-flow-canvas';
            document.querySelector('.data-flow-container').appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDataFlow(startX, startY, endX, endY, color = '#38BDF8') {
        const flow = {
            startX,
            startY,
            endX,
            endY,
            particles: [],
            color,
            active: true
        };

        // 创建流动粒子
        for (let i = 0; i < 10; i++) {
            flow.particles.push({
                progress: i * 0.1,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.5
            });
        }

        this.flows.push(flow);
        return flow;
    }

    updateFlows() {
        this.flows.forEach(flow => {
            if (!flow.active) return;

            flow.particles.forEach(particle => {
                particle.progress += 0.02;
                if (particle.progress > 1) {
                    particle.progress = 0;
                }
            });
        });
    }

    drawFlows() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.flows.forEach(flow => {
            if (!flow.active) return;

            flow.particles.forEach(particle => {
                const x = flow.startX + (flow.endX - flow.startX) * particle.progress;
                const y = flow.startY + (flow.endY - flow.startY) * particle.progress;

                this.ctx.save();
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.fillStyle = flow.color;
                this.ctx.shadowColor = flow.color;
                this.ctx.shadowBlur = particle.size * 2;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        });
    }

    animate() {
        this.updateFlows();
        this.drawFlows();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.animate();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    clearFlows() {
        this.flows = [];
    }
}

// 初始化粒子系统
document.addEventListener('DOMContentLoaded', () => {
    // 背景粒子系统
    window.particleSystem = new ParticleSystem();
    
    // 数据流粒子系统
    window.dataFlowParticles = new DataFlowParticles();
    
    // 为技术层级添加数据流
    setTimeout(() => {
        const layers = document.querySelectorAll('.tech-layer');
        layers.forEach((layer, index) => {
            if (index < layers.length - 1) {
                const rect1 = layer.getBoundingClientRect();
                const rect2 = layers[index + 1].getBoundingClientRect();
                
                window.dataFlowParticles.createDataFlow(
                    rect1.left + rect1.width / 2,
                    rect1.bottom,
                    rect2.left + rect2.width / 2,
                    rect2.top,
                    '#38BDF8'
                );
            }
        });
    }, 2000);
});

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, DataFlowParticles };
}