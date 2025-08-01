import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Receipt from '@/models/Receipt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('receipt');
  const type = formData.get('type');

  if (!file || !file.name || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  await writeFile(filePath, buffer);

  await connectDB();

  const receipt = await Receipt.create({
    user: session.user.email, // 👈 Stores GitHub email as identifier
    type,
    imageUrl: `/uploads/${fileName}`,
  });

  return NextResponse.json({ success: true, receipt });
}
