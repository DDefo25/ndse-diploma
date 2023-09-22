const express = require('express');
const { createServer } = require('node:http');
const mongoose = require('mongoose');
const indexRoute = require('./routes/index');

const config = require('./config')
const { HTTP_PORT = 8989 } = config;
const { HTTP_HOST = 'localhost' } = config;
const { MONGO_URL = 'mongodb://root:example@localhost:27017/' } = config;

const app = express();
const server = createServer(app);

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(indexRoute);

(async function (HTTP_PORT, HTTP_HOST, MONGO_URL) {
  try {
      await mongoose.connect( MONGO_URL );
      server.listen( HTTP_PORT, HTTP_HOST );
      console.log(`Server is listening: http://${HTTP_HOST}:${HTTP_PORT}/`);
  } catch (e) {
      console.log(e)
  }
})(HTTP_PORT, HTTP_HOST, MONGO_URL)
