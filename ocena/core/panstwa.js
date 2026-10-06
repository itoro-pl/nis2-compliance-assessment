/* ==========================================================
   Państwa członkowskie i języki urzędowe Unii Europejskiej.

   Dwie niezależne osie: państwo wybiera moduł prawa krajowego,
   język wybiera teksty interfejsu i wersję rozporządzenia 2024/2690.
   Austriak i Niemiec dostają ten sam locale/de.js, ale inny moduł
   kraju; przy Austrii nakłada się jeszcze locale/de-AT.js, bo
   terminologia ustawowa różni się między nimi.

   Źródło listy języków: badanie Etapu 0 (24 języki urzędowe UE,
   33 pary państwo–język). Luksemburski i turecki nie generują
   wersji, bo nie publikuje się w nich prawa wdrażającego NIS 2.

   Stan modułu:
     'gotowy'          moduł prawa krajowego istnieje
     'w-przygotowaniu' ustawa jest, moduł jeszcze nie — działa
                       warstwa wspólna (rozporządzenie 2024/2690)
     'brak-ustawy'     państwo nie wdrożyło dyrektywy; działa
                       wyłącznie warstwa wspólna
   ========================================================== */

const JEZYKI = [
    { kod: 'bg', nazwa: 'Български' },
    { kod: 'cs', nazwa: 'Čeština' },
    { kod: 'da', nazwa: 'Dansk' },
    { kod: 'de', nazwa: 'Deutsch' },
    { kod: 'el', nazwa: 'Ελληνικά' },
    { kod: 'en', nazwa: 'English' },
    { kod: 'es', nazwa: 'Español' },
    { kod: 'et', nazwa: 'Eesti' },
    { kod: 'fi', nazwa: 'Suomi' },
    { kod: 'fr', nazwa: 'Français' },
    { kod: 'ga', nazwa: 'Gaeilge' },
    { kod: 'hr', nazwa: 'Hrvatski' },
    { kod: 'hu', nazwa: 'Magyar' },
    { kod: 'it', nazwa: 'Italiano' },
    { kod: 'lt', nazwa: 'Lietuvių' },
    { kod: 'lv', nazwa: 'Latviešu' },
    { kod: 'mt', nazwa: 'Malti' },
    { kod: 'nl', nazwa: 'Nederlands' },
    { kod: 'pl', nazwa: 'Polski' },
    { kod: 'pt', nazwa: 'Português' },
    { kod: 'ro', nazwa: 'Română' },
    { kod: 'sk', nazwa: 'Slovenčina' },
    { kod: 'sl', nazwa: 'Slovenščina' },
    { kod: 'sv', nazwa: 'Svenska' },
];

const JEZYK_WG_KODU = Object.fromEntries(JEZYKI.map(j => [j.kod, j]));

/* nazwaWlasna — jak państwo nazywa siebie; niezależna od języka
   interfejsu, pokazywana obok nazwy przetłumaczonej.
   jezyki — języki urzędowe, pierwszy jest domyślny.
   nakladka — wariant regionalny locale, jeśli terminologia się różni. */
const PANSTWA = [
    { kod: 'AT', nazwaWlasna: 'Österreich',   jezyki: ['de'], nakladka: { de: 'de-AT' }, modul: 'w-przygotowaniu' },
    { kod: 'BE', nazwaWlasna: 'België · Belgique · Belgien', jezyki: ['nl', 'fr', 'de'], nakladka: { nl: 'nl-BE', fr: 'fr-BE' }, modul: 'w-przygotowaniu' },
    { kod: 'BG', nazwaWlasna: 'България',     jezyki: ['bg'], modul: 'w-przygotowaniu' },
    { kod: 'HR', nazwaWlasna: 'Hrvatska',     jezyki: ['hr'], modul: 'w-przygotowaniu' },
    { kod: 'CY', nazwaWlasna: 'Κύπρος',       jezyki: ['el'], nakladka: { el: 'el-CY' }, modul: 'w-przygotowaniu' },
    { kod: 'CZ', nazwaWlasna: 'Česko',        jezyki: ['cs'], modul: 'w-przygotowaniu' },
    { kod: 'DK', nazwaWlasna: 'Danmark',      jezyki: ['da'], modul: 'w-przygotowaniu' },
    { kod: 'EE', nazwaWlasna: 'Eesti',        jezyki: ['et'], modul: 'w-przygotowaniu' },
    { kod: 'FI', nazwaWlasna: 'Suomi · Finland', jezyki: ['fi', 'sv'], nakladka: { sv: 'sv-FI' }, modul: 'w-przygotowaniu' },
    { kod: 'FR', nazwaWlasna: 'France',       jezyki: ['fr'], modul: 'brak-ustawy' },
    { kod: 'DE', nazwaWlasna: 'Deutschland',  jezyki: ['de'], modul: 'w-przygotowaniu' },
    { kod: 'GR', nazwaWlasna: 'Ελλάδα',       jezyki: ['el'], modul: 'w-przygotowaniu' },
    { kod: 'HU', nazwaWlasna: 'Magyarország', jezyki: ['hu'], modul: 'w-przygotowaniu' },
    { kod: 'IE', nazwaWlasna: 'Éire · Ireland', jezyki: ['en', 'ga'], modul: 'brak-ustawy' },
    { kod: 'IT', nazwaWlasna: 'Italia',       jezyki: ['it'], modul: 'w-przygotowaniu' },
    { kod: 'LV', nazwaWlasna: 'Latvija',      jezyki: ['lv'], modul: 'w-przygotowaniu' },
    { kod: 'LT', nazwaWlasna: 'Lietuva',      jezyki: ['lt'], modul: 'w-przygotowaniu' },
    { kod: 'LU', nazwaWlasna: 'Luxembourg · Luxemburg', jezyki: ['fr', 'de'], nakladka: { fr: 'fr-LU' }, modul: 'w-przygotowaniu' },
    { kod: 'MT', nazwaWlasna: 'Malta',        jezyki: ['mt', 'en'], modul: 'w-przygotowaniu' },
    { kod: 'NL', nazwaWlasna: 'Nederland',    jezyki: ['nl'], modul: 'w-przygotowaniu' },
    { kod: 'PL', nazwaWlasna: 'Polska',       jezyki: ['pl'], modul: 'gotowy' },
    { kod: 'PT', nazwaWlasna: 'Portugal',     jezyki: ['pt'], modul: 'w-przygotowaniu' },
    { kod: 'RO', nazwaWlasna: 'România',      jezyki: ['ro'], modul: 'w-przygotowaniu' },
    { kod: 'SK', nazwaWlasna: 'Slovensko',    jezyki: ['sk'], modul: 'w-przygotowaniu' },
    { kod: 'SI', nazwaWlasna: 'Slovenija',    jezyki: ['sl'], modul: 'w-przygotowaniu' },
    { kod: 'ES', nazwaWlasna: 'España',       jezyki: ['es'], modul: 'brak-ustawy' },
    { kod: 'SE', nazwaWlasna: 'Sverige',      jezyki: ['sv'], modul: 'w-przygotowaniu' },
];

const PANSTWO_WG_KODU = Object.fromEntries(PANSTWA.map(p => [p.kod, p]));

/* Moduł kraju ładowany dla danego państwa: własny, gdy istnieje,
   inaczej wspólny moduł unijny oparty wprost na dyrektywie. */
function modulDlaPanstwa(kod) {
    const p = PANSTWO_WG_KODU[kod];
    return p && p.modul === 'gotowy' ? kod.toLowerCase() : 'ue';
}
