// Delete update receipt route
// /app/api/receipts/[id]/route.js

import { connectDB } from '@/lib/db';
import Receipt from '@/models/Receipt';

export async function DELETE(req, { params }) {
  await connectDB();
  
  // Fix for Next.js 15: await params before accessing properties
  const { id } = await params;

  try {
    const receipt = await Receipt.findById(id);
    if (!receipt) return Response.json({ error: 'Not found' }, { status: 404 });

    await Receipt.findByIdAndDelete(id);
    return Response.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return Response.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  
  // Fix for Next.js 15: await params before accessing properties
  const { id } = await params;
  const body = await req.json();

  try {
    const receipt = await Receipt.findById(id);
    if (!receipt) return Response.json({ error: 'Not found' }, { status: 404 });

    const updated = await Receipt.findByIdAndUpdate(id, body, { new: true });
    return Response.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    return Response.json({ error: 'Failed to update' }, { status: 500 });
  }
}
