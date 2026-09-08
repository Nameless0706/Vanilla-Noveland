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
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email - Noveland</title>
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
          Verify Your Email
        </h2>

        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 12px; color: #475569;">
          Hello <strong style="color: #1e293b;">${email}</strong>,
        </p>

        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 24px; color: #475569;">
          Thank you for joining Noveland! Please confirm your email address using the verification code below:
        </p>

        <!-- OTP CODE BOX -->
        <div
          style="
            margin: 28px auto;
            max-width: 320px;
            padding: 16px 24px;
            background-color: #eff6ff;
            border: 2px dashed #93c5fd;
            border-radius: 10px;
            text-align: center;
          "
        >
          <div
            style="
              color: #2563eb;
              letter-spacing: 8px;
              font-size: 2.2rem;
              font-weight: 700;
              font-family: 'Courier New', Courier, monospace;
              padding-left: 8px;
            "
          >
            ${otp}
          </div>
        </div>

        <p style="font-size: 0.875rem; line-height: 1.5; margin: 0; color: #64748b; text-align: center;">
          Enter this 6-digit code on the verification page to activate your account.
        </p>
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
          This code will expire in <strong>10 minutes</strong>.
        </p>
        <p style="margin: 0 0 10px;">
          If you did not request this verification code, please safely ignore this email.
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 0.75rem;">
          &copy; 2026 Noveland. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>`;
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
