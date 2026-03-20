import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: fetch offer details for public view
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(_request.url);
  const token = searchParams.get("token");

  const supabase = await createServiceRoleClient();

  const { data: offer } = await supabase
    .from("offers")
    .select("id, offered_price, estimated_cost, notes, status, booking_id, customer_token")
    .eq("id", id)
    .single();

  if (!offer) {
    return NextResponse.json({ offer: null }, { status: 404 });
  }

  // Validate token
  const typedWithToken = offer as { customer_token: string | null };
  if (typedWithToken.customer_token && typedWithToken.customer_token !== token) {
    return NextResponse.json({ offer: null, error: "Invalid token" }, { status: 403 });
  }

  // Fetch booking details (only what's needed for the offer page, no PII beyond name)
  const { data: booking } = await supabase
    .from("bookings")
    .select("date, package, guest_count, event_type, customer_name, start_time, end_time")
    .eq("id", (offer as { booking_id: string }).booking_id)
    .single();

  return NextResponse.json({
    offer: {
      ...offer,
      booking: booking ?? null,
    },
  });
}

// POST: accept or decline offer
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { action, rejection_reason, wants_new_offer, token } = body;

  const supabase = await createServiceRoleClient();

  // Fetch the offer
  const { data: offer } = await supabase
    .from("offers")
    .select("id, status, booking_id, offered_price, customer_token")
    .eq("id", id)
    .single();

  if (!offer || (offer as { status: string }).status !== "sent") {
    return NextResponse.json({ error: "Tilbudet er ikke tilgjengelig" }, { status: 400 });
  }

  // Validate token
  const offerToken = (offer as { customer_token: string | null }).customer_token;
  if (offerToken && offerToken !== token) {
    return NextResponse.json({ error: "Ugyldig tilgang" }, { status: 403 });
  }

  const typedOffer = offer as { id: string; booking_id: string; offered_price: number };

  if (action === "accept") {
    // Update offer status
    await supabase.from("offers").update({
      status: "accepted",
      responded_at: new Date().toISOString(),
    }).eq("id", id);

    // Update booking to confirmed
    await supabase.from("bookings").update({
      status: "confirmed",
    }).eq("id", typedOffer.booking_id);

    // Create agreement
    await supabase.from("agreements").insert({
      booking_id: typedOffer.booking_id,
      offer_id: id,
      final_price: typedOffer.offered_price,
      status: "active",
      signed_at: new Date().toISOString(),
    });

    // Add chat message
    await supabase.from("chat_messages").insert({
      booking_id: typedOffer.booking_id,
      sender_type: "customer",
      sender_name: "Kunde",
      message: "Tilbud akseptert",
      message_type: "system",
    });

    // Send confirmation email
    try {
      const { data: booking } = await supabase
        .from("bookings")
        .select("customer_email, customer_name, date, package")
        .eq("id", typedOffer.booking_id)
        .single();

      if (booking) {
        const b = booking as { customer_email: string; customer_name: string; date: string; package: string };
        const pkgLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };
        const { sendBookingConfirmation } = await import("@/lib/email");
        await sendBookingConfirmation(b.customer_email, b.customer_name, b.date, pkgLabels[b.package] ?? b.package, typedOffer.offered_price);
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    return NextResponse.json({ success: true });
  }

  if (action === "decline") {
    // Update offer
    await supabase.from("offers").update({
      status: "declined",
      responded_at: new Date().toISOString(),
      rejection_reason: rejection_reason || null,
      wants_new_offer: wants_new_offer ?? false,
    }).eq("id", id);

    // Update booking back to pending if wants new offer, otherwise cancel
    await supabase.from("bookings").update({
      status: wants_new_offer ? "pending" : "cancelled",
    }).eq("id", typedOffer.booking_id);

    // Add chat message
    const msg = rejection_reason
      ? `Tilbud avslått: "${rejection_reason}"${wants_new_offer ? " — ønsker nytt tilbud" : ""}`
      : `Tilbud avslått${wants_new_offer ? " — ønsker nytt tilbud" : ""}`;

    await supabase.from("chat_messages").insert({
      booking_id: typedOffer.booking_id,
      sender_type: "customer",
      sender_name: "Kunde",
      message: msg,
      message_type: "system",
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
