import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //console.log('Connected to the MongoDB...');
  } catch (err) {
    console.log(err.message);
    // for trying new connections after an error use throw err
    throw err;
  }
};
