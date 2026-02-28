"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"

export default function ContactPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      // Use local Next.js API route as proxy to avoid CORS issues
      const response = await fetch(`/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Contact API error:", errorData)
        const errorMessage = errorData.error || errorData.message || `Server error (${response.status})`
        throw new Error(errorMessage)
      }

      const result = await response.json()

      setSubmitStatus({
        type: "success",
        message: "Thank you for contacting us! We'll get back to you shortly.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" })
      }, 5000)
    } catch (error) {
      console.error("Contact form error:", error)
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
    {
      icon: Mail,
      title: "Email",
      details: ["info@chibenleisurehotels.com"],
    },
    {
      icon: Clock,
      title: "Reception Hours",
      details: ["24/7 Front Desk", "Check-in: 1:00 PM", "Check-out: 12:00 PM"],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <Image src="/images/hero/hero-bg.jpg" alt="Contact Us" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 text-balance">Contact Us</h1>
          <p className="text-xl md:text-2xl text-white/90 text-balance">We&apos;re here to assist you 24/7</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Contact Form and Map */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">Send Us a Message</h2>

            {/* Success Message */}
            {submitStatus.type === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">{submitStatus.message}</p>
                  </div>
                  <button
                    onClick={() => setSubmitStatus({ type: null, message: "" })}
                    className="text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus.type === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">{submitStatus.message}</p>
                  </div>
                  <button
                    onClick={() => setSubmitStatus({ type: null, message: "" })}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="mt-2"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Map */}
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">Find Us</h2>
            <Card className="overflow-hidden h-[500px]">
              <div className="relative w-full h-full bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.9876543210123!2d7.4905!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDMnMjguNCJOIDfCsDI5JzI1LjgiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chiben Leisure Hotels Location"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <info.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold mb-3">{info.title}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
