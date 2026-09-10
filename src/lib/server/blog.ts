/**
 * 博客服务门面(仅服务端)
 *
 * 组合数据层(posts.ts:读取与 frontmatter 解析)和渲染层(markdown.ts:
 * Markdown → HTML + TOC),对路由提供两个稳定入口:
 *   - getAllPosts()     → 全量文章元数据(列表页)
 *   - getPostBySlug()   → 单篇完整详情(正文页)
 */
import type { PostDetail, PostMeta } from "$lib/types";
import { getAllPostMetas, findPostSourceBySlug } from "./posts";
import { renderMarkdown } from "./markdown";

/**
 * 获取全部文章元数据(按发布日期降序)。
 */
export function getAllPosts(): PostMeta[] {
	return getAllPostMetas();
}

/**
 * 根据 slug 获取单篇文章详情:元数据 + 渲染后的 HTML + 目录。
 * 未找到对应文章时返回 null,由调用方决定抛出 404。
 */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
	const source = findPostSourceBySlug(slug);
	if (!source) return null;

	const { html, toc } = await renderMarkdown(source.content);

	return {
		...source.meta,
		contentHtml: html,
		toc,
	};
}
