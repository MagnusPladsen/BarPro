"use client";

import { useState } from "react";

const sections = [
  {
    title: "Hvordan behandle en forespørsel",
    steps: [
      "Gå til Bookinger i menyen",
      "Klikk på forespørselen (gul farge)",
      "Sett tidspunkt (fra/til) i detaljpanelet",
      "Velg hvilke ansatte som skal jobbe",
      "Se kostnad og sett tilbudspris",
      "Trykk «Godkjenn & send tilbud»",
      "Kunden får e-post med lenke til tilbudet",
    ],
  },
  {
    title: "Hvordan legge til ansatt",
    steps: [
      "Gå til Ansatte i menyen",
      "Trykk «+ Legg til ansatt» nederst",
      "Fyll inn navn, e-post, rolle og timelønn",
      "Sett et passord for innlogging",
      "Trykk «Legg til»",
      "Klikk på ansatten → Rediger → Huk av «Aktiv» → Lagre",
    ],
  },
  {
    title: "Hvordan blokkere dager",
    steps: [
      "Gå til Kalender i menyen",
      "Klikk på dagen du vil blokkere",
      "Skriv inn grunn (valgfritt)",
      "Trykk «Blokker denne dagen»",
      "Kunder kan ikke velge blokkerte dager",
    ],
  },
  {
    title: "Hvordan godkjenne timer",
    steps: [
      "Gå til Timer i menyen",
      "Se ventende registreringer fra ansatte",
      "Trykk «Godkjenn» eller «Avvis» for hver",
      "Eller «Godkjenn alle» for rask behandling",
    ],
  },
  {
    title: "Hvordan eksportere rapporter",
    steps: [
      "Gå til Rapporter i menyen",
      "Velg periode (uke, måned, eller egendefinert)",
      "Trykk «Eksporter» og velg format (CSV, Excel eller PDF)",
    ],
  },
  {
    title: "Hvordan laste ned faktura",
    steps: [
      "Åpne en booking med avtale (grønn status)",
      "Gå til «Avtaler»-fanen",
      "Trykk «Faktura PDF»",
    ],
  },
  {
    title: "Hvordan synce med Google Calendar",
    steps: [
      "Gå til Dashboard",
      "Trykk «.ics» ved siden av «Kalender»",
      "Importer filen i Google Calendar / Apple Calendar / Outlook",
    ],
  },
  {
    title: "Hvordan endre passord",
    steps: [
      "Trykk «Innstillinger» nederst i menyen",
      "Fyll inn nytt passord og bekreft",
      "Trykk «Endre passord»",
    ],
  },
  {
    title: "Hvordan opprette ny admin",
    steps: [
      "Gå til Innstillinger",
      "Under «Legg til ny admin», fyll inn navn, e-post og passord",
      "Trykk «Opprett admin»",
    ],
  },
];

export default function AdminHelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Hjelp</h1>
      <p className="text-[#6B5D52] text-sm mb-8">Steg-for-steg guider for vanlige oppgaver</p>

      <div className="max-w-2xl space-y-0">
        {sections.map((section, i) => (
          <div key={i} className="border-b border-[#1A1410]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
            >
              <span className="text-sm font-medium group-hover:text-[#C4907A] transition-colors">
                {section.title}
              </span>
              <span className={`text-[#C4907A] text-lg transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && (
              <div className="pb-5">
                <ol className="space-y-2 ml-4">
                  {section.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#6B5D52]">
                      <span className="text-[#C4907A] text-[10px] font-semibold mt-1 shrink-0">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
