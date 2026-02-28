'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Booking, updateBooking } from '@/app/admin/bookings/booking-actions'
import { getRoomTypes } from '@/app/admin/rooms/actions'
import { Loader2 } from 'lucide-react'

interface BookingFormProps {
    open: boolean
    setOpen: (open: boolean) => void
    booking: Booking
    onUpdate: () => void
}

const STATUSES = ['pending', 'confirmed', 'cancelled']

export function BookingForm({ open, setOpen, booking, onUpdate }: BookingFormProps) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})
    const [availableRooms, setAvailableRooms] = useState<any[]>([])
    const [loadingRooms, setLoadingRooms] = useState(false)
    const [roomTypes, setRoomTypes] = useState<any[]>([])
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number>(booking.room_type_id)

    useEffect(() => {
        if (open) {
            loadRoomTypesAndRooms()
        }
    }, [open])

    useEffect(() => {
        if (open && selectedRoomTypeId) {
            loadAvailableRooms(selectedRoomTypeId)
        }
    }, [selectedRoomTypeId])

    async function loadRoomTypesAndRooms() {
        setLoadingRooms(true)
        const result = await getRoomTypes()
        if (result.data && Array.isArray(result.data)) {
            setRoomTypes(result.data)
            // Load rooms for the current room type
            loadAvailableRooms(selectedRoomTypeId)
        }
        setLoadingRooms(false)
    }

    async function loadAvailableRooms(roomTypeId: number) {
        setLoadingRooms(true)
        const result = await getRoomTypes()
        if (result.data && Array.isArray(result.data)) {
            // Find the selected room type
            const roomType = result.data.find((rt: any) => rt.id === roomTypeId)
            if (roomType && roomType.rooms) {
                // Filter for available rooms or the currently assigned room (if same room type)
                const rooms = roomType.rooms.filter((room: any) =>
                    room.status === 'Available' ||
                    (room.id === booking.room_id && roomTypeId === booking.room_type_id)
                )
                setAvailableRooms(rooms)
            } else {
                setAvailableRooms([])
            }
        }
        setLoadingRooms(false)
    }

    function handleRoomTypeChange(value: string) {
        const newRoomTypeId = parseInt(value)
        setSelectedRoomTypeId(newRoomTypeId)
        // Clear room selection when room type changes
        setAvailableRooms([])
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)

        // Server action
        const result = await updateBooking(booking.id, null, formData)

        setLoading(false)

        if (result.success) {
            setOpen(false)
            onUpdate()
        } else {
            if (result.errors) {
                setErrors(result.errors)
            } else {
                setErrors({ form: result.message })
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Booking NLA{booking.id}</DialogTitle>
                    <DialogDescription>
                        Update booking details/status and assign room.
                    </DialogDescription>
                </DialogHeader>

                {errors.form && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="guest_name">Guest Name</Label>
                        <Input
                            id="guest_name"
                            name="guest_name"
                            defaultValue={booking.guest_name}
                            required
                        />
                        {errors.guest_name && <p className="text-red-500 text-sm">{errors.guest_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="guest_email">Email</Label>
                            <Input
                                id="guest_email"
                                name="guest_email"
                                type="email"
                                defaultValue={booking.guest_email}
                                required
                            />
                            {errors.guest_email && <p className="text-red-500 text-sm">{errors.guest_email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="guest_phone">Phone</Label>
                            <Input
                                id="guest_phone"
                                name="guest_phone"
                                defaultValue={booking.guest_phone}
                                required
                            />
                            {errors.guest_phone && <p className="text-red-500 text-sm">{errors.guest_phone}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={booking.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Note: Cancelling a booking will automatically free up the assigned room.
                        </p>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="room_type_id">Room Type</Label>
                        <Select
                            name="room_type_id"
                            value={selectedRoomTypeId.toString()}
                            onValueChange={handleRoomTypeChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                                {roomTypes.map((roomType) => (
                                    <SelectItem key={roomType.id} value={roomType.id.toString()}>
                                        {roomType.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Changing room type will reset the assigned room selection.
                        </p>
                        {errors.room_type_id && <p className="text-red-500 text-sm">{errors.room_type_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="room_id">Assigned Room</Label>
                        {loadingRooms ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading rooms...
                            </div>
                        ) : (
                            <>
                                <Select name="room_id" defaultValue={booking.room_id?.toString() || 'none'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Room Assigned</SelectItem>
                                        {availableRooms.map((room) => (
                                            <SelectItem key={room.id} value={room.id.toString()}>
                                                Room {room.room_number} - {room.status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {availableRooms.length} available room{availableRooms.length !== 1 ? 's' : ''} for selected room type
                                </p>
                            </>
                        )}
                        {errors.room_id && <p className="text-red-500 text-sm">{errors.room_id}</p>}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
