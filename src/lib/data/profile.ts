export interface Project {
	id: string;
	title: string;
	tagline: string;
	description: string;
	tags: string[];
	github?: string;
	demo?: string;
	featured: boolean;
	year: string;
	status?: "Active" | "Shipped" | "WIP";
}

export interface SocialLink {
	name: string;
	label: string;
	url: string;
	icon: string;
}

export interface Profile {
	name: string;
	handle: string;
	title: string;
	bio: string;
	location: string;
	email: string;
	avatar: string;
	status: string;
	about: string[];
	socials: SocialLink[];
	skills: { category: string; items: string[] }[];
	projects: Project[];
}

export const profile: Profile = {
	name: "Carlos",
	handle: "carlos",
	title: "Full-Stack Engineer & Design Technologist",
	bio: "专注高品质 Web 体验、前端工程与微交互。热衷于把复杂系统转化为优雅、直觉的数字产品。",
	location: "Shanghai / Remote",
	email: "carlos.dev@example.com",
	avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
	status: "Exploring craft & system interfaces",
	about: [
		"你好，我是 Carlos。我是一名跨界全栈工程师与设计技术探索者，常年探索前端工程、系统架构与极致交互界面的交汇点。",
		"我坚信优秀的代码应当如文章般清晰，而优秀的界面应当具备克制、沉浸且有呼吸感的美学韵味。平常喜欢研究 SvelteKit、TypeScript、微音效以及现代设计系统的交互哲学。"
	],
	socials: [
		{
			name: "GitHub",
			label: "github.com/carlos",
			url: "https://github.com",
			icon: "github"
		},
		{
			name: "Email",
			label: "carlos.dev@example.com",
			url: "mailto:carlos.dev@example.com",
			icon: "mail"
		},
		{
			name: "Twitter / X",
			label: "@carlos_dev",
			url: "https://twitter.com",
			icon: "twitter"
		}
	],
	skills: [
		{
			category: "Frontend & Craft",
			items: ["Svelte / SvelteKit", "TypeScript", "Tailwind CSS", "shadcn", "Motion & Canvas", "Web Audio API"]
		},
		{
			category: "Architecture & Systems",
			items: ["Node.js / Bun", "Edge Computing", "PostgreSQL / SQLite", "REST & GraphQL", "Vite"]
		},
		{
			category: "Design & UX",
			items: ["Design Systems", "Typography", "Micro-interactions", "Figma", "Accessibility (a11y)"]
		}
	],
	projects: [
		{
			id: "quantum-ui",
			title: "Quantum UI System",
			tagline: "极简轻量、基于 Svelte 5 的现代化设计系统",
			description: "一套专为高密度信息流与深色阅读场景优化的组件库，包含动态灵动岛目录、微音效触控反馈及平滑手势交互。",
			tags: ["Svelte 5", "TypeScript", "Tailwind CSS", "Shadcn"],
			github: "https://github.com/carlos/quantum-ui",
			demo: "https://quantum-ui.dev",
			featured: true,
			year: "2026",
			status: "Active"
		},
		{
			id: "sonic-reader",
			title: "Sonic Reader MDX",
			tagline: "带动态交互与微音效的长文阅读引擎",
			description: "深度定制的 Markdown/MDX 渲染架构，支持零客户端 JS 开销的编译期 TOC 提取、阅读进度感知以及平滑锚点驱动。",
			tags: ["SvelteKit", "Markdown", "Shiki", "Web Audio"],
			github: "https://github.com/carlos/sonic-reader",
			demo: "https://sonic-reader.dev",
			featured: true,
			year: "2025",
			status: "Shipped"
		},
		{
			id: "lattice-db",
			title: "Lattice Sync",
			tagline: "本地优先的端对端多维知识与书签同步协议",
			description: "轻量级 Local-First 收藏夹与阅读笔记协同方案，支持双向链接、全文检索与端侧加密同步。",
			tags: ["TypeScript", "IndexedDB", "CRDTs", "Wasm"],
			github: "https://github.com/carlos/lattice-sync",
			featured: false,
			year: "2025",
			status: "Active"
		},
		{
			id: "paper-type",
			title: "Paper Type Tokens",
			tagline: "专为数字出版打造的高级衬线排版规范与样式集",
			description: "基于 Newsreader 与黄金比例字阶的排版工具集，兼顾中西文混排节奏与暗色模式视觉比重。",
			tags: ["Typography", "CSS Architecture", "Design Tokens"],
			github: "https://github.com/carlos/paper-type",
			featured: true,
			year: "2024",
			status: "Shipped"
		}
	]
};
