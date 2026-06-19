import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Presentation, Briefcase, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: "Events & Conferences",
  description: "Host your next event at Chiben Leisure Hotels. Conference facilities for up to 1000 guests, banquet halls, meeting rooms, and full event support services.",
  openGraph: {
    title: "Events & Conferences at Chiben Leisure Hotels",
    description: "Host your next event at Chiben Leisure Hotels. Conference facilities for up to 1000 guests, banquet halls, meeting rooms, and full event support services.",
  },
}

export default function EventsPage() {

  const conferenceInfo = {
    title: "Conference & Banqueting",
    description:
      "We provide Conference & Banqueting with one ballroom and 20 air‑conditioned meeting rooms, a main hall (up to 1000 for concerts / 500 for dinners), two smaller halls (150 and 100 capacity), and full event support including catering, AV, translation, teleconferencing, decoration, and business‑centre services",
  }

  const conferenceHalls = [
    {
      name: "The Conference Hall",
      description:
        "Equipped with state‑of‑the‑art conference and meeting facilities, the hall includes a large foyer suitable for exhibitions and cocktail receptions. Ideal for concerts, large conferences and banquet events.",
      capacity: {
        concerts: "Up to 1000 persons",
        dinnerAndConferences: "Up to 500 persons",
      },
      features: ["Large foyer for exhibitions & cocktails", "State‑of‑the‑art AV & lighting", "Flexible seating/layouts", "On‑site event support"],
      image: "/images/hero/slide1.jpg",
    },
    {
      name: "Nnamdi Azikwe Hall",
      description:
        "Overlooking the pool and fitted with audio‑visual equipment, this hall is suitable for medium sized functions, presentations and social gatherings.",
      capacity: "Up to 150 persons",
      features: ["Poolside views", "Integrated AV equipment", "Air‑conditioned"],
      // image: "/conferenceTwo.jpg",
    },
    {
      name: "Obafemi Awolowo Hall",
      description:
        "Tastefully designed with marble flooring and panel finishes, this hall offers an elegant setting for meetings, workshops and private functions.",
      capacity: "Up to 100 persons",
      features: ["Marble floor & panel finish", "Elegant interior", "Ideal for executive meetings"],
      // image: "/conferenceTwo.jpg",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 flex items-center justify-center">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Nicon Luxury Hotel Events"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance ">
            Our Event Venues
          </h1>
          <p className="text-lg md:text-xl text-white/90 text-balance">
            {conferenceInfo.description}
          </p>
        </div>
      </section>

      {/* Venues */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-2 gap-8">
            {conferenceHalls.map((venue, index) => (
              <Card key={index} className="overflow-hidden">
                {venue.image && (
                  <div className="relative h-64">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-heading text-2xl font-bold mb-4">{venue.name}</h3>

                  {/* Capacity block - handle both object and string shapes */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    {typeof venue.capacity === "object" ? (
                      <div className="space-y-1">
                        {venue.capacity.concerts && (
                          <p className="font-semibold">Concerts: {venue.capacity.concerts}</p>
                        )}
                        {venue.capacity.dinnerAndConferences && (
                          <p className="font-semibold">Dinner & Conferences: {venue.capacity.dinnerAndConferences}</p>
                        )}
                      </div>
                    ) : (
                      <p className="font-semibold">{venue.capacity}</p>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Features:</p>
                    <ul className="space-y-1">
                      {venue.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold mb-4">Event Services</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
            Comprehensive support to ensure your event is flawless
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <Card>
            <CardContent className="p-6">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Event Planning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dedicated event coordinators to help plan every detail of your event
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Presentation className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">AV Equipment</h3>
              <p className="text-muted-foreground leading-relaxed">
                State-of-the-art audio-visual equipment and technical support
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Catering Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                Customized menus and professional catering for all event types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Briefcase className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold mb-2">Business Centre</h3>
              <p className="text-muted-foreground leading-relaxed">
                Internet, document scanning and printing, photocopying, stationery, POS, laminating.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/80 text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold mb-6 text-balance">
            Plan Your Next Event With Us
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 text-balance">
            Contact our events team to discuss your requirements and receive a customized proposal
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Request Event Proposal</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
