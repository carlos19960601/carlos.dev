<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props extends Partial<HTMLInputAttributes> {
		class?: string;
		value?: string;
	}

	let { class: className = "", value = $bindable(), ...restProps }: Props = $props();
</script>

<input
	class={cn(
		"flex h-9 w-full rounded-md border border-input bg-background/80 px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	bind:value
	{...restProps}
/>
