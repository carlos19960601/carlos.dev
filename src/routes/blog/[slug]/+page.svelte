<script lang="ts">
	import HeaderNav from "$lib/components/HeaderNav.svelte";
	import TocPill from "$lib/components/TocPill.svelte";
	import ArticleRenderer from "$lib/components/ArticleRenderer.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { ArrowLeft, ArrowRight } from "@lucide/svelte";
	import { playClickSound } from "$lib/sound";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.post.title} — Carlos</title>
	<meta name="description" content={data.post.summary} />
</svelte:head>

<!-- 顶部悬浮药丸工具栏 (完全还原视频) -->
<HeaderNav showBack={true} backUrl="/blog" />

<!-- 主文章阅读区 -->
<article class="min-h-screen pt-28 pb-32 px-5 sm:px-8 max-w-[700px] mx-auto">
	<!-- 文章题头 -->
	<header class="mb-6 sm:mb-8">
		<h1 class="text-3xl sm:text-4xl lg:text-[42px] font-serif-title text-foreground tracking-tight leading-[1.18] mb-3.5">
			{data.post.title}
		</h1>

		<!-- 视频同款元信息：8 min read • Nov 2025 -->
		<div class="flex items-center gap-2 text-xs sm:text-[13px] text-muted-foreground font-mono">
			<span>{data.post.readTime}</span>
			<span>•</span>
			<span>{data.post.date}</span>
		</div>
	</header>

	<!-- 正文动态 Markdown 渲染（包含代码高亮、复制按钮与三横杠分割线） -->
	<ArticleRenderer html={data.post.contentHtml} />

	<!-- 文章标签与底部作者信息 -->
	<footer class="mt-16 pt-8 border-t border-border/70 space-y-6">
		<div class="flex items-center gap-2 flex-wrap">
			<span class="text-xs font-mono text-muted-foreground mr-1">相关主题:</span>
			{#each data.post.tags as tag}
				<a href="/blog" onclick={playClickSound}>
					<Badge variant="tag" class="hover:border-foreground/30 transition-colors">
						#{tag}
					</Badge>
				</a>
			{/each}
		</div>

		<!-- 上一篇 / 下一篇 导航卡片 -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
			{#if data.prevPost}
				<a
					href="/blog/{data.prevPost.slug}"
					onclick={playClickSound}
					class="p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-border transition-all group flex flex-col justify-between text-left"
				>
					<span class="text-[11px] font-mono text-muted-foreground flex items-center gap-1 group-hover:-translate-x-0.5 transition-transform mb-1">
						<ArrowLeft class="w-3 h-3" /> 上一篇文章
					</span>
					<span class="text-sm font-serif-title font-medium text-foreground line-clamp-1 group-hover:text-primary">
						{data.prevPost.title}
					</span>
				</a>
			{:else}
				<div class="hidden sm:block"></div>
			{/if}

			{#if data.nextPost}
				<a
					href="/blog/{data.nextPost.slug}"
					onclick={playClickSound}
					class="p-4 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-border transition-all group flex flex-col justify-between text-right sm:text-right"
				>
					<span class="text-[11px] font-mono text-muted-foreground flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform mb-1">
						下一篇文章 <ArrowRight class="w-3 h-3" />
					</span>
					<span class="text-sm font-serif-title font-medium text-foreground line-clamp-1 group-hover:text-primary">
						{data.nextPost.title}
					</span>
				</a>
			{/if}
		</div>
	</footer>
</article>

<!-- 底部动态灵动岛 TOC 药丸组件 (完全还原视频中的滚动跟随、章节标题、阅读进度与抽屉展开) -->
<TocPill toc={data.post.toc} articleTitle={data.post.title} />
