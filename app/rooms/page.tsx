"use client"


import { useState } from "react"
import { Button } from '@/components/ui/button'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Users, Wifi, Car, Coffee, Tv, Bath, Wind, Star, Filter, Shield, Clock, Utensils } from "lucide-react"


const rooms = [
  {
    id: 1,
    name: "Studio Room",
    type: "studio",
    price: 30000,
    image: "/images/rooms/studio.jpg",
    gallery: ["/images/rooms/studio.jpg"],
    size: "25 sqm",
    occupancy: 1,
    bedType: "Single Bed",
    description: "Cozy and elegant studio room perfect for solo travelers needing a comfortable rest.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '43" Smart TV' },
      { icon: Wind, name: "Air Conditioning" },
    ],
    features: ["City View", "Work Desk", "Mini Bar"],
    rating: 4.5,
    reviews: 56,
    available: true,
  },
  {
    id: 2,
    name: "Standard Room",
    type: "standard",
    price: 70000,
    image: "/images/rooms/standard.jpg",
    gallery: ["/images/rooms/standard.jpg"],
    size: "35 sqm",
    occupancy: 2,
    bedType: "Queen Size Bed",
    description: "Essential comfort delivered with the warmth of genuine hospitality. Perfect for couples.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '50" Smart TV' },
      { icon: Wind, name: "Air Conditioning" },
    ],
    features: ["City View", "Mini Bar", "Work Desk"],
    rating: 4.7,
    reviews: 82,
    available: true,
  },
  {
    id: 3,
    name: "Deluxe Room",
    type: "deluxe",
    price: 80000,
    image: "/images/rooms/deluxe.jpg",
    gallery: ["/images/rooms/deluxe.jpg"],
    size: "40 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description: "Refined luxury with premium bedding and enhanced amenities for a superior stay.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '55" Smart TV' },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Bath, name: "Marble Bath" },
    ],
    features: ["Premium Bedding", "Mini Bar", "Room Service"],
    rating: 4.8,
    reviews: 110,
    available: true,
  },
  {
    id: 4,
    name: "Premium Room",
    type: "premium",
    price: 90000,
    image: "/images/rooms/premium.jpg",
    gallery: ["/images/rooms/premium.jpg"],
    size: "45 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description: "Superior comfort with enhanced space and premium views of Awka.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '55" Smart TV' },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Coffee, name: "Coffee Maker" },
    ],
    features: ["Panoramic View", "Sitting Area", "Mini Bar"],
    rating: 4.9,
    reviews: 95,
    available: true,
  },
  {
    id: 5,
    name: "Mini Suite",
    type: "suite",
    price: 100000,
    image: "/images/rooms/mini.jpg",
    gallery: ["/images/rooms/mini.jpg"],
    size: "55 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description: "A spacious junior suite featuring a separate living area and VIP services.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '60" Smart TV' },
      { icon: Wind, name: "Air Conditioning" },
      { icon: Bath, name: "Luxury Bath" },
    ],
    features: ["Living Area", "VIP Amenities", "Late Checkout"],
    rating: 4.9,
    reviews: 64,
    available: true,
  },
  {
    id: 6,
    name: "Royal Suite",
    type: "suite",
    price: 150000,
    image: "/images/rooms/royal.jpg",
    gallery: ["/images/rooms/royal.jpg"],
    size: "75 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description: "Deluxe suite offering gourmet amenities and a boutique setting unlike any other.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '65" Smart TV' },
      { icon: Coffee, name: "Nespresso Machine" },
      { icon: Shield, name: "Personal Safe" },
    ],
    features: ["Gourmet Amenities", "Concierge Service", "Private Balcony"],
    rating: 5.0,
    reviews: 42,
    available: true,
  },
  {
    id: 7,
    name: "Royal Classic Suite",
    type: "suite",
    price: 200000,
    image: "/images/rooms/royal-classic.jpg",
    gallery: ["/images/rooms/royal-classic.jpg"],
    size: "85 sqm",
    occupancy: 2,
    bedType: "King Size Bed",
    description: "Premium suite with exquisite design and a private bar for the ultimate relaxation.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: '75" Smart TV' },
      { icon: Coffee, name: "Full Mini Bar" },
      { icon: Bath, name: "Jacuzzi" },
    ],
    features: ["Private Bar", "Exquisite Design", "Jacuzzi"],
    rating: 5.0,
    reviews: 38,
    available: true,
  },
  {
    id: 8,
    name: "Executive Apartment",
    type: "apartment",
    price: 200000,
    image: "/images/rooms/executive.jpg",
    gallery: ["/images/rooms/executive.jpg"],
    size: "100 sqm",
    occupancy: 4,
    bedType: "2 King Beds",
    description: "Luxury apartment featuring a full kitchen and spacious living room, ideal for families.",
    amenities: [
      { icon: Wifi, name: "Free Wi-Fi" },
      { icon: Tv, name: "Multiple TVs" },
      { icon: Coffee, name: "Full Kitchen" },
      { icon: Utensils, name: "Dining Area" },
    ],
    features: ["Full Kitchen", "Living Room", "Penthouse View"],
    rating: 4.8,
    reviews: 29,
    available: true,
  },
  {
    id: 9,
    name: "Presidential Apartment",
    type: "apartment",
    price: 300000,
    image: "/images/rooms/presidential.jpg",
    gallery: ["/images/rooms/presidential.jpg"],
    size: "150 sqm",
    occupancy: 4,
    bedType: "2 King Beds",
    description: "The pinnacle of our offering — unmatched luxury with a personal butler and private office.",
    amenities: [
      { icon: Wifi, name: "Premium Wi-Fi" },
      { icon: Tv, name: "Home Theater" },
      { icon: Shield, name: "Advanced Security" },
      { icon: Clock, name: "Butler Service" },
    ],
    features: ["Personal Butler", "Private Office", "Unmatched Luxury"],
    rating: 5.0,
    reviews: 15,
    available: true,
  },
];


export default function RoomsPage() {
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [priceRange, setPriceRange] = useState('all');
  const [roomType, setRoomType] = useState('all');
  const [availability, setAvailability] = useState('all');


  const filterRooms = () => {
    let filtered = rooms

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((room) => room.price >= min && room.price <= max)
    }

    if (roomType !== "all") {
      filtered = filtered.filter((room) => room.type === roomType)
    }

    if (availability !== 'all') {
      filtered = filtered.filter((room) => room.available === (availability === "available"))
    }

    setFilteredRooms(filtered)
  }

  return (
    <div>
      <section className="relative py-24 min-h-[300px] w-full bg-gradient-to-r from-black/85 to-black/100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-6 text-balance">
            Luxury Rooms & Suites
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            {" "}
            Discover our collection of elegantly appointed accommodations,
            each designed to provide the ultimate in comfort and luxury.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium"> Filter Rooms: </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50000">Under ₦50,000</SelectItem>
                  <SelectItem value="50000-150000">
                    ₦50,000 - ₦150,000
                  </SelectItem>
                  <SelectItem value="150000-500000">
                    Above ₦150,000
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="studio">Studio Room</SelectItem>
                  <SelectItem value="standard">Standard Room</SelectItem>
                  <SelectItem value="deluxe">Deluxe Room</SelectItem>
                  <SelectItem value="premium">Premium Room</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={filterRooms} variant="outline">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-16">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <div
                      className="h-64 md:h-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${room.image}')` }}
                    >
                      {!room.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge
                            variant="destructive"
                            className="text-lg px-4 py-2"
                          >
                            Not Available
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="md:w-1/2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-heading text-lg font-semibold mb-2">
                          {room.name}
                        </h3>
                        <div className="flex flex-col  gap-2 text-xs text-muted-foreground mb-2">
                          <div className="flex gap-2">
                            <Users className="h-4 w-4" />
                            <span>Up to {room.occupancy} guests</span>
                          </div>
                          <span>• {room.size}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{room.rating}</span>
                          <span className="text-muted-foreground">
                            ({room.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-primary">
                          ₦{room.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per night
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {room.description}
                    </p>

                    {/* Amenities */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {room.amenities.slice(0, 6).map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground"
                        >
                          <amenity.icon className="h-3 w-3" />
                          <span>{amenity.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* <Button
                        asChild
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        <Link href={`/rooms/${room.id}`}>View Details</Link>
                      </Button> */}
                      <Button
                        asChild
                        className="flex-1"
                        disabled={!room.available}
                      >
                        <Link href={`/booking?room=${room.id}`}>
                          {room.available ? "Book Now" : "Unavailable"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No rooms match your current filters.
              </p>
              <Button
                onClick={() => {
                  setPriceRange("all");
                  setRoomType("all");
                  setAvailability("all");
                  setFilteredRooms(rooms);
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}