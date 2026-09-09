import express from "express";
import {
  getThreads,
  getThreadById,
  createThread,
  toggleUpvoteThread,
  getComments,
  createComment,
  toggleLikeComment,
} from "../controllers/Forum.controller.js";
import { verifyJWT, optionalAuth } from "../middlewares/VerifyJWT.middleware.js";

const router = express.Router();

// Threads
router.get("/threads", optionalAuth, getThreads);
router.get("/threads/:id", optionalAuth, getThreadById);
router.post("/threads", verifyJWT, createThread);
router.post("/threads/:id/upvote", verifyJWT, toggleUpvoteThread);

// Comments
router.get("/threads/:threadId/comments", optionalAuth, getComments);
router.post("/threads/:threadId/comments", verifyJWT, createComment);
router.post("/comments/:commentId/like", verifyJWT, toggleLikeComment);

export default router;
