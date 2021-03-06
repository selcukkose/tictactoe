const url = 'http://localhost:5000/api/';
var canvas = document.getElementById('canvas');
var player = 1; // True value represent player 1 and X
var game = [[2, 2, 2], [2, 2, 2], [2, 2, 2]];
var gameAreaWidth = canvas.width;
var gameAreaHeight = canvas.height;
var gameId;
let win = false;

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
	fetch(url + 'game/create', {
		method: 'POST'
	})
		.then((data) => { return data.json() })
		.then((res) => { gameId = res.gameId; });
	/**
	 * Begin draw rectangles
	 */
	for (let i = 0; i < 2; i++) {
		let part = (canvas.width / 3) * (i + 1);

		ctx.moveTo(part, 0);
		ctx.lineTo(part, canvas.height);
		ctx.stroke();

		ctx.moveTo(0, part);
		ctx.lineTo(canvas.width, part);
		ctx.stroke();
	}
	/**
	 * End draw rectangles
	 */

	document.onmouseup = draw;
}

function getCursorPostion (e) {
	let x = e.pageX;
	let y = e.pageY;
	return { x, y };
}

function draw (e) {
	// if (win == false) {
	let positions = getCursorPostion(e);
	let x = positions.x;
	let y = positions.y;
	let gameStrX = '', gameStrY = '', gameStrCross = '', gameStrCrossRev = '';
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let blockWidth = gameAreaWidth / 3;
			let partX = blockWidth * (j + 1);
			let partY = blockWidth * (i + 1);
			if (
				(x >= blockWidth * j && x <= partX) &&
				(y >= blockWidth * i && y <= partY) &&
				game[i][j] == 2
			) {
				game[i][j] = player;
				if (player === 1) {
					drawX(partX, partY, blockWidth);
				} else {
					drawO(partX, partY, blockWidth);
				}
				player = player === 1 ? 0 : 1;
			}
			gameStrX += game[i][j].toString();
			gameStrY += game[j][i].toString();
			if (i == j) {
				gameStrCross += game[i][j].toString();
			}
			if (j == (2 - i)) {
				gameStrCrossRev += game[i][j].toString();
			}
		}
		gameStrX += ',';
		gameStrY += ',';
	}
	if (gameStrX.indexOf('1'.repeat(3)) != -1 || gameStrX.indexOf('0'.repeat(3)) != -1) {
		win = true;
	} else if (gameStrY.indexOf('1'.repeat(3)) != -1 || gameStrY.indexOf('0'.repeat(3)) != -1) {
		win = true;
	} else if (gameStrCross.indexOf('1'.repeat(3)) != -1 || gameStrCross.indexOf('0'.repeat(3)) != -1) {
		win = true;
	} else if (gameStrCrossRev.indexOf('1'.repeat(3)) != -1 || gameStrCrossRev.indexOf('0'.repeat(3)) != -1) {
		win = true;
	}
	if (win === true) {
		window.alert((player == 0 ? 'X' : 'O') + ' WIN');
	}
	// }
}

function drawX (x, y, blockWidth) {
	let size = 40;
	x = x - (blockWidth / 2) - 20;
	y = y - (blockWidth / 2) - 20;
	ctx.moveTo(x, y);
	ctx.lineTo(x + size, y + size);
	ctx.moveTo(x, y + size);
	ctx.lineTo(x + size, y);
	ctx.stroke();
}

function drawO (x, y, blockWidth) {
	let radius = 25;
	x = x - (blockWidth / 2);
	y = y - (blockWidth / 2);
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.stroke();
}
