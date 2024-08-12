import { NextRequest, NextResponse } from 'next/server';
import { refreshToken } from '@/services/authService';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;
  const refreshTokenValue = req.cookies.get('refresh_token')?.value;

  const isLoginRoute = req.nextUrl.pathname.startsWith('/auth');

  if (accessToken && isLoginRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!accessToken && !isLoginRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }


  // if ((!accessToken || accessToken === "") && refreshTokenValue) {
  //   try {
  //     const data = await refreshToken(refreshTokenValue);
  //     const newResponse = NextResponse.next();
  //     newResponse.cookies.set('access_token', data.data.access_token, { httpOnly: true });
  //     return newResponse;
  //   } catch (error) {
  //     console.error('Failed to refresh access token', error);
  //   }
  // }

  // if (!accessToken && !refreshTokenValue && !isLoginRoute) {
  //   const loginUrl = new URL('/auth/login', req.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)', '/api/auth/refresh'],
};

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     {
//       source: '/((?!api|_next/static|_next/image|favicon.ico).*)', 
      
//       missing: [
//         { type: 'header', key: 'next-router-prefetch' },
//         { type: 'header', key: 'purpose', value: 'prefetch' },
//       ],
//     },
//   ],
// }
