import Promise from 'bluebird'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

mongoose.Promise = Promise

export function connectDB() {
  mongoose.connect('mongodb://localhost/test')

  mongoose.connection.on('connected', () => {
      console.log("Mongoose connected!")
  }); 
  mongoose.connection.on('error', (error) => {
      console.log("Mongoose errored:", err)
  }); 
}

const UserSchema = mongoose.Schema({
  email: {
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
  }
})

UserSchema.statics.validateEmail = (email) => {
  const re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
  return re.test(email)
};

UserSchema.statics.validatePassword = (password) => {
  return password && password.length >= 8
}

UserSchema.statics.makePasswordSalt = () => {
  return bcrypt.genSaltSync(10);
}
UserSchema.statics.makePasswordHash = (password, salt) => {
  return bcrypt.hashSync(password, salt);
}

export const User = mongoose.model('User', UserSchema)
