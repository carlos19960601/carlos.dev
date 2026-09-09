<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { TocItem } from "$lib/types";
	import { playClickSound, playPopSound } from "$lib/sound";

	interface Props {
		toc: TocItem[];
		articleTitle?: string;
	}

	let { toc = [], articleTitle = "Table of Contents" }: Props = $props();

	let isExpanded = $state(false);
	let activeId = $state("");
	let scrollProgress = $state(0);
	let currentTitle = $state("");

	// 计算环形进度条的 SVG 参数
	const radius = 10;
	const circumference = 2 * Math.PI * radius;
	let strokeDashoffset = $derived(
		circumference - (scrollProgress / 100) * circumference
	);

	let observer: IntersectionObserver | null = null;

	function updateScrollProgress() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight =
			document.documentElement.scrollHeight - document.documentElement.clientHeight;
		if (docHeight > 0) {
			const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
			scrollProgress = progress;
		}
	}

	onMount(() => {
		// 监听滚动进度
		window.addEventListener("scroll", updateScrollProgress, { passive: true });
		updateScrollProgress();

		// 监听文章各章节 Heading 进入视口
		if (typeof window !== "undefined" && "IntersectionObserver" in window) {
			observer = new IntersectionObserver(
				(entries) => {
					// 寻找当前视口中最相关的活跃标题
					const intersecting = entries.filter((e) => e.isIntersecting);
					if (intersecting.length > 0) {
						// 取最顶部的那个
						intersecting.sort(
							(a, b) => a.boundingClientRect.top - b.boundingClientRect.top
						);
						const topEntry = intersecting[0];
						activeId = topEntry.target.id;
					}
				},
				{
					rootMargin: "0% 0% -65% 0%",
					threshold: [0, 0.5, 1.0]
				}
			);

			// 观察所有收集到的 toc id 对应元素
			for (const item of toc) {
				const el = document.getElementById(item.id);
				if (el) observer.observe(el);
			}
		}

		// 监听 ESC 键关闭展开的 TOC
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape" && isExpanded) {
				isExpanded = false;
				playClickSound();
			}
		}
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	});

	onDestroy(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("scroll", updateScrollProgress);
			if (observer) observer.disconnect();
		}
	});

	// 根据 activeId 更新当前显示的章节文本
	$effect(() => {
		if (activeId) {
			const match = toc.find((item) => item.id === activeId);
			if (match) {
				currentTitle = match.text;
				return;
			}
		}
		if (toc.length > 0 && !currentTitle) {
			currentTitle = toc[0].text;
		} else if (!currentTitle) {
			currentTitle = articleTitle;
		}
	});

	function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded) {
			playPopSound(600, "sine", 0.05);
		} else {
			playClickSound();
		}
	}

	function scrollToHeading(id: string) {
		playClickSound();
		activeId = id;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
		// 选择完成后自动折叠面板，还原视频体验
		setTimeout(() => {
			isExpanded = false;
		}, 180);
	}

	function handleBackdropClick() {
		isExpanded = false;
		playClickSound();
	}
</script>

{#if toc.length > 0}
	<!-- 背景遮罩（展开时阻断底层但保持轻盈模糊） -->
	{#if isExpanded}
		<div
			role="button"
			tabindex="0"
			aria-label="关闭目录"
			onclick={handleBackdropClick}
			onkeydown={(e) => e.key === "Escape" && handleBackdropClick()}
			class="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 cursor-default"
		></div>
	{/if}

	<!-- 灵动岛核心容器 -->
	<div
		class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none"
	>
		<!-- 展开态：向上弹出的目录大卡片抽屉 (完全还原参考视频 frame_06, frame_10) -->
		{#if isExpanded}
			<div
				class="mb-3 w-[92vw] max-w-[430px] rounded-3xl bg-neutral-950/95 dark:bg-[#0a0a0b]/95 text-neutral-200 border border-neutral-800/80 shadow-2xl backdrop-blur-xl p-5 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
			>
				<div class="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800/70 text-xs font-mono text-neutral-400">
					<span class="tracking-wide uppercase font-semibold text-[11px] text-neutral-300">目录大纲 (TOC)</span>
					<span class="text-[11px] text-neutral-500">{Math.round(scrollProgress)}% 已读</span>
				</div>

				<!-- 目录列表 -->
				<div class="max-h-[58vh] overflow-y-auto space-y-1.5 pr-1 text-sm">
					{#each toc as item}
						<button
							type="button"
							onclick={() => scrollToHeading(item.id)}
							class="w-full text-left rounded-xl px-3 py-2 transition-all flex items-center justify-between group {activeId === item.id ? 'bg-neutral-800/90 text-white font-medium shadow-2xs' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'}"
							style="padding-left: {item.level === 3 ? '1.75rem' : '0.75rem'};"
						>
							<div class="flex items-center gap-2 overflow-hidden pr-2">
								{#if item.level === 3}
									<span class="w-1.5 h-1.5 rounded-full {activeId === item.id ? 'bg-sky-400' : 'bg-neutral-600 group-hover:bg-neutral-400'} shrink-0"></span>
								{/if}
								<span class="truncate text-[13.5px] leading-snug">{item.text}</span>
							</div>

							{#if activeId === item.id}
								<span class="text-[10px] font-mono uppercase text-sky-400 shrink-0 font-medium">当前</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- 常态：黑色胶囊药丸 (Pill) -->
		<button
			type="button"
			onclick={toggleExpand}
			class="group flex items-center gap-3 h-11 px-4 rounded-full bg-neutral-950 text-white dark:bg-[#0d0d0e] dark:border dark:border-neutral-800/90 shadow-xl hover:shadow-2xl hover:scale-[1.015] active:scale-[0.985] transition-all duration-200 cursor-pointer min-w-[270px] max-w-[380px] sm:max-w-[420px]"
			aria-expanded={isExpanded}
			aria-label="切换文章目录导航"
		>
			<!-- 左侧指示小圆球 (带柔和渐变与微光) -->
			<div
				class="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-300 shadow-[0_0_10px_rgba(56,189,248,0.35)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
			>
				<span class="w-2 h-2 rounded-full bg-white/90"></span>
			</div>

			<!-- 中间章节标题文字 -->
			<span
				class="truncate flex-1 text-[13px] font-medium tracking-tight text-left text-neutral-200 group-hover:text-white transition-colors"
				title={currentTitle}
			>
				{currentTitle || articleTitle}
			</span>

			<!-- 右侧环形阅读进度圈 (Circle Progress) -->
			<div class="relative w-6 h-6 shrink-0 flex items-center justify-center">
				<svg class="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
					<!-- 底圈轨道 -->
					<circle
						cx="12"
						cy="12"
						r={radius}
						fill="transparent"
						stroke="currentColor"
						stroke-width="2"
						class="text-neutral-700/60"
					/>
					<!-- 动态进度填充 -->
					<circle
						cx="12"
						cy="12"
						r={radius}
						fill="transparent"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-dasharray={circumference}
						style="stroke-dashoffset: {strokeDashoffset}; transition: stroke-dashoffset 120ms ease-out;"
						class="text-neutral-200 group-hover:text-white"
					/>
				</svg>
			</div>
		</button>
	</div>
{/if}
