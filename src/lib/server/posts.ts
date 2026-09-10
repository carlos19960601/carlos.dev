/**
 * 文章数据层(仅服务端)
 *
 * 职责:从 `/src/posts` 目录收集 Markdown 原文,解析 frontmatter 元数据,
 * 并提供「按日期排序的全量列表」与「按 slug 检索单篇原文」两个数据入口。
 * 本模块只做数据读取与解析,不涉及任何 Markdown 渲染(渲染见 markdown.ts)。
 */
import matter from "gray-matter";
import type { PostMeta } from "$lib/types";

/**
 * 打包时静态收集所有文章原文(key 为文件绝对路径,value 为文件内容字符串)。
 * 通过 Vite 的 import.meta.glob 实现:构建后零运行时文件系统依赖,
 * 同时保留模块热替换(HMR)能力。
 */
const markdownFiles = import.meta.glob("/src/posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

/** 单篇文章的原始数据:解析后的元数据 + 去除 frontmatter 的正文 */
export interface PostSource {
	slug: string;
	meta: PostMeta;
	content: string;
}

/** 从 glob 路径提取文件名主干作为 slug(如 `/src/posts/hello.md` → `hello`) */
function slugFromPath(filePath: string): string {
	return filePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

/** 将 frontmatter 字段安全读取为非空字符串,缺失或类型不符时返回兜底值 */
function readString(
	data: Record<string, unknown>,
	key: string,
	fallback: string,
): string {
	const value = data[key];
	return typeof value === "string" && value.length > 0 ? value : fallback;
}

/**
 * 解析单篇文章原文:拆分 frontmatter 与正文,生成带默认值的元数据。
 * 抽取为独立函数是为了保证列表页与详情页使用完全一致的解析规则。
 */
export function parsePostSource(filePath: string, raw: string): PostSource {
	const slug = slugFromPath(filePath);
	const { data, content } = matter(raw);
	const frontmatter = data as Record<string, unknown>;

	return {
		slug,
		meta: {
			slug,
			title: readString(frontmatter, "title", slug),
			date: readString(frontmatter, "date", ""),
			publishedAt: readString(frontmatter, "publishedAt", "2025-01-01"),
			readTime: readString(frontmatter, "readTime", "5 min read"),
			summary: readString(frontmatter, "summary", ""),
			tags: Array.isArray(frontmatter.tags)
				? (frontmatter.tags as string[])
				: [],
			featured: Boolean(frontmatter.featured),
		},
		content,
	};
}

/**
 * 获取全部文章元数据,按发布日期(publishedAt)降序排列。
 * 供博客列表页与首页「最新文章」区块使用。
 */
export function getAllPostMetas(): PostMeta[] {
	return Object.entries(markdownFiles)
		.map(([filePath, raw]) => parsePostSource(filePath, raw).meta)
		.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/**
 * 按 slug 查找单篇文章原文(含元数据),未找到时返回 null。
 * 调用方(渲染层)负责将 content 渲染为 HTML。
 */
export function findPostSourceBySlug(slug: string): PostSource | null {
	const entry = Object.entries(markdownFiles).find(([filePath]) =>
		filePath.endsWith(`/${slug}.md`),
	);
	return entry ? parsePostSource(entry[0], entry[1]) : null;
}
