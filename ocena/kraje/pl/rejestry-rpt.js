/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Rejestr przedsiębiorców telekomunikacyjnych (rejestr PT)

   Prowadzony przez Prezesa UKE na podstawie art. 5 ust. 1 Prawa
   komunikacji elektronicznej, publikowany jako otwarte dane:
   https://dane.gov.pl/pl/dataset/4662

   Dla naszego rynku to źródło mocniejsze niż kody PKD: obecność
   w rejestrze jest dowodem prowadzenia działalności telekomunikacyjnej,
   a nie przesłanką domniemania. Wpis pozwala dodatkowo wstępnie
   odpowiedzieć na pytania o sam wpis oraz o zgodność zakresu
   działalności z wnioskiem (art. 6 ust. 1 pkt 5 i 8 PKE).

   DLACZEGO INDEKS JEST LOKALNY:
   pliki CSV rejestru — zarówno na dane.gov.pl, jak i u źródła
   w rejestry.uke.gov.pl — nie wysyłają nagłówka
   Access-Control-Allow-Origin, więc przeglądarka nie może pobrać ich
   bezpośrednio. Indeks budujemy skryptem i dołączamy do paczki.
   Dzięki temu sprawdzenie działa również bez internetu.

   Odświeżenie danych: node narzedzia/generuj-rpt.js

   Zależności: data/rpt-indeks.js (RPT_WPISY, RPT_STAN_NA, RPT_WPISOW)
   ========================================================== */

const RPT_ZRODLO = {
    nazwa: 'Rejestr przedsiębiorców telekomunikacyjnych',
    organ: 'Prezes Urzędu Komunikacji Elektronicznej',
    zbior: 'https://dane.gov.pl/pl/dataset/4662',
    podstawa: 'art. 5 ust. 1 Prawa komunikacji elektronicznej',
};

/* Po ilu dniach od stanu rejestru sygnalizujemy, że warto go odświeżyć. */
const RPT_PRZETERMINOWANIE_DNI = 120;

function rptDostepny() {
    return typeof RPT_WPISY === 'object' && RPT_WPISY !== null;
}

function rptWiekDni() {
    if (!rptDostepny() || !RPT_STAN_NA) return null;
    return Math.floor((Date.now() - new Date(RPT_STAN_NA).getTime()) / 86400000);
}

/* Sprawdzenie pojedynczego NIP w rejestrze. Działa lokalnie i natychmiast. */
function rptSprawdzNip(nip) {
    if (!rptDostepny()) {
        return { ok: false, blad: 'Indeks rejestru przedsiębiorców telekomunikacyjnych nie został dołączony do narzędzia.' };
    }
    const n = String(nip || '').replace(/[^0-9]/g, '');
    const w = RPT_WPISY[n] || null;
    const wiek = rptWiekDni();

    return {
        ok: true,
        stanNa: RPT_STAN_NA,
        wpisow: RPT_WPISOW,
        wiekDni: wiek,
        przeterminowany: wiek !== null && wiek > RPT_PRZETERMINOWANIE_DNI,
        znaleziony: !!w,
        aktywny: !!w,
        wpis: w ? { nr: w.nr, dataWpisu: w.d, uslugi: w.u, sieci: w.s, obszar: w.o } : null,
    };
}

/* Rozbicie pola usług na listę — w rejestrze są rozdzielone przecinkami. */
function rptUslugiLista(wpis) {
    if (!wpis || !wpis.uslugi) return [];
    return wpis.uslugi.split(',').map(s => s.trim()).filter(Boolean);
}

/* Czy zadeklarowane usługi wskazują na świadczenie dostępu do internetu. */
function rptCzyDostepDoInternetu(wpis) {
    return /dost[ęe]pu do Internetu/i.test((wpis && wpis.uslugi) || '');
}

    KRAJE.rejestruj('pl', {
        RPT_ZRODLO,
        RPT_PRZETERMINOWANIE_DNI,
        rptDostepny,
        rptWiekDni,
        rptSprawdzNip,
        rptUslugiLista,
        rptCzyDostepDoInternetu,
    });
})();
