import { Suspense } from 'react'
import { getRoomTypes } from './actions'
import { RoomList } from '@/components/admin/room-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AdminRoomsPage() {
  const { data: rooms, error } = await getRoomTypes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Types</h1>
          <p className="text-muted-foreground">
            Manage your hotel room types and their details.
          </p>
        </div>
        {/* We pass empty rooms to client component, it handles the open state */}
      </div>

      <Suspense fallback={<RoomsSkeleton />}>
        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            Error loading rooms: {error}
          </div>
        ) : (
          <RoomList rooms={rooms || []} />
        )}
      </Suspense>
    </div>
  )
}

function RoomsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-md border p-4">
        <div className="space-y-4">
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
    </div>
  )
}
