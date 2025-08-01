import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Update this path if needed

// Receipt Schema
const receiptSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  date: String,
  amount: String,
  userId: String, // GitHub user's email
});

const Receipt = mongoose.models.Receipt || mongoose.model('Receipt', receiptSchema);

// Connect to DB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// GET: Get all receipts for the logged-in user
export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const receipts = await Receipt.find({ userId: session.user.email }).sort({ date: -1 });

    return NextResponse.json(receipts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
  }
}

// POST: Create a new receipt for the logged-in user
export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const newReceipt = new Receipt({
      ...body,
      userId: session.user.email,
    });

    const savedReceipt = await newReceipt.save();
    return NextResponse.json(savedReceipt);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save receipt' }, { status: 500 });
  }
}
