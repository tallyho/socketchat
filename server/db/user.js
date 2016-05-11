import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = mongoose.Schema({
  handle: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true
  },
  passwordSalt: {
    type: String,
    require: true
  },

  channels: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  }
})

UserSchema.statics.validateHandle = (handle) => {
  return handle && handle.length >= 4
};

UserSchema.statics.validatePassword = (password) => {
  return password && password.length >= 8
}

UserSchema.statics.makePasswordSalt = () => {
  return bcrypt.genSaltSync();
}
UserSchema.statics.makePasswordHash = (password, salt) => {
  return bcrypt.hashSync(password, salt);
}

export const User = mongoose.model('User', UserSchema)
