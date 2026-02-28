"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, MapPin, Phone, Mail, Download, Share2, Clock } from "lucide-react"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")

  // Mock booking data - in a real app, this would be fetched from API
  const booking = {
    id: bookingId || "BK001",
    status: "confirmed",
    guest: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phone: "+234 801 234 5678",
    },
    room: {
      name: "Executive Suite",
      number: "201",
      image: "/luxury-hotel-suite-living-room-elegant-furniture.jpg",
    },
    dates: {
      checkIn: "2024-01-15",
      checkOut: "2024-01-18",
      nights: 3,
    },
    guests: 2,
    rooms: 1,
    amount: {
      subtotal: 450000,
      taxes: 33750,
      total: 483750,
    },
    payment: {
      method: "Credit Card",
      status: "paid",
      transactionId: "TXN123456789",
    },
    specialRequests: "Late check-in requested",
    bookingDate: "2024-01-10T14:30:00Z",
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert("Receipt download would start here")
  }

  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Hotel Booking Confirmation",
        text: `Booking confirmed at Nicon Luxury Hotel - ${booking.id}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Booking link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for choosing Nicon Luxury Hotel. Your reservation has been confirmed.
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Booking Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Details</span>
                <Badge className="bg-green-100 text-green-800">{booking.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={booking.room.image || "/placeholder.svg"}
                  alt={booking.room.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{booking.room.name}</h3>
                  <p className="text-sm text-muted-foreground">Room {booking.room.number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{booking.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confirmation</p>
                  <p className="font-medium">{booking.payment.transactionId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-in</p>
                  <p className="font-medium">{new Date(booking.dates.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-out</p>
                  <p className="font-medium">{new Date(booking.dates.checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Guests</p>
                  <p className="font-medium">{booking.guests} guests</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Nights</p>
                  <p className="font-medium">{booking.dates.nights} nights</p>
                </div>
              </div>

              {booking.specialRequests && (
                <div>
                  <p className="text-muted-foreground text-sm">Special Requests</p>
                  <p className="text-sm">{booking.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guest Information */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Primary Guest</p>
                <p className="font-medium">
                  {booking.guest.firstName} {booking.guest.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">{booking.guest.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Phone</p>
                <p className="font-medium">{booking.guest.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Booking Date</p>
                <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Room rate ({booking.dates.nights} nights)</span>
                <span>₦{booking.amount.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>₦{booking.amount.taxes.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">₦{booking.amount.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Payment Method</span>
                <span>{booking.payment.method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Status</span>
                <Badge className="bg-green-100 text-green-800">{booking.payment.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hotel Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nicon Luxury Hotel Abuja</p>
                    <p className="text-sm text-muted-foreground">
                      Plot 903, Tafawa Balewa Way, Central Business District, Abuja, Nigeria
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+234 9 461 5000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">info@niconluxury.com</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Check-in: 3:00 PM</p>
                    <p className="font-medium">Check-out: 12:00 PM</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Early check-in and late check-out available upon request (subject to availability)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Free cancellation up to 24 hours before check-in</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Valid government-issued photo ID required at check-in</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Complimentary Wi-Fi throughout the hotel</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>24/7 concierge and room service available</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Airport transfer service available (additional charges apply)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownloadReceipt} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Button onClick={handleShareBooking} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share Booking
          </Button>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8 p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground mb-2">Need help with your booking?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="tel:+2349461500">Call Hotel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
