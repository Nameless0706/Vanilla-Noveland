import mongoose from "mongoose";

const novelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    cover: { type: String, default: "" },
    description: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: ["Fantasy", "Action", "Adventure", "Sci-Fi", "Cultivation", "Romance", "Mystery", "Supernatural", "Other"],
      default: "Fantasy",
    },
    tags: [{ type: String, trim: true }],
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    chapters: { type: Number, default: 0 },
    views: { type: String, default: "10K" },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Hiatus"],
      default: "Ongoing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Novel", novelSchema);
