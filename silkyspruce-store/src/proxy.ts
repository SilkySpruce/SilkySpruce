import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { globalRatelimit } from '@/lib/ratelimit';

export default async function proxy(request: NextRequest) {
  // Extract the IP securely from standard proxy headers
  const ip = request.headers.get('x-forwarded-for') ?? 
             request.headers.get('x-real-ip') ?? 
             '127.0.0.1';

  // Apply rate limiting to API routes and server action POSTs
  if (request.nextUrl.pathname.startsWith('/api') || request.method === 'POST') {
    const { success } = await globalRatelimit.limit(`global_${ip}`);
    
    if (!success) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};