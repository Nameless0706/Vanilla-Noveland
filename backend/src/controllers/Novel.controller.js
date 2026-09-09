import Novel from "../models/Novel.model.js";
import ForumThread from "../models/ForumThread.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getNovels = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "chapters") {
      sortOption = { chapters: -1 };
    } else if (sort === "popular") {
      sortOption = { rating: -1, createdAt: -1 };
    }

    const novels = await Novel.find(query).sort(sortOption).lean();

    return successResponse(res, 200, "Novels retrieved successfully", novels);
  } catch (error) {
    console.error("getNovels error:", error);
    return errorResponse(res, 500, error.message || "Failed to retrieve novels");
  }
};

export const getNovelById = async (req, res) => {
  try {
    const { id } = req.params;
    const novel = await Novel.findById(id).lean();
    if (!novel) {
      return errorResponse(res, 404, "Novel not found");
    }

    // Get recent forum threads for this novel
    const threads = await ForumThread.find({ novel: id })
      .populate("author", "display_name avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return successResponse(res, 200, "Novel details retrieved", {
      ...novel,
      discussions: threads,
    });
  } catch (error) {
    console.error("getNovelById error:", error);
    return errorResponse(res, 500, error.message || "Failed to retrieve novel");
  }
};

export const createNovel = async (req, res) => {
  try {
    const novel = new Novel(req.body);
    await novel.save();
    return successResponse(res, 201, "Novel created successfully", novel);
  } catch (error) {
    return errorResponse(res, 400, error.message || "Failed to create novel");
  }
};
