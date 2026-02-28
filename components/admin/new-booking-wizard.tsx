'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { checkAvailability, createBooking } from '@/app/admin/bookings/booking-actions'
import { Loader2, Calendar as CalendarIcon, BedDouble } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function NewBookingWizard() {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' })
    const [availableTypes, setAvailableTypes] = useState<any[]>([])
    const [selectedType, setSelectedType] = useState<any | null>(null)
    const [guestDetails, setGuestDetails] = useState({
        guest_name: '',
        guest_email: '',
        guest_phone: '',
        number_of_rooms: 1
    })
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const reset = () => {
        setStep(1)
        setDates({ checkIn: '', checkOut: '' })
        setAvailableTypes([])
        setSelectedType(null)
        setGuestDetails({ guest_name: '', guest_email: '', guest_phone: '', number_of_rooms: 1 })
        setError(null)
    }

    const handleCheckAvailability = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const res = await checkAvailability(dates.checkIn, dates.checkOut)
        setLoading(false)

        if (res.data) {
            setAvailableTypes(res.data)
            if (res.data.length === 0) {
                setError('No rooms available for these dates.')
            } else {
                setStep(2)
            }
        } else {
            setError(res.error || 'Failed to check availability')
        }
    }

    const handleSelectType = (type: any) => {
        setSelectedType(type)
        setStep(3)
    }

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedType) return

        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('check_in_date', dates.checkIn)
        formData.append('check_out_date', dates.checkOut)
        formData.append('room_type_id', selectedType.id)
        formData.append('number_of_rooms', guestDetails.number_of_rooms.toString())
        formData.append('guest_name', guestDetails.guest_name)
        formData.append('guest_email', guestDetails.guest_email)
        formData.append('guest_phone', guestDetails.guest_phone)

        const res = await createBooking(null, formData)
        setLoading(false)

        if (res.success) {
            setOpen(false)
            reset()
            router.refresh()
        } else {
            setError(res.message || 'Failed to create booking')
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) reset()
        }}>
            <DialogTrigger asChild>
                <Button>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    New Booking
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Booking</DialogTitle>
                    <DialogDescription>
                        Step {step} of 3
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleCheckAvailability} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Check-in Date</Label>
                                <Input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={dates.checkIn}
                                    onChange={(e) => setDates(prev => ({ ...prev, checkIn: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Check-out Date</Label>
                                <Input
                                    type="date"
                                    required
                                    min={dates.checkIn || new Date().toISOString().split('T')[0]}
                                    value={dates.checkOut}
                                    onChange={(e) => setDates(prev => ({ ...prev, checkOut: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Check Availability
                            </Button>
                        </DialogFooter>
                    </form>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                            {availableTypes.map((type) => (
                                <Card key={type.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSelectType(type)}>
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <BedDouble className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{type.name}</h3>
                                                <p className="text-sm text-muted-foreground">{type.available_rooms} rooms left</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">₦{Number(type.base_price).toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">per night</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        </DialogFooter>
                    </div>
                )}

                {step === 3 && selectedType && (
                    <form onSubmit={handleCreateBooking} className="space-y-4">
                        <div className="p-3 bg-muted rounded-md mb-4 text-sm">
                            <span className="font-semibold">{selectedType.name}</span> <br />
                            {dates.checkIn} to {dates.checkOut}
                        </div>

                        <div className="grid gap-2">
                            <Label>Number of Rooms</Label>
                            <Input
                                type="number"
                                min="1"
                                max={selectedType.available_rooms}
                                required
                                value={guestDetails.number_of_rooms}
                                onChange={(e) => setGuestDetails(prev => ({ ...prev, number_of_rooms: parseInt(e.target.value) }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Guest Name</Label>
                            <Input
                                required
                                value={guestDetails.guest_name}
                                onChange={(e) => setGuestDetails(prev => ({ ...prev, guest_name: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                required
                                value={guestDetails.guest_email}
                                onChange={(e) => setGuestDetails(prev => ({ ...prev, guest_email: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Phone</Label>
                            <Input
                                required
                                value={guestDetails.guest_phone}
                                onChange={(e) => setGuestDetails(prev => ({ ...prev, guest_phone: e.target.value }))}
                            />
                        </div>

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setStep(2)}>Back</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Booking
                            </Button>
                        </DialogFooter>
                    </form>
                )}

            </DialogContent>
        </Dialog>
    )
}
