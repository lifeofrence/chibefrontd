"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<{ src: string, title: string } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "The Collection" },
    { id: "rooms", name: "Residences" },
    { id: "wellness", name: "Wellness" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "events", name: "Events" },
    { id: "exterior", name: "Architecture" },
  ]

  const images = [
    // Wellness (Gym, Pool, Spa, Saloon)
    { src: "/images/Gallery/pool.jpg", category: "wellness", title: "Azure Infinity Pool", size: "large" },
    { src: "/images/Gallery/gym.jpg", category: "wellness", title: "Elite Gymnasium", size: "small" },
    { src: "/images/Gallery/spa.jpg", category: "wellness", title: "Serenity Spa", size: "small" },
    { src: "/images/Gallery/saloon.jpg", category: "wellness", title: "The Royal Saloon", size: "small" },
    { src: "/images/Gallery/poolbar.jpg", category: "wellness", title: "Poolside Oasis", size: "small" },

    // Lifestyle (Lounge, Garden, Dining)
    { src: "/images/Gallery/garden.jpg", category: "lifestyle", title: "Secret Garden Sanctuary", size: "large" },
    { src: "/images/Gallery/lounge.jpg", category: "lifestyle", title: "The Velvet Lounge", size: "small" },
    { src: "/images/Gallery/food.JPG", category: "lifestyle", title: "Epicurean Delights", size: "small" },
    { src: "/images/Gallery/VIP_Bar_2.jpg", category: "lifestyle", title: "VIP Enclave", size: "small" },

    // Events (Banquet Hall)
    { src: "/images/Banquet Hall/hall 1.JPG", category: "events", title: "Grand Banquet Hall", size: "large" },
    { src: "/images/Banquet Hall/hall 5.JPG", category: "events", title: "Gala Ambiance", size: "small" },
    { src: "/images/Banquet Hall/hall 10.JPG", category: "events", title: "Corporate Excellence", size: "small" },
    { src: "/images/Banquet Hall/hall 15.JPG", category: "events", title: "Celebration Suite", size: "small" },

    // Residences (Rooms)
    { src: "/images/rooms/presidential.jpg", category: "rooms", title: "The Presidential Suite", size: "large" },
    { src: "/images/rooms/royal.jpg", category: "rooms", title: "Royal Sanctuary", size: "small" },
    { src: "/images/rooms/deluxe.jpg", category: "rooms", title: "Deluxe Comfort", size: "small" },
    { src: "/images/rooms/standard.jpg", category: "rooms", title: "Boutique Residence", size: "small" },
    { src: "/images/rooms/studio.jpg", category: "rooms", title: "Studio Haven", size: "small" },
  ]

  const filteredImages = selectedCategory === "all" ? images : images.filter((img) => img.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      {/* Premium Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero/slide1.jpg"
          alt="Gallery Banner"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fcfbf7]" />
        <div className="relative z-10 text-center text-white px-4">
          <span className="text-xs font-bold uppercase tracking-[0.4em] mb-4 block text-secondary">A Visual Anthology</span>
          <h1 className="font-heading text-5xl md:text-7xl font-bold italic tracking-tight mb-2">
            The Gallery
          </h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
            Witness the synthesis of post-modern architecture and world-class hospitality at Chiben Leisure.
          </p>
        </div>
      </section>

      {/* Category Filter - Refined */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 sticky top-20 bg-[#fcfbf7]/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border",
                  selectedCategory === category.id
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : "bg-transparent text-primary/60 border-primary/10 hover:border-secondary hover:text-secondary"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Masonry-ish Layout */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-[2.5rem] shadow-2xl cursor-pointer bg-white border border-primary/5 transition-all duration-700 hover:-translate-y-2",
                image.size === "large" ? "md:col-span-2 md:row-span-1" : "col-span-1"
              )}
              onClick={() => setSelectedImage({ src: image.src, title: image.title })}
            >
              <div className={cn(
                "relative w-full overflow-hidden",
                image.size === "large" ? "aspect-[21/9]" : "aspect-[4/5]"
              )}>
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />

                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {image.category}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white italic mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    {image.title}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-300">
                    <Maximize2 className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal - Premium */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-primary/95 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-secondary rounded-full transition-all group z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
          </button>

          <div className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center">
            <div className="relative w-full h-[80vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="mt-8 text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-heading text-3xl font-bold text-white italic mb-2">{selectedImage.title}</h2>
              <div className="w-12 h-0.5 bg-secondary mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Explore More Invitation */}
      <section className="py-24 px-4 bg-primary text-center">
        <h2 className="font-heading text-4xl font-bold text-white italic mb-8">Ready to witness this grandeur in person?</h2>
        <Button size="lg" className="rounded-full bg-secondary text-primary font-bold uppercase tracking-widest text-xs h-16 px-12 hover:scale-105 transition-transform" asChild>
          <a href="/booking">Reserve Your Room</a>
        </Button>
      </section>
    </div>
  )
}

