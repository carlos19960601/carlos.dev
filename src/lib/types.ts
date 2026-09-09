export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	publishedAt: string;
	readTime: string;
	summary: string;
	tags: string[];
	featured?: boolean;
}

export interface TocItem {
	id: string;
	text: string;
	level: number;
}

export interface PostDetail extends PostMeta {
	contentHtml: string;
	toc: TocItem[];
}
