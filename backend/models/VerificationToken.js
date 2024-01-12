import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // for email verification
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    // expires --> automatically deleting record after 3600 second
    expires: 3600, // 1h = 60min,
    default: Date.now(),
  },
});

export default mongoose.model('VerificationToken', verificationTokenSchema);
