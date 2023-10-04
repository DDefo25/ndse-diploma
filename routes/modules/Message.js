const { mongoose, Schema, model } = require('mongoose');

const MessageSchema = new Schema({
  author: {
    type: mongoose.ObjectId,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
  },
});

module.exports = {
  Message: model('Message', MessageSchema),
  MessageSchema,
};
