import mongoose from 'mongoose';

const paymentMethodSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PaymentMethod', paymentMethodSchema);
