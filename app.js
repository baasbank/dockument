import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import winston from 'winston';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import http from 'http';
import routes from './server/routes/Index';

// Set up the express app
const app = express();

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Dockument API',
    version: '1.0.0',
    description: 'To create a document management system, complete with roles and privileges. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published. Users are categorized by roles. Each user must have a role defined for them.',
    contact: {
      email: 'baasbank.akinmuleya@andela.com',
    },
    license: {
      name: 'MIT',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    }
  },
  host: 'localhost:8000',
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: [path.join(__dirname, 'server/routes/*.js')],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

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
app.use(express.static(path.join(__dirname, 'public/dockument-api')));

// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Send a default catch-all route
app.get('*', (req, res) => res.status(200).send({
  message: 'Error. Please check and try again.',
}));

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

app.listen(port, () => {
  winston.info(`The server is running on localhost:${port}`);
});

export default app;
