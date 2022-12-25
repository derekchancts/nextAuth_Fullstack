import User from "../../../../model/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import absoluteUrl from "next-absolute-url"


export default async function handle (req, res) {
  try {
    if (req.method === "PUT") {
      const { token } = req.query      
      // console.log(token)
      // console.log("token3", token)

      if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
          if (err) {
            console.log(err.message)
            return res.status(400).json({ error: err.message })
          } else {
            const user = await User.findById(decodedToken._id)

            if (user) {
              user.validEmail = "yes"
              user.emailToken = undefined
              await user.save()

              const { name, email, _id, validEmail } = user;

              const updatedUser = { name, email, _id, validEmail };

              return res.status(200).json({ success: "success in validating user's email", user: updatedUser })
            }
          }
        })
      }

      // if (token) {
      //   const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      //   console.log("decoded", decoded)
      //   req.user = decoded
      // }

      // if (!token) {
      //   return res.status(400).json({ error: "no Token" })
      // }


      // const user = await User.findById(req.user._id)

      // if (user) {
      //   user.validEmail = "yes"
      //   user.emailToken = undefined
      //   await user.save()

      //   return res.status(200).json({ success: "success in updating user" })
      // }

    }
  } catch (error) {
    console.log(error)
  }
}
