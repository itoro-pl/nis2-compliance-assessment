/* Moduł ue: obowiązki organu zarządzającego — art. 20 dyrektywy.

   Dyrektywa mówi „organ zarządzający", nie „kierownik podmiotu" jak
   ustawa polska. Zatwierdzenie, nadzór i odpowiedzialność są w niej
   wprost; wysokość sankcji osobistej i to, czy powierzenie obowiązków
   innej osobie zwalnia z odpowiedzialności — rozstrzyga prawo krajowe. */
(function () {

const KIEROWNIK_DEFINICJA = {
    tresc: napis('ue.kierownictwo.1'),
    podstawa: cyt('art. 20 ust. 1 dyrektywy (UE) 2022/2555'),
    uwagi: [
        napis('ue.kierownictwo.2'),
        napis('ue.kierownictwo.3'),
    ],
};

const ZADANIA_OSOBISTE = [
    {
        id: 'k-zatwierdzenie',
        tytul: napis('ue.kierownictwo.4'),
        opis: napis('ue.kierownictwo.5'),
        podstawa: cyt('art. 20 ust. 1'),
        pytania: ['ob-d20-1', 'd21-a-1'],
        delegowalne: false,
        akcent: true,
    },
    {
        id: 'k-nadzor',
        tytul: napis('ue.kierownictwo.6'),
        opis: napis('ue.kierownictwo.7'),
        podstawa: cyt('art. 20 ust. 1'),
        pytania: ['ob-d20-2', 'd21-f-2'],
        delegowalne: false,
    },
    {
        id: 'k-szkolenie',
        tytul: napis('ue.kierownictwo.8'),
        opis: napis('ue.kierownictwo.9'),
        podstawa: cyt('art. 20 ust. 2'),
        pytania: ['ob-d20-3', 'd21-g-3'],
        delegowalne: false,
    },
    {
        id: 'k-status',
        tytul: napis('ue.kierownictwo.10'),
        opis: napis('ue.kierownictwo.11'),
        podstawa: cyt('art. 3 ust. 1–4'),
        pytania: ['ob-d3-1', 'ob-d3-2'],
        delegowalne: false,
    },
];

const ZADANIA_DO_ZLECENIA = [
    {
        id: 'z-ryzyko',
        tytul: napis('ue.kierownictwo.12'),
        opis: napis('ue.kierownictwo.13'),
        podstawa: cyt('art. 21 ust. 1 i 2 lit. a'),
        pytania: ['d21-a-2', 'd21-a-3', 'd21-a-4'],
        delegowalne: true,
    },
    {
        id: 'z-incydenty',
        tytul: napis('ue.kierownictwo.14'),
        opis: napis('ue.kierownictwo.15'),
        podstawa: cyt('art. 21 ust. 2 lit. b; art. 23 ust. 4'),
        termin: napis('ue.kierownictwo.16'),
        pytania: ['d21-b-1', 'd21-b-2', 'ob-d23-1', 'ob-d23-2'],
        delegowalne: true,
    },
    {
        id: 'z-ciaglosc',
        tytul: napis('ue.kierownictwo.17'),
        opis: napis('ue.kierownictwo.18'),
        podstawa: cyt('art. 21 ust. 2 lit. c'),
        pytania: ['d21-c-1', 'd21-c-2', 'd21-c-4'],
        delegowalne: true,
    },
    {
        id: 'z-dostawcy',
        tytul: napis('ue.kierownictwo.19'),
        opis: napis('ue.kierownictwo.20'),
        podstawa: cyt('art. 21 ust. 2 lit. d; art. 21 ust. 3'),
        pytania: ['d21-d-1', 'd21-d-3'],
        delegowalne: true,
    },
    {
        id: 'z-dostep',
        tytul: napis('ue.kierownictwo.21'),
        opis: napis('ue.kierownictwo.22'),
        podstawa: cyt('art. 21 ust. 2 lit. i i j'),
        pytania: ['d21-i-1', 'd21-i-2', 'd21-j-1'],
        delegowalne: true,
    },
    {
        id: 'z-skutecznosc',
        tytul: napis('ue.kierownictwo.23'),
        opis: napis('ue.kierownictwo.24'),
        podstawa: cyt('art. 21 ust. 2 lit. f'),
        pytania: ['d21-f-1', 'd21-f-3'],
        delegowalne: true,
    },
];

const NADZOR_ZARZADCZY = [
    {
        kategoria: napis('ue.kierownictwo.25'),
        pozycje: [napis('ue.kierownictwo.26'), napis('ue.kierownictwo.27'), napis('ue.kierownictwo.28')],
    },
    {
        kategoria: napis('ue.kierownictwo.29'),
        pozycje: [napis('ue.kierownictwo.30'), napis('ue.kierownictwo.31'), napis('ue.kierownictwo.32')],
    },
    {
        kategoria: napis('ue.kierownictwo.33'),
        pozycje: [napis('ue.kierownictwo.34'), napis('ue.kierownictwo.35'), napis('ue.kierownictwo.daneRejestracyjne')],
    },
];

const ZESPOL_MINIMALNY = [
    { rola: napis('ue.kierownictwo.36'), zakres: napis('ue.kierownictwo.37') },
    { rola: napis('ue.kierownictwo.38'), zakres: napis('ue.kierownictwo.39') },
    { rola: napis('ue.kierownictwo.40'), zakres: napis('ue.kierownictwo.41') },
    { rola: napis('ue.kierownictwo.42'), zakres: 'status podmiotu, rejestracja, umowy z dostawcami, prawo krajowe' },
];

function zadaniaKierownictwa(status, odpowiedzi) {
    const stanZadania = (z) => {
        if (!z.pytania || !z.pytania.length) return null;
        const stany = z.pytania
            .map(id => normalizujOdpowiedz(odpowiedzi && odpowiedzi[id]))
            .filter(a => a && (a.stan || Number.isFinite(a.poziom)));
        if (!stany.length) return null;
        if (stany.some(a => a.stan === 'niewykonane')) return 'niewykonane';
        if (stany.some(a => a.stan === 'w-toku')) return 'w-toku';
        if (stany.every(a => a.stan === 'wykonane' || a.stan === 'nie-dotyczy')) return 'wykonane';
        return 'w-toku';
    };
    const filtr = (z) => !z.tylkoDlaStatusu || z.tylkoDlaStatusu.includes(status);
    return {
        osobiste: ZADANIA_OSOBISTE.filter(filtr).map(z => ({ ...z, stan: stanZadania(z) })),
        doZlecenia: ZADANIA_DO_ZLECENIA.filter(filtr).map(z => ({ ...z, stan: stanZadania(z) })),
    };
}

    KRAJE.rejestruj('ue', {
        KIEROWNIK_DEFINICJA, ZADANIA_OSOBISTE, ZADANIA_DO_ZLECENIA, NADZOR_ZARZADCZY, ZESPOL_MINIMALNY,
        zadaniaKierownictwa,
    });
})();
