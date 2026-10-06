/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Pytania i odpowiedzi Ministerstwa Cyfryzacji do nowelizacji
   ustawy o KSC, przypisane do obszarów oceny.

   Wybrane zostały wyłącznie pytania przydatne osobie wypełniającej
   samoocenę — pominięte są pytania o historię dyrektywy, strukturę
   administracji i sprawy sektorowe spoza zakresu narzędzia.

   Źródło: „Pytania i odpowiedzi", Ministerstwo Cyfryzacji.
   Dokument sam zastrzega, że nie ma mocy prawnej i nie jest
   wiążący — dlatego odpowiedzi opatrzone są tym zastrzeżeniem,
   a rozstrzygające pozostaje brzmienie ustawy.
   ========================================================== */

const FAQ_ZRODLO = {
    nazwa: 'Pytania i odpowiedzi — Ministerstwo Cyfryzacji',
    url: 'https://www.gov.pl/attachment/4a661bd4-712c-4faf-8025-bcad437e5a29',
    zastrzezenie: 'Stanowisko Ministerstwa Cyfryzacji, bez mocy wiążącej. Rozstrzyga brzmienie ustawy.',
};

/* obszar → gdzie pytanie ma się pokazać:
   'start' pokazuje się także na ekranie startowym jako FAQ ogólne. */
const FAQ = [
    /* ── KLASYFIKACJA ─────────────────────────────────────── */
    { obszar: 'klasyfikacja', naStart: true,
      p: 'Skąd mam wiedzieć, czy w ogóle podlegam pod ustawę?',
      o: 'Trzeba samodzielnie ustalić dwie rzeczy: rodzaj faktycznie prowadzonej działalności — według załączników nr 1 i 2 do ustawy, a nie samych kodów PKD — oraz wielkość podmiotu. Nikt nie wyśle decyzji stwierdzającej, że podlegasz; obowiązek samoidentyfikacji spoczywa na podmiocie.',
      art: 'art. 5 ustawy o KSC' },

    { obszar: 'klasyfikacja', naStart: true,
      p: 'Czy dostanę decyzję administracyjną, że jestem podmiotem kluczowym?',
      o: 'Nie. Każdy podmiot prowadzący działalność z załączników nr 1 i 2 musi przeanalizować to sam. Wyjątkiem jest identyfikacja przez organ właściwy podmiotu, który normalnie nie spełnia progów, ale np. jako jedyny świadczy usługę o kluczowym znaczeniu.',
      art: 'art. 5 ustawy o KSC' },

    { obszar: 'klasyfikacja',
      p: 'Czy wszyscy przedsiębiorcy telekomunikacyjni podlegają ustawie?',
      o: 'Tak, niezależnie od wielkości — nie ma progu, poniżej którego operator wypada z zakresu. Wielkość decyduje wyłącznie o statusie: duży i średni to podmiot kluczowy, mały i mikro — podmiot ważny.',
      art: 'art. 5 ust. 1 pkt 2 i ust. 2 pkt 4 ustawy o KSC' },

    { obszar: 'klasyfikacja',
      p: 'Czym różni się podmiot kluczowy od ważnego?',
      o: 'Obowiązki merytoryczne są takie same. Różnica dotyczy nadzoru: nad podmiotami kluczowymi jest on prewencyjny, nad ważnymi wyłącznie następczy. Podmiot kluczowy ma też obowiązek audytu co trzy lata, ważny — tylko na żądanie organu.',
      art: 'art. 53 ust. 3 ustawy o KSC' },

    { obszar: 'klasyfikacja',
      p: 'Główna działalność nie podlega ustawie, ale poboczna tak. Czy trzeba się zgłosić?',
      o: 'Tak. Ustawie podlega działalność wskazana w załącznikach niezależnie od tego, czy jest główna, czy pomocnicza. Wyjątek dotyczy tylko zaopatrzenia w wodę, odprowadzania ścieków i gospodarowania odpadami, gdzie liczy się działalność główna.',
      art: 'załączniki nr 1 i 2 do ustawy o KSC' },

    { obszar: 'klasyfikacja',
      p: 'Czy doliczać dane spółek powiązanych, jeżeli nie świadczymy z nimi wspólnie usług?',
      o: 'Co do zasady tak, ale jeżeli systemy informacyjne podmiotu są niezależne od systemów podmiotów powiązanych, nie ma powodu uznawać go za podmiot ważny z tego tytułu. Niezależność trzeba udokumentować.',
      art: 'art. 5 ust. 6 i 7 ustawy o KSC' },

    { obszar: 'klasyfikacja',
      p: 'Czy małe ISP świadczące DNS w ramach dostępu do internetu jest dostawcą usług DNS?',
      o: 'Nie. Serwery DNS udostępniane w ramach usługi dostępu do internetu są elementem tej usługi, a nie samodzielną, publicznie dostępną usługą DNS. Taki operator pozostaje podmiotem ważnym, nie staje się kluczowym z tytułu DNS.',
      art: null },

    { obszar: 'klasyfikacja',
      p: 'Czy szkoły i przedszkola są podmiotami KSC?',
      o: 'Tak — szkoły publiczne i przedszkola są jednostkami budżetowymi, a więc podmiotami krajowego systemu cyberbezpieczeństwa. Dla takich jednostek przewidziano uproszczone wymagania z załącznika nr 4 oraz możliwość wspólnej obsługi kilku jednostek.',
      art: 'załącznik nr 4 do ustawy o KSC' },

    /* ── WYKAZ I SYSTEM S46 ───────────────────────────────── */
    { obszar: 'wykaz', naStart: true,
      p: 'Do kiedy trzeba złożyć wniosek o wpis do wykazu?',
      o: 'W terminie 6 miesięcy od dnia spełnienia przesłanek. Dla podmiotów, które spełniały je 3 kwietnia 2026 r., termin upływa 3 października 2026 r. Samorejestracja ruszyła jednak dopiero 7 maja 2026 r., więc realne okno jest krótsze niż pół roku.',
      art: 'art. 7c ust. 1 ustawy o KSC, art. 33 ust. 3 ustawy z 23.01.2026' },

    { obszar: 'wykaz', naStart: true,
      p: 'Czy muszę składać wniosek, skoro jestem operatorem telekomunikacyjnym?',
      o: 'Nie. Przedsiębiorców telekomunikacyjnych, dostawców usług zaufania, podmioty publiczne i dotychczasowych operatorów usług kluczowych Minister Cyfryzacji wpisuje z urzędu. Podmiot dostaje zawiadomienie i zwykle wezwanie do uzupełnienia danych — na to ma 6 miesięcy, pod rygorem kary.',
      art: 'art. 7j ustawy o KSC' },

    { obszar: 'wykaz',
      p: 'Kto może podpisać wniosek o wpis?',
      o: 'Kierownik podmiotu albo osoba przez niego upoważniona. Pełnomocnictwo musi mieć postać elektroniczną; nie jest potrzebne dla prokurentów ujawnionych w KRS i pełnomocników w CEIDG. Wniosek zawiera oświadczenie kierownika składane pod rygorem odpowiedzialności karnej.',
      art: 'art. 233 § 6 Kodeksu karnego' },

    { obszar: 'wykaz',
      p: 'Czy wykaz podmiotów kluczowych i ważnych jest publiczny?',
      o: 'Nie. Dostęp mają wyłącznie uprawnione organy, zespoły CSIRT oraz sam podmiot w zakresie własnych danych.',
      art: null },

    { obszar: 'wykaz',
      p: 'Co grozi za brak wpisu?',
      o: 'Podmiot zostanie wpisany z urzędu przez organ właściwy, co zwykle pociąga za sobą czynności nadzorcze, a docelowo administracyjną karę pieniężną. Brak wpisu jest jedną z wymienionych wprost przesłanek kary.',
      art: 'art. 7j ustawy o KSC' },

    { obszar: 's46', naStart: true,
      p: 'Czym jest System S46 i czy muszę z niego korzystać?',
      o: 'To system teleinformatyczny prowadzony przez Ministra Cyfryzacji, przez który zgłasza się incydenty i prowadzi wymianę informacji. Korzystanie z niego jest obowiązkowe dla podmiotów kluczowych i ważnych w terminie 12 miesięcy od spełnienia przesłanek — czyli do 3 kwietnia 2027 r.',
      art: 'art. 46 ust. 1 ustawy o KSC' },

    { obszar: 's46',
      p: 'Jak uzyskać dostęp do S46?',
      o: 'Nie składa się osobnego wniosku. Dostęp do S46 Cyber Hub dostaje automatycznie administrator wskazany we wniosku o wpis do wykazu, na podany adres poczty. Logowanie odbywa się przez Węzeł Krajowy.',
      art: null },

    { obszar: 's46',
      p: 'Czego potrzebuję technicznie, żeby korzystać z S46?',
      o: 'Przeglądarki na silniku Chromium w aktualnej wersji, łącza co najmniej 10 Mb/s oraz stacji roboczej z ochroną antywirusową, zabezpieczonej przed dostępem osób nieupoważnionych.',
      art: null },

    /* ── SZBI ─────────────────────────────────────────────── */
    { obszar: 'szbi', naStart: true,
      p: 'Kupiliśmy gotową dokumentację zgodną z NIS 2. Czy to wystarczy?',
      o: 'Nie. Ustawa wymaga realnego zapewnienia cyberbezpieczeństwa: znajomości aktywów i ryzyk, adekwatnych środków oraz procedur wdrożonych, przetestowanych i stosowanych w praktyce. Dokumentacja podpisana przez zarząd i odłożona do szafy nie zapewnia zgodności.',
      art: 'art. 8 ust. 1 ustawy o KSC' },

    { obszar: 'szbi',
      p: 'Czy trzeba tworzyć dokumentację SZBI od zera?',
      o: 'Nie. Organizacje, które wdrożyły system zarządzania według uznanych norm, mogą wykorzystać i dostosować istniejącą dokumentację. Warunek jest jeden: muszą być w niej ujęte wszystkie elementy wskazane w art. 8.',
      art: 'art. 8 ustawy o KSC' },

    { obszar: 'szbi',
      p: 'Czy musimy mieć własny SOC?',
      o: 'Nie. Ustawa nie narzuca rozwiązań technicznych ani organizacyjnych — podmiot sam decyduje, co jest adekwatne. Można skorzystać z usług zewnętrznych albo budować kompetencje wewnętrznie, także w ramach grupy kapitałowej.',
      art: null },

    { obszar: 'szbi',
      p: 'Czy zadania z cyberbezpieczeństwa można zlecić na zewnątrz?',
      o: 'Tak. Podmiot realizuje je przez własne struktury lub na podstawie umowy z dostawcą usług zarządzanych w zakresie cyberbezpieczeństwa — dopuszczalne jest też powierzenie tylko części zadań. Decyzja musi być jednak rozsądna: nie wystarczy dorzucić obowiązki przeciążonemu działowi wsparcia.',
      art: 'art. 14 ustawy o KSC' },

    { obszar: 'szbi',
      p: 'Które systemy informacyjne trzeba objąć SZBI?',
      o: 'Te wykorzystywane w procesach mających wpływ na świadczenie usługi. Kryteria: czy system jest konieczny do jej świadczenia, czy przetwarza dane albo steruje procesami, od których usługa zależy, i czy awaria w nim może przerwać świadczenie. Systemy w pełni odseparowane obowiązkowi nie podlegają.',
      art: 'art. 8 ustawy o KSC' },

    { obszar: 'szbi',
      p: 'Czy personel podlega weryfikacji?',
      o: 'Tak. Zadań z zakresu cyberbezpieczeństwa nie może wykonywać osoba skazana za przestępstwa przeciwko ochronie informacji z rozdziału XXXIII Kodeksu karnego. Zaświadczenie o niekaralności weryfikuje kierownik przed dopuszczeniem do zadań; dotyczy to także umów cywilnoprawnych.',
      art: 'art. 8f ustawy o KSC' },

    /* ── KIEROWNICTWO ─────────────────────────────────────── */
    { obszar: 'kierownictwo', naStart: true,
      p: 'Czy mogę scedować odpowiedzialność na dyrektora IT?',
      o: 'Nie. Kierownik odpowiada również wtedy, gdy powierzył obowiązki innej osobie za jej zgodą. Przy organie wieloosobowym bez wskazania osoby odpowiedzialnej odpowiadają wszyscy członkowie organu.',
      art: 'art. 8c ust. 2 i 3 ustawy o KSC' },

    { obszar: 'kierownictwo',
      p: 'Kto jest kierownikiem podmiotu w rozumieniu ustawy?',
      o: 'Członek zarządu lub innego organu zarządzającego, a przy organie wieloosobowym — wszyscy jego członkowie, z wyłączeniem pełnomocników. W spółkach osobowych — wspólnicy prowadzący sprawy spółki, u przedsiębiorcy jednoosobowego — ta osoba, w podmiocie publicznym — kierownik jednostki.',
      art: 'art. 8c ustawy o KSC' },

    { obszar: 'kierownictwo',
      p: 'Czy szkolenie kierownika jest obowiązkowe?',
      o: 'Tak, raz w roku kalendarzowym. Obejmuje opracowanie systemu zarządzania bezpieczeństwem informacji, zgłaszanie incydentów i dokumentowanie. Brak szkolenia jest odrębną przesłanką kary dla kierownika.',
      art: 'art. 8e ustawy o KSC' },

    /* ── INCYDENTY ────────────────────────────────────────── */
    { obszar: 'incydenty', naStart: true,
      p: 'Czy trzeba zgłaszać każdy incydent?',
      o: 'Nie. Obowiązkowemu zgłoszeniu podlegają wyłącznie incydenty poważne. Każdym incydentem trzeba jednak zarządzać i prowadzić jego obsługę.',
      art: 'art. 11 ustawy o KSC' },

    { obszar: 'incydenty',
      p: 'Od kiedy liczy się 24 i 72 godziny?',
      o: 'Od momentu wykrycia incydentu, czyli od chwili, gdy podmiot uzyskał informację o zdarzeniu — z własnego monitorowania albo od dostawcy. Nie od zakończenia analizy. Dlatego w umowach z dostawcami warto zastrzec obowiązek niezwłocznego informowania.',
      art: 'art. 11 ust. 1 pkt 4 i 4a ustawy o KSC' },

    { obszar: 'incydenty',
      p: 'Nie mamy jeszcze wszystkich danych. Czy czekać ze zgłoszeniem?',
      o: 'Nie. Zgłasza się to, co wiadomo na moment zgłoszenia, a resztę uzupełnia w trakcie obsługi incydentu.',
      art: null },

    { obszar: 'incydenty',
      p: 'Część danych to tajemnica przedsiębiorstwa. Czy muszę je przekazać?',
      o: 'Tak. Obowiązek obejmuje również informacje prawnie chronione. Zespoły CSIRT mają obowiązek zachować je w tajemnicy, a w zgłoszeniu należy je odpowiednio oznaczyć.',
      art: null },

    { obszar: 'incydenty',
      p: 'Jeden incydent dotyka usług w kilku sektorach. Zgłaszać wielokrotnie?',
      o: 'Nie. Wystarczy jedno zgłoszenie w Systemie S46 — zespoły CSIRT sektorowe mają obowiązek wzajemnie się poinformować.',
      art: null },

    { obszar: 'incydenty',
      p: 'Czy incydenty w automatyce przemysłowej też się zgłasza?',
      o: 'Tak. Definicja systemu informacyjnego obejmuje również systemy automatyki przemysłowej.',
      art: null },

    /* ── AUDYT ────────────────────────────────────────────── */
    { obszar: 'audyt',
      p: 'Czy audyt może przeprowadzić nasz własny zespół?',
      o: 'Nie ta sama osoba, która odpowiada za bezpieczeństwo. Audytu nie może przeprowadzić osoba realizująca w podmiocie zadania z zakresu SZBI i zgłaszania incydentów ani taka, która realizowała je w ciągu roku przed audytem.',
      art: 'art. 15 ust. 2a ustawy o KSC' },

    { obszar: 'audyt',
      p: 'Byliśmy operatorem usługi kluczowej. Czy mamy 24 miesiące na pierwszy audyt?',
      o: 'Nie. Dotychczasowi operatorzy usług kluczowych zachowują swój cykl — audyt co najmniej raz na 3 lata, licząc od podpisania raportu z ostatniego audytu. Odroczenie do 3 kwietnia 2028 r. ich nie obejmuje.',
      art: 'art. 15 ust. 1 ustawy o KSC' },

    /* ── KARY ─────────────────────────────────────────────── */
    { obszar: 'kary', naStart: true,
      p: 'Czy kary grożą już teraz?',
      o: 'Kary pieniężne mogą być nakładane dopiero po 3 kwietnia 2028 r. Wyjątkiem jest kara nadzwyczajna do 100 mln zł przy bezpośrednim i poważnym zagrożeniu — ta odroczeniu nie podlega. Obowiązki wdrożeniowe biegną niezależnie od terminu kar.',
      art: 'art. 35 ustawy z 23.01.2026, art. 73 ust. 5 ustawy o KSC' },

    { obszar: 'kary', naStart: true,
      p: 'Kara ma być kwotowa czy procentowa? Kto o tym decyduje?',
      o: 'Nie decyduje o tym organ. Ustawa nakazuje porównać sztywną kwotę w euro z procentem przychodu i przyjąć wyższą z nich jako pułap — tak samo jak w RODO. Dlatego pułap może wielokrotnie przewyższać roczny przychód. Uznanie organu zaczyna się dopiero przy ustalaniu kwoty w granicach tego pułapu, z uwzględnieniem przychodu i możliwości finansowych.',
      art: 'art. 73 ust. 3 ustawy o KSC, art. 76a ust. 1 ustawy o KSC' },

    { obszar: 'kary',
      p: 'Czy organ uprzedzi przed nałożeniem kary?',
      o: 'Tak. Przy uzasadnionym podejrzeniu naruszenia organ kieruje ostrzeżenie ze wskazaniem czynności i terminu. Przed nałożeniem kary informuje o wstępnych ustaleniach z uzasadnieniem, a podmiot ma 7 dni na stanowisko, do którego organ musi się ustosunkować.',
      art: null },

    { obszar: 'kary',
      p: 'Czy organ może odstąpić od kary?',
      o: 'Tak, jeżeli waga naruszenia i znaczenie naruszonych przepisów są znikome, a podmiot zaprzestał naruszania prawa lub naprawił szkodę. Przy wymiarze kary organ bierze pod uwagę m.in. przychód i możliwości finansowe.',
      art: 'art. 76a ustawy o KSC' },

    { obszar: 'kary',
      p: 'Co organ uzna za dowód wdrożenia?',
      o: 'Dokumenty — procedury, polityki, upoważnienia, zakresy obowiązków — ale również relacje personelu. Wymagane jest udowodnienie stosowania przepisów, a nie samo przedstawienie formalnie poprawnych dokumentów.',
      art: null },

    /* ── DOSTAWCA WYSOKIEGO RYZYKA ────────────────────────── */
    { obszar: 'dostawca-ryzyka',
      p: 'Czy zaraz po wejściu ustawy powstanie lista dostawców wysokiego ryzyka?',
      o: 'Nie. Wejście w życie przepisów nie oznacza ich zastosowania. Nawet przy wszczęciu procedury decyzja nie obejmie całego asortymentu dostawcy, lecz wyłącznie typy sprzętu albo oprogramowania wskazane w samej decyzji.',
      art: 'art. 67b ustawy o KSC' },
];

/* Pytania przypisane do obszaru, z pominięciem tych bez treści. */
function faqDlaObszaru(obszar) {
    return FAQ.filter(q => q.obszar === obszar);
}

function faqNaStart() {
    return FAQ.filter(q => q.naStart);
}

    KRAJE.rejestruj('pl', {
        FAQ_ZRODLO,
        FAQ,
        faqDlaObszaru,
        faqNaStart,
    });
})();
