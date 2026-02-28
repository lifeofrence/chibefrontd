"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Star, MapPin, Check, Calendar, ChevronRight, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Shield, Sparkles, Building2 } from "lucide-react"
import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const router = useRouter()
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [minDate, setMinDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    }
    fetchEvents()
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const response = await fetch(`/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || `Server error (${response.status})`
        throw new Error(errorMessage)
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you for contacting us! We'll get back to you shortly.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" })
      }, 5000)
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["Chiben Leisure Hotels", "No. 41 Regina Caeli Road", "Off Enugu-Onitsha Expressway", "Awka, Anambra State, Nigeria"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 901 533 3488"],
    },
  ]

  const slides = [
    "/images/hero/slide1.jpg",
    "/images/hero/slide2.jpg",
    "/images/hero/slide3.jpg",
    "/images/hero/slide4.jpg",
    "/images/hero/slide5.jpg",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    // Get today's date
    const today = new Date()
    const todayString = formatDateToInput(today)

    // Get tomorrow's date
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowString = formatDateToInput(tomorrow)

    setMinDate(todayString)
    setCheckInDate(todayString)
    setCheckOutDate(tomorrowString)
  }, [])

  // Helper function to format date as DD-MM-YYYY for display
  const formatDateToDisplay = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}-${month}-${year}`
  }

  // Helper function to format date as YYYY-MM-DD for input value
  const formatDateToInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Handle check-in change and ensure check-out is at least the next day
  const handleCheckInChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCheckInDate(value)

    // If check-out is not set or is on/before the new check-in date, set it to the following day
    if (!checkOutDate || checkOutDate <= value) {
      const nextDay = new Date(value)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOutDate(formatDateToInput(nextDay))
    }
  }

  const handleCheckAvailability = () => {
    // encode params and navigate to booking page
    const params = new URLSearchParams({
      checkIn: checkInDate || "",
      checkOut: checkOutDate || "",
      guests: String(guests || 1),
    })
    router.push(`/booking?${params.toString()}`)
  }






  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide}
              alt={`Chiben Leisure Hotels Slide ${index + 1}`}
              fill
              priority={index === 0}
              className={cn(
                "object-cover transition-transform duration-[5000ms]",
                index === currentSlide ? "animate-kenburns" : "scale-110"
              )}
            />
          </div>
        ))}
        {/* Black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 pointer-events-none" />

        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            {/* <h1 className="font-heading text-5xl md:text-8xl font-bold mb-6 text-balance leading-tight">
              Experience Unparalleled
              <span className="text-secondary block mt-2">Luxury in Awka</span>
            </h1> */}
            {/* <p className="text-xl md:text-2xl mb-12 text-pretty leading-relaxed text-white/90 max-w-3xl mx-auto font-sans tracking-wide">
              Discover exceptional hospitality and unforgettable experiences in the heart of Anambra State.
            </p> */}

            {/* Integrated Booking Form */}
            <div className="bg-white/10 backdrop-blur-xl p-2 md:p-3 border border-white/20 max-w-5xl mx-auto shadow-2xl mt-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="text-left bg-white/5 p-4 border border-white/10">
                  <label className="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    min={minDate}
                    onChange={handleCheckInChange}
                    className="w-full bg-transparent text-white focus:outline-none [color-scheme:dark] text-sm font-medium"
                  />
                </div>
                <div className="text-left bg-white/5 p-4 border border-white/10">
                  <label className="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    min={checkInDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-transparent text-white focus:outline-none [color-scheme:dark] text-sm font-medium"
                  />
                </div>
                <div className="text-left bg-white/5 p-4 border border-white/10">
                  <label className="block text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Guests</label>
                  <select
                    value={guests.toString()}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-white focus:outline-none [color-scheme:dark] text-sm font-medium appearance-none"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
                <Button
                  onClick={handleCheckAvailability}
                  className="w-full h-full text-sm font-bold uppercase tracking-widest py-6 px-10 rounded-none bg-secondary text-primary hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Find Rooms
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>



      {/* For Your Comfort Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            {/* Visual Composition */}
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-[4/5] z-10 overflow-hidden shadow-2xl animate-drift">
                <Image
                  src="/images/hero/slide2.jpg"
                  alt="Chiben Leisure Hotels Architecture"
                  fill
                  className="object-cover animate-kenburns"
                />
              </div>
              {/* Artistic Accents */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 -z-0" />
              <div className="absolute -bottom-12 -right-12 w-80 h-96 border border-secondary/30 -z-0" />

              {/* Secondary Floating Image */}
              <div className="absolute top-1/2 -right-16 translate-y-[-50%] w-56 h-72 z-20 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] hidden lg:block border-[12px] border-white animate-float">
                <Image
                  src="/images/hero/slide4.jpg"
                  alt="Boutique Luxury Ambiance"
                  fill
                  className="object-cover animate-kenburns [animation-delay:-5s]"
                />
              </div>
            </div>

            {/* Context */}
            <div className="lg:w-1/2">
              <div className="mb-12">
                <span className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] block mb-6">Introduction</span>
                <h2 className="font-heading text-4xl md:text-6xl font-bold text-primary leading-tight mb-8">
                  For Your <br /><span className="text-secondary italic">Exquisite</span> Comfort
                </h2>
                <div className="w-20 h-1 bg-secondary mb-10" />
              </div>

              <div className="space-y-8 text-muted-foreground text-lg leading-relaxed font-sans">
                <p className="first-letter:text-5xl first-letter:font-heading first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                  Chiben Leisure Hotels & Hotel Limited, serving hospitality across Anambra State in Nigeria, is a perfect choice for business and leisure traveler alike.
                </p>
                <p>
                  Situated at No 41, Regina Ceali Road, off Enugu-Onitsha Expressway in Awka, Our 100+ room and Banquet Hall facility are a commercial, eco-friendly & post-modern high tech building sheath in aplitic and glass with capsule elevators which allows both business and leisure travelers enjoy luxury and modern facilities in a unique boutique ambiance.
                </p>
              </div>

              <div className="mt-16 pt-10 border-t border-secondary/20 flex flex-wrap gap-10 md:gap-16">
                <div className="flex flex-col">
                  <span className="text-4xl font-heading font-bold text-primary">100+</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mt-1">Luxury Rooms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-heading font-bold text-primary">1</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mt-1">Banquet Halls</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-heading font-bold text-primary">24/7</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mt-1">Luxury Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Sanctuary */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-4 text-primary italic">Our Rooms</h2>
            <div className="w-24 h-0.5 bg-secondary mx-auto mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans tracking-wide">
              Experience the art of living in our meticulously curated collection of rooms and suites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 lg:gap-16">
            {[
              {
                name: "Studio Room",
                price: "₦30,000",
                image: "/images/rooms/studio.jpg",
                size: "25 SQM",
              },
              {
                name: "Standard Room",
                price: "₦70,000",
                image: "/images/rooms/standard.jpg",
                size: "30 SQM",
              },
              {
                name: "Deluxe Suite",
                price: "₦80,000",
                image: "/images/rooms/deluxe.jpg",
                size: "40 SQM",
                featured: true,
              },
              {
                name: "Premium Room",
                price: "₦90,000",
                image: "/images/rooms/premium.jpg",
                size: "45 SQM",
              },
              {
                name: "Mini Suite",
                price: "₦100,000",
                image: "/images/rooms/mini.jpg",
                size: "50 SQM",
              },
              {
                name: "Royal Suite",
                price: "₦150,000",
                image: "/images/rooms/royal.jpg",
                size: "65 SQM",
                featured: true,
              },
              {
                name: "Royal Classic",
                price: "₦200,000",
                image: "/images/rooms/royal-classic.jpg",
                size: "70 SQM",
              },
              {
                name: "Executive Apt",
                price: "₦200,000",
                image: "/images/rooms/executive.jpg",
                size: "120 SQM",
              },
              {
                name: "Presidential",
                price: "₦300,000",
                image: "/images/rooms/presidential.jpg",
                size: "250 SQM",
                featured: true,
              },
            ].map((room, index) => (
              <div
                key={index}
                className={cn(
                  "group relative transition-all duration-1000",
                  room.featured ? "lg:-translate-y-8" : "lg:translate-y-4"
                )}
              >
                <div className="relative aspect-[3/4] overflow-hidden group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700" />
                </div>

                <div className="mt-8 text-center px-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold mb-3">{room.size}</p>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-2 tracking-tight">{room.name}</h3>
                  <p className="text-primary/60 font-sans text-sm mb-6 pb-6 border-b border-secondary/20 inline-block px-8">From {room.price} / Night</p>

                  <div className="flex flex-col items-center gap-4">
                    <Link
                      href="/rooms"
                      className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary hover:text-secondary transition-colors"
                    >
                      Explore Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-24">
            <Button variant="outline" asChild className="rounded-none border-primary text-primary px-12 py-8 hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-xs font-bold">
              <Link href="/rooms">View all residences</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Upcoming Events Section */}
      <section className="py-24 bg-[#1a0101] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <div className="inline-block px-3 py-1 bg-secondary/20 border border-secondary/30 rounded-full mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary">What&apos;s On</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Upcoming <span className="text-secondary italic">Events</span> & Celebrations
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed font-sans">
                From vibrant cultural nights to grand seasonal festivities, Chiben Leisure is where Awka comes together to celebrate life.
              </p>
              <Button variant="outline" className="rounded-none border-white/20 text-white hover:bg-white hover:text-primary px-8 py-6 uppercase tracking-widest text-xs font-bold">
                View All Events
              </Button>
            </div>

            <div className="lg:w-2/3 w-full space-y-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 border border-white/10 p-8 flex items-center gap-8 transition-all duration-500 hover:bg-white/10 hover:border-secondary/40 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center min-w-[80px] h-[80px] bg-secondary text-primary">
                    <span className="text-2xl font-bold leading-none">{event.day}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest mt-1">{event.month}</span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-heading text-xl font-bold mb-2 group-hover:text-secondary transition-colors">{event.title}</h4>
                    <p className="text-white/50 text-sm line-clamp-2">{event.description}</p>
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-full group-hover:bg-secondary group-hover:border-secondary transition-all duration-500">
                    <ChevronRight className="h-5 w-5 text-white group-hover:text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Why Chiben Leisure Hotels - Redesigned Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] block mb-4 text-center">The Chiben Experience</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary italic">Why Choose Chiben?</h2>
            <div className="w-20 h-0.5 bg-secondary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Feature 1: Modern Marvel */}
            <div className="group p-8 rounded-[2.5rem] bg-[#fcfbf7] border border-secondary/10 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-4 italic">Modern Architectural Marvel</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans mb-6">
                A post-modern, eco-friendly masterpiece sheathed in aplitic glass, featuring iconic capsule elevators and world-class boutique ambiance.
              </p>
              <ul className="space-y-3">
                {["100+ Luxury Residences", " Banquet Halls", "Capsule Elevators"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                    <Check className="h-3 w-3 text-secondary" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 2: Holistic Wellness */}
            <div className="group p-8 rounded-[2.5rem] bg-primary text-white border border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:-translate-y-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-4 italic text-secondary">Holistic Rejuvenation</h3>
              <p className="text-white/70 text-sm leading-relaxed font-sans mb-6">
                From our 24-hour elite gymnasium to the Soul & Body Spa, we curate every facility for your absolute physical and mental restoration.
              </p>
              <ul className="space-y-3">
                {["Elite 24/7 Gymnasium", "Serenity Spa & Salon", "Infinity Pool & Bar"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary">
                    <Check className="h-3 w-3" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 3: Strategic heart */}
            <div className="group p-8 rounded-[2.5rem] bg-[#fcfbf7] border border-secondary/10 hover:border-secondary/30 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-4 italic">Strategic Urban Heart</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans mb-6">
                Situated at the pulse of Awka, we offer unparalleled proximity to major medical, administrative, and educational landmarks.
              </p>
              <ul className="space-y-4">
                {[
                  { label: "3 Mins", desc: "Regina Caeli Hospital" },
                  { label: "7 Mins", desc: "Ekwueme Square" },
                  { label: "10 Mins", desc: "Unizik Campus" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between border-b border-secondary/10 pb-2 last:border-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.desc}</span>
                    <span className="text-[10px] font-bold text-secondary">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-20 relative rounded-[3rem] overflow-hidden group shadow-2xl h-[400px]">
            <Image
              src="/images/hero/slide1.jpg"
              alt="Experience Nicon Luxury"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[3s]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent p-12 flex flex-col justify-center items-start text-white">
              <h3 className="font-heading text-3xl md:text-5xl font-bold mb-6 max-w-xl italic">Ready to experience the heights of luxury?</h3>
              <Button asChild size="lg" className="rounded-full bg-secondary text-primary font-bold uppercase tracking-widest text-xs h-14 px-10 hover:scale-105 transition-transform">
                <Link href="/rooms">Begin Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section Integrated */}
      <section className="py-24 bg-[#fcfbf7]" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold uppercase tracking-[0.4em] text-[10px] block mb-4">Get In Touch</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary italic">Contact Our Concierge</h2>
            <div className="w-20 h-0.5 bg-secondary mx-auto mt-6" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-secondary/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="font-heading text-2xl font-bold italic">Send Us a Message</h2>
                  <div className="flex items-center gap-2 mt-2 text-secondary">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">info@chibenleisurehotels.com</span>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {submitStatus.type === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-green-800 text-sm">{submitStatus.message}</p>
                    <button onClick={() => setSubmitStatus({ type: null, message: "" })} className="text-green-600 hover:text-green-800 ml-auto">✕</button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus.type === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="font-medium text-red-800 text-sm">{submitStatus.message}</p>
                    <button onClick={() => setSubmitStatus({ type: null, message: "" })} className="text-red-600 hover:text-red-800 ml-auto">✕</button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="rounded-xl border-secondary/20 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="rounded-xl border-secondary/20 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="How can we assist you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="rounded-xl border-secondary/20 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="rounded-xl border-secondary/20 resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-14 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary font-bold uppercase tracking-widest text-xs transition-all" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Dispatching Message..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Map and Info */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-white p-6 rounded-3xl border border-secondary/10 shadow-sm hover:shadow-md transition-shadow">
                    <info.icon className="h-6 w-6 text-secondary mb-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white h-[350px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d7.062145!3d6.216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104312ce0b3e64f9%3A0xe5495b28db44a36e!2sChiben+Leisure+Hotels!5e0!3m2!1sen!2sng!4v1714300000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chiben Leisure Hotels Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
