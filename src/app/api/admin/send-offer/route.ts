import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendOfferEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify admin
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { offerId, bookingId } = await request.json();
  if (!offerId || !bookingId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const supabase = await createServiceRoleClient();

  // Get offer + booking info
  const { data: offer } = await supabase.from("offers").select("offered_price, customer_token").eq("id", offerId).single();
  const { data: booking } = await supabase.from("bookings").select("customer_email, customer_name, date, package").eq("id", bookingId).single();

  if (!offer || !booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const typedOffer = offer as { offered_price: number; customer_token: string | null };
  const typedBooking = booking as { customer_email: string; customer_name: string; date: string; package: string };
  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };

  try {
    await sendOfferEmail(
      typedBooking.customer_email,
      typedBooking.customer_name,
      offerId,
      typedOffer.offered_price,
      typedBooking.date,
      packageLabels[typedBooking.package] ?? typedBooking.package,
      typedOffer.customer_token ?? undefined,
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send offer email:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
