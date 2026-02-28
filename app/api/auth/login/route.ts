import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()

        // Call Laravel Backend
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com';
        const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (res.ok && data.token) {
            // Set session cookie with the token
            const cookieStore = await cookies()

            // Store the token
            cookieStore.set('admin_token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24, // 1 day
            })

            // Also set the session flag that middleware checks (or update middleware)
            // For now, let's update middleware to check admin_token or keep admin_session
            // Let's use admin_token as the source of truth

            const response = NextResponse.json({ success: true, user: data.user });
            response.cookies.set('admin_token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24,
            });
            return response;
        }

        return NextResponse.json(
            { success: false, message: data.message || 'Invalid credentials' },
            { status: res.status }
        )
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, message: 'An error occurred during login' },
            { status: 500 }
        )
    }
}
