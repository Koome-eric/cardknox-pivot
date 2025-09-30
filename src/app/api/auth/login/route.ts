import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/config';
import { authAdmin } from '@/lib/firebase/admin';
import { auth } from '@/lib/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    
    // We need to sign in the user on a client/server instance to verify the password
    // This is a temporary step to verify credentials before creating a session.
    // A more advanced implementation might use a different method.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const expiresIn = SESSION_COOKIE_MAX_AGE * 1000;
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true, message: 'Logged in successfully.' });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error: any) {
    console.error('Login API error:', error);
    let errorMessage = 'An unexpected error occurred during session creation.';
     if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              errorMessage = 'Invalid email or password.';
              break;
            case 'auth/id-token-expired':
            case 'auth/id-token-revoked':
            case 'auth/invalid-id-token':
                errorMessage = 'Invalid authentication token. Please log in again.';
                break;
            default:
                errorMessage = 'Authentication failed.';
        }
    }
    return NextResponse.json({ error: errorMessage, details: error.message }, { status: 401 });
  }
}
