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

        const data = await response.json()
        console.log('[payment/initiate] backend responded:', response.status, JSON.stringify(data))

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to initiate payment', details: data },
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
