import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  verifyCode: { type: String, default: null },
  codeExpiresAt: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

