const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
exports.sendEmail = async (emailData) => {
  
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 465,
    auth: {
      user: '297778831758d5', 
      pass:'48eeca32f4828d'
    },
    secureConnection: 'false',
    // tls: {
      // },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
  }
   
  });

  let info = await transporter.sendMail({
    from: '"carWash.pk  <carWash@example.com>', // sender address
    to: "bar@example.com", // list of receivers
    subject: "Password Reset", // Subject line
    text:  `You Forget the Password Dear. Click on the link: /api/v1/users/forgetPassword/${emailData}`, // plain text body
    html: "<b>Hello world?</b>", // html body
  });


}

