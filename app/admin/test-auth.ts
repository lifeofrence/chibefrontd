'use server'

import { cookies } from 'next/headers'

export async function testAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
        return { error: 'No token found in cookies' }
    }

    try {
        const res = await fetch('http://127.0.0.1:8000/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
        })

        const data = await res.json()
        return {
            status: res.status,
            data,
            token: token.substring(0, 20) + '...' // Show first 20 chars only
        }
    } catch (error) {
        return { error: String(error) }
    }
}
