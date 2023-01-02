import Post from "../../../model/postModel"
import Authenticated from "../../../middleware/isAuth"

import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'
import cloudinary from '../../../lib/cloudinary';


// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // methods: ['POST', 'OPTIONS'],
  })
)



const handler = Authenticated(async (req, res) => { 
  // Run cors
  await cors(req, res)

  
  if (req.method === 'POST') {
    // console.log(req.user)
    if (!req.user) return res.status(404).json({ error: "Please login" })
    
    // const post = req.body.postData;
    req.body.postData.userId = req.user._id.toString()  // req.user._id is an object. so need to turn it to a string

    const post = req.body.postData
    console.log('Post: ' + post)
    

    const { image } = req.body.postData;

    const upload = await cloudinary.uploader.upload(image,
      {
        upload_preset: 'dev_setups8',
        // public_id: `${username}avatar`,
        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
      },
      function (error, result) {
        if (error) {
          console.log(error)
          return res.status(409).json({ error: error.message })
        }
        
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

    // const newPost = new Post(req.body.postData)
    const newPost = await new Post(post)
    
    try {
      await newPost.save()

      // const newPost = await Post.create(req.body.postData)  // 2nd method to create post
      // const newPost = await Post.create(post)  // 2nd method to create post

      // const updatedPosts = await Post.find({})

      return res.status(201).json(newPost)
      // return res.status(201).json(updatedPosts)
    } catch (err) {
      return res.status(409).json({ error: err.message })
    }

  }
})


export default handler;



export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}