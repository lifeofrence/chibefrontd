"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Star, ChevronLeft, ChevronRight, Bed, Maximize, Check } from "lucide-react"
import { Wifi, Car, Coffee, Tv, Bath, Wind} from "lucide-react"


// Mock room data (in a real app, this would come from an API)
const roomsData = {
  1 : {
    id: 1,
    name: "Classic Room",
    type: "standard",
    price: 80000,
    originalPrice: 85000,
    image: "/classicOne.jpg",
    gallery: [
      "/classicTwo.jpg",
      "/classicThree.jpg",
      "/classicFour.jpg",
    ],
    size: "35 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description:
      "Elegantly appointed room featuring modern amenities and stunning city views. Perfect for business travelers and couples seeking comfort and luxury.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '55" Smart TV' },
      { icon: Coffee, name: "Coffee Machine" },
      { icon: Bath, name: "Marble Bathroom" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: ["City View", "Work Desk", "Mini Bar", "Safe", "24/7 Room Service", "Daily Housekeeping"],
    rating: 4.8,
    reviews: 124,
    available: true,
  },
  2: {
    id: 2,
    name: "Superior Suite",
    type: "deluxe",
    price: 98400,
    originalPrice: 120000,
    image: "/superiorOne.jpg",
    gallery: [
      "/superiorTwo.jpg",
      "/superiorThree.jpg",
      "/superiorFour.jpg",
    ],
    size: "65 sqm",
    occupancy: 3,
    bedType: "King Size Bed + Sofa Bed",
    description:
      "Spacious suite with separate living area, perfect for extended stays and business meetings. Includes complimentary breakfast and premium amenities.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '65" Smart TV' },
      { icon: Coffee, name: "Espresso Machine" },
      { icon: Bath, name: "Spa Bathroom" },
      { icon: Wind, name: "Climate Control" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Premium View",
      "Separate Living Area",
      "Dining Table",
      "Butler Service",
      "Complimentary Breakfast",
      "Executive Lounge Access",
    ],
    rating: 4.9,
    reviews: 89,
    available: true,
  },
  3: {
    id: 3,
    name: "Business Suite",
    type: "business",
    price: 121700,
    originalPrice: 130000,
    image: "/businessOne.jpg",
    gallery: [
      "/businessTwo.jpg",
      "/businessThree.jpg",
      "/businessFour.jpg",
    ],
    size: "120 sqm",
    occupancy: 4,
    bedType: "King Size Bed",
    description:
      "The pinnacle of luxury accommodation featuring multiple bedrooms, private terrace, and personalized service. Ideal for VIPs and special occasions.",
    amenities: [
      { icon: Wifi, name: "Premium Wi-Fi" },
      { icon: Tv, name: "Multiple Smart TVs" },
      { icon: Coffee, name: "Full Kitchen" },
      { icon: Bath, name: "Master Bathroom" },
      { icon: Wind, name: "Smart Climate" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Private Terrace",
      "Multiple Bedrooms",
      "Chef",
      "Valet Parking",
      "24/7 Butler Service",
    ],
    rating: 5.0,
    reviews: 45,
    available: false,
  },
  4:{
    id: 4,
    name: "Executive Suite",
    type: "suite",
    price: 134700,
    originalPrice: 150000,
    image: "/executiveOne.jpg",
    gallery: [
      "/executiveTwo.jpg",
      "/executiveThree.jpg",
      "/executiveFour.jpg",
    ],
    size: "40 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description:
      "Designed for the modern business traveler with enhanced work facilities, high-speed internet, and meeting space.",
    amenities: [
      { icon: Wifi, name: "High-Speed Wi-Fi" },
      { icon: Tv, name: "Business TV" },
      { icon: Coffee, name: "Coffee Station" },
      { icon: Bath, name: "Rain Shower" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Large Work Desk",
      "Meeting Area",
      "Printer Access",
      "Business Lounge",
      "Express Check-in",
      "Late Check-out",
    ],
    rating: 4.7,
    reviews: 156,
    available: true,
  },
  5: {
    id: 5,
    name: "Ambassadorial Suite",
    type: "suite",
    price: 360000,
    originalPrice: 380000,
    image: "/ambassadorialOne.jpg",
    gallery: [
      "/ambassadorialTwo.jpg",
      "/ambassadorialThree.jpg",
      "/ambassadorialFour.jpg",
    ],
    size: "40 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description:
      "Designed for the modern business traveler with enhanced work facilities, high-speed internet, and meeting space.",
    amenities: [
      { icon: Wifi, name: "High-Speed Wi-Fi" },
      { icon: Tv, name: "Business TV" },
      { icon: Coffee, name: "Coffee Station" },
      { icon: Bath, name: "Rain Shower" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Large Work Desk",
      "Meeting Area",
      "Printer Access",
      "Business Lounge",
      "Express Check-in",
      "Late Check-out",
    ],
    rating: 4.7,
    reviews: 156,
    available: true,
  },
  6: {
    id: 6,
    name: "Presidential Suite",
    type: "suite",
    price: 582000,
    originalPrice: 600000,
    image: "/presidentialOne.jpg",
    gallery: [
      "/presidentialTwo.jpg",
      "/presidentialThree.jpg",
      "/presidentialFour.jpg",
    ],
    size: "40 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description:
      "Designed for the modern business traveler with enhanced work facilities, high-speed internet, and meeting space.",
    amenities: [
      { icon: Wifi, name: "High-Speed Wi-Fi" },
      { icon: Tv, name: "Business TV" },
      { icon: Coffee, name: "Coffee Station" },
      { icon: Bath, name: "Rain Shower" },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Car, name: "Valet Parking" },
    ],
    features: [
      "Large Work Desk",
      "Meeting Area",
      "Printer Access",
      "Business Lounge",
      "Express Check-in",
      "Late Check-out",
    ],
    rating: 4.7,
    reviews: 156,
    available: true,
  }

}

export default function Page() {
  const params = useParams()
  const roomId = Number.parseInt(params.id as string)
  console.log(roomId)
  const room = roomsData[roomId as keyof typeof roomsData]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!room) {
    return (
      <div className="min-h-screen">
        <Navbar/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
          <Button asChild>
            <Link href="/rooms">Back to Rooms</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.gallery.length) % room.gallery.length)
  }

  return (
    <div className="min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-card py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/rooms" className="hover:text-primary">
              Rooms
            </Link>
            <span>/</span>
            <span className="text-foreground">{room.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src={room.gallery[currentImageIndex] || "/placeholder.svg"}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  fill
                />
                {room.originalPrice > room.price && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Save ₦{(room.originalPrice - room.price).toLocaleString()}
                  </Badge>
                )}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {room.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Details */}
            <div className="space-y-6">
              <div>
                <h1 className="font-heading text-3xl font-bold mb-4">{room.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.occupancy} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4" />
                    <span>{room.bedType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{room.rating}</span>
                  <span className="text-muted-foreground">({room.reviews} reviews)</span>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{room.description}</p>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold mb-3">Room Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold mb-3">Room Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {room.originalPrice > room.price && (
                    <div className="text-lg text-muted-foreground line-through">
                      ₦{room.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary">₦{room.price.toLocaleString()}</div>
                  <div className="text-muted-foreground">per night</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Guests</label>
                    <select className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      {room.occupancy > 2 && <option>3 Guests</option>}
                      {room.occupancy > 3 && <option>4 Guests</option>}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild disabled={!room.available}>
                    <Link href={`/booking?room=${room.id}`}>{room.available ? "Book This Room" : "Not Available"}</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/contact">Contact for Special Rates</Link>
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between">
                      <span>Free cancellation</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>No prepayment needed</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Instant confirmation</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
