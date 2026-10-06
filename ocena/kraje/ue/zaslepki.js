/* Moduł ue: to, czego dyrektywa nie zna, a silnik oczekuje.

   Każda z tych struktur istnieje w module polskim jako treść krajowa —
   ustawa telekomunikacyjna, ścieżka podmiotów publicznych, portal
   rejestracji, wytyczne ministerstwa, rejestry gospodarcze. Tu są jawnie
   puste albo zastąpione odesłaniem do prawa krajowego, a interfejs mówi
   o tym wprost. Zaślepka, która udaje treść, byłaby gorsza niż brak.

   Odesłania do przepisów prowadzą do urzędowego HTML na EUR-Lex w języku
   interfejsu, z zakotwiczeniem na artykule — nie ma tu PDF-ów. */
(function () {

const jezyk = (LOCALE.aktywny || 'pl').split('-')[0].toUpperCase();
const eurlex = (celex) => `https://eur-lex.europa.eu/legal-content/${jezyk}/TXT/HTML/?uri=CELEX:${celex}`;

/* ── Akty i kotwice ─────────────────────────────────────── */
const AKTY_PLIKI = {
    ksc: {
        tytul: napis('ue.zaslepki.1'),
        dziennik: napis('ue.zaslepki.2'),
        plik: eurlex('32022L2555'),
        stron: null,
        skrot: napis('ue.zaslepki.skrotDyrektywy'),
    },
    reg2690: {
        tytul: napis('ue.zaslepki.3'),
        dziennik: napis('ue.zaslepki.4'),
        plik: eurlex('32024R2690'),
        stron: null,
        skrot: napis('ue.zaslepki.skrotReg2690'),
    },
};

/* Odesłania w tym module są pisane w języku interfejsu, więc polskie
   wzorce z core/odeslania.js ich nie rozpoznają. Akt poznajemy po
   numerze aktu, artykuł po pierwszej liczbie — odesłania tego modułu
   zawsze zaczynają się od artykułu, numer aktu jest dalej. */
/* Odesłania do załącznika rozporządzenia („sekcja 6", „pkt 6.1") składa
   core/punktacja.js z kluczy punktacja.sekcja / punktacja.punkt — poznajemy
   je po stałych częściach tych wzorców w bieżącym języku. */
const czesciWzorca = (klucz) => napis(klucz).split('{p0}').map(c => c.trim()).filter(Boolean);
const WZORCE_ZALACZNIKA = [czesciWzorca('punktacja.sekcja'), czesciWzorca('punktacja.punkt')];
/* Nazwa aktu w treści plakietki jest zbędna (jest na etykiecie), więc
   ją zdejmujemy. Ze stałych części wzorców ue.cyt.dyr / ue.cyt.rozp
   („der Richtlinie (EU) 2022/2555", „az (EU) 2024/2690 rendelet") budujemy
   wyrażenie, które toleruje odmianę rzeczownika (Uredbe/Uredbi — rdzeń
   pięciu liter) i zdejmuje też do trzech poprzedzających krótkich słów
   (przyimki, rodzajniki: „du", „to", „a ghabhann le"), bo odesłania do
   załącznika mają inną składnię niż wzorzec artykułu. */
const uciekaj = (t) => t.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
const WZORCE_NAZW_AKTOW = [czesciWzorca('ue.cyt.dyr'), czesciWzorca('ue.cyt.rozp')].flat().map(czesc => {
    /* Dopasowanie zaczyna się na granicy słowa, inaczej „Annex to Regulation"
       traciłoby „nnex". Bez flagi „i": \p{Ll} ma odróżniać „annexe" od „Annex".
       Wielkość pierwszej litery rdzenia (Regulation/regulation) — jawna
       alternatywa. Najpierw postać „numer aktu, potem rzeczownik" (węgierski
       „az (EU) 2024/2690 rendelet"), inaczej rodzajnik „az" uchodziłby za
       nazwę aktu. */
    const slowa = '(?<!\\p{L})(?:(?:\\p{L}{1,3}|\\p{Ll}+)\\s+){0,3}';
    const rdzen = (w) => '[' + w[0].toUpperCase() + w[0].toLowerCase() + ']' + uciekaj(w.slice(1, 5));
    let m = czesc.match(/\((\p{L}{2})\)\s*(\d{4}\/\d{4})\s+(\p{L}{4,})/u);
    if (m) return new RegExp(slowa + '\\(' + m[1] + '\\)\\s*' + uciekaj(m[2]) + '\\s+' + rdzen(m[3]) + '\\p{L}*', 'gu');
    m = czesc.match(/(\p{L}+)\s*\((\p{L}{2})\)\s*(\d{4}\/\d{4})/u);
    if (m) return new RegExp(slowa + rdzen(m[1]) + '\\p{L}*\\s*\\(' + m[2] + '\\)\\s*' + uciekaj(m[3]), 'gu');
    return czesc.length > 3 ? new RegExp(uciekaj(czesc), 'g') : null;
}).filter(Boolean);
/* Po zdjęciu nazwy aktu zostaje czasem osierocony przyimek („point 1.2.6
   de l'", „punt 1.2.6 van") — zdejmujemy końcowe krótkie słowa małą literą
   (od dwóch liter, żeby nie tknąć litery przepisu „b") i urwane cząstki
   z apostrofem lub łącznikiem. */
const bezOsieroconych = (t) => {
    let w = t, poprzedni;
    do { poprzedni = w; w = w.replace(/\s+(?:\p{Ll}{2,4}|\p{Ll}*'|\p{L}+-)$/u, ''); } while (w !== poprzedni);
    return w;
};
const ODESLANIA_WZORCE = {
    akty: [[/2024\/2690/, 'reg2690'], [/2022\/2555/, 'ksc']],
    artykul: /(\d+)/,
    podzial: /\s*;\s*/,
    odeslanie: /\d/,
    zalacznik: (t) => WZORCE_ZALACZNIKA.some(czesci => czesci.length && czesci.every(c => t.includes(c))),
    skroc: (t) => { const w = WZORCE_NAZW_AKTOW.reduce((x, wz) => x.replace(wz, ' '), t); return w === t ? t : bezOsieroconych(w.trim()); },
};

/* Kotwice EUR-Lex: art_N dla artykułów, anx_I/anx_II dla załączników.
   Dyrektywa ma 46 artykułów i trzy załączniki, rozporządzenie 16 artykułów
   i jeden załącznik. */
const kotwice = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [String(i + 1), 'art_' + (i + 1)]));
const AKTY_STRONY = {
    ksc: Object.assign(kotwice(46), { 'zal1': 'anx_I', 'zal2': 'anx_II', 'zal3': 'anx_III' }),
    reg2690: Object.assign(kotwice(16), { 'zal': 'anx_I' }),
};

/* ── Warstwa telekomunikacyjna: brak w dyrektywie ──────── */
const PKE_META = { tytul: null, uwaga: napis('ue.zaslepki.5') };
const PKE_PRZEJSCIOWE = [];
const PKE_KARY = {};
const PKE_SANKCJE_NIEFINANSOWE = [];
const PKE_SEKCJE = [];
const PKE_DO_WERYFIKACJI = [];
function pkeDotyczy() { return false; }

/* ── Ścieżka podmiotów publicznych: konstrukcja krajowa ── */
const ZAL4_SEKCJE = [];

/* ── Portal rejestracji: krajowy, tu nieznany ───────────── */
const S46 = {
    nazwa: napis('ue.zaslepki.6'),
    podstawa: cyt('art. 3 ust. 3 i 4 dyrektywy (UE) 2022/2555'),
    prowadzi: napis('ue.zaslepki.7'),
    opis: napis('ue.zaslepki.8'),
    ktoMusi: napis('ue.zaslepki.9'),
    wpisZUrzedu: [],
    wpisZUrzeduSkutek: napis('ue.zaslepki.10'),
    kroki: [
        { nr: 1, tytul: napis('ue.zaslepki.11'), opis: napis('ue.zaslepki.12') },
        { nr: 2, tytul: napis('ue.zaslepki.13'), opis: napis('ue.zaslepki.14') },
        { nr: 3, tytul: napis('ue.zaslepki.15'), opis: napis('ue.zaslepki.16') },
        { nr: 4, tytul: napis('ue.zaslepki.17'), opis: napis('ue.zaslepki.18') },
    ],
    daneDoWniosku: [
        'nazwa podmiotu',
        napis('ue.zaslepki.19'),
        napis('ue.zaslepki.20'),
        napis('ue.zaslepki.21'),
    ],
    wymaganiaTechniczne: napis('ue.zaslepki.22'),
    linki: [
        { etykieta: napis('ue.zaslepki.23'), url: eurlex('32022L2555') + '#art_3', glowny: true },
        { etykieta: napis('ue.zaslepki.24'), url: 'https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new' },
    ],
    kontakt: [],
};

/* ── Wytyczne krajowe: brak ─────────────────────────────── */
const FAQ_ZRODLO = {
    nazwa: napis('ue.zaslepki.25'),
    url: eurlex('32022L2555'),
    zastrzezenie: napis('ue.zaslepki.26'),
};
const FAQ = [];
function faqDlaObszaru() { return []; }
function faqNaStart() { return []; }

/* ── Rejestry gospodarcze: krajowe, tu niedostępne ──────── */
const NIP_ZRODLA = {};
const PKD_ROLE = [];
const PKD_PREFIKSY = [];
const PKD_SLOWA = [];
function normalizujNip(n) { return String(n || '').replace(/\s|-/g, ''); }
function nipPoprawny() { return false; }
function formatujPkd(p) { return String(p || ''); }
function pkdNaRole() { return []; }
async function pobierzDanePoNip() {
    return {
        ok: false,
        blad: napis('ue.zaslepki.27'),
        pkd: [], sugerowaneRole: [], ostrzezenia: [],
    };
}

const ESF_ZRODLO = { nazwa: null, przegladarka: null };
async function esfWczytaj() {
    return { ok: false, blad: napis('ue.zaslepki.28') };
}
function esfRozpakuj() { return null; }
function esfTekst() { return null; }
function esfZnajdz() { return null; }
function esfDzieciBezposrednie() { return []; }
function esfNipPoprawny() { return false; }
function esfLiczba() { return null; }
function esfZnajdzWzorcem() { return null; }
function esfPrzychody() { return null; }
function esfOpisOkresu() { return ''; }

const RPT_ZRODLO = { nazwa: null };
const RPT_STAN_NA = null;
const RPT_WPISOW = 0;
const RPT_WPISY = {};
const RPT_PRZETERMINOWANIE_DNI = 0;
function rptDostepny() { return false; }
function rptWiekDni() { return null; }
function rptSprawdzNip() { return null; }
function rptUslugiLista() { return []; }
function rptCzyDostepDoInternetu() { return false; }

    KRAJE.rejestruj('ue', {
        AKTY_PLIKI, AKTY_STRONY, ODESLANIA_WZORCE,
        PKE_META, PKE_PRZEJSCIOWE, PKE_KARY, PKE_SANKCJE_NIEFINANSOWE, PKE_SEKCJE, PKE_DO_WERYFIKACJI, pkeDotyczy,
        ZAL4_SEKCJE,
        S46,
        FAQ_ZRODLO, FAQ, faqDlaObszaru, faqNaStart,
        NIP_ZRODLA, PKD_ROLE, PKD_PREFIKSY, PKD_SLOWA, normalizujNip, nipPoprawny, formatujPkd, pkdNaRole, pobierzDanePoNip,
        ESF_ZRODLO, esfWczytaj, esfRozpakuj, esfTekst, esfZnajdz, esfDzieciBezposrednie, esfNipPoprawny, esfLiczba, esfZnajdzWzorcem, esfPrzychody, esfOpisOkresu,
        RPT_ZRODLO, RPT_STAN_NA, RPT_WPISOW, RPT_WPISY, RPT_PRZETERMINOWANIE_DNI, rptDostepny, rptWiekDni, rptSprawdzNip, rptUslugiLista, rptCzyDostepDoInternetu,
    });
})();
