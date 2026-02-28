'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

export type RoomType = {
    id: number
    name: string
    description: string
    base_price: string
    amenities: string[] | null
    rooms?: any[]
    images?: any[]
    total_rooms?: number // From store/update payload
}

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function getRoomTypes() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/rooms/list`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch rooms: ${res.statusText}`)
        }

        const data = await res.json()
        return { data }
    } catch (error) {
        console.error('getRoomTypes error:', error)
        return { error: 'Failed to fetch rooms' }
    }
}

export async function getRoomType(id: number) {
    // Public route, no token needed usually, but we can send it if we want
    try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, {
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch room: ${res.statusText}`)
        }

        const data = await res.json()
        return { data }
    } catch (error) {
        return { error: 'Failed to fetch room details' }
    }
}

export async function createRoomType(prevState: any, formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    const rawFormData = {
        name: formData.get('name'),
        description: formData.get('description'),
        base_price: formData.get('base_price'),
        total_rooms: formData.get('total_rooms'),
        // Amenities might need special handling if it's a multi-select
        // For now assuming a comma-separated string or handling in the component
        amenities: formData.getAll('amenities'),
    }

    // Convert amenities to array if it's not already
    // The API expects an array. If we send multiple 'amenities' fields, formData.getAll works.

    try {
        const res = await fetch(`${API_URL}/api/rooms/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(rawFormData),
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to create room', errors: data.errors, success: false }
        }

        revalidatePath('/admin/rooms')
        return { message: 'Room created successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}

export async function updateRoomType(id: number, prevState: any, formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    const rawFormData = {
        name: formData.get('name'),
        description: formData.get('description'),
        base_price: formData.get('base_price'),
        total_rooms: formData.get('total_rooms'),
        amenities: formData.getAll('amenities'),
    }

    try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(rawFormData),
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to update room', errors: data.errors, success: false }
        }

        revalidatePath('/admin/rooms')
        return { message: 'Room updated successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}
