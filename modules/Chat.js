const { mongoose, Schema, model } = require('mongoose');
const {Message, MessageSchema} = require('./Message')

const ChatSchema = new Schema ({
    users: {
        type: [mongoose.ObjectId, mongoose.ObjectId],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    messages: {
        type: [MessageSchema],
    },
}, {
    statics: {
        async findByIds(array) {
            return await this.findOne({ users: { $all: array } }).select('-__v')
        },

        async sendMessage(data) {
            const {author, receiver, text} = data;

            if (!author || !mongoose.isValidObjectId(author)) {
                throw new Error ('data params is not valid')
            } else if (!receiver || !mongoose.isValidObjectId(receiver)) {
                throw new Error ('data params is not valid')
            } else if (!text || typeof text !== 'string') {
                throw new Error ('data params is not valid')
            }
            
            const chatFind = await this.findByIds([author, receiver]);
            const chat = 
                chatFind ? 
                chatFind : 
                await this.create({
                    users: [author, receiver],
                    createdAt: Date.now(),
                    messages: [],
                });
            
            const message = await Message.create({ author, sentAt: Date.now(), text })
            chat.messages.push(message)
            chat.save()
            return message;
        },

        async getHistory(id) {
            return this.findById(id).select('messages');
        },

        async subscribe(cb) {
        }
    }
})

module.exports = model('Chat', ChatSchema);
