// const Sib = require('sib-api-v3-sdk')
import * as Sib from 'sib-api-v3-sdk'

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.EMAIL_SERVER_PASSWORD



const tranEmailApi = new Sib.TransactionalEmailsApi()

// const sender = {
//   email: 'derekchancts26@gmail.com',
//   // name: 'derek',
// }
// const receivers = [
//   {
//     email: 'derekchancts26@gmail.com',
//   },
// ]


export const sendInBlue = (options) => {
  tranEmailApi
   .sendTransacEmail({
     sender: { email: process.env.EMAIL_FROM },
     to: [{ email: options.to }],
     subject: options.subject,
    //  textContent: `
    //      Cules Coding will teach you how to become {{params.role}} a developer.
    //      `,
     htmlContent: options.text
   })
   .then(console.log)
   .catch(console.log)
}