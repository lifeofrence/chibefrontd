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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createPhysicalRoom, updatePhysicalRoom } from '@/app/admin/rooms/room-actions'
import { Loader2 } from 'lucide-react'
import { RoomType } from '@/app/admin/rooms/actions'

interface PhysicalRoomFormProps {
    open: boolean
    setOpen: (open: boolean) => void
    roomType: RoomType
    room?: {
        id: number
        room_number: string
        status: string
        room_type_id: number
    } | null
    onUpdate: () => void
}

const STATUSES = ['Available', 'Occupied', 'Under Maintenance', 'Dirty']

export function PhysicalRoomForm({ open, setOpen, roomType, room, onUpdate }: PhysicalRoomFormProps) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<any>({})

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)
        formData.append('room_type_id', roomType.id.toString())

        // Server action
        let result
        if (room) {
            result = await updatePhysicalRoom(room.id, null, formData)
        } else {
            result = await createPhysicalRoom(null, formData)
        }

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{room ? 'Edit Room' : 'Add Physical Room'}</DialogTitle>
                    <DialogDescription>
                        {room ? `Update details for Room ${room.room_number}` : `Add a new room to ${roomType.name}`}
                    </DialogDescription>
                </DialogHeader>

                {errors.form && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                        {errors.form}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="room_number">Room Number</Label>
                        <Input
                            id="room_number"
                            name="room_number"
                            defaultValue={room?.room_number}
                            required
                            placeholder="e.g. 101"
                        />
                        {errors.room_number && <p className="text-red-500 text-sm">{errors.room_number}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={room?.status || 'Available'} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {room ? 'Update Room' : 'Add Room'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
