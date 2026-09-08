import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import VerificationToken from "../models/VerificationToken.model.js";
import { resetPasswordEmail, verifyOtpMail } from "../utils/mailTemplates.js";
import { sendMail } from "../config/Mail.config.js";

export const registerService = async ({ display_name, email, password }) => {
  const isEmailExists = await User.findOne({ email });

  if (isEmailExists) {
    throw { status: 409, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    display_name,
    email,
    password: hashedPassword,
    is_verified: false,
  });

  // Generate 6-digit OTP code (10 minutes expiry) and store in VerificationToken
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await VerificationToken.findOneAndUpdate(
    { userId: user._id, type: "otp" },
    {
      userId: user._id,
      type: "otp",
      token: otp,
      expiresAt,
    },
    { upsert: true, new: true },
  );

  // Send verification email
  try {
    await sendMail({
      to: user.email,
      subject: "Verify your email - Noveland",
      html: verifyOtpMail(otp, user.email),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  user.password = undefined;

  return user;
};

export const sendVerifyOtpService = async ({ email }) => {
  if (!email) {
    throw { status: 400, message: "Email is required" };
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  if (user.is_verified) {
    throw { status: 400, message: "Email is already verified" };
  }

  // Generate new OTP and store in VerificationToken
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await VerificationToken.findOneAndUpdate(
    { userId: user._id, type: "otp" },
    {
      userId: user._id,
      type: "otp",
      token: otp,
      expiresAt,
    },
    { upsert: true, new: true },
  );

  try {
    await sendMail({
      to: user.email,
      subject: "Verify your email - Noveland",
      html: verifyOtpMail(otp, user.email),
    });
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw { status: 500, message: "Failed to send verification email" };
  }
};

export const verifyOtpService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw { status: 400, message: "Email and OTP are required" };
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  if (user.is_verified) {
    user.password = undefined;
    return { user, message: "User is already verified" };
  }

  // Lookup OTP in VerificationToken
  const tokenDoc = await VerificationToken.findOne({
    userId: user._id,
    type: "otp",
  });

  if (!tokenDoc || tokenDoc.token !== otp.toString().trim()) {
    throw {
      status: 400,
      message: "Invalid OTP code. Please check and try again.",
    };
  }

  if (tokenDoc.expiresAt && new Date(tokenDoc.expiresAt) < new Date()) {
    throw {
      status: 400,
      message: "OTP has expired. Please request a new code.",
    };
  }

  // Mark user as verified
  user.is_verified = true;
  await user.save({ validateBeforeSave: false });

  // Delete used OTP token
  await VerificationToken.deleteOne({ _id: tokenDoc._id });

  // Generate session tokens so user is immediately authenticated
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  await RefreshToken.findOneAndUpdate(
    { userId: user._id },
    { token: refreshToken },
    { upsert: true, new: true },
  );

  user.password = undefined;

  return {
    user,
    accessToken,
    refreshToken,
    refreshTokenMaxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const loginService = async ({ email, password, rememberMe }) => {
  if (!email || !password) {
    throw { status: 400, message: "Email or password is required" };
  }

  const user = await User.findOne({ email });
  if (!user) throw { status: 400, message: "Invalid email or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw { status: 400, message: "Invalid email or password" };

  // Create JWTs
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

  // Generate raw reset token and hashed token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Store in VerificationToken
  await VerificationToken.findOneAndUpdate(
    { userId: user._id, type: "password_reset" },
    {
      userId: user._id,
      type: "password_reset",
      token: hashedToken,
      expiresAt,
    },
    { upsert: true, new: true },
  );

  // Send mail with reset URL pointing to frontend reset password page
  const frontendURL =
    clientURL ||
    process.env.APP_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173";
  const resetURL = `${frontendURL}/reset-password/${resetToken}`;

  try {
    await sendMail({
      to: user.email,
      subject: "Reset your password - Noveland",
      html: resetPasswordEmail(user.email, resetURL),
    });
  } catch (error) {
    await VerificationToken.deleteOne({
      userId: user._id,
      type: "password_reset",
    });
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

  // Hash the incoming raw token to match what is stored in VerificationToken
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const tokenDoc = await VerificationToken.findOne({
    token: hashedToken,
    type: "password_reset",
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    throw { status: 400, message: "Token is invalid or has expired" };
  }

  const user = await User.findById(tokenDoc.userId);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Hash new password and update user
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  // Delete used reset token
  await VerificationToken.deleteOne({ _id: tokenDoc._id });

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
