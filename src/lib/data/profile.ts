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
	email: "zengqiang96@gmail.com",
	avatar: "/avatar.jpg",
	status: "Exploring craft & system interfaces",
	about: [
		"你好，我是 Carlos。我是一名跨界全栈工程师与设计技术探索者，常年探索前端工程、系统架构与极致交互界面的交汇点。",
		"我坚信优秀的代码应当如文章般清晰，而优秀的界面应当具备克制、沉浸且有呼吸感的美学韵味。平常喜欢研究 SvelteKit、TypeScript、微音效以及现代设计系统的交互哲学。"
	],
	socials: [
		{
			name: "GitHub",
			label: "github.com/carlos19960601",
			url: "https://github.com/carlos19960601",
			icon: "github"
		},
		{
			name: "Email",
			label: "zengqiang96@gmail.com",
			url: "mailto:zengqiang96@gmail.com",
			icon: "mail"
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
			id: "devbox",
			title: "DevBox",
			tagline: "面向软件、硬件与安全专业人员的通用开发工具包",
			description: "跨平台（macOS / Linux / Windows）开发工具集，内置 JSON 格式化（自动去转义）、Base64 编解码、UUID/Nanoid 生成、Unix 时间戳转换、颜色转换、Cron 解析、文本对比及 JSON 转 Schema 等实用工具。",
			tags: ["Developer Tools", "Desktop App", "JSON", "Cross Platform"],
			github: "https://github.com/carlos19960601/DevBox",
			featured: true,
			year: "2025",
			status: "Active"
		},
		{
			id: "trplayer",
			title: "TrPlayer",
			tagline: "支持转录与 LLM 智能翻译字幕的视频播放器",
			description: "基于 Electron 的桌面视频播放器，内置 Whisper 模型管理与字幕转录，可调用 OpenRouter / Ollama / SiliconFlow / OpenAI 等大模型翻译字幕，并支持导出 ASS 字幕文件与视频。",
			tags: ["Electron", "Whisper", "LLM", "ffmpeg"],
			github: "https://github.com/carlos19960601/trplayer",
			featured: true,
			year: "2025",
			status: "Shipped"
		}
	]
};
