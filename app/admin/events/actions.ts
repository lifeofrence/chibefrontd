'use server'

import { cookies } from 'next/headers'
import { API_BASE_URL } from '@/lib/api-config'

export async function getEvents() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value

        const response = await fetch(`${API_BASE_URL}/api/events`, {
            cache: 'no-store',
            headers: token ? {
                'Authorization': `Bearer ${token}`
            } : {}
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.statusText}`)
        }

        const data = await response.json()
        return { data, error: null }
    } catch (error) {
        console.error('getEvents error:', error)
        return { data: [], error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
