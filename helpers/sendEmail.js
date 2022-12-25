import nodemailer from "nodemailer"


export const sendEmail = (options) => {

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVER_SERVICE,   // if using just gmail
    // host: process.env.EMAIL_SERVER_HOST,   // if using sendgrid
    port: process.env.EMAIL_SERVER_PORT,   // if using sendgrid
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })


  // let data = { info: "", error: ""};

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
      // data.error = err
    } else {
      console.log(info)
      // data.info = info
    }
  })


  // return data;
}
