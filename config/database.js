import mongoose from "mongoose";

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

export async function closeConnection() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed!");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err.message);
  }
}
