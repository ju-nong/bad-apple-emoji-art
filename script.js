// FPS, Volume 저장
const cookieFPS = document.cookie
	.split("; ")
	.find((row) => row.startsWith("bad-apple-emoji-fps="));
const cookieVol = document.cookie
	.split("; ")
	.find((row) => row.startsWith("bad-apple-emoji-vol="));

const videoInput = document.getElementById("videoInput");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const output = document.getElementById("output");
const playPauseBtn = document.getElementById("playPause");

const volSlider = document.getElementById("volSlider");
const volValue = document.getElementById("volValue");

if (cookieVol) {
	const vol = Number(cookieVol.split("=")[1]);
	video.volume = vol;
	volSlider.value = vol;
	volValue.textContent = vol.toFixed(2);
}

volSlider.addEventListener("input", () => {
	const vol = Number(volSlider.value);
	video.volume = vol;
	volValue.textContent = vol.toFixed(2);

	document.cookie = `bad-apple-emoji-vol=${vol}; max-age=31536000; path=/`;
});

// 이모지 규칙
const BACKGROUND = "🌕";
const OBJECT = "🌑";
const LEFT_EDGE = ["🌒", "🌓", "🌔"];
const RIGHT_EDGE = ["🌘", "🌗", "🌖"];

const SOBEL_X = [
	[-1, 0, 1],
	[-2, 0, 2],
	[-1, 0, 1],
];
const SOBEL_Y = [
	[1, 2, 1],
	[0, 0, 0],
	[-1, -2, -1],
];

const fpsSlider = document.getElementById("fpsSlider");
const fpsValue = document.getElementById("fpsValue");
const FRAME_WIDTH = 60;
let FPS = 5;

if (cookieFPS) {
	FPS = Number(cookieFPS.split("=")[1]);
	fpsSlider.value = FPS;
	fpsValue.textContent = FPS;
}

// 슬라이더 이벤트
fpsSlider.addEventListener("input", () => {
	FPS = Number(fpsSlider.value);
	fpsValue.textContent = FPS;

	document.cookie = `bad-apple-emoji-fps=${FPS}; max-age=31536000; path=/`;
});

// --- 재생 / 일시정지 + 소리 동기 ---
function playFrame() {
	if (!isPlaying) return;
	output.textContent = frameToEmoji();
	requestAnimationFrame(() => {
		setTimeout(playFrame, 1000 / FPS); // 슬라이더 값 반영
	});
}

let isPlaying = false;

video.load();

playPauseBtn.disabled = true;
output.textContent = "프레임 준비 중...";

video.onloadedmetadata = () => {
	canvas.width = FRAME_WIDTH;
	canvas.height = Math.floor(
		(video.videoHeight / video.videoWidth) * FRAME_WIDTH * 0.5,
	);
	playPauseBtn.disabled = false;
	output.textContent = `🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑`;
};

// --- 프레임 → 이모지 변환 ---
function frameToEmoji() {
	const { width, height } = canvas;
	ctx.drawImage(video, 0, 0, width, height);
	const data = ctx.getImageData(0, 0, width, height).data;

	const gray = [];
	for (let i = 0; i < data.length; i += 4) gray.push(data[i]);

	const gxArr = new Array(width * height).fill(0);
	const magArr = new Array(width * height).fill(0);

	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			let gx = 0,
				gy = 0;
			for (let ky = -1; ky <= 1; ky++) {
				for (let kx = -1; kx <= 1; kx++) {
					const v = gray[(y + ky) * width + (x + kx)];
					gx += SOBEL_X[ky + 1][kx + 1] * v;
					gy += SOBEL_Y[ky + 1][kx + 1] * v;
				}
			}
			const i = y * width + x;
			gxArr[i] = gx;
			magArr[i] = Math.hypot(gx, gy);
		}
	}

	const mags = magArr.filter((v) => v > 0).sort((a, b) => a - b);
	const EDGE_THRESHOLD = mags[Math.floor(mags.length * 0.6)] || 0;

	let result = "";
	const widthMinus = width - 1;
	const heightMinus = height - 1;

	for (let y = 1; y < heightMinus; y++) {
		for (let x = 1; x < widthMinus; x++) {
			const i = y * width + x;
			const l = gray[i];
			const mag = magArr[i];
			const gx = gxArr[i];

			// Non-Maximum Suppression
			let isEdge = false;
			if (mag > EDGE_THRESHOLD) {
				const up = magArr[(y - 1) * width + x] || 0;
				const down = magArr[(y + 1) * width + x] || 0;
				const left = magArr[y * width + (x - 1)] || 0;
				const right = magArr[y * width + (x + 1)] || 0;
				if (mag >= up && mag >= down && mag >= left && mag >= right) {
					isEdge = true;
				}
			}

			if (isEdge) {
				const level = Math.min(
					2,
					Math.floor((mag / EDGE_THRESHOLD) * 1.5),
				);
				result += gx > 0 ? LEFT_EDGE[level] : RIGHT_EDGE[level];
			} else if (l < 128) {
				result += OBJECT;
			} else {
				result += BACKGROUND;
			}
		}
		result += "\n";
	}

	return result;
}

// --- 재생 / 일시정지 + 소리 동기 ---
function playFrame() {
	if (!isPlaying) return;
	output.textContent = frameToEmoji();
	requestAnimationFrame(() => {
		// 다음 프레임 표시 간격 조절
		setTimeout(playFrame, 1000 / FPS);
	});
}

playPauseBtn.addEventListener("click", () => {
	isPlaying = !isPlaying;
	playPauseBtn.textContent = isPlaying ? "⏸️" : "▶️";

	if (isPlaying) {
		// 비디오 소리 재생 시작
		video.play();
		playFrame();
	} else {
		video.pause();
	}
});
