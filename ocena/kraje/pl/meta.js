/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Dane prawne: kary, kalendarz ustawowy, odpowiedzialność
   Podstawa: ustawa o KSC (t.j. Dz.U. 2026 poz. 20) w brzmieniu nadanym
   ustawą z 23.01.2026 r. (Dz.U. 2026 poz. 252) oraz przepisy przejściowe
   tej ustawy nowelizującej.
   ========================================================== */

const AKTY = {
    ksc: { tytul: 'Ustawa z dnia 5 lipca 2018 r. o krajowym systemie cyberbezpieczeństwa', dziennik: 't.j. Dz.U. 2026 poz. 20', skrotPliku: 'KSC' },
    nowelizacja: { tytul: 'Ustawa z dnia 23 stycznia 2026 r. o zmianie ustawy o krajowym systemie cyberbezpieczeństwa oraz niektórych innych ustaw', dziennik: 'Dz.U. 2026 poz. 252', ogloszenie: '2026-03-02', wejscie: '2026-04-03' },
    reg2690: { tytul: 'Rozporządzenie wykonawcze Komisji (UE) 2024/2690', dziennik: 'Dz.U. UE L, 2024/2690', wejscie: '2024-11-07' },
    pke: { tytul: 'Ustawa z dnia 12 lipca 2024 r. — Prawo komunikacji elektronicznej', dziennik: 'Dz.U. 2024 poz. 1221', wejscie: '2024-11-10' },
};

/* ── OD KIEDY WYMAGANIA REALNIE WIĄŻĄ W POLSCE ─────────────
   Rozporządzenie unijne stosuje się bezpośrednio, ale samo w sobie nie
   daje krajowemu organowi narzędzi nadzoru. Obowiązek stosowania
   rozporządzenia 2024/2690 wprowadza do prawa polskiego dopiero art. 8b
   ustawy o KSC, dodany nowelizacją z 23 stycznia 2026 r. Ponieważ art. 8b
   należy do rozdziału 3 ustawy, obejmuje go 12-miesięczne odroczenie
   z art. 33 ust. 1 nowelizacji, a kary z art. 35 nowelizacji.
   Dlatego pytania z 2024/2690 są w narzędziu pełnoprawną częścią oceny,
   ale opatrzone informacją, do kiedy jest czas na wdrożenie. */
const STOSOWANIE = {
    'ksc': {
        nazwa: 'Ustawa o KSC',
        stan: 'obowiazuje',
        odKiedy: '2027-04-03',
        naglowek: 'Obowiązuje — pełne wdrożenie do 3 kwietnia 2027 r.',
        opis: 'Ustawa obowiązuje od 3 kwietnia 2026 r. Obowiązki rozdziału 3 (system zarządzania bezpieczeństwem informacji, dokumentacja, procedury) podmiot realizuje w terminie 12 miesięcy od tej daty.',
        podstawa: 'art. 49 i art. 33 ust. 1 ustawy z 23.01.2026 (Dz.U. 2026 poz. 252)',
    },
    'ksc-ob': {
        nazwa: 'Obowiązki formalne KSC',
        stan: 'obowiazuje',
        odKiedy: '2026-10-03',
        naglowek: 'Obowiązuje — wniosek o wpis do 3 października 2026 r.',
        opis: 'Wpis do wykazu ma najkrótszy termin ze wszystkich obowiązków: 6 miesięcy od wejścia w życie nowelizacji.',
        podstawa: 'art. 33 ust. 3 ustawy z 23.01.2026, art. 7c ust. 1 ustawy o KSC',
    },
    'reg2690': {
        nazwa: 'Rozporządzenie (UE) 2024/2690',
        stan: 'okres-wdrozenia',
        odKiedy: '2027-04-03',
        naglowek: 'Wymogi są wiążące — termin wdrożenia w Polsce to 3 kwietnia 2027 r.',
        opis: 'Rozporządzenie unijne stosuje się bezpośrednio od 7 listopada 2024 r. i nie zawiera przepisów przejściowych. Do prawa polskiego obowiązek jego stosowania wprowadza art. 8b ustawy o KSC — nakazuje stosować środki z rozporządzenia w ramach systemu z art. 8 ust. 1. Ponieważ art. 8b należy do rozdziału 3 ustawy, objęty jest 12-miesięcznym terminem wdrożenia, a więc datą 3 kwietnia 2027 r. Kary za jego naruszenie mogą zostać nałożone po raz pierwszy 3 kwietnia 2028 r.',
        podstawa: 'art. 16 rozporządzenia 2024/2690, art. 8b ustawy o KSC, art. 33 ust. 1 i art. 35 ustawy z 23.01.2026',
        uwaga: 'Załącznik do rozporządzenia jest wiążący w obecnym brzmieniu — nie przewidziano aktów delegowanych ani norm, które warunkowałyby jego stosowanie. Wytyczne ENISA (Technical Implementation Guidance, czerwiec 2025) są wsparciem, nie warunkiem. Odstąpić można wyłącznie od wymogów opatrzonych formułą „w stosownych przypadkach" albo „w zakresie, w jakim jest to możliwe", i tylko dokumentując uzasadnienie (art. 2 ust. 2 rozporządzenia). Przy ograniczeniach wynikających z wielkości podmiotu dopuszczalne są środki kompensujące (motyw 5).',
    },
    'zal4': {
        nazwa: 'Załącznik nr 4 do ustawy o KSC',
        stan: 'obowiazuje',
        odKiedy: '2027-04-03',
        naglowek: 'Obowiązuje — pełne wdrożenie do 3 kwietnia 2027 r.',
        opis: 'Podmiot ważny będący podmiotem publicznym nie stosuje art. 8 ust. 1, tylko zamknięty katalog z załącznika nr 4. Termin jest ten sam co dla pozostałych obowiązków rozdziału 3: 12 miesięcy od wejścia w życie nowelizacji.',
        podstawa: 'art. 8 ust. 3 ustawy o KSC, art. 33 ust. 1 ustawy z 23.01.2026',
    },
    'pke': {
        nazwa: 'Prawo komunikacji elektronicznej',
        stan: 'w-mocy',
        odKiedy: '2024-11-10',
        naglowek: 'Obowiązuje w całości od 10 listopada 2024 r.',
        opis: 'PKE nie ma okresu przejściowego dla obowiązków bezpieczeństwa. Prezes UKE może kontrolować i karać już dziś — inaczej niż w przypadku ustawy o KSC.',
        podstawa: 'art. 124 ustawy z 12.07.2024 — Przepisy wprowadzające PKE (Dz.U. 2024 poz. 1222)',
    },
};

/* ── KARY PIENIĘŻNE ────────────────────────────────────────
   Art. 73 ust. 3-5 oraz art. 76b ustawy o KSC. */
const KARY_KSC = {
    kluczowy: {
        status: 'kluczowy',
        podstawa: 'art. 73 ust. 3 ustawy o KSC',
        kwotaEUR: 10000000,
        procentPrzychodu: 0.02,
        minimumPLN: 20000,
        podstawaBrakPrzychodu: 500000, // EUR, art. 73 ust. 3a
        kwotaWyzszaWprost: true,   // ust. 3 zawiera zwrot „zastosowanie ma kwota wyższa"
        opis: 'Do 10 000 000 EUR albo 2 % przychodu z działalności gospodarczej w roku obrotowym poprzedzającym wymierzenie kary — stosuje się kwotę wyższą. Nie mniej niż 20 000 zł.',
    },
    wazny: {
        status: 'wazny',
        podstawa: 'art. 73 ust. 4 ustawy o KSC',
        kwotaEUR: 7000000,
        procentPrzychodu: 0.014,
        minimumPLN: 15000,
        podstawaBrakPrzychodu: 250000,
        /* Uwaga redakcyjna: art. 73 ust. 4 — inaczej niż ust. 3 — NIE zawiera
           zwrotu „przy czym zastosowanie ma kwota wyższa". Dyrektywa NIS 2
           (art. 34 ust. 5) mówi „whichever is higher", więc przyjmujemy wykładnię
           zgodną z dyrektywą, ale rozbieżność sygnalizujemy użytkownikowi. */
        kwotaWyzszaWprost: false,
        opis: 'Do 7 000 000 EUR albo 1,4 % przychodu. Nie mniej niż 15 000 zł.',
    },
    kwalifikowana: {
        podstawa: 'art. 73 ust. 5 ustawy o KSC',
        kwotaPLN: 100000000,
        opis: 'Do 100 000 000 zł, gdy naruszenie powoduje bezpośrednie i poważne cyberzagrożenie dla obronności, bezpieczeństwa państwa, bezpieczeństwa i porządku publicznego lub życia i zdrowia ludzi, albo zagrożenie wywołania poważnej szkody majątkowej lub poważnych utrudnień w świadczeniu usług.',
    },
    okresowa: {
        podstawa: 'art. 76b ust. 1 ustawy o KSC',
        minPLN: 500,
        maksPLN: 100000,
        opis: 'Od 500 zł do 100 000 zł za każdy dzień opóźnienia w wykonaniu decyzji nadzorczych.',
    },
    kierownik: {
        podstawa: 'art. 73a ust. 4 ustawy o KSC',
        procentWynagrodzenia: 3.0,
        okresWynagrodzenia: 'całkowite wynagrodzenie',
        opis: 'Do 300 % wynagrodzenia kierownika, obliczanego według zasad obowiązujących przy ustalaniu ekwiwalentu pieniężnego za urlop.',
        zasady: [
            'Kara jest niezależna od kary nałożonej na podmiot (art. 73a ust. 3).',
            'Może zostać nałożona także przy zaniechaniu o charakterze jednorazowym (art. 73a ust. 2).',
            'Powierzenie obowiązków innej osobie nie wyłącza odpowiedzialności kierownika (art. 8c ust. 3).',
            'Przy organie wieloosobowym bez wskazania osoby odpowiedzialnej odpowiadają wszyscy członkowie organu (art. 8c ust. 2).',
            'Przesłanką jest czas, zakres lub charakter naruszenia (art. 73a ust. 1).',
        ],
    },
    kursEUR: {
        domyslny: 4.30,
        podstawa: 'Średni kurs NBP z 31 grudnia roku poprzedzającego rok wydania decyzji (art. 73 ust. 3).',
    },
    /* Dwa kroki, które w rozmowach nagminnie się zlewają: ustalenie
       pułapu jest mechaniczne i organ nie ma tu nic do wyboru, a dopiero
       wymiar kary w granicach pułapu jest uznaniowy. */
    jakPowstajePulap: {
        kroki: [
            { nr: 1, tytul: 'Pułap wyznacza ustawa, nie organ',
              opis: 'Porównuje się dwie wartości: sztywną kwotę w euro oraz procent przychodu z poprzedniego roku obrotowego. Wyższa z nich staje się górną granicą. Organ nie wybiera między nimi — wynika to wprost z przepisu.',
              podstawa: 'art. 73 ust. 3 ustawy o KSC' },
            { nr: 2, tytul: 'Kwotę w granicach pułapu ustala organ',
              opis: 'Dopiero tutaj jest uznanie. Organ bierze pod uwagę wagę i czas naruszenia, wcześniejsze naruszenia oraz wysokość przychodu i możliwości finansowe. Może też odstąpić od kary przy znikomej wadze naruszenia.',
              podstawa: 'art. 76a ust. 1 ustawy o KSC, art. 53 ust. 12 ustawy o KSC' },
        ],
        wniosek: 'Pułap może wielokrotnie przewyższać roczny przychód — tak samo jak w RODO. Nie znaczy to, że taka kara zostanie nałożona: to górna granica, a nie kwota oczekiwana.',
    },

    /* Kwoty z art. 73 to PUŁAP, nie kara oczekiwana. Art. 76a ust. 1 nakazuje
       organowi miarkowanie — w tym wprost według przychodu i możliwości
       finansowych podmiotu. Bez tego kontekstu pułap wprowadza w błąd. */
    miarkowanie: {
        podstawa: 'art. 76a ust. 1 ustawy o KSC',
        tresc: 'Organ właściwy, podejmując decyzję o nałożeniu kary pieniężnej i ustalając jej wysokość, uwzględnia odpowiednio kryteria określone w art. 53 ust. 12 oraz wysokość przychodu uzyskanego z działalności gospodarczej w roku obrotowym poprzedzającym wymierzenie kary pieniężnej i możliwości finansowe podmiotu.',
        wylaczenie: 'Przepisu art. 189a § 2 Kodeksu postępowania administracyjnego nie stosuje się.',
        kryteria: [
            'waga naruszenia i znaczenie naruszonych przepisów — za poważne uznaje się m.in. naruszenie powtarzające się, niezgłoszenie lub nieobsłużenie incydentu poważnego, nieusunięcie uchybień wbrew nakazowi, utrudnianie audytu lub monitorowania, podawanie nieprawdziwych informacji',
            'czas trwania naruszenia',
            'wcześniejsze poważne naruszenia ze strony podmiotu',
            'spowodowane szkody majątkowe i niemajątkowe, wpływ na inne usługi i liczbę użytkowników',
            'umyślny lub nieumyślny charakter czynu',
            'środki zastosowane, aby zapobiec szkodom lub je ograniczyć',
            'stopień współpracy z organem właściwym',
        ],
        odstapienie: 'Przy znikomej wadze naruszenia oraz zaprzestaniu naruszania lub naprawieniu szkody organ może odstąpić od nałożenia kary (art. 76a ust. 9).',
    },
    odKiedy: {
        data: '2028-04-03',
        podstawa: 'art. 35 ustawy nowelizującej',
        opis: 'Kary pieniężne mogą zostać nałożone po raz pierwszy dopiero po upływie 2 lat od dnia wejścia w życie ustawy.',
    },
};

/* ── KALENDARZ USTAWOWY ────────────────────────────────────
   Terminy stałe, liczone od wejścia w życie nowelizacji (3.04.2026). */
const KALENDARZ = [
    /* typ 'wejscie' oznacza zdarzenie, które już nastąpiło i od którego
       przepis obowiązuje. Data w przeszłości nie jest tu przekroczonym
       terminem — nie ma czego dotrzymać, więc nie piszemy „minęło”. */
    { data: '2026-04-03', tytul: 'Wejście w życie nowelizacji ustawy o KSC',
      opis: 'Operatorzy usług kluczowych stają się z mocy prawa podmiotami kluczowymi.',
      podstawa: 'art. 49 ustawy z 23.01.2026 o zmianie ustawy o KSC, art. 22 ust. 1 ustawy z 23.01.2026 o zmianie ustawy o KSC', typ: 'wejscie' },

    { data: '2026-04-13', tytul: 'Uruchomienie Wykazu podmiotów kluczowych i ważnych',
      opis: 'Wykaz KSC dostępny pod adresem wykaz-ksc.gov.pl, w Systemie S46. Do 6 maja 2026 r. trwały wpisy z urzędu — samodzielne składanie wniosków było w tym czasie niedostępne.',
      podstawa: 'art. 7c ustawy o KSC, komunikat Ministerstwa Cyfryzacji', typ: 'wejscie' },

    { data: '2026-05-07', tytul: 'Otwarcie samorejestracji w wykazie',
      opis: 'Od tego dnia podmioty nieobjęte wpisem z urzędu mogą samodzielnie składać wnioski o wpis. Realne okno na wniosek jest więc krótsze niż ustawowe 6 miesięcy.',
      podstawa: 'komunikat Ministerstwa Cyfryzacji', typ: 'wejscie' },

    { data: '2026-06-12', tytul: 'Udostępnienie Systemu S46 nowym podmiotom',
      opis: 'Od tej daty podmioty mogą rozpocząć korzystanie z Systemu S46, w tym zgłaszanie incydentów i komunikację z organami.',
      podstawa: 'art. 46 ust. 1 ustawy o KSC, komunikat Ministerstwa Cyfryzacji', typ: 'wejscie' },

    { data: '2026-10-03', tytul: 'Wniosek o wpis do wykazu podmiotów kluczowych i ważnych',
      opis: 'Dla podmiotów spełniających przesłanki w dniu wejścia w życie nowelizacji.',
      podstawa: 'art. 33 ust. 3 ustawy z 23.01.2026 o zmianie ustawy o KSC, art. 7c ust. 1 ustawy o KSC',
      typ: 'obowiazek', sekcja: 'ob-wykaz' },

    { data: '2027-04-03', tytul: 'Wdrożenie obowiązków rozdziału 3 ustawy o KSC',
      opis: 'Rozdział 3 „Obowiązki podmiotów kluczowych i podmiotów ważnych”: system zarządzania bezpieczeństwem informacji, dokumentacja, procedury oraz korzystanie z systemu teleinformatycznego z art. 46 ust. 1 ustawy o KSC.',
      podstawa: 'art. 33 ust. 1 ustawy z 23.01.2026 o zmianie ustawy o KSC, art. 16 pkt 1 ustawy o KSC, art. 46 ust. 4 ustawy o KSC',
      typ: 'obowiazek', sekcja: 'ksc-ryzyko' },

    { data: '2027-04-03', tytul: 'Rozpoczęcie korzystania z Systemu S46',
      opis: 'Obowiązek korzystania z systemu teleinformatycznego, przez który zgłasza się incydenty poważne i prowadzi wymianę informacji z organami. Termin 12 miesięcy od spełnienia przesłanek.',
      podstawa: 'art. 46 ust. 1 ustawy o KSC, art. 16 pkt 1 ustawy o KSC', typ: 'obowiazek', sekcja: 'ob-system46' },

    { data: '2027-10-03', tytul: 'Ustanowienie CSIRT sektorowych przez organy właściwe',
      opis: 'Do czasu ogłoszenia komunikatu o zdolności operacyjnej CSIRT sektorowego zgłoszenia incydentów kieruje się do CSIRT NASK, CSIRT GOV albo CSIRT MON.',
      podstawa: 'art. 42 ust. 1 ustawy o KSC, art. 44 ustawy z 23.01.2026 o zmianie ustawy o KSC', typ: 'informacja' },

    { data: '2028-04-03', tytul: 'Pierwsza możliwa kara pieniężna',
      opis: 'Organy uzyskują uprawnienie do nakładania kar pieniężnych z art. 73 ust. 1–4, art. 73a–73c i art. 76b ustawy o KSC. Odroczenie nie obejmuje kary nadzwyczajnej do 100 mln zł za naruszenie powodujące bezpośrednie i poważne cyberzagrożenie — ta może zostać nałożona wcześniej.',
      podstawa: 'art. 35 ustawy z 23.01.2026 o zmianie ustawy o KSC', typ: 'ryzyko' },

    { data: '2028-04-03', tytul: 'Pierwszy audyt bezpieczeństwa podmiotu kluczowego',
      opis: 'Termin przeprowadzenia pierwszego audytu bezpieczeństwa systemu informacyjnego.',
      podstawa: 'art. 33 ust. 2 ustawy z 23.01.2026 o zmianie ustawy o KSC, art. 16 pkt 2 ustawy o KSC, art. 15 ust. 1 ustawy o KSC',
      typ: 'obowiazek', sekcja: 'ob-audyt', tylkoDlaStatusu: ['kluczowy'] },
];


/* Terminy liczone indywidualnie od zdarzenia, nie od daty ustawy. */
const TERMINY_INDYWIDUALNE = [
    { termin: '6 miesięcy', od: 'spełnienia przesłanek uznania za podmiot kluczowy lub ważny', co: 'złożenie wniosku o wpis do wykazu', art: 'art. 7c ust. 1' },
    { termin: '14 dni', od: 'zmiany danych', co: 'wniosek o zmianę wpisu w wykazie', art: 'art. 7c ust. 3' },
    { termin: '6 miesięcy', od: 'doręczenia wezwania', co: 'uzupełnienie danych przy wpisie z urzędu', art: 'art. 7b ust. 2' },
    { termin: '12 miesięcy', od: 'spełnienia przesłanek', co: 'realizacja obowiązków rozdziału 3 i korzystanie z systemu z art. 46 ust. 1', art: 'art. 16 pkt 1, art. 46 ust. 4' },
    { termin: '24 miesiące', od: 'spełnienia przesłanek', co: 'pierwszy audyt bezpieczeństwa', art: 'art. 16 pkt 2' },
    { termin: '3 dni robocze', od: 'otrzymania raportu z audytu', co: 'przekazanie kopii raportu organowi właściwemu', art: 'art. 15 ust. 1a' },
    { termin: '24 godziny', od: 'wykrycia incydentu poważnego', co: 'wczesne ostrzeżenie', art: 'art. 11 ust. 1 pkt 4' },
    { termin: '72 godziny', od: 'wykrycia incydentu poważnego', co: 'zgłoszenie incydentu poważnego', art: 'art. 11 ust. 1 pkt 4a' },
    { termin: '1 miesiąc', od: 'zgłoszenia incydentu', co: 'sprawozdanie końcowe', art: 'art. 11 ust. 1 pkt 4c' },
    { termin: 'raz w roku kalendarzowym', od: '—', co: 'szkolenie kierownika podmiotu', art: 'art. 8e ust. 1' },
];

/* ── KALKULATOR KARY ───────────────────────────────────────
   Zwraca maksymalną karę dla podmiotu wraz z uzasadnieniem wyboru podstawy. */
function obliczKare(status, przychodPLN, kursEUR) {
    const k = KARY_KSC[status];
    if (!k) return null;

    const kurs = Number(kursEUR) > 0 ? Number(kursEUR) : KARY_KSC.kursEUR.domyslny;
    const przychod = Number(przychodPLN);
    const limitKwotowy = k.kwotaEUR * kurs;

    if (!Number.isFinite(przychod) || przychod <= 0) {
        const podstawa = k.podstawaBrakPrzychodu * kurs;
        return {
            status, kurs,
            kwota: podstawa,
            podstawaWyboru: `Brak przychodu lub działalność krócej niż 12 miesięcy — podstawą wymiaru jest równowartość ${k.podstawaBrakPrzychodu.toLocaleString('pl-PL')} EUR.`,
            podstawaPrawna: status === 'kluczowy' ? 'art. 73 ust. 3a ustawy o KSC' : 'art. 73 ust. 4 ustawy o KSC',
            wariantProcentowy: null,
            wariantKwotowy: podstawa,
            minimum: k.minimumPLN,
        };
    }

    const wariantProcentowy = przychod * k.procentPrzychodu;
    const wyzszy = Math.max(wariantProcentowy, limitKwotowy);
    const kwota = Math.max(wyzszy, k.minimumPLN);

    let podstawaWyboru;
    if (kwota === k.minimumPLN && k.minimumPLN > wyzszy) {
        podstawaWyboru = `Obie podstawy dają kwotę niższą od ustawowego minimum ${k.minimumPLN.toLocaleString('pl-PL')} zł.`;
    } else if (wariantProcentowy > limitKwotowy) {
        podstawaWyboru = `Przeważa wariant procentowy: ${(k.procentPrzychodu * 100).toLocaleString('pl-PL')} % przychodu jest wyższe niż równowartość ${(k.kwotaEUR / 1000000)} mln EUR.`;
    } else {
        podstawaWyboru = `Przeważa limit kwotowy: równowartość ${(k.kwotaEUR / 1000000)} mln EUR jest wyższa niż ${(k.procentPrzychodu * 100).toLocaleString('pl-PL')} % przychodu.`;
    }

    /* Relacja pułapu do przychodu — sygnał proporcjonalności dla zarządu.
       Gdy pułap wielokrotnie przewyższa roczny przychód, kara w tej wysokości
       byłaby nie do pogodzenia z art. 76a ust. 1, który każe uwzględnić
       możliwości finansowe podmiotu. */
    const krotnoscPrzychodu = kwota / przychod;

    return {
        status, kurs, kwota, podstawaWyboru,
        podstawaPrawna: k.podstawa,
        wariantProcentowy,
        wariantKwotowy: limitKwotowy,
        minimum: k.minimumPLN,
        przychod,
        krotnoscPrzychodu,
        pulapPrzewyzszaPrzychod: krotnoscPrzychodu > 1,
        uwagaProporcjonalnosc: krotnoscPrzychodu > 1
            ? `Ustawowy pułap przewyższa roczny przychód podmiotu ${krotnoscPrzychodu.toFixed(1)}-krotnie. Kara w tej wysokości byłaby nie do pogodzenia z art. 76a ust. 1, który nakazuje organowi uwzględnić wysokość przychodu i możliwości finansowe podmiotu. To górna granica ustawowa, a nie kara oczekiwana.`
            : null,
        /* Rozbieżność brzmienia obu ustępów ma znaczenie praktyczne:
           przy podmiocie ważnym o niskim przychodzie różnica między
           wykładniami to różnica między setkami tysięcy a dziesiątkami
           milionów złotych. */
        uwagaRedakcyjna: (!k.kwotaWyzszaWprost && limitKwotowy > wariantProcentowy)
            ? 'Art. 73 ust. 4 — inaczej niż ust. 3 dla podmiotów kluczowych — nie zawiera zwrotu „przy czym zastosowanie ma kwota wyższa”. Przyjęto wykładnię zgodną z art. 34 ust. 5 dyrektywy NIS 2 („whichever is higher”). Przy odmiennej wykładni pułapem byłby wariant procentowy.'
            : null,
    };
}

/* Ekspozycja kierownika — art. 73a ust. 4 ustawy o KSC oraz, dla ISP,
   równolegle art. 444 ust. 4 PKE. */
function obliczKareKierownika(wynagrodzenieMiesieczne, czyIsp, opcje) {
    const w = Number(wynagrodzenieMiesieczne);
    const wynik = { pozycje: [], suma: null };
    if (!Number.isFinite(w) || w <= 0) return wynik;

    /* Art. 73a ust. 5: kierownik podmiotu publicznego odpowiada do 100 %,
       a nie 300 % wynagrodzenia. Złagodzenie odpada, jeżeli ten sam podmiot
       jest objęty ustawą również z tytułu innego sektora — wtedy wraca
       ust. 4, czyli 300 %. */
    const o = opcje || {};
    const publiczny = o.podmiotPubliczny && !o.innySektor;
    wynik.pozycje.push({
        akt: 'Ustawa o KSC',
        organ: 'Organ właściwy do spraw cyberbezpieczeństwa',
        podstawa: publiczny ? 'art. 73a ust. 5' : 'art. 73a ust. 4',
        kwota: publiczny ? w : w * 3,
        opis: publiczny
            ? 'Do 100 % wynagrodzenia obliczanego według zasad ekwiwalentu za urlop — obniżony pułap dla kierownika podmiotu publicznego.'
            : 'Do 300 % wynagrodzenia obliczanego według zasad ekwiwalentu za urlop.',
    });
    if (o.podmiotPubliczny && o.innySektor) {
        wynik.uwaga = 'Podmiot publiczny objęty ustawą również z tytułu innego sektora z załącznika nr 1 lub 2 traci obniżony pułap 100 % — stosuje się art. 73a ust. 4, czyli 300 % wynagrodzenia (art. 73a ust. 5 zdanie drugie).';
    }

    if (czyIsp) {
        wynik.pozycje.push({
            akt: 'Prawo komunikacji elektronicznej',
            organ: 'Prezes UKE (a w sprawach danych osobowych — Prezes UODO)',
            podstawa: 'art. 444 ust. 4 PKE',
            kwota: w * 3,
            opis: 'Do 300 % miesięcznego wynagrodzenia, nakładana niezależnie od kary na przedsiębiorcę.',
        });
    }

    wynik.suma = wynik.pozycje.reduce((s, p) => s + p.kwota, 0);
    return wynik;
}

/* Terminy z kalendarza pozostałe do upływu, liczone od dziś. */
function nadchodzaceTerminy(status, dataOdniesienia) {
    const dzis = dataOdniesienia ? new Date(dataOdniesienia) : new Date();
    return KALENDARZ
        .filter(t => !t.tylkoDlaStatusu || t.tylkoDlaStatusu.includes(status))
        .map(t => {
            const d = new Date(t.data);
            const dni = Math.ceil((d - dzis) / 86400000);
            /* Wejście w życie przepisu i termin do dotrzymania to dwie różne
               rzeczy. Data wejścia w życie w przeszłości znaczy „obowiązuje”,
               a nie „termin minął” — nie było czego dotrzymywać. */
            const wMocy = t.typ === 'wejscie' && dni < 0;
            return { ...t, dni, minelo: dni < 0 && !wMocy, wMocy };
        })
        .sort((a, b) => a.dni - b.dni);
}

function formatujPLN(kwota) {
    if (!Number.isFinite(kwota)) return '—';
    return Math.round(kwota).toLocaleString('pl-PL') + ' zł';
}

/* Relacja katalogu krajowego do rozporządzenia wykonawczego (UE) 2024/2690.
   Art. 8b ustawy o KSC nakazuje stosować środki z rozporządzenia „w ramach
   systemu, o którym mowa w art. 8 ust. 1" — obie warstwy sumują się.
   Model kumulatywny. Inne państwa rozstrzygają to inaczej (Litwa: wyłącznie
   rozporządzenie dla podmiotów nim objętych; Łotwa: krajowy z zastrzeżeniem
   pierwszeństwa rozporządzenia), stąd pole per kraj, nie stała w silniku. */
/* Waluta kwot krajowych: kary, progi, przychód. Symbol po kwocie,
   jak w polskim zwyczaju („20 000 zł"); inne kraje mogą mieć przed. */
const WALUTA = { kod: 'PLN', symbol: 'zł', poKwocie: true };

const RELACJA_2690 = {
    model: 'kumulatywny',
    podstawa: 'art. 8b ustawy o KSC',
    /* Co z katalogiem krajowym, gdy podmiot jest objęty rozporządzeniem:
       'pelny' | 'wylaczony' | 'z-zastrzezeniem' */
    krajowyGdyObjety: 'pelny',
    /* Co z rozporządzeniem dla podmiotu nim objętego:
       'pelny' | 'brak' | 'tylko-progi-incydentu' */
    reg2690: 'pelny',
    /* Wyjątki per sekcja katalogu krajowego, gdy państwo rozstrzyga różnie
       w zależności od zagadnienia (Słowenia). Klucz: id sekcji. */
    wyjatki: {},
};

    KRAJE.rejestruj('pl', {
        RELACJA_2690,
        WALUTA,
        AKTY,
        STOSOWANIE,
        KARY_KSC,
        KALENDARZ,
        TERMINY_INDYWIDUALNE,
        obliczKare,
        obliczKareKierownika,
        nadchodzaceTerminy,
        formatujPLN,
    });
})();
