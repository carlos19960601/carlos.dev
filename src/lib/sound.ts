/**
 * 站点交互音效系统(基于 Web Audio API)
 *
 * 提供清脆细腻的 UI 交互音效反馈(点击、切换、成功提示等),
 * 支持用户级开关并持久化到 localStorage。
 *
 * 使用方式:
 *   - 应用挂载时调用 initSound() 读取用户偏好;
 *   - 组件内直接调用 playClickSound() 等高层音效函数;
 *   - 音效开关状态由 HeaderNav 中的按钮触发 toggleSound() 切换。
 */

/** localStorage 中音效开关的持久化键名 */
const STORAGE_KEY = "site_sound_enabled";

/** 全局 AudioContext 单例(浏览器限制下懒创建) */
let audioCtx: AudioContext | null = null;

/** 当前音效开关(仅客户端有效,SSR 阶段保持默认开启) */
let soundEnabled = true;

// ============================================================
// 配置与开关
// ============================================================

/**
 * 初始化音效配置:从 localStorage 恢复用户的开关偏好。
 * 应在客户端应用挂载时调用一次。
 */
export function initSound() {
	if (typeof window === "undefined") return;
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved !== null) {
		soundEnabled = saved === "true";
	}
}

/** 读取当前音效开关状态 */
export function isSoundEnabled(): boolean {
	return soundEnabled;
}

/**
 * 切换音效开关并持久化。
 * 开启时立即播放一声确认音,给用户即时反馈。
 * @returns 切换后的开关状态
 */
export function toggleSound(): boolean {
	soundEnabled = !soundEnabled;
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, String(soundEnabled));
		if (soundEnabled) {
			playPopSound(580, "sine", 0.05);
		}
	}
	return soundEnabled;
}

// ============================================================
// 底层播放
// ============================================================

/**
 * 获取(并按需创建)全局 AudioContext 单例。
 * 处于 suspended 状态(浏览器自动播放策略)时自动尝试恢复。
 */
function getAudioContext(): AudioContext | null {
	if (typeof window === "undefined") return null;

	if (!audioCtx) {
		// 兼容旧版 Safari 的 webkit 前缀
		const AudioContextClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext;
		if (AudioContextClass) {
			audioCtx = new AudioContextClass();
		}
	}

	if (audioCtx && audioCtx.state === "suspended") {
		audioCtx.resume();
	}
	return audioCtx;
}

/**
 * 播放单个短促音符(振荡器 + 指数衰减包络)。
 * 频率从 freq 略微下滑至 freq * 0.7,营造自然的"啵"声听感。
 *
 * @param freq      起始频率(Hz)
 * @param type      波形类型
 * @param duration  持续时长(秒)
 * @param options   可选:delay 相对当前时刻的延迟(秒),peakGain 峰值音量
 */
function playTone(
	freq: number,
	type: OscillatorType,
	duration: number,
	options?: { delay?: number; peakGain?: number },
): boolean {
	if (!soundEnabled) return false;

	try {
		const ctx = getAudioContext();
		if (!ctx) return false;

		const { delay = 0, peakGain = 0.08 } = options ?? {};
		const startAt = ctx.currentTime + delay;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, startAt);
		// 频率略微下滑,声音更接近真实点击而非纯蜂鸣
		osc.frequency.exponentialRampToValueAtTime(
			freq * 0.7,
			startAt + duration,
		);

		gain.gain.setValueAtTime(peakGain, startAt);
		gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(startAt);
		osc.stop(startAt + duration);
		return true;
	} catch {
		// 忽略音频播放异常(如浏览器自动播放限制)
		return false;
	}
}

// ============================================================
// 高层音效(按交互语义命名,组件直接调用)
// ============================================================

/** 通用"啵"声:可自定义参数,供需要特殊音调的场景使用 */
export function playPopSound(
	freq = 440,
	type: OscillatorType = "sine",
	duration = 0.04,
) {
	playTone(freq, type, duration);
}

/** 点击反馈:高频短促的轻点声 */
export function playClickSound() {
	playTone(520, "sine", 0.035);
}

/** 开关切换反馈:开启时音调上扬,关闭时下沉 */
export function playToggleSound(active: boolean) {
	playTone(active ? 660 : 420, "triangle", 0.05);
}

/** 成功提示:D5 → A5 两音上行琶音(如复制成功的确认音) */
export function playSuccessSound() {
	playTone(587.33, "sine", 0.08); // D5
	playTone(880, "sine", 0.14, { delay: 0.06, peakGain: 0.06 }); // A5
}
