import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://backend.chibenhotels.com'
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

        const contentType = response.headers.get('content-type') || ''
        let data: unknown

        if (contentType.includes('application/json')) {
            data = await response.json()
        } else {
            const text = await response.text()
            console.error('Backend returned non-JSON:', {
                status: response.status,
                contentType,
                body: text.slice(0, 500),
            })
            return NextResponse.json(
                { error: 'Backend returned an invalid response', details: text.slice(0, 500) },
                { status: 502 }
            )
        }

        if (!response.ok) {
            console.error('Backend API error:', {
                status: response.status,
                data: data
            })
            return NextResponse.json(
                { error: (data as Record<string, unknown>)?.message || 'Booking failed', details: data },
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

