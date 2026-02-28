'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://niconluxury.jubileesystem.com'

async function getAuthToken() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_token')?.value
}

export async function getGalleryImages() {
    const token = await getAuthToken()
    if (!token) return { error: 'Not authenticated' }

    try {
        const res = await fetch(`${API_URL}/api/admin/gallery`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        })

        if (!res.ok) throw new Error('Failed to fetch gallery images')
        return { data: await res.json() }
    } catch (error) {
        return { error: 'Failed to fetch gallery images' }
    }
}

export async function createGalleryImage(formData: FormData) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/gallery`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
                // Don't set Content-Type - browser will set it with boundary for multipart
            },
            body: formData,
        })

        const contentType = res.headers.get('content-type')

        // Check if response is HTML (error page)
        if (contentType && contentType.includes('text/html')) {
            const html = await res.text()
            console.error('Server returned HTML:', html.substring(0, 500))
            return {
                message: `Server error: Expected JSON but got HTML. Check Laravel logs. Status: ${res.status}`,
                success: false
            }
        }

        const data = await res.json()

        if (!res.ok) {
            console.error('Upload error:', data)

            // Format validation errors
            let errorMessage = data.message || 'Failed to upload image'
            if (data.errors) {
                const errorDetails = Object.entries(data.errors)
                    .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('\n')
                errorMessage = `${errorMessage}\n\n${errorDetails}`
            }

            return {
                message: errorMessage,
                success: false
            }
        }

        revalidatePath('/admin/gallery')
        return { message: 'Image uploaded successfully', success: true, data }
    } catch (error) {
        console.error('Network error:', error)
        return { message: `Network error: ${error}`, success: false }
    }
}

export async function deleteGalleryImage(id: number) {
    const token = await getAuthToken()
    if (!token) return { message: 'Not authenticated', success: false }

    try {
        const res = await fetch(`${API_URL}/api/admin/gallery/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token,
                'Accept': 'application/json',
            },
        })

        if (!res.ok) return { message: 'Failed to delete image', success: false }

        revalidatePath('/admin/gallery')
        return { message: 'Image deleted successfully', success: true }
    } catch (error) {
        return { message: 'An error occurred', success: false }
    }
}
