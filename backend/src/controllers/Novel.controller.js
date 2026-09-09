import Novel from "../models/Novel.model.js";
import ForumThread from "../models/ForumThread.model.js";
import { searchBooksService } from "../services/BookApi.service.js";
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

export const searchExternalBooks = async (req, res) => {
  try {
    const { q, source } = req.query;
    if (!q) {
      return successResponse(res, 200, "Empty search", []);
    }

    const results = await searchBooksService(q, source);
    return successResponse(res, 200, "External books retrieved", results);
  } catch (error) {
    console.error("searchExternalBooks error:", error);
    return errorResponse(res, 500, error.message || "Failed to search external books");
  }
};

export const importExternalBook = async (req, res) => {
  try {
    const { title, author, cover, description, category, rating, chapters } = req.body;

    if (!title || !author) {
      return errorResponse(res, 400, "Title and author are required");
    }

    // Check if novel already exists
    let existing = await Novel.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
    });

    if (existing) {
      return successResponse(res, 200, "Novel already exists in catalog", existing);
    }

    const novel = new Novel({
      title: title.trim(),
      author: author.trim(),
      cover: cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
      description: description || "No description provided.",
      category: category || "Fantasy",
      tags: ["Imported", "Online Catalog"],
      rating: rating || 4.8,
      chapters: chapters || 300,
      views: "15K",
      status: "Ongoing",
    });

    await novel.save();
    return successResponse(res, 201, "Novel imported into catalog successfully", novel);
  } catch (error) {
    console.error("importExternalBook error:", error);
    return errorResponse(res, 500, error.message || "Failed to import novel");
  }
};
