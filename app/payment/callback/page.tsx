"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  const statusParam = params.get("status") || "";
  const reference = params.get("reference") || "";
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
        setBooking(b);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    verifyAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, reference, bookingIdParam]);

  const headline = statusParam === "success"
    ? "Payment successful"
    : statusParam === "pending" || statusParam === "abandoned" || statusParam === "timeout"
      ? "Payment pending"
      : statusParam === "failed"
        ? "Payment failed"
        : "Payment result";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">{headline}</h1>
      {reference && (
        <p className="text-sm text-gray-600 mb-2">Reference: {reference}</p>
      )}

      {loading && <p>Verifying payment and fetching booking details…</p>}
      {error && (
        <div className="text-red-600">{error}</div>
      )}

      {!loading && !error && booking && (
        <div className="space-y-2 border rounded-md p-4 bg-white">
          <p><strong>Name:</strong> {booking.guest_name}</p>
          <p><strong>Email:</strong> {booking.guest_email}</p>
          <p><strong>Phone:</strong> {booking.guest_phone}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Amount:</strong> ₦{Number(booking.amount).toLocaleString()}</p>
          <p><strong>Check-in:</strong> {booking.check_in_date}</p>
          <p><strong>Check-out:</strong> {booking.check_out_date}</p>
          {booking.roomType && (
            <p><strong>Room Type:</strong> {booking.roomType.name}</p>
          )}
          {booking.room && (
            <p><strong>Assigned Room:</strong> {booking.room.room_number}</p>
          )}
        </div>
      )}

      {!loading && !error && !booking && (
        <p>No booking details found.</p>
      )}

      <div className="mt-6">
        <Link href="/" className="text-blue-600 underline">Back to Home</Link>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}