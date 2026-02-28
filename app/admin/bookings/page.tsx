import { Suspense } from 'react'
import { getBookings, BookingSearchFilters } from './booking-actions'
import { BookingList } from '@/components/admin/booking-list'
import { NewBookingWizard } from '@/components/admin/new-booking-wizard'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1

  // Extract search filters from URL params
  const filters: BookingSearchFilters = {
    name: typeof params.name === 'string' ? params.name : undefined,
    phone: typeof params.phone === 'string' ? params.phone : undefined,
    booking_id: typeof params.booking_id === 'string' ? params.booking_id : undefined,
    room_number: typeof params.room_number === 'string' ? params.room_number : undefined,
    room_type: typeof params.room_type === 'string' ? params.room_type : undefined,
    status: typeof params.status === 'string' ? params.status : undefined,
    check_in_date: typeof params.check_in_date === 'string' ? params.check_in_date : undefined,
    check_out_date: typeof params.check_out_date === 'string' ? params.check_out_date : undefined,
  }

  const { data, error } = await getBookings(page, filters)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage hotel bookings and reservations.
          </p>
        </div>
        <NewBookingWizard />
      </div>

      <Suspense fallback={<BookingsSkeleton />}>
        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            Error loading bookings: {error}
          </div>
        ) : (
          <BookingList initialBookings={data} />
        )}
      </Suspense>
    </div>
  )
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
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
