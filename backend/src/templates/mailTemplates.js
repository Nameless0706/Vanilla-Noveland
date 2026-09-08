export const verifyEmail = (display_name, otp) =>  `<!DOCTYPE html>
<html lang="en">
  <body
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
          Hello ${display_name},
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
          This OTP is valid for <strong>10 minutes</strong>.
        </p>
        <p style="margin: 4px 0">
          If you did not request this, please ignore this message.
        </p>
        <p style="margin: 10px 0 4px">
          © 2026 <strong>Noveland</strong>. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`;
