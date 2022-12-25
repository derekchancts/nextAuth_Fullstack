import User from "../../../model/userModel"
import bcrypt from "bcryptjs"


export default async function handler(req, res) {
  try {
    if (req.method === "POST") { 
      // console.log('POST')
      // console.log(req.body)

      let user = await User.findOne({ email: req.body.email }).lean()
      user._id = user?._id.toString();

      const { _id, name, email, validEmail } = user

      const existingUser = { _id, name, email, validEmail }

      return res.status(200).send(existingUser)
    }
  } catch (error) {
    console.log(error)
  }
}
  