import jwt from "jsonwebtoken"
import { getSession } from "next-auth/react"
import User from '../model/userModel'
import { ObjectId } from 'mongodb'
import mongoose from "mongoose"


// const Authenticated = (component) => {
//   return (
//     async (req, res) => {
//       const session = await getSession({ req })

//       if (session) {
//         const user = await User.findOne({ email: session?.user?.email })
//         console.log(user)
  
//         req.user = user
//         return component(req, res)
//       }
  
//       if (req.headers && req.headers?.authorization) {
//         var token = req.headers.authorization.split(" ")[1]
  
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         console.log(decoded?.userId)
  
//         const user = await User.findById({ _id: decoded?.userId }).exec()
//         console.log(user)
  
//         req.user = user
        
//        }
//     }
//   )
// }




// const Authenticated = (component) => { 
//   return (
//     async (req, res) => {
//       // console.log("here", req.headers)
//       // console.log(req.headers.authorization)
//       if (req.headers && req.headers.authorization) {
//         let token = req.headers.authorization.split(' ')[1]
//         // console.log(token)

//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//         // console.log(decoded)
//         // console.log(decoded.userid)
        
//         // const user = await User.findById({ _id: decoded?.userid }).exec()
//         const user = await User.findById({ _id: decoded?.userid })
//         console.log(user)
        
//       }

//       return component(req, res)
//     }
//   )
// }



// const Authenticated = (component) => (
//   async (req, res) => {
//     const session = await getSession({ req });
//     // console.log({session})

//     if (session) {
//       const user = await User.findOne({ email: session?.user?.email })
//       // console.log(user)

//       req.user = user
//       return component(req, res)
//     }


//     // console.log("here", req.headers)
//     // console.log(req.headers.authorization)
//     if (req.headers && req.headers.authorization) {
//       let token = req.headers.authorization.split(' ')[1]
//       // console.log(token)

//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//       // console.log(decoded)
//       // console.log(decoded.userid)
      
//       // const user = await User.findById({ _id: decoded?.userid }).exec()
//       const user = await User.findById({ _id: decoded?.userid })
//       // console.log(user)
      
//       req.user = user;
//       return component(req, res)
//     }
//   }
// )



const Authenticated = (component) => async (req, res) => {
  // const session = await getSession({ req });
  const session = await getSession({ req });
  // console.log({session})

  if (session) {
    const user = await User.findOne({ email: session?.user?.email })
    // console.log(user)

    req.user = user
    return component(req, res)
  }

  
  // console.log('test2')
  // console.log("here", req.headers)
  // console.log(req.headers.authorization)
  if (req.headers && req.headers?.authorization) {
    let token = req.headers.authorization.split(' ')[1]
    console.log(token)

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(decoded)
    console.log(decoded.userid)
    
    // const id = mongoose.Types.ObjectId(decoded.userid)   //! output: new ObjectId("id.....")
    // console.log(id)

    // const user = await User.findById({ _id: decoded?.userid }).exec()
    // const user = await User.findById({ _id: decoded?.userId }).select('-password')  // without the password
    // const user = await User.findById({ _id: ObjectId(decoded.userId) })
    // const user = await User.findById({ _id: id })
    const user = await User.findById({ _id: mongoose.Types.ObjectId(decoded.userid) })
    console.log(user)
    
    req.user = user;
    return component(req, res)
  }
}


export default Authenticated