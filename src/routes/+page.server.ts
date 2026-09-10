import { getAllPosts } from "$lib/server/blog";
import { profile } from "$lib/data/profile";
import type { PageServerLoad } from "./$types";

/**
 * 首页数据加载:个人资料 + 最新 3 篇文章
 * (精选书签由页面直接从静态数据模块读取,无需经此序列化)
 */
export const load: PageServerLoad = async () => {
	const posts = getAllPosts();
	return {
		profile,
		recentPosts: posts.slice(0, 3)
	};
};
