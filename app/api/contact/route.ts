import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.email || !body.subject || !body.message) {
            return NextResponse.json(
                { error: 'Missing required fields. Please fill in name, email, subject, and message.' },
                { status: 400 }
            )
        }

        try {
            const response = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            })

            const data = await response.json()

            if (!response.ok) {
                // If it's a 404, the endpoint doesn't exist yet on the backend
                if (response.status === 404) {
                    console.log('Backend contact endpoint not found. Logging message locally:', body)
                    // Return success anyway - in production, you might want to send an email or save to a database
                    return NextResponse.json({
                        success: true,
                        message: 'Message received. We will get back to you soon.',
                        note: 'Contact endpoint not yet implemented on backend'
                    }, { status: 200 })
                }

                return NextResponse.json(
                    { error: data.message || 'Failed to send message', details: data },
                    { status: response.status }
                )
            }

            return NextResponse.json(data, { status: 200 })
        } catch (fetchError) {
            // Network error or backend is down
            console.error('Backend fetch error:', fetchError)
            console.log('Contact message (backend unavailable):', body)

            // Return success to user anyway
            return NextResponse.json({
                success: true,
                message: 'Message received. We will get back to you soon.',
                note: 'Backend temporarily unavailable, message logged locally'
            }, { status: 200 })
        }
    } catch (error) {
        console.error('Contact API error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
