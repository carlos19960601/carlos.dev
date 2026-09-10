<script lang="ts">
	import HeaderNav from "$lib/components/HeaderNav.svelte";
	import { Input } from "$lib/components/ui/input";
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardContent } from "$lib/components/ui/card";
	import {
		Search,
		ExternalLink,
		Copy,
		Check,
		Bookmark,
		Code2,
		Palette,
		Bot,
		BookOpen,
		Lightbulb,
		Sparkles
	} from "@lucide/svelte";
	import { bookmarkGroups, getAllTags } from "$lib/data/bookmarks";
	import { playClickSound, playSuccessSound } from "$lib/sound";

	let searchQuery = $state("");
	let selectedTag = $state("All");
	let copiedId = $state<string | null>(null);

	const allTags = ["All", ...getAllTags()];

	// 分组图标名 → 图标组件映射(书签数据只存图标名字符串,在此集中转换)
	const GROUP_ICONS = { Code2, Palette, Bot, BookOpen, Lightbulb, Sparkles } as const;

	/** 根据分组配置的图标名取对应组件,未知名称回退到默认书签图标 */
	function getGroupIcon(name: string) {
		return GROUP_ICONS[name as keyof typeof GROUP_ICONS] ?? Bookmark;
	}

	// 根据搜索词和标签过滤书签:保留仍有匹配项的分组,空分组剔除
	const filteredGroups = $derived(
		bookmarkGroups
			.map((group) => {
				const matchingBookmarks = group.bookmarks.filter((bm) => {
					const matchTag =
						selectedTag === "All" || bm.tags.includes(selectedTag);
					const query = searchQuery.trim().toLowerCase();
					const matchQuery =
						!query ||
						bm.title.toLowerCase().includes(query) ||
						bm.description.toLowerCase().includes(query) ||
						bm.url.toLowerCase().includes(query) ||
						bm.tags.some((t) => t.toLowerCase().includes(query));

					return matchTag && matchQuery;
				});

				return {
					...group,
					bookmarks: matchingBookmarks
				};
			})
			.filter((group) => group.bookmarks.length > 0)
	);

	// 当前筛选命中的书签总数
	const totalCount = $derived(
		filteredGroups.reduce((acc, g) => acc + g.bookmarks.length, 0)
	);

	function selectTag(tag: string) {
		playClickSound();
		selectedTag = tag;
	}

	/** 复制书签网址到剪贴板,并展示 1.8 秒成功反馈 */
	function copyUrl(id: string, url: string) {
		playClickSound();
		navigator.clipboard.writeText(url).then(() => {
			playSuccessSound();
			copiedId = id;
			setTimeout(() => {
				if (copiedId === id) copiedId = null;
			}, 1800);
		});
	}
</script>

<svelte:head>
	<title>Curated Bookmarks & Resources — Carlos</title>
	<meta
		name="description"
		content="精选优质网站、设计系统、前端工具与技术智库，分组分标签整理。"
	/>
</svelte:head>

<HeaderNav showBack={true} backUrl="/" />

<main class="min-h-screen pt-28 pb-24 px-5 sm:px-8 max-w-4xl mx-auto">
	<!-- 页面大标题 -->
	<header class="mb-10 sm:mb-12">
		<div class="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
			<Bookmark class="w-3.5 h-3.5" />
			<span>Digital Library</span>
		</div>
		<h1 class="text-3xl sm:text-4xl lg:text-[40px] font-serif-title text-foreground tracking-tight mb-3">
			Curated Bookmarks & Tools
		</h1>
		<p class="text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
			分组与多维标签化整理的日常高频开发利器、高质感设计系统、前沿智能体生态与深度思考智库。
		</p>
	</header>

	<!-- 搜索与标签筛选工具栏 -->
	<div class="space-y-4 mb-12">
		<div class="relative">
			<Search class="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
			<Input
				bind:value={searchQuery}
				placeholder="搜索网站名称、介绍、网址或标签..."
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

		<!-- 标签云（展示全部标签，支持一键点击筛选） -->
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-muted-foreground font-mono">
				<span>按标签快速筛选 (Tags):</span>
				<span>共 {totalCount} 个收录站点</span>
			</div>
			<div class="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar select-none">
				{#each allTags as tag}
					<button
						type="button"
						onclick={() => selectTag(tag)}
						class="px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap {selectedTag === tag ? 'bg-primary text-primary-foreground font-medium shadow-2xs scale-[1.02]' : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'}"
					>
						{tag === 'All' ? '全部标签' : `#${tag}`}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- 分组展示内容区 (满足需求：分组展示 + 展示标签) -->
	{#if filteredGroups.length > 0}
		<div class="space-y-12">
			{#each filteredGroups as group}
				{@const IconComponent = getGroupIcon(group.icon)}
				<section class="space-y-4">
					<!-- 分组头部 -->
					<div class="flex items-center justify-between pb-2 border-b border-border/70">
						<div class="flex items-center gap-2.5">
							<div class="p-1.5 rounded-lg bg-secondary/80 text-foreground">
								<IconComponent class="w-4 h-4" />
							</div>
							<div>
								<h2 class="text-lg font-serif-title font-medium text-foreground">
									{group.name}
								</h2>
								<p class="text-xs text-muted-foreground mt-0.5">
									{group.description}
								</p>
							</div>
						</div>
						<Badge variant="subtle" class="font-mono text-[11px]">
							{group.bookmarks.length}
						</Badge>
					</div>

					<!-- 分组内的卡片网格 -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each group.bookmarks as bm}
							<Card class="group hover:border-border transition-all duration-200 hover:shadow-xs bg-card/70 hover:bg-card flex flex-col justify-between">
								<div class="p-4 space-y-2.5">
									<!-- 顶部标题与操作按钮 -->
									<div class="flex items-start justify-between gap-3">
										<a
											href={bm.url}
											target="_blank"
											rel="noopener noreferrer"
											onclick={playClickSound}
											class="group/link flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
										>
											<span class="font-semibold">{bm.title}</span>
											<ExternalLink class="w-3.5 h-3.5 text-muted-foreground opacity-60 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
										</a>

										<div class="flex items-center gap-1 shrink-0">
											<button
												type="button"
												onclick={() => copyUrl(bm.id, bm.url)}
												class="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer"
												title="复制网址链接"
												aria-label="复制链接"
											>
												{#if copiedId === bm.id}
													<Check class="w-3.5 h-3.5 text-emerald-500" />
												{:else}
													<Copy class="w-3.5 h-3.5" />
												{/if}
											</button>
										</div>
									</div>

									<!-- 网站简介 -->
									<p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">
										{bm.description}
									</p>
								</div>

								<!-- 底部标签展示区 (要求：必须展示标签) -->
								<div class="px-4 pb-4 pt-0">
									<div class="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/40">
										{#each bm.tags as tag}
											<button
												type="button"
												onclick={() => selectTag(tag)}
												class="inline-flex items-center text-[10.5px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer {selectedTag === tag ? 'bg-primary text-primary-foreground border-primary font-medium' : 'bg-muted/60 text-muted-foreground border-border/50 hover:border-foreground/30 hover:text-foreground'}"
											>
												#{tag}
											</button>
										{/each}
									</div>
								</div>
							</Card>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center rounded-2xl border border-dashed border-border/80 p-8">
			<Bookmark class="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
			<p class="text-sm font-medium text-foreground">未找到相关书签</p>
			<p class="text-xs text-muted-foreground mt-1">没有同时符合搜索条件与标签的内容</p>
		</div>
	{/if}
</main>
