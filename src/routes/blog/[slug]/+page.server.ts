import { getPostBySlug, getAdjacentPosts } from "$lib/server/blog";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/**
 * 文章详情页数据加载:
 *   1. 按 slug 渲染文章正文,未找到时抛出 404;
 *   2. 委托数据层计算上一篇/下一篇导航。
 */
export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, {
			message: `未找到名为 "${params.slug}" 的文章`
		});
	}

	const { prev: prevPost, next: nextPost } = getAdjacentPosts(params.slug);

	return {
		post,
		prevPost,
		nextPost
	};
};
