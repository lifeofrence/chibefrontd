import { Suspense } from 'react'
import { getGalleryImages } from './gallery-actions'
import { GalleryManagement } from '@/components/admin/gallery-management'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
    const { data, error } = await getGalleryImages()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
                    <p className="text-muted-foreground">
                        Upload and manage images that appear on the website gallery.
                    </p>
                </div>
            </div>

            <Suspense fallback={<GallerySkeleton />}>
                {error ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        Error loading gallery: {error}
                    </div>
                ) : (
                    <GalleryManagement initialImages={data || []} />
                )}
            </Suspense>
        </div>
    )
}

function GallerySkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square" />
            ))}
        </div>
    )
}
