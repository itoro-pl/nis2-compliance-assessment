/* ==========================================================
   Wersja narzędzia.

   Numer jest odrębny od SCHEMA_VERSION z core/stan.js: ten drugi
   opisuje format zapisanej oceny i rośnie tylko wtedy, gdy zmienia się
   struktura pliku JSON. Wersja narzędzia rośnie przy każdym wydaniu.

   Przy zmianie numeru dopisz wydanie na początku zmiany.html — to ona
   jest listą zmian pokazywaną użytkownikowi.
   ========================================================== */
const WERSJA = {
    numer: '1.2.0',
    data: '2026-10-06',
    opis: 'Pierwsze wydanie publiczne: 27 państw UE, 24 języki urzędowe, teksty aktów wdrażających NIS 2 z 23 państw.',
};

/* „1.0.0 · 21 lipca 2026" — postać do stopki i nagłówków eksportów. */
function wersjaOpis() {
    return WERSJA.numer + ' · ' + new Date(WERSJA.data).toLocaleDateString(typeof LOCALE !== 'undefined' ? LOCALE.znacznik() : 'pl-PL', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}
