import Post from "../../../model/postModel"
import Authenticated from '../../../middleware/isAuth'

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


// export default async function handler (req, res) {
// const handler = async (req, res) => {
const handler = Authenticated(async (req, res) => {

  //! Run cors
  await cors(req, res)

  // console.log(req.method)

  
  //! update a post
  if (req.method === "PUT") {
    // console.log(req.user)
    //! if (!req.user) return res.status(404).json({ error: "unauthenticated" })

    // console.log(req.method)
    // console.log(req.query)
    // console.log(req.body)
    const { id } = req.query;
    // console.log(id)

    if (req.body) {
      //! req.body.postData.userId = req.user._id.toString()   // req.user._id is an object. so need to turn it to a string
      // const { tags, image, message, creater, title, userId } = req.body.postData;
      //! const { tags, message, creater, title, userId } = req.body;
      const { tags, message, creater, title } = req.body;
    
      // FIND POST
      const post = await Post.find({ _id: id })
      if (!post) return res.status(404).send({ error: 'no post found' })
      
      // if (post) console.log(post)
      //! if (post[0].userId !== req.user._id.toString()) return res.status(404).json({ error: `invalid user`})

      try {
        // UPDATE POST
        const updatedPost = await Post.findByIdAndUpdate(
          { _id: id },
          { 
            title,
            message,
            tags,
            creater,
            // image,  // if this is left out, then the image will not be replaced if no picture is provided when updating
          },
          { new: true }
        )
        // await updatedPost.save()  
        // console.log(updatedPost)

        return res.status(200).json({ success: 'post updated successfully', updatedPost })
      } catch (err) {
        console.log(err)
        return res.status(409).json({ error: err.message })
      }

    }
  };
  


  //! like a post
  if (req.method === "PATCH") {
    console.log(req.method)
  
    // console.log(req.user);   // get this from "Authenticated" method from "isAuth"
    if (!req.user) return res.status(404).json({ error: 'unauthenticated' })

    const { id } = req.query;
    // FIND POST
    const post = await Post.find({ _id: id })
    // console.log(post)
    // console.log(post[0].likeCount)
    if (!post) return res.status(404).send({ error: 'no post found' })

    // console.log(req.user._id)
    console.log(req.user._id.toString())
    console.log("post", post[0]?.likes)

    // check and see if user has already liked this post
    const index = post[0]?.likes.findIndex(id => id === req.user._id.toString());
    console.log(index)

    // if user already liked the post (will probably not reached this as this is also implemented on frontend)
    if (index !== -1) return res.status(404).send({ error: 'You already liked the post' })
    

    // if not liked, then add the userId into the array (so that it can be checked the next time)
    if (index === -1) {
      post[0].likes.push(req.user._id.toString())
    } 
    console.log("post1", post[0]?.likes)

    try {
      // UPDATE POST
      const updatedPost = await Post.findByIdAndUpdate(
        { _id: id },
        { 
          likeCount: post[0].likeCount + 1,
          likes: post[0]?.likes
        },
        { new: true }
      )
      // console.log(updatedPost)

      return res.status(200).json({ success: 'post updated successfully', updatedPost })
    } catch (err) {
      console.log(err)
      return res.status(409).json({ error: err.message })
    }
  } 



  //! delete a post
  if (req.method === "DELETE") {
    console.log(req.method)
    // console.log(req.user._id.toString())
  
    //! if (!req.user) return res.status(404).json({ error: 'unauthenticated' })
    
    const { id } = req.query
    const post = await Post.find({ _id: id })
    if (!post) return res.status(404).json({ error: 'no post found' })
    // console.log(post1[0]?.userId)

    //! if (post[0].userId !== req.user._id.toString()) return res.status(404).json({ error: `invalid user`})
    
    try {
      const deletedPost = await Post.findByIdAndDelete({ _id: id })
      // console.log(deletedPost)
      return res.status(200).json({ success: "post deleted", deletedPost })
    } catch (err) {
      return res.status(409).json({ error: err.message })
    }
  };

// }
})


export default handler


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}