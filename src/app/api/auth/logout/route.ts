import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/config';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });

  // Clear the session cookie
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
