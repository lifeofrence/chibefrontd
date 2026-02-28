'use server'

import { getAuthToken } from '../auth-actions'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

export async function sendEmailToGuest(bookingId: number, subject: string, message: string) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}/send-email`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ subject, message }),
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to send email', success: false }
        }

        return { message: 'Email sent successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred while sending email', success: false }
    }
}
