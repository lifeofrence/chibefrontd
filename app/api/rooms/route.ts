import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://backend.chibenhotels.com'
        const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

        const response = await fetch(`${API_BASE}/api/rooms`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
            },
            cache: 'no-store',
        })

        const text = await response.text()
        let data: unknown
        try {
            data = JSON.parse(text)
        } catch {
            console.error('Rooms API non-JSON response:', {
                status: response.status,
                body: text.slice(0, 500),
            })
            return NextResponse.json(
                { error: 'Backend returned invalid JSON', details: text.slice(0, 500) },
                { status: 502 }
            )
        }

        if (!response.ok) {
            console.error('Rooms API error:', {
                status: response.status,
                data,
            })
            return NextResponse.json(
                { error: (data as Record<string, unknown>).message as string || 'Failed to load rooms', details: data },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('Rooms API proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch rooms', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
