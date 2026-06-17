"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Booking = {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  status: string;
  amount: number;
  check_in_date: string;
  check_out_date: string;
  room?: { id: number; room_number: string; status: string } | null;
  roomType?: { id: number; name: string } | null;
};

function PaymentCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const statusParam = params.get("status") || "";
  const reference = params.get("reference") || params.get("trxref") || "";
  const bookingIdParam = params.get("booking_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "";
  }, []);

  useEffect(() => {
    async function verifyAndFetch() {
      if (!apiBase || !reference) return;
      setLoading(true);
      setError(null);
      try {
        const url = new URL(`${apiBase}/api/payments/confirm`);
        url.searchParams.set("payment_reference", reference);
        if (bookingIdParam) url.searchParams.set("booking_id", bookingIdParam);
        const res = await fetch(url.toString(), { method: "GET" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.message || `Failed to confirm: ${res.status}`);
        }
        const b: Booking = json.booking || json.bookings || null;
        if (b?.status === "confirmed") {
          setBooking(b);
          router.push(`/booking?success=1&booking_id=${b.id}`);
          return;
        }
        setBooking(b);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    verifyAndFetch();
  }, [apiBase, reference, bookingIdParam, router]);

  const isSuccess = booking?.status === "confirmed";

  return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-secondary/10 overflow-hidden">
        <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-6 ${isSuccess ? "bg-green-100" : loading ? "bg-blue-100" : "bg-amber-100"}`}>
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary/20 border-t-secondary" />
            ) : isSuccess ? (
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            )}
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary italic mb-2">
            {loading ? "Verifying..." : isSuccess ? "Payment Successful" : "Payment Result"}
          </h1>
          {reference && (
            <p className="text-xs text-muted-foreground font-mono">Ref: {reference}</p>
          )}
        </div>

        <div className="p-8">
          {loading && (
            <p className="text-center text-muted-foreground">Verifying your payment, please wait...</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
              <p className="text-red-600 text-xs mt-1">Please contact our concierge desk for assistance.</p>
            </div>
          )}

          {!loading && !error && booking && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono font-bold text-primary">CLH{booking.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-bold uppercase text-xs ${isSuccess ? "text-green-600" : "text-amber-600"}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guest</span>
                  <span className="font-medium">{booking.guest_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{booking.guest_email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-primary">₦{Number(booking.amount)?.toLocaleString()}</span>
                </div>
                {booking.roomType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room</span>
                    <span className="font-medium">{booking.roomType.name}</span>
                  </div>
                )}
              </div>

              {isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-800 text-sm font-semibold">Your reservation is secured!</p>
                  <p className="text-green-600 text-xs mt-1">A confirmation email has been sent to {booking.guest_email}</p>
                </div>
              )}

              <div className="mt-6">
                <Link
                  href={`/booking?success=${isSuccess ? 1 : 0}&booking_id=${booking.id}`}
                  className="w-full h-12 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-all"
                >
                  View Booking Details
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && !booking && reference && (
            <p className="text-center text-muted-foreground py-4">No booking details found.</p>
          )}

          {!loading && !error && !reference && (
            <p className="text-center text-muted-foreground py-4">No payment reference provided.</p>
          )}

          {!loading && !error && (
            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-muted-foreground underline hover:text-primary transition-colors">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary/20 border-t-secondary" />
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
