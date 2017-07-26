const winston = require('winston');

const routes = require('./server/routes/');

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');

// Set up the express app
const app = express();

const router = express.Router();
require('dotenv').config();

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use router for our routes
routes(router);
app.use('/api/v1', router);

// Send a default catch-all route
app.get('*', (req, res) => res.status(200).send({
  message: 'Error. Please check URL and try again.',
}));

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  winston.info(`The server is running on localhost:${port}`);
});


module.exports = app;
