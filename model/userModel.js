import mongoose from "mongoose"
import validator from "validator"
const { isEmail } = require('validator')


const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,  
    // validate: [validator.isEmail, "Please enter valid email address"],
    validate: [isEmail, 'Please enter a valid email'] 
  },
  password: {
    type: String,
    required: [true, 'Must enter a password'],
    trim: true,
    minlength: [6, 'Password must have at least 6 characters'],
  },
  // password: {
  //   type: String,
  //   required: true,
  //   // trim: true, 
  //   minlength: [6, 'Password must have at least 6 characters'],
  //   validate: {
  //     validator: function(val) {
  //       return val.length >= 6 
  //     },
  //     message: () => "Minimum password length is 6 characters"
  //   }
  // }
  resetToken: { type: String },
  update: { type: String },
  validEmail: { type: String, default: "not" },
  emailToken: { type: String },
})

// export default mongoose.models.User || mongoose.model("User", userSchema)

//! under Nextjs - We need to check whether the model is already loaded first, because mongoose might / keeps on restarting the server
let Dataset = mongoose.models.users || mongoose.model('users', userSchema);

export default Dataset;
