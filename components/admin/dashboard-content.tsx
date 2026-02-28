'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    DollarSign,
    Calendar,
    Bed,
    Users,
    TrendingUp,
    Plus,
    Eye,
    Home,
    Loader2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { updateRoomStatus } from "@/app/admin/room-actions"

interface DashboardContentProps {
    data: any
}

export function DashboardContent({ data }: DashboardContentProps) {
    const router = useRouter()
    const [selectedRoom, setSelectedRoom] = useState<any>(null)
    const [newStatus, setNewStatus] = useState('')
    const [loading, setLoading] = useState(false)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const getRoomStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'bg-green-500'
            case 'occupied':
                return 'bg-red-500'
            case 'under maintenance':
            case 'dirty':
                return 'bg-yellow-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getBookingStatusVariant = (status: string): "default" | "destructive" | "secondary" | undefined => {
        switch (status) {
            case 'confirmed': return 'default'
            case 'cancelled': return 'destructive'
            case 'pending': return 'secondary'
            default: return 'secondary'
        }
    }

    const handleRoomClick = (room: any) => {
        setSelectedRoom(room)
        setNewStatus(room.status)
    }

    const handleStatusUpdate = async () => {
        if (!selectedRoom || !newStatus) return

        setLoading(true)

        const result = await updateRoomStatus(selectedRoom.id, newStatus)

        if (result.success) {
            setSelectedRoom(null)
            router.refresh()
        } else {
            alert(result.message)
        }

        setLoading(false)
    }

    return (
        <>
            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                                <p className="text-2xl font-bold">{data.stats?.total_bookings ?? data.total_bookings ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
                                <p className="text-2xl font-bold">{data.stats?.total_rooms ?? data.total_rooms ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-slate-100 text-slate-600">
                                <Home className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Available</p>
                                <p className="text-2xl font-bold">{data.room_statuses?.Available ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-green-100 text-green-600">
                                <Bed className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                                <p className="text-2xl font-bold">{data.stats?.total_pending ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                                <Loader2 className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Reserved</p>
                                <p className="text-2xl font-bold">{data.stats?.total_confirmed ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Occupied</p>
                                <p className="text-2xl font-bold">{data.room_statuses?.Occupied ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                <Bed className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Dirty/Maintenance</p>
                                <p className="text-2xl font-bold">
                                    {(data.room_statuses?.['Under Maintenance'] || 0) + (data.room_statuses?.Dirty || 0)}
                                </p>
                            </div>
                            <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Cancelled</p>
                                <p className="text-2xl font-bold">{data.stats?.total_cancelled ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card> */}

                {/* <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Checkouts</p>
                                <p className="text-2xl font-bold">{data.stats?.total_checkout ?? 0}</p>
                            </div>
                            <div className="p-2 rounded-full bg-green-100 text-green-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>

            {/* Revenue and Occupancy Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Revenue</p>
                                <p className="text-2xl font-bold break-words">{formatCurrency(Number(data.total_revenue || 0))}</p>
                            </div>
                            <div className="p-2 rounded-full bg-green-100 text-green-600 flex-shrink-0 ml-2">
                                <div className="h-5 w-5 font-bold text-lg flex items-center justify-center">₦</div>
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">All time earnings</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                                <p className="text-2xl font-bold">{data.occupancy_rate_percent || 0}%</p>
                            </div>
                            <div className="p-2 rounded-full bg-cyan-100 text-cyan-600">
                                <Bed className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <span className="text-sm text-muted-foreground">
                                {data.occupied_rooms || 0} occupied
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* All Rooms Status Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>All Rooms Status</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Real-time room availability overview
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                        {data.all_rooms?.map((room: any) => (
                            <div
                                key={room.id}
                                className="relative group"
                            >
                                <div
                                    className={`${getRoomStatusColor(room.status)} w-full aspect-square rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-lg hover:opacity-90 hover:scale-105 transition-all cursor-pointer p-2 overflow-hidden`}
                                    title={`Click to update Room ${room.room_number} status`}
                                    onClick={() => handleRoomClick(room)}
                                >
                                    <Home className="h-6 w-6 mb-1 opacity-80" />
                                    <span className="break-all text-center leading-tight text-base" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                        {room.room_number}
                                    </span>
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                                    <div className="font-semibold">{room.room_type?.name || 'N/A'}</div>
                                    <div className="text-gray-300">{room.status}</div>
                                    <div className="text-gray-400 text-[10px] mt-1">Click to update</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-muted-foreground">
                                Available ({data.room_statuses?.Available || 0})
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span className="text-sm text-muted-foreground">
                                Occupied ({data.room_statuses?.Occupied || 0})
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                            <span className="text-sm text-muted-foreground">
                                Maintenance/Dirty ({(data.room_statuses?.['Under Maintenance'] || 0) + (data.room_statuses?.Dirty || 0)})
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle>Recent Bookings</CardTitle>
                        <Link href="/admin/bookings">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.recent_bookings?.length > 0 ? (
                                data.recent_bookings.map((booking: any) => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">{booking.guest_name}</p>
                                                <Badge variant={getBookingStatusVariant(booking.status)} className="text-xs">
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {booking.room_type?.name || 'N/A'}
                                                {booking.room && ` - Room ${booking.room.room_number}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(Number(booking.amount))}</p>
                                            <p className="text-xs text-muted-foreground">NLA{booking.id}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No recent bookings</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/bookings">
                                <Button className="h-20 w-full flex flex-col gap-2">
                                    <Calendar className="h-6 w-6" />
                                    <span>New Booking</span>
                                </Button>
                            </Link>
                            <Link href="/admin/rooms">
                                <Button variant="outline" className="h-20 w-full flex flex-col gap-2">
                                    <Bed className="h-6 w-6" />
                                    <span>Manage Rooms</span>
                                </Button>
                            </Link>
                            <Link href="/admin/bookings">
                                <Button variant="outline" className="h-20 w-full flex flex-col gap-2">
                                    <Users className="h-6 w-6" />
                                    <span>View Bookings</span>
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="h-20 w-full flex flex-col gap-2">
                                    <Eye className="h-6 w-6" />
                                    <span>View Site</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Room Type Bookings */}
            <Card>
                <CardHeader>
                    <CardTitle>Room Type Bookings</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Current bookings by room type
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.room_type_bookings?.map((roomType: any) => (
                            <div key={roomType.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">{roomType.name}</p>
                                    <p className="text-sm text-muted-foreground">{roomType.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">{roomType.bookings_count || 0}</p>
                                        <p className="text-sm text-muted-foreground">Active Bookings</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold">{formatCurrency(Number(roomType.base_price))}</p>
                                        <p className="text-sm text-muted-foreground">per night</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Room Status Update Dialog */}
            <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Room Status</DialogTitle>
                        <DialogDescription>
                            Change the status of Room {selectedRoom?.room_number}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Room Number</Label>
                            <p className="text-2xl font-bold">{selectedRoom?.room_number}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Room Type</Label>
                            <p className="text-sm text-muted-foreground">{selectedRoom?.room_type?.name || 'N/A'}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Available">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            Available
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Occupied">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            Occupied
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Under Maintenance">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            Under Maintenance
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Dirty">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            Dirty
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRoom(null)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleStatusUpdate} disabled={loading || newStatus === selectedRoom?.status}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
