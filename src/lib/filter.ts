/**
 * 客户端搜索/筛选辅助函数
 *
 * 博客列表与收藏页共用的轻量匹配逻辑:搜索词不区分大小写,
 * 任意字段命中即算匹配;空搜索词(或全为空白)时视为不过滤。
 */

/**
 * 判断给定字段中是否有任意一个包含搜索词(不区分大小写)。
 * 搜索词为空或仅空白时恒返回 true(即"不过滤")。
 *
 * @param query   原始搜索词
 * @param fields  参与匹配的字段集合(标题、摘要、标签拼接串等)
 */
export function matchesQuery(query: string, ...fields: string[]): boolean {
	const keyword = query.trim().toLowerCase();
	if (keyword === "") return true;
	return fields.some((field) => field.toLowerCase().includes(keyword));
}
