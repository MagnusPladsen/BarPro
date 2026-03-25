"use client";

import { useState } from "react";

const sections = [
  {
    title: "Hvordan registrere timer",
    steps: [
      "Gå til «Registrer timer» i fanemenyen",
      "Velg dato for arbeidet",
      "Sett fra- og til-klokkeslett — timer beregnes automatisk",
      "Skriv en kort beskrivelse av hva du jobbet med",
      "Trykk «Registrer X timer»",
      "Timene venter nå på godkjenning fra admin",
    ],
  },
  {
    title: "Hvordan se arbeidsplanen din",
    steps: [
      "Gå til «Kalender» i fanemenyen",
      "Oppdrag vises i gull med tidspunkt og kundenavn",
      "Godkjente timer vises i grønt",
      "Ventende timer vises i gult",
    ],
  },
  {
    title: "Hvordan markere dager du ikke kan jobbe",
    steps: [
      "Gå til «Kalender» i fanemenyen",
      "Klikk på dagen du ikke er tilgjengelig",
      "Dagen blir rød med teksten «Ikke tilgjengelig»",
      "Admin ser dette når de tildeler oppdrag",
      "Klikk igjen for å fjerne markeringen",
    ],
  },
  {
    title: "Hvordan endre profil og passord",
    steps: [
      "Gå til «Profil» i fanemenyen",
      "Trykk «Rediger» for å endre telefonnummer",
      "Under «Endre passord», fyll inn nytt passord to ganger",
      "Trykk «Endre passord»",
    ],
  },
];

export default function PortalHelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Hjelp</h1>
      <p className="text-[#6B5D52] text-sm mb-8">Guider for vanlige oppgaver</p>

      <div className="max-w-2xl space-y-0">
        {sections.map((section, i) => (
          <div key={i} className="border-b border-[#1A1410]">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left cursor-pointer group">
              <span className="text-sm font-medium group-hover:text-[#B88E64] transition-colors">{section.title}</span>
              <span className={`text-[#B88E64] text-lg transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === i && (
              <div className="pb-5">
                <ol className="space-y-2 ml-4">
                  {section.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#6B5D52]">
                      <span className="text-[#B88E64] text-[10px] font-semibold mt-1 shrink-0">{j + 1}</span>
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
