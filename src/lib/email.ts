import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  guests: string;
  date?: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  const { name, email, phone, eventType, guests, date, message } = data;

  const emailContent = `
Ny forespørsel fra BarPro nettside

Navn: ${name}
E-post: ${email}
Telefon: ${phone || "Ikke oppgitt"}
Type arrangement: ${eventType}
Antall gjester: ${guests}
Dato: ${date || "Ikke oppgitt"}

Melding:
${message}
  `.trim();

  const resend = getResendClient();

  return resend.emails.send({
    from: "BarPro <noreply@barpro.pladsen.dev>",
    to: "Barproda@gmail.com",
    replyTo: email,
    subject: `Ny forespørsel: ${eventType} — ${name}`,
    text: emailContent,
  });
}

export async function sendOfferEmail(customerEmail: string, customerName: string, offerId: string, price: number, date: string, packageName: string, customerToken?: string) {
  const resend = getResendClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const offerUrl = `${baseUrl}/offer/${offerId}${customerToken ? `?token=${customerToken}` : ""}`;

  return resend.emails.send({
    from: "BarPro <noreply@barpro.pladsen.dev>",
    to: customerEmail,
    subject: `Tilbud fra BarPro — ${price.toLocaleString("no-NO")} kr`,
    text: `Hei ${customerName},

Takk for din forespørsel! Vi har satt sammen et tilbud til deg:

Dato: ${date}
Pakke: ${packageName}
Pris: ${price.toLocaleString("no-NO")} kr (ekskl. mva)

Se og godta tilbudet her:
${offerUrl}

Med vennlig hilsen,
Emil & Sofie
BarPro`,
  });
}

export async function sendBookingNotification(customerName: string, date: string, packageName: string) {
  const resend = getResendClient();

  return resend.emails.send({
    from: "BarPro <noreply@barpro.pladsen.dev>",
    to: "Barproda@gmail.com",
    subject: `Ny forespørsel: ${customerName} — ${date}`,
    text: `Ny forespørsel mottatt:

Kunde: ${customerName}
Dato: ${date}
Pakke: ${packageName}

Logg inn for å behandle forespørselen.`,
  });
}
