/**
 * 全站版面宽度偏好(窄屏 / 宽屏)
 *
 * 通过 <html> 上的 reading-wide 类驱动各页 max-width,并持久化到 localStorage。
 */

const STORAGE_KEY = "site_reading_width";
const WIDE_CLASS = "reading-wide";

/** 读取用户是否偏好宽屏(SSR / 无 window 时默认窄屏) */
export function isReadingWidePreferred(): boolean {
	if (typeof window === "undefined") return false;
	try {
		return localStorage.getItem(STORAGE_KEY) === "wide";
	} catch {
		return false;
	}
}

/** 当前文档是否处于宽屏阅读态 */
export function isReadingWideActive(): boolean {
	if (typeof document === "undefined") return false;
	return document.documentElement.classList.contains(WIDE_CLASS);
}

/**
 * 应用(或不应用)宽屏类。
 * @param persist 为 true 时同时写入 localStorage
 */
export function applyReadingWide(wide: boolean, persist = false) {
	if (typeof document !== "undefined") {
		document.documentElement.classList.toggle(WIDE_CLASS, wide);
	}
	if (persist && typeof window !== "undefined") {
		try {
			localStorage.setItem(STORAGE_KEY, wide ? "wide" : "narrow");
		} catch {
			// 隐私模式等无法写入时忽略
		}
	}
}

/** 切换宽/窄屏并持久化,返回切换后是否为宽屏 */
export function toggleReadingWide(): boolean {
	const next = !isReadingWideActive();
	applyReadingWide(next, true);
	return next;
}
