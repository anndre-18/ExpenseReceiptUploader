import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Receipt from '@/models/Receipt';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('receipt');
  const title = formData.get('title');
  const description = formData.get('description');
  const tags = formData.get('tags');
  const date = formData.get('date');
  const amount = formData.get('amount');

  console.log('Upload request - Tags received:', tags, 'Type:', typeof tags);

  if (!file || !title || !description || !date || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  await writeFile(filePath, buffer);
  await connectDB();

  // Handle tags as simple string
  const tagsString = tags || '';
  console.log('Tags string to store:', tagsString);

  const receipt = await Receipt.create({
    title,
    description,
    tags: tagsString, // Store as simple string
    date,
    amount,
    imageUrl: `/uploads/${fileName}`, // ✅ Include the image path
    userId: 'anonymous', // Set a default userId for now
  });

  console.log('Receipt created with tags:', receipt.tags);
  return NextResponse.json({ success: true, receipt });
}