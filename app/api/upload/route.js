import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { IncomingForm } from 'formidable';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

function reqToIncomingMessage(req) {
  const headers = {};
  req.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const readable = Readable.from(req.body);

  return Object.assign(readable, {
    headers,
    method: req.method,
    url: '',
  });
}

export async function POST(req) {
  try {
    const incomingReq = reqToIncomingMessage(req);

    const form = new IncomingForm({ keepExtensions: true });

    const data = await new Promise((resolve, reject) => {
      form.parse(incomingReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // ✅ SAFELY EXTRACT FILE
    const file = Array.isArray(data.files.file)
      ? data.files.file[0]
      : data.files.file;

    if (!file || !file.filepath) {
      return NextResponse.json({ message: 'No file received' }, { status: 400 });
    }

    const ext = path.extname(file.originalFilename || '');
    const fileName = `${Date.now()}${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

    const fileData = fs.readFileSync(file.filepath);
    await writeFile(uploadPath, fileData);

    return NextResponse.json({ message: 'Upload successful', fileName });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
