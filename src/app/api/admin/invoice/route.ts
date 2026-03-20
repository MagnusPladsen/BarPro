import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const supabase = await createServiceRoleClient();

  const [bookingRes, agreementRes, costsRes] = await Promise.all([
    supabase.from("bookings").select("*").eq("id", bookingId).single(),
    supabase.from("agreements").select("*").eq("booking_id", bookingId).order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("booking_costs").select("*").eq("booking_id", bookingId).eq("is_billable", true),
  ]);

  if (!bookingRes.data || !agreementRes.data) {
    return NextResponse.json({ error: "Booking or agreement not found" }, { status: 404 });
  }

  const booking = bookingRes.data as {
    customer_name: string; customer_email: string; customer_phone: string | null;
    date: string; package: string; guest_count: string; event_type: string;
    start_time: string | null; end_time: string | null;
  };
  const agreement = agreementRes.data as { final_price: number; signed_at: string | null };
  const costs = (costsRes.data ?? []) as { description: string; amount: number }[];

  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };
  const eventLabels: Record<string, string> = { wedding: "Bryllup", corporate: "Bedriftsarrangement", private: "Privat feiring", other: "Annet" };

  // Return invoice data as JSON — client generates PDF
  return NextResponse.json({
    invoice: {
      number: `BP-${new Date().getFullYear()}-${bookingId.slice(0, 6).toUpperCase()}`,
      date: new Date().toISOString().split("T")[0],
      customer: {
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
      },
      event: {
        date: booking.date,
        package: packageLabels[booking.package] ?? booking.package,
        type: eventLabels[booking.event_type] ?? booking.event_type,
        guests: booking.guest_count,
        time: booking.start_time ? `${booking.start_time} – ${booking.end_time}` : null,
      },
      items: [
        { description: `${packageLabels[booking.package]} pakke — ${booking.date}`, amount: agreement.final_price - costs.reduce((s, c) => s + c.amount, 0) },
        ...costs.map((c) => ({ description: c.description, amount: c.amount })),
      ],
      total: agreement.final_price,
      vat: Math.round(agreement.final_price * 0.25),
      totalWithVat: Math.round(agreement.final_price * 1.25),
    },
  });
}
