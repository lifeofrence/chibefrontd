import { Suspense } from 'react'
import { getAnalytics } from './analytics-actions'
import { DashboardContent } from '@/components/admin/dashboard-content'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const { data, error } = await getAnalytics()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at your hotel.
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            Error loading dashboard: {error}
          </div>
        ) : (
          <DashboardContent data={data} />
        )}
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}
