export interface Bookmark {
	id: string;
	title: string;
	url: string;
	description: string;
	group: string;
	tags: string[];
	icon?: string;
	featured?: boolean;
}

export interface BookmarkGroup {
	id: string;
	name: string;
	description: string;
	icon: string;
	bookmarks: Bookmark[];
}

export const bookmarkGroups: BookmarkGroup[] = [
	{
		id: "ui-components",
		name: "UI 组件库",
		description: "精选开源组件库与复制即用的 UI 组件、交互动画资源",
		icon: "Sparkles",
		bookmarks: [
			{
				id: "aceternity-ui",
				title: "Aceternity UI",
				url: "https://ui.aceternity.com/",
				description: "Framer Motion 驱动的精美动效组件库，复制粘贴即用的现代 SaaS 落地页元素。",
				group: "UI 组件库",
				tags: ["Components", "Animation", "React", "Tailwind"],
				featured: true
			},
			{
				id: "magic-ui",
				title: "Magic UI",
				url: "https://magicui.design/",
				description: "与 shadcn/ui 协同的动效组件库，提供发光、粒子、打字机等 150+ 动画组件。",
				group: "UI 组件库",
				tags: ["Components", "Animation", "shadcn", "Tailwind"],
				featured: true
			},
			{
				id: "scrollx-ui",
				title: "ScrollX UI",
				url: "https://scrollxui.dev/",
				description: "专注滚动驱动动效的组件库，基于 GSAP/Motion 打造沉浸式叙事页面。",
				group: "UI 组件库",
				tags: ["Components", "Scroll", "Animation", "GSAP"]
			},
			{
				id: "react-bits",
				title: "React Bits",
				url: "https://reactbits.dev/",
				description: "动画与交互式 React 组件合集，文本特效、动态背景与 3D 元素开箱即用。",
				group: "UI 组件库",
				tags: ["Components", "React", "Animation", "Effects"]
			},
			{
				id: "coss-ui",
				title: "COSS UI",
				url: "https://coss.com/ui",
				description: "新一代 AI 原生应用界面精选集，高质量仪表盘、生成式工具与对话式产品 UI 参考。",
				group: "UI 组件库",
				tags: ["Components", "AI", "Dashboard", "Reference"]
			},
			{
				id: "canvas-ui",
				title: "Canvas UI",
				url: "https://canvasui.dev/",
				description: "开源创意 Canvas 组件库，基于 WebGL/WebGPU 渲染 HTML 创意特效，支持 React、Vue、Svelte 等多框架。",
				group: "UI 组件库",
				tags: ["Components", "WebGL", "WebGPU", "Effects"]
			},
			{
				id: "animista",
				title: "Animista",
				url: "https://animista.net/",
				description: "即调即取的 CSS 动画库，在线预览并调节入场、文字、背景等动画参数，一键复制生成纯 CSS 代码。",
				group: "UI 组件库",
				tags: ["Animation", "CSS", "Generator", "Effects"]
			},
			{
				id: "opensource-ui",
				title: "Opensource UI",
				url: "https://opensourceui.in/components",
				description: "开源 UI 组件库目录站，汇集各技术栈的组件库与模板，可按框架筛选，快速找到合适的开源组件方案。",
				group: "UI 组件库",
				tags: ["Components", "Directory", "OpenSource", "Reference"]
			},
			{
				id: "transitions-dev",
				title: "Transitions.dev",
				url: "https://transitions.dev/",
				description: "Web 应用必备 UI 转场动画精选集，复制即用的 CSS/React 过渡效果，还可作为编码智能体的 skill 接入。",
				group: "UI 组件库",
				tags: ["Animation", "CSS", "React", "Transitions"]
			},
			{
				id: "beautiful-ui",
				title: "Beautiful UI",
				url: "https://www.beautifului.dev/",
				description: "面向 AI 原生界面的精雕组件库，覆盖聊天智能体、思考状态、人工审批等场景，复制即用。",
				group: "UI 组件库",
				tags: ["Components", "AI", "Agents", "Chat"]
			},
			{
				id: "beui",
				title: "beUI",
				url: "https://beui.dev/components/motion",
				description: "基于 Motion + Tailwind CSS 的开源动画 React 组件库，复制 TypeScript 源码即可深度自定义每个交互。",
				group: "UI 组件库",
				tags: ["Components", "Animation", "React", "Motion"]
			},
			{
				id: "joly-ui",
				title: "Joly UI",
				url: "https://www.jolyui.dev/docs/components",
				description: "50+ 基于 shadcn/ui 与 Radix 构建的免费开源 React 组件，复制即用，适配 Next.js、TypeScript 与 Tailwind CSS。",
				group: "UI 组件库",
				tags: ["Components", "shadcn", "React", "Tailwind"]
			},
			{
				id: "vengeance-ui",
				title: "Vengeance UI",
				url: "https://www.vengenceui.com/docs/install-nextjs",
				description: "面向现代落地页的动画 React 组件库，提供新一代 UI 交互效果，附 Next.js 安装配置文档。",
				group: "UI 组件库",
				tags: ["Components", "Animation", "React", "LandingPage"]
			},
			{
				id: "its-hover",
				title: "Its Hover",
				url: "https://www.itshover.com/icons",
				description: "以动效为先的动画图标库，图标随交互意图而动，为现代界面注入细腻的微动效。",
				group: "UI 组件库",
				tags: ["Icons", "Animation", "Motion", "Library"]
			}
		]
	},
	{
		id: "ui-inspiration",
		name: "UI 设计灵感画廊",
		description: "每日精选的界面截图灵感库与按场景分类的设计参考集",
		icon: "Lightbulb",
		bookmarks: [
			{
				id: "inspora",
				title: "Inspora",
				url: "https://www.inspora.design/",
				description: "每日精选的落地页与产品界面设计灵感，高质量截图一屏速览。",
				group: "UI 设计灵感画廊",
				tags: ["Inspiration", "UI", "Gallery", "LandingPage"]
			},
			{
				id: "collectui",
				title: "CollectUI",
				url: "https://collectui.com/",
				description: "基于 Dribbble 每日精选的 UI 灵感合集，按登录页、个人主页等场景分类检索。",
				group: "UI 设计灵感画廊",
				tags: ["Inspiration", "UI", "Dribbble", "Gallery"]
			},
			{
				id: "21st-dev",
				title: "21st.dev",
				url: "https://21st.dev/",
				description: "社区驱动的 React/shadcn 组件市集，浏览精美组件与落地页区块找灵感。",
				group: "UI 设计灵感画廊",
				tags: ["Inspiration", "Components", "React", "shadcn"]
			},
			{
				id: "grumpy-website",
				title: "Grumpy Website",
				url: "https://grumpy.website/",
				description: "聚焦真实产品 UI 缺陷的设计点评博客，持续剖析 YouTube、Telegram、Apple 等应用的反面案例，帮你避坑并提升设计审美。",
				group: "UI 设计灵感画廊",
				tags: ["UI", "UX", "Critique", "Design"]
			}
		]
	},
	{
		id: "design-tools",
		name: "设计与原型工具",
		description: "快速绘制线框图与原型的设计工具，把想法变成可见的界面",
		icon: "PenTool",
		bookmarks: [
			{
				id: "mockdown",
				title: "Mockdown",
				url: "https://www.mockdown.design/",
				description: "免费浏览器端 ASCII 线框图编辑器，拖拽组件即可绘制低保真 UI 原型与文本图示，无需注册。",
				group: "设计与原型工具",
				tags: ["Wireframe", "Prototyping", "ASCII", "Tool"]
			}
		]
	},
	{
		id: "terminal-tools",
		name: "终端工具",
		description: "CLI 与 TUI 应用发现站，打造高效终端工作流的工具宝库",
		icon: "SquareTerminal",
		bookmarks: [
			{
				id: "terminal-trove",
				title: "Terminal Trove",
				url: "https://terminaltrove.com/",
				description: "终端工具的宝库，汇集海量优质 CLI 与 TUI 应用，附截图与分类速览，是打造高效终端工作流的灵感之源。",
				group: "终端工具",
				tags: ["CLI", "TUI", "Terminal", "Directory"],
				featured: true
			},
			{
				id: "clig-zh",
				title: "命令行界面设计指南",
				url: "https://clig.onev.dev/",
				description: "Command Line Interface Guidelines 官方中文版（onevcat 翻译），以传统 UNIX 原则为基底、面向现代需求，指导你设计出更好用的命令行程序。",
				group: "终端工具",
				tags: ["CLI", "Guide", "Design", "UNIX"]
			},
			{
				id: "hostc",
				title: "hostc",
				url: "https://hostc.dev/",
				description: "一条命令把本地开发服务器暴露为公网 HTTPS 地址，WebSocket 与热更新全兼容，免费无需注册，适合分享半成品与调试 Webhook。",
				group: "终端工具",
				tags: ["CLI", "Localhost", "Tunnel", "Webhook"]
			}
		]
	},
	{
		id: "discovery",
		name: "探索与发现",
		description: "适合闲逛探索的发现类站点：免费资源目录、仓库地图、纪录片与历史地图",
		icon: "Compass",
		bookmarks: [
			{
				id: "fmhy",
				title: "FMHY",
				url: "https://fmhy.net/",
				description: "号称互联网最大的免费资源图书馆，社区维护的流媒体、软件、AI 工具与学习资源一站式导航。",
				group: "探索与发现",
				tags: ["Directory", "Free", "Media", "Tools"],
				featured: true
			},
			{
				id: "github-treemap",
				title: "GitHub Treemap",
				url: "https://github-treemap.pages.dev/",
				description: "6 万+ GitHub 仓库的交互式矩形树图，按每日热度动量与编程语言层级探索，快速发现热门开源项目。",
				group: "探索与发现",
				tags: ["GitHub", "Visualization", "Discovery", "OpenSource"]
			},
			{
				id: "ihavenotv",
				title: "I Have No TV",
				url: "https://ihavenotv.com/",
				description: "免费在线纪录片网站，汇集天文、自然、大脑、科学、健康等题材的高质量纪录片，免费流媒体观看。",
				group: "探索与发现",
				tags: ["Documentary", "Video", "Free", "Media"]
			},
			{
				id: "chronas",
				title: "Chronas",
				url: "https://chronas.org/",
				description: "交互式世界历史地图，时间轴跨越 5000 年，拖动滑块即可直观探索文明、文化与政治疆域的演变。",
				group: "探索与发现",
				tags: ["History", "Map", "Interactive", "Learning"]
			},
			{
				id: "fine-dictionary",
				title: "Fine Dictionary",
				url: "https://www.finedictionary.com/",
				description: "聚合 WordNet、Century Dictionary 等多部词典的英文在线查询站，提供音标、释义、例句与新闻真实用例。",
				group: "探索与发现",
				tags: ["Dictionary", "English", "Reference", "Learning"]
			},
			{
				id: "subhd",
				title: "SubHD",
				url: "https://subhd.tv/",
				description: "影视爱好者字幕分享交流平台，可搜索下载电影、美剧、英剧的中英双语字幕，支持打分评论与上传分享。",
				group: "探索与发现",
				tags: ["Subtitle", "Download", "Movie", "TV"]
			},
			{
				id: "zimuku",
				title: "字幕库 Zimuku",
				url: "https://zimuku.org/",
				description: "老牌影视字幕下载站，收录最新美剧、电影、日剧、韩剧的中英双语字幕，按剧集与字幕组检索。",
				group: "探索与发现",
				tags: ["Subtitle", "Download", "Movie", "TV"]
			},
			{
				id: "assrt",
				title: "射手网（伪）",
				url: "https://assrt.net/",
				description: "老射手网的精神延续者，提供电影、美剧、英剧与新番的字幕下载，覆盖中文字幕、双语字幕与字幕组作品。",
				group: "探索与发现",
				tags: ["Subtitle", "Download", "Movie", "TV"]
			},
			{
				id: "xuezhongcai",
				title: "学种菜网",
				url: "https://www.xuezhongcai.com/",
				description: "种植养殖知识站，系统收录蔬菜、水果、粮食、中药材的种植技术与花卉养殖技巧。",
				group: "探索与发现",
				tags: ["Gardening", "Planting", "Knowledge", "Learning"]
			},
			{
				id: "kukutool-dy",
				title: "KuKuTool 去水印",
				url: "https://dy.kukutool.com/",
				description: "免费在线视频图片去水印工具，支持抖音、快手、小红书、B站等 130+ 平台，可无水印下载视频、图片与实况 Live 图。",
				group: "探索与发现",
				tags: ["Video", "Download", "Watermark", "Tool"]
			},
			{
				id: "snapany",
				title: "SnapAny",
				url: "https://snapany.com/zh",
				description: "万能视频图片解析下载工具，支持 YouTube、抖音、TikTok、X 等千余平台，免费无水印保存到本地。",
				group: "探索与发现",
				tags: ["Video", "Download", "Watermark", "Tool"]
			}
		]
	},
	{
		id: "network-tools",
		name: "网络与账号工具",
		description: "机场客户端、苹果 ID 共享与短信接码平台，科学上网与注册验证一站备齐",
		icon: "KeyRound",
		bookmarks: [
			{
				id: "huarun",
				title: "华润赢",
				url: "https://huarun.win/",
				description: "翻墙应用商店、协议谱系与人物纪事，收录 155 款支持机场订阅导入与系统级 VPN 模式的全平台客户端，可按平台、协议与维护状态筛选。",
				group: "网络与账号工具",
				tags: ["Directory", "VPN", "Proxy", "Clients"]
			},
			{
				id: "tengfa-ids",
				title: "腾发苹果ID分享站",
				url: "https://ids.tengfa.cc/",
				description: "App Store 美区共享账号更新与安全提示，了解下载用途、登录边界与使用风险，适合临时下载或更新应用。",
				group: "网络与账号工具",
				tags: ["Apple", "AppStore", "Shared", "Free"]
			},
			{
				id: "jincaii-id",
				title: "Jincaii 苹果ID共享站",
				url: "https://id.jincaii.com/",
				description: "每日 24 小时更新的小火箭 Shadowrocket 美区 Apple ID 共享账号，免费获取并附 iOS 下载教程与 iCloud 登录风险提示。",
				group: "网络与账号工具",
				tags: ["Apple", "AppStore", "Shared", "Free"]
			},
			{
				id: "juzixp-ios",
				title: "JuziXP 小火箭共享站",
				url: "https://ios.juzixp.com/",
				description: "免费的小火箭 (Shadowrocket) 美区共享 Apple ID 账号站，定期更新，助力 iOS 设备轻松下载代理工具。",
				group: "网络与账号工具",
				tags: ["Apple", "AppStore", "Shared", "Free"]
			},
			{
				id: "c98-id",
				title: "C98 苹果ID共享站",
				url: "https://a.c98.eu/",
				description: "免费小火箭 (Shadowrocket) 美区共享 Apple ID 账号，随时更新，并附 iCloud 防锁机登录提示。",
				group: "网络与账号工具",
				tags: ["Apple", "AppStore", "Shared", "Free"]
			},
			{
				id: "grizzlysms",
				title: "GrizzlySMS",
				url: "https://grizzlysms.com/",
				description: "虚拟手机号接码平台，按国家与服务租用临时号码，接收 WhatsApp、Telegram 等平台的注册验证短信。",
				group: "网络与账号工具",
				tags: ["SMS", "Virtual", "Verification", "Numbers"]
			},
			{
				id: "smsbower",
				title: "SMSBower",
				url: "https://smsbower.app/",
				description: "临时手机号接码平台，支持 WhatsApp、Telegram 等应用的 OTP 验证码接收，提供多国安全虚拟号码。",
				group: "网络与账号工具",
				tags: ["SMS", "Virtual", "Verification", "Numbers"]
			},
			{
				id: "hero-sms",
				title: "Hero SMS",
				url: "https://hero-sms.com/",
				description: "虚拟号码接码平台，租用各国临时手机号完成主流应用的短信验证与账号注册。",
				group: "网络与账号工具",
				tags: ["SMS", "Virtual", "Verification", "Numbers"]
			}
		]
	},
	{
		id: "learning",
		name: "学习与技术阅读",
		description: "AI 入门课程、经典论文选集与开发者技术博客，系统化进阶的阅读清单",
		icon: "BookOpen",
		bookmarks: [
			{
				id: "aipath",
				title: "AI 通识课",
				url: "https://aipath.buynao.com/",
				description: "为中文学习者设计的 AI 入门通识课，从零系统了解人工智能的核心概念与实际使用方式。",
				group: "学习与技术阅读",
				tags: ["AI", "Course", "Learning", "Tutorial"]
			},
			{
				id: "30papers",
				title: "30 Papers",
				url: "https://30papers.com/",
				description: "Ilya Sutskever 推荐给 John Carmack 的 AI 奠基论文清单，30 篇深度学习经典论文全文收录，并附通俗术语解释。",
				group: "学习与技术阅读",
				tags: ["AI", "Papers", "Learning", "DeepLearning"]
			},
			{
				id: "yuxia-blog",
				title: "Yuxia's Blog",
				url: "https://luoyuxia.github.io/archives/",
				description: "聚焦 AI Agent、数据基础设施与 Rust 的个人技术博客，源码级拆解 DeepSeek Harness、Materialize、Ray 等热门项目。",
				group: "学习与技术阅读",
				tags: ["Blog", "AI", "Database", "Rust"]
			},
			{
				id: "quakewang-tech",
				title: "二夕说废话の地方",
				url: "https://quakewang.github.io/tech/",
				description: "系统化输出分布式、消息队列、Redis 与 Doris/Paimon 存储系列文章的个人技术博客，兼有 Rust 与终端折腾笔记。",
				group: "学习与技术阅读",
				tags: ["Blog", "Distributed", "Middleware", "Rust"]
			}
		]
	},
	{
		id: "reading-books",
		name: "阅读与书籍",
		description: "专家荐书与优质阅读资源，跨领域通识书单一网打尽",
		icon: "Library",
		bookmarks: [
			{
				id: "five-books",
				title: "Five Books",
				url: "https://fivebooks.com/",
				description: "各领域专家每期精选五本最佳书籍，涵盖科学、历史、哲学与文学的权威荐书平台。",
				group: "阅读与书籍",
				tags: ["Books", "Reading", "Recommendations"]
			}
		]
	},
	{
		id: "tech-think-tank",
		name: "技术思考与智库",
		description: "深度学习架构拆解、论文精读与一线实现笔记",
		icon: "BookOpen",
		bookmarks: [
			{
				id: "transformers-breakdown",
				title: "Transformers Breakdown",
				url: "https://www.k-a.in/transformers.html",
				description: "用 PyTorch 逐行拆解 Transformer 实现，从输入嵌入、位置编码到多头注意力与完整训练流程。",
				group: "技术思考与智库",
				tags: ["Transformer", "PyTorch", "LLM", "Tutorial"]
			}
		]
	},
];

// 获取全部标签列表（去重）
export function getAllTags(): string[] {
	const set = new Set<string>();
	for (const group of bookmarkGroups) {
		for (const bm of group.bookmarks) {
			for (const tag of bm.tags) {
				set.add(tag);
			}
		}
	}
	return Array.from(set).sort();
}

// 获取全部书签列表
export function getAllBookmarks(): Bookmark[] {
	return bookmarkGroups.flatMap((g) => g.bookmarks);
}
