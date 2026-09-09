import express from "express";
import {
  getNovels,
  getNovelById,
  createNovel,
} from "../controllers/Novel.controller.js";
import verifyJWT from "../middlewares/VerifyJWT.middleware.js";

const router = express.Router();

router.get("/", getNovels);
router.get("/:id", getNovelById);
router.post("/", verifyJWT, createNovel);

export default router;
