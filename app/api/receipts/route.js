// app/api/receipts/route.js

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function GET() {
  try {
    await connectDB();

    // Fetch ALL receipts, no filters
    const receipts = await Receipt.find().sort({ createdAt: -1 });

    return NextResponse.json(receipts);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
  }
}
