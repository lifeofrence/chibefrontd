'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { createGalleryImage, deleteGalleryImage } from '@/app/admin/gallery/gallery-actions'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { API_BASE_URL } from '@/lib/api-config'

const CATEGORIES = [
    { value: 'rooms', label: 'Rooms & Suites' },
    { value: 'dining', label: 'Dining' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'events', label: 'Events' },
    { value: 'exterior', label: 'Exterior' },
]

interface GalleryManagementProps {
    initialImages: any[]
}

export function GalleryManagement({ initialImages }: GalleryManagementProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedFile) return

        setLoading(true)
        const formData = new FormData(e.currentTarget)
        formData.append('image', selectedFile)

        const result = await createGalleryImage(formData)
        setLoading(false)

        if (result.success) {
            setOpen(false)
            setSelectedFile(null)
            setPreview(null)
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this image?')) return

        const result = await deleteGalleryImage(id)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.message)
        }
    }

    return (
        <>
            <div className="flex justify-end mb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Images
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Gallery Image</DialogTitle>
                            <DialogDescription>
                                Add a new image to the gallery
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Image Title</Label>
                                <Input id="title" name="title" required placeholder="e.g., Hotel Exterior" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image File</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/webp"
                                    onChange={handleFileChange}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Max size: 5MB. Formats: JPG, PNG, WEBP
                                </p>
                            </div>

                            {preview && (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading || !selectedFile}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Upload
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gallery Images ({initialImages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {initialImages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No images uploaded yet</p>
                            <p className="text-sm mt-2">Click "Upload Images" to add your first image</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {initialImages.map((image: any) => (
                                <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden border">
                                    <Image
                                        src={`${API_BASE_URL}/storage/${image.image_path}`}
                                        alt={image.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <p className="text-white font-medium text-sm text-center px-2">{image.title}</p>
                                        <span className="text-white/80 text-xs">{image.category}</span>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(image.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
