import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        if (token) {
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

            try {
                await fetch(`${backendUrl}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-auth-token': token,
                        'Accept': 'application/json',
                    },
                })
            } catch (e) {
                console.error('Backend logout failed', e)
                // Continue to clear cookie anyway
            }
        }

        cookieStore.delete('admin_token')
        // Also delete old cookie if it exists
        cookieStore.delete('admin_session')

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'An error occurred' },
            { status: 500 }
        )
    }
}
