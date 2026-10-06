/* ==========================================================
   Stan aplikacji, przechowywanie ocen, migawki, import i eksport
   Bez backendu — dane pozostają w przeglądarce albo w pliku JSON.
   ========================================================== */

const SCHEMA_VERSION = 2;
const KLUCZ_OCENY = 'nis2_oceny';
const KLUCZ_MOTYW = 'nis2_motyw';

let stan = null;   // aktualnie otwarta ocena
let oceny = [];    // lista wszystkich ocen

function pustyProfil() {
    return {
        nazwa: '', nip: '', regon: '', krs: '', adres: '', formaPrawna: '',
        role: [], wielkosc: '', przychod: '', przychodTelekom: '',
        wynagrodzenieKierownika: '', kursEUR: KARY_KSC.kursEUR.domyslny,
        kwalifikowanyDostawcaZaufania: false,
        niezalezneSystemy: false, podmiotMON: false,
        dataOceny: new Date().toISOString().slice(0, 10),
        pobranoZRejestru: null,
    };
}

function nowaOcena(nazwa) {
    return {
        id: 'oc-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36),
        schemaVersion: SCHEMA_VERSION,
        nazwa: nazwa || napis('stan.2'),
        utworzono: new Date().toISOString(),
        zmieniono: new Date().toISOString(),
        profil: pustyProfil(),
        odpowiedzi: {},   // { pytanieId: { poziom|stan, dowod, wlasciciel, termin, uwagi, zaktualizowano } }
        migawki: [],      // [{ data, notatka, wynik, odpowiedzi }]
    };
}

/* ── ODPOWIEDZI ────────────────────────────────────────────
   Migracja wsteczna: wcześniejsza wersja zapisywała samą liczbę. */
function normalizujOdpowiedz(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return { poziom: v, dowod: '', wlasciciel: '', termin: '', uwagi: '', zaktualizowano: null };
    return v;
}

function odpowiedz(pytanieId) {
    return normalizujOdpowiedz(stan && stan.odpowiedzi[pytanieId]);
}

function ustawOdpowiedz(pytanieId, zmiany) {
    if (!stan) return;
    const biezaca = odpowiedz(pytanieId) || { poziom: null, stan: null, dowod: '', wlasciciel: '', termin: '', uwagi: '' };
    stan.odpowiedzi[pytanieId] = { ...biezaca, ...zmiany, zaktualizowano: new Date().toISOString() };
    stan.zmieniono = new Date().toISOString();
    zapiszOceny();
}

/* ── PRZECHOWYWANIE ────────────────────────────────────────
   localStorage może być niedostępny (tryb prywatny, file:// w części
   przeglądarek) — narzędzie musi wtedy nadal działać, tylko bez zapisu. */
let magazynDostepny = null;

function sprawdzMagazyn() {
    if (magazynDostepny !== null) return magazynDostepny;
    try {
        const k = '__nis2_test__';
        localStorage.setItem(k, '1');
        localStorage.removeItem(k);
        magazynDostepny = true;
    } catch (e) {
        magazynDostepny = false;
    }
    return magazynDostepny;
}

function wczytajOceny() {
    if (!sprawdzMagazyn()) { oceny = []; return oceny; }
    try {
        const raw = localStorage.getItem(KLUCZ_OCENY);
        oceny = raw ? JSON.parse(raw) : [];
        /* Migracja z wersji jednoslotowej. */
        const stary = localStorage.getItem('nis2_assessment_progress');
        if (stary && !oceny.length) {
            const d = JSON.parse(stary);
            const o = nowaOcena((d.organization && d.organization.name) || napis('stan.3'));
            o.odpowiedzi = Object.fromEntries(
                Object.entries(d.answers || {}).map(([k, v]) => [k, normalizujOdpowiedz(v)])
            );
            oceny.push(o);
            zapiszOceny();
        }
    } catch (e) {
        oceny = [];
    }
    return oceny;
}

function zapiszOceny() {
    if (!sprawdzMagazyn()) return false;
    try {
        localStorage.setItem(KLUCZ_OCENY, JSON.stringify(oceny));
        return true;
    } catch (e) {
        return false;
    }
}

function otworzOcene(id) {
    stan = oceny.find(o => o.id === id) || null;
    return stan;
}

function utworzOcene(nazwa) {
    const o = nowaOcena(nazwa);
    oceny.unshift(o);
    zapiszOceny();
    stan = o;
    return o;
}

function usunOcene(id) {
    oceny = oceny.filter(o => o.id !== id);
    if (stan && stan.id === id) stan = null;
    zapiszOceny();
}

function duplikujOcene(id) {
    const zrodlo = oceny.find(o => o.id === id);
    if (!zrodlo) return null;
    const kopia = JSON.parse(JSON.stringify(zrodlo));
    kopia.id = nowaOcena().id;
    kopia.nazwa = zrodlo.nazwa + ' (kopia)';
    kopia.utworzono = kopia.zmieniono = new Date().toISOString();
    oceny.unshift(kopia);
    zapiszOceny();
    return kopia;
}

/* ── MIGAWKI ───────────────────────────────────────────────
   Zamrożony stan oceny z datą — podstawa raportowania przyrostowego. */
function zapiszMigawke(notatka) {
    if (!stan) return null;
    const wynik = policzWynik(stan);
    const m = {
        data: new Date().toISOString(),
        notatka: notatka || '',
        wynik: {
            ogolny: wynik.ogolny,
            zgodnosc: wynik.zgodnosc,
            status: wynik.status,
            sekcje: Object.fromEntries(Object.entries(wynik.sekcje).map(([k, v]) => [k, v.srednia])),
            obowiazkiWykonane: wynik.obowiazki.wykonane,
            obowiazkiRazem: wynik.obowiazki.razem,
        },
        odpowiedzi: JSON.parse(JSON.stringify(stan.odpowiedzi)),
    };
    stan.migawki.push(m);
    stan.zmieniono = new Date().toISOString();
    zapiszOceny();
    return m;
}

/* Różnica między bieżącym stanem a wskazaną migawką. */
function porownajZMigawka(indeks) {
    if (!stan || !stan.migawki[indeks]) return null;
    const m = stan.migawki[indeks];
    const teraz = policzWynik(stan);
    const delty = [];

    Object.entries(teraz.sekcje).forEach(([id, s]) => {
        const przed = m.wynik.sekcje[id];
        if (przed === undefined) return;
        const roznica = s.srednia - przed;
        if (Math.abs(roznica) >= 0.05) {
            delty.push({ id, nazwa: s.nazwa, przed, po: s.srednia, roznica });
        }
    });
    delty.sort((a, b) => b.roznica - a.roznica);

    return {
        migawka: m,
        ogolnyPrzed: m.wynik.ogolny,
        ogolnyPo: teraz.ogolny,
        ogolnyRoznica: teraz.ogolny - m.wynik.ogolny,
        zgodnoscPrzed: m.wynik.zgodnosc,
        zgodnoscPo: teraz.zgodnosc,
        obowiazkiPrzed: m.wynik.obowiazkiWykonane,
        obowiazkiPo: teraz.obowiazki.wykonane,
        delty,
    };
}

/* ── EKSPORT I IMPORT JSON ─────────────────────────────────*/
function eksportujJSON(id) {
    const o = id ? oceny.find(x => x.id === id) : stan;
    if (!o) return null;
    const paczka = {
        format: 'ITORO-NIS2-Assessment',
        schemaVersion: SCHEMA_VERSION,
        wyeksportowano: new Date().toISOString(),
        ocena: o,
    };
    return { nazwaPliku: bezpiecznaNazwaPliku(o) + '.json', tresc: JSON.stringify(paczka, null, 2) };
}

/* Nazwa pliku zaczyna się od nazwy podmiotu, żeby po latach dało się
   ją rozpoznać na liście plików bez otwierania. Data jest datą zapisu,
   nie datą oceny — pozwala odróżnić kolejne migawki tego samego podmiotu. */
function bezpiecznaNazwaPliku(o, przyrostek) {
    const baza = (o.profil && o.profil.nazwa) || o.nazwa || 'ocena';
    const czysta = baza
        .replace(/\s+(sp\.|sp|spółka)\s*z\s*o\.?\s*o\.?/gi, '')
        .replace(/\s+(S\.A\.|SA)\b/gi, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/-+/g, '-').replace(/^-+|-+$/g, '')
        .slice(0, 60);
    const teraz = new Date();
    const data = teraz.toISOString().slice(0, 10);
    const godzina = String(teraz.getHours()).padStart(2, '0') + String(teraz.getMinutes()).padStart(2, '0');
    return [czysta || 'ocena', (AKTY.ksc && AKTY.ksc.skrotPliku) || 'NIS2', data, godzina, przyrostek].filter(Boolean).join('_');
}

function importujJSON(tekst) {
    let paczka;
    try {
        paczka = JSON.parse(tekst);
    } catch (e) {
        return { ok: false, blad: napis('stan.4') };
    }
    if (!paczka || paczka.format !== 'ITORO-NIS2-Assessment' || !paczka.ocena) {
        return { ok: false, blad: napis('stan.5') };
    }
    if (Number(paczka.schemaVersion) > SCHEMA_VERSION) {
        return { ok: false, blad: napis('stan.1', {p0: paczka.schemaVersion, p1: SCHEMA_VERSION}) };
    }

    const o = paczka.ocena;
    o.id = nowaOcena().id;
    o.schemaVersion = SCHEMA_VERSION;
    o.profil = { ...pustyProfil(), ...(o.profil || {}) };
    o.odpowiedzi = Object.fromEntries(
        Object.entries(o.odpowiedzi || {}).map(([k, v]) => [k, normalizujOdpowiedz(v)])
    );
    o.migawki = o.migawki || [];
    o.nazwa = (o.nazwa || 'Ocena') + ' (import)';
    oceny.unshift(o);
    zapiszOceny();
    return { ok: true, ocena: o, migawek: o.migawki.length };
}
