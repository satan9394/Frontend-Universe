// 技术栈数据配置
const TECH_DATA = {
    // 1. 基础层
    foundation: {
        title: "基础层 - Foundation",
        subtitle: "HTML5 / CSS3 / JavaScript (ES6+)",
        description: "展示结构、表现、交互三分层",
        color: "#FF6B6B",
        technologies: {
            html5: {
                name: "HTML5",
                icon: "🏗️",
                description: "语义化结构静态展示",
                features: ["语义化标签", "表单增强", "多媒体支持", "离线存储"],
                animation: "structureGeneration"
            },
            css3: {
                name: "CSS3",
                icon: "🎨",
                description: "样式规则静态文档",
                features: ["Flexbox布局", "Grid布局", "动画效果", "响应式设计"],
                animation: "styleTransition"
            },
            javascript: {
                name: "JavaScript ES6+",
                icon: "⚡",
                description: "展示结构、表现、交互三分层",
                features: ["ES6+语法", "异步编程", "模块化", "DOM操作"],
                animation: "logicFlow"
            },
            dom: {
                name: "DOM",
                icon: "🌳",
                description: "文档对象模型操作",
                features: ["节点操作", "事件处理", "动态更新", "性能优化"],
                animation: "domManipulation"
            }
        }
    },

    // 2. 样式层
    styling: {
        title: "样式层 - Styling",
        subtitle: "Sass / Less / Tailwind CSS / CSS Modules",
        description: "展示响应式与模块化CSS",
        color: "#4ECDC4",
        technologies: {
            sass: {
                name: "Sass",
                icon: "💎",
                description: "CSS预处理器",
                features: ["变量", "嵌套", "混合", "继承"],
                animation: "preprocessorCompile"
            },
            less: {
                name: "Less",
                icon: "📘",
                description: "动态样式语言",
                features: ["变量", "混合", "函数", "作用域"],
                animation: "dynamicStyling"
            },
            tailwind: {
                name: "Tailwind CSS",
                icon: "🌊",
                description: "实用优先的CSS框架",
                features: ["原子化类", "响应式", "自定义", "JIT编译"],
                animation: "atomicStyling"
            },
            "css-modules": {
                name: "CSS Modules",
                icon: "📦",
                description: "模块化CSS解决方案",
                features: ["局部作用域", "组合", "依赖", "类名哈希"],
                animation: "modularStyling"
            }
        }
    },

    // 3. 组件层
    components: {
        title: "组件层 - Components",
        subtitle: "React / Vue / Angular / Svelte",
        description: "展示组件生命周期与数据流",
        color: "#45B7D1",
        technologies: {
            react: {
                name: "React",
                icon: "⚛️",
                description: "用于构建用户界面的库",
                features: ["虚拟DOM", "组件化", "单向数据流", "Hooks"],
                animation: "componentLifecycle"
            },
            vue: {
                name: "Vue.js",
                icon: "💚",
                description: "渐进式JavaScript框架",
                features: ["响应式", "模板语法", "组件系统", "生态丰富"],
                animation: "reactiveSystem"
            },
            angular: {
                name: "Angular",
                icon: "🅰️",
                description: "平台与框架",
                features: ["TypeScript", "依赖注入", "RxJS", "CLI工具"],
                animation: "enterpriseFramework"
            },
            svelte: {
                name: "Svelte",
                icon: "🔥",
                description: "编译时优化的框架",
                features: ["编译优化", "无虚拟DOM", "小体积", "高性能"],
                animation: "compileTimeOptimization"
            },
            nextjs: {
                name: "Next.js",
                icon: "▲",
                description: "React生产框架",
                features: ["SSR/SSG", "路由", "API路由", "优化"],
                animation: "fullStackFramework"
            }
        }
    },

    // 4. 状态层
    state: {
        title: "状态层 - State Management",
        subtitle: "Redux / Vuex / Pinia / MobX / Zustand",
        description: "展示单向数据流与订阅机制",
        color: "#96CEB4",
        technologies: {
            redux: {
                name: "Redux",
                icon: "🔄",
                description: "可预测的状态容器",
                features: ["单一数据源", "状态只读", "纯函数", "时间旅行"],
                animation: "stateFlow"
            },
            vuex: {
                name: "Vuex",
                icon: "🗃️",
                description: "Vue.js状态管理模式",
                features: ["集中式存储", "状态变更", "模块化", "插件"],
                animation: "centralizedState"
            },
            pinia: {
                name: "Pinia",
                icon: "🍍",
                description: "Vue Store",
                features: ["TypeScript", "模块化", "开发工具", "SSR"],
                animation: "modernStateManagement"
            },
            mobx: {
                name: "MobX",
                icon: "📊",
                description: "简单、可扩展的状态管理",
                features: ["响应式", "自动更新", "计算值", "动作"],
                animation: "reactiveState"
            },
            zustand: {
                name: "Zustand",
                icon: "🐻",
                description: "小型、快速、可扩展的状态管理",
                features: ["轻量级", "无样板", "TypeScript", "中间件"],
                animation: "lightweightState"
            }
        }
    },

    // 5. 网络层
    network: {
        title: "网络层 - Network",
        subtitle: "Axios / Fetch / GraphQL / WebSocket",
        description: "展现数据通信与实时更新",
        color: "#FECA57",
        technologies: {
            axios: {
                name: "Axios",
                icon: "📡",
                description: "基于Promise的HTTP客户端",
                features: ["请求拦截", "响应拦截", "取消请求", "自动转换"],
                animation: "httpRequests"
            },
            fetch: {
                name: "Fetch API",
                icon: "🌐",
                description: "现代的网络请求接口",
                features: ["Promise基础", "流式处理", "CORS支持", "原生API"],
                animation: "modernFetch"
            },
            graphql: {
                name: "GraphQL",
                icon: "📈",
                description: "API查询语言",
                features: ["类型系统", "单一端点", "精确查询", "实时订阅"],
                animation: "queryLanguage"
            },
            websocket: {
                name: "WebSocket",
                icon: "🔌",
                description: "实时双向通信",
                features: ["全双工", "低延迟", "持久连接", "事件驱动"],
                animation: "realTimeConnection"
            },
            rest: {
                name: "REST API",
                icon: "🛠️",
                description: "表现层状态转换",
                features: ["无状态", "统一接口", "可缓存", "分层系统"],
                animation: "restfulAPI"
            }
        }
    },

    // 6. 工程层
    build: {
        title: "工程层 - Build Tools",
        subtitle: "Webpack / Vite / Rollup / esbuild / Babel",
        description: "展现代码编译、热更新、构建优化",
        color: "#FF9FF3",
        technologies: {
            webpack: {
                name: "Webpack",
                icon: "📦",
                description: "模块打包器",
                features: ["模块打包", "代码分割", "热更新", "插件系统"],
                animation: "bundleProcess"
            },
            vite: {
                name: "Vite",
                icon: "⚡",
                description: "下一代前端构建工具",
                features: ["ESM开发", "快速热更新", "优化构建", "插件生态"],
                animation: "lightningBuild"
            },
            rollup: {
                name: "Rollup",
                icon: "🎯",
                description: "JavaScript模块打包器",
                features: ["Tree Shaking", "ES模块", "小体积", "插件"],
                animation: "treeShaking"
            },
            esbuild: {
                name: "esbuild",
                icon: "🚀",
                description: "极快的JavaScript打包器",
                features: ["Go编写", "并行处理", "极速构建", "TypeScript"],
                animation: "speedBuild"
            },
            babel: {
                name: "Babel",
                icon: "🔄",
                description: "JavaScript编译器",
                features: ["语法转换", "Polyfill", "插件系统", "预设配置"],
                animation: "codeTransformation"
            }
        }
    },

    // 7. 代码质量层
    quality: {
        title: "代码质量层 - Quality",
        subtitle: "ESLint / Prettier / Jest / Cypress",
        description: "展示CI/CD与单元测试",
        color: "#54A0FF",
        technologies: {
            eslint: {
                name: "ESLint",
                icon: "🔍",
                description: "JavaScript代码检查工具",
                features: ["语法检查", "代码规范", "自动修复", "插件扩展"],
                animation: "codeAnalysis"
            },
            prettier: {
                name: "Prettier",
                icon: "✨",
                description: "代码格式化工具",
                features: ["自动格式化", "一致风格", "多语言", "编辑器集成"],
                animation: "codeFormatting"
            },
            jest: {
                name: "Jest",
                icon: "🃏",
                description: "JavaScript测试框架",
                features: ["零配置", "快照测试", "覆盖率", "并行测试"],
                animation: "unitTesting"
            },
            cypress: {
                name: "Cypress",
                icon: "🌲",
                description: "端到端测试框架",
                features: ["实时重载", "时间旅行", "自动等待", "调试工具"],
                animation: "e2eTesting"
            },
            typescript: {
                name: "TypeScript",
                icon: "📘",
                description: "JavaScript的超集",
                features: ["静态类型", "编译时检查", "IDE支持", "渐进式"],
                animation: "typeChecking"
            }
        }
    },

    // 8. UI层
    ui: {
        title: "UI层 - UI Libraries",
        subtitle: "Ant Design / Element Plus / Material UI / Shadcn",
        description: "展示设计系统与组件复用",
        color: "#5F27CD",
        technologies: {
            antd: {
                name: "Ant Design",
                icon: "🐜",
                description: "企业级UI设计语言",
                features: ["设计规范", "React组件", "国际化", "主题定制"],
                animation: "designSystem"
            },
            "element-plus": {
                name: "Element Plus",
                icon: "🎯",
                description: "Vue 3组件库",
                features: ["Vue 3", "TypeScript", "组件丰富", "主题定制"],
                animation: "vueComponents"
            },
            "material-ui": {
                name: "Material UI",
                icon: "🎨",
                description: "React组件库",
                features: ["Material Design", "主题系统", "可访问性", "TypeScript"],
                animation: "materialDesign"
            },
            shadcn: {
                name: "Shadcn/ui",
                icon: "🌟",
                description: "现代化组件库",
                features: ["Radix UI", "Tailwind CSS", "可复制", "可定制"],
                animation: "modernComponents"
            },
            chakra: {
                name: "Chakra UI",
                icon: "⚡",
                description: "简单、模块化、可访问的组件库",
                features: ["模块化", "可访问性", "主题化", "响应式"],
                animation: "accessibleUI"
            }
        }
    },

    // 9. 性能与体验层
    performance: {
        title: "性能与体验层 - Performance",
        subtitle: "Lazy Loading / PWA / Service Worker / Lighthouse",
        description: "展现优化与用户体验策略",
        color: "#00D2D3",
        technologies: {
            "lazy-loading": {
                name: "Lazy Loading",
                icon: "⏳",
                description: "延迟加载优化",
                features: ["按需加载", "性能优化", "用户体验", "带宽节省"],
                animation: "lazyLoading"
            },
            pwa: {
                name: "PWA",
                icon: "📱",
                description: "渐进式Web应用",
                features: ["离线工作", "推送通知", "安装体验", "响应式"],
                animation: "progressiveApp"
            },
            "service-worker": {
                name: "Service Worker",
                icon: "⚙️",
                description: "后台脚本",
                features: ["缓存策略", "离线支持", "推送通知", "后台同步"],
                animation: "backgroundScript"
            },
            lighthouse: {
                name: "Lighthouse",
                icon: "🏮",
                description: "性能审计工具",
                features: ["性能分析", "最佳实践", "可访问性", "SEO检查"],
                animation: "performanceAudit"
            },
            "web-vitals": {
                name: "Web Vitals",
                icon: "📊",
                description: "核心网页指标",
                features: ["LCP", "FID", "CLS", "用户体验"],
                animation: "vitalMetrics"
            }
        }
    },

    // 10. 安全与部署层
    deployment: {
        title: "安全与部署层 - Deployment",
        subtitle: "HTTPS / JWT / OAuth2 / CI/CD / Vercel / Netlify",
        description: "展示部署与安全控制",
        color: "#FF6348",
        technologies: {
            https: {
                name: "HTTPS",
                icon: "🔒",
                description: "安全传输协议",
                features: ["数据加密", "身份验证", "数据完整性", "SEO友好"],
                animation: "secureConnection"
            },
            jwt: {
                name: "JWT",
                icon: "🎫",
                description: "JSON Web Token",
                features: ["无状态", "跨域", "自包含", "安全"],
                animation: "tokenAuth"
            },
            oauth2: {
                name: "OAuth2",
                icon: "🔑",
                description: "授权框架",
                features: ["授权码", "访问令牌", "第三方登录", "安全"],
                animation: "authFlow"
            },
            cicd: {
                name: "CI/CD",
                icon: "🔄",
                description: "持续集成/部署",
                features: ["自动化", "持续集成", "持续部署", "质量保证"],
                animation: "deploymentPipeline"
            },
            vercel: {
                name: "Vercel",
                icon: "▲",
                description: "前端部署平台",
                features: ["边缘网络", "零配置", "预览部署", "性能优化"],
                animation: "edgeDeployment"
            },
            netlify: {
                name: "Netlify",
                icon: "🌐",
                description: "现代Web开发平台",
                features: ["JAMstack", "表单处理", "函数", "A/B测试"],
                animation: "jamstackDeploy"
            }
        }
    },

    // 11. 前沿层
    frontier: {
        title: "前沿层 - Frontier",
        subtitle: "WebGPU / WebAssembly / WebXR / Web3.js / AI前端",
        description: "展现未来前端趋势",
        color: "#A55EEA",
        technologies: {
            webgpu: {
                name: "WebGPU",
                icon: "🎮",
                description: "下一代Web图形API",
                features: ["GPU计算", "并行处理", "高性能", "3D渲染"],
                animation: "gpuComputing"
            },
            webassembly: {
                name: "WebAssembly",
                icon: "⚙️",
                description: "高性能Web执行格式",
                features: ["近原生性能", "多语言", "安全沙箱", "可移植"],
                animation: "wasmExecution"
            },
            webxr: {
                name: "WebXR",
                icon: "🥽",
                description: "沉浸式Web体验",
                features: ["VR/AR", "沉浸式", "跨平台", "Web标准"],
                animation: "immersiveExperience"
            },
            web3: {
                name: "Web3.js",
                icon: "🌐",
                description: "区块链Web开发",
                features: ["去中心化", "智能合约", "加密货币", "DApp"],
                animation: "blockchainIntegration"
            },
            "ai-frontend": {
                name: "AI前端",
                icon: "🤖",
                description: "人工智能驱动的前端",
                features: ["智能生成", "自动优化", "个性化", "机器学习"],
                animation: "aiDriven"
            },
            threejs: {
                name: "Three.js",
                icon: "🎲",
                description: "3D JavaScript库",
                features: ["3D渲染", "WebGL", "动画", "交互"],
                animation: "3dRendering"
            }
        }
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TECH_DATA;
} else if (typeof window !== 'undefined') {
    window.TECH_DATA = TECH_DATA;
}