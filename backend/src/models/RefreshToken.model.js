import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one refresh token per user
    },
    token: {
      type: String,
      required: true,
    },
    // optional
    device: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Refresh_Token", refreshTokenSchema);
