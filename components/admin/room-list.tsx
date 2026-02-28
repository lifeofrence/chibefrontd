'use client'

import { useState } from 'react'
import { RoomType, getRoomType } from '@/app/admin/rooms/actions'
import { RoomForm } from './room-form'
import { PhysicalRoomList } from './physical-room-list'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, MoreHorizontal, Loader2, Building2, Image } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface RoomListProps {
    rooms: RoomType[]
}

export function RoomList({ rooms }: RoomListProps) {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isManageRoomsOpen, setIsManageRoomsOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null)
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const handleEdit = async (room: RoomType) => {
        setLoadingId(room.id)
        const { data, error } = await getRoomType(room.id)
        setLoadingId(null)

        if (data) {
            setSelectedRoom(data)
            setIsEditOpen(true)
        } else {
            setSelectedRoom(room)
            setIsEditOpen(true)
            console.error(error)
        }
    }

    const handleManageRooms = async (room: RoomType) => {
        setLoadingId(room.id)
        const { data, error } = await getRoomType(room.id)
        setLoadingId(null)

        if (data) {
            setSelectedRoom(data)
            setIsManageRoomsOpen(true)
        } else {
            console.error(error)
            setSelectedRoom(room)
            setIsManageRoomsOpen(true)
        }
    }

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(parseFloat(price))
    }

    const refreshRoom = async () => {
        if (!selectedRoom) return
        const { data } = await getRoomType(selectedRoom.id)
        if (data) {
            setSelectedRoom(data)
        }
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room Type
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Base Price</TableHead>
                            <TableHead>Total Rooms</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Amenities</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No room types found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rooms.map((room) => {
                                const totalRooms = room.rooms?.length || 0
                                const availableRooms = room.rooms?.filter(r => r.status === 'Available').length || 0

                                return (
                                    <TableRow key={room.id}>
                                        <TableCell className="font-medium">{room.name}</TableCell>
                                        <TableCell>{formatPrice(room.base_price)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{totalRooms}</span>
                                                <span className="text-xs text-muted-foreground">rooms</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${availableRooms > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {availableRooms}
                                                </span>
                                                <span className="text-xs text-muted-foreground">free</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {room.amenities && Array.isArray(room.amenities) && room.amenities.slice(0, 3).map((a, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">{a}</Badge>
                                                ))}
                                                {room.amenities && Array.isArray(room.amenities) && room.amenities.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">+{room.amenities.length - 3}</Badge>
                                                )}
                                            </div>
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
                                                    <DropdownMenuItem onClick={() => handleManageRooms(room)}>
                                                        {loadingId === room.id ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Building2 className="mr-2 h-4 w-4" />
                                                        )}
                                                        Manage Physical Rooms
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEdit(room)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <RoomForm
                open={isAddOpen}
                setOpen={setIsAddOpen}
            />

            {selectedRoom && (
                <RoomForm
                    key={selectedRoom.id}
                    open={isEditOpen}
                    setOpen={(open) => {
                        setIsEditOpen(open)
                        if (!open) setSelectedRoom(null)
                    }}
                    room={selectedRoom}
                />
            )}

            {selectedRoom && (
                <PhysicalRoomList
                    key={`physical-${selectedRoom.id}`}
                    open={isManageRoomsOpen}
                    setOpen={(open) => {
                        setIsManageRoomsOpen(open)
                        if (!open) setSelectedRoom(null)
                    }}
                    roomType={selectedRoom}
                    onUpdate={refreshRoom}
                />
            )}
        </>
    )
}
