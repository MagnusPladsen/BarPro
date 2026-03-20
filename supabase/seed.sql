-- BarPro Seed Data for UI Testing
-- Run this in Supabase SQL Editor after running schema + migration

-- Block some dates
insert into blocked_dates (date, reason) values
  ('2026-04-01', 'Påskeferie'),
  ('2026-04-02', 'Påskeferie'),
  ('2026-04-03', 'Påskeferie'),
  ('2026-05-17', 'Nasjonaldag'),
  ('2026-06-23', 'Sankthansaften — privat');

-- Bookings (mix of statuses)
insert into bookings (date, status, package, guest_count, event_type, customer_name, customer_email, customer_phone, wants_callback, message) values
  ('2026-03-28', 'confirmed', 'premium', '80-100', 'wedding', 'Kristin Haugen', 'kristin.haugen@gmail.com', '91234567', false, 'Bryllup på Honne Hotell. Vi ønsker 2 signaturdrinker og en alkoholfri meny.'),
  ('2026-04-05', 'pending', 'basis', 'Under 50', 'private', 'Thomas Berg', 'thomas.berg@outlook.com', '47812345', true, '30-årslag hjemme hos oss. Ønsker cocktailbar med klassiske drinker.'),
  ('2026-04-12', 'confirmed', 'eksklusiv', '100-200', 'corporate', 'Innlandet Energi AS', 'events@innlandetenergi.no', '61234500', false, 'Årlig firmafest for 150 ansatte. Trenger 3-4 bartendere og komplett opplegg.'),
  ('2026-04-19', 'pending', 'premium', '50-100', 'wedding', 'Maria Olsen & Erik Dahl', 'maria.olsen@live.no', '99887766', true, 'Bryllup i juni, men ønsker å sikre dato tidlig. Utendørs arrangement.'),
  ('2026-05-02', 'pending', 'basis', 'Under 50', 'private', 'Lise Nordberg', 'lise.n@gmail.com', null, false, 'Konfirmasjonsfest for sønnen vår. Ca 40 gjester.'),
  ('2026-05-09', 'confirmed', 'premium', '50-100', 'corporate', 'Hamar Kommune', 'kultur@hamar.kommune.no', '62510000', false, 'Kulturarrangement i Domkirkeodden. Trenger bartendere for utendørs bar.'),
  ('2026-05-23', 'cancelled', 'basis', 'Under 50', 'private', 'Anders Vik', 'anders.vik@yahoo.no', '41122334', false, 'Avlyst pga sykdom.'),
  ('2026-06-06', 'pending', 'eksklusiv', '100-200', 'wedding', 'Sofie Bakken & Jonas Lie', 'sofie.bakken@hotmail.com', '92233445', true, 'Stort bryllup på Herredsvang Samfunnshus. 180 gjester. Ønsker full service med signaturdrinker.'),
  ('2026-06-13', 'confirmed', 'premium', '50-100', 'private', 'Familien Strand', 'per.strand@gmail.com', '90011223', false, 'Gullbryllup for foreldrene. 70 gjester. Klassisk og elegant.'),
  ('2026-06-20', 'pending', 'basis', 'Under 50', 'other', 'Lillehammer Startup Hub', 'hello@lillehammerstartuphub.no', null, false, 'Nettverksevent. Enkel bar med 2-3 drinker + alkoholfritt.'),
  ('2026-07-04', 'completed', 'premium', '80-100', 'wedding', 'Hanne og Morten Aasen', 'hanne.aasen@gmail.com', '95566778', false, 'Alt gikk perfekt! Tusen takk for fantastisk service.'),
  ('2026-03-21', 'confirmed', 'basis', 'Under 50', 'private', 'Kari Johansen', 'kari.j@online.no', '48899001', true, 'Liten bursdagsfest i morgen. Trenger 1 bartender.');

-- Contact messages
insert into contact_messages (name, email, phone, event_type, guests, date, message, status) values
  ('Henrik Nilsen', 'henrik.nilsen@gmail.com', '91223344', 'Bryllup', '100-200', '2026-08-15', 'Hei! Vi planlegger bryllup i august og lurer på om dere er ledige. Vi er ca 150 gjester og ønsker full bar-service med signaturdrinker. Kan dere sende et tilbud?', 'unread'),
  ('Marte Svendsen', 'marte.s@bedrift.no', '47556677', 'Bedriftsarrangement', '50-100', '2026-12-05', 'Vi planlegger julebord for avdelingen (ca 60 pers) og trenger bartendere. Er dere tilgjengelige første lørdag i desember? Hva koster Premium-pakken?', 'unread'),
  ('Ole Kristian Berge', 'ok.berge@outlook.com', null, 'Privat feiring', 'Under 50', '2026-05-30', 'Hei, har et spørsmål om Basis-pakken. Inkluderer den shaker og annet utstyr, eller må vi ha det selv? Vi er ca 30 stk.', 'read'),
  ('Camilla Haugen', 'camilla.h@icloud.com', '99001122', 'Bryllup', '50-100', null, 'Vi gifter oss neste sommer men har ikke satt dato ennå. Ønsker å høre litt om hva dere tilbyr og prisene. Kan dere ringe meg?', 'unread'),
  ('Eirik Solberg', 'eirik@solbergconsulting.no', '41556677', 'Bedriftsarrangement', '100-200', '2026-11-28', 'Trenger 4 bartendere til firmafest for 200 personer. Vi har eget lokale med bar, men trenger bemanning. Hva er prisen for kun bartendere uten utstyr?', 'replied'),
  ('Anna Pedersen', 'anna.p@gmail.com', '92345678', 'Annet', 'Under 50', '2026-04-25', 'Hei! Arrangerer en vin- og cocktailkveld for venninnegjengen (12 stk). Har dere noe som passer til det? Tenker kanskje en slags cocktailkurs?', 'unread');
