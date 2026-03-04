import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "BarPro — Profesjonell Eventbemanning",
    template: "%s | BarPro",
  },
  description:
    "Profesjonell bartender- og eventbemanning for bryllup, bedriftsarrangementer og private feiringer i Innlandet og hele Norge.",
  keywords: [
    "bartender",
    "eventbemanning",
    "bryllup",
    "bedriftsarrangement",
    "privat feiring",
    "cocktails",
    "Innlandet",
    "Norge",
    "bar service",
  ],
  authors: [{ name: "BarPro" }],
  openGraph: {
    type: "website",
    locale: "nb_NO",
    alternateLocale: "en_US",
    siteName: "BarPro",
    title: "BarPro — Profesjonell Eventbemanning",
    description:
      "Profesjonell bartender- og eventbemanning for bryllup, bedriftsarrangementer og private feiringer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-background text-text-primary font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
