const { mongoose, Schema, model } = require('mongoose');
const EventEmitter = require('node:events');
const { Message, MessageSchema } = require('./Message');

const ChatSchema = new Schema({
  users: {
    type: [mongoose.ObjectId, mongoose.ObjectId],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
}, {
  statics: {
    async findByIds(array) {
      if (!array || !array.every((id) => mongoose.isValidObjectId(id))) {
        throw new Error('data params is not valid');
      }
      const result = await this.findOne({ users: { $all: array } });
      return result;
    },

    async sendMessage(data) {
      const { author, receiver, text } = data;

      if (!author || !mongoose.isValidObjectId(author)) {
        throw new Error('data params is not valid');
      } else if (!receiver || !mongoose.isValidObjectId(receiver)) {
        throw new Error('data params is not valid');
      } else if (!text || typeof text !== 'string') {
        throw new Error('data params is not valid');
      }

      const message = await Message.create({ author, text });
      const chatIsFound = await this.findByIds([author, receiver]);
      const chat = chatIsFound || await this.create({ users: [author, receiver] });
      await chat.updateOne({ $push: { messages: message } });
      chat.save();

      // Проходит по всем EventEmmiter в handler'e. Генерит event 'change'
      Object.entries(this.changeStreams).forEach((userChangeStream) => {
        const [id, eventEmmiter] = userChangeStream;
        if (id === author || id === receiver) {
          eventEmmiter.emit('change', {
            chatId: chat.id,
            message,
          });
        }
      });
    },

    async getHistory(id) {
      if (!id || !mongoose.isValidObjectId(id)) {
        throw new Error('data params is not valid');
      }

      return this.findById(id).select('messages');
    },

    async subscribe(id, cb) {
      // handle для EventEmmiter'ов пользователей
      if (this.changeStreams === undefined) {
        this.changeStreams = {};
      }

      // создает EventEmmiter пользователя. Ожидает emit в sendMessage
      this.changeStreams[id] = new EventEmitter();
      this.changeStreams[id].on('change', cb);
    },
  },
});

module.exports = model('Chat', ChatSchema);
