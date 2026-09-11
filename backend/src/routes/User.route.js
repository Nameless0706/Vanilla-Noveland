import express from "express";
import userController from "../controllers/User.controller.js";
import verifyJWT from "../middlewares/VerifyJWT.middleware.js";

const router = express.Router();

// Current authenticated user routes
router.get("/me", verifyJWT, userController.getMyProfile);
router.put("/me", verifyJWT, userController.updateProfile);
router.put("/change-password", verifyJWT, userController.changePassword);
router.get("/threads", verifyJWT, userController.getMyThreads);
router.get("/comments", verifyJWT, userController.getMyComments);

// Public user profile routes
router.get("/user/:id", userController.getPublicProfile);
router.get("/user/:id/threads", userController.getUserThreads);

// Admin/System routes
router.get("/all", verifyJWT, userController.getAllUsers);

export default router;