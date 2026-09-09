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
		id: "engineering",
		name: "研发与前沿框架",
		description: "构建现代 Web 应用的核心开发利器、运行环境与框架生态",
		icon: "Code2",
		bookmarks: [
			{
				id: "svelte",
				title: "Svelte 5",
				url: "https://svelte.dev",
				description: "带来 Runes 响应式原语的新一代 Web 编译型框架，极致简洁与高性能。",
				group: "研发与前沿框架",
				tags: ["Framework", "Svelte", "Reactivity", "Frontend"],
				featured: true
			},
			{
				id: "shadcn-svelte",
				title: "shadcn-svelte",
				url: "https://shadcn-svelte.com",
				description: "精心雕琢、无头可定制的 UI 组件库在 Svelte 生态中的典范移植。",
				group: "研发与前沿框架",
				tags: ["Component", "Shadcn", "UI", "Tailwind"],
				featured: true
			},
			{
				id: "tailwindcss",
				title: "Tailwind CSS v4",
				url: "https://tailwindcss.com",
				description: "全新纯 CSS 引擎驱动的高性能原子化 CSS 框架，零配置与瞬时编译。",
				group: "研发与前沿框架",
				tags: ["CSS", "Styling", "Tailwind", "Frontend"],
				featured: true
			},
			{
				id: "vite",
				title: "Vite",
				url: "https://vitejs.dev",
				description: "下一代前端构建工具，极速冷启动与热重载模块更新。",
				group: "研发与前沿框架",
				tags: ["Bundler", "Tooling", "ESM"]
			},
			{
				id: "shiki",
				title: "Shiki",
				url: "https://shiki.style",
				description: "基于 TextMate 语法的现代美学代码语法高亮器，精美优雅。",
				group: "研发与前沿框架",
				tags: ["Tooling", "SyntaxHighlight", "Markdown"]
			}
		]
	},
	{
		id: "design-systems",
		name: "设计系统与美学灵感",
		description: "高品质数字界面、排版美学与微交互灵感宝库",
		icon: "Palette",
		bookmarks: [
			{
				id: "linear-design",
				title: "Linear Design",
				url: "https://linear.app",
				description: "当代数字产品设计的工艺典范，键盘优先操作与极致暗色质感。",
				group: "设计系统与美学灵感",
				tags: ["DesignSystem", "Inspiration", "Craft", "SaaS"],
				featured: true
			},
			{
				id: "rauno-me",
				title: "Rauno Freiberg",
				url: "https://rauno.me",
				description: "Vercel 设计工程师的个人交互实验室与手势动效研究。",
				group: "设计系统与美学灵感",
				tags: ["MicroInteractions", "Portfolio", "Craft", "Animation"],
				featured: true
			},
			{
				id: "emil-kowalski",
				title: "Emil Kowalski",
				url: "https://emilkowal.ski",
				description: "专注极致微交互、声效反馈与动画曲线的数字工匠主页。",
				group: "设计系统与美学灵感",
				tags: ["Animation", "SoundDesign", "Craft", "Inspiration"],
				featured: true
			},
			{
				id: "fonts-in-use",
				title: "Fonts In Use",
				url: "https://fontsinuse.com",
				description: "全球顶级出版物与品牌字体排版档案库与案例鉴赏。",
				group: "设计系统与美学灵感",
				tags: ["Typography", "Fonts", "Inspiration"]
			},
			{
				id: "lucide",
				title: "Lucide Icons",
				url: "https://lucide.dev",
				description: "风格统一、清晰锐利的开源矢量图标库，支持多框架封装。",
				group: "设计系统与美学灵感",
				tags: ["Icons", "DesignSystem", "Asset"]
			}
		]
	},
	{
		id: "ai-agents",
		name: "AI 与智能体生态",
		description: "大语言模型、智能编程 Agent 与前沿人机协同接口",
		icon: "Bot",
		bookmarks: [
			{
				id: "anthropic-claude",
				title: "Anthropic Claude",
				url: "https://claude.ai",
				description: "具有深度推理能力、长上下文记忆与代码素养的顶级 AI 助手。",
				group: "AI 与智能体生态",
				tags: ["AI", "LLM", "Reasoning", "Intelligence"],
				featured: true
			},
			{
				id: "huggingface",
				title: "Hugging Face",
				url: "https://huggingface.co",
				description: "全球开源机器学习与模型社区的大本营，推动开放 AI 生态。",
				group: "AI 与智能体生态",
				tags: ["AI", "OpenSource", "MachineLearning"]
			},
			{
				id: "ollama",
				title: "Ollama",
				url: "https://ollama.com",
				description: "在本地快速运行 Llama 3、DeepSeek、Qwen 等开源大模型的轻量工具。",
				group: "AI 与智能体生态",
				tags: ["LocalAI", "OpenSource", "CLI", "AI"]
			}
		]
	},
	{
		id: "reading-ideas",
		name: "技术思考与智库",
		description: "深度的工程长文、系统架构反思与数字手记",
		icon: "BookOpen",
		bookmarks: [
			{
				id: "dan-abramov",
				title: "Overreacted",
				url: "https://overreacted.io",
				description: "Dan Abramov 关于前端心理模型、软件架构与调试哲学的深邃思考。",
				group: "技术思考与智库",
				tags: ["Engineering", "Philosophy", "Architecture"],
				featured: true
			},
			{
				id: "simon-willison",
				title: "Simon Willison's Weblog",
				url: "https://simonwillison.net",
				description: "极高更新频率的技术观察日记，涵盖 AI 安全、数据工具与开源哲学。",
				group: "技术思考与智库",
				tags: ["AI", "Weblog", "Engineering"]
			},
			{
				id: "local-first-fm",
				title: "Local-First Web",
				url: "https://localfirstweb.dev",
				description: "探索数据归属权、离线优先协作与 CRDT 分布式协议的前沿智库。",
				group: "技术思考与智库",
				tags: ["LocalFirst", "CRDTs", "Architecture"]
			}
		]
	}
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
