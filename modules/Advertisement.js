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
        async findByParams(params) {
            const queryFilter = {}
            for (const param in params) {
                switch (param) {
                    case 'userId':
                        queryFilter.userId = params[param];
                        break;
                    case 'shortText':
                        queryFilter.shortText = { $regex: params[param], $options: 'mi'};
                        break;
                    case 'description':
                        queryFilter.description = { $regex: params[param], $options: 'mi'};
                        break;
                    case 'tags':
                        queryFilter.tags = { $all: params[param] };
                        break;
                }
            }
            return await this.find({
                ...queryFilter,
                isDeleted: false
            }).select('-__v')
        },
        async removeById(id) {
            return await this.findByIdAndUpdate(id, { isDeleted: true }).select('-__v');
        },
    }
})

module.exports = model('Advertisement', AdvertisementSchema);


