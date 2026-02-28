'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export type Booking = {
    id: number
    guest_name: string
    guest_email: string
    guest_phone: string
    check_in_date: string
    check_out_date: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'checked_out' | 'checked_in'
    amount: number
    room_id: number | null
    room_type_id: number
    room?: {
        id: number
        room_number: string
        status: string
    }
    room_type?: {
        id: number
        name: string
    }
}

export interface BookingSearchFilters {
    name?: string
    phone?: string
    booking_id?: string
    room_number?: string
    room_type?: string
    status?: string
    check_in_date?: string
    check_out_date?: string
}

export async function getBookings(page = 1, filters?: BookingSearchFilters) {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const query = new URLSearchParams()
        query.set('page', page.toString())

        // Add all search filters to query params
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.trim() !== '' && value !== 'all') {
                    query.set(key, value)
                }
            })
        }

        const res = await fetch(`${API_URL}/api/admin/bookings?${query.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch bookings: ${res.statusText}`)
        }

        const data = await res.json()
        return { data }
    } catch (error) {
        console.error('getBookings error:', error)
        return { error: 'Failed to fetch bookings' }
    }
}

export async function getBooking(id: number) {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch booking: ${res.statusText}`)
        }

        const data = await res.json()
        return { data }
    } catch (error) {
        return { error: 'Failed to fetch booking details' }
    }
}

export async function updateBooking(id: number, prevState: any, formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    const rawFormData: any = {
        guest_name: formData.get('guest_name'),
        guest_email: formData.get('guest_email'),
        guest_phone: formData.get('guest_phone'),
        status: formData.get('status'),
    }

    // Add room_type_id if provided
    const roomTypeId = formData.get('room_type_id')
    if (roomTypeId && roomTypeId !== '') {
        rawFormData.room_type_id = parseInt(roomTypeId as string)
    }

    // Add room_id if provided
    const roomId = formData.get('room_id')
    if (roomId && roomId !== '' && roomId !== 'none') {
        rawFormData.room_id = parseInt(roomId as string)
    } else if (roomId === 'none') {
        // Explicitly set to null to unassign room
        rawFormData.room_id = null
    }

    try {
        const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
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
            return { message: data.message || 'Failed to update booking', errors: data.errors, success: false }
        }

        revalidatePath('/admin/bookings')
        return { message: 'Booking updated successfully', success: true }

    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}

export async function updateBookingStatus(id: number, status: string) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ status }),
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to update status', success: false }
        }

        revalidatePath('/admin/bookings')
        return { message: 'Status updated successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}


export async function cancelBooking(id: number) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/bookings/cancel/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ status: 'cancelled' })
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to cancel booking', success: false }
        }

        revalidatePath('/admin/bookings')
        return { message: 'Booking cancelled successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}

export async function confirmBooking(id: number) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ status: 'confirmed' })
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to confirm booking', success: false }
        }

        revalidatePath('/admin/bookings')
        return { message: 'Booking confirmed successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}


export async function checkOutBooking(id: number) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/bookings/${id}/checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
        })

        const data = await res.json()

        if (!res.ok) {
            return { message: data.message || 'Failed to check out', success: false }
        }

        revalidatePath('/admin/bookings')
        revalidatePath('/admin')
        return { message: 'Guest checked out successfully', success: true }
    } catch (error) {
        return { message: 'Failed to check out', success: false }
    }
}

export async function checkAvailability(checkIn: string, checkOut: string) {
    // Public endpoint usually, but we can use admin token if needed. Public for now as implementation suggests.
    // Implementing as admin action for wizard.
    const token = await getAuthToken()

    try {
        const query = new URLSearchParams({
            check_in_date: checkIn,
            check_out_date: checkOut,
        })

        const res = await fetch(`${API_URL}/api/bookings/availability?${query.toString()}`, {
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}`, 'x-auth-token': token } : {})
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            throw new Error('Failed to check availability')
        }

        return { data: await res.json() }
    } catch (error) {
        return { error: 'Failed to check availability' }
    }
}

export async function createBooking(prevState: any, formData: FormData) {
    const token = await getAuthToken()
    // if (!token) return { message: 'Not authenticated', success: false } // endpoint is public, but context is admin

    const rawFormData = {
        guest_name: formData.get('guest_name'),
        guest_email: formData.get('guest_email'),
        guest_phone: formData.get('guest_phone'),
        check_in_date: formData.get('check_in_date'),
        check_out_date: formData.get('check_out_date'),
        room_type_id: formData.get('room_type_id'),
        number_of_rooms: formData.get('number_of_rooms') || 1,
    }

    try {
        const res = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}`, 'x-auth-token': token } : {})
            },
            body: JSON.stringify(rawFormData),
        })

        const data = await res.json()

        if (!res.ok) {
            // Check for specific availability error structure
            if (res.status === 422 && data.message?.includes('not available')) {
                return { message: data.message, success: false }
            }
            return { message: data.message || 'Failed to create booking', errors: data.errors, success: false }
        }

        revalidatePath('/admin/bookings')
        return { message: 'Booking created successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}

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
