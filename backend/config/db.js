import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      tls: true,
      family: 4
    });
    console.log("✅ MongoDB Connected Successfully (Atlas)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
