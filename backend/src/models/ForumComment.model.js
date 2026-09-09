import mongoose from "mongoose";

const forumCommentSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumThread",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumComment",
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

forumCommentSchema.pre("save", function (next) {
  if (this.likes) {
    this.likeCount = this.likes.length;
  }
  next();
});

export default mongoose.model("ForumComment", forumCommentSchema);
