'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

import { getBookings } from './bookings/booking-actions'
import { getRoomTypes } from './rooms/actions'

export async function getAnalytics() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        // Fetch everything in parallel
        const [
            analyticsRes,
            allBookingsWrapper,
            checkoutWrapper,
            cancelledWrapper,

            pendingWrapper,
            confirmedWrapper,
            roomTypesWrapper
        ] = await Promise.all([
            fetch(`${API_URL}/api/admin/analytics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-auth-token': token,
                    'Accept': 'application/json',
                },
                cache: 'no-store',
            }),
            getBookings(1), // Total bookings (any status)
            getBookings(1, { status: 'checked_out' }),
            getBookings(1, { status: 'cancelled' }),
            getBookings(1, { status: 'pending' }),
            getBookings(1, { status: 'confirmed' }),
            getRoomTypes()
        ])

        let baseData = {}
        if (analyticsRes.ok) {
            baseData = await analyticsRes.json()
        }

        // Extract counts safely
        const totalBookings = allBookingsWrapper.data?.total || 0
        const totalCheckout = checkoutWrapper.data?.total || 0
        const totalCancelled = cancelledWrapper.data?.total || 0
        const totalPending = pendingWrapper.data?.total || 0
        const totalConfirmed = confirmedWrapper.data?.total || 0

        // Calculate total rooms
        let totalRooms = 0
        if (roomTypesWrapper.data && Array.isArray(roomTypesWrapper.data)) {
            // Count all rooms in all room types
            totalRooms = roomTypesWrapper.data.reduce((acc: number, type: any) => {
                return acc + (type.rooms ? type.rooms.length : 0)
            }, 0)
        }

        return {
            data: {
                ...baseData,
                stats: {
                    total_bookings: totalBookings,
                    total_checkout: totalCheckout,
                    total_cancelled: totalCancelled,
                    total_pending: totalPending,
                    total_confirmed: totalConfirmed,
                    total_rooms: totalRooms
                }
            }
        }
    } catch (error) {
        console.error('getAnalytics error:', error)
        return { error: 'Failed to fetch analytics' }
    }
}
