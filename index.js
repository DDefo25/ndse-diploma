const express = require('express');
const { createServer } = require('node:http');
const app = express();
const server = createServer(app);

const mongoose = require('mongoose');

const config = require('./config')
const { HTTP_PORT = 8989 } = config;
const { HTTP_HOST = 'localhost' } = config;
const { MONGO_URL = 'mongodb://root:example@localhost:27017/' } = config;

app.set('views', 'src/views');
app.set('view engine', 'ejs');

app.use(express.json());

const Advertisement = require('./modules/User');

app.get('/', async (req, res) => {
  const adv = {
    shortText: 'ispumamm@gmail.com',
    description: '111111',
    images: ['Max', 'Pume'],
    userId: new mongoose.Types.ObjectId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ['Max', 'Pume'],
    isDeleted: false
  }
  const user = await Advertisement.create(adv);
  const userF = await UserModule.findByEmail('ispumamm@gmail.com')
  const userN = await UserModule.findByEmail('ispuma@gmail.com');
  res.json({user, userF, userN})
});

(async function (HTTP_PORT, HTTP_HOST, MONGO_URL) {
  try {
      await mongoose.connect( MONGO_URL );
      server.listen( HTTP_PORT, HTTP_HOST );
      console.log(`Server is listening: http://${HTTP_HOST}:${HTTP_PORT}/`);
  } catch (e) {
      console.log(e)
  }
})(HTTP_PORT, HTTP_HOST, MONGO_URL)
