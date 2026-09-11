import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import ForumThread from "../models/ForumThread.model.js";
import ForumComment from "../models/ForumComment.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const getUserStats = async (userId) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const [threadsCount, commentsCount, upvotesAgg] = await Promise.all([
    ForumThread.countDocuments({ author: objectId }),
    ForumComment.countDocuments({ author: objectId }),
    ForumThread.aggregate([
      { $match: { author: objectId } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvoteCount" } } },
    ]),
  ]);

  return {
    threadsCount,
    commentsCount,
    upvotesReceived: upvotesAgg[0]?.totalUpvotes || 0,
  };
};

const userController = {
  // GET /api/profile/me
  getMyProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password").lean();
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      const stats = await getUserStats(req.userId);

      return successResponse(res, 200, "Profile retrieved successfully", {
        user,
        stats,
      });
    } catch (error) {
      console.error("getMyProfile error:", error);
      return errorResponse(res, 500, error.message || "Failed to retrieve profile");
    }
  },

  // PUT /api/profile/me
  updateProfile: async (req, res) => {
    try {
      const { display_name, avatar, about } = req.body;
      const updates = {};

      if (display_name !== undefined) {
        const trimmedName = display_name.trim();
        if (trimmedName.length < 2 || trimmedName.length > 30) {
          return errorResponse(
            res,
            400,
            "Display name must be between 2 and 30 characters"
          );
        }
        updates.display_name = trimmedName;
      }

      if (avatar !== undefined) {
        updates.avatar = typeof avatar === "string" ? avatar.trim() : null;
      }

      if (about !== undefined) {
        if (about.length > 500) {
          return errorResponse(
            res,
            400,
            "Bio/About section must not exceed 500 characters"
          );
        }
        updates.about = about.trim();
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password").lean();

      if (!updatedUser) {
        return errorResponse(res, 404, "User not found");
      }

      const stats = await getUserStats(req.userId);

      return successResponse(res, 200, "Profile updated successfully", {
        user: updatedUser,
        stats,
      });
    } catch (error) {
      console.error("updateProfile error:", error);
      return errorResponse(res, 500, error.message || "Failed to update profile");
    }
  },

  // PUT /api/profile/change-password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return errorResponse(
          res,
          400,
          "Both current password and new password are required"
        );
      }

      if (newPassword.length < 6) {
        return errorResponse(
          res,
          400,
          "New password must be at least 6 characters long"
        );
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return errorResponse(res, 400, "Current password is incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return successResponse(res, 200, "Password changed successfully");
    } catch (error) {
      console.error("changePassword error:", error);
      return errorResponse(res, 500, error.message || "Failed to change password");
    }
  },

  // GET /api/profile/threads
  getMyThreads: async (req, res) => {
    try {
      const threads = await ForumThread.find({ author: req.userId })
        .populate("novel", "title cover category")
        .sort({ createdAt: -1 })
        .lean();

      return successResponse(res, 200, "User threads fetched", threads);
    } catch (error) {
      console.error("getMyThreads error:", error);
      return errorResponse(res, 500, error.message || "Failed to fetch threads");
    }
  },

  // GET /api/profile/comments
  getMyComments: async (req, res) => {
    try {
      const comments = await ForumComment.find({ author: req.userId })
        .populate("thread", "title category replyCount upvoteCount")
        .sort({ createdAt: -1 })
        .lean();

      return successResponse(res, 200, "User comments fetched", comments);
    } catch (error) {
      console.error("getMyComments error:", error);
      return errorResponse(res, 500, error.message || "Failed to fetch comments");
    }
  },

  // GET /api/profile/user/:id
  getPublicProfile: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, 400, "Invalid user ID format");
      }

      const user = await User.findById(id)
        .select("display_name avatar about role createdAt is_verified")
        .lean();

      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      const stats = await getUserStats(id);

      return successResponse(res, 200, "User public profile fetched", {
        user,
        stats,
      });
    } catch (error) {
      console.error("getPublicProfile error:", error);
      return errorResponse(res, 500, error.message || "Failed to fetch user profile");
    }
  },

  // GET /api/profile/user/:id/threads
  getUserThreads: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, 400, "Invalid user ID format");
      }

      const threads = await ForumThread.find({ author: id })
        .populate("novel", "title cover category")
        .sort({ createdAt: -1 })
        .lean();

      return successResponse(res, 200, "User threads fetched", threads);
    } catch (error) {
      console.error("getUserThreads error:", error);
      return errorResponse(res, 500, error.message || "Failed to fetch threads");
    }
  },

  // GET /api/profile/all (existing)
  getAllUsers: async (req, res) => {
    try {
      const results = await User.find().select("-password").lean();
      return successResponse(res, 200, "All users fetched", results);
    } catch (error) {
      return errorResponse(res, 500, error.message || "Server error");
    }
  },
};

export default userController;