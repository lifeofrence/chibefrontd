'use client'

import { useState, useEffect } from 'react'
import { Booking, cancelBooking, getBooking, checkOutBooking, confirmBooking, updateBookingStatus } from '@/app/admin/bookings/booking-actions'
import { BookingForm } from './booking-form'
import { BookingDetailsDialog } from './booking-details-dialog'
import { BookingSearchModal, BookingSearchFilters } from './booking-search-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, LogOut, Loader2, Search, Check, X, Mail, Filter, ChevronDown } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface BookingListProps {
    initialBookings: {
        data: Booking[],
        current_page: number,
        last_page: number,
        total: number
    } // Matches Laravel pagination structure usually, but we need to check if 'data' is the wrapper or the array. 
    // The server action returns { data: { ...pagination } }
}

export function BookingList({ initialBookings }: BookingListProps) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings.data)

    useEffect(() => {
        setBookings(initialBookings.data)
    }, [initialBookings.data])

    // Pagination state can be added here if needed, for now just displaying initial page

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEmailOpen, setIsEmailOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [emailSubject, setEmailSubject] = useState('')
    const [emailMessage, setEmailMessage] = useState('')
    const [sendingEmail, setSendingEmail] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // Get current filters from URL
    const getCurrentFilters = (): BookingSearchFilters => {
        return {
            name: searchParams.get('name') || undefined,
            phone: searchParams.get('phone') || undefined,
            booking_id: searchParams.get('booking_id') || undefined,
            room_number: searchParams.get('room_number') || undefined,
            room_type: searchParams.get('room_type') || undefined,
            status: searchParams.get('status') || undefined,
            check_in_date: searchParams.get('check_in_date') || undefined,
            check_out_date: searchParams.get('check_out_date') || undefined,
        }
    }

    const activeFilters = getCurrentFilters()
    const activeFilterCount = Object.values(activeFilters).filter(v => v && v.trim() !== '').length

    const handleSearch = (filters: BookingSearchFilters) => {
        const params = new URLSearchParams()

        // Add all non-empty filters to URL params
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                params.set(key, value)
            }
        })

        params.set('page', '1')
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handleClearAllFilters = () => {
        router.replace(pathname)
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.replace(`${pathname}?${params.toString()}`)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const calculateNights = (checkIn: string, checkOut: string) => {
        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'confirmed': return 'default'
            case 'pending': return 'warning'
            case 'cancelled': return 'destructive'
            default: return 'secondary'
        }
    }

    const handleEmail = (booking: Booking) => {
        setSelectedBooking(booking)
        setEmailSubject(`Regarding your booking NLA${booking.id}`)
        setEmailMessage(`Dear ${booking.guest_name},\n\n`)
        setIsEmailOpen(true)
    }

    const handleSendEmail = async () => {
        if (!selectedBooking || !emailSubject || !emailMessage) {
            alert('Please fill in all email fields')
            return
        }

        setSendingEmail(true)

        const { sendEmailToGuest } = await import('@/app/admin/bookings/booking-actions')
        const result = await sendEmailToGuest(selectedBooking.id, emailSubject, emailMessage)

        setSendingEmail(false)

        if (result.success) {
            alert('Email sent successfully!')
            setIsEmailOpen(false)
            setEmailSubject('')
            setEmailMessage('')
        } else {
            alert(result.message || 'Failed to send email')
        }
    }

    // Need to fix badge variant types 
    const getBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" | null | undefined => {
        switch (status) {
            case 'confirmed': return 'default' // green
            case 'cancelled': return 'destructive' // red
            case 'pending': return 'secondary' // yellow
            case 'checked_out': return 'outline' // blue
            default: return 'outline'
        }
    }

    const getBadgeClassName = (status: string): string => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-300'
            case 'checked_out': return 'bg-blue-100 text-blue-800 border-blue-300'
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
            default: return ''
        }
    }


    const handleEdit = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsEditOpen(true)
    }

    const handleView = async (booking: Booking) => {
        setLoadingId(booking.id)
        const { data } = await getBooking(booking.id)
        setLoadingId(null)

        if (data) {
            setSelectedBooking(data)
            setIsViewOpen(true)
        }
    }

    async function handleCancel(id: number) {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        setLoadingId(id)
        const result = await cancelBooking(id)
        setLoadingId(null)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    async function handleCheckOut(id: number) {
        if (!confirm('Check out this guest? This will mark the booking as checked-out and make the room available.')) return
        setLoadingId(id)
        const result = await checkOutBooking(id)
        setLoadingId(null)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    async function handleConfirm(id: number) {
        if (!confirm('Confirm this booking? This will change the status from pending to confirmed.')) return
        setLoadingId(id)
        const result = await confirmBooking(id)
        setLoadingId(null)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    async function handleStatusChange(id: number, newStatus: string) {
        setLoadingId(id)
        const result = await updateBookingStatus(id, newStatus)
        setLoadingId(null)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    const refreshList = () => {
        router.refresh()
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                    <Button
                        onClick={() => setIsSearchOpen(true)}
                        variant="outline"
                        className="gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Advanced Search
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAllFilters}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <div className="text-sm text-muted-foreground">
                        {Object.entries(activeFilters).map(([key, value]) =>
                            value ? (
                                <span key={key} className="inline-flex items-center gap-1 mr-2">
                                    <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                                </span>
                            ) : null
                        )}
                    </div>
                )}
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Check-in / Out</TableHead>
                            <TableHead>Nights</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">NLA{booking.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{booking.guest_name}</span>
                                            <span className="text-xs text-muted-foreground">{booking.guest_email}</span>
                                            <span className="text-xs text-muted-foreground">{booking.guest_phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {booking.room?.room_number ? (
                                            <Badge variant="outline">Room {booking.room.room_number}</Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Unassigned</span>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1">{booking.room_type?.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>In: {formatDate(booking.check_in_date)}</div>
                                            <div>Out: {formatDate(booking.check_out_date)}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">
                                            {calculateNights(booking.check_in_date, booking.check_out_date)} night{calculateNights(booking.check_in_date, booking.check_out_date) !== 1 ? 's' : ''}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-auto p-0 hover:bg-transparent"
                                                    disabled={loadingId === booking.id}
                                                >
                                                    <Badge
                                                        variant={getBadgeVariant(booking.status)}
                                                        className={`cursor-pointer hover:opacity-80 ${getBadgeClassName(booking.status)}`}
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(booking.id, 'pending')}
                                                    disabled={booking.status === 'pending'}
                                                >
                                                    Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                    disabled={booking.status === 'confirmed'}
                                                >
                                                    Confirmed
                                                </DropdownMenuItem>
                                                {/* <DropdownMenuItem
                                                    onClick={() => handleStatusChange(booking.id, 'checked_in')}
                                                    disabled={booking.status === 'checked_in'}
                                                >
                                                    Checked In
                                                </DropdownMenuItem> */}
                                                <DropdownMenuItem
                                                    onClick={() => handleCheckOut(booking.id)}
                                                    disabled={booking.status === 'checked_out'}
                                                >
                                                    Checked Out
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                    disabled={booking.status === 'cancelled'}
                                                    className="text-red-600"
                                                >
                                                    Cancelled
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleView(booking)}>
                                                    <Search className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => handleEmail(booking)}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Email
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => handleEdit(booking)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Details
                                                </DropdownMenuItem>

                                                {booking.status === 'pending' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() => handleConfirm(booking.id)}
                                                            className="text-green-600"
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />
                                                            Confirm Booking
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}

                                                {booking.status === 'confirmed' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() => handleCheckOut(booking.id)}
                                                            className="text-blue-600"
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />
                                                            Check Out
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}

                                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="text-red-600"
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Cancel Booking
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {bookings.length} of {initialBookings.total} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(initialBookings.current_page - 1)}
                        disabled={initialBookings.current_page <= 1}
                    >
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {initialBookings.current_page} of {initialBookings.last_page}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(initialBookings.current_page + 1)}
                        disabled={initialBookings.current_page >= initialBookings.last_page}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {selectedBooking && (
                <BookingForm
                    open={isEditOpen}
                    setOpen={setIsEditOpen}
                    booking={selectedBooking}
                    onUpdate={refreshList}
                />
            )}

            {selectedBooking && (
                <BookingDetailsDialog
                    open={isViewOpen}
                    setOpen={setIsViewOpen}
                    booking={selectedBooking}
                />
            )}

            {/* Email Dialog */}
            <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Send Email to Guest</DialogTitle>
                        <DialogDescription>
                            Send an email to {selectedBooking?.guest_name} ({selectedBooking?.guest_email})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                placeholder="Email subject"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                placeholder="Email message..."
                                rows={10}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEmailOpen(false)} disabled={sendingEmail}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendEmail} disabled={sendingEmail || !emailSubject || !emailMessage}>
                            {sendingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Search Modal */}
            <BookingSearchModal
                open={isSearchOpen}
                setOpen={setIsSearchOpen}
                onSearch={handleSearch}
                initialFilters={activeFilters}
            />
        </>
    )
}
