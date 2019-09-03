const config = require('../../config/api_config.js');

var redisConn;

module.exports = {

	init: function (redisClient) {
		redisConn = redisClient;
	},

	/**
	 * Draw player signiture and check player win
	 * @param {Number} gameId
	 * @param {Number} player
	 * @param {Number} x Column Index(Start From 0)
	 * @param {Number} y Row Index(Start from 0)
	 */
	draw: function (req, res) {
		let postedValues = req.body;
		try {
			let gameId = postedValues.gameId;
			let player = postedValues.player;
			let x = postedValues.x;
			let y = postedValues.y;

			let gameKey = 'game_' + gameId;
			console.log('gameKey', gameKey);

			if ((x >= 0 && x <= 2) && (y >= 0 && y <= 2)) {
				redisConn.exists(gameKey, (err, gameExistRes) => {
					if (gameExistRes !== 1) {
						res.status(400).send('Game Not Exists');
					}

					redisConn.get(gameKey, (err, gameResult) => {
						let rows = gameResult.split(',');


						let row = rows[y];
						rows[y] = row.substr(0, x) + player + row.substr(x + 1, row.length);

						let newGame = rows.join();

						redisConn.set(gameKey, newGame, (err, setRes) => {
							if (setRes === 'OK') {
								rows = newGame.split(',');
								let rowStr = newGame, columnStr = '', crossStr = '', crossRevStr = '';
								for (let i = 0; i < 3; i++) {
									for (let j = 0; j < 3; j++) {
										columnStr += rows[j].substr(i, 1);
										if (i == j) {
											crossStr += rows[j].substr(j, 1);
										}
										if (j == (2 - i)) {
											crossRevStr += rows[i].substr(j, 1);
										}
									}
									if (i < 2) {
										columnStr += ',';
									}
								}

								let win = false;
								if (rowStr.indexOf('1'.repeat(3)) != -1 || rowStr.indexOf('0'.repeat(3)) != -1) {
									win = true;
								} else if (columnStr.indexOf('1'.repeat(3)) != -1 || columnStr.indexOf('0'.repeat(3)) != -1) {
									win = true;
								} else if (crossStr.indexOf('1'.repeat(3)) != -1 || crossStr.indexOf('0'.repeat(3)) != -1) {
									win = true;
								} else if (crossRevStr.indexOf('1'.repeat(3)) != -1 || crossRevStr.indexOf('0'.repeat(3)) != -1) {
									win = true;
								}

								res.status(200).send({ "win": win });
							}
							res.status(400).send();
						});
					});
				});
			} else {
				res.status(400).send('Cordinates Not Valid');
			}
		} catch (err) {
			console.log('Error: ', err);
			res.status(500).send();
		}
	},

	/**
	 * Create new game
	 */
	createGame: function (req, res) {

		let gameArea = '222,222,222';
		let gameId = 1;

		redisConn.exists('game_key_index', (err, existRes) => {
			if (existRes !== 1) {
				redisConn.set('game_key_index', '1');
			}
			redisConn.get('game_key_index', (err, getKeyRes) => {
				gameId = getKeyRes;

				redisConn.set('game_' + gameId, gameArea);

				let nextGameIndex = parseInt(gameId) + 1;
				redisConn.set('game_key_index', nextGameIndex.toString());

				res.status(200).send({ "gameId": gameId });
			});
		});
	}
}