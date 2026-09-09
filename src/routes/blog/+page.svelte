<script lang="ts">
	import HeaderNav from "$lib/components/HeaderNav.svelte";
	import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";
	import { Search, Clock, Calendar, ArrowUpRight, BookOpen } from "@lucide/svelte";
	import { playClickSound } from "$lib/sound";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let searchQuery = $state("");
	let selectedTag = $state("All");

	// 汇总所有文章标签
	const allTags = $derived([
		"All",
		...Array.from(new Set(data.posts.flatMap((p) => p.tags))).sort()
	]);

	// 过滤文章
	const filteredPosts = $derived(
		data.posts.filter((post) => {
			const matchesTag =
				selectedTag === "All" || post.tags.includes(selectedTag);
			const matchesSearch =
				searchQuery.trim() === "" ||
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

			return matchesTag && matchesSearch;
		})
	);

	function selectTag(tag: string) {
		playClickSound();
		selectedTag = tag;
	}
</script>

<svelte:head>
	<title>Writing & Reflections — Carlos</title>
	<meta name="description" content="Carlos 的技术博客与工程思考，涵盖前端架构、设计系统与微交互。" />
</svelte:head>

<HeaderNav showBack={true} backUrl="/" />

<main class="min-h-screen pt-28 pb-24 px-5 sm:px-8 max-w-3xl mx-auto">
	<!-- 页面大标题 -->
	<header class="mb-10 sm:mb-12">
		<h1 class="text-3xl sm:text-4xl lg:text-[40px] font-serif-title text-foreground tracking-tight mb-3">
			Writing & Reflections
		</h1>
		<p class="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
			记录在前端架构、微交互体验、现代设计系统以及工程实践中的沉淀与思考。
		</p>
	</header>

	<!-- 搜索与标签筛选栏 -->
	<div class="space-y-4 mb-10">
		<div class="relative">
			<Search class="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
			<Input
				bind:value={searchQuery}
				placeholder="搜索文章标题、内容或标签..."
				class="pl-10 h-10 rounded-xl bg-card border-border/70 text-sm focus-visible:ring-1 focus-visible:ring-ring"
			/>
			{#if searchQuery}
				<button
					type="button"
					onclick={() => { searchQuery = ""; playClickSound(); }}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer"
				>
					清除
				</button>
			{/if}
		</div>

		<!-- 标签横向滑动选择栏 -->
		<div class="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar select-none">
			{#each allTags as tag}
				<button
					type="button"
					onclick={() => selectTag(tag)}
					class="px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap {selectedTag === tag ? 'bg-primary text-primary-foreground font-medium shadow-2xs scale-[1.02]' : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'}"
				>
					{tag === 'All' ? '全部' : `#${tag}`}
				</button>
			{/each}
		</div>
	</div>

	<!-- 文章列表 -->
	{#if filteredPosts.length > 0}
		<div class="divide-y divide-border/60">
			{#each filteredPosts as post}
				<article class="py-6 first:pt-0 group">
					<a
						href="/blog/{post.slug}"
						onclick={playClickSound}
						class="block group-hover:translate-x-0.5 transition-transform duration-200"
					>
						<div class="flex items-center gap-2.5 text-xs text-muted-foreground font-mono mb-2">
							<span class="flex items-center gap-1">
								<Calendar class="w-3.5 h-3.5 opacity-70" />
								{post.date}
							</span>
							<span>•</span>
							<span class="flex items-center gap-1">
								<Clock class="w-3.5 h-3.5 opacity-70" />
								{post.readTime}
							</span>
						</div>

						<h2 class="text-xl sm:text-2xl font-serif-title text-foreground group-hover:text-foreground/80 transition-colors mb-2 flex items-center justify-between">
							<span>{post.title}</span>
							<ArrowUpRight class="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2 opacity-0 group-hover:opacity-100" />
						</h2>

						<p class="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
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
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center rounded-2xl border border-dashed border-border/80 p-8">
			<BookOpen class="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
			<p class="text-sm font-medium text-foreground">没有找到匹配的文章</p>
			<p class="text-xs text-muted-foreground mt-1">尝试更换搜索词或选择其他分类标签</p>
		</div>
	{/if}
</main>
