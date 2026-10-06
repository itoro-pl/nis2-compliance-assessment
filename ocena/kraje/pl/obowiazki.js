/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

const KSC_OBOWIAZKI_SEKCJE = [
    {
        id: 'ob-wykaz',
        nazwa: 'Wykaz podmiotów kluczowych i ważnych',
        podstawa: 'art. 7–7f ustawy o KSC',
        opis: 'Wykaz prowadzony jest w systemie teleinformatycznym, o którym mowa w art. 46 ust. 1. Nazwa „S46" nie występuje w ustawie — wnioski składa się elektronicznie w aplikacji Wykaz KSC.',
        pytania: [
            { id: 'ob-7c-1', tekst: 'Czy podmiot złożył wniosek o wpis do wykazu w terminie 6 miesięcy od dnia spełnienia przesłanek uznania za podmiot kluczowy lub ważny?', art: 'art. 7c ust. 1', termin: '6 miesięcy od spełnienia przesłanek', sankcja: 'art. 73 ust. 1a pkt 1 (podmiot), art. 73a ust. 1 (kierownik)' },
            { id: 'ob-7c-2', tekst: 'Czy wniosek zawierał oświadczenie kierownika podmiotu składane pod rygorem odpowiedzialności karnej za składanie fałszywych oświadczeń?', art: 'art. 7c ust. 5', pomoc: 'Rygor z art. 233 § 6 Kodeksu karnego. Odpowiedzialność jest osobista i karna, nie administracyjna.' },
            { id: 'ob-7c-3', tekst: 'Czy we wniosku wskazano zakres publicznych adresów IP oraz domen internetowych wykorzystywanych w sposób ciągły?', art: 'art. 7 ust. 2', pomoc: 'Pozycja często pomijana, a wprost wymagana. Dla operatora sieci oznacza to wykaz całej wykorzystywanej adresacji publicznej.' },
            { id: 'ob-7c-4', tekst: 'Czy istnieje proces zapewniający złożenie wniosku o zmianę wpisu w terminie 14 dni od dnia zmiany danych?', art: 'art. 7c ust. 3', termin: '14 dni od zmiany danych', sankcja: 'art. 73a ust. 1' },
            { id: 'ob-7b-1', tekst: 'Czy w razie wpisu z urzędu podmiot uzupełnił brakujące dane w terminie 6 miesięcy od doręczenia wezwania?', art: 'art. 7b ust. 2', termin: '6 miesięcy od doręczenia wezwania', sankcja: 'art. 73 ust. 1 pkt 1', warunkowe: 'dotyczy podmiotów wpisanych z urzędu' },
            { id: 'ob-7f-1', tekst: 'Czy podmiot ma świadomość obowiązku złożenia wniosku o wykreślenie z wykazu, jeżeli przestanie spełniać przesłanki?', art: 'art. 7f ust. 3', sankcja: 'art. 73a ust. 1' },
        ],
    },
    {
        id: 'ob-system',
        nazwa: 'Korzystanie z systemu teleinformatycznego',
        podstawa: 'art. 9 ust. 1 pkt 4, art. 46 ustawy o KSC',
        opis: 'System z art. 46 ust. 1 służy do zgłaszania incydentów poważnych, wymiany informacji i przekazywania sprawozdań.',
        pytania: [
            { id: 'ob-46-1', tekst: 'Czy podmiot rozpoczął korzystanie z systemu teleinformatycznego, o którym mowa w art. 46 ust. 1, w terminie 12 miesięcy od spełnienia przesłanek?', art: 'art. 46 ust. 4, art. 9 ust. 1 pkt 4', termin: '12 miesięcy od spełnienia przesłanek', sankcja: 'art. 73 ust. 1 pkt 13' },
            { id: 'ob-46-2', tekst: 'Czy wyznaczono i zarejestrowano administratora konta podmiotu w systemie oraz zapewniono zastępstwo?', art: 'art. 7 ust. 2' },
            { id: 'ob-46-3', tekst: 'Czy systemy podmiotu zostały dostosowane do minimalnych wymagań technicznych ogłoszonych w Biuletynie Informacji Publicznej ministra?', art: 'art. 46 ust. 7', termin: '6 miesięcy od publikacji wymagań' },
        ],
    },
    {
        id: 'ob-kierownik',
        nazwa: 'Obowiązki kierownika podmiotu',
        podstawa: 'art. 8c–8f ustawy o KSC',
        opis: 'Obowiązki osobiste kierownika. Powierzenie ich innej osobie nie wyłącza odpowiedzialności (art. 8c ust. 3). Przy organie wieloosobowym bez wskazania osoby odpowiedzialnej odpowiadają wszyscy członkowie organu (art. 8c ust. 2).',
        pytania: [
            { id: 'ob-8d-1', tekst: 'Czy kierownik podmiotu formalnie zatwierdził system zarządzania bezpieczeństwem informacji i podejmuje decyzje dotyczące jego przeglądu i nadzoru?', art: 'art. 8d pkt 1', sankcja: 'art. 73a ust. 1', dlaZarzadu: true },
            { id: 'ob-8d-2', tekst: 'Czy w budżecie zaplanowano adekwatne środki finansowe na realizację obowiązków z zakresu cyberbezpieczeństwa?', art: 'art. 8d pkt 2', sankcja: 'art. 73a ust. 1', dlaZarzadu: true, pomoc: 'To samodzielny obowiązek ustawowy kierownika, nie kwestia praktyki zarządczej. Brak zaplanowanych środków jest naruszeniem.' },
            { id: 'ob-8d-3', tekst: 'Czy zadania z zakresu cyberbezpieczeństwa zostały formalnie przydzielone personelowi, a ich wykonanie podlega nadzorowi?', art: 'art. 8d pkt 3', sankcja: 'art. 73a ust. 1' },
            { id: 'ob-8d-4', tekst: 'Czy kierownik zapewnia, że personel jest świadomy swoich obowiązków z zakresu cyberbezpieczeństwa i zna wewnętrzne regulacje?', art: 'art. 8d pkt 4', sankcja: 'art. 73a ust. 1' },
            { id: 'ob-8e-1', tekst: 'Czy kierownik podmiotu odbył szkolenie z zakresu cyberbezpieczeństwa w bieżącym roku kalendarzowym?', art: 'art. 8e ust. 1', termin: 'raz w roku kalendarzowym', sankcja: 'art. 73a ust. 1', dlaZarzadu: true },
            { id: 'ob-8e-2', tekst: 'Czy szkolenie odbyła również osoba, której powierzono obowiązki kierownika w zakresie cyberbezpieczeństwa?', art: 'art. 8e ust. 1', termin: 'raz w roku kalendarzowym' },
            { id: 'ob-8e-3', tekst: 'Czy udział w szkoleniu jest udokumentowany, a zakres szkolenia obejmuje obowiązki wskazane w art. 8e ust. 2?', art: 'art. 8e ust. 2 i 3', pomoc: 'Sam fakt odbycia szkolenia nie wystarcza — ustawa wymaga udokumentowania oraz określonego zakresu tematycznego.' },
            { id: 'ob-8f-1', tekst: 'Czy przed dopuszczeniem do zadań z art. 8 lub art. 11 uzyskano od osób informację z Krajowego Rejestru Karnego o niekaralności za przestępstwa przeciwko ochronie informacji?', art: 'art. 8f ust. 1', sankcja: 'art. 73a ust. 1' },
            { id: 'ob-8f-2', tekst: 'Czy zapewniono, że osoba prawomocnie skazana za przestępstwo przeciwko ochronie informacji nie realizuje tych zadań?', art: 'art. 8f ust. 4' },
        ],
    },
    {
        id: 'ob-organizacja',
        nazwa: 'Osoby kontaktowe i struktury',
        podstawa: 'art. 9, art. 14 ustawy o KSC',
        opis: 'Wymagana liczba osób do kontaktu zależy od wielkości podmiotu.',
        pytania: [
            { id: 'ob-9-1', tekst: 'Czy wyznaczono wymaganą liczbę osób do kontaktu z podmiotami krajowego systemu cyberbezpieczeństwa i zgłoszono ich dane do wykazu?', art: 'art. 9 ust. 1 pkt 1 i ust. 2', sankcja: 'art. 73 ust. 1a pkt 2, art. 73a ust. 1', pomoc: 'Co najmniej dwie osoby; mikro- i mali przedsiębiorcy — co najmniej jedna (art. 9 ust. 2).' },
            { id: 'ob-9-2', tekst: 'Czy udostępniono odbiorcom usług wiedzę o cyberzagrożeniach i sposobach zabezpieczania się przed nimi?', art: 'art. 9 ust. 1 pkt 2', pomoc: 'Dopuszczalne jest odesłanie hiperłączem (art. 9 ust. 4).' },
            { id: 'ob-9-3', tekst: 'Czy zapewniono odbiorcom usług kanał zgłaszania cyberzagrożeń, incydentów i podatności?', art: 'art. 9 ust. 1 pkt 3', sankcja: 'art. 73a ust. 1' },
            { id: 'ob-14-1', tekst: 'Czy powołano wewnętrzne struktury odpowiedzialne za cyberbezpieczeństwo albo zawarto umowę z dostawcą usług zarządzanych w zakresie cyberbezpieczeństwa?', art: 'art. 14', sankcja: 'art. 73a ust. 1', pomoc: 'Ustawa dopuszcza oba rozwiązania. Wybór należy udokumentować.' },
        ],
    },
    {
        id: 'ob-dokumentacja',
        nazwa: 'Dokumentacja bezpieczeństwa',
        podstawa: 'art. 10 ustawy o KSC',
        opis: 'Dokumentacja normatywna i operacyjna, wraz z nadzorem nad nią i okresem przechowywania.',
        pytania: [
            { id: 'ob-10-1', tekst: 'Czy opracowano i wdrożono dokumentację normatywną systemu zarządzania bezpieczeństwem informacji?', art: 'art. 10 ust. 1', sankcja: 'art. 73 ust. 1 pkt 4, art. 73a ust. 1' },
            { id: 'ob-10-2', tekst: 'Czy prowadzona jest dokumentacja operacyjna, w tym automatyczne dzienniki systemów?', art: 'art. 10 ust. 1' },
            { id: 'ob-10-3', tekst: 'Czy wdrożono nadzór nad dokumentacją — wersjonowanie, zatwierdzanie, ochronę przed dostępem osób nieuprawnionych i przed nadpisaniem?', art: 'art. 10 ust. 6', sankcja: 'art. 73a ust. 1' },
            { id: 'ob-10-4', tekst: 'Czy dokumentacja jest przechowywana przez co najmniej 2 lata od dnia wycofania systemu z użytkowania, a jej brakowanie odbywa się protokolarnie?', art: 'art. 10 ust. 7 i 8', termin: 'przechowywanie co najmniej 2 lata', sankcja: 'art. 73a ust. 1' },
        ],
    },
    {
        id: 'ob-incydenty',
        nazwa: 'Zgłaszanie incydentów poważnych',
        podstawa: 'art. 11–12b ustawy o KSC',
        opis: 'Terminy biegną od momentu WYKRYCIA incydentu, nie od zakończenia analizy. Zgłoszenia przekazuje się przez system z art. 46 ust. 1 do właściwego CSIRT sektorowego, a w okresie przejściowym do CSIRT NASK, CSIRT GOV albo CSIRT MON.',
        pytania: [
            { id: 'ob-11-1', tekst: 'Czy podmiot ma zdolność organizacyjną do zgłoszenia wczesnego ostrzeżenia nie później niż w ciągu 24 godzin od wykrycia incydentu poważnego, także poza godzinami pracy?', art: 'art. 11 ust. 1 pkt 4', termin: '24 godziny od wykrycia', sankcja: 'art. 73 ust. 1 pkt 6, art. 73a ust. 1', dlaZarzadu: true },
            { id: 'ob-11-2', tekst: 'Czy podmiot ma zdolność do przekazania zgłoszenia incydentu poważnego nie później niż w ciągu 72 godzin od wykrycia, z pełnym zakresem informacji z art. 12 ust. 3?', art: 'art. 11 ust. 1 pkt 4a', termin: '72 godziny od wykrycia', sankcja: 'art. 73 ust. 1 pkt 7' },
            { id: 'ob-11-3', tekst: 'Czy przygotowano tryb przekazania sprawozdania okresowego na wniosek właściwego CSIRT?', art: 'art. 11 ust. 1 pkt 4b', sankcja: 'art. 73 ust. 1 pkt 8' },
            { id: 'ob-11-4', tekst: 'Czy przygotowano tryb przekazania sprawozdania końcowego w terminie miesiąca od zgłoszenia, zawierającego wszystkie elementy z art. 12a?', art: 'art. 11 ust. 1 pkt 4c, art. 12a', termin: '1 miesiąc od zgłoszenia', sankcja: 'art. 73 ust. 1 pkt 9', pomoc: 'Wymagane elementy: szczegółowy opis incydentu wraz z zakłóceniami i szkodami, rodzaj zagrożenia lub przyczyna źródłowa, zastosowane i wdrażane środki ograniczające ryzyko, skutki transgraniczne.' },
            { id: 'ob-11-5', tekst: 'Czy przewidziano sprawozdanie z postępu obsługi na wypadek, gdy obsługa incydentu nie zakończy się w terminie sprawozdania końcowego?', art: 'art. 12b ust. 1 i 2' },
            { id: 'ob-11-6', tekst: 'Czy ustalono, który CSIRT jest właściwy dla podmiotu, i czy dane kontaktowe są aktualne?', art: 'art. 26 ust. 5–7, art. 44 ustawy nowelizującej', pomoc: 'Do czasu komunikatu o osiągnięciu zdolności operacyjnej przez CSIRT sektorowy zgłoszenia kieruje się do CSIRT NASK, CSIRT GOV albo CSIRT MON.' },
            { id: 'ob-11-7', tekst: 'Czy zdefiniowano kryteria kwalifikacji zdarzenia jako incydentu poważnego i przypisano osobę uprawnioną do podjęcia decyzji o zgłoszeniu?', art: 'art. 2 pkt 7, art. 11 ust. 4', pomoc: 'Progi krajowe określi rozporządzenie Rady Ministrów. Podmioty objęte rozporządzeniem (UE) 2024/2690 stosują progi wynikające wprost z tego rozporządzenia.' },
            { id: 'ob-11-8', tekst: 'Czy przygotowano tryb informowania odbiorców usług o poważnym cyberzagrożeniu oraz o incydencie poważnym wpływającym na świadczone usługi?', art: 'art. 11 ust. 2a i 2b' },
            { id: 'ob-11-9', tekst: 'Czy zapewniono współdziałanie z właściwym CSIRT przy obsłudze incydentu poważnego?', art: 'art. 11 ust. 1 pkt 5', sankcja: 'art. 73 ust. 1 pkt 10' },
        ],
    },
    {
        id: 'ob-audyt',
        nazwa: 'Audyt bezpieczeństwa',
        podstawa: 'art. 15–16 ustawy o KSC',
        opis: 'Obowiązek dotyczy podmiotów kluczowych. Pierwszy audyt należy przeprowadzić w terminie 24 miesięcy od spełnienia przesłanek, a następnie co najmniej raz na 3 lata.',
        tylkoDlaStatusu: ['kluczowy'],
        pytania: [
            { id: 'ob-15-1', tekst: 'Czy przeprowadzono audyt bezpieczeństwa systemu informacyjnego wykorzystywanego do świadczenia usługi?', art: 'art. 15 ust. 1, art. 16 pkt 2', termin: 'pierwszy w ciągu 24 miesięcy, następnie co najmniej raz na 3 lata', sankcja: 'art. 73 ust. 1 pkt 11, art. 73a ust. 1', dlaZarzadu: true },
            { id: 'ob-15-2', tekst: 'Czy audyt przeprowadził podmiot uprawniony — akredytowana jednostka oceniająca zgodność, co najmniej dwóch audytorów spełniających wymogi ustawowe albo CSIRT sektorowy?', art: 'art. 15 ust. 2', pomoc: 'Audytorzy muszą mieć certyfikaty określone w rozporządzeniu albo co najmniej trzyletnią praktykę w audycie bezpieczeństwa systemów informacyjnych, albo dwuletnią praktykę i dyplom studiów podyplomowych w tym zakresie.' },
            { id: 'ob-15-3', tekst: 'Czy zachowano niezależność audytu — audytorem nie jest osoba realizująca w podmiocie zadania z art. 8 i art. 9–13 ani osoba, która realizowała je w ciągu roku przed rozpoczęciem audytu?', art: 'art. 15 ust. 2a', pomoc: 'Częsty błąd: audyt zlecany dostawcy, który wcześniej wdrażał u klienta te same zabezpieczenia.' },
            { id: 'ob-15-4', tekst: 'Czy kopię raportu z audytu przekazano organowi właściwemu w terminie 3 dni roboczych od jego otrzymania?', art: 'art. 15 ust. 1a', termin: '3 dni robocze od otrzymania raportu' },
            { id: 'ob-15-5', tekst: 'Czy zalecenia z audytu są realizowane i ich status jest śledzony?', art: 'art. 15' },
        ],
    },
    {
        id: 'ob-dostawca',
        nazwa: 'Dostawca wysokiego ryzyka',
        podstawa: 'art. 67b–67d ustawy o KSC',
        opis: 'Decyzja ministra właściwego do spraw informatyzacji jest natychmiast wykonalna i ogłaszana w Monitorze Polskim. Dla przedsiębiorców komunikacji elektronicznej o przychodach z działalności telekomunikacyjnej powyżej 10 mln zł obowiązuje krótszy termin wycofania dla funkcji krytycznych z załącznika nr 3.',
        pytania: [
            { id: 'ob-67-1', tekst: 'Czy podmiot monitoruje Monitor Polski i Biuletyn Informacji Publicznej pod kątem decyzji uznających dostawcę za dostawcę wysokiego ryzyka?', art: 'art. 67b ust. 17' },
            { id: 'ob-67-2', tekst: 'Czy sporządzono inwentaryzację produktów, usług i procesów ICT pod kątem możliwego objęcia taką decyzją, wraz z identyfikacją grupy kapitałowej dostawcy?', art: 'art. 67b ust. 15 i 16' },
            { id: 'ob-67-3', tekst: 'Czy zapewniono, że nie wprowadza się do użytkowania produktów objętych decyzją, i czy przygotowano plan ich wycofania w terminie ustawowym?', art: 'art. 67c ust. 1', sankcja: 'art. 73 ust. 1 pkt 18–22' },
            { id: 'ob-67-4', tekst: 'Czy zidentyfikowano elementy sieci realizujące funkcje krytyczne z załącznika nr 3 i objęto je skróconym, czteroletnim terminem wycofania?', art: 'art. 67c ust. 2', warunkowe: 'przedsiębiorca komunikacji elektronicznej o przychodach z działalności telekomunikacyjnej powyżej 10 mln zł', pomoc: 'Załącznik nr 3 obejmuje funkcje: AMF/AUSF, UDM, Radio Base Station Baseband Unit oraz Radio Units i anteny, UPF, SMF, PCF, NSSF, NRF, NEF, SEPP.' },
            { id: 'ob-67-5', tekst: 'Czy uwzględniono zakaz nabywania takich produktów w trybie Prawa zamówień publicznych?', art: 'art. 67c ust. 4 i 5' },
        ],
    },
    {
        id: 'ob-nadzor',
        nazwa: 'Gotowość na czynności nadzorcze',
        podstawa: 'art. 53, art. 59 ustawy o KSC',
        opis: 'Podmiot kluczowy podlega nadzorowi prewencyjnemu i następczemu, podmiot ważny wyłącznie następczemu (art. 53 ust. 3).',
        pytania: [
            { id: 'ob-53-1', tekst: 'Czy podmiot jest przygotowany na kontrolę organu właściwego, w tym doraźną i zdalną, oraz na przekazanie żądanych informacji i dowodów?', art: 'art. 53 ust. 2', sankcja: 'art. 73 ust. 1 pkt 14–16' },
            { id: 'ob-53-2', tekst: 'Czy przewidziano tryb przedstawienia stanowiska wobec wstępnych ustaleń organu w terminie 7 dni?', art: 'art. 53 ust. 13–16', termin: '7 dni' },
            { id: 'ob-59-1', tekst: 'Czy istnieje proces realizacji zaleceń pokontrolnych i śledzenia ich statusu?', art: 'art. 59 ust. 1', sankcja: 'art. 73 ust. 1 pkt 17' },
            { id: 'ob-53-3', tekst: 'Czy zarząd został poinformowany o możliwości zakazania kierownikowi pełnienia funkcji zarządczych do czasu usunięcia uchybień?', art: 'art. 53 ust. 9 pkt 6', dlaZarzadu: true, tylkoDlaStatusu: ['kluczowy'], pomoc: 'Środek stosowany wyłącznie wobec podmiotów kluczowych. Nie dotyczy podmiotów ważnych (art. 53 ust. 17).' },
        ],
    },
];

    KRAJE.rejestruj('pl', {
        KSC_OBOWIAZKI_SEKCJE,
    });
})();
