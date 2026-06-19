"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Users, CreditCard, Shield, Clock, CheckCircle, Building2, Smartphone, AlertCircle } from "lucide-react"

// Fallback rooms for initial render or when API fails
const fallbackRooms = [
  {
    id: 1,
    name: "Classic Room",
    type: "standard",
    price: 80000,
    image: "/images/rooms/standard.jpg"
  },
  {
    id: 2,
    name: "Superior Suite",
    type: "deluxe",
    price: 98400,
    image: "/images/rooms/royal.jpg"
  },
  {
    id: 4,
    name: "Executive Suite",
    type: "suite",
    price: 134700,
    image: "/images/rooms/executive.jpg"
  },
  {
    id: 3,
    name: "Business Suite",
    type: "business",
    price: 121700,
    image: "/images/rooms/deluxe.jpg"
  },
  {
    id: 5,
    name: "Ambassadorial Suite",
    type: "suite",
    price: 360000,
    image: "/images/rooms/royal-classic.jpg"
  },
  {
    id: 6,
    name: "Presidential Suite",
    type: "suite",
    price: 582000,
    image: "/images/rooms/presidential.jpg"
  }
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get("room")
  const [selectedRoom, setSelectedRoom] = useState<number | null>(roomId ? Number.parseInt(roomId) : null)
  const [step, setStep] = useState(1)
  const checkInParam = searchParams.get("checkIn") ?? ""
  const checkOutParam = searchParams.get("checkOut") ?? ""
  const guestsParam = searchParams.get("guests")
  const successParam = searchParams.get("success")
  const bookingIdParam = searchParams.get("booking_id")
  const [paymentMethod, setPaymentMethod] = useState("hotel")
  const [isProcessing, setIsProcessing] = useState(false)
  type Notice = { type: "error" | "success" | "info"; message: string } | null
  const [notice, setNotice] = useState<Notice>(null)
  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "", [])
  type ServerBooking = {
    id: number
    guest_name: string
    guest_email: string
    guest_phone: string
    status: string
    amount: number
    check_in_date: string
    check_out_date: string
    room?: { id: number; room_number: string; status: string } | null
    room_type?: { id: number; name: string } | null
    roomType?: { id: number; name: string } | null
  }
  const [serverBooking, setServerBooking] = useState<ServerBooking | null>(null)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const formatHotelDate = (dateStr: string) => {
    // Accept both ISO strings (e.g. 2025-12-02T00:00:00.000Z) and YYYY-MM-DD
    let base: Date | null = null
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      const parsed = new Date(dateStr)
      if (!isNaN(parsed.getTime())) {
        base = parsed
      }
    }
    if (!base && typeof dateStr === "string") {
      const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (m) {
        const [, y, mo, d] = m
        base = new Date(Number(y), Number(mo) - 1, Number(d), 12, 0, 0)
      }
    }
    if (!base) {
      // Fallback: try Date constructor; if still invalid, return original string
      const fallback = new Date(dateStr)
      if (isNaN(fallback.getTime())) return `${dateStr} at 12:00 PM`
      base = fallback
    }
    // Normalize time to 12:00 PM local
    const d = new Date(base)
    d.setHours(12, 0, 0, 0)
    return `${d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })} at 12:00 PM`
  }
  type BookingData = {
    checkIn: string
    checkOut: string
    guests: number
    rooms: number
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    specialRequests: string
    newsletter: boolean
    terms: boolean
    cardNumber: string
    expiryDate: string
    cvv: string
    cardName: string
    billingAddress: string
    billingCity: string
    billingState: string
    billingZip: string
  }


  // initialize bookingData from URL params when available
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // safe local ISO string (YYYY-MM-DD)
    const toLocalISOByDate = (d: Date) => {
      const offset = d.getTimezoneOffset()
      const local = new Date(d.getTime() - (offset * 60 * 1000))
      return local.toISOString().split('T')[0]
    }

    const todayStr = toLocalISOByDate(today)
    const tomorrowStr = toLocalISOByDate(tomorrow)

    return {
      checkIn: checkInParam || todayStr,
      checkOut: checkOutParam || tomorrowStr,
      guests: guestsParam ? Number.parseInt(guestsParam) : 1,
      rooms: 1,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      specialRequests: "",
      newsletter: false,
      terms: false,
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardName: "",
      billingAddress: "",
      billingCity: "",
      billingState: "",
      billingZip: ""
    }
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.chibenleisure.com"
  const hotelDetails = {
    name: "Chiben Leisure Hotels",
    address: "Central Business District, Abuja",
    bank: "First Bank of Nigeria",
    accountName: "Chiben Leisure Hotels & Hotel Limited",
  }
  // helper: convert YYYY-MM-DD -> DD-MM-YYYY (backend expects this format based on your Postman)
  function toDDMMYYYY(isoDate?: string) {
    if (!isoDate) return ""
    const [y, m, d] = isoDate.split("-")
    return `${d}-${m}-${y}`
  }

  type CreateBookingApiPayload = {
    room_type_id: number
    guest_name: string
    guest_email: string
    guest_phone: string
    check_in_date: string // DD-MM-YYYY
    check_out_date: string // DD-MM-YYYY
    status?: string
    amount: number | string
    number_of_rooms?: number
    // add other optional fields the API supports, e.g. special_requests
    special_requests?: string
  }


  const createBooking = async (payload: CreateBookingApiPayload) => {
    // Use local Next.js API route as proxy to avoid CORS issues
    const url = `/api/bookings`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      // Extract error message from proxy API response
      let message = `Booking failed with status ${res.status}`
      try {
        const errJson = await res.json()
        // The proxy returns { error: string, details: any }
        if (errJson && typeof errJson.error === "string") {
          message = errJson.error
        } else if (errJson && typeof errJson.message === "string") {
          message = errJson.message
        }
      } catch (_) {
        const text = await res.text()
        message = text || message
      }
      throw new Error(message)
    }
    return res.json()
  }

  // Types for /api/rooms
  type ApiRoomImage = {
    secure_url?: string | null
    url?: string | null
    caption?: string | null
  }
  type ApiRoomType = {
    id: number
    name: string
    base_price: number
    images?: ApiRoomImage[]
  }
  type UiRoom = {
    id: number
    name: string
    price: number
    image?: string | null
  }

  const [apiRooms, setApiRooms] = useState<UiRoom[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Use local Next.js API route as proxy to avoid CORS issues
        const res = await fetch(`/api/rooms`, { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Rooms API error: ${res.status}`)
        }
        const json: ApiRoomType[] = await res.json()
        const mapped: UiRoom[] = (json || []).map((r: ApiRoomType) => {
          const firstImg = r.images && r.images.length > 0 ? r.images[0] : undefined
          const imgUrl = firstImg?.secure_url || firstImg?.url || null
          return {
            id: r.id,
            name: r.name,
            price: Number(r.base_price) || 0,
            image: imgUrl,
          }
        })
        setApiRooms(mapped)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load rooms."
        setNotice({ type: "error", message })
      }
    }
    fetchRooms()
  }, [])

  const uiRooms: UiRoom[] = apiRooms.length > 0 ? apiRooms : fallbackRooms

  // if search params change while on page, keep bookingData in sync
  useEffect(() => {
    if (checkInParam || checkOutParam || guestsParam) {
      setBookingData((prev) => ({
        ...prev,
        checkIn: checkInParam || prev.checkIn,
        checkOut: checkOutParam || prev.checkOut,
        guests: guestsParam ? Number.parseInt(guestsParam) : prev.guests,
      }))
    }
  }, [checkInParam, checkOutParam, guestsParam])

  // handle redirect from Paystack callback with ?success=1&booking_id=X
  useEffect(() => {
    if (successParam === "1" && bookingIdParam) {
      const fetchBooking = async () => {
        try {
          const res = await fetch(`${apiBase}/api/bookings/${bookingIdParam}`, { cache: "no-store" })
          if (!res.ok) throw new Error("Failed to fetch booking")
          const data = await res.json()
          setServerBooking(data)
          setIsSuccessDialogOpen(true)
          setNotice({ type: "success", message: "Payment successful! Your booking is confirmed." })
        } catch {
          setNotice({ type: "error", message: "Could not load booking details. Please contact support." })
        }
      }
      fetchBooking()
    }
  }, [successParam, bookingIdParam, apiBase])

  useEffect(() => {
    if (successParam === "0" && bookingIdParam) {
      const fetchBooking = async () => {
        try {
          const res = await fetch(`${apiBase}/api/bookings/${bookingIdParam}`, { cache: "no-store" })
          if (!res.ok) return
          const data = await res.json()
          setServerBooking(data)
          setIsSuccessDialogOpen(true)
        } catch {
          // silent
        }
      }
      fetchBooking()
    }
  }, [successParam, bookingIdParam, apiBase])

  const selectedRoomData = uiRooms.find((room) => room.id === selectedRoom)
  const nights =
    bookingData.checkIn && bookingData.checkOut
      ? Math.ceil(
        (new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24),
      )
      : 0
  const subtotal = selectedRoomData ? selectedRoomData.price * nights * bookingData.rooms : 0
  // const taxes = subtotal * 0.075 // 7.5% VAT
  const taxes = 0
  const total = subtotal + taxes

  function handleInputChange<K extends keyof BookingData>(field: K, value: BookingData[K]) {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const initiatePaystackPayment = async (bookingId: number) => {
    const res = await fetch(`/api/payments/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || err.message || `Failed to initiate payment (${res.status})`)
    }
    return res.json()
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      const guestName = `${bookingData.firstName} ${bookingData.lastName}`.trim() || "Guest"
      if (!selectedRoom) throw new Error("Please select a room first.")
      const room_type_id = selectedRoom as number

      const payload: CreateBookingApiPayload = {
        room_type_id,
        guest_name: guestName,
        guest_email: bookingData.email,
        guest_phone: bookingData.phone,
        check_in_date: toDDMMYYYY(bookingData.checkIn),
        check_out_date: toDDMMYYYY(bookingData.checkOut),
        status: "pending",
        amount: Number((total).toFixed(2)),
        number_of_rooms: bookingData.rooms,
        special_requests: bookingData.specialRequests || undefined,
      }

      const apiResult = await createBooking(payload)

      const booking = apiResult.booking || null

      if (paymentMethod === "paystack") {
        if (!booking?.id) {
          throw new Error("Booking was created but no booking ID was returned. Cannot initiate payment.")
        }
        const payResult = await initiatePaystackPayment(booking.id)
        if (payResult.authorization_url) {
          window.location.href = payResult.authorization_url
          return
        }
        throw new Error("No authorization URL returned from payment gateway")
      }

      setServerBooking(booking)
      setNotice({ type: "success", message: "Booking created successfully!" })
      setIsSuccessDialogOpen(true)
      setStep(2)
    } catch (error) {
      console.error("Booking/payment error:", error)
      let msg = "Booking failed. Please try again."

      if (error instanceof Error) {
        msg = error.message
        if (msg.includes("422") || msg.includes("validation")) {
          msg = "Please check your booking details. Some fields may be invalid or the room may not be available for the selected dates."
        }
      }

      setNotice({ type: "error", message: msg })
    } finally {
      setIsProcessing(false)
    }
  }

  const cancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return
    }

    setIsProcessing(true)
    try {
      const res = await fetch(`${API_BASE}/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to cancel booking')
      }

      setNotice({ type: 'success', message: 'Booking cancelled successfully' })
      setServerBooking(null) // Clear the booking display
    } catch (error) {
      console.error('Cancel booking error:', error)
      const msg = error instanceof Error ? error.message : 'Failed to cancel booking'
      setNotice({ type: 'error', message: msg })
    } finally {
      setIsProcessing(false)
    }
  }



  // Mock payment processing functions



  type CardPaymentData = {
    amount: number
    cardNumber: string
    expiryDate: string
    cvv: string
    cardName: string
  }

  type CardPaymentResult = {
    success: boolean
    bookingId: string
    transactionId: string
    error?: string
  }

  type BankTransferDetails = {
    reference: string
    accountNumber: string
    bankName: string
    accountName: string
  }

  type PaystackInitResult = {
    authorization_url: string
    access_code: string
    reference: string
  }

  type BookingResult = {
    bookingId: string
    status: string
  }

  const processCardPayment = async (paymentData: CardPaymentData): Promise<CardPaymentResult> => {
    // In a real app, this would integrate with Stripe, Square, etc.
    return {
      success: true,
      bookingId: "BK" + Date.now(),
      transactionId: "TXN" + Date.now(),
    }
  }

  const generateBankTransfer = async (transferData: { amount: number; guestName: string; email: string; }): Promise<BankTransferDetails> => {
    return {
      reference: "REF" + Date.now(),
      accountNumber: "0123456789",
      bankName: "First Bank of Nigeria",
      accountName: "Chiben Leisure Hotels & Hotel Limited",
    }
  }

  const initializePaystack = async (paystackData: { amount: number; email: string; firstName: string; lastName: string; }): Promise<PaystackInitResult> => {
    return {
      authorization_url: "https://checkout.paystack.com/example",
      access_code: "access_code_example",
      reference: "ref_" + Date.now(),
    }
  }

  type CreateBookingPayload = BookingData & {
    paymentMethod: string
    paymentStatus: string
  }

  const createBookingMock = async (bookingData: CreateBookingPayload): Promise<BookingResult> => {
    return {
      bookingId: "BK" + Date.now(),
      status: "confirmed",
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Dialog Popup */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md border-secondary/20 shadow-2xl rounded-3xl overflow-hidden p-0">
          <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
            <div className="flex items-center justify-center w-20 h-20 bg-secondary/10 rounded-full mx-auto mb-6 relative">
              <CheckCircle className="h-10 w-10 text-secondary" />
              <div className="absolute inset-0 rounded-full border-2 border-secondary animate-ping opacity-20" />
            </div>
            <DialogTitle className="font-heading text-3xl font-bold text-primary italic mb-2">Sanctuary Secured</DialogTitle>
            <DialogDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Your residence at Chiben Leisure awaits</DialogDescription>
          </div>

          <div className="p-8 space-y-6">
            {serverBooking && (
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-[0.2em] block mb-3">Verification ID</span>
                  {bookingData.rooms > 1 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: bookingData.rooms }, (_, i) => (
                        <div key={i} className="bg-white border border-secondary/20 rounded-xl py-3 px-2 shadow-sm">
                          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Room {i + 1}</p>
                          <p className="font-mono font-bold text-primary text-sm tracking-tighter">CLH{serverBooking.id + i}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-mono font-bold text-primary text-4xl tracking-tighter italic">
                      CLH{serverBooking.id}
                    </p>
                  )}
                </div>

                <div className="space-y-4 text-center">
                  <div className="w-12 h-px bg-secondary/20 mx-auto" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A celestial confirmation dispatch has been sent to<br />
                    <span className="text-primary font-bold">{serverBooking.guest_email}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setIsSuccessDialogOpen(false)}
                className="w-full h-14 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary font-bold uppercase tracking-widest text-xs shadow-lg transition-all"
              >
                View Residence Details
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.print()}
                className="w-full h-10 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:bg-primary/5 hover:text-primary"
              >
                Download PDF Concierge Slip
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen bg-[#fcfbf7]">
        {/* Premium Header Section */}
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <Image
            src="/images/rooms/presidential.jpg"
            alt="Chiben Leisure Sanctuary"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fcfbf7]" />

          <div className="relative z-10 text-center text-white px-4">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 italic tracking-tight">Reserve Your Room</h1>
            <p className="font-sans text-lg md:text-xl text-white/80 max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs font-bold">
              Chiben Leisure Resort & hotels Limited
            </p>
          </div>
        </section>

        {/* Modern Floating Stepper */}
        <div className="max-w-4xl mx-auto px-4 -translate-y-1/2 relative z-20">
          <div className="bg-white/80 backdrop-blur-xl border border-secondary/20 shadow-2xl rounded-full p-2 flex items-center justify-between">
            {[
              { step: 1, title: "Select", icon: Calendar },
              { step: 2, title: "Details", icon: Users },
              { step: 3, title: "Finalize", icon: CreditCard },
            ].map((item, index) => (
              <div
                key={item.step}
                className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-full transition-all duration-500 ${step === item.step
                  ? "bg-secondary text-primary shadow-lg"
                  : "text-muted-foreground"
                  }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= item.step ? "bg-primary/10" : "bg-muted"
                  }`}>
                  {step > item.step ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {notice && notice.type === "success" && (
            <div className="mb-6 border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">{notice.message}</p>
                </div>
                <button onClick={() => setNotice(null)} className="text-sm text-green-700 underline">Dismiss</button>
              </div>
            </div>
          )}
          {notice && notice.type === "error" && (
            <div className="mb-6 border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">{notice.message}</p>
                  <p className="text-sm text-red-700 mt-1">Please adjust the number of rooms or choose a different room type/date.</p>
                </div>
                <button onClick={() => setNotice(null)} className="text-sm text-red-700 underline">Dismiss</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              {serverBooking && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Booking{bookingData.rooms > 1 ? 's' : ''} Created Successfully
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Booking IDs Section */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="font-semibold text-green-900 mb-2">
                        {bookingData.rooms > 1 ? 'Your Booking IDs:' : 'Your Booking ID:'}
                      </p>
                      {bookingData.rooms > 1 ? (
                        <div className="space-y-1">
                          {Array.from({ length: bookingData.rooms }, (_, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-white">
                                {i + 1}
                              </Badge>
                              <span className="font-mono font-bold text-green-800">
                                CLH{serverBooking.id + i}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-mono font-bold text-green-800 text-lg">
                          CLH{serverBooking.id}
                        </p>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Room Type</p>
                        <p className="font-medium">{selectedRoomData?.name || serverBooking?.room_type?.name || serverBooking?.roomType?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Number of Rooms</p>
                        <p className="font-medium">{bookingData.rooms} room{bookingData.rooms !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div className="space-y-2 border-t pt-4">
                      <p><strong>Guest Name:</strong> {serverBooking.guest_name}</p>
                      <p><strong>Email:</strong> {serverBooking.guest_email}</p>
                      <p><strong>Phone:</strong> {serverBooking.guest_phone}</p>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2 border-t pt-4">
                      <p><strong>Status:</strong> <Badge className="ml-2">{serverBooking.status}</Badge></p>
                      <p><strong>Total Amount:</strong> ₦{(total || (serverBooking?.amount ? serverBooking.amount * bookingData.rooms : 0)).toLocaleString()}</p>
                      <p><strong>Check-in:</strong> {formatHotelDate(serverBooking.check_in_date)}</p>
                      <p><strong>Check-out:</strong> {formatHotelDate(serverBooking.check_out_date)}</p>
                    </div>

                    {/* Important Note for Multiple Rooms */}
                    {bookingData.rooms > 1 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                        <p className="font-medium text-blue-900 mb-1">📋 Multiple Rooms Booked</p>
                        <p className="text-blue-800">
                          You have booked {bookingData.rooms} rooms.
                          Please save all booking IDs for your records.
                        </p>
                      </div>
                    )}

                    {/* Cancel Booking Button */}
                    {/* {serverBooking.status !== 'cancelled' && (
                    <div className="border-t pt-4">
                      <Button
                        variant="destructive"
                        onClick={() => cancelBooking(serverBooking.id)}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Free cancellation up to 24 hours before check-in
                      </p>
                    </div>
                  )} */}
                  </CardContent>
                </Card>
              )}
              {/* Step 1: Room & Dates */}
              {step === 1 && (
                <div className="space-y-12">
                  {/* Concierge Desk - Date & Guest Controls */}
                  <div className="bg-white border-b border-secondary/20 shadow-xl overflow-hidden">
                    <div className="bg-primary/5 p-4 border-b border-primary/10">
                      <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-secondary" />
                        Trip Itinerary
                      </h2>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Check-in */}
                        <div className="space-y-3">
                          <Label htmlFor="checkin" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Arrival Date</Label>
                          <div className="relative group">
                            <Input
                              id="checkin"
                              type="date"
                              value={bookingData.checkIn}
                              onChange={(e) => handleInputChange("checkIn", e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="bg-transparent border-t-0 border-x-0 border-b-2 border-secondary/20 focus-visible:border-secondary rounded-none px-0 py-6 text-lg font-medium transition-all"
                            />
                            <p className="text-[10px] text-muted-foreground italic mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Early check-in available from 12:00 PM
                            </p>
                          </div>
                        </div>

                        {/* Check-out */}
                        <div className="space-y-3">
                          <Label htmlFor="checkout" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Departure Date</Label>
                          <div className="relative group">
                            <Input
                              id="checkout"
                              type="date"
                              value={bookingData.checkOut}
                              onChange={(e) => handleInputChange("checkOut", e.target.value)}
                              min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                              className="bg-transparent border-t-0 border-x-0 border-b-2 border-secondary/20 focus-visible:border-secondary rounded-none px-0 py-6 text-lg font-medium transition-all"
                            />
                            <p className="text-[10px] text-muted-foreground italic mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Late check-out until 12:00 PM
                            </p>
                          </div>
                        </div>

                        {/* Travel Details */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Guests</Label>
                            <div className="flex items-center border-b-2 border-secondary/20 h-12">
                              <button
                                onClick={() => handleInputChange("guests", Math.max(1, bookingData.guests - 1))}
                                disabled={bookingData.guests <= 1}
                                className="px-3 text-secondary hover:text-primary transition-colors disabled:opacity-30"
                              >
                                <span className="text-xl font-light">−</span>
                              </button>
                              <span className="flex-1 text-center font-bold text-lg text-primary">{bookingData.guests}</span>
                              <button
                                onClick={() => handleInputChange("guests", bookingData.guests + 1)}
                                disabled={bookingData.guests >= 10}
                                className="px-3 text-secondary hover:text-primary transition-colors"
                              >
                                <span className="text-xl font-light">+</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Apartments</Label>
                            <div className="flex items-center border-b-2 border-secondary/20 h-12">
                              <button
                                onClick={() => handleInputChange("rooms", Math.max(1, bookingData.rooms - 1))}
                                disabled={bookingData.rooms <= 1}
                                className="px-3 text-secondary hover:text-primary transition-colors disabled:opacity-30"
                              >
                                <span className="text-xl font-light">−</span>
                              </button>
                              <span className="flex-1 text-center font-bold text-lg text-primary">{bookingData.rooms}</span>
                              <button
                                onClick={() => handleInputChange("rooms", bookingData.rooms + 1)}
                                className="px-3 text-secondary hover:text-primary transition-colors"
                              >
                                <span className="text-xl font-light">+</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sanctuary Selection - List of Rooms */}
                  <div className="space-y-8">
                    <div className="flex items-baseline justify-between border-b border-secondary/20 pb-4">
                      <h2 className="font-heading text-3xl font-bold text-primary">Discover Your Sanctuary</h2>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary">{uiRooms.length} Residence Types Available</span>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                      {uiRooms.map((room) => (
                        <div
                          key={room.id}
                          className={`group relative overflow-hidden transition-all duration-700 ${selectedRoom === room.id ? "ring-2 ring-secondary ring-offset-8" : ""
                            }`}
                        >
                          <div className="flex flex-col lg:flex-row gap-10 bg-white shadow-2xl">
                            {/* Larger Vertical Image */}
                            <div className="relative w-full lg:w-[45%] aspect-[4/5] overflow-hidden">
                              <Image
                                src={room.image || "/placeholder.svg"}
                                alt={room.name}
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                              />
                              {/* Premium Overlay Elements */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                              <div className="absolute top-6 left-6">
                                <Badge className="bg-secondary text-primary hover:bg-white border-none shadow-lg px-4 py-2 font-bold text-sm tracking-wider uppercase">
                                  Recommended
                                </Badge>
                              </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 p-8 lg:py-12 lg:pr-12 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h3 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2 italic">{room.name}</h3>
                                    <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-bold text-secondary">
                                      <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Boutique Residence</span>
                                      <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Guest Ready</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Per Night</span>
                                    <span className="text-3xl font-bold text-primary italic">₦{room.price.toLocaleString()}</span>
                                  </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed font-sans text-lg mb-8 max-w-xl">
                                  Our {room.name} offers a curated experience of leisurely comfort, featuring bespoke amenities and artisanal touches designed for your ultimate sanctuary.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                  {[
                                    { icon: Shield, label: "Private Entry" },
                                    { icon: Smartphone, label: "Digital Access" },
                                    { icon: Building2, label: "City Views" },
                                    { icon: Shield, label: "24/7 Security" },
                                  ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/60">
                                      <feat.icon className="w-4 h-4 text-secondary" />
                                      {feat.label}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-6">
                                {selectedRoom === room.id ? (
                                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                    {/* Redesigned Summary Panel */}
                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mb-6">
                                      <div className="flex justify-between items-center border-b border-primary/10 pb-4 mb-4">
                                        <span className="font-heading text-xl font-bold italic text-primary">Your Selection</span>
                                        <Badge variant="secondary" className="bg-secondary/10 text-secondary uppercase text-[10px] font-bold tracking-widest">Pricing Summary</Badge>
                                      </div>
                                      <div className="space-y-6 font-sans">
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 border-y border-primary/10">
                                          <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Check-In</span>
                                            <span className="font-bold text-primary italic text-xs">{formatHotelDate(bookingData.checkIn)}</span>
                                          </div>
                                          <div className="flex flex-col text-right">
                                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Check-Out</span>
                                            <span className="font-bold text-primary italic text-xs">{formatHotelDate(bookingData.checkOut)}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Daily Rate</span>
                                            <span className="font-bold text-primary italic">₦{room.price.toLocaleString()}</span>
                                          </div>
                                          <div className="flex flex-col text-right">
                                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Duration</span>
                                            <span className="font-bold text-primary italic">{nights} Night{nights !== 1 ? 's' : ''}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Guests</span>
                                            <span className="font-bold text-primary italic">{bookingData.guests} Person{bookingData.guests !== 1 ? 's' : ''}</span>
                                          </div>
                                          <div className="flex flex-col text-right">
                                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Residences</span>
                                            <span className="font-bold text-primary italic">{bookingData.rooms} Room{bookingData.rooms !== 1 ? 's' : ''}</span>
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-end pt-2">
                                          <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 leading-tight">Total Sanctuary Investment</span>
                                            <span className="font-heading text-xl italic font-bold text-primary">Grand Total</span>
                                          </div>
                                          <span className="text-3xl font-bold text-secondary italic leading-none">₦{total.toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <Button
                                      onClick={handleNextStep}
                                      className="w-full h-16 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary text-lg font-bold uppercase tracking-[0.2em] transition-all"
                                    >
                                      Confirm & Continue
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedRoom(room.id)}
                                    className="w-full h-16 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg font-bold uppercase tracking-[0.2em] transition-all"
                                  >
                                    Select This Residence
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Details */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-white border border-secondary/20 shadow-xl overflow-hidden rounded-2xl">
                    <div className="bg-primary/5 p-6 border-b border-primary/10">
                      <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3 italic">
                        <Users className="h-6 w-6 text-secondary" />
                        Guest Particulars
                      </h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">Please provide the details for your residence</p>
                    </div>

                    <div className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="firstName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="e.g. Chinedu"
                            value={bookingData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b-2 border-secondary/20 focus-visible:border-secondary rounded-none px-0 py-6 text-lg font-medium transition-all placeholder:text-muted-foreground/30"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="lastName" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="e.g. Okafor"
                            value={bookingData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b-2 border-secondary/20 focus-visible:border-secondary rounded-none px-0 py-6 text-lg font-medium transition-all placeholder:text-muted-foreground/30"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@sanctuary.com"
                            value={bookingData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b-2 border-secondary/20 focus-visible:border-secondary rounded-none px-0 py-6 text-lg font-medium transition-all placeholder:text-muted-foreground/30"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+234 ..."
                            value={bookingData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-transparent border-t-0 border-x-0 border-b-2 border-secondary/20 focus-visible:border-secondary rounded-none px-0 py-6 text-lg font-medium transition-all placeholder:text-muted-foreground/30"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          className="flex-1 h-14 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-xs"
                        >
                          Revise Selection
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          className="flex-1 h-14 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary font-bold uppercase tracking-widest text-xs shadow-lg transition-all"
                          disabled={!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone}
                        >
                          Proceed to Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-white border border-secondary/20 shadow-xl overflow-hidden rounded-2xl">
                    <div className="bg-primary/5 p-6 border-b border-primary/10">
                      <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-3 italic">
                        <CreditCard className="h-6 w-6 text-secondary" />
                        Settlement & Confirmation
                      </h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">Secure your residence at Chiben Leisure</p>
                    </div>

                    <div className="p-8 space-y-10">
                      <div className="space-y-4">
                        <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary mb-4 block">Select Settlement Mode</Label>

                        <div className="grid grid-cols-1 gap-4">
                          {/* Pay at Hotel */}
                          <label
                            className={`group flex items-center justify-between border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === "hotel"
                              ? "border-secondary bg-secondary/5 ring-1 ring-secondary"
                              : "border-secondary/10 hover:border-secondary/30 bg-white"
                              }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="hotel"
                              checked={paymentMethod === "hotel"}
                              onChange={() => setPaymentMethod("hotel")}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-full transition-colors ${paymentMethod === 'hotel' ? 'bg-secondary text-primary' : 'bg-primary/5 text-primary/40'}`}>
                                <Clock className="h-6 w-6" />
                              </div>
                              <div>
                                <span className={`block font-heading text-xl font-bold italic ${paymentMethod === 'hotel' ? 'text-primary' : 'text-primary/60'}`}>Settlement on Arrival</span>
                                <p className="text-sm text-muted-foreground">Cash, Card, or Transfer at our Concierge Desk</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'hotel' ? 'border-secondary bg-secondary' : 'border-secondary/20'
                              }`}>
                              {paymentMethod === 'hotel' && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                          </label>

                          {/* Pay Online - Paystack */}
                          <label
                            className={`group flex items-center justify-between border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${paymentMethod === "paystack"
                              ? "border-secondary bg-secondary/5 ring-1 ring-secondary"
                              : "border-secondary/10 hover:border-secondary/30 bg-white"
                              }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="paystack"
                              checked={paymentMethod === "paystack"}
                              onChange={() => setPaymentMethod("paystack")}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-5">
                              <div className={`p-4 rounded-full transition-colors ${paymentMethod === 'paystack' ? 'bg-secondary text-primary' : 'bg-primary/5 text-primary/40'}`}>
                                <Building2 className="h-6 w-6" />
                              </div>
                              <div>
                                <span className={`block font-heading text-xl font-bold italic ${paymentMethod === 'paystack' ? 'text-primary' : 'text-primary/60'}`}>Pay Online Now</span>
                                <p className="text-sm text-muted-foreground">Card, Transfer, USSD — Powered by Paystack</p>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'paystack' ? 'border-secondary bg-secondary' : 'border-secondary/20'
                              }`}>
                              {paymentMethod === 'paystack' && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* House Policies Block */}
                      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                        <h4 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-secondary" />
                          House Policies
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="terms"
                              checked={bookingData.terms}
                              onCheckedChange={(checked) => handleInputChange("terms", Boolean(checked))}
                              className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-primary"
                            />
                            <Label htmlFor="terms" className="text-xs font-medium leading-relaxed">
                              I acknowledge the <span className="text-secondary font-bold">House Rules</span> and <span className="text-secondary font-bold">Privacy Mandate</span>.
                              I understand the complimentary cancellation window of 24 hours.
                            </Label>
                          </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-primary/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] uppercase tracking-widest font-bold text-primary/40 text-center">
                          <span>Verified Sanctuary</span>
                          <span>Secured Transmission</span>
                          <span>Concierge Support</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          className="flex-1 h-14 rounded-full border-2 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-xs"
                          disabled={isProcessing}
                        >
                          Revise Particulars
                        </Button>
                        <Button
                          onClick={handlePayment}
                          className="flex-1 h-14 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary font-bold uppercase tracking-widest text-xs shadow-xl transition-all"
                          disabled={!bookingData.terms || isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                              Securing Residence...
                            </div>
                          ) : (
                            `Confirm Booking - ₦${total.toLocaleString()}`
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary Sidebar - Boutique Concierge Slip */}
            {step > 1 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white border border-secondary/20 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-primary/5 p-4 border-b border-primary/10">
                      <h3 className="font-heading text-lg font-bold text-primary italic">Concierge Slip</h3>
                    </div>

                    <div className="p-6 space-y-6">
                      {selectedRoomData && (
                        <>
                          <div className="relative aspect-video rounded-xl overflow-hidden shadow-inner group">
                            <Image
                              src={selectedRoomData.image || "/placeholder.svg"}
                              alt={selectedRoomData.name}
                              fill
                              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <h3 className="text-white font-heading font-bold italic">{selectedRoomData.name}</h3>
                              <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">₦{selectedRoomData.price.toLocaleString()} / Night</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-secondary/20">
                              <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-tighter font-bold text-muted-foreground">Check-In</span>
                                <p className="text-xs font-bold text-primary italic">{bookingData.checkIn || "Date TBD"}</p>
                              </div>
                              <div className="space-y-1 text-right">
                                <span className="text-[9px] uppercase tracking-tighter font-bold text-muted-foreground">Check-Out</span>
                                <p className="text-xs font-bold text-primary italic">{bookingData.checkOut || "Date TBD"}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Nights</span>
                                  <span className="text-sm font-bold italic">{nights}</span>
                                </div>
                                <div className="w-px h-6 bg-secondary/20" />
                                <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Guests</span>
                                  <span className="text-sm font-bold italic">{bookingData.guests}</span>
                                </div>
                                <div className="w-px h-6 bg-secondary/20" />
                                <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Rooms</span>
                                  <span className="text-sm font-bold italic">{bookingData.rooms}</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-secondary/10">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Pricing Model</span>
                                <span className="text-[10px] font-bold">₦{selectedRoomData.price.toLocaleString()} Base</span>
                              </div>
                              <div className="flex justify-between items-baseline pt-2">
                                <span className="font-heading italic font-bold text-primary">Total Investment</span>
                                <span className="text-2xl font-bold text-secondary italic">₦{total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Trust Badge Section */}
                  <div className="p-6 border border-secondary/10 rounded-2xl bg-white/50 backdrop-blur-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Best Rate Guaranteed</p>
                        <p className="text-[9px] text-muted-foreground">Direct booking at Chiben Leisure sanctuary.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
