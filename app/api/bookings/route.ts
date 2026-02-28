import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'
    try {
        const body = await request.json()
        const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

        const response = await fetch(`${API_BASE}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Backend API error:', {
                status: response.status,
                data: data
            })
            return NextResponse.json(
                { error: data.message || 'Booking failed', details: data },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Booking API proxy error details:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            url: `${API_BASE}/api/bookings`
        })
        return NextResponse.json(
            { error: 'Failed to process booking request', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

