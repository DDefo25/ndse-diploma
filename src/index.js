// Express
const express = require('express');

const app = express();

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use(express.json());

const { Server } = require('socket.io');
const { createServer } = require('node:http');
const mongoose = require('mongoose');
const indexRoute = require('./routes/index');
const error404 = require('./middleware/error404');

app.use(indexRoute);
app.use(error404);

// Socket.io
const registerChattingHandlers = require('./handlers/chattingHandler');

const server = createServer(app);
const io = new Server(server);

const onConnection = (socket) => {
  registerChattingHandlers(io, socket);
};

io.on('connection', onConnection);

// Env
const config = require('./config');

const { HTTP_PORT = 8989 } = config;
const { MONGO_URL = 'mongodb://root:pass@mongo:27017/' } = config;

// Mongoose connect
// Start server
(async function () {
  try {
    await mongoose.connect(MONGO_URL, { dbName: 'deliveryService', autoCreate: true });
    server.listen(HTTP_PORT);
    console.log(`Server is listening: http://localhost:${HTTP_PORT}/`);
  } catch (e) {
    console.log(e);
  }
}());
