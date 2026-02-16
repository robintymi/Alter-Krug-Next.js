import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/admin/login'
    const isAdminPath = path.startsWith('/admin')

    // Public path + logged in = redirect to dashboard
    if (isPublicPath && request.cookies.get('admin_session')) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Admin path (except login) + not logged in = redirect to login
    if (isAdminPath && !isPublicPath && !request.cookies.get('admin_session')) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
    ]
}
