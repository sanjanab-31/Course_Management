import mongoose from "mongoose";

export async function connectDB(uri) {
    try {
        const options = {
            serverSelectionTimeoutMS: 10000,
        };

        // Only apply TLS if it's likely an Atlas connection (mongodb+srv)
        // or if explicitly needed. For local (mongodb://), TLS usually causes issues.
        if (uri.includes("mongodb+srv://")) {
            options.tls = true;
        }

        await mongoose.connect(uri, options);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        // Retry logic could be added here
    }
}
