import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/config';

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login';
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  
  // Allow API auth routes to be accessed without a session
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // If on an auth page with a session, redirect to dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If on a protected page without a session, redirect to login
  if (!isAuthPage && !session && !isApiAuthRoute && pathname !== '/' && !pathname.startsWith('/api/oauth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g., /payment-iframe.html)
     */
    '/((?!_next/static|_next/image|favicon.ico|payment-iframe.html).*)',
  ],
};
