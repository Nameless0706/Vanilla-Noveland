import express from "express";
import {
  getNovels,
  getNovelById,
  createNovel,
  searchExternalBooks,
  importExternalBook,
} from "../controllers/Novel.controller.js";
import verifyJWT from "../middlewares/VerifyJWT.middleware.js";

const router = express.Router();

router.get("/search/external", searchExternalBooks);
router.post("/import-external", importExternalBook);

router.get("/", getNovels);
router.get("/:id", getNovelById);
router.post("/", verifyJWT, createNovel);

export default router;
