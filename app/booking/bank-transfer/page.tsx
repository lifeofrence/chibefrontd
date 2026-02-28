"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, Copy, Clock, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react"

export default function BankTransferPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("ref")

  // Mock transfer data - in a real app, this would be fetched from API
  const transferDetails = {
    reference: reference || "REF123456789",
    amount: 483750,
    accountName: "Nicon Luxury Hotel Limited",
    accountNumber: "0123456789",
    bankName: "First Bank of Nigeria",
    sortCode: "011",
    expiryTime: "2024-01-11T14:30:00Z", // 24 hours from booking
    bookingId: "BK001",
    guestName: "Sarah Johnson",
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const timeRemaining = () => {
    const now = new Date()
    const expiry = new Date(transferDetails.expiryTime)
    const diff = expiry.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-muted-foreground text-lg">Please transfer the amount below to confirm your booking</p>
        </div>

        {/* Payment Deadline */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Payment Deadline</h3>
                <p className="text-orange-700">
                  Complete payment within <strong>{timeRemaining()}</strong> to secure your booking
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Expires: {new Date(transferDetails.expiryTime).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bank Transfer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Amount to Transfer</p>
                <p className="text-3xl font-bold text-primary">₦{transferDetails.amount.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-medium">{transferDetails.accountName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transferDetails.accountName, "Account name")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-medium text-lg">{transferDetails.accountNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transferDetails.accountNumber, "Account number")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{transferDetails.bankName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transferDetails.bankName, "Bank name")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-medium">{transferDetails.reference}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transferDetails.reference, "Reference")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Important:</p>
                    <p>
                      Please use the reference number <strong>{transferDetails.reference}</strong> when making the
                      transfer to ensure quick processing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions & Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>Log into your mobile banking app or visit your bank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>Select Transfer to Other Banks or Interbank Transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>Enter the account details provided above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>Enter the exact amount: ₦{transferDetails.amount.toLocaleString()}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      5
                    </span>
                    <span>Use reference: {transferDetails.reference}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      6
                    </span>
                    <span>Complete the transfer and save your receipt</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-medium">{transferDetails.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest Name:</span>
                  <span className="font-medium">{transferDetails.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold text-primary">₦{transferDetails.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="secondary">Pending Payment</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>After Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Your booking will be confirmed within 2-4 hours of payment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>You&apos;ll receive a confirmation email with your booking details</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Keep your transfer receipt for reference</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you encounter any issues with the transfer or need assistance, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" asChild>
                <Link href="tel:+2349461500" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call: +234 9 461 5000
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:bookings@niconluxury.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email: bookings@niconluxury.com
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
