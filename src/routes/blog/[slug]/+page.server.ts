import { getPostBySlug, getAllPosts } from "$lib/server/blog";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/**
 * 文章详情页数据加载:
 *   1. 按 slug 渲染文章正文,未找到时抛出 404;
 *   2. 基于全量列表(按日期降序)计算上一篇/下一篇导航。
 */
export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, {
			message: `未找到名为 "${params.slug}" 的文章`
		});
	}

	const allPosts = getAllPosts();
	const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);

	// 列表降序:索引小一篇 = 发布更晚的一篇(next),反之亦然
	const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
	const nextPost =
		currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

	return {
		post,
		prevPost,
		nextPost
	};
};
