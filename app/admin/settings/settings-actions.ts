'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function getSettings() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/admin/settings`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) throw new Error('Failed to fetch settings')
        return { data: await res.json() }
    } catch (error) {
        return { error: 'Failed to fetch settings' }
    }
}

export async function updateSettings(settings: any[]) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/settings`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ settings }),
        })

        if (!res.ok) {
            const data = await res.json()
            return { message: data.message || 'Failed to update settings', success: false }
        }

        revalidatePath('/admin/settings')
        return { message: 'Settings updated successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}
