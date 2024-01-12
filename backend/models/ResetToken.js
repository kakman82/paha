import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // token for reset password
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    // expires --> automatically deleting record after 3600 second
    expires: 3600, // 1 hour
    default: Date.now(),
  },
});

export default mongoose.model("ResetToken", resetTokenSchema);
