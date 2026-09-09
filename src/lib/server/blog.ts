import matter from 'gray-matter';
import { marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import type { PostMeta, TocItem, PostDetail } from '$lib/types';

export type { PostMeta, TocItem, PostDetail };

// 缓存 highlighter 单例
let highlighterPromise: Promise<Highlighter> | null = null;
async function getHighlighterInstance() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-light', 'github-dark-default'],
			langs: ['javascript', 'typescript', 'bash', 'json', 'svelte', 'html', 'css', 'markdown']
		});
	}
	return highlighterPromise;
}

// 转换标题为锚点 ID
function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s\u2014—_]+/g, '-')
		.replace(/[^\w\u4e00-\u9fa5-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+|-+$/g, '');
}

// 动态读取并解析所有 markdown 文件
const markdownFiles = import.meta.glob('/src/posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

/**
 * 获取全部文章元数据列表（用于列表页与推荐）
 */
export function getAllPosts(): PostMeta[] {
	const posts: PostMeta[] = [];

	for (const [path, content] of Object.entries(markdownFiles)) {
		const slug = path.split('/').pop()?.replace(/\.md$/, '') || '';
		const parsed = matter(content);
		const data = parsed.data as Record<string, unknown>;

		posts.push({
			slug,
			title: (data.title as string) || slug,
			date: (data.date as string) || '',
			publishedAt: (data.publishedAt as string) || '2025-01-01',
			readTime: (data.readTime as string) || '5 min read',
			summary: (data.summary as string) || '',
			tags: Array.isArray(data.tags) ? data.tags : [],
			featured: Boolean(data.featured)
		});
	}

	// 按发布日期降序排列
	return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/**
 * 根据 slug 获取单篇文章详情（包含渲染后的 HTML 和 TOC）
 */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
	let targetPath = '';
	for (const path of Object.keys(markdownFiles)) {
		if (path.endsWith(`/${slug}.md`)) {
			targetPath = path;
			break;
		}
	}

	if (!targetPath) return null;

	const rawContent = markdownFiles[targetPath];
	const parsed = matter(rawContent);
	const data = parsed.data as Record<string, unknown>;

	const toc: TocItem[] = [];
	const highlighter = await getHighlighterInstance();

	// 定制 marked 渲染规则
	const renderer = new marked.Renderer();

	// 处理标题：注入 slug 锚点 id，并收集进 TOC
	renderer.heading = ({ text, depth }) => {
		// 剥离内嵌 html 标签获取纯文本
		const cleanText = text.replace(/<[^>]+>/g, '');
		const id = slugify(cleanText) || `heading-${toc.length + 1}`;

		// 收集 H2 和 H3 到目录中
		if (depth === 2 || depth === 3) {
			toc.push({
				id,
				text: cleanText,
				level: depth
			});
		}

		const headingClass = depth === 2 
			? "text-2xl sm:text-3xl font-serif-title font-medium tracking-tight text-foreground mt-12 mb-4 scroll-mt-24 group flex items-center gap-2" 
			: "text-lg sm:text-xl font-medium tracking-tight text-foreground mt-8 mb-3 scroll-mt-24 group flex items-center gap-2";

		return `
			<h${depth} id="${id}" class="${headingClass}">
				<a href="#${id}" class="no-underline hover:text-foreground/90 transition-colors">
					${text}
				</a>
			</h${depth}>
		`;
	};

	// 自定义代码块高亮
	renderer.code = ({ text, lang }) => {
		const safeLang = lang || 'text';
		let lightHtml = '';
		let darkHtml = '';
		try {
			lightHtml = highlighter.codeToHtml(text, {
				lang: safeLang,
				theme: 'github-light'
			});
			darkHtml = highlighter.codeToHtml(text, {
				lang: safeLang,
				theme: 'github-dark-default'
			});
		} catch {
			lightHtml = `<pre><code>${escapeHtml(text)}</code></pre>`;
			darkHtml = lightHtml;
		}

		const encodedCode = encodeURIComponent(text);

		return `
			<div class="code-block-container my-6 rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs group relative">
				<div class="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30 text-xs font-mono text-muted-foreground">
					<span class="tracking-wide lowercase font-medium">${safeLang}</span>
					<button 
						type="button"
						class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all active:scale-95 cursor-pointer"
						data-code="${encodedCode}"
						aria-label="复制代码"
					>
						<span class="copy-label">Copy</span>
					</button>
				</div>
				<div class="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
					<div class="dark:hidden">${lightHtml}</div>
					<div class="hidden dark:block">${darkHtml}</div>
				</div>
			</div>
		`;
	};

	// 自定义内联代码块
	renderer.codespan = ({ text }) => {
		return `<code class="px-1.5 py-0.5 rounded-md bg-muted text-[13px] font-mono text-foreground border border-border/60">${text}</code>`;
	};

	// 自定义水平分割线：还原视频中三横杠效果
	renderer.hr = () => {
		return `<div class="post-divider" role="separator"><span></span><span></span><span></span></div>`;
	};

	// 自定义段落与链接
	renderer.paragraph = ({ text }) => {
		return `<p class="my-4 text-[15px] sm:text-[16px] leading-[1.75] text-foreground/90">${text}</p>`;
	};

	renderer.link = ({ href, title, text }) => {
		const isExternal = href.startsWith('http');
		const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
		const titleAttr = title ? `title="${title}"` : '';
		return `<a href="${href}" class="font-medium text-foreground underline decoration-border hover:decoration-foreground underline-offset-4 transition-colors" ${targetAttr} ${titleAttr}>${text}</a>`;
	};

	renderer.list = (token) => {
		const tag = token.ordered ? 'ol' : 'ul';
		const listClass = token.ordered ? 'list-decimal' : 'list-disc';
		let body = '';
		for (const item of token.items) {
			body += `<li class="my-1 text-[15px] leading-relaxed text-foreground/90">${renderer.listitem(item)}</li>`;
		}
		return `<${tag} class="${listClass} pl-6 my-4 space-y-2">${body}</${tag}>`;
	};

	renderer.listitem = (item) => {
		return item.text;
	};

	const contentHtml = await marked.parse(parsed.content, { renderer });

	return {
		slug,
		title: (data.title as string) || slug,
		date: (data.date as string) || '',
		publishedAt: (data.publishedAt as string) || '2025-01-01',
		readTime: (data.readTime as string) || '5 min read',
		summary: (data.summary as string) || '',
		tags: Array.isArray(data.tags) ? data.tags : [],
		featured: Boolean(data.featured),
		contentHtml,
		toc
	};
}

function escapeHtml(text: string) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
