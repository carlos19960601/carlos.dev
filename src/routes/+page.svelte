<script lang="ts">
	import HeaderNav from "$lib/components/HeaderNav.svelte";
	import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import {
		Mail,
		ExternalLink,
		ArrowRight,
		Calendar,
		Clock,
		Sparkles,
		Bookmark,
		Check,
		Copy,
		FolderGit2,
		BookOpen
	} from "@lucide/svelte";
	import { playClickSound, playSuccessSound } from "$lib/sound";
	import { getAllBookmarks } from "$lib/data/bookmarks";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let emailCopied = $state(false);

	// GitHub 主页链接(从社交配置中提取,缺省回退官网)
	const githubUrl = $derived(
		data.profile.socials.find((s) => s.name === "GitHub")?.url ?? "https://github.com"
	);

	// 首页速览的精选书签(最多 4 个)
	const featuredBookmarks = $derived(
		getAllBookmarks().filter((b) => b.featured).slice(0, 4)
	);

	/** 复制邮箱地址到剪贴板,并展示 2 秒成功反馈 */
	function copyEmail() {
		playClickSound();
		navigator.clipboard.writeText(data.profile.email).then(() => {
			playSuccessSound();
			emailCopied = true;
			setTimeout(() => {
				emailCopied = false;
			}, 2000);
		});
	}
</script>

<svelte:head>
	<title>{data.profile.name} — {data.profile.title}</title>
	<meta name="description" content={data.profile.bio} />
</svelte:head>

<HeaderNav />

<main class="min-h-screen pt-28 pb-24 px-5 sm:px-8 max-w-3xl mx-auto space-y-20">
	<!-- 1. 个人简介与个人信息 Hero 区 (满足需求：个人简介、email、github 主页等) -->
	<section class="space-y-6">
		<div class="flex items-start justify-between gap-6">
			<div class="space-y-2">
				<div class="flex items-center gap-2 mb-1">
					<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
						<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
						{data.profile.status}
					</span>
				</div>

				<h1 class="text-3xl sm:text-4xl lg:text-[42px] font-serif-title text-foreground tracking-tight">
					{data.profile.name}
				</h1>
				<p class="text-sm sm:text-base font-medium text-foreground/80">
					{data.profile.title}
				</p>
			</div>

			<!-- 个人头像 -->
			<div class="relative shrink-0">
				<div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-border/80 shadow-md bg-muted">
					<img
						src={data.profile.avatar}
						alt={data.profile.name}
						class="w-full h-full object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-300"
					/>
				</div>
			</div>
		</div>

		<!-- 简介文本 -->
		<div class="space-y-3 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
			{#each data.profile.about as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>

		<!-- 个人核心联系信息与社交主页 (Email, GitHub) -->
		<div class="pt-2 flex items-center gap-2.5 flex-wrap">
			<Button
				variant="outline"
				size="sm"
				href={githubUrl}
				target="_blank"
				rel="noopener noreferrer"
				onclick={playClickSound}
				class="gap-1.5 rounded-full h-8 px-3 text-xs bg-card/80 border-border/80"
			>
				<GithubIcon class="w-3.5 h-3.5" />
				<span>GitHub</span>
				<ExternalLink class="w-3 h-3 opacity-60 ml-0.5" />
			</Button>

			<Button
				variant="outline"
				size="sm"
				onclick={copyEmail}
				class="gap-1.5 rounded-full h-8 px-3 text-xs bg-card/80 border-border/80"
			>
				{#if emailCopied}
					<Check class="w-3.5 h-3.5 text-emerald-500" />
					<span class="text-emerald-500">已复制 Email</span>
				{:else}
					<Mail class="w-3.5 h-3.5" />
					<span>{data.profile.email}</span>
					<Copy class="w-3 h-3 opacity-60 ml-0.5" />
				{/if}
			</Button>
		</div>
	</section>

	<!-- 2. 精选项目列表 (满足需求：项目列表展示) -->
	<section class="space-y-5">
		<div class="flex items-center justify-between pb-2 border-b border-border/70">
			<div class="flex items-center gap-2">
				<FolderGit2 class="w-4 h-4 text-muted-foreground" />
				<h2 class="text-xl font-serif-title font-medium text-foreground">
					精选项目 (Projects)
				</h2>
			</div>
			<span class="text-xs font-mono text-muted-foreground">Engineering & Craft</span>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each data.profile.projects as project}
				<Card class="group flex flex-col justify-between hover:border-border transition-all duration-200 hover:shadow-2xs bg-card/70 hover:bg-card">
					<CardHeader class="p-5 pb-3">
						<div class="flex items-start justify-between gap-2 mb-1">
							<CardTitle class="text-base group-hover:text-primary transition-colors">
								{project.title}
							</CardTitle>
							<div class="flex items-center gap-1.5 shrink-0">
								{#if project.status}
									<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
										{project.status}
									</span>
								{/if}
								<span class="text-[11px] font-mono text-muted-foreground">
									{project.year}
								</span>
							</div>
						</div>
						<CardDescription class="text-xs line-clamp-2 mt-1">
							{project.description}
						</CardDescription>
					</CardHeader>

					<CardContent class="p-5 pt-0 space-y-3">
						<!-- 技术栈标签 -->
						<div class="flex items-center gap-1.5 flex-wrap">
							{#each project.tags as tag}
								<Badge variant="subtle" class="text-[10px] px-1.5 py-0.2">
									{tag}
								</Badge>
							{/each}
						</div>

						<!-- 项目链接按钮 -->
						<div class="flex items-center gap-2 pt-2 border-t border-border/40">
							{#if project.demo}
								<a
									href={project.demo}
									target="_blank"
									rel="noopener noreferrer"
									onclick={playClickSound}
									class="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 hover:text-foreground transition-colors"
								>
									<span>体验 Demo</span>
									<ExternalLink class="w-3 h-3 opacity-60" />
								</a>
							{/if}
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
									onclick={playClickSound}
									class="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
								>
									<GithubIcon class="w-3 h-3" />
									<span>源码</span>
								</a>
							{/if}
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</section>

	<!-- 3. 最新博客文章 (满足需求：blog列表入口与最新动态展示) -->
	<section class="space-y-5">
		<div class="flex items-center justify-between pb-2 border-b border-border/70">
			<div class="flex items-center gap-2">
				<BookOpen class="w-4 h-4 text-muted-foreground" />
				<h2 class="text-xl font-serif-title font-medium text-foreground">
					最新文章 (Recent Posts)
				</h2>
			</div>
			<a
				href="/blog"
				onclick={playClickSound}
				class="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
			>
				<span>查看全部</span>
				<ArrowRight class="w-3 h-3" />
			</a>
		</div>

		<div class="divide-y divide-border/60">
			{#each data.recentPosts as post}
				<article class="py-4.5 first:pt-0 group">
					<a
						href="/blog/{post.slug}"
						onclick={playClickSound}
						class="block group-hover:translate-x-0.5 transition-transform duration-200"
					>
						<div class="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1.5">
							<span>{post.date}</span>
							<span>•</span>
							<span>{post.readTime}</span>
						</div>

						<h3 class="text-lg font-serif-title text-foreground group-hover:text-foreground/80 transition-colors mb-1.5">
							{post.title}
						</h3>

						<p class="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
							{post.summary}
						</p>

						<div class="flex items-center gap-1.5 flex-wrap">
							{#each post.tags as tag}
								<Badge variant="subtle" class="text-[10px] px-2 py-0.2">
									#{tag}
								</Badge>
							{/each}
						</div>
					</a>
				</article>
			{/each}
		</div>
	</section>

	<!-- 4. 精选收藏网站速览 (满足需求：收藏网站入口与分组/标签直观导览) -->
	<section class="space-y-5">
		<div class="flex items-center justify-between pb-2 border-b border-border/70">
			<div class="flex items-center gap-2">
				<Bookmark class="w-4 h-4 text-muted-foreground" />
				<h2 class="text-xl font-serif-title font-medium text-foreground">
					收藏的网站 (Bookmarks)
				</h2>
			</div>
			<a
				href="/bookmarks"
				onclick={playClickSound}
				class="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
			>
				<span>完整分组与标签列表</span>
				<ArrowRight class="w-3 h-3" />
			</a>
		</div>

		<p class="text-xs sm:text-sm text-muted-foreground">
			按“研发与前沿框架”、“设计系统与美学灵感”、“AI 与智能体生态”、“技术思考与智库”四大分组，并带有完备标签索引。
		</p>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			{#each featuredBookmarks as bm}
				<a
					href="/bookmarks"
					onclick={playClickSound}
					class="p-3.5 rounded-xl border border-border/70 bg-card/60 hover:bg-card hover:border-border transition-all group block"
				>
					<div class="flex items-center justify-between gap-2 mb-1">
						<span class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
							{bm.title}
						</span>
						<span class="text-[10.5px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
							{bm.group}
						</span>
					</div>
					<p class="text-xs text-muted-foreground line-clamp-1 mb-2">
						{bm.description}
					</p>
					<div class="flex items-center gap-1 flex-wrap">
						{#each bm.tags.slice(0, 3) as tag}
							<span class="text-[10px] font-mono text-muted-foreground/80 bg-muted/60 px-1.5 py-0.2 rounded">
								#{tag}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>

		<div class="text-center pt-2">
			<Button
				variant="outline"
				size="sm"
				href="/bookmarks"
				onclick={playClickSound}
				class="rounded-full text-xs font-mono"
			>
				浏览全部收藏网站与标签检索 →
			</Button>
		</div>
	</section>

	<!-- 页脚 -->
	<footer class="pt-12 pb-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
		<div>
			© {new Date().getFullYear()} Carlos. Crafted with Svelte 5 & shadcn.
		</div>
		<div class="flex items-center gap-4">
			<a href="/" onclick={playClickSound} class="hover:text-foreground transition-colors">首页</a>
			<a href="/blog" onclick={playClickSound} class="hover:text-foreground transition-colors">博客</a>
			<a href="/bookmarks" onclick={playClickSound} class="hover:text-foreground transition-colors">收藏网站</a>
		</div>
	</footer>
</main>
