<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props extends Partial<HTMLAttributes<HTMLParagraphElement>> {
		class?: string;
		children?: Snippet;
	}

	let { class: className = "", children, ...restProps }: Props = $props();
</script>

<p class={cn("text-xs text-muted-foreground leading-relaxed", className)} {...restProps}>
	{@render children?.()}
</p>
