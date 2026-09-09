import { getAllPosts } from "$lib/server/blog";
import { profile } from "$lib/data/profile";
import { bookmarkGroups } from "$lib/data/bookmarks";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const posts = getAllPosts();
	return {
		profile,
		recentPosts: posts.slice(0, 3),
		bookmarkGroups
	};
};
