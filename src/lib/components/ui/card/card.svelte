<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props extends Partial<HTMLAttributes<HTMLDivElement>> {
		class?: string;
		children?: Snippet;
	}

	let { class: className = "", children, ...restProps }: Props = $props();
</script>

<div
	class={cn(
		"rounded-xl border border-border/80 bg-card text-card-foreground shadow-xs transition-all duration-200",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
