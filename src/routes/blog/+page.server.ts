import { getAllPosts } from "$lib/server/blog";
import type { PageServerLoad } from "./$types";

/**
 * 博客列表页数据加载:全量文章元数据(已按发布日期降序)。
 * 搜索与标签筛选在客户端完成,无需服务端参与。
 */
export const load: PageServerLoad = async () => {
	const posts = getAllPosts();
	return { posts };
};
