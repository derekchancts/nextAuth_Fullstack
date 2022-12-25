import User from '../../../model/userModel'
import bcrypt from 'bcryptjs'
const jwt = require('jsonwebtoken')


export default async function handler(req, res) {
  if (req.method === 'POST') { 
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(422).json({ error: "User does not exist" });

      if (user) {
        if (!password || password === "undefined") return res.status(422).json({ error: "Please enter password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(422).json({ error: "Email or Password not correct" });

        // const token = jwt.sign({ userid: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' } )
        const token = jwt.sign({ userid: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME } )  // "seconds"

        const { email, _id, name, validEmail } = user;
        return res.status(201).json({ success: 'Login success', user: { email, _id, name, validEmail }, token });
      };
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
}