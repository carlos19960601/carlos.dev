<script lang="ts">
	import { onMount } from "svelte";
	import { playClickSound, playSuccessSound } from "$lib/sound";

	interface Props {
		html: string;
	}

	let { html }: Props = $props();
	let containerRef: HTMLDivElement | null = null;

	onMount(() => {
		if (!containerRef) return;

		// 委托处理所有代码块复制按钮
		function handleClick(e: MouseEvent) {
			const target = (e.target as HTMLElement).closest(".copy-code-btn") as HTMLButtonElement | null;
			if (!target) return;

			playClickSound();
			const rawEncoded = target.getAttribute("data-code");
			if (!rawEncoded) return;

			try {
				const code = decodeURIComponent(rawEncoded);
				navigator.clipboard.writeText(code).then(() => {
					playSuccessSound();
					const labelEl = target.querySelector(".copy-label");
					if (labelEl) {
						const original = labelEl.textContent;
						labelEl.textContent = "Copied!";
						target.classList.add("text-emerald-500", "bg-emerald-500/10");
						setTimeout(() => {
							labelEl.textContent = original;
							target.classList.remove("text-emerald-500", "bg-emerald-500/10");
						}, 1800);
					}
				});
			} catch (err) {
				console.error("复制失败:", err);
			}
		}

		containerRef.addEventListener("click", handleClick);
		return () => {
			containerRef?.removeEventListener("click", handleClick);
		};
	});
</script>

<div bind:this={containerRef} class="prose-container max-w-none">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html html}
</div>

<style>
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
		font-size: 13px !important;
		line-height: 1.65;
	}
</style>
