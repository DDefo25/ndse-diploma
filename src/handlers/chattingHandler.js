const Chat = require('../modules/Chat');
const functionHandler = require('./functionHandler');

module.exports = async (io, socket) => {
  const { id } = socket.handshake.query;
  await Chat.subscribe(id, async (data) => {
    const message = await functionHandler.newMessage(data, io, socket);
    return message;
  });

  socket.on('sendMessage', (data) => functionHandler.sendMessage(data, io, socket));
  socket.on('getHistory', (data) => functionHandler.getHistory(data, io, socket));
  socket.on('disconnect', () => functionHandler.disconnect(socket));
  socket.onAny((ev) => {
    if (socket.listeners(ev).length === 0) {
      io.emit('error', new Error(`missing handler for event ${ev}`));
    }
  });
};
