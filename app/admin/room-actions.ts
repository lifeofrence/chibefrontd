'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function updateRoomStatus(roomId: number, status: string) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/physical-rooms/${roomId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ status }),
        })

        if (!res.ok) {
            const data = await res.json()
            return {
                message: data.message || 'Failed to update room status',
                success: false
            }
        }

        revalidatePath('/admin')
        return { message: 'Room status updated successfully', success: true }
    } catch (error) {
        console.error('Update room error:', error)
        return { message: 'An error occurred', success: false }
    }
}
