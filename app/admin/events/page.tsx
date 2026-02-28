import { Suspense } from 'react'
import { getEvents } from './actions'
import { EventManagement } from '@/components/admin/event-management'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
    const { data: events, error } = await getEvents()

    return (
        <div className="space-y-6">
            <Suspense fallback={<EventsSkeleton />}>
                {error ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        Error loading events: {error}
                    </div>
                ) : (
                    <EventManagement initialEvents={events || []} />
                )}
            </Suspense>
        </div>
    )
}

function EventsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="rounded-md border p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}
