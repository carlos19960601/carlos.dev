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

<div class={cn("p-5 pt-0", className)} {...restProps}>
	{@render children?.()}
</div>
