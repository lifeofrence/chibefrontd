import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the path starts with /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check if the user is authenticated (e.g., check for a cookie)
        const isAuthenticated = request.cookies.has('admin_token')

        // Allow access to login page even if not authenticated
        if (request.nextUrl.pathname === '/admin/login') {
            if (isAuthenticated) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return NextResponse.next()
        }

        // Redirect to login if accessing other admin pages without authentication
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
