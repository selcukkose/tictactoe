/**
 * BEGIN Imports
 */
const express = require('express');
const cors = require('cors');
const redis = require('redis');
var bodyParser = require('body-parser');

const apiConfig = require('../config/api_config');
const gameController = require('./controllers/game_controller.js');
/**
 * END Imports
 */

/**
 * BEGIN Initilazation
 */
const app = express();
const port = apiConfig.game_api.port;
app.use(bodyParser.json());
app.use(cors({
	origin: '*'
}));


const redisClient = redis.createClient();
redisClient.on('error', (err) => {
	console.log('Redis Error: ' + err);
});
redisClient.AUTH(apiConfig.redis.password);

gameController.init(redisClient);
/**
 * BEGIN Initilazation
 */

/**
 * BEGIN Controllers
 */
app.post('/api/game/create', gameController.createGame);
app.post('/api/game/draw', gameController.draw);
/**
 * END Controllers
 */

/**
 * BEGIN Server
 */
app.listen(port, () => {
	console.log(`Server Running On Port ${port}`);
});
/**
 * END Server
 */