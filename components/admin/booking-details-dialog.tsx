'use client'

import { Booking } from '@/app/admin/bookings/booking-actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface BookingDetailsDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    booking: Booking
}

export function BookingDetailsDialog({ open, setOpen, booking }: BookingDetailsDialogProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount)
    }

    const getBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" | null | undefined => {
        switch (status) {
            case 'confirmed': return 'default'
            case 'cancelled': return 'destructive'
            case 'pending': return 'secondary'
            default: return 'outline'
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Booking Details NLA{booking.id}</DialogTitle>
                    <DialogDescription>
                        Complete booking information
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Status</h3>
                        <Badge variant={getBadgeVariant(booking.status)} className="text-sm">
                            {booking.status.toUpperCase()}
                        </Badge>
                    </div>

                    {/* Guest Information */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Guest Information</h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Name:</span>
                                <span className="text-sm font-medium">{booking.guest_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Email:</span>
                                <span className="text-sm font-medium">{booking.guest_email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Phone:</span>
                                <span className="text-sm font-medium">{booking.guest_phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Room Information */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Room Information</h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Room Type:</span>
                                <span className="text-sm font-medium">{booking.room_type?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Room Number:</span>
                                <span className="text-sm font-medium">
                                    {booking.room?.room_number || 'Not Assigned'}
                                </span>
                            </div>
                            {booking.room && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Room Status:</span>
                                    <Badge variant="outline" className="text-xs">
                                        {booking.room.status}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Dates */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Booking Dates</h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Check-in:</span>
                                <span className="text-sm font-medium">{formatDate(booking.check_in_date)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Check-out:</span>
                                <span className="text-sm font-medium">{formatDate(booking.check_out_date)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Payment</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Amount:</span>
                                <span className="text-lg font-bold text-primary">
                                    {formatCurrency(Number(booking.amount))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
