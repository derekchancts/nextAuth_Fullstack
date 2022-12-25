import mongoose from "mongoose"


const postSchema = mongoose.Schema({
  title: {
    type: String,
  },
  userId: {
    type: String
  },
  message: {
    type: String,
  },
  creater: {
    type: String,
  },
  tags: {
    type: [String],
    trim: true
  },
  image: { 
    type: String 
  },
  likeCount: { 
    type: Number, 
    default: 0 
  },
  likes: { 
    type: [String], 
    default: [] 
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})


export default mongoose.models.Post || mongoose.model("Post", postSchema)
