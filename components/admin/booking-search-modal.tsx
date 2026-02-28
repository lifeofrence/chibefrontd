'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

export interface BookingSearchFilters {
    name?: string
    phone?: string
    booking_id?: string
    room_number?: string
    room_type?: string
    status?: string
    check_in_date?: string
    check_out_date?: string
}

interface BookingSearchModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onSearch: (filters: BookingSearchFilters) => void
    initialFilters?: BookingSearchFilters
}

export function BookingSearchModal({ open, setOpen, onSearch, initialFilters = {} }: BookingSearchModalProps) {
    const [filters, setFilters] = useState<BookingSearchFilters>(initialFilters)

    const handleSearch = () => {
        // Remove empty filters
        const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value && value.trim() !== '') {
                acc[key as keyof BookingSearchFilters] = value
            }
            return acc
        }, {} as BookingSearchFilters)

        onSearch(cleanedFilters)
        setOpen(false)
    }

    const handleClear = () => {
        setFilters({})
        onSearch({})
        setOpen(false)
    }

    const updateFilter = (key: keyof BookingSearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const activeFilterCount = Object.values(filters).filter(v => v && v.trim() !== '').length

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Advanced Booking Search</DialogTitle>
                    <DialogDescription>
                        Search bookings by multiple criteria. All fields are optional.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Guest Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">Guest Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Guest Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., John Doe"
                                    value={filters.name || ''}
                                    onChange={(e) => updateFilter('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="e.g., +1234567890"
                                    value={filters.phone || ''}
                                    onChange={(e) => updateFilter('phone', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Booking Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">Booking Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="booking_id">Booking ID</Label>
                                <Input
                                    id="booking_id"
                                    placeholder="e.g., NLA123 or 123"
                                    value={filters.booking_id || ''}
                                    onChange={(e) => updateFilter('booking_id', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={filters.status || ''}
                                    onValueChange={(value) => updateFilter('status', value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="checked_in">Checked In</SelectItem>
                                        <SelectItem value="checked_out">Checked Out</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Room Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">Room Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_number">Room Number</Label>
                                <Input
                                    id="room_number"
                                    placeholder="e.g., 101"
                                    value={filters.room_number || ''}
                                    onChange={(e) => updateFilter('room_number', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room_type">Room Type</Label>
                                <Input
                                    id="room_type"
                                    placeholder="e.g., Deluxe Suite"
                                    value={filters.room_type || ''}
                                    onChange={(e) => updateFilter('room_type', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">Date Filters</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="check_in_date">Check-in Date</Label>
                                <Input
                                    id="check_in_date"
                                    type="date"
                                    value={filters.check_in_date || ''}
                                    onChange={(e) => updateFilter('check_in_date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="check_out_date">Check-out Date</Label>
                                <Input
                                    id="check_out_date"
                                    type="date"
                                    value={filters.check_out_date || ''}
                                    onChange={(e) => updateFilter('check_out_date', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {activeFilterCount > 0 && (
                            <span>{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleClear}>
                            <X className="mr-2 h-4 w-4" />
                            Clear All
                        </Button>
                        <Button onClick={handleSearch}>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
