<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import {
		Home,
		ArrowLeft,
		Volume2,
		VolumeX,
		Sun,
		Moon,
		BookOpen,
		Bookmark,
		FolderGit2
	} from "@lucide/svelte";
	import {
		initSound,
		isSoundEnabled,
		toggleSound,
		playClickSound,
		playToggleSound
	} from "$lib/sound";

	interface Props {
		showBack?: boolean;
		backUrl?: string;
	}

	let { showBack = false, backUrl = "/" }: Props = $props();

	let soundOn = $state(true);
	let isDark = $state(false);

	onMount(() => {
		initSound();
		soundOn = isSoundEnabled();
		isDark = document.documentElement.classList.contains("dark");
	});

	function handleToggleSound() {
		soundOn = toggleSound();
	}

	function handleToggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("site_theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("site_theme", "light");
		}
		playToggleSound(isDark);
	}

	function handleBack() {
		playClickSound();
		if (window.history.length > 1 && !page.url.pathname.endsWith("/")) {
			window.history.back();
		} else {
			goto(backUrl);
		}
	}

	function handleHomeClick() {
		playClickSound();
	}
</script>

<header class="fixed top-5 inset-x-0 z-40 pointer-events-none px-4 sm:px-6">
	<div class="max-w-4xl mx-auto flex items-center justify-between">
		<!-- 左侧悬浮胶囊：首页、返回与核心路由导航 -->
		<div
			class="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-card/90 dark:bg-neutral-900/90 backdrop-blur-md border border-border/80 shadow-xs transition-all duration-200"
		>
			<a
				href="/"
				onclick={handleHomeClick}
				class="inline-flex items-center justify-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all"
				title="返回首页"
				aria-label="Home"
			>
				<Home class="w-4 h-4" />
			</a>

			{#if showBack || page.url.pathname !== "/"}
				<button
					type="button"
					onclick={handleBack}
					class="inline-flex items-center justify-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer"
					title="返回上一页"
					aria-label="Back"
				>
					<ArrowLeft class="w-4 h-4" />
				</button>
			{/if}

			<div class="h-3.5 w-[1px] bg-border/80 mx-0.5"></div>

			<!-- 页面快捷跳转链接 -->
			<a
				href="/blog"
				onclick={playClickSound}
				class="hidden sm:inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-medium text-foreground/75 hover:text-foreground hover:bg-muted/80 transition-all {page.url.pathname.startsWith('/blog') ? 'bg-muted text-foreground font-semibold' : ''}"
			>
				<BookOpen class="w-3.5 h-3.5" />
				<span>博客</span>
			</a>

			<a
				href="/bookmarks"
				onclick={playClickSound}
				class="hidden sm:inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-medium text-foreground/75 hover:text-foreground hover:bg-muted/80 transition-all {page.url.pathname.startsWith('/bookmarks') ? 'bg-muted text-foreground font-semibold' : ''}"
			>
				<Bookmark class="w-3.5 h-3.5" />
				<span>收藏</span>
			</a>
		</div>

		<!-- 右侧悬浮胶囊：声音反馈与深浅主题切换 -->
		<div
			class="pointer-events-auto flex items-center gap-1 p-1 rounded-full bg-card/90 dark:bg-neutral-900/90 backdrop-blur-md border border-border/80 shadow-xs transition-all duration-200"
		>
			<button
				type="button"
				onclick={handleToggleSound}
				class="inline-flex items-center justify-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer"
				title={soundOn ? "静音音效" : "开启音效"}
				aria-label="Toggle Sound"
			>
				{#if soundOn}
					<Volume2 class="w-4 h-4" />
				{:else}
					<VolumeX class="w-4 h-4 text-muted-foreground" />
				{/if}
			</button>

			<button
				type="button"
				onclick={handleToggleTheme}
				class="inline-flex items-center justify-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer"
				title={isDark ? "切换为浅色模式" : "切换为深色模式"}
				aria-label="Toggle Theme"
			>
				{#if isDark}
					<Sun class="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
				{:else}
					<Moon class="w-4 h-4 text-neutral-600 hover:text-neutral-900 transition-colors" />
				{/if}
			</button>
		</div>
	</div>
</header>
