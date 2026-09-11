<!--
	文章列表条目:日期/阅读时长 + 标题 + 摘要 + 标签。
	博客列表页(默认)与首页「最新文章」(compact 紧凑模式)共用,
	点击后跳转文章详情,带音效与悬停位移动画。
-->
<script lang="ts">
	import { Calendar, Clock, ArrowUpRight } from "@lucide/svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { playClickSound } from "$lib/sound";
	import type { PostMeta } from "$lib/types";

	interface Props {
		post: PostMeta;
		/** 紧凑模式:首页等空间受限场景使用,弱化字号与图标 */
		compact?: boolean;
	}

	let { post, compact = false }: Props = $props();
</script>

<article class="{compact ? 'py-4.5' : 'py-6'} first:pt-0 group">
	<a
		href="/blog/{post.slug}"
		onclick={playClickSound}
		class="block group-hover:translate-x-0.5 transition-transform duration-200"
	>
		<div class="flex items-center gap-2 text-xs text-muted-foreground font-mono {compact ? 'mb-1.5' : 'mb-2'}">
			{#if !compact}
				<span class="flex items-center gap-1">
					<Calendar class="w-3.5 h-3.5 opacity-70" />
					{post.date}
				</span>
				<span>•</span>
				<span class="flex items-center gap-1">
					<Clock class="w-3.5 h-3.5 opacity-70" />
					{post.readTime}
				</span>
			{:else}
				<span>{post.date}</span>
				<span>•</span>
				<span>{post.readTime}</span>
			{/if}
		</div>

		{#if compact}
			<h3 class="text-lg font-serif-title text-foreground group-hover:text-foreground/80 transition-colors mb-1.5">
				{post.title}
			</h3>
		{:else}
			<h2 class="text-xl sm:text-2xl font-serif-title text-foreground group-hover:text-foreground/80 transition-colors mb-2 flex items-center justify-between">
				<span>{post.title}</span>
				<ArrowUpRight class="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2 opacity-0 group-hover:opacity-100" />
			</h2>
		{/if}

		<p class="text-sm text-muted-foreground leading-relaxed line-clamp-2 {compact ? 'mb-2.5' : 'mb-3'}">
			{post.summary}
		</p>

		<div class="flex items-center gap-1.5 flex-wrap">
			{#each post.tags as tag}
				<Badge variant="subtle" class="text-[11px] px-2 py-0.5">
					#{tag}
				</Badge>
			{/each}
		</div>
	</a>
</article>
