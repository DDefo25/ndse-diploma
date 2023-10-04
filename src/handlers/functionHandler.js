const Chat = require('../modules/Chat');

module.exports = {
  sendMessage: async (data, io, socket) => {
    const { id: author } = socket.handshake.query;
    const { receiver, text } = data;

    try {
      await Chat.sendMessage({ author, receiver, text });
    } catch (e) {
      io.emit('error', e);
    }
  },

  getHistory: async (data, io, socket) => {
    const { id: author } = socket.handshake.query;
    const { receiver } = data;

    try {
      const chatHistory = await Chat.findByIds([author, receiver]);
      io.to(socket.id).emit('chatHistory', chatHistory);
    } catch (e) {
      io.emit('error', e);
    }
  },

  newMessage: async (data, io, socket) => {
    try {
      io.to(socket.id).emit('newMessage', data);
    } catch (e) {
      io.emit('error', e);
    }
  },

  disconnect: (socket) => {
    const { id } = socket.handshake.query;
    console.log(`user disconnected ${id}`);
  },
};
