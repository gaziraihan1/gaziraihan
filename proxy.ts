import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    // ✅ Always allow login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // ✅ Use auth() instead of getToken — works with v5
    const session = await auth();

    if (!session || session.user?.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      // ✅ relative path — fixes the absolute URL redirect loop
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};