import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    if (data.status_code !== 200) {
      throw new Error(data.message);
    }

    const cookieOptions = {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
      sameSite: 'strict' as const,
    };

    cookies().set('user', JSON.stringify(data.data.user), cookieOptions);
    cookies().set('access_token', data.data.access_token, cookieOptions);
    cookies().set('refresh_token', data.data.refresh_token, cookieOptions);

    return NextResponse.json({ message: 'Login successful' });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
