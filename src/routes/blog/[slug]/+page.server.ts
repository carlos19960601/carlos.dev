import { getPostBySlug, getAllPosts } from "$lib/server/blog";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, {
			message: `未找到名为 "${params.slug}" 的文章`
		});
	}

	const allPosts = getAllPosts();
	const currentIndex = allPosts.findIndex((p) => p.slug === params.slug);

	const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
	const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

	return {
		post,
		prevPost,
		nextPost
	};
};
