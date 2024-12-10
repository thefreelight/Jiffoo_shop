import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 检查是否是 API 认证路由或静态资源
  if (req.nextUrl.pathname.startsWith('/api/auth') || 
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.includes('.')) {
    return null;
  }

  const token = await getToken({ req });
  const isAuth = !!token;

  // 获取当前路径
  const { pathname } = req.nextUrl;

  // 检查是否是认证相关页面
  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';
  const isAdminLoginPage = pathname === '/admin/login';
  const isPublicAuthPage = isLoginPage || isSignupPage;

  // 处理管理员登录页面
  if (isAdminLoginPage) {
    if (isAuth && token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return null;
  }

  // 处理普通用户认证页面
  if (isPublicAuthPage) {
    if (isAuth) {
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return null;
  }

  // 处理管理员页面
  if (pathname.startsWith('/admin') && !isAdminLoginPage) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return null;
  }

  // 处理需要认证的用户页面
  if (pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      const returnTo = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, req.url));
    }
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return null;
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 