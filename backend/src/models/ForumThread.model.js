import mongoose from "mongoose";

const forumThreadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    novel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "General",
        "Novel Discussion",
        "Theories",
        "Reviews",
        "Chapter Discussion",
        "Recommendations",
      ],
      default: "General",
    },
    tags: [{ type: String, trim: true }],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upvoteCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual or middleware to keep upvoteCount consistent
forumThreadSchema.pre("save", function (next) {
  if (this.upvotes) {
    this.upvoteCount = this.upvotes.length;
  }
  next();
});

export default mongoose.model("ForumThread", forumThreadSchema);
