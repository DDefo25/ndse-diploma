const { Schema, model } = require('mongoose');

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
    }
}, {
    statics: {
        async findByEmail(email) {
            return await this.findOne({ email }).select('-__v');
        }
    }
})

module.exports = model('User', UserSchema);
