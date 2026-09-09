// 现代 Web Audio API 音效系统，提供清脆细腻的交互反馈

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// 初始化并在客户端读取配置
export function initSound() {
	if (typeof window === 'undefined') return;
	const saved = localStorage.getItem('site_sound_enabled');
	if (saved !== null) {
		soundEnabled = saved === 'true';
	}
}

export function isSoundEnabled(): boolean {
	return soundEnabled;
}

export function toggleSound(): boolean {
	soundEnabled = !soundEnabled;
	if (typeof window !== 'undefined') {
		localStorage.setItem('site_sound_enabled', String(soundEnabled));
		if (soundEnabled) {
			playPopSound(580, 'sine', 0.05);
		}
	}
	return soundEnabled;
}

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!audioCtx) {
		const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		if (AudioContextClass) {
			audioCtx = new AudioContextClass();
		}
	}
	if (audioCtx && audioCtx.state === 'suspended') {
		audioCtx.resume();
	}
	return audioCtx;
}

export function playPopSound(freq = 440, type: OscillatorType = 'sine', duration = 0.04) {
	if (!soundEnabled) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + duration);

		gain.gain.setValueAtTime(0.08, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start();
		osc.stop(ctx.currentTime + duration);
	} catch {
		// 忽略音频播放异常（如自动播放限制）
	}
}

export function playClickSound() {
	playPopSound(520, 'sine', 0.035);
}

export function playToggleSound(active: boolean) {
	if (active) {
		playPopSound(660, 'triangle', 0.05);
	} else {
		playPopSound(420, 'triangle', 0.05);
	}
}

export function playSuccessSound() {
	if (!soundEnabled) return;
	try {
		const ctx = getAudioContext();
		if (!ctx) return;
		const now = ctx.currentTime;
		
		const osc1 = ctx.createOscillator();
		const osc2 = ctx.createOscillator();
		const gain = ctx.createGain();

		osc1.type = 'sine';
		osc2.type = 'sine';
		osc1.frequency.setValueAtTime(587.33, now); // D5
		osc2.frequency.setValueAtTime(880, now + 0.06); // A5

		gain.gain.setValueAtTime(0.06, now);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

		osc1.connect(gain);
		osc2.connect(gain);
		gain.connect(ctx.destination);

		osc1.start(now);
		osc1.stop(now + 0.08);
		osc2.start(now + 0.06);
		osc2.stop(now + 0.2);
	} catch {
		// 忽略错误
	}
}
