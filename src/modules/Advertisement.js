const { mongoose, Schema, model } = require('mongoose');

const AdvertisementSchema = new Schema({
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
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tags: {
    type: [String],
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  statics: {
    async findByParams(params = {}) {
      const queryFilter = {};
      Object.entries(params).forEach((param) => {
        const [key, value] = param;

        switch (key) {
          case 'userId':
            queryFilter.userId = value;
            break;
          case 'shortText':
            queryFilter.shortText = { $regex: value, $options: 'mi' };
            break;
          case 'description':
            queryFilter.description = { $regex: value, $options: 'mi' };
            break;
          case 'tags':
            queryFilter.tags = { $all: value };
            break;
          default:
            queryFilter[key] = value;
        }
      });

      const result = await this.find({ ...queryFilter, isDeleted: false }).select('-__v');

      return result;
    },

    async removeById(id) {
      if (!id || !mongoose.isValidObjectId(id)) {
        throw new Error('data params is not valid');
      }

      const result = await this.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');

      return result;
    },
  },
});

module.exports = model('Advertisement', AdvertisementSchema);
