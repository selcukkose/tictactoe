/**
 * BEGIN Imports
 */
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const apiConfig = require('../config/api_config');
/**
 * END Imports
 */

/**
* BEGIN Initilazation
*/
const app = express();
const port = apiConfig.auth_api.port;
app.use(bodyParser.json());
app.use(cors({
	origin: '*'
}));


const redisClient = redis.createClient();
redisClient.on('error', (err) => {
	console.log('Redis Error: ' + err);
});
redisClient.AUTH(apiConfig.redis.password);

mongoose.connect(apiConfig.mongodb.connectionString, { useNewUrlParser: true }, (err) => {
	if (err) {
		console.log('Mongodb Connection Error', err);
	} else {
		console.log('Connected To MongoDB');
	}

	/**
	* BEGIN Server
	*/
	app.listen(port, () => {
		console.log(`Server Running On Port ${port}`);
	});
	/**
	 * END Server
	 */
});

/**
 * BEGIN Initilazation
 */

/**
* BEGIN Controllers
*/
/**
 * END Controllers
 */

