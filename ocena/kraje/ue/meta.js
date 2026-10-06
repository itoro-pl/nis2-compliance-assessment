/* Moduł ue: akty, pułapy kar, terminy — wprost z dyrektywy (UE) 2022/2555.

   Dyrektywa wyznacza pułapy minimalne (art. 34 ust. 4 i 5: „co najmniej"),
   więc prawo krajowe może je podnieść. Nie ma tu kwot minimalnych, kar
   okresowych ani kary dla kierownika w liczbach — to wszystko ustala
   państwo członkowskie. Waluta: euro, bez przeliczania. */
(function () {

const AKTY = {
    ksc: {
        tytul: napis('ue.meta.4'),
        dziennik: napis('ue.meta.5'),
        wejscie: '2023-01-16',
        /* Termin transpozycji (art. 41 ust. 1) — data, którą raport wstępny
           podaje przy dyrektywie. Moduł krajowy ma w tym miejscu datę
           wejścia w życie ustawy (dla Polski: nowelizacji z 2026 r.). */
        obowiazujeOd: '2024-10-17',
    },
    reg2690: {
        tytul: napis('ue.meta.6'),
        dziennik: napis('ue.meta.7'),
        wejscie: '2024-11-07',
    },
};

const STOSOWANIE = {
    'ksc': {
        nazwa: napis('ue.meta.8'),
        stan: 'okres-wdrozenia',
        odKiedy: '2024-10-17',
        naglowek: napis('ue.meta.9'),
        opis: napis('ue.meta.10'),
        podstawa: cyt('art. 41 ust. 1 dyrektywy (UE) 2022/2555'),
    },
    'ksc-ob': {
        nazwa: napis('ue.meta.11'),
        stan: 'okres-wdrozenia',
        odKiedy: '2025-04-17',
        naglowek: napis('ue.meta.12'),
        opis: napis('ue.meta.13'),
        podstawa: cyt('art. 3 ust. 3 i 4 dyrektywy (UE) 2022/2555'),
    },
    'reg2690': {
        nazwa: napis('ue.meta.14'),
        stan: 'w-mocy',
        odKiedy: '2024-11-07',
        naglowek: napis('ue.meta.15'),
        opis: napis('ue.meta.16'),
        podstawa: napis('ue.meta.17'),
    },
};

const KARY_KSC = {
    kursEUR: { domyslny: 1, podstawa: 'kwoty w euro, bez przeliczania' },
    kluczowy: {
        status: 'kluczowy',
        podstawa: cyt('art. 34 ust. 4 dyrektywy (UE) 2022/2555'),
        kwotaEUR: 10000000,
        procentPrzychodu: 0.02,
        minimumPLN: 0,
        podstawaBrakPrzychodu: 0,
        kwotaWyzszaWprost: true,
        opis: napis('ue.meta.18'),
    },
    wazny: {
        status: 'wazny',
        podstawa: cyt('art. 34 ust. 5 dyrektywy (UE) 2022/2555'),
        kwotaEUR: 7000000,
        procentPrzychodu: 0.014,
        minimumPLN: 0,
        podstawaBrakPrzychodu: 0,
        kwotaWyzszaWprost: true,
        opis: napis('ue.meta.19'),
    },
    kwalifikowana: {
        podstawa: null,
        kwotaPLN: null,
        opis: napis('ue.meta.20'),
    },
    okresowa: {
        podstawa: cyt('art. 34 ust. 6 dyrektywy (UE) 2022/2555'),
        minPLN: null,
        maksPLN: null,
        opis: napis('ue.meta.21'),
    },
    kierownik: {
        podstawa: cyt('art. 20 ust. 1 dyrektywy (UE) 2022/2555'),
        procentWynagrodzenia: null,
        okresWynagrodzenia: null,
        opis: napis('ue.meta.22'),
        zasady: [
            napis('ue.meta.23'),
            napis('ue.meta.24'),
            napis('ue.meta.25'),
            napis('ue.meta.26'),
        ],
    },
    jakPowstajePulap: {
        kroki: [
            { nr: 1, tytul: napis('ue.meta.27'),
              opis: napis('ue.meta.28'),
              podstawa: cyt('art. 34 ust. 4 i 5 dyrektywy (UE) 2022/2555') },
            { nr: 2, tytul: napis('ue.meta.29'),
              opis: napis('ue.meta.30'),
              podstawa: cyt('art. 34 ust. 1 i 3 dyrektywy (UE) 2022/2555') },
        ],
        wniosek: napis('ue.meta.31'),
    },
    miarkowanie: {
        podstawa: cyt('art. 34 ust. 3 i art. 32 ust. 7 dyrektywy (UE) 2022/2555'),
        tresc: napis('ue.meta.32'),
        wylaczenie: null,
        kryteria: [
            napis('ue.meta.33'),
            'czas trwania naruszenia',
            napis('ue.meta.34'),
            napis('ue.meta.35'),
            napis('ue.meta.36'),
            napis('ue.meta.37'),
            napis('ue.meta.38'),
            napis('ue.meta.39'),
        ],
        odstapienie: napis('ue.meta.40'),
    },
    odKiedy: {
        data: '2024-10-17',
        podstawa: cyt('art. 41 ust. 1 dyrektywy (UE) 2022/2555'),
        opis: napis('ue.meta.41'),
    },
};

const KALENDARZ = [
    { data: '2023-01-16', tytul: napis('ue.meta.42'),
      opis: napis('ue.meta.43'),
      podstawa: cyt('art. 45 dyrektywy (UE) 2022/2555'), typ: 'wejscie' },
    { data: '2024-10-17', tytul: napis('ue.meta.44'),
      opis: napis('ue.meta.45'),
      podstawa: cyt('art. 41 ust. 1 dyrektywy (UE) 2022/2555'), typ: 'wejscie' },
    { data: '2024-10-18', tytul: napis('ue.meta.46'),
      opis: napis('ue.meta.47'),
      podstawa: cyt('art. 41 ust. 1 i art. 44 dyrektywy (UE) 2022/2555'), typ: 'wejscie' },
    { data: '2024-11-07', tytul: napis('ue.meta.48'),
      opis: napis('ue.meta.49'),
      podstawa: napis('ue.meta.17'), typ: 'wejscie' },
    { data: '2025-04-17', tytul: napis('ue.meta.50'),
      opis: napis('ue.meta.51'),
      podstawa: cyt('art. 3 ust. 3 i 4 dyrektywy (UE) 2022/2555') },
    { data: '2027-10-17', tytul: napis('ue.meta.52'),
      opis: napis('ue.meta.53'),
      podstawa: cyt('art. 40 dyrektywy (UE) 2022/2555') },
];

const TERMINY_INDYWIDUALNE = [
    { tytul: napis('ue.meta.54'), termin: napis('ue.meta.55'),
      podstawa: cyt('art. 23 ust. 4 lit. a dyrektywy (UE) 2022/2555') },
    { tytul: napis('ue.meta.56'), termin: napis('ue.meta.57'),
      podstawa: cyt('art. 23 ust. 4 lit. b dyrektywy (UE) 2022/2555') },
    { tytul: napis('ue.meta.58'), termin: napis('ue.meta.59'),
      podstawa: cyt('art. 23 ust. 4 lit. d dyrektywy (UE) 2022/2555') },
    { tytul: napis('ue.meta.60'), termin: '24 godziny',
      podstawa: cyt('art. 23 ust. 4 akapit drugi dyrektywy (UE) 2022/2555') },
];

const WALUTA = { kod: 'EUR', symbol: 'EUR', poKwocie: true };

/* Katalog dyrektywy i rozporządzenie sumują się: art. 21 ust. 5 dyrektywy
   upoważnia Komisję do doprecyzowania środków z ust. 2, a rozporządzenie
   2024/2690 jest właśnie tym doprecyzowaniem dla wymienionych w nim
   podmiotów. Model kumulatywny. */
const RELACJA_2690 = {
    model: 'kumulatywny',
    podstawa: napis('ue.meta.61'),
    krajowyGdyObjety: 'pelny',
    reg2690: 'pelny',
    wyjatki: {},
};

/* Pułap kary z art. 34: kwota wyższa z dwóch, bez minimum krajowego. */
function obliczKare(status, przychod, kursEUR) {
    const k = KARY_KSC[status];
    if (!k) return null;
    const p = Number(przychod);
    const limitKwotowy = k.kwotaEUR;

    if (!Number.isFinite(p) || p <= 0) {
        return {
            status, kurs: 1,
            kwota: limitKwotowy,
            podstawaWyboru: napis('ue.meta.62'),
            podstawaPrawna: k.podstawa,
            wariantProcentowy: null,
            wariantKwotowy: limitKwotowy,
            minimum: 0,
        };
    }
    const wariantProcentowy = p * k.procentPrzychodu;
    const kwota = Math.max(wariantProcentowy, limitKwotowy);
    const krotnoscPrzychodu = kwota / p;
    return {
        status, kurs: 1, kwota,
        podstawaWyboru: wariantProcentowy > limitKwotowy
            ? napis('ue.meta.1', {p0: (k.procentPrzychodu * 100).toLocaleString(LOCALE.znacznik()), p1: (k.kwotaEUR / 1000000)})
            : napis('ue.meta.2', {p0: (k.kwotaEUR / 1000000), p1: (k.procentPrzychodu * 100).toLocaleString(LOCALE.znacznik())}),
        podstawaPrawna: k.podstawa,
        wariantProcentowy,
        wariantKwotowy: limitKwotowy,
        minimum: 0,
        przychod: p,
        krotnoscPrzychodu,
        pulapPrzewyzszaPrzychod: krotnoscPrzychodu > 1,
        uwagaProporcjonalnosc: krotnoscPrzychodu > 1
            ? napis('ue.meta.3', {p0: krotnoscPrzychodu.toFixed(1)})
            : null,
        uwagaRedakcyjna: napis('ue.meta.63'),
    };
}

/* Dyrektywa przesądza zasadę odpowiedzialności organu zarządzającego,
   ale nie jej wysokość — tę ustala prawo krajowe. */
function obliczKareKierownika(wynagrodzenieMiesieczne, czyIsp, opcje) {
    const wynik = { pozycje: [], suma: null };
    wynik.pozycje.push({
        akt: napis('ue.meta.8'),
        organ: napis('ue.meta.64'),
        podstawa: cyt('art. 20 ust. 1 dyrektywy (UE) 2022/2555'),
        kwota: null,
        opis: napis('ue.meta.65'),
    });
    wynik.uwaga = napis('ue.meta.66');
    return wynik;
}

function nadchodzaceTerminy(status, dataOdniesienia) {
    const dzis = dataOdniesienia ? new Date(dataOdniesienia) : new Date();
    return KALENDARZ
        .filter(t => !t.tylkoDlaStatusu || t.tylkoDlaStatusu.includes(status))
        .map(t => {
            const d = new Date(t.data);
            const dni = Math.ceil((d - dzis) / 86400000);
            const wMocy = t.typ === 'wejscie' && dni < 0;
            return { ...t, dni, minelo: dni < 0 && !wMocy, wMocy };
        })
        .sort((a, b) => a.dni - b.dni);
}

function formatujPLN(kwota) {
    const n = Number(kwota);
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString(LOCALE.znacznik(), { maximumFractionDigits: 0 }) + ' ' + WALUTA.symbol;
}

    KRAJE.rejestruj('ue', {
        AKTY, STOSOWANIE, KARY_KSC, KALENDARZ, TERMINY_INDYWIDUALNE, WALUTA, RELACJA_2690,
        obliczKare, obliczKareKierownika, nadchodzaceTerminy, formatujPLN,
    });
})();
