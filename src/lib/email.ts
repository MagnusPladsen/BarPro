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
    from: "BarPro <onboarding@resend.dev>",
    to: "Barproda@gmail.com",
    replyTo: email,
    subject: `Ny forespørsel: ${eventType} — ${name}`,
    text: emailContent,
  });
}
