import Post from "../../../model/postModel"

import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'
import cloudinary from '../../../lib/cloudinary';


// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)



export default async function handler (req, res) {
  // console.log(req.method)


  //! get all posts
  if (req.method === "GET") {
    try {
      const posts = await Post.find({})
      // console.log(posts)

      return res.status(200).json(posts)
    } catch (err) {
      return res.status(404).json({ error: err.message })
    }
  };


  
  //! create a new post
  if (req.method === "POST") {
    const post = req.body.postData
    console.log('Post: ' + post)
    // console.log(req.method)

    const { image } = req.body.postData;

    const upload = await cloudinary.uploader.upload(image,
      {
        upload_preset: 'dev_setups8',
        // public_id: `${username}avatar`,
        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
      },
      function (error, result) {
        if (error) console.log(error)
        
        // console.log(result)
        post.image = result.public_id;
        post.imageUrl = result.secure_url;

        // post.image = {
        //   public_id: result.public_id,
        //   url: result.secure_url
        // }

        // try {
        //   res.status(200).json(result)  
        // } catch (err) {
        //   console.log(err)
        // }
      });

    const newPost = await new Post(post)

    try {
      await newPost.save();
      return res.status(201).json(newPost)
    } catch (err) {
      return res.status(409).json({ error: err.message })
    }
  };

}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}