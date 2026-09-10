<script lang="ts">
	import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from '@lucide/svelte';

	let { lightHtml, darkHtml, alt = 'Excalidraw 图表' }: { lightHtml: string; darkHtml: string; alt?: string } = $props();

	// 视图变换状态
	let scale = $state(1);
	let tx = $state(0);
	let ty = $state(0);
	let isFullscreen = $state(false);

	let cardEl: HTMLDivElement | null = $state(null);
	let viewportEl: HTMLDivElement | null = $state(null);

	const MIN_SCALE = 1;
	const MAX_SCALE = 10;
	const ZOOM_STEP = 1.2;

	// 全屏状态跟踪
	$effect(() => {
		const handler = () => (isFullscreen = !!document.fullscreenElement);
		document.addEventListener('fullscreenchange', handler);
		return () => document.removeEventListener('fullscreenchange', handler);
	});

	function clampScale(s: number) {
		return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
	}

	function resetView() {
		scale = 1;
		tx = 0;
		ty = 0;
	}

	// 限制平移范围
	function clampPan() {
		if (!viewportEl) return;
		const w = viewportEl.clientWidth;
		const h = viewportEl.clientHeight;
		tx = Math.min(0, Math.max(w - w * scale, tx));
		ty = Math.min(0, Math.max(h - h * scale, ty));
	}

	// 以视口内坐标 (cx, cy) 为锚点缩放
	function zoomAt(cx: number, cy: number, nextScale: number) {
		nextScale = clampScale(nextScale);
		if (nextScale === scale) return;
		const px = (cx - tx) / scale;
		const py = (cy - ty) / scale;
		tx = cx - px * nextScale;
		ty = cy - py * nextScale;
		scale = nextScale;
		clampPan();
	}

	function zoomByButtons(dir: 1 | -1) {
		const rect = viewportEl?.getBoundingClientRect();
		if (!rect) return;
		zoomAt(rect.width / 2, rect.height / 2, scale * Math.pow(ZOOM_STEP, dir));
	}

	// 仅 Ctrl/⌘ + 滚轮缩放，普通滚轮保持页面滚动
	function onWheel(e: WheelEvent) {
		if (!(e.ctrlKey || e.metaKey)) return;
		e.preventDefault();
		const rect = viewportEl?.getBoundingClientRect();
		if (!rect) return;
		const factor = Math.exp(-e.deltaY * 0.01);
		zoomAt(e.clientX - rect.left, e.clientY - rect.top, scale * factor);
	}

	// 指针交互：单指/鼠标拖拽平移，双指捏合缩放
	const pointers = new Map<number, { x: number; y: number }>();
	let pinchBase: {
		dist: number;
		scale: number;
		midX: number;
		midY: number;
		tx: number;
		ty: number;
	} | null = null;
	let dragging = false;
	let dragCaptured = false;
	let lastTapTime = 0;
	let lastTapX = 0;
	let lastTapY = 0;

	function localPoint(e: PointerEvent) {
		const rect = viewportEl!.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function onPointerDown(e: PointerEvent) {
		if (!viewportEl) return;
		pointers.set(e.pointerId, localPoint(e));
		if (pointers.size >= 2) {
			while (pointers.size > 2) {
				const oldest = pointers.keys().next().value;
				if (oldest === undefined) break;
				pointers.delete(oldest);
			}
			for (const id of pointers.keys()) {
				try {
					viewportEl.setPointerCapture(id);
				} catch {
					// 忽略
				}
			}
			const [a, b] = [...pointers.values()];
			pinchBase = {
				dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
				scale,
				midX: (a.x + b.x) / 2,
				midY: (a.y + b.y) / 2,
				tx,
				ty
			};
			dragging = false;
		} else if (pointers.size === 1) {
			const now = performance.now();
			const p = localPoint(e);
			if (now - lastTapTime < 300 && Math.hypot(p.x - lastTapX, p.y - lastTapY) < 20) {
				resetView();
				lastTapTime = 0;
			} else {
				lastTapTime = now;
				lastTapX = p.x;
				lastTapY = p.y;
			}
			dragging = true;
			dragCaptured = false;
		}
	}

	function onPointerMove(e: PointerEvent) {
		if (!pointers.has(e.pointerId) || !viewportEl) return;
		const prev = pointers.get(e.pointerId)!;
		const cur = localPoint(e);
		pointers.set(e.pointerId, cur);

		if (pointers.size === 2 && pinchBase) {
			const [a, b] = [...pointers.values()];
			const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
			const midX = (a.x + b.x) / 2;
			const midY = (a.y + b.y) / 2;
			const next = clampScale((pinchBase.scale * dist) / pinchBase.dist);
			const px = (pinchBase.midX - pinchBase.tx) / pinchBase.scale;
			const py = (pinchBase.midY - pinchBase.ty) / pinchBase.scale;
			tx = midX - px * next;
			ty = midY - py * next;
			scale = next;
			clampPan();
		} else if (dragging) {
			if (!dragCaptured) {
				dragCaptured = true;
				try {
					viewportEl.setPointerCapture(e.pointerId);
				} catch {
					// 忽略
				}
			}
			tx += cur.x - prev.x;
			ty += cur.y - prev.y;
			clampPan();
		}
	}

	function onPointerUp(e: PointerEvent) {
		pointers.delete(e.pointerId);
		pinchBase = null;
		if (pointers.size === 0) dragging = false;
	}

	async function toggleFullscreen() {
		try {
			if (!document.fullscreenElement) {
				await cardEl?.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch {
			// 浏览器不支持或拒绝时静默忽略
		}
	}
</script>

<div
	bind:this={cardEl}
	class="excalidraw-card group/diagram relative my-8 overflow-hidden rounded-xl border border-border/80 shadow-2xs"
	class:bg-white={!isFullscreen}
	class:dark:bg-[#181818]={!isFullscreen}
	role="img"
	aria-label={alt}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={viewportEl}
		class="ex-viewport relative cursor-grab active:cursor-grabbing"
		style="touch-action: none;"
		onwheel={onWheel}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		ondblclick={resetView}
	>
		<div
			class="ex-stage"
			style={`transform: translate(${tx}px, ${ty}px) scale(${scale}); transform-origin: 0 0;`}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="dark:hidden">{@html lightHtml}</div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="hidden dark:block">{@html darkHtml}</div>
		</div>

		<!-- 操作提示（悬停显示） -->
		<div
			class="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/5 px-2 py-1 font-mono text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover/diagram:opacity-100 dark:bg-white/5"
		>
			Ctrl+滚轮缩放 · 拖拽平移 · 双击复位
		</div>
	</div>

	<!-- 缩放工具栏 -->
	<div
		class="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200/80 bg-white/90 p-0.5 shadow-2xs backdrop-blur dark:border-neutral-700/80 dark:bg-neutral-800/90"
	>
		<button
			type="button"
			class="cursor-pointer rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
			onclick={() => zoomByButtons(-1)}
			aria-label="缩小"
		>
			<ZoomOut size={14} />
		</button>
		<button
			type="button"
			class="min-w-11 cursor-pointer rounded-md px-1 py-0.5 text-center font-mono text-[11px] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
			onclick={resetView}
			aria-label="复位视图"
			title="双击图表也可复位"
		>
			{Math.round(scale * 100)}%
		</button>
		<button
			type="button"
			class="cursor-pointer rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
			onclick={() => zoomByButtons(1)}
			aria-label="放大"
		>
			<ZoomIn size={14} />
		</button>
		<button
			type="button"
			class="cursor-pointer rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 active:scale-95 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
			onclick={toggleFullscreen}
			aria-label={isFullscreen ? '退出全屏' : '全屏查看'}
		>
			{#if isFullscreen}
				<Minimize2 size={14} />
			{:else}
				<Maximize2 size={14} />
			{/if}
		</button>
	</div>
</div>

<style>
	.ex-viewport {
		user-select: none;
		-webkit-user-drag: none;
	}

	/* SVG 自适应宽度 */
	.ex-stage :global(svg) {
		width: 100%;
		height: auto;
		display: block;
	}

	.excalidraw-card:fullscreen {
		border-radius: 0;
		border: none;
	}

	/* 确保图表在 dark 模式下精准切换 */
	:global(html.dark) .dark\:hidden {
		display: none !important;
	}
	:global(html.dark) .hidden.dark\:block {
		display: block !important;
	}
	:global(html:not(.dark)) .hidden.dark\:block {
		display: none !important;
	}
</style>
