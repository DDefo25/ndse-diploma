const { mongoose, Schema, model } = require('mongoose');

const AdvertisementSchema = new Schema ({
    shortText: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
    },
    userId: {
        type: mongoose.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    tags: {
        type: [String],
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
}, {
    statics: {
        async find(params) {
            const {} = params
            return await this.findByIdAndUpdate(id, { isDeleted: true });
        },
        async remove(id) {
            return await this.findByIdAndUpdate(id, { isDeleted: true });
        }
    }
})

module.export = model('Advertisement', AdvertisementSchema);
