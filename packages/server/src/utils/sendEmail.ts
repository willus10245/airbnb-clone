import * as nodemailer from "nodemailer";

export const sendEmail = async (recipient: string, url: string) => {
  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: recipient, // list of receivers
    subject: "Confirm Email", // Subject line
    text: "Confirm email", // plain text body
    html: `<html>
            <body>
              <a href="${url}">Confirm email</a>
            </body>
          </html>` // html body
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};
