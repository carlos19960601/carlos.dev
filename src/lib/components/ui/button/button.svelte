<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "pill";
	type ButtonSize = "default" | "sm" | "lg" | "icon" | "pill";

	interface Props extends Partial<HTMLButtonAttributes> {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		href?: string;
		target?: string;
		rel?: string;
		children?: Snippet;
	}

	let {
		variant = "default",
		size = "default",
		class: className = "",
		href,
		children,
		...restProps
	}: Props = $props();

	const variantStyles: Record<ButtonVariant, string> = {
		default: "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98]",
		destructive: "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90 active:scale-[0.98]",
		outline: "border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
		secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:scale-[0.98]",
		ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
		link: "text-primary underline-offset-4 hover:underline",
		pill: "bg-card/90 backdrop-blur-md border border-border/80 shadow-xs hover:bg-accent/80 hover:border-border text-foreground transition-all duration-200"
	};

	const sizeStyles: Record<ButtonSize, string> = {
		default: "h-9 px-4 py-2 text-sm",
		sm: "h-8 rounded-md px-3 text-xs",
		lg: "h-10 rounded-md px-8 text-base",
		icon: "h-9 w-9 rounded-md",
		pill: "h-8 px-3 rounded-full text-xs font-medium"
	};

	const baseClasses =
		"inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";
</script>

{#if href}
	<a
		{href}
		class={cn(baseClasses, variantStyles[variant], sizeStyles[size], className)}
		{...restProps as HTMLAnchorAttributes}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		class={cn(baseClasses, variantStyles[variant], sizeStyles[size], className)}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
