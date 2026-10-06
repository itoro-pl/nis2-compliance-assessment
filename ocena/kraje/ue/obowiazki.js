/* Moduł ue: obowiązki formalne wynikające wprost z dyrektywy.

   Trzy grupy: dane rejestracyjne (art. 3 ust. 4), zgłaszanie poważnych
   incydentów (art. 23) i obowiązki organu zarządzającego (art. 20).
   Terminy krajowe — na wpis do wykazu, na wdrożenie środków — ustala
   prawo krajowe; tu ich nie ma. Sankcje odsyłają do art. 34 ogólnie,
   bo dyrektywa nie przypisuje kar do poszczególnych naruszeń. */
(function () {

const KSC_OBOWIAZKI_SEKCJE = [
    {
        id: 'ob-wykaz',
        nazwa: napis('ue.obowiazki.1'),
        podstawa: cyt('art. 3 ust. 3–5 dyrektywy (UE) 2022/2555'),
        opis: napis('ue.obowiazki.2'),
        pytania: [
            { id: 'ob-d3-1', tekst: napis('ue.obowiazki.3'), art: cyt('art. 3 ust. 1 i 2'), sankcja: cyt('art. 34') },
            { id: 'ob-d3-2', tekst: napis('ue.obowiazki.4'), art: cyt('art. 3 ust. 4 lit. a–d'), sankcja: cyt('art. 34'), pomoc: napis('ue.obowiazki.5') },
            { id: 'ob-d3-3', tekst: napis('ue.obowiazki.6'), art: cyt('art. 3 ust. 5'), sankcja: cyt('art. 34'), pomoc: napis('ue.obowiazki.7') },
            { id: 'ob-d27-1', tekst: napis('ue.obowiazki.8'), art: cyt('art. 27 ust. 2'), sankcja: cyt('art. 34'), warunkowe: napis('ue.obowiazki.9') },
        ],
    },
    {
        id: 'ob-incydenty',
        nazwa: napis('ue.obowiazki.10'),
        podstawa: cyt('art. 23 dyrektywy (UE) 2022/2555'),
        opis: napis('ue.obowiazki.11'),
        pytania: [
            { id: 'ob-d23-1', tekst: napis('ue.obowiazki.12'), art: cyt('art. 23 ust. 4 lit. a'), termin: napis('ue.obowiazki.13'), sankcja: cyt('art. 34') },
            { id: 'ob-d23-2', tekst: napis('ue.obowiazki.14'), art: cyt('art. 23 ust. 4 lit. b'), termin: napis('ue.obowiazki.15'), sankcja: cyt('art. 34') },
            { id: 'ob-d23-3', tekst: napis('ue.obowiazki.16'), art: cyt('art. 23 ust. 4 lit. d'), termin: napis('ue.obowiazki.17'), sankcja: cyt('art. 34') },
            { id: 'ob-d23-4', tekst: napis('ue.obowiazki.18'), art: cyt('art. 23 ust. 1 akapit drugi'), sankcja: cyt('art. 34') },
            { id: 'ob-d23-5', tekst: napis('ue.obowiazki.19'), art: cyt('art. 23 ust. 2'), sankcja: cyt('art. 34') },
            { id: 'ob-d23-6', tekst: napis('ue.obowiazki.20'), art: cyt('art. 23 ust. 4 akapit drugi'), termin: '24 godziny', sankcja: cyt('art. 34'), warunkowe: napis('ue.obowiazki.21') },
        ],
    },
    {
        id: 'ob-kierownik',
        nazwa: napis('ue.obowiazki.22'),
        podstawa: cyt('art. 20 dyrektywy (UE) 2022/2555'),
        opis: napis('ue.obowiazki.23'),
        pytania: [
            { id: 'ob-d20-1', tekst: napis('ue.obowiazki.24'), art: cyt('art. 20 ust. 1'), sankcja: cyt('art. 20 ust. 1, art. 32 ust. 5 lit. b') },
            { id: 'ob-d20-2', tekst: napis('ue.obowiazki.25'), art: cyt('art. 20 ust. 1'), sankcja: cyt('art. 20 ust. 1') },
            { id: 'ob-d20-3', tekst: napis('ue.obowiazki.26'), art: cyt('art. 20 ust. 2'), sankcja: cyt('art. 34') },
        ],
    },
    {
        id: 'ob-nadzor',
        nazwa: napis('ue.obowiazki.27'),
        podstawa: cyt('art. 32 i 33 dyrektywy (UE) 2022/2555'),
        opis: napis('ue.obowiazki.28'),
        pytania: [
            { id: 'ob-d32-1', tekst: napis('ue.obowiazki.29'), art: cyt('art. 32 ust. 2 lit. e–f; art. 33 ust. 2 lit. d–e'), sankcja: cyt('art. 32 ust. 4, art. 33 ust. 4') },
            { id: 'ob-d32-2', tekst: napis('ue.obowiazki.30'), art: cyt('art. 32 ust. 2 lit. g; art. 33 ust. 2 lit. f'), sankcja: cyt('art. 32 ust. 4, art. 33 ust. 4') },
            { id: 'ob-d32-3', tekst: napis('ue.obowiazki.31'), art: cyt('art. 32 ust. 2 lit. b–c i ust. 3'), tylkoDlaStatusu: ['kluczowy'], sankcja: cyt('art. 32 ust. 4') },
        ],
    },
];

    KRAJE.rejestruj('ue', { KSC_OBOWIAZKI_SEKCJE });
})();
