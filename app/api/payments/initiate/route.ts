import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://backend.chibenhotels.com'
    try {
        const body = await request.json()
        console.log('[payment/initiate] proxying to backend:', JSON.stringify(body))

        const response = await fetch(`${API_BASE}/api/payments/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        const contentType = response.headers.get('content-type') || ''
        let data: unknown

        if (contentType.includes('application/json')) {
            data = await response.json()
        } else {
            const text = await response.text()
            console.error('[payment/initiate] backend returned non-JSON:', {
                status: response.status,
                contentType,
                body: text.slice(0, 500),
            })
            return NextResponse.json(
                { error: 'Backend returned an invalid response', details: text.slice(0, 500) },
                { status: 502 }
            )
        }

        console.log('[payment/initiate] backend responded:', response.status, JSON.stringify(data))

        if (!response.ok) {
            return NextResponse.json(
                { error: (data as Record<string, unknown>)?.message || 'Failed to initiate payment', details: data },
                { status: response.status }
            )
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error('[payment/initiate] proxy error:', error instanceof Error ? error.message : error)
        return NextResponse.json(
            { error: 'Failed to process payment initiation request' },
            { status: 500 }
        )
    }
}
