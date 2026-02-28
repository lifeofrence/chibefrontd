'use client'

import { useState } from 'react'
import { RoomType } from '@/app/admin/rooms/actions'
import { deletePhysicalRoom } from '@/app/admin/rooms/room-actions'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { PhysicalRoomForm } from './physical-room-form'

interface PhysicalRoomListProps {
    open: boolean
    setOpen: (open: boolean) => void
    roomType: RoomType
    onUpdate: () => void
}

export function PhysicalRoomList({ open, setOpen, roomType, onUpdate }: PhysicalRoomListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'default' // primary
            case 'Occupied': return 'destructive' // red
            case 'Under Maintenance': return 'warning' // yellow/orange (need to check standard variants, defaulting to warning-like style via class if needed)
            case 'Dirty': return 'secondary' // gray
            default: return 'outline'
        }
    }

    // Workaround since shadcn Badge variants are limited by default
    const getBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
        switch (status) {
            case 'Available': return 'default'
            case 'Occupied': return 'destructive'
            case 'Dirty': return 'secondary'
            default: return 'outline'
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this room?')) return
        setDeletingId(id)
        await deletePhysicalRoom(id)
        setDeletingId(null)
        onUpdate()
    }

    const rooms = roomType.rooms || []

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{roomType.name} - Rooms</DialogTitle>
                        <DialogDescription>
                            Manage physical rooms for this room type.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-between items-center my-4">
                        <div className="text-sm text-muted-foreground">
                            Total Rooms: <span className="font-medium text-foreground">{rooms.length}</span>
                        </div>
                        <Button size="sm" onClick={() => setIsAddOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Room
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Room Number</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No physical rooms added yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rooms.map((room: any) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="font-medium">{room.room_number}</TableCell>
                                            <TableCell>
                                                <Badge variant={getBadgeVariant(room.status)}>
                                                    {room.status}
                                                </Badge>
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
                                                        <DropdownMenuItem onClick={() => {
                                                            setSelectedRoom(room)
                                                            setIsEditOpen(true)
                                                        }}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(room.id)}>
                                                            {deletingId === room.id ? (
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                            )}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            <PhysicalRoomForm
                open={isAddOpen}
                setOpen={setIsAddOpen}
                roomType={roomType}
                onUpdate={onUpdate}
            />

            {selectedRoom && (
                <PhysicalRoomForm
                    key={selectedRoom.id}
                    open={isEditOpen}
                    setOpen={(open) => {
                        setIsEditOpen(open)
                        if (!open) setSelectedRoom(null)
                    }}
                    roomType={roomType}
                    room={selectedRoom}
                    onUpdate={onUpdate}
                />
            )}
        </>
    )
}
