import ForumThread from "../models/ForumThread.model.js";
import ForumComment from "../models/ForumComment.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getThreads = async (req, res) => {
  try {
    const { category, novelId, search, tag, sort } = req.query;
    let query = {};

    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (novelId) {
      query.novel = novelId;
    }

    if (tag) {
      query.tags = { $in: [new RegExp(`^${tag}$`, "i")] };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    let sortOptions = { isPinned: -1, createdAt: -1 };
    if (sort === "top") {
      sortOptions = { isPinned: -1, upvoteCount: -1, createdAt: -1 };
    } else if (sort === "replies") {
      sortOptions = { isPinned: -1, replyCount: -1, createdAt: -1 };
    } else if (sort === "hot") {
      // Sort by upvoteCount + replyCount weighted or upvoteCount
      sortOptions = { isPinned: -1, upvoteCount: -1, replyCount: -1, createdAt: -1 };
    }

    const threads = await ForumThread.find(query)
      .populate("author", "display_name avatar")
      .populate("novel", "title cover category")
      .sort(sortOptions)
      .lean();

    // Check if current user has upvoted if userId is available in token
    const userId = req.userId;
    const formatted = threads.map((t) => ({
      ...t,
      hasUpvoted: userId ? t.upvotes?.some((id) => id.toString() === userId.toString()) : false,
      upvoteCount: t.upvotes ? t.upvotes.length : 0,
    }));

    return successResponse(res, 200, "Threads fetched successfully", formatted);
  } catch (error) {
    console.error("getThreads error:", error);
    return errorResponse(res, 500, error.message || "Failed to fetch threads");
  }
};

export const getThreadById = async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await ForumThread.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "display_name avatar")
      .populate("novel", "title cover category rating author chapters")
      .lean();

    if (!thread) {
      return errorResponse(res, 404, "Thread not found");
    }

    const userId = req.userId;
    const formatted = {
      ...thread,
      hasUpvoted: userId ? thread.upvotes?.some((id) => id.toString() === userId.toString()) : false,
      upvoteCount: thread.upvotes ? thread.upvotes.length : 0,
    };

    return successResponse(res, 200, "Thread fetched successfully", formatted);
  } catch (error) {
    console.error("getThreadById error:", error);
    return errorResponse(res, 500, error.message || "Failed to fetch thread");
  }
};

export const createThread = async (req, res) => {
  try {
    const { title, content, category, novel, tags } = req.body;
    const author = req.userId;

    if (!title || !content) {
      return errorResponse(res, 400, "Title and content are required");
    }

    const newThread = new ForumThread({
      title: title.trim(),
      content: content.trim(),
      author,
      category: category || "General",
      novel: novel || null,
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });

    await newThread.save();

    const populatedThread = await ForumThread.findById(newThread._id)
      .populate("author", "display_name avatar")
      .populate("novel", "title cover category")
      .lean();

    return successResponse(res, 201, "Discussion thread created", populatedThread);
  } catch (error) {
    console.error("createThread error:", error);
    return errorResponse(res, 500, error.message || "Failed to create thread");
  }
};

export const toggleUpvoteThread = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const thread = await ForumThread.findById(id);
    if (!thread) {
      return errorResponse(res, 404, "Thread not found");
    }

    const alreadyUpvoted = thread.upvotes.some((u) => u.toString() === userId.toString());
    if (alreadyUpvoted) {
      thread.upvotes = thread.upvotes.filter((u) => u.toString() !== userId.toString());
    } else {
      thread.upvotes.push(userId);
    }
    thread.upvoteCount = thread.upvotes.length;
    await thread.save();

    return successResponse(res, 200, alreadyUpvoted ? "Upvote removed" : "Upvoted successfully", {
      upvoteCount: thread.upvoteCount,
      hasUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    console.error("toggleUpvoteThread error:", error);
    return errorResponse(res, 500, error.message || "Failed to toggle upvote");
  }
};

export const getComments = async (req, res) => {
  try {
    const { threadId } = req.params;
    const comments = await ForumComment.find({ thread: threadId })
      .populate("author", "display_name avatar")
      .sort({ createdAt: 1 })
      .lean();

    const userId = req.userId;
    const formatted = comments.map((c) => ({
      ...c,
      hasLiked: userId ? c.likes?.some((id) => id.toString() === userId.toString()) : false,
      likeCount: c.likes ? c.likes.length : 0,
    }));

    return successResponse(res, 200, "Comments retrieved", formatted);
  } catch (error) {
    console.error("getComments error:", error);
    return errorResponse(res, 500, error.message || "Failed to fetch comments");
  }
};

export const createComment = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content, parentComment } = req.body;
    const author = req.userId;

    if (!content || !content.trim()) {
      return errorResponse(res, 400, "Comment content cannot be empty");
    }

    const thread = await ForumThread.findById(threadId);
    if (!thread) {
      return errorResponse(res, 404, "Thread not found");
    }

    const newComment = new ForumComment({
      thread: threadId,
      author,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    await newComment.save();

    // Increment reply count on thread
    thread.replyCount = (thread.replyCount || 0) + 1;
    await thread.save();

    const populated = await ForumComment.findById(newComment._id)
      .populate("author", "display_name avatar")
      .lean();

    return successResponse(res, 201, "Comment added", {
      ...populated,
      hasLiked: false,
      likeCount: 0,
    });
  } catch (error) {
    console.error("createComment error:", error);
    return errorResponse(res, 500, error.message || "Failed to add comment");
  }
};

export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await ForumComment.findById(commentId);
    if (!comment) {
      return errorResponse(res, 404, "Comment not found");
    }

    const alreadyLiked = comment.likes.some((l) => l.toString() === userId.toString());
    if (alreadyLiked) {
      comment.likes = comment.likes.filter((l) => l.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }
    comment.likeCount = comment.likes.length;
    await comment.save();

    return successResponse(res, 200, alreadyLiked ? "Like removed" : "Comment liked", {
      likeCount: comment.likeCount,
      hasLiked: !alreadyLiked,
    });
  } catch (error) {
    console.error("toggleLikeComment error:", error);
    return errorResponse(res, 500, error.message || "Failed to toggle like");
  }
};
