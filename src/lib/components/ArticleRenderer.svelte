<script lang="ts">
	import { onMount, mount, unmount } from "svelte";
	import { playClickSound, playSuccessSound } from "$lib/sound";
	import ExcalidrawDiagram from "./ExcalidrawDiagram.svelte";

	interface Props {
		html: string;
	}

	let { html }: Props = $props();
	let containerRef: HTMLDivElement | null = null;

	/** 复制成功后短暂展示 "Copied!" 反馈(1.8s 后还原按钮状态) */
	function showCopiedFeedback(btn: HTMLButtonElement) {
		const labelEl = btn.querySelector(".copy-label");
		if (!labelEl) return;

		const original = labelEl.textContent;
		labelEl.textContent = "Copied!";
		btn.classList.add("text-emerald-500", "bg-emerald-500/10");
		setTimeout(() => {
			labelEl.textContent = original;
			btn.classList.remove("text-emerald-500", "bg-emerald-500/10");
		}, 1800);
	}

	/** 委托处理文章内所有代码块的复制按钮(按钮由服务端渲染器生成) */
	function handleCopyClick(e: MouseEvent) {
		const target = (e.target as HTMLElement).closest(".copy-code-btn") as HTMLButtonElement | null;
		if (!target) return;

		playClickSound();
		const rawEncoded = target.getAttribute("data-code");
		if (!rawEncoded) return;

		try {
			// data-code 存放的是 encodeURIComponent 编码后的源码
			const code = decodeURIComponent(rawEncoded);
			navigator.clipboard.writeText(code).then(() => {
				playSuccessSound();
				showCopiedFeedback(target);
			});
		} catch (err) {
			console.error("复制失败:", err);
		}
	}

	/**
	 * 将 SSR 直出的 Excalidraw SVG 占位容器升级为可交互图表组件
	 * (支持缩放/平移/全屏),水合完成后原占位元素被替换。
	 */
	function hydrateExcalidraw(
		container: HTMLElement,
		diagramApps: ReturnType<typeof mount>[],
	) {
		const embeds = container.querySelectorAll<HTMLElement>("[data-excalidraw]");
		if (!embeds.length) return;

		for (const embed of Array.from(embeds)) {
			// 提取服务端内联的亮色/暗色 SVG HTML
			const lightEl = embed.querySelector(".excalidraw-svg-light");
			const darkEl = embed.querySelector(".excalidraw-svg-dark");
			if (!lightEl || !darkEl) continue;

			const host = document.createElement("div");
			embed.replaceWith(host);
			diagramApps.push(
				mount(ExcalidrawDiagram, {
					target: host,
					props: {
						lightHtml: lightEl.innerHTML,
						darkHtml: darkEl.innerHTML,
						alt: embed.getAttribute("aria-label") ?? undefined
					}
				})
			);
		}
	}

	onMount(() => {
		if (!containerRef) return;

		// 需要在卸载时手动卸载的 Excalidraw 组件实例
		const diagramApps: ReturnType<typeof mount>[] = [];

		hydrateExcalidraw(containerRef, diagramApps);
		containerRef.addEventListener("click", handleCopyClick);

		return () => {
			containerRef?.removeEventListener("click", handleCopyClick);
			for (const app of diagramApps) unmount(app);
			diagramApps.length = 0;
		};
	});
</script>

<div bind:this={containerRef} class="prose-container max-w-none">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>

<style>
	/* 文章正文的基础排版样式(与渲染器生成的元素类名配合) */
	:global(.prose-container) {
		color: var(--foreground);
		line-height: 1.75;
	}

	:global(.prose-container p) {
		margin-top: 1.25rem;
		margin-bottom: 1.25rem;
	}

	:global(.prose-container a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--border);
		transition: text-decoration-color 0.15s ease;
	}

	:global(.prose-container a:hover) {
		text-decoration-color: var(--foreground);
	}

	/* Shiki 产出的 pre 重置为由外层容器控制内边距与背景 */
	:global(.prose-container pre) {
		margin: 0;
		padding: 0;
		background: transparent !important;
		font-family: var(--font-mono);
	}

	:global(.prose-container pre code) {
		background: transparent !important;
		border: none !important;
		padding: 0 !important;
		font-size: 13.5px !important;
		line-height: 1.75 !important;
		letter-spacing: 0.01em;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* 暗色模式下代码字重微调,提升可读性 */
	:global(.dark .prose-container pre code) {
		font-weight: 450;
	}

	/* 暗色高对比主题下的字符微光效果 */
	:global(.dark .prose-container .code-block-container pre code span) {
		text-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
	}

	@media (min-width: 640px) {
		:global(.prose-container pre code) {
			font-size: 14px !important;
		}
	}

	/* Shiki 双主题单份 HTML:服务端以 defaultColor:false 输出,每个 token
	 同时携带 --shiki-light / --shiki-dark 变量,这里按 html.dark 切换取值 */
	:global(html:not(.dark) .prose-container .shiki),
	:global(html:not(.dark) .prose-container .shiki span) {
		color: var(--shiki-light);
		font-style: var(--shiki-light-font-style);
		font-weight: var(--shiki-light-font-weight);
		text-decoration: var(--shiki-light-text-decoration);
	}
	:global(html.dark .prose-container .shiki),
	:global(html.dark .prose-container .shiki span) {
		color: var(--shiki-dark);
		font-style: var(--shiki-dark-font-style);
		font-weight: var(--shiki-dark-font-weight);
		text-decoration: var(--shiki-dark-text-decoration);
	}
</style>
