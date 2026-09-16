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
			}
		]
	},
	{
		id: "history-humanities",
		name: "历史与人文",
		description: "交互式历史地图与人文知识探索资源，纵览文明变迁",
		icon: "Globe",
		bookmarks: [
			{
				id: "chronas",
				title: "Chronas",
				url: "https://chronas.org/",
				description: "交互式世界历史地图集，拖动时间轴纵览两千余年文明疆域与历史事件演变。",
				group: "历史与人文",
				tags: ["History", "Map", "Interactive", "Timeline"]
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
