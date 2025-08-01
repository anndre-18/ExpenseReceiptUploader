import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  date: String,
  amount: String,
  userId: String, //github userid
  imageUrl: String, // ✅ Add this field
});

export default mongoose.models.Receipt || mongoose.model("Receipt", ReceiptSchema);
