<!-- 全局根布局:引入全局样式与站点图标,所有页面共享 -->
<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";

	// 子路由页面内容
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
