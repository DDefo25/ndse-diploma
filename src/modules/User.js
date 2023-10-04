const { Schema, model } = require('mongoose');
const crypto = require('node:crypto');

const UserSchema = new Schema({
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
  },
}, {
  statics: {
    async findByEmail(email) {
      const result = await this.findOne({ email }).select('-__v');
      return result;
    },

    async hashPassword(password, cb) {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, derivedKey) => {
        if (err) { return cb(err); }
        const combined = Buffer.alloc(derivedKey.length + salt.length + 8);
        combined.writeUInt32BE(salt.length, 0);
        combined.writeUInt32BE(310000, 4);
        salt.copy(combined, 8);
        derivedKey.copy(combined, salt.length + 8);
        const result = await cb(null, combined.toString('hex'));
        return result;
      });
    },
  },
  methods: {
    verifyPassword(password, cb) {
      const combined = Buffer.from(this.passwordHash, 'hex');
      const saltBytes = combined.readUInt32BE(0);
      const hashBytes = combined.length - saltBytes - 8;
      const iterations = combined.readUInt32BE(4);
      const salt = combined.subarray(8, saltBytes + 8);
      const hash = combined.toString('hex', saltBytes + 8);

      crypto.pbkdf2(password, salt, iterations, hashBytes, 'sha256', (err, verify) => {
        if (err) {
          return cb(err);
        }

        if (verify.toString('hex') !== hash) {
          return cb(null, false, { message: 'Неверный пароль' });
        }

        return cb(null, this);
      });
    },
  },
});

module.exports = model('User', UserSchema);
