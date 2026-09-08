import mongoose from "mongoose";
import crypto from "crypto";

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
    otp: { type: String },
    otp_expire: { type: Date },
    password_reset_token: { type: String },
    password_reset_expire: { type: Date },
    avatar: { type: String, default: null },
    about: { type: String, default: "" },
  },
  { timestamps: true },
);

userSchema.methods.createResetPasswordToken = function () {
  // generate raw token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash token before saving to DB
  this.password_reset_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.password_reset_expire = Date.now() + 15 * 60 * 1000;

  return resetToken; // send this to email
};

export default mongoose.model("User", userSchema);
