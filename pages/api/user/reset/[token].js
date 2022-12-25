import User from "../../../../model/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import absoluteUrl from "next-absolute-url"



export default async function handler (req, res) {
  try {
    if (req.method === "PUT") {
      const { token } = req.query
      // console.log(token)

      const { password, conPassword } = req.body
      // console.log(password)
      // console.log(conPassword)

      if (password !== conPassword) return res.status(400).json({ error: "Passwords do not match" })
      
      if (password.length < 6) return res.status(400).json({ error: "Password needs to be at least 6 characters" })
      

      if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
          if (err) {
            console.log(err.message)
            return res.status(400).json({ error: err.message })
          } else {
            const user = await User.findById(decodedToken._id)

            if (user) {
              if (user.resetToken === undefined) return res.status(400).json({ error: "please use a valid token" })

              const salt = await bcrypt.genSalt(12);
              const hashedpassword = await bcrypt.hash(password, salt);
      
              // user.password = await bcrypt.hash(password, 12)
              user.password = hashedpassword;
      
              user.resetToken = undefined
              await user.save()
      
              return res.status(200).json({ success: "success in updating user" })
            }
            
          }
        })
      }


      // const user = await User.findById(req.user._id)
      // console.log(user)

      // if (user) {
      //   const salt = await bcrypt.genSalt(12);
      //   const hashedpassword = await bcrypt.hash(password, salt);

      //   // user.password = await bcrypt.hash(password, 12)
      //   user.password = hashedpassword;

      //   user.resetToken = undefined
      //   await user.save()

      //   return res.status(200).json({ success: "success in updating user" })
      // }
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
