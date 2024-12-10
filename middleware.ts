import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/api/auth');
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginPage = req.nextUrl.pathname === '/admin/login';
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isSignupPage = req.nextUrl.pathname === '/signup';
  const isPublicAuthPage = isLoginPage || isSignupPage;

  // Allow all auth API routes to pass through
  if (isAuthPage) {
    return null;
  }

  // Handle admin pages
  if (isAdminPage) {
    if (isAdminLoginPage) {
      if (isAuth && token?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    if (token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return null;
  }

  // Handle public auth pages (login/signup)
  if (isPublicAuthPage) {
    if (isAuth) {
      if (token?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return null;
  }

  // Handle protected user pages
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      const from = req.nextUrl.pathname;
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
    if (token?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return null;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/api/auth/:path*'
  ],
}; 