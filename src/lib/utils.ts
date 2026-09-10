/**
 * 通用工具函数(客户端/服务端均可使用)
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 组合 Tailwind 类名:clsx 负责条件拼接,twMerge 负责解决类名冲突(后者优先)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * HTML 实体转义,防止用户内容(Markdown 原文、alt 文本等)注入标签
 */
export function escapeHtml(text: string) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
