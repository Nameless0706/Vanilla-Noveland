import jwt from "jsonwebtoken";
import "dotenv/config";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  registerService,
  sendVerifyOtpService,
  verifyOtpService,
  loginService,
  logoutService,
  refreshAccessTokenService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/Auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);

    return successResponse(
      res,
      201,
      "Registered successfully. Please check your email for the verification code.",
      user,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Server error",
    );
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    await sendVerifyOtpService(req.body);
    return successResponse(res, 200, "Verification code sent to your email");
  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Server error",
    );
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { user, accessToken, refreshToken, refreshTokenMaxAge } =
      await verifyOtpService(req.body);

    if (accessToken) {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });
    }

    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenMaxAge || 7 * 24 * 60 * 60 * 1000,
      });
    }

    return successResponse(res, 200, "Account verified successfully", {
      userData: user,
      accessToken,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Server error",
    );
  }
};

export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken, refreshTokenMaxAge } =
      await loginService(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenMaxAge,
    });

    return successResponse(res, 200, "Login Successful", {
      userData: user,
      accessToken,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Server error",
    );
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);

      if (decoded?.userId) {
        await logoutService(decoded.userId);
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, 200, "Logged out successfully");
  } catch (error) {
    return errorResponse(res, 500, "Server error");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const clientURL =
      req.headers.origin || process.env.APP_URL || process.env.CLIENT_URL;
    await forgotPasswordService(email, clientURL);

    return successResponse(
      res,
      200,
      "Password reset link has been sent to your email",
    );
  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Server error",
    );
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await resetPasswordService(token, password);

    return successResponse(res, 200, "Password has been reset successfully");
  } catch (error) {
    return errorResponse(
      res,
      error.status || 500,
      error.message || "Server error",
    );
  }
};

export const getNewAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    const accessToken = await refreshAccessTokenService(token);

    return successResponse(res, 200, "Token refreshed", {
      accessToken,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.status || 403,
      error.message || "Invalid or expired refresh token",
    );
  }
};
