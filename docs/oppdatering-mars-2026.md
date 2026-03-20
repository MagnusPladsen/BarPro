# BarPro — Oppdatering Mars 2026

Hei Emil og Sofie!

Her er en oversikt over alt som er gjort med nettsiden og det nye admin-systemet. Les gjennom dette dokumentet først, og se deretter den detaljerte guiden i filen **barpro-admin-guide.md** for full gjennomgang av admin-panelet.

---

## Hva er nytt?

### 1. Kunder kan nå sende forespørsler direkte på nettsiden

Kunder går til **barpro.pladsen.dev/bestill** og:
- Velger dato og tidspunkt fra en kalender
- Velger pakke (Basis, Premium eller Eksklusiv)
- Fyller inn kontaktinfo og hva slags arrangement det er
- Sender forespørselen til dere

Dere får e-post når en ny forespørsel kommer inn.

### 2. Dere har fått et admin-panel

Logg inn på **barpro.pladsen.dev/login** med admin-kontoen deres. Der kan dere:

- Se oversikt over inntekt, bookinger og meldinger
- Behandle forespørsler og sende tilbud til kunder
- Styre hvilke dager dere er tilgjengelige
- Administrere ansatte
- Godkjenne timer
- Se rapporter og eksportere til Excel eller PDF

Full gjennomgang av alle funksjoner finner dere i **barpro-admin-guide.md**.

### 3. Tilbudssystem

Når en kunde sender forespørsel, gjør dere dette:
1. Åpne forespørselen i admin-panelet
2. Sett tidspunkt og velg hvem som skal jobbe
3. Systemet beregner kostnad automatisk (lønn × timer)
4. Dere setter en pris (foreslått 20% over kostnad)
5. Trykk "Godkjenn & send tilbud"
6. Kunden får e-post med en lenke der de kan akseptere eller avslå

Hvis kunden avslår, kan de skrive hvorfor og be om nytt tilbud.

### 4. Ansattportal

Ansatte kan logge inn og se:
- Hvilke oppdrag de er tildelt
- Kalender med arbeidsplanen sin
- Registrere timer (som dere godkjenner)
- Endre passord og kontaktinfo

### 5. Timeregistrering

Ansatte registrerer timer selv. Dere godkjenner dem i admin-panelet under "Timer". Dere kan godkjenne enkeltvis eller alle på en gang.

### 6. Rapporter

Under "Rapporter" kan dere se:
- Inntekt og lønnskostnad per periode
- Margin (hva dere sitter igjen med)
- Timer per ansatt og lønn
- Eksporter til CSV, Excel eller PDF

---

## Endringer på nettsiden

### Design
- Finere hover-effekter med gull-detaljer
- Bedre mobiltilpasning
- Nytt utseende på knapper med shimmer-effekt

### Nye sider
- **Send forespørsel** — booking-kalender for kunder
- **Blogg** — to innlegg (velkommen + ny forespørselsfunksjon)
- **Personvern** — personvernerklæring (påkrevd etter norsk lov)
- **FAQ** — 6 vanlige spørsmål med svar på forsiden

### Priser oppdatert
- Basis: 5 000 kr
- Premium: 7 500 kr
- Eksklusiv: 10 000 kr
- Alle pakker inkluderer bar, glass og is
- Drikke besørges av kunden

### Bilder
- Emil og Sofie sine bilder er lagt inn på "Om oss"-siden
- Emils bio oppdatert med morsom intro
- Sofies bio oppdatert med bartender-fokus
- Begge har tittelen "Gründer & Bartender"

---

## Kalender-sync med Google Calendar

Dere kan synce bookingene med Google Calendar:
1. Gå til admin-panelet → Dashboard
2. Trykk ".ics" ved siden av "Kalender"
3. Importer filen i Google Calendar

---

## Hva dere må gjøre

### Første gang
1. Logg inn på **barpro.pladsen.dev/login**
2. Gå til Kalender og blokker dager dere ikke er tilgjengelige
3. Test å sende en forespørsel selv via /bestill

### Daglig bruk
1. Sjekk admin-panelet for nye forespørsler
2. Behandle forespørsler → send tilbud
3. Godkjenn timer fra ansatte
4. Sjekk meldinger fra kontaktskjemaet

### For ansatte
1. Opprett ansatte i admin-panelet → Ansatte → "Legg til ansatt"
2. Gi dem e-post og passord
3. De logger inn på /login og kommer til ansattportalen

---

## Nye funksjoner (oppdatering)

Siden forrige oppdatering har systemet fått en rekke nye funksjoner:

### Aktivitetslogg
Det finnes nå en logg som viser hvem som har gjort hva og når — for eksempel hvem som godkjente en booking eller endret et tilbud. Nyttig for å holde oversikt.

### Innstillinger
Under "Innstillinger" i admin-panelet kan dere nå endre passord og legge til nye administratorer.

### Mørk/lys modus
Admin-panelet støtter nå mørk og lys modus, så dere kan velge det som passer best.

### Last opp ansattbilder
Dere kan nå laste opp bilder av ansatte direkte i admin-panelet, slik at de vises i systemet.

### Faktura fra avtaler
Når en kunde har akseptert et tilbud, kan dere generere en faktura som PDF rett fra avtalen. Enkelt å sende videre til kunden.

### Søkefelt på dashboard
Det er lagt til et søkefelt på dashboardet, slik at dere raskt kan finne bookinger, kunder eller meldinger.

### Varslingsbadges i menyen
Menyen viser nå antall ventende bookinger, uleste meldinger og timer som venter på godkjenning — så dere ser med en gang om det er noe som trenger oppmerksomhet.

### Hjelpeside for ansatte
Ansatte har fått en egen hjelpeside på **/portal/hjelp** med svar på vanlige spørsmål om systemet.

### Ansattkalender med "ikke tilgjengelig"
Ansatte kan nå markere dager de ikke er tilgjengelige i sin egen kalender. Dette tas hensyn til når dere tildeler oppdrag.

### Automatisk beregning av timer
Når ansatte registrerer start- og sluttidspunkt, beregnes antall timer automatisk. Ingen manuell utregning nødvendig.

### Sikkerhetsforbedringer
Systemet har fått bedre sikkerhet rundt hvem som har tilgang til hva. Ansatte ser bare sin egen informasjon, og admin-funksjoner er bedre beskyttet.

---

## Spørsmål?

Ta kontakt med Magnus for teknisk support eller spørsmål om systemet.
