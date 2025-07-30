// Upload and fetch receipts route

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const files = fs.readdirSync(uploadDir);

    const imageURLs = files.map((filename) => ({
      filename,
      url: `/uploads/${filename}`,
    }));

    return NextResponse.json(imageURLs);
  } catch (err) {
    console.error('Failed to read uploads:', err);
    return NextResponse.json({ message: 'Failed to load uploads' }, { status: 500 });
  }
}
