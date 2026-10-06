/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Obowiązki kierownictwa — lista zadań dla zarządu

   Narzędzie najczęściej otwiera osoba zarządzająca, więc raport
   wstępny musi odpowiadać nie tylko na pytanie „co nam grozi”,
   ale też „co muszę zrobić osobiście, a co mogę zlecić”.

   Podstawa: art. 8c–8f ustawy o KSC (t.j. Dz.U. 2026 poz. 20
   w brzmieniu nadanym ustawą z 23.01.2026 r.).
   ========================================================== */

/* Kim jest kierownik podmiotu w rozumieniu ustawy. */
const KIEROWNIK_DEFINICJA = {
    podstawa: 'art. 2 pkt 8a ustawy o KSC',
    tresc: 'Kierownikiem podmiotu jest kierownik jednostki w rozumieniu art. 3 ust. 1 pkt 6 ustawy o rachunkowości — w spółce kapitałowej jest to zarząd, a przy zarządzie wieloosobowym obowiązki i odpowiedzialność dotyczą jego członków.',
    uwagi: [
        'Przy organie wieloosobowym, jeżeli nie wskazano osoby odpowiedzialnej, odpowiadają wszyscy członkowie organu (art. 8c ust. 2).',
        'Powierzenie obowiązków innej osobie — nawet za jej zgodą — nie wyłącza odpowiedzialności kierownika (art. 8c ust. 3).',
    ],
};

/* Zadania, których kierownik nie może z siebie zdjąć. */
const ZADANIA_OSOBISTE = [
    {
        id: 'k-status',
        tytul: 'Ustalić status podmiotu i dopilnować wpisu do wykazu',
        opis: 'Sprawdzić, czy podmiot jest kluczowy czy ważny, i złożyć wniosek o wpis do wykazu prowadzonego w systemie z art. 46 ust. 1. Wniosek zawiera oświadczenie kierownika składane pod rygorem odpowiedzialności karnej.',
        podstawa: 'art. 7c ust. 1 i 5, art. 8c ust. 1',
        termin: '6 miesięcy od spełnienia przesłanek',
        pytania: ['ob-7c-1', 'ob-7c-2'],
        delegowalne: false,
    },
    {
        id: 'k-szbi',
        tytul: 'Zatwierdzić system zarządzania bezpieczeństwem informacji',
        opis: 'Podjąć formalne decyzje dotyczące przygotowania, wdrożenia, stosowania, przeglądu i nadzoru nad systemem. To decyzja zarządcza, nie techniczna — wymaga udokumentowania.',
        podstawa: 'art. 8d pkt 1',
        pytania: ['ob-8d-1'],
        delegowalne: false,
    },
    {
        id: 'k-budzet',
        tytul: 'Zaplanować środki finansowe',
        opis: 'Zapewnić w budżecie środki adekwatne do realizacji obowiązków z zakresu cyberbezpieczeństwa. Brak zaplanowanych środków jest samodzielnym naruszeniem ustawy, niezależnie od stanu zabezpieczeń.',
        podstawa: 'art. 8d pkt 2',
        pytania: ['ob-8d-2'],
        delegowalne: false,
    },
    {
        id: 'k-szkolenie',
        tytul: 'Odbyć szkolenie z cyberbezpieczeństwa',
        opis: 'Kierownik — oraz osoba, której powierzono jego obowiązki w tym zakresie — przechodzi szkolenie raz w roku kalendarzowym. Udział musi być udokumentowany, a zakres obejmować obowiązki wskazane w ustawie.',
        podstawa: 'art. 8e ust. 1–3',
        termin: 'raz w roku kalendarzowym',
        pytania: ['ob-8e-1', 'ob-8e-2', 'ob-8e-3'],
        delegowalne: false,
        akcent: true,
    },
    {
        id: 'k-zadania',
        tytul: 'Przydzielić zadania i nadzorować ich wykonanie',
        opis: 'Formalnie przypisać personelowi zadania z zakresu cyberbezpieczeństwa i sprawować nad nimi nadzór. Samo zlecenie nie wystarcza — ustawa wymaga także kontroli wykonania.',
        podstawa: 'art. 8d pkt 3',
        pytania: ['ob-8d-3'],
        delegowalne: false,
    },
    {
        id: 'k-swiadomosc',
        tytul: 'Zapewnić świadomość personelu',
        opis: 'Zadbać, aby personel znał swoje obowiązki z zakresu cyberbezpieczeństwa i wewnętrzne regulacje podmiotu.',
        podstawa: 'art. 8d pkt 4',
        pytania: ['ob-8d-4'],
        delegowalne: false,
    },
    {
        id: 'k-zgodnosc',
        tytul: 'Zapewnić zgodność z prawem i regulacjami wewnętrznymi',
        opis: 'Odpowiedzialność za zgodność działania podmiotu z przepisami oraz z własnymi regulacjami wewnętrznymi.',
        podstawa: 'art. 8d pkt 5',
        delegowalne: false,
    },
];

/* Zadania, które kierownik powinien komuś powierzyć — z zachowaniem
   własnej odpowiedzialności za ich wykonanie. */
const ZADANIA_DO_ZLECENIA = [
    {
        id: 'z-osoby',
        tytul: 'Wyznaczyć osoby do kontaktu z podmiotami KSC',
        opis: 'Co najmniej dwie osoby; mikro- i mali przedsiębiorcy — co najmniej jedna. Dane zgłasza się do wykazu.',
        podstawa: 'art. 9 ust. 1 pkt 1 i ust. 2',
        pytania: ['ob-9-1'],
    },
    {
        id: 'z-struktury',
        tytul: 'Powołać strukturę cyberbezpieczeństwa albo zawrzeć umowę z dostawcą',
        opis: 'Ustawa dopuszcza oba rozwiązania: wewnętrzny zespół albo umowa z dostawcą usług zarządzanych w zakresie cyberbezpieczeństwa. Wybór trzeba udokumentować.',
        podstawa: 'art. 14',
        pytania: ['ob-14-1'],
        akcent: true,
    },
    {
        id: 'z-krk',
        tytul: 'Zweryfikować niekaralność osób realizujących zadania',
        opis: 'Przed dopuszczeniem do zadań z art. 8 lub art. 11 uzyskać informację z Krajowego Rejestru Karnego o niekaralności za przestępstwa przeciwko ochronie informacji. Osoba skazana nie może realizować tych zadań.',
        podstawa: 'art. 8f ust. 1 i 4',
        pytania: ['ob-8f-1', 'ob-8f-2'],
    },
    {
        id: 'z-ryzyko',
        tytul: 'Wdrożyć szacowanie ryzyka i system zarządzania',
        opis: 'Systematyczne szacowanie ryzyka, polityki, dokumentacja, środki techniczne i organizacyjne. To najobszerniejsza część wdrożenia.',
        podstawa: 'art. 8 ust. 1',
        pytania: ['a8-1-1', 'a8-2a-1'],
    },
    {
        id: 'z-incydenty',
        tytul: 'Uruchomić procedurę zgłaszania incydentów',
        opis: 'Zdolność do zgłoszenia wczesnego ostrzeżenia w 24 godziny i zgłoszenia incydentu poważnego w 72 godziny od wykrycia — również poza godzinami pracy.',
        podstawa: 'art. 11 ust. 1 pkt 4 i 4a',
        termin: '24 h / 72 h od wykrycia',
        pytania: ['ob-11-1', 'ob-11-2'],
        akcent: true,
    },
    {
        id: 'z-system',
        tytul: 'Rozpocząć korzystanie z systemu teleinformatycznego',
        opis: 'Rejestracja i gotowość operacyjna w systemie, o którym mowa w art. 46 ust. 1 — służy do zgłaszania incydentów i wymiany informacji.',
        podstawa: 'art. 46 ust. 4',
        termin: '12 miesięcy od spełnienia przesłanek',
        pytania: ['ob-46-1'],
    },
    {
        id: 'z-audyt',
        tytul: 'Zlecić audyt bezpieczeństwa',
        opis: 'Obowiązek podmiotów kluczowych. Audytor musi być niezależny — nie może nim być osoba, która wdrażała u podmiotu oceniane zabezpieczenia.',
        podstawa: 'art. 15 ust. 1, 2 i 2a',
        termin: 'pierwszy w ciągu 24 miesięcy, potem co najmniej raz na 3 lata',
        pytania: ['ob-15-1', 'ob-15-3'],
        tylkoDlaStatusu: ['kluczowy'],
    },
];

/* Co zarząd zatwierdza, co nadzoruje, a co dokumentuje. */
const NADZOR_ZARZADCZY = [
    {
        kategoria: 'Zatwierdzać',
        pozycje: ['ocenę statusu i wpis do wykazu', 'politykę bezpieczeństwa i system zarządzania', 'budżet, role i harmonogram wdrożenia', 'procedurę incydentową i plan audytu'],
    },
    {
        kategoria: 'Nadzorować',
        pozycje: ['postęp wdrożenia i zidentyfikowane luki', 'ryzyka, incydenty i działania naprawcze', 'krytycznych dostawców i ciągłość działania', 'szkolenia i gotowość operacyjną'],
    },
    {
        kategoria: 'Dokumentować',
        pozycje: ['uchwały i decyzje zarządu', 'raporty, wskaźniki i status realizacji', 'dowody szkoleń i wpisu do wykazu', 'audyty, testy i przeglądy'],
    },
];

/* Minimalny zespół po stronie podmiotu. */
const ZESPOL_MINIMALNY = [
    { rola: 'Sponsor z zarządu', zakres: 'decyzje, priorytety, budżet, eskalacja i nadzór' },
    { rola: 'Kierownik projektu', zakres: 'koordynacja wdrożenia, harmonogram, status i dowody' },
    { rola: 'IT / cyberbezpieczeństwo', zakres: 'system zarządzania, analiza ryzyka, incydenty, środki techniczne' },
    { rola: 'Dział prawny / compliance', zakres: 'status podmiotu, wykaz, umowy, zgodność i procedury' },
    { rola: 'Inspektor ochrony danych', zakres: 'styk z RODO, naruszenia danych i komunikacja' },
];

/* Zadania odfiltrowane wg statusu, wraz ze stanem wykonania odczytanym
   z odpowiedzi — dzięki temu lista dla zarządu pokazuje realny postęp. */
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

    KRAJE.rejestruj('pl', {
        KIEROWNIK_DEFINICJA,
        ZADANIA_OSOBISTE,
        ZADANIA_DO_ZLECENIA,
        NADZOR_ZARZADCZY,
        ZESPOL_MINIMALNY,
        zadaniaKierownictwa,
    });
})();
