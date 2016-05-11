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
