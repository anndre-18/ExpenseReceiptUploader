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
  const title = formData.get('title');
  const description = formData.get('description');
  const tags = formData.get('tags');
  const date = formData.get('date');
  const amount = formData.get('amount');

  if (!file || !title || !description || !tags || !date || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  await writeFile(filePath, buffer);
  await connectDB();

  const receipt = await Receipt.create({
    title,
    description,
    tags: tags.split(',').map(tag => tag.trim()),
    date,
    amount,
    imageUrl: `/uploads/${fileName}`, // ✅ Include the image path
    userId: session.user.email,
  });

  return NextResponse.json({ success: true, receipt });
}
