import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isAuthenticated = request.cookies.get('isAuthenticated');
    
    if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
