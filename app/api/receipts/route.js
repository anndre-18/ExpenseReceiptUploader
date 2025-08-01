import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Receipt from '@/models/Receipt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const receipts = await Receipt.find({ userId: session.user.email }).sort({ date: -1 });

  return NextResponse.json(receipts);
}
