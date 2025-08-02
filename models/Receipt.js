// models/Receipt.js
import mongoose from "mongoose";

// models/Receipt.js
const receiptSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: String, // Changed from [String] to String
  date: String,
  amount: String,
  imageUrl: String,
  userId: String, // optional for now
}, { timestamps: true }); // ✅ this is important


export default mongoose.models.Receipt || mongoose.model("Receipt", receiptSchema);
