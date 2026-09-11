/**
 * 博客服务门面(仅服务端)
 *
 * 组合数据层(posts.ts:读取与 frontmatter 解析)和渲染层(markdown.ts:
 * Markdown → HTML + TOC),对路由提供两个稳定入口:
 *   - getAllPosts()     → 全量文章元数据(列表页)
 *   - getPostBySlug()   → 单篇完整详情(正文页)
 */
import type { PostDetail, PostMeta } from "$lib/types";
import {
	getAllPostMetas,
	findPostSourceBySlug,
	getAdjacentPosts as lookupAdjacentPosts,
	type AdjacentPosts,
} from "./posts";
import { renderMarkdown } from "./markdown";

/**
 * 获取全部文章元数据(按发布日期降序)。
 */
export function getAllPosts(): PostMeta[] {
	return getAllPostMetas();
}

/**
 * 计算指定文章的上一篇/下一篇导航(按发布日期降序)。
 */
export function getAdjacentPosts(slug: string): AdjacentPosts {
	return lookupAdjacentPosts(slug);
}

/**
 * 渲染结果缓存:slug → 渲染后的文章详情。
 * Markdown → HTML(含 Shiki 高亮)是全站最贵的同步操作,而文章内容在
 * 构建后不可变,进程内缓存即可让每个 slug 只渲染一次(dev 下 HMR 重载
 * 模块会自然失效,不影响内容更新)。
 */
const renderedPostCache = new Map<string, PostDetail>();

/**
 * 根据 slug 获取单篇文章详情:元数据 + 渲染后的 HTML + 目录。
 * 未找到对应文章时返回 null,由调用方决定抛出 404。
 */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
	const cached = renderedPostCache.get(slug);
	if (cached) return cached;

	const source = findPostSourceBySlug(slug);
	if (!source) return null;

	const { html, toc } = await renderMarkdown(source.content);
	const detail: PostDetail = {
		...source.meta,
		contentHtml: html,
		toc,
	};

	renderedPostCache.set(slug, detail);
	return detail;
}
