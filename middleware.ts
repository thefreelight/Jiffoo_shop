import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isAdminLoginPage = req.nextUrl.pathname === '/admin/login';
  const isUserLoginPage = req.nextUrl.pathname === '/login';
  const isSignupPage = req.nextUrl.pathname === '/signup';

  // Handle admin pages and admin login
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

  // Handle user login/signup pages
  if (isUserLoginPage || isSignupPage) {
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
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(req.nextUrl.pathname)}`, req.url)
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
  ],
}; 