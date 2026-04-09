// proxy.ts (in project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // ✅ CRITICAL: Public routes that should NEVER be redirected
  const publicRoutes = [
    '/admin/login',
    '/api/auth/signin',
    '/api/auth/signout', 
    '/api/auth/callback',
    '/api/auth/session',
    '/api/auth/providers',
    '/api/auth/csrf',
    '/api/auth/error',
  ];

  // ✅ Skip proxy entirely for public routes - return immediately
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // ✅ Get token from cookie
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdmin = token?.role === 'ADMIN';

  // ✅ Protect admin routes: redirect non-admins to login
  if (pathname.startsWith('/admin')) {
    if (!token || !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(url);
    }
  }
  if( pathname === '/admin/login') {
    return NextResponse.next()
  }

  return NextResponse.next();
}

// ✅ Matcher: Only run proxy on admin routes, exclude static files and auth API
export const config = {
  matcher: [
    '/admin/:path*',
    // Exclude: static files, images, favicons, NextAuth API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$|api/auth).*)',
  ],
};