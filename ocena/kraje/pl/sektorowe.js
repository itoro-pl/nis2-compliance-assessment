/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Prawo komunikacji elektronicznej
   ustawa z dnia 12 lipca 2024 r. (Dz.U. 2024 poz. 1221)

   Warstwa dotyczy WYŁĄCZNIE przedsiębiorców telekomunikacyjnych
   (rola 'isp'). Operator centrum przetwarzania danych nie podlega
   PKE, chyba że równolegle dostarcza publiczną sieć telekomunikacyjną
   albo świadczy publicznie dostępne usługi telekomunikacyjne lub
   usługi powiązane (art. 1 ust. 1 pkt 1, art. 2 pkt 40 i 42).

   USTALENIE KLUCZOWE:
   PKE NIE zawiera obowiązku zgłaszania incydentów bezpieczeństwa.
   Nie ma w nim definicji incydentu, progów istotności, terminów
   zgłoszenia ani adresata (Prezes UKE / CSIRT). Blok obowiązków
   z dawnych art. 175-175e Prawa telekomunikacyjnego nie został
   przeniesiony do PKE — ścieżka incydentowa wynika wyłącznie
   z ustawy o KSC. Jedyny obowiązek zgłoszeniowy w PKE dotyczy naruszeń
   danych osobowych i prowadzi do Prezesa UODO (art. 402).
   ========================================================== */

const PKE_META = {
    tytul: 'Ustawa z dnia 12 lipca 2024 r. — Prawo komunikacji elektronicznej',
    dziennik: 'Dz.U. 2024 poz. 1221',
    organ: 'Prezes Urzędu Komunikacji Elektronicznej',
    roleObjete: ['isp'],
    wejscieWZycie: '2024-11-10',
    uwagaWejscie: 'Art. 450 PKE odsyła do ustawy z 12 lipca 2024 r. — Przepisy wprowadzające ustawę — Prawo komunikacji elektronicznej (Dz.U. 2024 poz. 1222). Zgodnie z jej art. 124 ustawa weszła w życie po upływie 3 miesięcy od dnia ogłoszenia; ogłoszenie nastąpiło 9 sierpnia 2024 r.',
    brakIncydentow: 'PKE nie nakłada obowiązku zgłaszania incydentów bezpieczeństwa sieci i usług. Terminy 24 h / 72 h / miesiąc wynikają wyłącznie z art. 11 ustawy o KSC. Nie należy ich przypisywać PKE.',
};

/* Przepisy przejściowe z ustawy wprowadzającej (Dz.U. 2024 poz. 1222). */
const PKE_PRZEJSCIOWE = [
    {
        art: 'art. 113 ustawy wprowadzającej',
        tytul: 'Ciągłość planów działań w sytuacjach szczególnych zagrożeń',
        tresc: 'Plany sporządzone, uzgodnione i wprowadzone do stosowania na podstawie art. 176a ust. 2 dawnego Prawa telekomunikacyjnego stały się z mocy prawa planami działań w sytuacji szczególnego zagrożenia w rozumieniu art. 39 ust. 2 PKE. Operator posiadający taki plan nie sporządza go od nowa, ale biegnie wobec niego trzyletni cykl ważności z art. 39 ust. 8.',
        skutekDlaOceny: 'Przy odpowiedzi na pytanie o termin 12 miesięcy z art. 39 ust. 4 należy sprawdzić, czy podmiot nie działa na planie przejętym z Prawa telekomunikacyjnego.',
    },
    {
        art: 'art. 114 ustawy wprowadzającej',
        tytul: 'Wskazanie przedsiębiorcy do wspólnej realizacji retencji',
        tresc: 'Operator publicznej sieci telekomunikacyjnej lub dostawca publicznie dostępnych usług telekomunikacyjnych miał wskazać Prezesowi UKE, w terminie 6 miesięcy od dnia wejścia w życie ustawy, przedsiębiorcę telekomunikacyjnego, wspólnie z którym będzie wykonywał obowiązek retencji z art. 47 ust. 1, albo któremu go powierzył.',
        terminUplynal: '2025-05-10',
    },
];

/* Kary pieniężne w PKE — art. 444-446. */
const PKE_KARY = {
    podmiot: {
        podstawa: 'art. 446 ust. 1 PKE',
        opis: 'Do 3 % przychodu ukaranego podmiotu osiągniętego w poprzednim roku kalendarzowym.',
        procent: 0.03,
        organ: 'Prezes UKE',
        rygor: 'Decyzji o nałożeniu kary nie nadaje się rygoru natychmiastowej wykonalności.',
    },
    malyPrzychod: {
        podstawa: 'art. 446 ust. 2 i 3 PKE',
        prog: 500000,
        opis: 'Przy braku przychodu lub przychodzie nie wyższym niż 500 000 zł w poprzednim roku podstawą jest średni przychód z 3 kolejnych lat poprzedzających rok nałożenia kary. Jeżeli i w tym okresie przychodu nie było lub nie przekroczył 500 000 zł — kara do 15 000 zł.',
        maks: 15000,
    },
    brakDanych: {
        podstawa: 'art. 446 ust. 8 PKE',
        opis: 'Brak danych do ustalenia podstawy wymiaru kary pozwala Prezesowi UKE ustalić ją szacunkowo, nie mniej niż 500 000 zł. Dane należy dostarczyć w terminie 30 dni od żądania.',
        minSzacunkowa: 500000,
        terminDni: 30,
    },
    kierujacy: {
        podstawa: 'art. 444 ust. 4 PKE',
        opis: 'Niezależnie od kary na przedsiębiorcę Prezes UKE może nałożyć na kierującego przedsiębiorstwem telekomunikacyjnym — w szczególności osobę pełniącą funkcję kierowniczą lub wchodzącą w skład organu zarządzającego — karę do 300 % jego MIESIĘCZNEGO wynagrodzenia, naliczanego jak dla celów ekwiwalentu za urlop wypoczynkowy.',
        procent: 3.0,
        podstawaWynagrodzenia: 'miesięczne',
        ostrzezenie: 'To kara ODRĘBNA od kary dla kierownika podmiotu z art. 73a ust. 4 ustawy o KSC (do 300 % wynagrodzenia). Osoba zarządzająca ISP może odpowiadać równolegle na podstawie obu ustaw, przed dwoma różnymi organami.',
    },
    uodo: {
        podstawa: 'art. 445 PKE',
        opis: 'Za naruszenie art. 401 (środki ochrony danych), art. 402 ust. 1 i 4 (zgłoszenie naruszenia) oraz art. 405 ust. 1 (rejestr naruszeń) karę do 3 % przychodu nakłada Prezes UODO. Stosuje się odpowiednio art. 444 ust. 4 — czyli także karę do 300 % wynagrodzenia na kierującego.',
        organ: 'Prezes UODO',
    },
    dodatkowe: {
        podstawa: 'art. 444 ust. 3 PKE',
        opis: 'Karę można nałożyć także wtedy, gdy podmiot zaprzestał naruszenia lub naprawił szkodę, jeżeli przemawiają za tym czas trwania, zakres lub skutki naruszenia.',
    },
};

/* Środki nadzorcze najcięższego kalibru — do sekcji dla zarządu. */
const PKE_SANKCJE_NIEFINANSOWE = [
    {
        podstawa: 'art. 433 ust. 6 i 10 PKE',
        tytul: 'Zakaz świadczenia usług komunikacji elektronicznej',
        opis: 'Przy nieprawidłowościach powtarzających się lub o poważnym charakterze i niezastosowaniu się do decyzji — zakaz wykonywania działalności polegającej na świadczeniu usług komunikacji elektronicznej na okres od roku do 3 lat, cofnięcie pozwolenia radiowego, zmiana lub cofnięcie rezerwacji częstotliwości albo przydziału numeracji. Decyzja ma rygor natychmiastowej wykonalności i stanowi podstawę wykreślenia z rejestru PT.',
    },
    {
        podstawa: 'art. 434 ust. 2 i 6 PKE',
        tytul: 'Wstrzymanie działalności w trybie pilnym',
        opis: 'Przy bezpośrednim i poważnym zagrożeniu dla obronności, bezpieczeństwa państwa, bezpieczeństwa i porządku publicznego lub życia i zdrowia ludzi, albo przy zagrożeniu poważną szkodą majątkową lub poważnymi utrudnieniami w funkcjonowaniu sieci — decyzja nakazująca wstrzymanie wykonywania działalności, z rygorem natychmiastowej wykonalności, na okres do 3 miesięcy z możliwością przedłużenia o kolejne 3 miesiące.',
    },
];

/* ── OBOWIĄZKI PKE ─────────────────────────────────────────
   typ: 'binarne' (wykonane / w toku / niewykonane / nie dotyczy)
        'skala'    (skala dojrzałości 1-5)
   Pole "terminUstawowy" pojawia się w kalendarzu obowiązków. */
const PKE_SEKCJE = [
    {
        id: 'pke-rejestr',
        nazwa: 'Status regulacyjny i rejestr przedsiębiorców telekomunikacyjnych',
        podstawa: 'art. 1, 2, 5–20 PKE',
        opis: 'Działalność telekomunikacyjna jest działalnością regulowaną i podlega wpisowi do rejestru PT prowadzonego przez Prezesa UKE. Uwaga terminologiczna: PKE nie zna „rejestru przedsiębiorców komunikacji elektronicznej" — rejestr nazywa się rejestrem PT.',
        pytania: [
            { id: 'pke-1', typ: 'binarne', tekst: 'Czy podmiot wykonuje działalność telekomunikacyjną w rozumieniu art. 1 ust. 1 pkt 1 lit. a — dostarczanie publicznej sieci telekomunikacyjnej, świadczenie publicznie dostępnych usług telekomunikacyjnych lub usług powiązanych?', art: 'art. 1 ust. 1 pkt 1 lit. a, art. 2 pkt 40', pomoc: 'Odpowiedź „nie" oznacza, że cała warstwa PKE nie ma zastosowania. Sama kolokacja lub hosting bez własnej sieci publicznej nie stanowi działalności telekomunikacyjnej.' },
            { id: 'pke-2', typ: 'binarne', tekst: 'Czy podmiot posiada aktualny wpis do rejestru PT oraz zaświadczenie o wpisie?', art: 'art. 5 ust. 1, art. 11', sankcja: 'art. 444 ust. 1 pkt 1' },
            { id: 'pke-3', typ: 'binarne', tekst: 'Czy zakres faktycznie wykonywanej działalności — rodzaj sieci i usług oraz obszar — mieści się w zakresie objętym wnioskiem o wpis?', art: 'art. 6 ust. 1 pkt 5 i 8', sankcja: 'art. 444 ust. 1 pkt 1', pomoc: 'Karze podlega także działalność w zakresie NIEOBJĘTYM wnioskiem, nie tylko całkowity brak wpisu.' },
            { id: 'pke-4', typ: 'binarne', tekst: 'Czy w rejestrze PT figurują aktualne dane osoby wyznaczonej do kontaktu z Prezesem UKE — imię, nazwisko, adres do korespondencji, e-mail i telefon?', art: 'art. 6 ust. 1 pkt 4' },
            { id: 'pke-5', typ: 'skala', tekst: 'Czy istnieje udokumentowany proces gwarantujący złożenie wniosku o zmianę wpisu w rejestrze PT w ciągu 14 dni od zmiany danych?', art: 'art. 12 ust. 1', terminUstawowy: '14 dni od zmiany danych', sankcja: 'art. 444 ust. 1 pkt 2' },
            { id: 'pke-6', typ: 'binarne', tekst: 'Czy podmiot przekazał Prezesowi UKE dane roczne za poprzedni rok kalendarzowy w terminie do 31 marca?', art: 'art. 20 ust. 1 i 3', terminUstawowy: 'corocznie do 31 marca', pomoc: 'Niewypełnienie obowiązku za 2 kolejne lata skutkuje wykreśleniem z rejestru PT z urzędu (art. 13 ust. 1 pkt 5).' },
            { id: 'pke-7', typ: 'skala', tekst: 'Czy istnieje procedura obsługi żądań informacyjnych Prezesa UKE, z wyznaczonym właścicielem i kontrolą kompletności oraz prawdziwości odpowiedzi?', art: 'art. 19 ust. 1 i ust. 4 pkt 5', sankcja: 'art. 444 ust. 2 pkt 1', pomoc: 'Termin wskazany w żądaniu nie może być krótszy niż 7 dni. Karze podlega także udzielenie informacji niepełnych lub nieprawdziwych.' },
        ],
    },
    {
        id: 'pke-plan',
        nazwa: 'Plan działań w sytuacji szczególnego zagrożenia',
        podstawa: 'art. 39 PKE',
        opis: 'Podstawowy obowiązek bezpieczeństwa w PKE. Nie jest to system zarządzania bezpieczeństwem informacji — środki techniczne i organizacyjne są elementem planu, a nie samodzielnym obowiązkiem. PKE nie wymaga testowania planu ani jego audytu.',
        pytania: [
            { id: 'pke-10', typ: 'binarne', tekst: 'Czy podmiot ustalił, czy podlega obowiązkowi sporządzenia planu, czy jest z niego zwolniony na podstawie rozporządzenia wydanego na podstawie art. 39 ust. 11 pkt 7?', art: 'art. 39 ust. 2 i ust. 11 pkt 7', doWeryfikacji: 'Zwolnienia podmiotowe określa rozporządzenie, nie ustawa.' },
            { id: 'pke-11', typ: 'binarne', tekst: 'Czy podmiot posiada plan, który jest jednocześnie aktualny, uzgodniony z organami uzgadniającymi i wprowadzony do stosowania?', art: 'art. 39 ust. 2', sankcja: 'art. 444 ust. 1 pkt 4' },
            { id: 'pke-12', typ: 'binarne', tekst: 'Czy plan został sporządzony w terminie 12 miesięcy od dnia powstania obowiązku?', art: 'art. 39 ust. 4', terminUstawowy: '12 miesięcy od powstania obowiązku' },
            { id: 'pke-13', typ: 'binarne', tekst: 'Czy od wprowadzenia planu do stosowania albo od ostatniej aktualizacji okresowej upłynęło mniej niż 3 lata?', art: 'art. 39 ust. 8', terminUstawowy: 'ważność 3 lata' },
            { id: 'pke-14', typ: 'skala', tekst: 'Czy plan obejmuje współpracę z innymi przedsiębiorcami telekomunikacyjnymi, w tym zagranicznymi?', art: 'art. 39 ust. 2 pkt 1' },
            { id: 'pke-15', typ: 'skala', tekst: 'Czy plan obejmuje współpracę z podmiotami ratownictwa i pomocy ludności, podmiotami wykonującymi zadania na rzecz obronności i cyberbezpieczeństwa oraz właściwymi w sprawach zarządzania kryzysowego, wskazanymi przez organy uzgadniające?', art: 'art. 39 ust. 2 pkt 2' },
            { id: 'pke-16', typ: 'skala', tekst: 'Czy plan zawiera środki techniczne i organizacyjne zapewniające poufność, integralność, dostępność i autentyczność przetwarzanych danych oraz poziom bezpieczeństwa adekwatny do zidentyfikowanego ryzyka?', art: 'art. 39 ust. 2 pkt 3', mapowanieKSC: 'art. 8 ust. 1 pkt 2 ustawy o KSC', pomoc: 'To główny punkt styku z ustawą o KSC. Jeden zestaw środków powinien wystarczyć obu ustawom — nie trzeba wdrażać ich dwukrotnie.' },
            { id: 'pke-17', typ: 'binarne', tekst: 'Czy istnieje udokumentowana analiza ryzyka, do której odwołuje się dobór środków z art. 39 ust. 2 pkt 3 — z uwzględnieniem aktualnego stanu wiedzy technicznej i kosztów wprowadzenia?', art: 'art. 39 ust. 2 pkt 3', mapowanieKSC: 'art. 8 ust. 1 pkt 1 ustawy o KSC' },
            { id: 'pke-18', typ: 'skala', tekst: 'Czy plan określa procedury utrzymania ciągłości dostarczania sieci i świadczenia usług?', art: 'art. 39 ust. 2 pkt 4' },
            { id: 'pke-19', typ: 'skala', tekst: 'Czy plan określa procedury odtwarzania usług z pierwszeństwem dla abonentów będących podmiotami ratownictwa, obronności i zarządzania kryzysowego, a lista takich abonentów jest utrzymywana?', art: 'art. 39 ust. 2 pkt 5' },
            { id: 'pke-20', typ: 'skala', tekst: 'Czy plan zawiera techniczne i organizacyjne przygotowanie do wykonania decyzji ograniczających zakres lub obszar eksploatacji sieci, świadczenia usług i używania urządzeń radiowych?', art: 'art. 39 ust. 2 pkt 6, art. 40 ust. 1 pkt 3' },
            { id: 'pke-21', typ: 'skala', tekst: 'Czy podmiot prowadzi ewidencję rezerw sprzętowych na utrzymanie i odtworzenie usług oraz ma uzgodnioną współpracę z dostawcami sprzętu i usług serwisowo-naprawczych?', art: 'art. 39 ust. 2 pkt 8' },
            { id: 'pke-22', typ: 'binarne', tekst: 'Czy zdefiniowano wyzwalacze i właściciela procesu niezwłocznej aktualizacji planu przy okolicznościach wpływających na jego zawartość lub na wniosek organu uzgadniającego?', art: 'art. 39 ust. 9 pkt 2 i 3' },
            { id: 'pke-23', typ: 'binarne', tekst: 'Czy istnieje procedura uruchamiania działań z planu niezwłocznie po wystąpieniu sytuacji szczególnego zagrożenia, działająca w trybie całodobowym, ze ścieżką eskalacji?', art: 'art. 39 ust. 10', sankcja: 'art. 444 ust. 1 pkt 4' },
            { id: 'pke-24', typ: 'binarne', tekst: 'Czy podmiot należący do grupy kapitałowej rozstrzygnął, czy korzysta z planu wspólnego, i czy plan ten obejmuje wszystkie objęte spółki?', art: 'art. 39 ust. 3' },
            { id: 'pke-25', typ: 'binarne', tekst: 'Czy istnieje procedura nieodpłatnego udostępnienia urządzeń telekomunikacyjnych na żądanie, wraz z protokołem zwrotu i protokołem utraty lub zniszczenia?', art: 'art. 41 ust. 1, 5, 6 i 7' },
        ],
    },
    {
        id: 'pke-sluzby',
        nazwa: 'Obowiązki wobec uprawnionych podmiotów, retencja danych i punkt kontaktowy',
        podstawa: 'art. 43–54 PKE',
        opis: 'Blok obowiązków na rzecz obronności, bezpieczeństwa państwa i porządku publicznego. Nie ma odpowiednika w ustawie o KSC — pominięcie tej sekcji oznacza lukę w ocenie zgodności ISP.',
        pytania: [
            { id: 'pke-30', typ: 'binarne', tekst: 'Czy podmiot ustalił, czy podlega obowiązkowi zapewnienia warunków dostępu i utrwalania, czy korzysta z wyłączenia?', art: 'art. 43 ust. 1 i 2, art. 46 ust. 1 pkt 2', doWeryfikacji: 'Rodzaje przedsiębiorców zwolnionych określa rozporządzenie.' },
            { id: 'pke-31', typ: 'skala', tekst: 'Czy warunki dostępu i utrwalania są zapewnione dla wszystkich świadczonych publicznie dostępnych usług telekomunikacyjnych, na własny koszt, od dnia rozpoczęcia działalności lub uruchomienia nowej usługi?', art: 'art. 43 ust. 1 i 3', sankcja: 'art. 444 ust. 1 pkt 4' },
            { id: 'pke-32', typ: 'binarne', tekst: 'Czy podmiot jest zdolny wspólnie z uprawnionym podmiotem określić sposób realizacji warunków dostępu i utrwalania w terminie 24 godzin od zgłoszenia zapotrzebowania — z dostępnością osoby kontaktowej i kompetencji w trybie całodobowym?', art: 'art. 43 ust. 4', terminUstawowy: '24 godziny od zgłoszenia zapotrzebowania', pomoc: 'To jedyny termin 24-godzinny w PKE. Nie należy go mylić z terminem wczesnego ostrzeżenia z art. 11 ustawy o KSC.' },
            { id: 'pke-33', typ: 'binarne', tekst: 'Czy umowy z uprawnionymi podmiotami określają współudział w kosztach interfejsów oraz procedurę współpracy na wypadek awarii interfejsu?', art: 'art. 43 ust. 5 i 6' },
            { id: 'pke-34', typ: 'binarne', tekst: 'Czy dostęp uprawnionych podmiotów realizowany jest bez udziału pracowników przedsiębiorcy?', art: 'art. 43 ust. 8 i 9' },
            { id: 'pke-35', typ: 'binarne', tekst: 'Czy mikroprzedsiębiorca lub mały przedsiębiorca udokumentował proporcjonalny sposób realizacji obowiązku — z uwzględnieniem skali działalności, przychodów i możliwości technicznych?', art: 'art. 43 ust. 10', dotyczyWielkosci: ['mikro', 'maly'] },
            { id: 'pke-36', typ: 'binarne', tekst: 'Czy dane retencyjne są zatrzymywane i przechowywane na terytorium Rzeczypospolitej Polskiej przez 12 miesięcy od dnia połączenia lub nieudanej próby połączenia?', art: 'art. 47 ust. 1 pkt 1', terminUstawowy: 'retencja 12 miesięcy', sankcja: 'art. 444 ust. 1 pkt 4' },
            { id: 'pke-37', typ: 'binarne', tekst: 'Czy istnieje zweryfikowany mechanizm niszczenia danych retencyjnych z upływem 12 miesięcy, z wyłączeniem danych zabezpieczonych?', art: 'art. 47 ust. 1 pkt 1' },
            { id: 'pke-38', typ: 'skala', tekst: 'Czy zakres zatrzymywanych danych odpowiada art. 49 ust. 1 i obejmuje także nieudane próby połączeń?', art: 'art. 49 ust. 1, art. 47 ust. 2', doWeryfikacji: 'Szczegółowy wykaz danych określa rozporządzenie z art. 49 ust. 2.' },
            { id: 'pke-39', typ: 'binarne', tekst: 'Czy realizacja retencji odbywa się bez ujawniania treści komunikatu elektronicznego?', art: 'art. 47 ust. 3' },
            { id: 'pke-40', typ: 'skala', tekst: 'Czy dane retencyjne są chronione przed przypadkowym lub bezprawnym zniszczeniem, utratą, zmianą i nieuprawnionym dostępem, a dostęp mają wyłącznie upoważnieni pracownicy?', art: 'art. 47 ust. 1 pkt 3 i ust. 5' },
            { id: 'pke-41', typ: 'binarne', tekst: 'Czy istnieje udokumentowany plan przekazania danych retencyjnych na wypadek zaprzestania działalności lub upadłości — przejmującemu przedsiębiorcy albo Prezesowi UKE, w terminie do 90 dni?', art: 'art. 48 ust. 1–3', terminUstawowy: '90 dni od zaprzestania działalności lub ogłoszenia upadłości' },
            { id: 'pke-42', typ: 'binarne', tekst: 'Czy podmiot wskazał Prezesowi UKE jednostkę organizacyjną lub osobę z siedzibą albo miejscem zamieszkania na terytorium RP, uprawnioną do reprezentowania go w sprawach dostępu, utrwalania i retencji?', art: 'art. 51 ust. 1 pkt 1', sankcja: 'art. 444 ust. 1 pkt 4' },
            { id: 'pke-43', typ: 'binarne', tekst: 'Czy zmiany danych punktu kontaktowego lub umów o powierzeniu obowiązków są zgłaszane Prezesowi UKE niezwłocznie, nie później niż w terminie 14 dni?', art: 'art. 51 ust. 2', terminUstawowy: '14 dni od zmiany' },
            { id: 'pke-44', typ: 'binarne', tekst: 'Czy w razie powierzenia lub wspólnego wykonywania obowiązków zawarto umowę i zgłoszono to Prezesowi UKE — ze świadomością, że powierzenie nie zwalnia z indywidualnej odpowiedzialności?', art: 'art. 50 ust. 1, 2 i 4' },
            { id: 'pke-45', typ: 'binarne', tekst: 'Czy podmiot ma zdolność techniczną i organizacyjną do wykonania decyzji o blokowaniu połączeń lub komunikatów nie później niż w terminie 6 godzin od jej otrzymania — także w dni wolne i w porze nocnej?', art: 'art. 53', terminUstawowy: '6 godzin od otrzymania decyzji', sankcja: 'art. 444 ust. 1 pkt 5', pomoc: 'Najkrótszy termin operacyjny w całym PKE.' },
            { id: 'pke-46', typ: 'binarne', tekst: 'Czy istnieje procedura odbioru decyzji Prezesa UKE ogłaszanej ustnie, z rejestrem takich decyzji i oczekiwaniem doręczenia pisemnego w terminie 14 dni?', art: 'art. 40 ust. 4, art. 53' },
            { id: 'pke-47', typ: 'binarne', tekst: 'Czy podmiot przekazał Prezesowi UKE dane o infrastrukturze telekomunikacyjnej na potrzeby obronności do 31 marca, według stanu na 31 grudnia poprzedniego roku?', art: 'art. 54 ust. 1–3', terminUstawowy: 'corocznie do 31 marca (stan na 31 grudnia)', sankcja: 'art. 444 ust. 1 pkt 4' },
            { id: 'pke-48', typ: 'binarne', tekst: 'Czy udostępnianie danych o lokalizacji urządzenia końcowego następuje niezwłocznie po otrzymaniu żądania, bez względu na technologię usługi?', art: 'art. 45 ust. 2' },
        ],
    },
    {
        id: 'pke-dane',
        nazwa: 'Ochrona danych osobowych i tajemnica komunikacji elektronicznej',
        podstawa: 'art. 393, 399, 401–405 PKE',
        opis: 'Jedyny obowiązek zgłoszeniowy w PKE. Adresatem jest Prezes UODO, nie Prezes UKE i nie CSIRT. Termin zgłoszenia wynika z rozporządzenia (UE) nr 611/2013, do którego PKE odsyła — nie jest zapisany w samej ustawie.',
        pytania: [
            { id: 'pke-50', typ: 'skala', tekst: 'Czy wdrożono środki ochrony zapewniające dostęp wyłącznie osób z upoważnieniem administratora, ochronę danych przed zniszczeniem, utratą, zmianą i nieuprawnionym dostępem oraz politykę bezpieczeństwa przetwarzania danych osobowych?', art: 'art. 401 pkt 1–3', sankcja: 'art. 445 ust. 1 pkt 1 (Prezes UODO)' },
            { id: 'pke-51', typ: 'binarne', tekst: 'Czy istnieje procedura zgłaszania naruszenia danych osobowych Prezesowi UODO w terminie i na zasadach rozporządzenia (UE) nr 611/2013?', art: 'art. 402 ust. 1', sankcja: 'art. 445 ust. 1 pkt 2', pomoc: 'Termin nie wynika z PKE, lecz z art. 2 ust. 2 rozporządzenia 611/2013. Nie należy przypisywać go ustawie.' },
            { id: 'pke-52', typ: 'binarne', tekst: 'Czy zdefiniowano kryteria oceny, kiedy naruszenie może wywrzeć niekorzystny wpływ na prawa osoby fizycznej i uruchamia niezwłoczne zawiadomienie abonenta?', art: 'art. 402 ust. 4 i 6', sankcja: 'art. 445 ust. 1 pkt 3' },
            { id: 'pke-53', typ: 'binarne', tekst: 'Czy podmiot jest w stanie wykazać wdrożenie technologicznych środków ochrony zwalniających z zawiadamiania abonenta i niezwłocznie przekazać dokumentację Prezesowi UODO?', art: 'art. 402 ust. 7 i 8' },
            { id: 'pke-54', typ: 'binarne', tekst: 'Czy prowadzony jest rejestr naruszeń danych osobowych zawierający wszystkie sześć elementów wymaganych ustawą?', art: 'art. 405 ust. 1', sankcja: 'art. 445 ust. 1 pkt 4', pomoc: 'Wymagane elementy: opis charakteru naruszenia, zalecone środki łagodzące, podjęte działania, informacja o poinformowaniu abonenta, opis skutków, opis środków naprawczych.' },
            { id: 'pke-55', typ: 'skala', tekst: 'Czy istnieją mechanizmy zapewniające zachowanie tajemnicy komunikacji elektronicznej i uniemożliwiające przetwarzanie objętych nią danych bez podstawy prawnej?', art: 'art. 444 ust. 1 pkt 77 i 79' },
            { id: 'pke-56', typ: 'binarne', tekst: 'Czy włączanie się do trwających połączeń w celu usunięcia awarii lub utrzymania sieci jest sygnalizowane uczestnikom połączenia?', art: 'art. 393' },
            { id: 'pke-57', typ: 'binarne', tekst: 'Czy przechowywanie informacji na urządzeniach końcowych i dostęp do nich odbywa się zgodnie z art. 399?', art: 'art. 399', sankcja: 'art. 444 ust. 1 pkt 82' },
        ],
    },
    {
        id: 'pke-ciaglosc',
        nazwa: 'Ciągłość, jakość usług i numery alarmowe',
        podstawa: 'art. 171, 285, 312, 316, 336–339 PKE',
        opis: 'PKE nie zawiera obowiązku zasilania awaryjnego ani gwarancji dostępu do numeru 112 w czasie awarii — te kwestie w ustawie nie występują.',
        pytania: [
            { id: 'pke-60', typ: 'binarne', tekst: 'Czy umowy o dostępie telekomunikacyjnym określają sposoby wypełniania wymagań w zakresie integralności sieci, ciągłości świadczenia usług przy awarii lub w sytuacjach szczególnych zagrożeń, tajemnicy komunikacji oraz działań przy nadużyciach?', art: 'art. 171 ust. 1 pkt 4 lit. b–d i pkt 9' },
            { id: 'pke-61', typ: 'binarne', tekst: 'Czy informacje przedumowne i umowa określają zakres działań podejmowanych przy naruszeniu bezpieczeństwa sieci lub usług, zagrożeniu takim naruszeniem lub podatności?', art: 'art. 285 ust. 2 pkt 5, art. 293' },
            { id: 'pke-62', typ: 'binarne', tekst: 'Czy określono wysokość, zasady i termin wypłaty odszkodowania na wypadek braku odpowiedniej reakcji na naruszenie bezpieczeństwa, zagrożenie lub lukę?', art: 'art. 285 ust. 2 pkt 4' },
            { id: 'pke-63', typ: 'binarne', tekst: 'Czy operator udostępnia Prezesowi UKE informacje o lokalizacji zakończenia sieci przy połączeniach alarmowych — w czasie rzeczywistym dla sieci ruchomej, w trybie wsadowym dla stacjonarnej?', art: 'art. 337 ust. 1' },
            { id: 'pke-64', typ: 'binarne', tekst: 'Czy dostawca usługi komunikacji głosowej przekazuje aktualne dane abonenckie nie później niż w dniu następującym po dniu zmiany, a przy braku zmian — nie rzadziej niż raz w miesiącu?', art: 'art. 337 ust. 5' },
            { id: 'pke-65', typ: 'binarne', tekst: 'Czy operator ruchomej sieci blokuje skradzione lub zgubione urządzenia końcowe i przekazuje informacje innym operatorom w terminie 1 dnia roboczego?', art: 'art. 339 ust. 1 i 2', terminUstawowy: '1 dzień roboczy' },
            { id: 'pke-66', typ: 'binarne', tekst: 'Czy użytkownicy są informowani o ograniczeniach w kierowaniu połączeń do numerów alarmowych oraz o ograniczeniach dostępu do informacji o lokalizacji dzwoniącego?', art: 'art. 285 ust. 2 pkt 7' },
            { id: 'pke-67', typ: 'skala', tekst: 'Czy podmiot publikuje rzetelne i aktualne informacje o jakości usług oraz o prędkości transmisji zgodnie z zastosowaną metodą pomiaru?', art: 'art. 312, art. 316 ust. 1' },
        ],
    },
    {
        id: 'pke-nadzor',
        nazwa: 'Gotowość na kontrolę Prezesa UKE i ryzyko sankcyjne',
        podstawa: 'art. 421–439, 444–446 PKE',
        opis: 'Kontrolę i postępowanie pokontrolne wszczyna się z urzędu. Czynności kontrolne mogą być prowadzone zdalnie.',
        pytania: [
            { id: 'pke-70', typ: 'binarne', tekst: 'Czy podmiot jest przygotowany na kontrolę Prezesa UKE, w tym prowadzoną zdalnie, oraz na nieodpłatne udostępnienie sieci i urządzeń do badań?', art: 'art. 424 ust. 1 pkt 9 i ust. 4 pkt 4, art. 426', sankcja: 'art. 444 ust. 1 pkt 92' },
            { id: 'pke-71', typ: 'binarne', tekst: 'Czy wyznaczono osoby uprawnione do podpisania protokołu kontroli i reprezentowania podmiotu wobec kontrolerów UKE?', art: 'art. 427 ust. 4, art. 424 ust. 4' },
            { id: 'pke-72', typ: 'binarne', tekst: 'Czy istnieje procedura reakcji na zalecenia pokontrolne w terminie wskazanym przez Prezesa UKE, co do zasady nie krótszym niż 30 dni?', art: 'art. 433 ust. 1 pkt 2, ust. 2 i 3', terminUstawowy: 'nie krócej niż 30 dni' },
            { id: 'pke-73', typ: 'binarne', tekst: 'Czy zarząd został poinformowany, że powtarzające się lub poważne nieprawidłowości mogą skutkować zakazem świadczenia usług komunikacji elektronicznej na okres od roku do 3 lat i wykreśleniem z rejestru PT?', art: 'art. 433 ust. 6 i 10', dlaZarzadu: true },
            { id: 'pke-74', typ: 'binarne', tekst: 'Czy zarząd został poinformowany o możliwości wstrzymania działalności na okres do 3 miesięcy, z przedłużeniem o kolejne 3, przy bezpośrednim i poważnym zagrożeniu?', art: 'art. 434 ust. 2 i 6', dlaZarzadu: true },
            { id: 'pke-75', typ: 'binarne', tekst: 'Czy oszacowano maksymalną ekspozycję finansową jako 3 % przychodu za poprzedni rok kalendarzowy?', art: 'art. 446 ust. 1–3', dlaZarzadu: true },
            { id: 'pke-76', typ: 'binarne', tekst: 'Czy osoby pełniące funkcje kierownicze oraz członkowie organu zarządzającego wiedzą o osobistej karze do 300 % miesięcznego wynagrodzenia, nakładanej niezależnie od kary na przedsiębiorcę?', art: 'art. 444 ust. 4', dlaZarzadu: true, pomoc: 'Kara odrębna od kary z art. 73a ust. 4 ustawy o KSC. Osoba zarządzająca ISP może odpowiadać równolegle na podstawie obu ustaw, przed dwoma różnymi organami.' },
            { id: 'pke-77', typ: 'binarne', tekst: 'Czy podmiot jest zdolny dostarczyć Prezesowi UKE dane do ustalenia podstawy wymiaru kary w terminie 30 dni?', art: 'art. 446 ust. 8', terminUstawowy: '30 dni od żądania', pomoc: 'Brak danych pozwala ustalić podstawę szacunkowo, nie mniej niż 500 000 zł.' },
        ],
    },
    {
        id: 'pke-ksc',
        nazwa: 'Rozgraniczenie PKE i ustawy o KSC',
        podstawa: 'art. 40 ust. 1 pkt 2 lit. b, art. 111 ust. 1 pkt 11 PKE',
        opis: 'PKE nie zawiera przepisu o niestosowaniu wobec podmiotów objętych ustawą o KSC ani odwrotnie. Obowiązki biegną równolegle. Nie ma ryzyka podwójnego zgłaszania incydentów, bo PKE takiego obowiązku nie nakłada — jest natomiast ryzyko pominięcia obowiązków wyłącznie PKE.',
        pytania: [
            { id: 'pke-80', typ: 'binarne', tekst: 'Czy podmiot ustalił swój status na gruncie ustawy o KSC — podmiot kluczowy albo ważny — niezależnie od statusu w rejestrze PT?', art: 'art. 5 ustawy o KSC' },
            { id: 'pke-81', typ: 'binarne', tekst: 'Czy podmiot ma świadomość, że PKE nie zawiera obowiązku zgłaszania incydentów i że cała ścieżka incydentowa wynika z ustawy o KSC?', art: 'art. 11 ustawy o KSC', dlaZarzadu: true },
            { id: 'pke-82', typ: 'binarne', tekst: 'Czy środki techniczne i organizacyjne wdrożone na potrzeby ustawy o KSC zostały zmapowane na wymagania art. 39 ust. 2 pkt 3 PKE, tak aby jeden zestaw środków wystarczał obu ustawom?', art: 'art. 39 ust. 2 pkt 3 PKE, art. 8 ust. 1 pkt 2 ustawy o KSC' },
            { id: 'pke-83', typ: 'binarne', tekst: 'Czy podmiot utrzymuje listę abonentów będących operatorami usług kluczowych i operatorami infrastruktury krytycznej, którym przysługuje pierwszeństwo odtwarzania usług?', art: 'art. 40 ust. 1 pkt 2 lit. b i c' },
            { id: 'pke-84', typ: 'binarne', tekst: 'Czy podmiot posiadający rezerwację częstotliwości obejmującą co najmniej 30 % obszaru kraju realizuje wymagania bezpieczeństwa i integralności infrastruktury ustalone przez Prezesa UKE z uwzględnieniem wytycznych ENISA i opinii Kolegium do Spraw Cyberbezpieczeństwa?', art: 'art. 111 ust. 1 pkt 11', warunkowe: 'rezerwacja ≥ 30 % obszaru kraju' },
        ],
    },
];

/* Delegacje ustawowe, których treści nie ma w PKE — narzędzie musi je oznaczyć
   jako wymagające weryfikacji w akcie wykonawczym. */
const PKE_DO_WERYFIKACJI = [
    { art: 'art. 39 ust. 11 pkt 7', czego: 'rodzaje działalności i przedsiębiorców zwolnionych z obowiązku sporządzenia planu działań w sytuacji szczególnego zagrożenia' },
    { art: 'art. 46 ust. 1 pkt 2', czego: 'rodzaje przedsiębiorców zwolnionych z obowiązku zapewnienia warunków dostępu i utrwalania' },
    { art: 'art. 46 ust. 2', czego: 'wymagania techniczne dla interfejsów' },
    { art: 'art. 49 ust. 2', czego: 'szczegółowy wykaz danych retencyjnych oraz rodzaje przedsiębiorców zwolnionych z retencji' },
    { art: 'art. 54 ust. 6 pkt 2', czego: 'zwolnienia z przekazywania danych o infrastrukturze telekomunikacyjnej' },
    { art: 'art. 316 ust. 4', czego: 'wskaźniki i metody pomiaru jakości usług' },
];

function pkeDotyczy(role) {
    return (role || []).includes('isp');
}

    KRAJE.rejestruj('pl', {
        PKE_META,
        PKE_PRZEJSCIOWE,
        PKE_KARY,
        PKE_SANKCJE_NIEFINANSOWE,
        PKE_SEKCJE,
        PKE_DO_WERYFIKACJI,
        pkeDotyczy,
    });
})();
