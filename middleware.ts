import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple password protection for demo purposes
// In a real app, use proper authentication
const ADMIN_PASSWORD = 'admin123';

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminPage) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !isValidAuth(authHeader)) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      });
    }
  }
  
  return NextResponse.next();
}

function isValidAuth(authHeader: string): boolean {
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [, password] = credentials.split(':');
  
  return password === ADMIN_PASSWORD;
}

export const config = {
  matcher: '/admin/:path*',
};