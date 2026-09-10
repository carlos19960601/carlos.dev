import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		// SvelteKit 2.62+ 支持将全部配置直接内联到 Vite 插件参数中,
		// 此时 svelte.config.js 会被忽略,无需再维护两份配置文件
		sveltekit({
			compilerOptions: {
				// 强制项目源码启用 runes 模式(node_modules 内的库组件除外);Svelte 6 起可移除
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
			},

			// adapter-auto 仅支持部分部署环境,详见 https://svelte.dev/docs/kit/adapter-auto
			// 若目标环境不受支持或已确定部署平台,请替换为对应 adapter
			adapter: adapter(),
		}),
	],
});
