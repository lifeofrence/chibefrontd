'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Loader2, Calendar, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Event {
    id: number
    title: string
    description: string
    day: string
    month: string
}

interface EventManagementProps {
    initialEvents: Event[]
}

export function EventManagement({ initialEvents }: EventManagementProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formElement = e.currentTarget
        const data = {
            title: (formElement.elements.namedItem('title') as HTMLInputElement).value,
            description: (formElement.elements.namedItem('description') as HTMLTextAreaElement).value,
            day: (formElement.elements.namedItem('day') as HTMLInputElement).value,
            month: (formElement.elements.namedItem('month') as HTMLInputElement).value,
        }

        try {
            const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : '/api/admin/events'
            const method = editingEvent ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Failed to save event')

            setOpen(false)
            setEditingEvent(null)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to save event')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this event?')) return

        try {
            const response = await fetch(`/api/admin/events/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Failed to delete event')

            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Failed to delete event')
        }
    }

    function handleEdit(event: Event) {
        setEditingEvent(event)
        setOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Events Management</h2>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val)
                    if (!val) setEditingEvent(null)
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                            <DialogDescription>
                                Add a new upcoming event to the website
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Event Title</Label>
                                <Input id="title" name="title" required defaultValue={editingEvent?.title} placeholder="e.g., African Night" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="day">Day</Label>
                                    <Input id="day" name="day" required defaultValue={editingEvent?.day} placeholder="e.g., 28 or TBA" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="month">Month</Label>
                                    <Input id="month" name="month" defaultValue={editingEvent?.month} placeholder="e.g., Mar" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    defaultValue={editingEvent?.description}
                                    placeholder="Describe the event..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Events ({initialEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {initialEvents.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No events scheduled yet</p>
                            <p className="text-sm mt-2">Click "New Event" to add your first event</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {initialEvents.map((event) => (
                                <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-primary text-primary-foreground rounded-md">
                                        <span className="text-xl font-bold">{event.day}</span>
                                        <span className="text-[10px] uppercase font-bold">{event.month}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(event)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
