import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebase/admin';
import { SESSION_COOKIE_MAX_AGE } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 401 });
    }

    // Verify the ID token and create a session cookie.
    // The session cookie will have the same claims as the ID token.
    const expiresIn = SESSION_COOKIE_MAX_AGE * 1000;
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });
    
    return NextResponse.json({ success: true, sessionCookie });

  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 });
  }
}
