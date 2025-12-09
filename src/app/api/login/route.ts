// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { users } from '../../graphql/mockData';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body as { email?: string; password?: string };

  // Simple demo auth
  if (email !== 'demo@campaignhq.com' || password !== 'demo123') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const user = users[0];

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '2h' }
  );

  const res = NextResponse.json({ token });

  // Optional: also set HttpOnly cookie
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  return res;
}
