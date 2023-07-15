// var nodemailer = require('nodemailer');
// var sgTransport = require('nodemailer-sendgrid-transport');


// export const sendGrid = (options) => {

//   // api key https://sendgrid.com/docs/Classroom/Send/api_keys.html
//   // var options = {
//   //     auth: {
//   //         api_key: process.env.apikey.EMAIL_SERVER_PASSWORD
//   //     }
//   // }

//   // or

//   // username + password
//   var options = {
//     auth: {
//       api_user: process.env.apikey,
//       api_key: process.env.EMAIL_SERVER_PASSWORD
//     }
//   }

//   var mailer = nodemailer.createTransport(sgTransport(options));


//   var email = {
//     from: process.env.EMAIL_FROM,
//     to: options.to,
//     subject: options.subject,
//     html: options.text,
//   };

//   mailer.sendMail(email, function (err, res) {
//     if (err) {
//       console.log(err)
//     }
//     console.log(res);
//   });


// }



// import mail from '@sendgrid/mail'


// mail.setApiKey(process.env.EMAIL_SERVER_PASSWORD);



// export const sendGrid = (options) => { 
//   console.log({options})

//   const { req, res } = options; 

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: options.to,
//     subject: options.subject,
//     html: options.text,
//   }

//   mail.send(mailOptions)
//   .then(() => {
//     // res.status(200).json({ status: 'Ok' })
//     console.log('ok')
//   })
//   .catch(err => {
//     console.log(err)
//     // res.status(400).json({ error: err })
//   })

// }



import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.EMAIL_SERVER_PASSWORD);


// export async function sendGrid(req, res) {
export async function sendGrid(mailOptions) {
  const { req, res } = mailOptions; 

  try {
    // console.log("REQ.BODY", req.body);
    await sendgrid.send({
      to: mailOptions.to,
      from: process.env.EMAIL_FROM,
      subject: mailOptions.subject,
      html: mailOptions.text,
    });
  } catch (error) {
    console.log(error);
    // return res.status(error.statusCode || 500).json({ error: error.message });
  }

  // return res.status(200).json({ error: "" });
}

// export default sendGrid;