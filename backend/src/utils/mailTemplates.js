//import { transporter } from "../config/Mail.config.js";

// export const sendVerifyEmail = async (to, display_name, otp) => {
//   const info = await transporter.sendMail({
//     from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
//     to,
//     subject: `Welcome to ${process.env.APP_NAME}`,
//     html: verifyEmail(display_name, otp),
//   });

//   await sendMail()

//   console.log("Welcome email sent:", info.messageId);
// };

export const verifyOtpMail = (otp, email) => {
  return `<body
    style="
      background-color: #eef2ff;
      padding: 40px;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        width: 500px;
        margin: auto;
        border-radius: 10px;
        overflow: hidden;
        background-color: #ffffff;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      "
    >
      <!-- HEADER -->
      <div
        style="
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          text-align: center;
          padding: 16px;
        "
      >
        <h1 style="color: white; margin: 0">Noveland</h1>
      </div>

      <p
        style="
          color: #2563eb;
          margin: 15px 0px;
          font-size: 1.8rem;
          text-align: center;
          font-weight: 700;
        "
      >
        Verify your email
      </p>

      <!-- CONTENT -->
      <div style="padding-left: 30px; color: hsl(217, 33%, 17%)">
        <p style="font-size: 1.2rem; margin: 0; margin-top: 10px">
          Hello ${email},
        </p>
        <p
          style="font-size: 1.1rem; margin: 0; margin: 15px 0px; color: #334155"
        >
          Please confirm your email using the OTP below:
        </p>
      </div>

      <!-- OTP PLACEHOLDER -->
      <div
        style="
          margin: auto;
          border-radius: 10px;
          width: 88%;
          padding: 8px 0;
          background-color: #e8eaf1;
          text-align: center;
        "
      >
        <h1 style="margin: 8px 0px; color: #2563eb; letter-spacing: 8px; font-size: 2.2rem;">
          ${otp}
        </h1>
      </div>

      <!-- FOOTER -->
      <div
        style="
          margin-top: 30px;
          border-top: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #64748b;
          padding: 16px;
          font-size: 0.85rem;
          text-align: center;
        "
      >
        <p style="margin: 4px 0">
          This OTP is valid for <strong>5 minutes</strong>.
        </p>
        <p style="margin: 4px 0">
          If you did not request this, please ignore this message.
        </p>
        <p style="margin: 10px 0 4px">
          © 2026 <strong>Noveland</strong>. All rights reserved.
        </p>
      </div>
    </div>
  </body>`;
};

export const resetPasswordEmail = (email, resetURL) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password - Noveland</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 40px 16px;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    "
  >
    <div
      style="
        max-width: 520px;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        background-color: #ffffff;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
        border: 1px solid #e2e8f0;
      "
    >
      <!-- HEADER -->
      <div
        style="
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          text-align: center;
          padding: 24px 20px;
        "
      >
        <h1
          style="
            color: #ffffff;
            margin: 0;
            font-size: 1.8rem;
            font-weight: 700;
            letter-spacing: 0.5px;
          "
        >
          Noveland
        </h1>
      </div>

      <!-- BODY CONTENT -->
      <div style="padding: 32px 32px 24px;">
        <h2
          style="
            color: #1e293b;
            margin: 0 0 16px;
            font-size: 1.4rem;
            font-weight: 700;
            text-align: center;
          "
        >
          Reset Your Password
        </h2>

        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 12px; color: #475569;">
          Hello <strong style="color: #1e293b;">${email}</strong>,
        </p>

        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 24px; color: #475569;">
          We received a request to reset your Noveland account password. Click the button below to choose a new password:
        </p>

        <!-- BUTTON CTA -->
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${resetURL}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              background-color: #2563eb;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 32px;
              font-size: 1rem;
              font-weight: 600;
              border-radius: 8px;
              display: inline-block;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
            "
          >
            Reset Password
          </a>
        </div>

        <!-- FALLBACK LINK -->
        <div
          style="
            margin-top: 24px;
            padding: 16px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            font-size: 0.875rem;
            line-height: 1.5;
            color: #64748b;
          "
        >
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #334155;">
            Having trouble with the button?
          </p>
          <p style="margin: 0 0 8px; color: #64748b;">
            If the button above doesn't work, copy and paste the following link into your browser:
          </p>
          <a
            href="${resetURL}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              color: #2563eb;
              text-decoration: underline;
              word-break: break-all;
              display: inline-block;
            "
          >
            ${resetURL}
          </a>
        </div>
      </div>

      <!-- FOOTER -->
      <div
        style="
          border-top: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #64748b;
          padding: 20px 24px;
          font-size: 0.825rem;
          line-height: 1.5;
          text-align: center;
        "
      >
        <p style="margin: 0 0 6px;">
          This link will expire in <strong>15 minutes</strong>.
        </p>
        <p style="margin: 0 0 10px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 0.75rem;">
          &copy; 2026 Noveland. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>`;
};
