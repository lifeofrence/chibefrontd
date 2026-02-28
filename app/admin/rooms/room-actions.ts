'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function createPhysicalRoom(prevState: any, formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    const rawFormData = {
        room_number: formData.get('room_number'),
        room_type_id: formData.get('room_type_id'),
        status: formData.get('status'),
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/physical-rooms`, {
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

export async function updatePhysicalRoom(id: number, prevState: any, formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    const rawFormData = {
        room_number: formData.get('room_number'),
        room_type_id: formData.get('room_type_id'),
        status: formData.get('status'),
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/physical-rooms/${id}`, {
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

export async function deletePhysicalRoom(id: number) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/physical-rooms/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
        })

        if (!res.ok) {
            const data = await res.json()
            return { message: data.message || 'Failed to delete room', success: false }
        }

        revalidatePath('/admin/rooms')
        return { message: 'Room deleted successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}
