import { createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      date,
      package: pkg,
      guest_count,
      event_type,
      customer_name,
      customer_email,
      customer_phone,
      wants_callback,
      message,
    } = body;

    // Validate required fields
    if (!date || !pkg || !guest_count || !event_type || !customer_name || !customer_email) {
      return NextResponse.json(
        { error: "Manglende påkrevde felt" },
        { status: 400 },
      );
    }

    const supabase = await createServiceRoleClient();

    // Check date is available
    const { data: availableDate } = await supabase
      .from("available_dates")
      .select("id")
      .eq("date", date)
      .single();

    if (!availableDate) {
      return NextResponse.json(
        { error: "Denne datoen er ikke tilgjengelig" },
        { status: 400 },
      );
    }

    // Check no existing active booking on this date
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("date", date)
      .in("status", ["pending", "confirmed"])
      .maybeSingle();

    if (existingBooking) {
      return NextResponse.json(
        { error: "Denne datoen er allerede booket" },
        { status: 400 },
      );
    }

    // Create booking
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        date,
        package: pkg,
        guest_count,
        event_type,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        wants_callback: wants_callback ?? false,
        message: message || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Booking insert error:", error);
      return NextResponse.json(
        { error: "Kunne ikke opprette booking" },
        { status: 500 },
      );
    }

    // TODO: Send email notification to admin (Resend)

    return NextResponse.json({ booking: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Noe gikk galt" },
      { status: 500 },
    );
  }
}
