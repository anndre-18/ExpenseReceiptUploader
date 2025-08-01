import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  date: String,
  amount: String,
  userId: String, // Store GitHub user ID or email
});

export default mongoose.models.Receipt || mongoose.model("Receipt", ReceiptSchema);
