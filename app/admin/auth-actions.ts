'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

export async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export type AdminUser = {
    id: number
    name: string
    email: string
    role: string
}

export async function getCurrentUser() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch user: ${res.statusText}`)
        }

        const response = await res.json()
        // API returns { success: true, data: { user: {...} } }
        return { data: response.data.user as AdminUser }
    } catch (error) {
        console.error('getCurrentUser error:', error)
        return { error: 'Failed to fetch user data' }
    }
}
