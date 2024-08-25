import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;

  if (!accessToken && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (accessToken && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};