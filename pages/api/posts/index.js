import Post from "../../../model/postModel"

import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'


// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)




export default async function handler (req, res) {
  console.log(req.method)


  if (req.method === "GET") {
    try {
      const posts = await Post.find({})

      return res.status(200).json(posts)
    } catch (err) {
      return res.status(404).json({ error: err.message })
    }
  };


  if (req.method === "POST") {
    const post = req.body.memoryData
    console.log('Post: ' + post)
    // console.log(req.method)
    const newPost = await new Post(post)

    try {
      await newPost.save()

      return res.status(201).json(newPost)
    } catch (err) {
      return res.status(409).json({ error: err.message })
    }
  };

}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}