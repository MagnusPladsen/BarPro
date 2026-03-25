"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import "../../../app/globals.css";

interface OfferData {
  id: string;
  offered_price: number;
  estimated_cost: number;
  notes: string | null;
  status: string;
  booking: {
    date: string;
    package: string;
    guest_count: string;
    event_type: string;
    customer_name: string;
    start_time: string | null;
    end_time: string | null;
  };
}

export default function OfferPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const offerId = params.id as string;
  const token = searchParams.get("token") ?? "";

  const [offer, setOffer] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [done, setDone] = useState<"accepted" | "declined" | null>(null);

  // Rejection form
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [wantsNewOffer, setWantsNewOffer] = useState(false);

  useEffect(() => {
    fetch(`/api/offer/${offerId}?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        setOffer(data.offer ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [offerId]);

  const acceptOffer = async () => {
    setResponding(true);
    const res = await fetch(`/api/offer/${offerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept", token }),
    });
    if (res.ok) setDone("accepted");
    setResponding(false);
  };

  const declineOffer = async () => {
    setResponding(true);
    const res = await fetch(`/api/offer/${offerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "decline",
        token,
        rejection_reason: rejectReason,
        wants_new_offer: wantsNewOffer,
      }),
    });
    if (res.ok) setDone("declined");
    setResponding(false);
  };

  const packageLabels: Record<string, string> = { basis: "Basis", premium: "Premium", eksklusiv: "Eksklusiv" };
  const eventLabels: Record<string, string> = { wedding: "Bryllup", corporate: "Bedriftsarrangement", private: "Privat feiring", other: "Annet" };

  if (loading) {
    return (
      <html lang="no">
        <body className="bg-[#0D0A08] text-[#E8DDD4] font-sans antialiased min-h-screen flex items-center justify-center">
          <p className="text-[#6B5D52]">Laster tilbud...</p>
        </body>
      </html>
    );
  }

  if (!offer) {
    return (
      <html lang="no">
        <body className="bg-[#0D0A08] text-[#E8DDD4] font-sans antialiased min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Tilbud ikke funnet</h1>
            <p className="text-[#6B5D52]">Denne lenken er ugyldig eller tilbudet har utløpt.</p>
          </div>
        </body>
      </html>
    );
  }

  if (offer.status !== "sent" && !done) {
    const statusText = offer.status === "accepted" ? "Dette tilbudet er allerede akseptert." : offer.status === "declined" ? "Dette tilbudet er avslått." : "Dette tilbudet er ikke lenger tilgjengelig.";
    return (
      <html lang="no">
        <body className="bg-[#0D0A08] text-[#E8DDD4] font-sans antialiased min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="text-2xl tracking-[0.15em] uppercase font-semibold mb-8">Bar<span className="text-[#B88E64]">Pro</span></h1>
            <p className="text-[#6B5D52]">{statusText}</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="no">
      <body className="bg-[#0D0A08] text-[#E8DDD4] font-sans antialiased min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="text-2xl tracking-[0.15em] uppercase font-semibold">Bar<span className="text-[#B88E64]">Pro</span></h1>
          </div>

          {done ? (
            <div className="border border-[#1A1410] bg-[#1A1410] p-10 text-center">
              <div className="w-12 h-px bg-[#B88E64] mx-auto mb-8" />
              {done === "accepted" ? (
                <>
                  <h2 className="text-2xl font-semibold text-green-400 mb-4">Tilbud akseptert!</h2>
                  <p className="text-[#6B5D52]">Takk, {offer.booking.customer_name}! Vi gleder oss til arrangementet ditt. Vi tar kontakt med detaljer.</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-4">Tilbud avslått</h2>
                  <p className="text-[#6B5D52]">
                    {wantsNewOffer
                      ? "Vi har mottatt tilbakemeldingen din og vil komme tilbake med et nytt tilbud."
                      : "Takk for tilbakemeldingen. Kontakt oss gjerne hvis du ombestemmer deg."}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="border border-[#1A1410] bg-[#1A1410]">
              {/* Header */}
              <div className="p-8 border-b border-[#1A1410] text-center">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-[0.25em] mb-2">Tilbud til</p>
                <h2 className="text-xl font-semibold">{offer.booking.customer_name}</h2>
              </div>

              {/* Details */}
              <div className="p-8 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Dato</p>
                    <p>{new Date(offer.booking.date + "T00:00:00").toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Pakke</p>
                    <p>{packageLabels[offer.booking.package]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Type</p>
                    <p>{eventLabels[offer.booking.event_type]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Gjester</p>
                    <p>{offer.booking.guest_count}</p>
                  </div>
                  {offer.booking.start_time && (
                    <div>
                      <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Tid</p>
                      <p>{offer.booking.start_time} – {offer.booking.end_time}</p>
                    </div>
                  )}
                </div>

                {offer.notes && (
                  <div className="border-t border-[#1A1410] pt-4">
                    <p className="text-[10px] text-[#6B5D52] uppercase tracking-wider mb-1">Detaljer</p>
                    <p className="text-[#6B5D52]">{offer.notes}</p>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-[#1A1410] p-8 text-center bg-[#B88E64]/[0.04]">
                <p className="text-[10px] text-[#6B5D52] uppercase tracking-[0.25em] mb-2">Totalpris</p>
                <p className="text-4xl font-semibold text-[#B88E64]">{offer.offered_price.toLocaleString("no-NO")} kr</p>
                <p className="text-[11px] text-[#6B5D52] mt-1">Ekskl. mva</p>
              </div>

              {/* Actions */}
              <div className="p-8 border-t border-[#1A1410]">
                {showRejectForm ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium">Hvorfor avslår du tilbudet?</p>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0D0A08] border border-[#1A1410] px-3 py-2 text-sm outline-none focus:border-[#B88E64]/40 resize-none"
                      placeholder="Valgfritt — fortell oss gjerne hvorfor..."
                    />
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={wantsNewOffer} onChange={(e) => setWantsNewOffer(e.target.checked)} className="accent-[#B88E64]" />
                      <span className="text-sm text-[#6B5D52]">Jeg ønsker et nytt tilbud</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={() => setShowRejectForm(false)}
                        className="flex-1 border border-[#1A1410] py-3 text-xs text-[#6B5D52] uppercase tracking-wider hover:text-[#E8DDD4] cursor-pointer">
                        Tilbake
                      </button>
                      <button onClick={declineOffer} disabled={responding}
                        className="flex-1 bg-red-400/10 text-red-400 border border-red-400/30 py-3 text-xs uppercase tracking-wider hover:bg-red-400/20 cursor-pointer disabled:opacity-50">
                        {responding ? "Sender..." : "Avslå tilbud"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setShowRejectForm(true)}
                      className="flex-1 border border-[#1A1410] py-3 text-xs text-[#6B5D52] uppercase tracking-wider hover:text-[#E8DDD4] cursor-pointer">
                      Avslå
                    </button>
                    <button onClick={acceptOffer} disabled={responding}
                      className="flex-1 bg-[#B88E64] text-[#0D0A08] py-3 text-xs font-medium uppercase tracking-wider hover:bg-[#D4A876] cursor-pointer disabled:opacity-50">
                      {responding ? "Behandler..." : "Aksepter tilbud"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-center text-[10px] text-[#6B5D52]/40 mt-8 uppercase tracking-wider">&copy; 2026 BarPro</p>
        </div>
      </body>
    </html>
  );
}
