const Hands = ["gu", "choki", "pa"];
const HandsImages = {
	gu: "./img/gu-rich.png",
	choki: "./img/choki-rich.png",
	pa: "./img/pa-rich.png",
};

let winCount = 0;
let loseCount = 0;
let drawCount = 0;
let cpuHand = "gu";
//Intervalは、一定時間ごとに特定の処理を繰り返す時に使う。
let intervalId = null;

const cpuImage = document.getElementById("cpuImage");
const buttons = document.querySelectorAll("button[data-choice]");
const result = document.getElementById("result");
const resetButton = document.getElementById("reset-button");
const win = document.getElementById("win");
const winSound = document.getElementById("win-sound");
const lose = document.getElementById("lose");
const loseSound = document.getElementById("lose-sound");
const draw = document.getElementById("draw");
const countReset = document.getElementById("count-reset");


/*==================================
CPUの手をランダムに出すための関数
==================================*/
//ここで調べたこと []は箱の役割がある。[]の中に入れたものを配列といい、空にもできる
function startShuffling() {
	//ここで調べたこと () =>はアロー関数といい、短い書き方で関数を定義できる
	//ここで調べたこと setIntervalは、指定した時間ごとに関数を実行するためのメソッド
	//最後の2行の読み出し？指定先がものすごく時間がかかった
	intervalId = setInterval(() => {
		const randomCpuHands = Math.floor(Math.random() * Hands.length);
		cpuHand = Hands[randomCpuHands];
		cpuImage.src = HandsImages[cpuHand];
	}, 30);
	resetButton.style.display = "none";
}
//ここで調べたこと 上だけだと動かなかった…↓のようにすることで正式に実装されるらしい
startShuffling();

/*==================================
グー・チョキ・パーボタンを押したときの関数
・CPUのランダムを止める
・もう一度勝負ボタンを押すまでじゃんけんボタンは押せないように
・playerがなんのボタンを押したのか取得する
・スコアを更新する
①layerとcpuの勝敗を判断し、Resultに載せる②リセットボタン
↑上記2点を表示させる
==================================*/
// 最初、forEachを使ってなかったので、ボタンを押しても何も起こらなかった
buttons.forEach((button) => {
	button.addEventListener("click", () => {
		clearInterval(intervalId);
		//以下でもう一度勝負ボタンを押すまでじゃんけんボタンは押せないように
		// ここでもforEachを使う…forEach重要そう
		buttons.forEach((btn) => {
			btn.disabled = true;
			btn.style.opacity = "0.6";
			btn.style.cursor = "not-allowed";
		});

		const playerHand = button.dataset.choice;
		const gameResult = judge(playerHand, cpuHand);
		//ここで調べたこと texContentはテキストを書き換える
		//gameResultにはplayerとCPUの勝敗が入っていて、それをresultに表示させている
		result.textContent = gameResult;
		resetButton.style.display = "block";
	});
});

/*==================================
じゃんけんの勝敗判断をする関数
==================================*/
// 最初、returnを最初に書いていたので、勝敗がうまくでなかった。
// 最後にreturnを書いたら、うまくいった
//連続して同じ音楽が再生される時に、音楽が流れないことがあった.
//currentTime = 0;にすることで、はじめから再生されるようになった
//.volume = 0.2;は音量調節！
function judge(player, cpu) {
	if (player === cpu) {
		drawCount++;
		draw.textContent = drawCount;
		return "あいこだよ！もう一回(^o^)！！";
	}
	if (
		(player === "gu" && cpu === "choki") ||
		(player === "choki" && cpu === "pa") ||
		(player === "pa" && cpu === "gu")
	) {
		winSound.volume = 0.2;
		winSound.currentTime = 0;
		winSound.play();
		winCount++;
		win.textContent = winCount;
		return "キミの勝ち〜〜！！やるじゃん(*^^*)";
	} else {
		loseSound.volume = 0.2;
		loseSound.currentTime = 0;
		loseSound.play();
		loseCount++;
		lose.textContent = loseCount;
		return "キミの負け……また挑戦してね(ﾟ∀ﾟ)";
	}
}
/*==================================
カウントリセットボタンで再開させる関数
・かち、まけ、あいこのカウントを0にする
・それぞれのカウント数に表示させる
==================================*/
countReset.addEventListener("click", () => {
	winCount = 0;
	loseCount = 0;
	drawCount = 0;
	win.textContent = winCount;
	lose.textContent = loseCount;
	draw.textContent = drawCount;
});

/*==================================
もう一回勝負！ボタンで再開させる関数
==================================*/
resetButton.addEventListener("click", () => {
	resetButton.style.display = "none";
	//textContentを空にすることで、結果を非表示にしている
	result.textContent = "";
	//startShufflingを実行させる
	startShuffling();
	//以下でじゃんけんボタンが押せ得るように！
	// ここでもforEachを使う…forEach重要そう
	buttons.forEach((btn) => {
		btn.disabled = false;
		btn.style.opacity = "1";
		btn.style.cursor = "pointer";
	});
});
