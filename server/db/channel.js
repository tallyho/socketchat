import mongoose from 'mongoose'

const ChannelSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    requred: true,
    default: []
  }
})

export const Channel = mongoose.model('Channel', ChannelSchema)
