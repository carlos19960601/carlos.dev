/**
 * Markdown 渲染层(仅服务端)
 *
 * 职责:将 Markdown 原文渲染为带 Tailwind 样式的 HTML 片段,包括——
 *   1. 标题锚点 ID 生成与目录(TOC)收集;
 *   2. 基于 Shiki 的双主题(亮/暗)代码高亮;
 *   3. Excalidraw SVG 图表的明/暗双版本内联;
 *   4. 段落、链接、列表、行内代码、分割线等元素的定制样式。
 *
 * 注意:marked v18 的 renderer 收到的是 token 对象,内联子 token 需要
 * 通过 renderer.parser.parseInline() 递归渲染,直接取 token.text 会输出原始文本。
 */
import fs from "node:fs";
import path from "node:path";
import { marked, type Renderer, type Tokens } from "marked";
import { createHighlighter, type Highlighter } from "shiki";
import { escapeHtml } from "$lib/utils";
import type { TocItem } from "$lib/types";

// ============================================================
// Shiki 代码高亮(懒加载单例,避免重复初始化的开销)
// ============================================================

/** highlighter 初始化 Promise 缓存:首次调用创建,后续复用同一实例 */
let highlighterPromise: Promise<Highlighter> | null = null;

/** 获取 Shiki highlighter 单例(同时注册亮/暗两套主题与常用语言) */
async function getHighlighter(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["github-light", "github-dark-high-contrast"],
			langs: [
				"javascript",
				"typescript",
				"bash",
				"json",
				"svelte",
				"html",
				"css",
				"markdown",
			],
		});
	}
	return highlighterPromise;
}

// ============================================================
// 通用辅助函数
// ============================================================

/**
 * 将标题文本转换为锚点 ID。
 * 规则:小写 → 空格/破折号/下划线统一为连字符 → 去除非法字符 → 压缩连续连字符。
 * 保留中文字符(\u4e00-\u9fa5)以支持中文标题。
 */
function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[\s\u2014—_]+/g, "-")
		.replace(/[^\w\u4e00-\u9fa5-]+/g, "")
		.replace(/--+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** 将内联 token 递归转为纯文本(用于 TOC 文本与锚点 ID) */
function inlineTokensToPlainText(
	tokens: Tokens.Generic[] | undefined,
): string {
	if (!tokens) return "";
	return tokens
		.map((t) =>
			"tokens" in t && t.tokens
			? inlineTokensToPlainText(t.tokens as Tokens.Generic[])
			: (t.text ?? ""),
		)
		.join("");
}

/**
 * 安全渲染内联 token 列表为 HTML。
 * parser 尚未就绪时降级为纯文本,防止意外注入。
 */
function renderInline(
	renderer: Renderer,
	tokens: Tokens.Generic[] | undefined,
	fallback = "",
): string {
	if (!tokens) return fallback;
	return renderer.parser
		? renderer.parser.parseInline(tokens)
		: inlineTokensToPlainText(tokens);
}

// ============================================================
// Excalidraw 图表内联
// ============================================================

/**
 * 打包时静态收集所有 Excalidraw SVG 文件内容。
 * 优先从该内联映射读取(零运行时文件系统依赖),仅在未命中时回退读磁盘。
 */
const excalidrawSvgFiles = import.meta.glob("/static/excalidraw/*.svg", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

/** Excalidraw 目录下的工作目录(用于运行时兜底读取) */
const EXCALIDRAW_DIR = path.resolve("static/excalidraw");

/**
 * 读取单个主题变体(".light" / ".dark")的 SVG 内容。
 * 查找顺序:
 *   1. 打包时内联的专属变体(baseName.light.svg / baseName.dark.svg);
 *   2. 内联的通用版本(baseName.svg);
 *   3. 本地文件系统的专属变体 → 通用版本(开发环境兜底)。
 */
function readExcalidrawSvg(
	baseName: string,
	variant: ".light" | ".dark",
): string | null {
	// 内联候选:专属变体优先,通用版本兜底
	for (const key of [
		`/static/excalidraw/${baseName}${variant}.svg`,
		`/static/excalidraw/${baseName}.svg`,
	]) {
		if (excalidrawSvgFiles[key]) return excalidrawSvgFiles[key];
	}

	// 文件系统兜底:仅当打包内联未命中时才产生 IO
	for (const file of [
		path.join(EXCALIDRAW_DIR, `${baseName}${variant}.svg`),
		path.join(EXCALIDRAW_DIR, `${baseName}.svg`),
	]) {
		if (fs.existsSync(file)) return fs.readFileSync(file, "utf-8");
	}

	return null;
}

// ============================================================
// marked 渲染器定制
// ============================================================

/**
 * 创建定制的 marked 渲染器。
 * @param toc        目录收集数组(渲染过程中按标题出现顺序写入)
 * @param highlighter 已初始化的 Shiki 实例
 */
function createRenderer(toc: TocItem[], highlighter: Highlighter): Renderer {
	const renderer = new marked.Renderer();

	// ---- 标题:注入锚点 ID,并把 H2/H3 收集进目录 ----
	renderer.heading = ({ tokens, depth }) => {
		const innerHtml = renderInline(renderer, tokens);
		const cleanText = inlineTokensToPlainText(tokens);
		const id = slugify(cleanText) || `heading-${toc.length + 1}`;

		if (depth === 2 || depth === 3) {
			toc.push({ id, text: cleanText, level: depth });
		}

		// H2 与 H3 使用不同的字号层级,共享滚动偏移与锚点交互样式
		const headingClass =
			depth === 2
			? "text-2xl sm:text-3xl font-serif-title font-medium tracking-tight text-foreground mt-12 mb-4 scroll-mt-24 group flex items-center gap-2"
			: "text-lg sm:text-xl font-medium tracking-tight text-foreground mt-8 mb-3 scroll-mt-24 group flex items-center gap-2";

		return `
			<h${depth} id="${id}" class="${headingClass}">
				<a href="#${id}" class="no-underline hover:text-foreground/90 transition-colors">
					${innerHtml}
				</a>
			</h${depth}>
		`;
	};

	// ---- 代码块:双主题高亮 + 语言标签 + 复制按钮 ----
	renderer.code = ({ text, lang }) => {
		const safeLang = lang || "text";

		// 用一次调用输出双主题单份 HTML:每个 token 同时携带
		// --shiki-light / --shiki-dark CSS 变量,由客户端样式按
		// html.dark 切换,相比“亮暗各渲染一份”体积直接减半
		let codeHtml: string;
		try {
			codeHtml = highlighter.codeToHtml(text, {
				lang: safeLang,
				themes: {
					light: "github-light",
					dark: "github-dark-high-contrast",
				},
				defaultColor: false,
			});
		} catch {
			// 语言未注册等异常时降级为转义后的纯文本
			codeHtml = `<pre><code>${escapeHtml(text)}</code></pre>`;
		}

		// 复制按钮的代码内容经 encodeURIComponent 编码后放入 data 属性,
		// 由客户端 ArticleRenderer 解码并写入剪贴板
		const encodedCode = encodeURIComponent(text);

		return `
			<div class="code-block-container my-6 rounded-xl border border-border/80 dark:border-white/10 bg-card dark:bg-[#0d1117] overflow-hidden shadow-2xs group relative">
				<div class="flex items-center justify-between px-4 py-2 border-b border-border/60 dark:border-white/[0.08] bg-muted/40 dark:bg-white/[0.03] text-xs font-mono text-muted-foreground dark:text-zinc-400">
					<span class="tracking-wide lowercase font-medium">${safeLang}</span>
					<button
						type="button"
						class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-muted/80 dark:hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
						data-code="${encodedCode}"
						aria-label="复制代码"
					>
						<span class="copy-label">Copy</span>
					</button>
				</div>
				<div class="p-4 overflow-x-auto text-[13.5px] leading-relaxed font-mono">
					<div>${codeHtml}</div>
				</div>
			</div>
		`;
	};

	// ---- 行内代码 ----
	renderer.codespan = ({ text }) => {
		return `<code class="px-1.5 py-0.5 rounded-md bg-muted/80 dark:bg-white/[0.08] text-[13px] font-mono text-foreground dark:text-zinc-200 border border-border/60 dark:border-white/10">${text}</code>`;
	};

	// ---- 水平分割线:还原设计稿中的三横杠效果 ----
	renderer.hr = () => {
		return `<div class="post-divider" role="separator"><span></span><span></span><span></span></div>`;
	};

	// ---- 图片:普通图片加响应式样式;Excalidraw 引用内联为可交互图表 ----
	renderer.image = ({ href, title, text }) => {
		const safeAlt = escapeHtml(text || "");
		const isExcalidraw =
			href.includes("/excalidraw/") || href.endsWith(".excalidraw");

		if (isExcalidraw) {
			// 提取文件名主干(兼容 .excalidraw / .svg / .light.svg / .dark.svg 后缀)
			const baseName = href
				.split("/")
				.pop()!
				.replace(/(\.light|\.dark)?\.(excalidraw|svg)$/, "");

			// 匹配到明/暗双版本 SVG 时,内联为占位容器;
			// 客户端 ArticleRenderer 会将其升级为支持缩放/平移/全屏的交互组件
			const lightSvg = readExcalidrawSvg(baseName, ".light");
			const darkSvg = readExcalidrawSvg(baseName, ".dark");

			if (lightSvg && darkSvg) {
				return `
					<div
						class="excalidraw-embed my-8 rounded-xl border border-border/80 overflow-hidden shadow-2xs"
						data-excalidraw
						role="img"
						aria-label="${safeAlt || "Excalidraw 图表"}"
					>
						<div class="excalidraw-svg-light dark:hidden">${lightSvg}</div>
						<div class="excalidraw-svg-dark hidden dark:block">${darkSvg}</div>
					</div>
				`;
			}
		}

		// 普通图片:懒加载 + 可选标题作为 figcaption
		const safeTitle = title ? escapeHtml(title) : "";
		const titleAttr = safeTitle ? ` title="${safeTitle}"` : "";
		const caption = safeTitle
			? `<figcaption class="mt-3 text-center text-sm text-muted-foreground">${safeTitle}</figcaption>`
			: "";
		return `
			<figure class="my-8">
				<img
					src="${escapeHtml(href)}"
					alt="${safeAlt}"${titleAttr}
					loading="lazy"
					decoding="async"
					class="mx-auto block w-full h-auto rounded-xl border border-border/60 shadow-2xs"
				/>
				${caption}
			</figure>
		`;
	};

	// ---- 段落:内联子 token 需递归渲染,否则粗体/行内代码/图片会原样输出 ----
	renderer.paragraph = (token) => {
		return `<p class="my-4 text-[15px] sm:text-[16px] leading-[1.75] text-foreground/90">${renderInline(renderer, token.tokens, token.text)}</p>`;
	};

	// ---- 链接:外链新窗口打开,内链原地跳转 ----
	renderer.link = (token) => {
		const { href } = token;
		const innerHtml = renderInline(renderer, token.tokens, token.text);
		const isExternal = href.startsWith("http");
		const targetAttr = isExternal
			? 'target="_blank" rel="noopener noreferrer"'
			: "";
		const titleAttr = token.title
			? ` title="${escapeHtml(token.title)}"`
			: "";
		return `<a href="${escapeHtml(href)}" class="font-medium text-foreground underline decoration-border hover:decoration-foreground underline-offset-4 transition-colors" ${targetAttr}${titleAttr}>${innerHtml}</a>`;
	};

	// ---- 列表:有序/无序分别使用对应样式 ----
	renderer.list = (token) => {
		const tag = token.ordered ? "ol" : "ul";
		const listClass = token.ordered ? "list-decimal" : "list-disc";
		let body = "";
		for (const item of token.items) {
			body += `<li class="my-1 text-[15px] leading-relaxed text-foreground/90">${renderer.listitem(item)}</li>`;
		}
		return `<${tag} class="${listClass} pl-6 my-4 space-y-2">${body}</${tag}>`;
	};

	// ---- 列表项:loose 列表的子 token 是块级(含段落),tight 列表是内联级 ----
	renderer.listitem = (item) => {
		if (item.tokens && renderer.parser) {
			return item.loose
				? renderer.parser.parse(item.tokens)
				: renderer.parser.parseInline(item.tokens);
		}
		return item.text ?? "";
	};

	return renderer;
}

// ============================================================
// 对外 API
// ============================================================

/** renderMarkdown 的返回结构:HTML 片段 + 渲染过程中收集的目录 */
export interface RenderedMarkdown {
	html: string;
	toc: TocItem[];
}

/**
 * 将 Markdown 原文渲染为带样式的 HTML,并同步生成文章目录。
 * @param content 已去除 frontmatter 的 Markdown 正文
 */
export async function renderMarkdown(
	content: string,
): Promise<RenderedMarkdown> {
	const toc: TocItem[] = [];
	const highlighter = await getHighlighter();
	const renderer = createRenderer(toc, highlighter);
	const html = await marked.parse(content, { renderer });
	return { html, toc };
}
