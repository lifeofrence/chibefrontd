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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2, Tag, X } from 'lucide-react'
import { createOffer, deleteOffer } from '@/app/admin/offers/offers-actions'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { API_BASE_URL } from '@/lib/api-config'

interface OffersManagementProps {
    initialOffers: any[]
}

export function OffersManagement({ initialOffers }: OffersManagementProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [terms, setTerms] = useState<string[]>([''])
    const [offerType, setOfferType] = useState('main')
    const [badgeVariant, setBadgeVariant] = useState('default')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedFile) {
            alert('Please select an image')
            return
        }

        setLoading(true)
        const formData = new FormData()

        // Add all form fields
        const formElement = e.currentTarget
        formData.append('title', (formElement.elements.namedItem('title') as HTMLInputElement).value)
        formData.append('discount', (formElement.elements.namedItem('discount') as HTMLInputElement).value)
        formData.append('description', (formElement.elements.namedItem('description') as HTMLTextAreaElement).value)
        formData.append('valid_until', (formElement.elements.namedItem('valid_until') as HTMLInputElement).value)
        formData.append('offer_type', offerType)
        formData.append('badge_variant', badgeVariant)

        const badgeValue = (formElement.elements.namedItem('badge') as HTMLInputElement).value
        if (badgeValue) {
            formData.append('badge', badgeValue)
        }

        // Add terms as individual array items
        const filteredTerms = terms.filter(t => t.trim())
        filteredTerms.forEach((term, index) => {
            formData.append(`terms[${index}]`, term)
        })

        // Add image
        formData.append('image', selectedFile)

        const result = await createOffer(formData)
        setLoading(false)

        if (result.success) {
            setOpen(false)
            setSelectedFile(null)
            setPreview(null)
            setTerms([''])
            setOfferType('main')
            setBadgeVariant('default')
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

    function addTerm() {
        setTerms([...terms, ''])
    }

    function removeTerm(index: number) {
        setTerms(terms.filter((_, i) => i !== index))
    }

    function updateTerm(index: number, value: string) {
        const newTerms = [...terms]
        newTerms[index] = value
        setTerms(newTerms)
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this offer?')) return

        const result = await deleteOffer(id)
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
                            New Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Offer</DialogTitle>
                            <DialogDescription>
                                Add a new special offer to the website
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Offer Title</Label>
                                <Input id="title" name="title" required placeholder="e.g., Extended Stay Offer" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="discount">Discount Label</Label>
                                <Input id="discount" name="discount" required placeholder="e.g., 10% OFF or Kids Stay Free" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={3}
                                    placeholder="Describe the offer..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="valid_until">Valid Until</Label>
                                    <Input id="valid_until" name="valid_until" required placeholder="e.g., March 31, 2026" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="offer_type">Offer Type</Label>
                                    <Select value={offerType} onValueChange={setOfferType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="main">Main Offer</SelectItem>
                                            <SelectItem value="seasonal">Seasonal Offer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="badge">Badge (Optional)</Label>
                                    <Input id="badge" name="badge" placeholder="e.g., New, Popular" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="badge_variant">Badge Color</Label>
                                    <Select value={badgeVariant} onValueChange={setBadgeVariant}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            <SelectItem value="destructive">Red</SelectItem>
                                            <SelectItem value="secondary">Gray</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Terms & Conditions</Label>
                                {terms.map((term, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={term}
                                            onChange={(e) => updateTerm(index, e.target.value)}
                                            placeholder={`Term ${index + 1}`}
                                        />
                                        {terms.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeTerm(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addTerm}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Term
                                </Button>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Offer Image</Label>
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
                                    Create Offer
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Offers ({initialOffers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {initialOffers.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No offers created yet</p>
                            <p className="text-sm mt-2">Click "New Offer" to create your first offer</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {initialOffers.map((offer: any) => (
                                <Card key={offer.id} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                                            <Image
                                                src={`${API_BASE_URL}/storage/${offer.image_path}`}
                                                alt={offer.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {offer.badge && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant={offer.badge_variant as any}>{offer.badge}</Badge>
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-3 py-1 rounded-lg font-bold">
                                                {offer.discount}
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold">{offer.title}</h3>
                                                    <p className="text-sm text-muted-foreground">Valid until: {offer.valid_until}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(offer.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-muted-foreground mb-3">{offer.description}</p>
                                            {offer.terms && offer.terms.length > 0 && (
                                                <div className="text-sm">
                                                    <span className="font-semibold">Terms:</span>
                                                    <ul className="list-disc list-inside ml-2 text-muted-foreground">
                                                        {offer.terms.map((term: string, idx: number) => (
                                                            <li key={idx}>{term}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
