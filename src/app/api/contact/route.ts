import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, eventType, guests, date, message } = body;
    if (!name || !email || !eventType || !guests || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    try {
      const supabase = await createServiceRoleClient();
      await supabase.from("contact_messages").insert({
        name,
        email,
        phone: phone || null,
        event_type: eventType,
        guests,
        date: date || null,
        message,
      });
    } catch (dbError) {
      console.error("Failed to save contact message to DB:", dbError);
      // Don't fail the request — email still goes out
    }

    await sendContactEmail(body);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
