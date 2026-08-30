import express from "express";
const router = express.Router();

import verifyJWT from "../middlewares/VerifyJWT.middleware.js";

import {
  login,
  register,
  logout,
  getNewAccessToken,
  forgotPassword,
  resetPassword,
} from "../controllers/Auth.controller.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/refresh-token", getNewAccessToken);

export default router;
