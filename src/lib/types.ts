/**
 * 全局共享类型定义
 *
 * 包含博客文章的元数据、目录条目等跨端(服务端加载器 ↔ 客户端组件)传输的数据结构。
 */

/** 文章元数据(列表页展示用,不含正文) */
export interface PostMeta {
	/** URL 路径标识,与 `/src/posts/<slug>.md` 文件名一致 */
	slug: string;
	/** 文章标题 */
	title: string;
	/** 展示用日期(如 "Nov 2025") */
	date: string;
	/** 排序用发布日期(ISO 格式,如 "2025-11-01") */
	publishedAt: string;
	/** 预计阅读时长(如 "8 min read") */
	readTime: string;
	/** 摘要 */
	summary: string;
	/** 标签列表 */
	tags: string[];
	/** 是否首页精选 */
	featured?: boolean;
}

/** 文章目录(Table of Contents)条目,由正文 H2/H3 标题生成 */
export interface TocItem {
	/** 锚点 ID,与渲染后标题元素的 id 属性一致 */
	id: string;
	/** 纯文本标题(已去除内联格式) */
	text: string;
	/** 标题层级(2 或 3) */
	level: number;
}

/** 文章详情(正文页使用):元数据 + 渲染后的 HTML + 目录 */
export interface PostDetail extends PostMeta {
	/** Markdown 渲染后的 HTML 片段(已包含代码高亮与样式类) */
	contentHtml: string;
	/** 文章目录条目列表(按出现顺序) */
	toc: TocItem[];
}
