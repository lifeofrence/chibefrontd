'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function getOffers() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/admin/offers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) throw new Error('Failed to fetch offers')
        return { data: await res.json() }
    } catch (error) {
        return { error: 'Failed to fetch offers' }
    }
}

export async function createOffer(formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/offers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                // Don't set Content-Type - browser will set it with boundary for multipart
            },
            body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
            console.error('Upload error:', data)
            return {
                message: data.message || JSON.stringify(data.errors || data) || 'Failed to create offer',
                success: false
            }
        }

        revalidatePath('/admin/offers')
        return { message: 'Offer created successfully', success: true, data }
    } catch (error) {
        console.error('Network error:', error)
        return { message: `Network error: ${error}`, success: false }
    }
}

export async function deleteOffer(id: number) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/offers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
        })

        if (!res.ok) return { message: 'Failed to delete offer', success: false }

        revalidatePath('/admin/offers')
        return { message: 'Offer deleted successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}
