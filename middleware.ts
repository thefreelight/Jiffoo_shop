import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    const token = req.nextauth.token;

    if (isAdminPage && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                          req.nextUrl.pathname.startsWith('/signup');
        
        if (isAuthPage) {
          if (isAuth) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
          return true;
        }
        
        return isAuth;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}; 