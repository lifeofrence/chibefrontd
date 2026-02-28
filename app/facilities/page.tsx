"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Waves, Sparkles, Trophy, Bath, Trees, Shield, Scissors, Coffee, GlassWater, Landmark, Flower2 } from "lucide-react"

export default function FacilitiesPage() {
  const facilities = [
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Gym",
      description:
        "Cultivate wellness in our elite gymnasium. Featuring state-of-the-art cardiovascular and weight-training equipment, tailored for those who demand excellence in their fitness journey.",
      image: "/images/Gallery/gym.jpg",
    },
    {
      icon: <Waves className="h-6 w-6" />,
      title: " Pool",
      description:
        "Discover serenity in our recently renovated infinity pool. A sanctuary designed for deep relaxation, perfectly suited for morning laps or sunset cocktail events.",
      image: "/images/Gallery/pool.jpg",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Spa",
      description:
        "Professional massage therapy and holistic treatments designed to align mind and body. Experience tranquility curated by our master therapists.",
      image: "/images/Gallery/spa.jpg",
    },
    {
      icon: <Scissors className="h-6 w-6" />,
      title: "Saloon",
      description:
        "Professional grooming and beauty services delivered in a sophisticated environment. Excellence in every detail.",
      image: "/images/Gallery/saloon.jpg",
    },
    {
      icon: <GlassWater className="h-6 w-6" />,
      title: "Lounge",
      description:
        "A quiet, sophisticated space for relaxation over signature cocktails and fine spirits. The perfect setting for evening reflection.",
      image: "/images/Gallery/lounge.jpg",
    },
    {
      icon: <Landmark className="h-6 w-6" />,
      title: "Banquet Hall",
      description:
        "Our majestic event venue for weddings, conferences, and gala dinners. Equipped with high-tech AV and elegant furnishings.",
      image: "/images/Banquet Hall/hall 1.JPG",
    },
    {
      icon: <Flower2 className="h-6 w-6" />,
      title: "The Garden ",
      description:
        "Lush greenery and serene outdoor spaces designed for quiet contemplation or elegant garden gatherings.",
      image: "/images/Gallery/garden.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      {/* Premium Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Chiben Leisure Sanctuary Facilities"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fcfbf7]" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          {/* <span className="text-xs font-bold uppercase tracking-[0.4em] mb-4 block text-secondary">The Sanctuary Amenities</span> */}
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 italic tracking-tight">
            Facilities
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Experience a world where every detail is designed for your rejuvenation. From high-performance fitness to deep-tissue serenity.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {facilities.map((facility, index) => (
            <Card key={index} className="group border-none shadow-none bg-transparent overflow-hidden">
              <div className="relative h-80 rounded-3xl overflow-hidden mb-6 shadow-xl">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                  {facility.icon}
                </div>
              </div>
              <CardContent className="p-0">
                <h3 className="font-heading text-2xl font-bold mb-3 italic group-hover:text-secondary transition-colors underline decoration-secondary/0 group-hover:decoration-secondary/100 decoration-2 underline-offset-8">
                  {facility.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {facility.description}
                </p>
                {/* <Link href="/booking" className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-4 transition-all group-hover:text-secondary">
                  Access <span className="text-lg">→</span>
                </Link> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Concierge Invitation */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-20 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white italic">
              Awaiting Your Arrival
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Every facility at Chiben Leisure is curated to offer more than just an activity; we offer an experience that restores the soul.
            </p>
            <Button size="lg" className="h-16 px-10 rounded-full bg-secondary text-primary font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform" asChild>
              <Link href="/booking">Book your Stay with us </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

