# Frontend Universe — 前端全景宇宙

[![Three.js](https://img.shields.io/badge/Three.js-r158-black.svg)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green.svg)](https://greensock.com/gsap/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

交互式前端技术栈全景可视化项目——以"宇宙构建"为隐喻，从 HTML/CSS/JS 基础粒子到 WebGPU/AI 前沿星门，动态展示前端技术的演进与关联。

## ✨ 版本演进

| 版本 | 路径 | 技术栈 | 特色 |
|------|------|--------|------|
| **V1** | `version_1/` | Vanilla HTML/CSS/JS | 6 层技术展示 + CSS 动画 + 滚动触发 |
| **V2** | `version_2/` | Canvas + Web Audio | 7 层宇宙 + 粒子系统 + 音频旁白 |
| **V3** | `version_3/` | Three.js + GSAP | 3D 场景 + 模块化架构 + 性能优化 |

### V1 — 前端星图
- HTML 骨架塔 / CSS 色彩波纹 / JS 粒子能量流
- 框架行星轨道（React/Vue/Angular）
- 工程化齿轮系统（Webpack/Vite/Babel）

### V2 — 七层技术宇宙
- 原子层→分子层→系统层→网络层→应用层→表现层→前沿层
- 神经网络数据流、GPU 星门
- 背景音乐 + 进度指示 + 键盘快捷键

### V3 — 3D 全景宇宙
- Three.js 3D 场景渲染
- GSAP 流畅动画引擎
- 模块化脚本架构（animations / particles / 3d-effects / interactions）
- 性能监控面板

## 🚀 运行

### V1 / V2
直接打开 `index.html` 即可。

### V3
```bash
cd version_3
npm install
npm run dev     # 开发模式
npm run build   # 打包
```

## 🏗 V3 项目结构

```
version_3/
├── index.html              # 入口
├── package.json            # 依赖（Three.js + GSAP）
├── scripts/
│   ├── main.js             # 初始化 + 生命周期
│   ├── animations.js       # 动画引擎
│   ├── particles.js         # 粒子系统
│   ├── 3d-effects.js       # Three.js 3D 效果
│   ├── interactions.js     # 用户交互
│   ├── tech-data.js        # 技术栈数据
│   ├── tech-components.js  # 技术组件
│   └── performance.js      # 性能监控
└── styles/
    ├── main.css            # 主样式
    ├── layers.css          # 层级样式
    └── animations.css      # 动画样式
```

## 📝 License

MIT
