/* Wspólny moduł unijny — używany dla państw, które nie mają jeszcze
   modułu prawa krajowego, oraz dla państw bez transpozycji.

   Treść pochodzi wprost z dyrektywy (UE) 2022/2555: klasyfikacja
   z art. 3, katalog środków z art. 21 ust. 2, zgłaszanie incydentów
   z art. 23, obowiązki kierownictwa z art. 20, pułapy kar z art. 34.
   Rozporządzenie wykonawcze 2024/2690 dochodzi jako warstwa wspólna.

   Czego ten moduł NIE zawiera, bo tego nie ma w dyrektywie: organów
   krajowych, terminów krajowych, minimalnych kwot kar, warstwy
   telekomunikacyjnej, ścieżki podmiotów publicznych, integracji
   z rejestrami. Te pola są tu jawnie puste, a interfejs mówi o tym
   użytkownikowi.

   Teksty tego modułu idą przez napis() z kluczami ue.*, bo pokazuje
   się on w dowolnym języku interfejsu — inaczej niż moduł krajowy,
   pisany w języku swojego państwa. */
KRAJE.manifest('ue', {
    nazwa: 'Unia Europejska — dyrektywa (UE) 2022/2555',
    jezyki: ['en', 'pl'],
    /* Pliki w napisy/ — ładowarka nie pyta o inne. */
    napisy: ['bg', 'cs', 'da', 'de', 'de-AT', 'el', 'el-CY', 'en', 'es', 'et', 'fi', 'fr', 'fr-BE', 'fr-LU', 'ga', 'hr', 'hu', 'it', 'lt', 'lv', 'mt', 'nl', 'nl-BE', 'pl', 'pt', 'ro', 'sk', 'sl', 'sv', 'sv-FI'],
    pliki: [
        'cytaty',
        'akty-krajowe',
        'role',
        'meta',
        'katalog',
        'obowiazki',
        'kierownictwo',
        'moduly',
        'zaslepki',
    ],
});
