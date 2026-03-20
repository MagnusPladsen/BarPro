# BarPro — Administrasjonspanel og Bookingsystem

BarPro har nå et komplett bookingsystem med admin-panel, ansattportal, og forespørselsside for kunder.

---

## Kom i gang — De viktigste tingene du trenger å vite

### Hvordan behandle en forespørsel og sende tilbud

Når en kunde sender en forespørsel via nettsiden, skjer dette:

1. Du får en **e-post** om at det har kommet en ny forespørsel
2. Logg inn på admin-panelet (/login)
3. Du ser forespørselen på **Dashboard** under "Forespørsler" (gul farge)
4. Klikk på den, eller gå til **Bookinger** i menyen til venstre
5. Klikk på forespørselen i listen

Nå åpner seg et detaljpanel til høyre. Her gjør du følgende:

**Steg 1 — Sett tidspunkt:**
- Velg "Fra" og "Til" klokkeslett (f.eks. 18:00 til 23:00)
- Systemet beregner antall timer automatisk

**Steg 2 — Velg hvem som jobber:**
- Alle aktive ansatte er forhåndsvalgt
- Fjern haken på de som ikke skal jobbe denne dagen
- Du ser timelønn for hver ansatt til høyre

**Steg 3 — Se kostnad:**
- Systemet beregner lønn automatisk (ansatte × timer × timelønn)
- Du kan legge til ekstra kostnader (f.eks. transport, utstyrsleie)
- Alt summeres til en total estimert kostnad

**Steg 4 — Sett pris:**
- Systemet foreslår en pris som er 20% over kostnaden
- Du kan endre prisen selv
- Under prisen ser du: kostnad, inntekt (det du tjener) og margin i prosent
- Hvis du setter prisen lavere enn kostnaden, får du en advarsel

**Steg 5 — Send tilbudet:**
- Trykk **"Godkjenn & send tilbud"**
- Kunden får en e-post med en lenke til tilbudet
- På lenken ser kunden dato, pakke, pris og detaljer
- Kunden kan **akseptere** eller **avslå** tilbudet direkte der
- Hvis kunden avslår, kan de skrive hvorfor og be om nytt tilbud

Du kan også trykke **"Lagre utkast"** hvis du vil lagre uten å sende ennå.

### Hvordan legge til en ny ansatt

1. Gå til **Ansatte** i menyen
2. Trykk **"+ Legg til ansatt"** (knappen er under listen)
3. Fyll inn:
   - **Navn** — fullt navn
   - **E-post** — e-postadressen de vil bruke for å logge inn
   - **Telefon** — valgfritt
   - **Rolle** — f.eks. "Bartender" eller "Servicepersonell"
   - **Timelønn** — hva de tjener per time (f.eks. 275 kr)
   - **Passord** — et passord de kan bruke for å logge inn (kan endres senere)
4. Trykk **"Legg til"**

Den ansatte er nå opprettet, men er **inaktiv** som standard. For å aktivere:
1. Klikk på den ansatte i listen
2. Trykk **"Rediger"**
3. Huk av **"Aktiv"**
4. Trykk **"Lagre"**

Når den ansatte er aktiv, vil de:
- Dukke opp som valg når du tildeler folk til bookinger
- Kunne logge inn på /login og se sin egen portal

### Hvordan blokkere dager dere ikke kan jobbe

1. Gå til **Kalender** i menyen
2. Klikk på dagen du vil blokkere
3. Skriv inn en grunn (f.eks. "Ferie" eller "Opptatt") — valgfritt
4. Trykk **"Blokker denne dagen"**

Blokkerte dager vises som røde i kalenderen. Kunder kan ikke velge disse dagene når de sender forespørsel.

For å fjerne blokkeringen: klikk på dagen igjen og trykk "Fjern blokkering".

### Hvordan godkjenne timer

Ansatte registrerer timer i sin portal. Du godkjenner dem slik:

1. Gå til **Timer** i menyen
2. Du ser alle ventende registreringer med ansattnavn, dato, timer og kostnad
3. Trykk **"Godkjenn"** eller **"Avvis"** for hver registrering
4. Eller trykk **"Godkjenn alle"** øverst til høyre for å godkjenne alt på en gang

Godkjente timer teller med i rapporter og lønnsberegning.

### Hvordan eksportere rapporter

1. Gå til **Rapporter** i menyen
2. Velg periode: denne uken, denne måneden, eller egendefinert
3. Se oversikt over inntekt, kostnad, margin og ansatt-timer
4. Trykk **"Eksporter"** og velg format:
   - **CSV** — for regneark (enkel)
   - **Excel** — for Excel med flere ark (oversikt + ansatte)
   - **PDF** — for utskrift eller deling

---

## For kunder (nettsiden)

### Send forespørsel (/bestill)
Kunder kan sende forespørsler direkte fra nettsiden:

1. **Velg dato** — Kalenderen viser tilgjengelige dager. Kunder kan velge én dag eller et datointervall. Dager som er blokkert av admin eller allerede booket vises som utilgjengelige.
2. **Velg tidspunkt** — Fra/til klokkeslett for arrangementet.
3. **Fyll inn detaljer** — Pakke (Basis/Premium/Eksklusiv, Premium er forhåndsvalgt), type arrangement, antall gjester, kontaktinfo, valgfri melding.
4. **Samtykke** — GDPR-samtykke kreves før innsending.
5. **Bekreftelse** — Kunde ser en oppsummering og sender forespørselen.

### Tilbudsside (/offer/{id})
Når admin sender et tilbud, får kunden en e-post med en sikker lenke. Der kan de:
- Se alle detaljer om tilbudet (dato, pakke, pris)
- **Akseptere** — Bookingen bekreftes automatisk
- **Avslå** — Kunden kan skrive hvorfor og velge om de ønsker et nytt tilbud

---

## Admin-panel (/admin)

Logg inn på /login med admin-konto (eier-konto).

### Dashboard
- **Inntekt denne måneden** med sammenligning mot forrige måned (grønn/rød %)
- **Margin** (inntekt minus lønnskostnad)
- **Antall bookinger** denne måneden
- **Snittverdi** per booking
- **Forespørsler** som venter på behandling
- **Tilbud sendt** som venter på kundesvar
- **Uleste meldinger** fra kontaktskjemaet
- **Aktive ansatte** med timer denne måneden
- Liste over kommende arrangementer og siste aktivitet

### Kalender (/admin/kalender)
- Månedvisning med fargekoder:
  - **Rød** = blokkert dag (admin har sagt vi er utilgjengelige)
  - **Gul** = ventende forespørsel
  - **Blå** = tilbud sendt, venter på kundesvar
  - **Grønn** = bekreftet booking
- **Klikk på en dag** for å:
  - Se bookingdetaljer med ansatte tildelt
  - Blokkere/fjerne blokkering med grunn (f.eks. "Ferie", "Opptatt")
  - Gå direkte til bookingen
- **Kalender-sync** — Last ned .ics-fil som kan importeres i Google Calendar, Apple Calendar eller Outlook

### Bookinger (/admin/bookinger)
- Filter: Forespørsler, Tilbud sendt, Bekreftet, Fullført, Avlyst
- Klikk en booking for detaljvisning med 4 faner:

**Detaljer-fane:**
- Kundeinformasjon (navn, e-post, telefon, melding)
- Sett tidspunkt (fra/til)
- Velg ansatte som skal jobbe (alle aktive forhåndsvalgt)
- Kostnadsberegning:
  - Lønn automatisk beregnet (ansatte × timer × timelønn)
  - Legg til ekstra kostnader (transport, utstyr, osv.)
  - Total estimert kostnad
- **Tilbudspris** — forhåndsutfylt med 20% påslag, kan justeres
  - Viser margin, kostnad og inntekt under prisen
  - Advarsel hvis pris er lavere enn kostnad
- **"Lagre utkast"** og **"Godkjenn & send tilbud"** knapper

**Chat-fane:**
- Meldinger mellom admin og kunde som chat-bobler
- Systemsvarelser (tilbud sendt, akseptert, avslått)
- Skriv og send meldinger

**Tilbud-fane:**
- Oversikt over alle tilbud for denne bookingen
- Status, pris, margin, kostnad

**Avtaler-fane:**
- Aktive avtaler med endelig pris
- Signeringsdato

### Booking-flyt (statuser)
```
Forespørsel → Admin behandler → Tilbud sendt → Kunde aksepterer → Bekreftet → Fullført
                                              → Kunde avslår → Nytt tilbud eller avlyst
```

### Meldinger (/admin/meldinger)
- Alle meldinger fra kontaktskjemaet
- Filter: Ulest, Lest, Besvart
- Klikk for å se full melding med kontaktinfo
- "Svar via e-post" og "Marker som besvart" knapper
- Admin-notater felt

### Ansatte (/admin/ansatte)
- Liste med faner: Aktive, Inaktive, Alle (med antall)
- Paginering (10 per side)
- Klikk en ansatt for å se:
  - Kontaktinfo, rolle, timelønn, status
  - Timer jobbet (totalt og godkjent)
  - Oppdragsliste med godkjenningsknapper
- **Rediger** — navn, e-post, telefon, rolle, timelønn, aktiv/inaktiv
- **Reset passord** — sender tilbakestillingslenke til ansatt sin e-post
- **Legg til ansatt** — navn, e-post, telefon, rolle, timelønn, passord for innlogging

### Timer (/admin/timer)
- Alle timeregistreringer fra ansatte
- Filter: Ventende, Godkjent, Avvist, Alle
- Oppsummering: antall ventende, timer, estimert kostnad
- **Godkjenn** eller **Avvis** enkeltregistreringer
- **"Godkjenn alle"** for rask behandling
- Viser ansattnavn, dato, timer, timelønn og beregnet kostnad

### Rapporter (/admin/rapporter)
- Periodevalg: Denne uken, Denne måneden, Egendefinert datoperiode
- Oppsummeringskort:
  - Inntekt (grønn)
  - Lønnskostnad (rød)
  - Margin (grønn/rød)
  - Ventende tilbud
- Bookinger: bekreftet, ventende, avlyst, totalt, timer jobbet
- Ansatt-timer & lønn: per ansatt med oppdrag, timer, totallønn
- **Eksporter** som CSV, Excel (.xlsx) eller PDF

---

## Ansattportal (/portal)

Ansatte logger inn på /login og blir sendt til portalen.

### Oversikt
- Kommende oppdrag med dato og tidspunkt
- Godkjente timer og ventende timer
- Siste timeregistreringer

### Kalender
- Månedvisning med:
  - **Gull** = tildelt oppdrag med tidspunkt og kundenavn
  - **Grønn** = godkjente timer
  - **Gul** = ventende timer

### Registrer timer
- Velg dato, fra/til klokkeslett, timer, beskrivelse
- Se alle registreringer med status (Venter/Godkjent/Avvist)
- Timer trenger ikke å være knyttet til et oppdrag

### Profil
- Se og rediger telefonnummer
- Endre passord

---

## Innlogging (/login)

- Felles innloggingsside for admin og ansatte
- Eiere → sendes til /admin
- Ansatte → sendes til /portal
- **Vis/skjul passord** knapp
- **"Glemt passord?"** — sender tilbakestillingslenke på e-post

---

## Nettside-endringer

### Ny design
- Gull shimmer-effekt på knapper ved hover
- Dekorative gull-hjørner på Hero og CTA-seksjon
- Gull glow-effekt på kort ved hover
- Forbedrede prisvisning med gull-detaljer
- Forbedret mobiltilpasning

### Nye sider
- **/bestill** — Send forespørsel med kalender og skjema
- **/blogg** — To innlegg (velkommen + forespørselsfunksjon)
- **/personvern** — Personvernerklæring (GDPR)

### Priser oppdatert
- Basis: 5 000 kr (5 timer, 1 bartender, opptil 50 gjester)
- Premium: 7 500 kr (6 timer, 2 bartendere, opptil 120 gjester)
- Eksklusiv: 10 000 kr (8 timer, 3-4 bartendere, opptil 250+ gjester)
- Alle pakker inkluderer bar, glass og is
- Drikke og ingredienser besørges av kunden

### FAQ-seksjon
6 vanlige spørsmål med svar (accordion) på forsiden.

### Booking-callout
"Klar for å booke?" boks med "Send forespørsel" knapp vises på alle sider.

---

## Teknisk

### Database (Supabase)
- bookings, employees, time_entries, offers, agreements, chat_messages, contact_messages, blocked_dates, booking_assignments, booking_costs

### E-post (Resend)
- Varsling til admin ved nye forespørsler
- Tilbuds-e-post til kunder med sikker lenke
- Passord-tilbakestilling

### Sikkerhet
- Row Level Security (RLS) på alle tabeller
- Admin-sjekk (is_owner) på alle admin API-ruter
- Tilbudssider sikret med customer_token
- GDPR-samtykke påkrevd for forespørsler
- Personvernerklæring

### Kalender-sync
- Last ned .ics-fil fra admin-panelet
- Kan importeres i Google Calendar, Apple Calendar, Outlook
- Oppdateres ved ny nedlasting

---

## Vercel-oppsett

Legg inn disse miljøvariablene i Vercel → Settings → Environment Variables:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- NEXT_PUBLIC_SITE_URL (f.eks. https://barpro.pladsen.dev)
