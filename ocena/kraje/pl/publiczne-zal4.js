/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Załącznik nr 4 do ustawy o KSC — wymogi dla systemu
   zarządzania bezpieczeństwem informacji podmiotu WAŻNEGO
   będącego podmiotem publicznym.

   Podstawa: art. 8 ust. 3 ustawy o KSC w brzmieniu nadanym
   ustawą z 23.01.2026 r. (Dz.U. 2026 poz. 252) oraz załącznik
   nr 4 do tej ustawy.

   To ścieżka ROZŁĄCZNA z art. 8 ust. 1: podmiot ważny będący
   podmiotem publicznym „nie stosuje przepisu ust. 1”, tylko
   opracowuje i utrzymuje system spełniający wymogi załącznika
   nr 4. Katalog z załącznika jest znacznie węższy i bardziej
   konkretny niż art. 8 ust. 1 — to celowe złagodzenie.

   Część I (pkt 1–18) jest obowiązkowa, część II (pkt 1–9)
   fakultatywna, część III to przegląd, część IV dokumentowanie.
   ========================================================== */

const ZAL4_SEKCJE = [
    {
        id: 'zal4-obowiazkowe',
        nazwa: 'Załącznik nr 4 — wymogi obowiązkowe',
        warstwa: 'zal4',
        typPytan: 'skala',
        podstawa: 'art. 8 ust. 3 ustawy o KSC, załącznik nr 4 część I',
        opis: 'System zarządzania bezpieczeństwem informacji podmiotu ważnego będącego podmiotem publicznym obejmuje co najmniej te osiemnaście elementów. Katalog jest zamknięty i konkretny — nie odsyła do analizy ryzyka, tylko wprost wymienia środki.',
        pytania: [
            { id: 'z4-1', typ: 'skala', tekst: 'Czy prowadzicie inwentaryzację produktów ICT, usług ICT i procesów ICT służących do przetwarzania informacji?', art: 'załącznik nr 4 część I pkt 1', pomoc: 'Bez aktualnego spisu nie da się wykazać żadnego z pozostałych siedemnastu wymogów — to fundament całego systemu. Inwentarz obejmuje sprzęt, oprogramowanie, usługi zewnętrzne i procesy, w których informacja jest przetwarzana.' },
            { id: 'z4-2', typ: 'skala', tekst: 'Czy kontrolujecie podstawowe wersje używanych produktów i usług ICT, a tam gdzie to możliwe — także instalację oprogramowania na urządzeniach, w tym mobilnych?', art: 'załącznik nr 4 część I pkt 2', pomoc: 'Ustawa dopuszcza tu ograniczenie „jeżeli to możliwe” wyłącznie wobec mechanizmów kontroli instalacji. Kontrola wersji jest bezwarunkowa.' },
            { id: 'z4-3', typ: 'skala', tekst: 'Czy informacje są chronione przed kradzieżą, nieuprawnionym dostępem, uszkodzeniem i zakłóceniami — fizycznie, programowo albo, przy korzystaniu z chmury lub centrum danych, przez udokumentowanie mechanizmów ochrony u dostawcy?', art: 'załącznik nr 4 część I pkt 3', pomoc: 'Trzy warianty z lit. a–c są alternatywne i dobiera się je do sposobu przetwarzania. Przy usługach chmurowych albo kolokacji nie wystarczy zaufanie dostawcy — trzeba mieć udokumentowane, jak ochrona jest zapewniona.' },
            { id: 'z4-4', typ: 'skala', tekst: 'Czy do informacji dopuszczane są wyłącznie osoby z uprawnieniami do systemów informacyjnych i czy wdrożono środki uniemożliwiające nieautoryzowany dostęp?', art: 'załącznik nr 4 część I pkt 4', pomoc: 'Przepis obejmuje wprost systemy operacyjne, usługi sieciowe i aplikacje — nie tylko warstwę aplikacyjną.' },
            { id: 'z4-5', typ: 'skala', tekst: 'Czy stosujecie zasadę minimalnych uprawnień niezbędnych do realizacji zadań?', art: 'załącznik nr 4 część I pkt 5' },
            { id: 'z4-6', typ: 'skala', tekst: 'Czy uprawnienia są bezzwłocznie cofane po ustaniu podstawy dostępu i zawieszane, gdy pracownik nie wykonuje obowiązków przez co najmniej miesiąc?', art: 'załącznik nr 4 część I pkt 6', pomoc: 'Miesięczna nieobecność jest twardym progiem zapisanym w ustawie — dotyczy zwolnień lekarskich, urlopów bezpłatnych i macierzyńskich. Warto powiązać procedurę z kadrami, bo dział IT sam się o tym nie dowie.' },
            { id: 'z4-7', typ: 'skala', tekst: 'Czy zakres uprawnień jest modyfikowany przy zmianie charakteru zadań i zakresu dostępu do informacji?', art: 'załącznik nr 4 część I pkt 7', pomoc: 'Najczęstsza luka to awans albo przeniesienie: pracownik dostaje nowe uprawnienia, a stare zostają.' },
            { id: 'z4-8', typ: 'skala', tekst: 'Czy ustanowiono podstawowe zasady bezpiecznej pracy przy przetwarzaniu mobilnym i pracy zdalnej?', art: 'załącznik nr 4 część I pkt 8' },
            { id: 'z4-9', typ: 'skala', tekst: 'Czy poczta elektroniczna jest kontrolowana z wykorzystaniem mechanizmów uwierzytelniania poczty, o których mowa w art. 24 ust. 1 ustawy o zwalczaniu nadużyć w komunikacji elektronicznej?', art: 'załącznik nr 4 część I pkt 9', pomoc: 'Chodzi o SPF, DMARC i DKIM. To jedyny wymóg załącznika wskazujący konkretną technologię — jego spełnienie jest łatwo sprawdzalne z zewnątrz, także przez organ nadzoru.' },
            { id: 'z4-10', typ: 'skala', tekst: 'Czy wykonujecie kopie zapasowe odseparowane logicznie i fizycznie od danych przetwarzanych w systemach służących realizacji zadania publicznego?', art: 'załącznik nr 4 część I pkt 10', pomoc: 'Ustawa wymaga obu separacji naraz. Kopia na tym samym macierzowym wolumenie albo dostępna z tej samej domeny nie spełnia wymogu — to dokładnie ten scenariusz, w którym ransomware szyfruje również backup.' },
            { id: 'z4-11', typ: 'skala', tekst: 'Czy kopie zapasowe są testowane pod kątem kompletności i możliwości odtworzenia danych?', art: 'załącznik nr 4 część I pkt 11', pomoc: 'Sam fakt wykonywania kopii to pkt 10. Punkt 11 jest odrębnym obowiązkiem — niesprawdzona kopia nie liczy się jako spełnienie.' },
            { id: 'z4-12', typ: 'skala', tekst: 'Czy przygotowano i przetestowano procedurę postępowania na wypadek awarii lub incydentu?', art: 'załącznik nr 4 część I pkt 12', pomoc: 'Testowanie jest częścią wymogu, nie dobrą praktyką.' },
            { id: 'z4-13', typ: 'skala', tekst: 'Czy stosujecie oprogramowanie antywirusowe?', art: 'załącznik nr 4 część I pkt 13' },
            { id: 'z4-14', typ: 'skala', tekst: 'Czy zasady cyberhigieny stosują wszyscy pracownicy korzystający z systemów informacyjnych, w tym kierownik podmiotu?', art: 'załącznik nr 4 część I pkt 14', dlaZarzadu: true, pomoc: 'Ustawa wymienia kierownika podmiotu wprost. To ten sam kierownik, który odpowiada osobiście karą do 100 % wynagrodzenia z art. 73a ust. 5.' },
            { id: 'z4-15', typ: 'skala', tekst: 'Czy monitorujecie częstotliwość wydawania nowych wersji, źródła dystrybucji i cykl życia używanych produktów ICT?', art: 'załącznik nr 4 część I pkt 15', pomoc: 'Chodzi o wiedzę, kiedy produkt wyjdzie ze wsparcia — sprzęt sieciowy i systemy operacyjne po end-of-life przestają dostawać poprawki bezpieczeństwa.' },
            { id: 'z4-16', typ: 'skala', tekst: 'Czy stosujecie stabilne wersje produktów i usług ICT wolne od znanych krytycznych podatności?', art: 'załącznik nr 4 część I pkt 16', pomoc: 'Ustawa dopuszcza wyjątek: wersji z podatnością można używać, jeżeli nie stwarza ona istotnego negatywnego wpływu na poziom bezpieczeństwa. Ocenę trzeba jednak udokumentować.' },
            { id: 'z4-17', typ: 'skala', tekst: 'Czy szkolicie osoby zaangażowane w przetwarzanie informacji z rodzajów cyberzagrożeń, cyberhigieny, reagowania na incydent i skutków naruszenia zasad bezpieczeństwa?', art: 'załącznik nr 4 część I pkt 17', pomoc: 'Cztery zagadnienia z lit. a–d są wymienione w ustawie — program szkolenia powinien je pokrywać wprost, żeby dało się to wykazać.' },
            { id: 'z4-18', typ: 'skala', tekst: 'Czy określono procedury i zasady działania podmiotu na wypadek cyberzagrożenia lub incydentu?', art: 'załącznik nr 4 część I pkt 18', pomoc: 'Punkt 12 dotyczy procedury technicznej i jej testowania, punkt 18 — zasad działania całego podmiotu, w tym decyzji kierownictwa i komunikacji.' },
        ],
    },
    {
        id: 'zal4-fakultatywne',
        nazwa: 'Załącznik nr 4 — wymogi fakultatywne',
        warstwa: 'zal4',
        typPytan: 'binarne',
        podstawa: 'załącznik nr 4 część II',
        opis: 'Te dziewięć środków ustawa określa jako możliwe do dodatkowego zastosowania („może dodatkowo obejmować”). Ich brak nie jest naruszeniem, ale ich wdrożenie jest najprostszym sposobem podniesienia poziomu bezpieczeństwa i dobrze świadczy przy ocenie miarkującej karę z art. 76a.',
        pytania: [
            { id: 'z4f-1', typ: 'binarne', tekst: 'Czy stosujecie środki minimalizujące ryzyko błędów ludzkich?', art: 'załącznik nr 4 część II pkt 1' },
            { id: 'z4f-2', typ: 'binarne', tekst: 'Czy korzystacie z dedykowanej poczty elektronicznej dla podmiotu — na podstawie umowy albo w ramach wspólnego wykonywania obowiązków przez jednostkę wyznaczoną?', art: 'załącznik nr 4 część II pkt 2, art. 16e ust. 1', pomoc: 'Wspólna obsługa przez jednostkę wyznaczoną (np. urząd wojewódzki albo centrum usług wspólnych) jest przewidziana wprost w art. 16e i bywa dla małych jednostek jedynym realnym sposobem spełnienia wymogów.' },
            { id: 'z4f-3', typ: 'binarne', tekst: 'Czy zapewniono wysoką dostępność systemów informacyjnych — określony czas dostępu oraz zdolność działania mimo awarii lub incydentu?', art: 'załącznik nr 4 część II pkt 3' },
            { id: 'z4f-4', typ: 'binarne', tekst: 'Czy określono i kontrolujecie zasady korzystania z ogólnodostępnych usług chmurowych oraz z ogólnodostępnych dużych generatywnych modeli sztucznej inteligencji?', art: 'załącznik nr 4 część II pkt 4', pomoc: 'To jedyne miejsce w ustawie, które odnosi się wprost do generatywnej sztucznej inteligencji. Dotyczy sytuacji, w której pracownik wkleja treść dokumentu urzędowego do publicznie dostępnego modelu.' },
            { id: 'z4f-5', typ: 'binarne', tekst: 'Czy monitorujecie dostęp do informacji i stan działania systemów — własnym oprogramowaniem albo korzystając z usług dostawcy usług zarządzanych w zakresie cyberbezpieczeństwa?', art: 'załącznik nr 4 część II pkt 5' },
            { id: 'z4f-6', typ: 'binarne', tekst: 'Czy testujecie poziom bezpieczeństwa systemów informacyjnych oraz stosowanie zasad cyberhigieny przez pracowników?', art: 'załącznik nr 4 część II pkt 6' },
            { id: 'z4f-7', typ: 'binarne', tekst: 'Czy umowy serwisowe ze stronami trzecimi zawierają zapisy gwarantujące odpowiedni poziom bezpieczeństwa systemów informacyjnych?', art: 'załącznik nr 4 część II pkt 7' },
            { id: 'z4f-8', typ: 'binarne', tekst: 'Czy zapewniacie aktualność wykorzystywanych produktów i usług ICT?', art: 'załącznik nr 4 część II pkt 8' },
            { id: 'z4f-9', typ: 'binarne', tekst: 'Czy stosujecie dodatkowe środki techniczne i organizacyjne tam, gdzie jest to konieczne dla odpowiedniego poziomu bezpieczeństwa?', art: 'załącznik nr 4 część II pkt 9' },
        ],
    },
    {
        id: 'zal4-przeglad',
        nazwa: 'Załącznik nr 4 — przegląd i dokumentowanie',
        warstwa: 'zal4',
        typPytan: 'obowiazki',
        podstawa: 'załącznik nr 4 część III i IV',
        opis: 'Dwa obowiązki proceduralne domykające system. Przegląd ma twardą częstotliwość, a dokumentowanie jest jedynym dowodem wobec organu nadzoru.',
        pytania: [
            { id: 'z4p-1', typ: 'obowiazki', tekst: 'Czy przegląd systemu zarządzania bezpieczeństwem informacji odbywa się co najmniej raz w roku?', art: 'załącznik nr 4 część III pkt 1', termin: 'co najmniej raz w roku', pomoc: 'To jedyna twarda częstotliwość w całym załączniku. Podmiot ważny nie ma obowiązku audytu z art. 15 — przegląd roczny jest jego odpowiednikiem, tyle że wewnętrznym i bez wymogów wobec audytora.' },
            { id: 'z4p-2', typ: 'obowiazki', tekst: 'Czy przegląd jest przeprowadzany bezzwłocznie po wydaniu przez Pełnomocnika Rządu do Spraw Cyberbezpieczeństwa rekomendacji dotyczącej waszych systemów, produktów lub usług ICT?', art: 'załącznik nr 4 część III pkt 2', pomoc: 'Warunkiem reagowania jest wiedza o rekomendacji — warto mieć wyznaczoną osobę, która śledzi komunikaty Pełnomocnika Rządu.' },
            { id: 'z4p-3', typ: 'obowiazki', tekst: 'Czy przegląd jest przeprowadzany bezzwłocznie w razie okoliczności, które mogą wpłynąć na ryzyko wystąpienia incydentu poważnego?', art: 'załącznik nr 4 część III pkt 3' },
            { id: 'z4p-4', typ: 'obowiazki', tekst: 'Czy realizacja działań wskazanych w systemie zarządzania bezpieczeństwem informacji jest dokumentowana?', art: 'załącznik nr 4 część IV', pomoc: 'Wobec organu nadzoru liczy się to, co udokumentowane. Brak dokumentacji jest w praktyce nie do odróżnienia od braku działania.' },
        ],
    },
];

    KRAJE.rejestruj('pl', {
        ZAL4_SEKCJE,
    });
})();
