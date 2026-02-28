import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gift, Percent, Star, Tag } from "lucide-react"

export default function OffersPage() {
  const offers = [

    {
      title: "Extended Stay Offer",
      discount: "10% OFF",
      description: "Stay 7 nights or more and enjoy significant savings plus complimentary airport transfers.",
      validUntil: "March 31, 2026",
      terms: ["Minimum 7 nights", "Free airport transfers", "Daily housekeeping"],
      image: "/images/hero/slide1.jpg",
      badge: "New",
      badgeVariant: "destructive" as const,
    },
    {
      title: "Business Traveler Package",
      discount: "15% OFF",
      description:
        "Perfect for corporate guests with meeting room access, high-speed WiFi, and business center privileges.",
      validUntil: "Ongoing",
      terms: ["Valid Monday-Thursday", "Meeting room credits", "Express check-in/out"],
      image: "/images/hero/slide3.jpg",
      badge: null,
      badgeVariant: "default" as const,
    },
    {
      title: "Family Fun Package",
      discount: "Kids Stay Free",
      description: "Children under 12 stay free with complimentary breakfast and access to all family facilities.",
      validUntil: "Ongoing",
      terms: ["Up to 2 children free", "Family breakfast included", "Pool and game room access"],
      image: "/images/hero/slide4.jpg",
      badge: null,
      badgeVariant: "default" as const,
    },
  ]

  const seasonalOffers = [
    {
      icon: Gift,
      title: "Holiday Season Special",
      description: "Exclusive rates for the festive season with special amenities",
    },
    {
      icon: Star,
      title: "Loyalty Rewards",
      description: "Join our loyalty program and earn points on every stay",
    },
    {
      icon: Percent,
      title: "Multiple booking ",
      description: "Exclusive rates for multiple bookings ",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="/images/hero/slide5.jpg"
          alt="Special Offers"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Tag className="h-12 w-12 mx-auto mb-4" />
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance">Special Offers</h1>
          <p className="text-xl md:text-2xl text-white/90 text-balance">
            Discover exclusive deals and packages for your perfect stay
          </p>
        </div>
      </section>

      {/* Main Offers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Current Offers</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take advantage of our limited-time promotions and special packages
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {offer.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge variant={offer.badgeVariant}>{offer.badge}</Badge>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold text-lg">
                  {offer.discount}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-heading text-2xl font-bold mb-3">{offer.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{offer.description}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>Valid until: {offer.validUntil}</span>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-sm">Terms & Conditions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {offer.terms.map((term, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/booking">Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Seasonal Offers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4">More Ways to Save</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Additional offers and benefits for our valued guests
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {seasonalOffers.map((offer, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <offer.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold mb-3">{offer.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{offer.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Clock className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-heading text-4xl font-bold mb-4">Never Miss an Offer</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Subscribe to our newsletter and be the first to know about exclusive deals and promotions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg">Subscribe</Button>
          </div>
        </div>
      </section> */}
    </div>
  )
}
