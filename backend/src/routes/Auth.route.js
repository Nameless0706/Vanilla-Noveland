import express from "express";
const router = express.Router();

import {
  login,
  register,
  logout,
  sendVerifyOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getNewAccessToken,
} from "../controllers/Auth.controller.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp", sendVerifyOtp);
router.post("/verify", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", getNewAccessToken);

export default router;
