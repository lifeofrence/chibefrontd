import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

        const body = await request.json()

        const response = await fetch(`${API_BASE}/api/admin/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const cookieStore = await cookies()
        const token = cookieStore.get('admin_token')?.value
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

        const response = await fetch(`${API_BASE}/api/admin/events/${id}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            return NextResponse.json(data, { status: response.status })
        }

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed' },
            { status: 500 }
        )
    }
}
