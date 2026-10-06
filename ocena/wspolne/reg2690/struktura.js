/* ==========================================================
   Rozporządzenie wykonawcze Komisji (UE) 2024/2690
   z dnia 17 października 2024 r.

   Stosowane BEZPOŚREDNIO we wszystkich państwach członkowskich
   od 7 listopada 2024 r. (art. 16). Bez okresu przejściowego.
   Ustawa o KSC odsyła do niego w art. 8b.

   Zależności: data/reg2690-wymogi.js (REG2690_SEKCJE — plik generowany)
   ========================================================== */

const REG2690_META = {
    tytul: napis('reg2690.1'),
    celex: '32024R2690',
    publikacja: napis('reg2690.2'),
    stosowanieOd: '2024-11-07',
    odeslanieKrajowe: napis('reg2690.odeslanieKrajowe'),
    uchyla: napis('reg2690.3'),
    proporcjonalnosc: napis('reg2690.4'),
};

/* Role objęte rozporządzeniem — art. 1 zawiera ZAMKNIĘTĄ listę adresatów.
   Nie ma na niej przedsiębiorców komunikacji elektronicznej (ISP)
   ani dostawców punktów wymiany ruchu internetowego (IXP). */
const REG2690_ROLE_OBJETE = ['dns', 'tld', 'chmura', 'dc', 'cdn', 'msp', 'mssp', 'zaufania', 'rejestrator'];
const REG2690_ROLE_NIEOBJETE = ['isp', 'ixp'];

/* ── PROGI UZNANIA INCYDENTU ZA POWAŻNY ────────────────────
   Art. 3 ust. 1 — kryteria horyzontalne, wspólne dla wszystkich
   podmiotów objętych rozporządzeniem. Wystarczy spełnienie JEDNEGO. */
const REG2690_PROGI_HORYZONTALNE = [
    {
        lit: 'a',
        tytul: napis('reg2690.5'),
        tresc: napis('reg2690.6'),
        wyliczalny: true,
    },
    {
        lit: 'b',
        tytul: napis('reg2690.7'),
        tresc: napis('reg2690.8'),
    },
    {
        lit: 'c',
        tytul: napis('reg2690.9'),
        tresc: napis('reg2690.10'),
    },
    {
        lit: 'd',
        tytul: napis('reg2690.11'),
        tresc: napis('reg2690.12'),
    },
    {
        lit: 'e',
        tytul: napis('reg2690.13'),
        tresc: napis('reg2690.14'),
    },
    {
        lit: 'f',
        tytul: napis('reg2690.15'),
        tresc: napis('reg2690.16'),
    },
    {
        lit: 'g',
        tytul: napis('reg2690.17'),
        tresc: napis('reg2690.18'),
    },
];

/* Art. 5–14 — kryteria sektorowe, przypisane do ról z data/role.js. */
const REG2690_PROGI_SEKTOROWE = {
    dns: {
        artykul: napis('reg2690.art', {p0: 5}),
        nazwa: napis('reg2690.19'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.20') },
            { lit: 'b', tresc: napis('reg2690.21') },
            { lit: 'c', tresc: napis('reg2690.22') },
        ],
    },
    tld: {
        artykul: napis('reg2690.art', {p0: 6}),
        nazwa: napis('reg2690.23'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.24') },
            { lit: 'b', tresc: napis('reg2690.21') },
            { lit: 'c', tresc: napis('reg2690.25') },
        ],
    },
    chmura: {
        artykul: napis('reg2690.art', {p0: 7}),
        nazwa: napis('reg2690.26'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.27') },
            { lit: 'b', tresc: napis('reg2690.28') },
            { lit: 'c', tresc: napis('reg2690.29') },
            { lit: 'd', tresc: napis('reg2690.30') },
        ],
    },
    dc: {
        artykul: napis('reg2690.art', {p0: 8}),
        nazwa: napis('reg2690.31'),
        ostrzezenie: napis('reg2690.32'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.33') },
            { lit: 'b', tresc: napis('reg2690.34') },
            { lit: 'c', tresc: napis('reg2690.35') },
            { lit: 'd', tresc: napis('reg2690.36') },
        ],
    },
    cdn: {
        artykul: napis('reg2690.art', {p0: 9}),
        nazwa: napis('reg2690.37'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.38') },
            { lit: 'b', tresc: napis('reg2690.39') },
            { lit: 'c', tresc: napis('reg2690.35') },
            { lit: 'd', tresc: napis('reg2690.40') },
        ],
    },
    msp: {
        artykul: napis('reg2690.art', {p0: 10}),
        nazwa: napis('reg2690.41'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.42') },
            { lit: 'b', tresc: napis('reg2690.43') },
            { lit: 'c', tresc: napis('reg2690.35') },
            { lit: 'd', tresc: napis('reg2690.44') },
        ],
    },
    zaufania: {
        artykul: napis('reg2690.art', {p0: 14}),
        nazwa: napis('reg2690.45'),
        ostrzezenie: napis('reg2690.46') + napis('reg2690.zaufaniaUwagaKrajowa'),
        kryteria: [
            { lit: 'a', tresc: napis('reg2690.47') },
            { lit: 'b', tresc: napis('reg2690.48') },
            { lit: 'c', tresc: napis('reg2690.49') },
            { lit: 'd', tresc: napis('reg2690.50') },
            { lit: 'e', tresc: napis('reg2690.51') },
        ],
    },
};
/* Rejestrator nazw domen i MSSP korzystają z tych samych kryteriów co pokrewne role. */
REG2690_PROGI_SEKTOROWE.mssp = { ...REG2690_PROGI_SEKTOROWE.msp };
REG2690_PROGI_SEKTOROWE.rejestrator = { ...REG2690_PROGI_SEKTOROWE.dns, nazwa: napis('reg2690.52') };

/* Zasady pomocnicze z preambuły — istotne przy samoocenie i przy liczeniu terminów. */
const REG2690_ZASADY = [
    { motyw: 31, tytul: napis('reg2690.53'), tresc: napis('reg2690.54') },
    { motyw: 34, tytul: napis('reg2690.55'), tresc: napis('reg2690.56') },
    { motyw: 35, tytul: napis('reg2690.57'), tresc: napis('reg2690.58') },
    { motyw: 38, tytul: napis('reg2690.59'), tresc: napis('reg2690.60') },
    { motyw: 36, tytul: napis('reg2690.61'), tresc: napis('reg2690.62') },
    { motyw: null, tytul: napis('reg2690.63'), tresc: napis('reg2690.64') },
    { motyw: null, tytul: napis('reg2690.65'), tresc: napis('reg2690.66') },
];

/* Czy dana rola podlega rozporządzeniu. */
function reg2690Dotyczy(rolaId) {
    return REG2690_ROLE_OBJETE.includes(rolaId);
}

/* Kryteria sektorowe dla zestawu ról podmiotu — bez duplikatów. */
function reg2690ProgiDlaRol(role) {
    const wynik = [];
    const widziane = new Set();
    (role || []).filter(reg2690Dotyczy).forEach(r => {
        const p = REG2690_PROGI_SEKTOROWE[r];
        if (p && !widziane.has(p.artykul + p.nazwa)) {
            widziane.add(p.artykul + p.nazwa);
            wynik.push({ rolaId: r, ...p });
        }
    });
    return wynik;
}

/* Próg straty finansowej w EUR — art. 3 ust. 1 lit. a):
   niższa z wartości 500 000 EUR albo 5 % rocznego obrotu. */
function reg2690ProgStratyEUR(obrotRocznyEUR) {
    const procent = Number(obrotRocznyEUR) * 0.05;
    if (!Number.isFinite(procent) || procent <= 0) return { prog: 500000, podstawa: napis('reg2690.67') };
    return procent < 500000
        ? { prog: procent, podstawa: napis('reg2690.68') }
        : { prog: 500000, podstawa: napis('reg2690.69') };
}
