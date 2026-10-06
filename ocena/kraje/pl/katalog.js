/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

const KSC_ART8_SEKCJE = [
    {
        id: 'ksc-ryzyko',
        nazwa: 'Szacowanie ryzyka i zarządzanie ryzykiem',
        podstawa: 'art. 8 ust. 1 pkt 1',
        opis: 'Systematyczne szacowanie ryzyka wystąpienia incydentu oraz zarządzanie tym ryzykiem. Fundament całego systemu — od wyników tego procesu zależy dobór wszystkich pozostałych środków.',
        pytania: [
            { id: 'a8-1-1', tekst: 'Czy szacowanie ryzyka wystąpienia incydentu jest prowadzone systematycznie, według udokumentowanej metodyki?', art: 'art. 8 ust. 1 pkt 1', iso: 'ISO/IEC 27001 pkt 6.1, A.5.7', pomoc: 'Oceń, czy istnieje przyjęta metodyka, kryteria ryzyka i poziom akceptowalności, a nie jednorazowa analiza.' },
            { id: 'a8-1-2', tekst: 'Czy istnieje plan postępowania z ryzykiem z przypisanymi właścicielami, terminami i statusem realizacji?', art: 'art. 8 ust. 1 pkt 1', iso: 'ISO/IEC 27001 pkt 6.1.3', pomoc: 'Sprawdź, czy decyzje o postępowaniu z ryzykiem (akceptacja, ograniczenie, przeniesienie, unikanie) są udokumentowane wraz z uzasadnieniem ryzyka rezydualnego.' },
            { id: 'a8-1-3', tekst: 'Czy szacowanie ryzyka jest powtarzane cyklicznie oraz po istotnych zmianach w działalności i po poważnych incydentach?', art: 'art. 8 ust. 1 pkt 1', iso: 'ISO/IEC 27001 pkt 9.3' },
        ],
    },
    {
        id: 'ksc-polityki',
        nazwa: 'Polityki bezpieczeństwa',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. a',
        opis: 'Polityki szacowania ryzyka oraz bezpieczeństwa systemu informacyjnego, w tym polityki tematyczne.',
        pytania: [
            { id: 'a8-2a-1', tekst: 'Czy podmiot posiada zatwierdzoną politykę bezpieczeństwa systemu informacyjnego oraz politykę szacowania ryzyka?', art: 'art. 8 ust. 1 pkt 2 lit. a', iso: 'ISO/IEC 27001 A.5.1', pomoc: 'Zatwierdzenie należy do kierownika podmiotu — art. 8d pkt 1.' },
            { id: 'a8-2a-2', tekst: 'Czy opracowano polityki tematyczne dla poszczególnych obszarów bezpieczeństwa i czy są one spójne z polityką nadrzędną?', art: 'art. 8 ust. 1 pkt 2 lit. a', iso: 'ISO/IEC 27001 A.5.1' },
            { id: 'a8-2a-3', tekst: 'Czy polityki są przeglądane w zaplanowanych odstępach czasu i aktualizowane po istotnych zmianach?', art: 'art. 8 ust. 1 pkt 2 lit. a' },
        ],
    },
    {
        id: 'ksc-nabywanie',
        nazwa: 'Bezpieczeństwo w nabywaniu, rozwoju, utrzymaniu i eksploatacji',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. b',
        opis: 'Bezpieczeństwo w procesie nabywania, rozwoju, utrzymania i eksploatacji systemu informacyjnego, w tym testowanie systemu.',
        pytania: [
            { id: 'a8-2b-1', tekst: 'Czy wymagania bezpieczeństwa są definiowane i weryfikowane na etapie nabywania systemów, usług i sprzętu ICT?', art: 'art. 8 ust. 1 pkt 2 lit. b', iso: 'ISO/IEC 27001 A.5.20, A.8.30' },
            { id: 'a8-2b-2', tekst: 'Czy proces rozwoju i utrzymania systemów obejmuje bezpieczeństwo na każdym etapie, w tym zarządzanie zmianą i konfiguracją?', art: 'art. 8 ust. 1 pkt 2 lit. b', iso: 'ISO/IEC 27001 A.8.25, A.8.32' },
            { id: 'a8-2b-3', tekst: 'Czy systemy są testowane pod kątem bezpieczeństwa przed wdrożeniem oraz cyklicznie w trakcie eksploatacji?', art: 'art. 8 ust. 1 pkt 2 lit. b', iso: 'ISO/IEC 27001 A.8.29', pomoc: 'Testowanie jest wymagane wprost przez przepis — obejmuje testy bezpieczeństwa, w tym testy penetracyjne.' },
        ],
    },
    {
        id: 'ksc-fizyczne',
        nazwa: 'Bezpieczeństwo fizyczne i środowiskowe',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. c',
        opis: 'Bezpieczeństwo fizyczne i środowiskowe uwzględniające kontrolę dostępu. Dla operatorów datacenter obszar o podwyższonym znaczeniu — naruszenie dostępu fizycznego jest samodzielną przesłanką incydentu poważnego (art. 8 lit. d rozporządzenia 2024/2690).',
        pytania: [
            { id: 'a8-2c-1', tekst: 'Czy wyznaczono strefy bezpieczeństwa i wdrożono kontrolę dostępu fizycznego do pomieszczeń z infrastrukturą teleinformatyczną?', art: 'art. 8 ust. 1 pkt 2 lit. c', iso: 'ISO/IEC 27001 A.7.1–A.7.4' },
            { id: 'a8-2c-2', tekst: 'Czy pomieszczenia są chronione przed zagrożeniami środowiskowymi, a parametry środowiskowe są monitorowane z progami alarmowymi?', art: 'art. 8 ust. 1 pkt 2 lit. c', iso: 'ISO/IEC 27001 A.7.5, A.7.8' },
            { id: 'a8-2c-3', tekst: 'Czy zapewniono ciągłość usług pomocniczych — zasilania, chłodzenia, łączności — wraz z redundancją i testowaniem?', art: 'art. 8 ust. 1 pkt 2 lit. c', iso: 'ISO/IEC 27001 A.7.11' },
            { id: 'a8-2c-4', tekst: 'Czy dostęp fizyczny jest rejestrowany, a pomieszczenia monitorowane pod kątem nieuprawnionego wejścia?', art: 'art. 8 ust. 1 pkt 2 lit. c', iso: 'ISO/IEC 27001 A.7.2, A.7.4' },
        ],
    },
    {
        id: 'ksc-hr',
        nazwa: 'Bezpieczeństwo zasobów ludzkich',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. d',
        opis: 'Bezpieczeństwo zasobów ludzkich na wszystkich etapach zatrudnienia.',
        pytania: [
            { id: 'a8-2d-1', tekst: 'Czy obowiązki i odpowiedzialność w zakresie bezpieczeństwa są określone w umowach i zakresach zadań personelu?', art: 'art. 8 ust. 1 pkt 2 lit. d', iso: 'ISO/IEC 27001 A.6.2, A.6.6' },
            { id: 'a8-2d-2', tekst: 'Czy istnieje procedura postępowania przy zmianie lub zakończeniu zatrudnienia, obejmująca odebranie uprawnień i zwrot aktywów?', art: 'art. 8 ust. 1 pkt 2 lit. d', iso: 'ISO/IEC 27001 A.6.5, A.5.11' },
            { id: 'a8-2d-3', tekst: 'Czy określono postępowanie dyscyplinarne w przypadku naruszenia zasad bezpieczeństwa?', art: 'art. 8 ust. 1 pkt 2 lit. d', iso: 'ISO/IEC 27001 A.6.4' },
        ],
    },
    {
        id: 'ksc-dostawcy',
        nazwa: 'Bezpieczeństwo i ciągłość łańcucha dostaw',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. e oraz ust. 2',
        opis: 'Bezpieczeństwo i ciągłość łańcucha dostaw produktów, usług i procesów ICT, z uwzględnieniem relacji z bezpośrednim dostawcą sprzętu lub oprogramowania. Art. 8 ust. 2 wymaga dodatkowo uwzględnienia wyników postępowania w sprawie dostawcy wysokiego ryzyka.',
        pytania: [
            { id: 'a8-2e-1', tekst: 'Czy prowadzony jest rejestr bezpośrednich dostawców i usługodawców wraz z wykazem dostarczanych produktów, usług i procesów ICT?', art: 'art. 8 ust. 1 pkt 2 lit. e', iso: 'ISO/IEC 27001 A.5.19' },
            { id: 'a8-2e-2', tekst: 'Czy umowy z dostawcami zawierają wymagania bezpieczeństwa, obowiązek zgłaszania incydentów i prawo do audytu?', art: 'art. 8 ust. 1 pkt 2 lit. e', iso: 'ISO/IEC 27001 A.5.20' },
            { id: 'a8-2e-3', tekst: 'Czy przy ocenie dostawców uwzględnia się podatności związane z dostawcą, jakość jego produktów oraz wyniki skoordynowanej oceny ryzyka Grupy Współpracy?', art: 'art. 8 ust. 2 pkt 1–3', iso: 'ISO/IEC 27001 A.5.21' },
            { id: 'a8-2e-4', tekst: 'Czy podmiot weryfikuje, czy jego dostawcy nie zostali uznani za dostawcę wysokiego ryzyka, i czy ma plan wycofania takich produktów w terminie ustawowym?', art: 'art. 8 ust. 2 pkt 4, art. 67c', pomoc: 'Termin wycofania to 7 lat od ogłoszenia decyzji w Monitorze Polskim, a dla przedsiębiorców komunikacji elektronicznej o przychodach z działalności telekomunikacyjnej powyżej 10 mln zł — 4 lata dla funkcji krytycznych z załącznika nr 3.' },
            { id: 'a8-2e-5', tekst: 'Czy zidentyfikowano krytyczne zależności ICT i pojedyncze punkty awarii w łańcuchu dostaw oraz zaplanowano ich ograniczenie?', art: 'art. 8 ust. 1 pkt 2 lit. e' },
        ],
    },
    {
        id: 'ksc-ciaglosc',
        nazwa: 'Ciągłość działania i odtwarzanie',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. f',
        opis: 'Wdrażanie, dokumentowanie, testowanie i utrzymywanie planów ciągłości działania, planów awaryjnych oraz planów odtworzenia działalności.',
        pytania: [
            { id: 'a8-2f-1', tekst: 'Czy przeprowadzono analizę wpływu na działalność i na jej podstawie określono cele odtworzenia dla usług krytycznych?', art: 'art. 8 ust. 1 pkt 2 lit. f', iso: 'ISO/IEC 27001 A.5.29', pomoc: 'Chodzi o udokumentowane RTO i RPO wynikające z analizy, a nie o wartości przyjęte intuicyjnie.' },
            { id: 'a8-2f-2', tekst: 'Czy istnieją udokumentowane plany ciągłości działania, plany awaryjne i plany odtworzenia działalności?', art: 'art. 8 ust. 1 pkt 2 lit. f', iso: 'ISO/IEC 27001 A.5.29, A.5.30' },
            { id: 'a8-2f-3', tekst: 'Czy kopie zapasowe są wykonywane, chronione i przechowywane poza podstawową lokalizacją, a ich integralność jest weryfikowana?', art: 'art. 8 ust. 1 pkt 2 lit. f', iso: 'ISO/IEC 27001 A.8.13' },
            { id: 'a8-2f-4', tekst: 'Czy plany oraz odtwarzanie z kopii zapasowych są testowane cyklicznie, a wyniki testów dokumentowane i wykorzystywane do poprawy?', art: 'art. 8 ust. 1 pkt 2 lit. f', iso: 'ISO/IEC 27001 A.5.30', pomoc: 'Testowanie jest wymagane wprost przez przepis. Posiadanie nieprzetestowanego planu nie spełnia wymogu.' },
            { id: 'a8-2f-5', tekst: 'Czy wdrożono proces zarządzania kryzysowego z określonymi rolami, kanałami komunikacji i trybem kontaktu z organem oraz CSIRT?', art: 'art. 8 ust. 1 pkt 2 lit. f' },
        ],
    },
    {
        id: 'ksc-monitorowanie',
        nazwa: 'Monitorowanie w trybie ciągłym',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. g',
        opis: 'Objęcie systemu informacyjnego systemem monitorowania w trybie ciągłym. Przepis wymaga trybu ciągłego, a nie okresowych przeglądów.',
        pytania: [
            { id: 'a8-2g-1', tekst: 'Czy system informacyjny jest objęty monitorowaniem w trybie ciągłym, obejmującym ruch sieciowy, zdarzenia uwierzytelnienia i działania kont uprzywilejowanych?', art: 'art. 8 ust. 1 pkt 2 lit. g', iso: 'ISO/IEC 27001 A.8.16' },
            { id: 'a8-2g-2', tekst: 'Czy dzienniki zdarzeń są zbierane centralnie, chronione przed modyfikacją i przechowywane przez określony czas?', art: 'art. 8 ust. 1 pkt 2 lit. g', iso: 'ISO/IEC 27001 A.8.15' },
            { id: 'a8-2g-3', tekst: 'Czy zdefiniowano progi alarmowe, a alarmy uruchamiają w odpowiednim czasie kwalifikowaną reakcję?', art: 'art. 8 ust. 1 pkt 2 lit. g' },
            { id: 'a8-2g-4', tekst: 'Czy źródła czasu w systemach są zsynchronizowane, co umożliwia korelację dzienników między systemami?', art: 'art. 8 ust. 1 pkt 2 lit. g', iso: 'ISO/IEC 27001 A.8.17' },
        ],
    },
    {
        id: 'ksc-skutecznosc',
        nazwa: 'Ocena skuteczności środków',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. h',
        opis: 'Polityki i procedury oceny skuteczności środków technicznych i organizacyjnych.',
        pytania: [
            { id: 'a8-2h-1', tekst: 'Czy określono, które środki bezpieczeństwa podlegają pomiarowi, jakimi metodami, w jakich odstępach czasu i kto za to odpowiada?', art: 'art. 8 ust. 1 pkt 2 lit. h', iso: 'ISO/IEC 27001 pkt 9.1' },
            { id: 'a8-2h-2', tekst: 'Czy wyniki oceny skuteczności są raportowane kierownikowi podmiotu i przekładają się na decyzje o zmianach?', art: 'art. 8 ust. 1 pkt 2 lit. h, art. 8d pkt 1', iso: 'ISO/IEC 27001 pkt 9.3' },
            { id: 'a8-2h-3', tekst: 'Czy prowadzone są niezależne przeglądy bezpieczeństwa, w których przeglądający nie podlegają służbowo osobom z obszaru przeglądanego?', art: 'art. 8 ust. 1 pkt 2 lit. h', iso: 'ISO/IEC 27001 pkt 9.2' },
        ],
    },
    {
        id: 'ksc-edukacja',
        nazwa: 'Edukacja personelu i cyberhigiena',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. i oraz j',
        opis: 'Edukacja z zakresu cyberbezpieczeństwa dla personelu oraz podstawowe zasady cyberhigieny. Obowiązek szkoleniowy personelu jest ciągły — odrębny od corocznego szkolenia kierownika z art. 8e.',
        pytania: [
            { id: 'a8-2i-1', tekst: 'Czy cały personel przechodzi szkolenia z cyberbezpieczeństwa, a ich odbycie jest udokumentowane?', art: 'art. 8 ust. 1 pkt 2 lit. i', iso: 'ISO/IEC 27001 A.6.3' },
            { id: 'a8-2i-2', tekst: 'Czy szkolenia są zróżnicowane wg ról — osobno dla personelu IT i bezpieczeństwa, osobno dla osób z uprawnieniami uprzywilejowanymi?', art: 'art. 8 ust. 1 pkt 2 lit. i' },
            { id: 'a8-2j-1', tekst: 'Czy udokumentowano i egzekwuje się podstawowe zasady cyberhigieny obowiązujące wszystkich użytkowników?', art: 'art. 8 ust. 1 pkt 2 lit. j' },
            { id: 'a8-2j-2', tekst: 'Czy skuteczność edukacji jest mierzona, na przykład testami wiedzy albo ćwiczeniami z symulowanym phishingiem?', art: 'art. 8 ust. 1 pkt 2 lit. i' },
        ],
    },
    {
        id: 'ksc-krypto',
        nazwa: 'Kryptografia i szyfrowanie',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. k',
        opis: 'Polityki i procedury stosowania kryptografii, w tym w stosownych przypadkach szyfrowania.',
        pytania: [
            { id: 'a8-2k-1', tekst: 'Czy istnieje polityka kryptograficzna określająca dopuszczone algorytmy, długości kluczy i przypadki zastosowania?', art: 'art. 8 ust. 1 pkt 2 lit. k', iso: 'ISO/IEC 27001 A.8.24' },
            { id: 'a8-2k-2', tekst: 'Czy dane przechowywane i przesyłane są chronione kryptograficznie stosownie do klasyfikacji aktywów?', art: 'art. 8 ust. 1 pkt 2 lit. k' },
            { id: 'a8-2k-3', tekst: 'Czy wdrożono pełny cykl zarządzania kluczami — generowanie, dystrybucję, przechowywanie, rotację, wycofywanie i niszczenie?', art: 'art. 8 ust. 1 pkt 2 lit. k', iso: 'ISO/IEC 27001 A.8.24' },
            { id: 'a8-2k-4', tekst: 'Czy stosowane rozwiązania kryptograficzne są przeglądane pod kątem aktualnego stanu wiedzy, w tym gotowości na kryptografię postkwantową?', art: 'art. 8 ust. 1 pkt 2 lit. k' },
        ],
    },
    {
        id: 'ksc-komunikacja',
        nazwa: 'Bezpieczna komunikacja i uwierzytelnianie wieloskładnikowe',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. l',
        opis: 'Stosowanie bezpiecznych środków komunikacji elektronicznej w ramach krajowego systemu cyberbezpieczeństwa oraz wewnątrz podmiotu, z uwzględnieniem uwierzytelniania wieloskładnikowego.',
        pytania: [
            { id: 'a8-2l-1', tekst: 'Czy uwierzytelnianie wieloskładnikowe jest wymagane dla dostępu zdalnego, kont uprzywilejowanych i systemów krytycznych?', art: 'art. 8 ust. 1 pkt 2 lit. l', iso: 'ISO/IEC 27001 A.8.5' },
            { id: 'a8-2l-2', tekst: 'Czy stosowane metody uwierzytelniania są odporne na phishing tam, gdzie ryzyko to uzasadnia?', art: 'art. 8 ust. 1 pkt 2 lit. l' },
            { id: 'a8-2l-3', tekst: 'Czy komunikacja z podmiotami krajowego systemu cyberbezpieczeństwa oraz komunikacja wewnętrzna odbywa się bezpiecznymi kanałami?', art: 'art. 8 ust. 1 pkt 2 lit. l' },
            { id: 'a8-2l-4', tekst: 'Czy zapewniono zapasowy kanał łączności na wypadek niedostępności podstawowych systemów komunikacji?', art: 'art. 8 ust. 1 pkt 2 lit. l' },
        ],
    },
    {
        id: 'ksc-aktywa',
        nazwa: 'Zarządzanie aktywami',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. m',
        opis: 'Zarządzanie aktywami wykorzystywanymi w procesie świadczenia usługi.',
        pytania: [
            { id: 'a8-2m-1', tekst: 'Czy prowadzony jest aktualny wykaz aktywów z przypisanymi właścicielami?', art: 'art. 8 ust. 1 pkt 2 lit. m', iso: 'ISO/IEC 27001 A.5.9, A.5.10' },
            { id: 'a8-2m-2', tekst: 'Czy aktywa są sklasyfikowane, a zasady postępowania z nimi wynikają z tej klasyfikacji?', art: 'art. 8 ust. 1 pkt 2 lit. m', iso: 'ISO/IEC 27001 A.5.12, A.5.13' },
            { id: 'a8-2m-3', tekst: 'Czy uregulowano stosowanie nośników wymiennych oraz zwrot i usuwanie aktywów po zakończeniu zatrudnienia?', art: 'art. 8 ust. 1 pkt 2 lit. m', iso: 'ISO/IEC 27001 A.7.10, A.5.11' },
        ],
    },
    {
        id: 'ksc-dostep',
        nazwa: 'Kontrola dostępu',
        podstawa: 'art. 8 ust. 1 pkt 2 lit. n',
        opis: 'Polityki kontroli dostępu do systemu informacyjnego.',
        pytania: [
            { id: 'a8-2n-1', tekst: 'Czy istnieje polityka kontroli dostępu oparta na zasadach wiedzy koniecznej, najmniejszych uprawnień i podziału obowiązków?', art: 'art. 8 ust. 1 pkt 2 lit. n', iso: 'ISO/IEC 27001 A.5.15' },
            { id: 'a8-2n-2', tekst: 'Czy nadawanie, zmiana i odbieranie uprawnień przebiega według udokumentowanej procedury z autoryzacją i zapisem w dzienniku?', art: 'art. 8 ust. 1 pkt 2 lit. n', iso: 'ISO/IEC 27001 A.5.16, A.5.18' },
            { id: 'a8-2n-3', tekst: 'Czy uprawnienia są cyklicznie przeglądane, a wyniki przeglądu dokumentowane?', art: 'art. 8 ust. 1 pkt 2 lit. n', iso: 'ISO/IEC 27001 A.5.18' },
            { id: 'a8-2n-4', tekst: 'Czy konta uprzywilejowane i konta administracyjne podlegają odrębnym zasadom — osobne konta, silne uwierzytelnianie, ograniczone użycie?', art: 'art. 8 ust. 1 pkt 2 lit. n', iso: 'ISO/IEC 27001 A.8.2' },
            { id: 'a8-2n-5', tekst: 'Czy tożsamości są unikalne i powiązane z jedną osobą, a tożsamości współdzielone dopuszczone tylko wyjątkowo i udokumentowane?', art: 'art. 8 ust. 1 pkt 2 lit. n', iso: 'ISO/IEC 27001 A.5.16' },
        ],
    },
    {
        id: 'ksc-zagrozenia',
        nazwa: 'Zbieranie informacji o cyberzagrożeniach i podatnościach',
        podstawa: 'art. 8 ust. 1 pkt 3',
        opis: 'Zbieranie informacji o cyberzagrożeniach i podatnościach na incydenty systemu informacyjnego.',
        pytania: [
            { id: 'a8-3-1', tekst: 'Czy podmiot pozyskuje i analizuje informacje o cyberzagrożeniach ze źródeł zewnętrznych, w tym od właściwego CSIRT?', art: 'art. 8 ust. 1 pkt 3', iso: 'ISO/IEC 27001 A.5.7' },
            { id: 'a8-3-2', tekst: 'Czy prowadzone jest cykliczne skanowanie podatności obejmujące wszystkie istotne systemy?', art: 'art. 8 ust. 1 pkt 3', iso: 'ISO/IEC 27001 A.8.8' },
            { id: 'a8-3-3', tekst: 'Czy podatności są priorytetyzowane wg ryzyka i usuwane w określonych terminach, a ich status jest śledzony?', art: 'art. 8 ust. 1 pkt 3, art. 32 ust. 2', iso: 'ISO/IEC 27001 A.8.8' },
            { id: 'a8-3-4', tekst: 'Czy istnieje kanał przyjmowania zgłoszeń o podatnościach od podmiotów zewnętrznych i zasady skoordynowanego ujawniania?', art: 'art. 8 ust. 1 pkt 3, art. 9 ust. 1 pkt 3' },
        ],
    },
    {
        id: 'ksc-incydenty-zarz',
        nazwa: 'Zarządzanie incydentami',
        podstawa: 'art. 8 ust. 1 pkt 4',
        opis: 'Zarządzanie incydentami — proces wewnętrzny. Obowiązki zgłoszeniowe wobec CSIRT są oceniane osobno, w sekcji obowiązków formalnych.',
        pytania: [
            { id: 'a8-4-1', tekst: 'Czy istnieje udokumentowana procedura obsługi incydentów obejmująca wykrywanie, klasyfikację, ograniczanie, usuwanie i odtwarzanie?', art: 'art. 8 ust. 1 pkt 4', iso: 'ISO/IEC 27001 A.5.24–A.5.26' },
            { id: 'a8-4-2', tekst: 'Czy przypisano role i odpowiedzialność za obsługę incydentów oraz zapewniono ich dostępność poza godzinami pracy?', art: 'art. 8 ust. 1 pkt 4', iso: 'ISO/IEC 27001 A.5.24' },
            { id: 'a8-4-3', tekst: 'Czy prowadzony jest rejestr incydentów wraz z dowodami i osią czasu, w tym momentem wykrycia?', art: 'art. 8 ust. 1 pkt 4, art. 10', iso: 'ISO/IEC 27001 A.5.28', pomoc: 'Moment wykrycia rozpoczyna bieg terminów zgłoszeniowych z art. 11 — musi być odnotowany.' },
            { id: 'a8-4-4', tekst: 'Czy po incydentach przeprowadza się przeglądy, ustala przyczynę źródłową i wdraża wnioski?', art: 'art. 8 ust. 1 pkt 4', iso: 'ISO/IEC 27001 A.5.27' },
            { id: 'a8-4-5', tekst: 'Czy procedura obsługi incydentów jest testowana w zaplanowanych odstępach czasu?', art: 'art. 8 ust. 1 pkt 4' },
        ],
    },
    {
        id: 'ksc-zapobieganie',
        nazwa: 'Środki zapobiegające i ograniczające wpływ incydentów',
        podstawa: 'art. 8 ust. 1 pkt 5',
        opis: 'Środki zapobiegające incydentom i ograniczające ich wpływ — wyliczone w przepisie wprost.',
        pytania: [
            { id: 'a8-5a-1', tekst: 'Czy wdrożono mechanizmy zapewniające poufność, integralność, dostępność i autentyczność przetwarzanych danych?', art: 'art. 8 ust. 1 pkt 5 lit. a' },
            { id: 'a8-5b-1', tekst: 'Czy oprogramowanie jest regularnie aktualizowane zgodnie z zaleceniami producenta, z analizą wpływu aktualizacji i poziomu krytyczności?', art: 'art. 8 ust. 1 pkt 5 lit. b', iso: 'ISO/IEC 27001 A.8.8', pomoc: 'Przepis wymaga analizy wpływu aktualizacji, a nie tylko jej zainstalowania.' },
            { id: 'a8-5c-1', tekst: 'Czy wdrożono ochronę przed nieuprawnioną modyfikacją systemów, konfiguracji i danych?', art: 'art. 8 ust. 1 pkt 5 lit. c', iso: 'ISO/IEC 27001 A.8.9' },
            { id: 'a8-5d-1', tekst: 'Czy po dostrzeżeniu podatności lub cyberzagrożenia podejmowane są niezwłoczne działania ograniczające, w tym możliwość czasowego ograniczenia przychodzącego ruchu sieciowego?', art: 'art. 8 ust. 1 pkt 5 lit. d', pomoc: 'Przepis wymaga zdolności technicznej do czasowego ograniczenia ruchu przy jednoczesnej minimalizacji skutków dla dostępności usług.' },
            { id: 'a8-5d-2', tekst: 'Czy zastosowano segmentację sieci ograniczającą rozprzestrzenianie się incydentu?', art: 'art. 8 ust. 1 pkt 5 lit. d', iso: 'ISO/IEC 27001 A.8.22' },
            { id: 'a8-5d-3', tekst: 'Czy wdrożono ochronę przed szkodliwym oprogramowaniem na stacjach roboczych i serwerach?', art: 'art. 8 ust. 1 pkt 5 lit. d', iso: 'ISO/IEC 27001 A.8.7' },
        ],
    },
];

    KRAJE.rejestruj('pl', {
        KSC_ART8_SEKCJE,
    });
})();
