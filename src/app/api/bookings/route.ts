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

    // Check date is not blocked by admin
    const { data: blockedDate } = await supabase
      .from("blocked_dates")
      .select("id")
      .eq("date", date)
      .maybeSingle();

    if (blockedDate) {
      return NextResponse.json(
        { error: "Denne datoen er ikke tilgjengelig" },
        { status: 400 },
      );
    }

    // Create booking (unique index prevents duplicates atomically)
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
      // Unique constraint violation = date already booked
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Denne datoen er allerede booket" },
          { status: 400 },
        );
      }
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
