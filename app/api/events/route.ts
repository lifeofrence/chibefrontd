import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

        const response = await fetch(`${API_BASE}/api/events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to load events' },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        )
    }
}
