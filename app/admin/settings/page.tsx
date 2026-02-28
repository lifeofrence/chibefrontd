import { Suspense } from 'react'
import { getSettings } from './settings-actions'
import { SettingsManagement } from '@/components/admin/settings-management'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
    const { data, error } = await getSettings()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your hotel and system settings
                </p>
            </div>

            <Suspense fallback={<SettingsSkeleton />}>
                {error ? (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                        Error loading settings: {error}
                    </div>
                ) : (
                    <SettingsManagement initialSettings={data || {}} />
                )}
            </Suspense>
        </div>
    )
}

function SettingsSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
            ))}
        </div>
    )
}
