import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import connectDB from "../../../lib/connectDB"


connectDB();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  
  // database: {
  //   type: "mongodb",
  //   useNewUrlParser: true,
  //   url: process.env.MONGODB_URL,
  // },

  secret: process.env.NEXTAUTH_SECRET,

  // pages: {
  //   signIn: "/src/user/login"
  // },
    // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT
  
  session: {
    jwt: true
  },
  jwt: {
    secret: process.env.JWT_PRIVATE_KEY,
    encryption: true
  },
})


