import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    display_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "moderator", "user"],
    },
    is_verified: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    about: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
