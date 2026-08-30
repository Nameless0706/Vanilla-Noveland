import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import { resetPasswordEmail } from "../utils/mailTemplates.js";
import { sendMail } from "../config/Mail.config.js";

export const registerService = async ({ display_name, email, password }) => {
  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) {
    throw { status: 400, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(hashedPassword);

  const user = await User.create({
    display_name,
    email,
    password: hashedPassword,
  });

  // remove password before returning
  //user.password = undefined;

  return user;
};

export const sendVerifyOtpService = async ({ userId }) => {
  const user = await User.findById(userId);
};

export const loginService = async ({ email, password, rememberMe }) => {
  if (!email || !password) {
    throw { status: 400, message: "Email or password is required" };
  }

  const user = await User.findOne({ email });
  console.log(user);
  if (!user) throw { status: 400, message: "Invalid email or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 400, message: "Invalid email or password" };

  // Create JWTS

  const refreshTokenExpiry = rememberMe
    ? ["30d", 30 * 24 * 60 * 60 * 1000]
    : ["1d", 24 * 60 * 60 * 1000];

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenExpiry[0] },
  );

  // Store refresh token in DB
  await RefreshToken.findOneAndUpdate(
    { userId: user._id },
    { token: refreshToken },
    { upsert: true, new: true },
  );

  // Emit password from user object to return to frontend
  // Option 1: Using destructuring
  // const {password: _, ...returnUser} = user;

  //Option 2: Set password in user object to undefined to omit it
  user.password = undefined;

  return {
    user,
    accessToken,
    refreshToken,
    refreshTokenMaxAge: refreshTokenExpiry[1],
  };
};

export const logoutService = async (userId) => {
  await RefreshToken.deleteOne({ userId });
};

export const forgotPasswordService = async (email, clientURL) => {
  if (!email) {
    throw { status: 400, message: "Email is required" };
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw { status: 404, message: "Could not find user with given email" };
  }

  // Create reset token and save to db
  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // skip fields constraint check

  // Send mail with reset URL pointing to frontend reset password page
  const frontendURL =
    clientURL || process.env.CLIENT_URL || "http://localhost:5173";
  const resetURL = `${frontendURL}/reset-password/${resetToken}`;

  try {
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: resetPasswordEmail(user.email, resetURL),
    });
  } catch (error) {
    user.password_reset_token = undefined;
    user.password_reset_expire = undefined;
    user.save({validateBeforeSave: false});
    throw { status: 500, message: "Failed to send reset email" };
  }
};

export const resetPasswordService = async (token, password) => {
  if (!token) {
    throw { status: 400, message: "Reset token is required" };
  }
  if (!password) {
    throw { status: 400, message: "New password is required" };
  }

  // Hash the incoming raw token to match what is in DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    password_reset_token: hashedToken,
    password_reset_expire: { $gt: Date.now() },
  });

  if (!user) {
    throw { status: 400, message: "Token is invalid or has expired" };
  }

  // Hash new password and update user
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.password_reset_token = undefined;
  user.password_reset_expire = undefined;
  await user.save();

  // Invalidate any active refresh tokens for security
  await RefreshToken.deleteMany({ userId: user._id });

  return true;
};

export const refreshAccessTokenService = async (token) => {
  if (!token) {
    throw { status: 401, message: "Refresh token missing" };
  }

  // Verify signature
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  // Check if token exists in DB
  const storedToken = await RefreshToken.findOne({
    userId: decoded.userId,
    token: token,
  });

  if (!storedToken) {
    throw { status: 403, message: "Refresh token not recognized" };
  }

  // Create new access token
  const accessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  return accessToken;
};
