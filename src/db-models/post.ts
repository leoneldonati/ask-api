import mongoose from "mongoose";

const postModel = new mongoose.Schema({
  content: {
    type: String
  },
  images: {
    type: Array || null
  },
  title: {
    type: String,
    trim: true
  },
  likes: {
    type: Array<String>
  },
  comments: {
    type: Array
  },
  owner: {
    type: Object,
    ref: 'User'
  }
},
{
  timestamps: true,
  versionKey: false
}
)

export default mongoose.model('Post', postModel)