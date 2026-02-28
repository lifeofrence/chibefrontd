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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createRoomType, updateRoomType, RoomType } from '@/app/admin/rooms/actions'
import { Loader2 } from 'lucide-react'

// Common amenities
const COMMON_AMENITIES = [
    'King Bed',
    'Queen Bed',
    'Twin Bed',
    'Free Wi-Fi',
    'Air Conditioning',
    'TV',
    'Intercom',
    'Room Service',
    'Mini Bar',
    'Jacuzzi',
    'Sea View',
    'Separate Living Area',
    'Complimentary Breakfast',
]

interface RoomFormProps {
    open: boolean
    setOpen: (open: boolean) => void
    room?: RoomType | null
}

export function RoomForm({ open, setOpen, room }: RoomFormProps) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)

        // Server action
        let result
        if (room) {
            result = await updateRoomType(room.id, null, formData)
        } else {
            result = await createRoomType(null, formData)
        }

        setLoading(false)

        if (result.success) {
            setOpen(false)
        } else {
            if (result.errors) {
                setErrors(result.errors)
            } else {
                setErrors({ form: result.message })
            }
        }
    }

    // Helper to check if amenity is selected for editing
    const hasAmenity = (amenity: string) => {
        return room?.amenities?.includes(amenity)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{room ? 'Edit Room Type' : 'Add New Room Type'}</DialogTitle>
                    <DialogDescription>
                        {room ? 'Update the details of this room type.' : 'Create a new room type for your hotel.'}
                    </DialogDescription>
                </DialogHeader>

                {errors.form && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={room?.name}
                            required
                            placeholder="e.g. Deluxe Suite"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="base_price">Base Price (₦)</Label>
                        <Input
                            id="base_price"
                            name="base_price"
                            type="number"
                            step="0.01"
                            defaultValue={room?.base_price}
                            required
                            placeholder="0.00"
                        />
                        {errors.base_price && <p className="text-red-500 text-sm">{errors.base_price}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={room?.description}
                            placeholder="Describe the room..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Amenities</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {COMMON_AMENITIES.map((amenity) => (
                                <div key={amenity} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`amenity-${amenity}`}
                                        name="amenities"
                                        value={amenity}
                                        defaultChecked={hasAmenity(amenity)}
                                    />
                                    <Label htmlFor={`amenity-${amenity}`} className="font-normal text-sm cursor-pointer">
                                        {amenity}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {room ? 'Update Room Type' : 'Create Room Type'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
