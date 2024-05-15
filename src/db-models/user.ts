import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  hash: {
    type: String,
    trim: false
  },
  bio: {
    type: String,
    trim: true
  },
  followers: {
    type: [mongoose.Schema.ObjectId],
  },
  followed: {
    type: [mongoose.Schema.ObjectId]
  },
  date: {
    type: Date
  },
  posts: {
    type: [{}]
  },
  isVerified: {
    type: Boolean
  },
  avatar: {
    type: {
      secureUrl: String,
      publicId: String || undefined
    }
  }
},
{
  versionKey: false,
  timestamps: true,
})

export default mongoose.model('User', userModel);