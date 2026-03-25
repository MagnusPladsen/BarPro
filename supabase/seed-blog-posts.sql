-- Seed blog posts into DB so they appear in admin
insert into blog_posts (title, slug, content, excerpt, status, published_at) values
(
  'Nå kan du sende forespørsel direkte på nettsiden',
  'sende-foresporsel-direkte',
  'Vi har nettopp lansert en ny funksjon som gjør det enklere enn noen gang å komme i gang med å planlegge arrangementet ditt med BarPro.

På vår nye forespørselsside kan du velge dato, tidspunkt og pakke — og sende forespørselen direkte til oss. Vi går gjennom den, setter sammen et skreddersydd tilbud med pris, og sender det tilbake til deg.

Du kan godta eller avslå tilbudet med ett klikk. Ønsker du justeringer? Bare gi oss beskjed, så lager vi et nytt tilbud. Alt skjer digitalt og raskt — ingen unødvendig venting.

Vi ønsket å gjøre prosessen så enkel og transparent som mulig. Du ser alltid hva som er inkludert, hva det koster, og hva neste steg er.

Prøv det selv — klikk «Send forespørsel» i menyen, og vi tar det derfra.',
  'Vi har lansert en ny forespørselsfunksjon som gjør det enklere å planlegge arrangementet ditt.',
  'published',
  now() - interval '1 day'
),
(
  'Velkommen til BarPro — vi er klare for din neste feiring',
  'velkommen-til-barpro',
  'Vi er Emil og Sofie, og sammen har vi startet BarPro med én klar ambisjon: å levere bartender- og eventbemanning som faktisk gjør en forskjell for arrangementet ditt.

Etter flere år bak baren på alt fra bryllup og bursdager til bedriftsfester og festivaler, så vi et behov i Innlandet for noe mer enn bare «en bartender». Vi ønsket å tilby en helhetlig opplevelse — fra første samtale til siste glass er ryddet bort.

Hos oss får du erfarne bartendere som kan faget sitt, skreddersydde drinkmenyer tilpasset din anledning, og alt av utstyr du trenger. Vi tar med bar, glass og is — du sørger for drikke og gjester.

Enten du planlegger et intimt selskap for 20 eller et stort bryllup med 200 gjester, tilpasser vi oss dine behov. Vi tror på at de beste festene oppstår når vertskapet kan slappe av og nyte kvelden — og det er der vi kommer inn.

Vi gleder oss til å bli kjent med deg og ditt arrangement. Ta kontakt for en uforpliktende prat, så finner vi ut hvordan vi kan gjøre din neste feiring til noe helt spesielt.',
  'Vi er Emil og Sofie, og vi startet BarPro for å levere premium eventbemanning i Innlandet.',
  'published',
  now() - interval '3 days'
);
