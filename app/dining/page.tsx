import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: "Dining",
  description: "Experience exceptional dining at Chiben Leisure Hotels. Mediterranean restaurant, pool bar, and room service in a refined atmosphere.",
  openGraph: {
    title: "Dining at Chiben Leisure Hotels",
    description: "Experience exceptional dining at Chiben Leisure Hotels. Mediterranean restaurant, pool bar, and room service in a refined atmosphere.",
  },
}

export default function DiningPage() {
  const restaurants = [
    {
      name: "Mediterranean Restaurant",
      description:
        "Opens for buffet and alacart. It offers Nigerian and continental dishes (ie Mediterranean specialities) with ever friendly and experience staff ready to please and delight you. The restaurant opens 7 days a week serving buffet breakfast, lunch and dinner.",
      hours:
        "Opens daily for buffet and à la carte. Closed for dinner on Friday. Closed for lunch on Saturday. Closed for dinner on Saturday. Closed for lunch on Sunday.",
      location: "Restaurant Floor",
      image: "/images/hero/slide3.jpg",
      capacity: 46,
      specialties: ["Mediterranean specialities", "Nigerian & Continental dishes"],
    },
    {
      name: "Room Service",
      description:
        "Our room service is 24hrs and order takes a maximum of 30 minutes to be served to you, offering mouth watering Nigerian and Continental specialities.",
      hours: "24 hours — orders served within 30 minutes",
      location: "Available to all rooms",
      image: "/images/hero/slide2.jpg",
      specialties: ["Nigerian specialties", "Continental specialties"],
    },

    {
      name: "Pastry Corner",
      description:
        "A place you can have your snacks quickly if you are on the move. It serves varieties of pastries, pop corn, and ice cream etc. You can place order for your wedding and birthday anniversary cakes at the pastry corner. This section also opens from Monday to Sunday and opens from 7am to 11pm.",
      hours: "Daily: 7:00 AM - 11:00 PM",
      location: "Pastry / Café area",
      // image: "/pastry_corner_display.png",
      specialties: ["Pastries", "Ice cream", "Celebration cakes (pre-order)"],
    },



    {
      name: "Harbour Bar",
      description:
        "Our harbour bar is a quiet bar located at the ground floor and it is a place where you can relax over your cocktail and drink watching super sports etc. It opens 7 days in a week from 7am to 11pm daily.",
      hours: "Daily: 7:00 AM - 11:00 PM",
      location: "Ground Floor",
      // image: "/harbour_bar_interior.png",
      specialties: ["Cocktails", "Sports viewing", "Quiet atmosphere"],
    },
    {
      name: "Le Splash Bar / Restaurant",
      description:
        "This is a bar and a restaurant by the poolside, which attracts families during the weekends, it serves dinner buffet on Fridays, lunch and dinner buffet on Saturdays, lunch on Sundays with live band playing. It also serves barbecue beside the buffet on weekends.",
      hours:
        "Fridays: Dinner buffet | Saturdays: Lunch & Dinner buffet (barbecue on weekends) | Sundays: Lunch with live band",
      location: "Poolside",
      // image: "/le_splash_poolside_bar.png",
      specialties: ["Weekend buffet", "Barbecue", "Family dining"],
    },
    {
      name: "Le Gwari Bar Lounge",
      description:
        "This is the lobby bar of the hotel where our in-house and walk in guests experience the best of relaxation over their cocktails and drinks with a live band that plays old and contemporary Nigerian music. alacart service is also available if you don’t want the buffet at the Restaurant. The bar opens seven days a week from 7am to 2am daily.",
      hours: "Daily: 7:00 AM - 2:00 AM",
      location: "Lobby",
      // image: "/le_gwari_bar_lounge_interior.png",
      specialties: ["Cocktails", "À la carte service", "Live band"],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Nicon Luxury Hotel Dining"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance">
            Culinary Excellence
          </h1>
          <p className="text-xl md:text-2xl text-white/90 text-balance">
            Savor exceptional dining experiences from around the world
          </p>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16">
          {restaurants.map((restaurant, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={restaurant.image ? "grid md:grid-cols-2 gap-0" : ""}>
                {restaurant.image && (
                  <div className={`relative h-80 md:h-auto ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <Image
                      src={restaurant.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-8 flex flex-col justify-center">
                  <h2 className="font-heading text-3xl font-bold mb-4">{restaurant.name}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {restaurant.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{restaurant.hours}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{restaurant.location}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.map((specialty, i) => (
                        <span key={i} className="px-3 py-1 bg-muted text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-fit">
                    <Link href="/contact">Make a Reservation</Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
