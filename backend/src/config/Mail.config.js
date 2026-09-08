import nodemailer from "nodemailer";

// With gmail.
// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

export const sendMail = async (option) => {
  // With mailtrap
  // const transporter = nodemailer.createTransport({
  //   host: process.env.MAILTRAP_HOST,
  //   port: process.env.MAILTRAP_PORT,
  //   auth: {
  //     user: process.env.MAILTRAP_USER,
  //     pass: process.env.MAILTRAP_PASSWORD,
  //   },
  // });

  // With gmail.
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  //console.log(transporter.options);

  const emailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.APP_GMAIL}>`,
    to: "Test User <user@test.com>",
    subject: option.subject,
    html: option.html,
  };
  await transporter.sendMail(emailOptions);
};
