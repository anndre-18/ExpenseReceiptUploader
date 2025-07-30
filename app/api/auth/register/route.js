// Register API route
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  await connectDB()
  const { email, password } = await req.json()

  const existing = await User.findOne({ email })
  if (existing) {
    return NextResponse.json({ message: 'Email already registered' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hashed })
  await user.save()

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

  return NextResponse.json({ token })
}
