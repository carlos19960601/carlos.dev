<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	type BadgeVariant = "default" | "secondary" | "outline" | "subtle" | "tag";

	interface Props extends Partial<HTMLAttributes<HTMLDivElement>> {
		variant?: BadgeVariant;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = "default",
		class: className = "",
		children,
		...restProps
	}: Props = $props();

	const variantStyles: Record<BadgeVariant, string> = {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		outline: "border-border text-foreground",
		subtle: "border-border/60 bg-muted/60 text-muted-foreground hover:bg-muted font-mono text-[11px]",
		tag: "border-border/50 bg-secondary/70 text-foreground/80 hover:bg-secondary hover:text-foreground font-mono text-[11px] rounded-full px-2.5 py-0.5"
	};
</script>

<div
	class={cn(
		"inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring select-none",
		variantStyles[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
