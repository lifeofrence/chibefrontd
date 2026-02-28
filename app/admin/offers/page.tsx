import { Suspense } from 'react'
import { getOffers } from './offers-actions'
import { OffersManagement } from '@/components/admin/offers-management'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AdminOffersPage() {
    const { data, error } = await getOffers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Offers Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage special offers that appear on the website.
                    </p>
                </div>
            </div>

            <Suspense fallback={<OffersSkeleton />}>
                {error ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        Error loading offers: {error}
                    </div>
                ) : (
                    <OffersManagement initialOffers={data || []} />
                )}
            </Suspense>
        </div>
    )
}

function OffersSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
            ))}
        </div>
    )
}
