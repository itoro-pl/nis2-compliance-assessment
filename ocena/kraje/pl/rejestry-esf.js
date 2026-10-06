/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Odczyt e-sprawozdania finansowego (eSF) z Repozytorium
   Dokumentów Finansowych KRS

   Repozytorium wydaje sprawozdania jako plik XML albo archiwum ZIP
   zawierające XML. Plik jest czytany WYŁĄCZNIE lokalnie, w pamięci
   przeglądarki — nic nie jest nigdzie wysyłane.

   Z dokumentu pobieramy przychód za okres sprawozdawczy, bo art. 73
   ust. 3 ustawy o KSC wiąże wysokość kary z przychodem osiągniętym
   w roku obrotowym poprzedzającym jej wymierzenie.

   Obsługiwane struktury: sprawozdania w formacie MF (crd.gov.pl),
   rachunek zysków i strat w wariancie porównawczym albo kalkulacyjnym.
   ========================================================== */

const ESF_ZRODLO = {
    nazwa: 'e-sprawozdanie finansowe',
    organ: 'Repozytorium Dokumentów Finansowych KRS',
    przegladarka: 'https://rdf-przegladarka.ms.gov.pl/wyszukaj-podmiot',
};

/* ── ROZPAKOWANIE ZIP ──────────────────────────────────────
   Czytamy centralny katalog archiwum, a nie nagłówki lokalne.

   Repozytorium wydaje archiwa zapisywane strumieniowo: mają ustawiony
   bit 3 flagi ogólnej, przez co rozmiary w nagłówku lokalnym są zerowe,
   a prawdziwe znajdują się w deskryptorze danych ZA zawartością.
   Centralny katalog zawsze niesie poprawne rozmiary i przesunięcia,
   więc jest jedynym pewnym punktem wejścia.

   Dekompresja przez DecompressionStream — bez zewnętrznych bibliotek. */
async function esfRozpakuj(bufor) {
    const bajty = new Uint8Array(bufor);
    if (!(bajty[0] === 0x50 && bajty[1] === 0x4B)) return null;   // sygnatura PK

    const dv = new DataView(bufor);

    /* Koniec centralnego katalogu (EOCD): PK\x05\x06, szukamy od końca,
       bo za nim może stać komentarz archiwum. */
    let eocd = -1;
    const dolnaGranica = Math.max(0, bajty.length - 66000);
    for (let i = bajty.length - 22; i >= dolnaGranica; i--) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('Archiwum ZIP jest uszkodzone — nie odnaleziono katalogu centralnego.');

    const wpisow = dv.getUint16(eocd + 10, true);
    let poz = dv.getUint32(eocd + 16, true);

    for (let n = 0; n < wpisow; n++) {
        if (dv.getUint32(poz, true) !== 0x02014b50) break;   // PK\x01\x02
        const metoda = dv.getUint16(poz + 10, true);
        const rozmiarSkompresowany = dv.getUint32(poz + 20, true);
        const dlNazwy = dv.getUint16(poz + 28, true);
        const dlDodatkow = dv.getUint16(poz + 30, true);
        const dlKomentarza = dv.getUint16(poz + 32, true);
        const przesuniecieLokalne = dv.getUint32(poz + 42, true);
        const nazwa = new TextDecoder('utf-8').decode(bajty.slice(poz + 46, poz + 46 + dlNazwy));

        if (/\.xml$/i.test(nazwa)) {
            if (rozmiarSkompresowany === 0xFFFFFFFF || przesuniecieLokalne === 0xFFFFFFFF) {
                throw new Error('Archiwum w formacie ZIP64 nie jest obsługiwane. Rozpakuj plik ręcznie i wskaż plik XML.');
            }
            /* Nagłówek lokalny może mieć inną długość pola dodatkowego
               niż wpis w katalogu centralnym — czytamy ją stamtąd. */
            if (dv.getUint32(przesuniecieLokalne, true) !== 0x04034b50) {
                throw new Error('Archiwum ZIP jest uszkodzone — niespójny nagłówek pliku.');
            }
            const lokDlNazwy = dv.getUint16(przesuniecieLokalne + 26, true);
            const lokDlDodatkow = dv.getUint16(przesuniecieLokalne + 28, true);
            const start = przesuniecieLokalne + 30 + lokDlNazwy + lokDlDodatkow;
            const dane = bajty.slice(start, start + rozmiarSkompresowany);

            if (metoda === 0) return new TextDecoder('utf-8').decode(dane);
            if (metoda === 8) {
                if (typeof DecompressionStream === 'undefined') {
                    throw new Error('Ta przeglądarka nie potrafi rozpakować archiwum ZIP. Rozpakuj plik ręcznie i wskaż plik XML.');
                }
                const strumien = new Blob([dane]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
                return await new Response(strumien).text();
            }
            throw new Error('Nieobsługiwana metoda kompresji w archiwum ZIP. Rozpakuj plik ręcznie.');
        }
        poz += 46 + dlNazwy + dlDodatkow + dlKomentarza;
    }
    throw new Error('W archiwum ZIP nie znaleziono pliku XML ze sprawozdaniem.');
}

/* ── ODCZYT XML ────────────────────────────────────────────*/
function esfTekst(korzen, nazwaLokalna) {
    const el = esfZnajdz(korzen, nazwaLokalna);
    return el ? (el.textContent || '').trim() : null;
}

/* Wyszukiwanie po nazwie lokalnej — dokument używa wielu przestrzeni nazw
   (tns, jin, dtsf), a ich prefiksy zależą od typu sprawozdania. */
function esfZnajdz(korzen, nazwaLokalna) {
    if (!korzen) return null;
    const stos = [korzen];
    while (stos.length) {
        const w = stos.shift();
        for (const d of w.children) {
            if (d.localName === nazwaLokalna) return d;
            stos.push(d);
        }
    }
    return null;
}

function esfDzieciBezposrednie(el, nazwaLokalna) {
    if (!el) return [];
    return Array.from(el.children).filter(d => d.localName === nazwaLokalna);
}

/* Suma kontrolna NIP — służy odróżnieniu numeru NIP od numeru KRS,
   bo oba bywają dziesięciocyfrowe i leżą w polach o nazwach pozycyjnych. */
function esfNipPoprawny(n) {
    if (!/^\d{10}$/.test(n)) return false;
    const wagi = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const suma = wagi.reduce((a, w, i) => a + w * Number(n[i]), 0) % 11;
    return suma !== 10 && suma === Number(n[9]);
}

function esfLiczba(tekst) {
    if (tekst === null || tekst === undefined || tekst === '') return null;
    const v = Number(String(tekst).replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(v) ? v : null;
}

/* Przychód z rachunku zysków i strat.
   Wariant porównawczy: pozycja A — przychody netto ze sprzedaży
   i zrównane z nimi. Wariant kalkulacyjny: pozycja A — przychody netto
   ze sprzedaży produktów, towarów i materiałów.
   KwotaA to okres bieżący, KwotaB poprzedni. */
/* Nazwa elementu zależy od rodzaju sprawozdania: "RZiS" w jednostce innej,
   "RZiSJednostkaMala" w małej, "RachunekZyskowIStrat" w niektórych wzorach.
   Dopasowujemy po początku nazwy, a nie dokładnie. */
function esfZnajdzWzorcem(korzen, sprawdz) {
    if (!korzen) return null;
    const stos = [korzen];
    while (stos.length) {
        const w = stos.shift();
        for (const d of w.children) {
            if (sprawdz(d.localName)) return d;
            stos.push(d);
        }
    }
    return null;
}

function esfPrzychody(dokument) {
    const rzis = esfZnajdzWzorcem(dokument,
        (n) => /^RZiS/i.test(n) || /^RachunekZyskowIStrat/i.test(n));
    if (!rzis) return { blad: 'Dokument nie zawiera rachunku zysków i strat.' };

    let wariant = null, kontener = null;
    for (const d of rzis.children) {
        if (/Por$/.test(d.localName)) { wariant = 'porównawczy'; kontener = d; break; }
        if (/Kal$/.test(d.localName)) { wariant = 'kalkulacyjny'; kontener = d; break; }
    }
    if (!kontener) { kontener = rzis; wariant = 'nieokreślony'; }

    const a = esfDzieciBezposrednie(kontener, 'A')[0];
    if (!a) return { blad: 'Nie odnaleziono pozycji A rachunku zysków i strat — struktura sprawozdania nie jest obsługiwana.' };

    const biezacy = esfLiczba(esfDzieciBezposrednie(a, 'KwotaA').map(x => x.textContent)[0]);
    const poprzedni = esfLiczba(esfDzieciBezposrednie(a, 'KwotaB').map(x => x.textContent)[0]);

    if (biezacy === null) return { blad: 'Pozycja A rachunku zysków i strat nie zawiera kwoty.' };
    return { wariant, biezacy, poprzedni };
}

/* Główna funkcja: przyjmuje obiekt File, zwraca odczytane dane. */
async function esfWczytaj(plik) {
    const wynik = {
        ok: false, blad: null, ostrzezenia: [],
        nazwa: null, nip: null, krs: null, adres: null,
        okresOd: null, okresDo: null, dataSporzadzenia: null,
        rodzajSprawozdania: null, wariantRZiS: null,
        przychodBiezacy: null, przychodPoprzedni: null,
    };

    let tekst;
    try {
        const bufor = await plik.arrayBuffer();
        tekst = await esfRozpakuj(bufor);
        if (tekst === null) tekst = new TextDecoder('utf-8').decode(bufor);
    } catch (e) {
        wynik.blad = e.message || 'Nie udało się odczytać pliku.';
        return wynik;
    }

    if (!/<\?xml|<[a-zA-Z]+:Dokument|<Dokument/.test(tekst.slice(0, 4000))) {
        wynik.blad = 'Plik nie wygląda na sprawozdanie finansowe w formacie XML. Wskaż plik XML albo archiwum ZIP pobrane z Repozytorium Dokumentów Finansowych.';
        return wynik;
    }

    let dok;
    try {
        dok = new DOMParser().parseFromString(tekst, 'application/xml');
    } catch (e) {
        wynik.blad = 'Nie udało się przetworzyć pliku XML.';
        return wynik;
    }
    if (dok.querySelector('parsererror')) {
        wynik.blad = 'Plik XML jest uszkodzony albo niekompletny.';
        return wynik;
    }

    const korzen = dok.documentElement;
    wynik.okresOd = esfTekst(korzen, 'OkresOd');
    wynik.okresDo = esfTekst(korzen, 'OkresDo');
    wynik.dataSporzadzenia = esfTekst(korzen, 'DataSporzadzenia');
    wynik.rodzajSprawozdania = esfTekst(korzen, 'KodSprawozdania');
    wynik.nazwa = esfTekst(korzen, 'NazwaFirmy');

    /* Identyfikatory leżą w polach o nazwach pozycyjnych, a ich znaczenie
       zależy od rodzaju sprawozdania: w jednostce innej NIP jest w P_1D
       i KRS w P_1E, w jednostce małej NIP w P_1C i KRS w P_1D.
       Zamiast zgadywać po nazwie pola rozpoznajemy numery po ich budowie:
       NIP ma poprawną cyfrę kontrolną, KRS jest dziesięciocyfrowy
       i uzupełniony zerami z przodu. */
    const kandydaci = [];
    ['NIP', 'NumerKRS', 'P_1B', 'P_1C', 'P_1D', 'P_1E', 'P_1F'].forEach(n => {
        const el = esfZnajdz(korzen, n);
        if (!el) return;
        const t = (el.textContent || '').replace(/[^0-9]/g, '');
        if (t.length >= 9 && t.length <= 10) kandydaci.push(t);
    });

    for (const t of kandydaci) {
        if (!wynik.nip && t.length === 10 && esfNipPoprawny(t)) { wynik.nip = t; continue; }
        if (!wynik.krs && t.length === 10 && /^0/.test(t)) wynik.krs = t;
    }
    /* Gdy pozostał jeden nierozpoznany numer, a brakuje KRS — przyjmujemy go. */
    if (!wynik.krs) {
        const reszta = kandydaci.find(t => t !== wynik.nip && t.length === 10);
        if (reszta) wynik.krs = reszta;
    }

    const adr = esfZnajdz(korzen, 'AdresPol');
    if (adr) {
        const p = (n) => esfTekst(adr, n) || '';
        const ulica = [p('Ulica'), p('NrDomu')].filter(Boolean).join(' ');
        const lokal = p('NrLokalu');
        wynik.adres = [
            ulica + (lokal ? '/' + lokal : ''),
            [p('KodPocztowy'), p('Miejscowosc')].filter(Boolean).join(' '),
        ].filter(x => x && x.trim()).join(', ');
    }

    const przych = esfPrzychody(korzen);
    if (przych.blad) {
        wynik.ostrzezenia.push(przych.blad + ' Przychód uzupełnij ręcznie.');
    } else {
        wynik.wariantRZiS = przych.wariant;
        wynik.przychodBiezacy = przych.biezacy;
        wynik.przychodPoprzedni = przych.poprzedni;
    }

    wynik.ok = true;

    if (wynik.okresDo) {
        const rok = new Date(wynik.okresDo).getFullYear();
        const teraz = new Date().getFullYear();
        if (teraz - rok >= 2) {
            wynik.ostrzezenia.push(`Sprawozdanie dotyczy roku ${rok}, a mamy rok ${teraz}. Podstawą wymiaru kary jest przychód z roku obrotowego poprzedzającego jej wymierzenie (art. 73 ust. 3) — rozważ nowsze sprawozdanie.`);
        }
    }

    return wynik;
}

/* Opis okresu do wyświetlenia. */
function esfOpisOkresu(w) {
    if (!w.okresOd || !w.okresDo) return '';
    const f = (d) => new Date(d).toLocaleDateString('pl-PL');
    return `${f(w.okresOd)} – ${f(w.okresDo)}`;
}

    KRAJE.rejestruj('pl', {
        ESF_ZRODLO,
        esfRozpakuj,
        esfTekst,
        esfZnajdz,
        esfDzieciBezposrednie,
        esfNipPoprawny,
        esfLiczba,
        esfZnajdzWzorcem,
        esfPrzychody,
        esfWczytaj,
        esfOpisOkresu,
    });
})();
