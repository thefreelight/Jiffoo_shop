import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 检查是否是 API 认证路由
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return null;
  }

  const token = await getToken({ req });
  const isAuth = !!token;

  // 获取当前路径和查询参数
  const { pathname, search } = req.nextUrl;
  const fullPath = `${pathname}${search}`;

  // 检查是否是认证相关页面
  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';
  const isAuthPage = isLoginPage || isSignupPage;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';

  // 如果已登录用户访问登录/注册页面
  if (isAuthPage && isAuth) {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 处理管理员页面
  if (isAdminPage) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (token.role !== 'admin' && !isAdminLoginPage) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (isAdminLoginPage && token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return null;
  }

  // 处理需要认证的用户页面
  if (pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      // 使用 from 参数而不是 callbackUrl
      const from = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?from=${from}`, req.url));
    }
    if (token.role === 'admin') {
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