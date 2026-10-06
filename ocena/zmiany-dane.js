/* ==========================================================
   Lista zmian — treść w dwóch językach.

   Jedno źródło dla obu wersji: statyczny HTML strony zmiany.html
   generuje z tego pliku skrypty/zmiany.py (wersja polska, widoczna
   bez JavaScriptu), a skrypt na stronie przełącza na angielską.
   Dzięki temu żadna wersja nie zostaje w tyle.

   Kolejność wydań: od najnowszego. Data jako tekst w każdym języku —
   nazwy miesięcy odmieniają się inaczej, a to jeden napis na wydanie.
   ========================================================== */
const ZMIANY = {
    tytul: { pl: 'Lista zmian', en: 'Changelog' },
    powrot: { pl: '← Wróć do narzędzia', en: '← Back to the tool' },
    wprowadzenie: {
        pl: 'Ocena zgodności z dyrektywą NIS 2 i prawem krajowym państw członkowskich. '
            + 'Numeracja według wersjonowania semantycznego: zmiana pierwszej liczby oznacza przebudowę '
            + 'wymagającą uwagi, drugiej — nową funkcję albo nowe wymagania prawne, trzeciej — naprawę błędu. '
            + 'Zmiany wynikające z nowelizacji przepisów odnotowujemy z podstawą prawną.',
        en: 'Compliance assessment against the NIS 2 Directive and the national law of the Member States. '
            + 'Semantic versioning: a change in the first number means a rebuild that deserves attention, '
            + 'in the second — a new feature or new legal requirements, in the third — a bug fix. '
            + 'Changes stemming from amendments to legislation are recorded with their legal basis.',
    },
    stopka: {
        pl: 'Ocena zgodności z dyrektywą (UE) 2022/2555 (NIS 2), rozporządzeniem wykonawczym Komisji (UE) 2024/2690 '
            + 'oraz prawem krajowym państwa wybranego w narzędziu. Nie stanowi opinii prawnej.',
        en: 'Assessment against Directive (EU) 2022/2555 (NIS 2), Commission Implementing Regulation (EU) 2024/2690 '
            + 'and the national law of the country selected in the tool. It is not legal advice.',
    },
    aktualna: { pl: 'aktualna', en: 'current' },

    wydania: [
        {
            numer: '1.2.0',
            data: { pl: '6 października 2026', en: '6 October 2026' },
            aktualna: true,
            opis: { pl: 'Pierwsze wydanie publiczne.', en: 'First public release.' },
            pozycje: [
                {
                    tytul: { pl: 'Brama aktów krajowych', en: 'Gate over the national acts' },
                    tresc: {
                        pl: '— tests/akty_krajowe.py sprawdza dla wszystkich 27 państw, że akt wdrażający stoi na stronie '
                            + 'startowej, nad raportem i na kaflu strony wejściowej, że plik leży w katalogu swojego państwa '
                            + 'i ma wiersz w manifeście, oraz że nigdzie nie pojawia się akt innego państwa. Przy okazji '
                            + 'manifest dostał wiersze dla dwóch litewskich plików PDF złożonych z DOCX.',
                        en: '— tests/akty_krajowe.py checks, for all 27 countries, that the transposing act appears on the '
                            + 'start screen, above the report and on the entry-page tile, that its file sits in that '
                            + "country's directory and has a manifest row, and that no other country's act shows up "
                            + 'anywhere. The manifest also gained rows for two Lithuanian PDFs built from DOCX.',
                    },
                },
                {
                    tytul: { pl: 'Moduł krajowy nie zastępuje warstwy wspólnej', en: 'A national module does not replace the common layer' },
                    tresc: {
                        pl: '— rozporządzenie (UE) 2024/2690 stosuje się bezpośrednio we wszystkich państwach, więc polski '
                            + 'podmiot odpowiada na pytania z prawa krajowego i z warstwy wspólnej. Kafel Polski mówiący samo '
                            + '„prawo krajowe" czytał się tak, jakby jedno wykluczało drugie.',
                        en: '— Regulation (EU) 2024/2690 applies directly in every Member State, so a Polish entity answers '
                            + 'the questions of national law and of the common layer alike. The Polish tile saying only '
                            + '„national law" read as though one excluded the other.',
                    },
                },
                {
                    tytul: { pl: 'Kafel państwa nazywa jego ustawę', en: 'Each country tile names its own act' },
                    tresc: {
                        pl: '— na stronie wejściowej przy każdym państwie stoi akt wdrażający NIS 2 w brzmieniu '
                            + 'urzędowym. Wcześniej kafel mówił tylko, według czego biegnie ocena, przez co wyglądało to '
                            + 'tak, jakby znane nam było wyłącznie prawo polskie. Państwa, które jeszcze nie wdrożyły '
                            + 'dyrektywy, odróżniają się teraz od tych, których ustawę mamy i dołączamy.',
                        en: '— on the entry page every country now carries its NIS 2 transposing act in the official '
                            + 'wording. Previously the tile said only which layer the assessment runs on, which made it '
                            + 'look as though Polish law were the only one known to the tool. Countries that have not '
                            + 'transposed the Directive yet are now visibly different from those whose act we hold and ship.',
                    },
                },
                {
                    tytul: { pl: 'Raport poglądowy dla każdego państwa, w jego języku',
                             en: 'A sample report for every country, in its own language' },
                    tresc: {
                        pl: '— 28 gotowych plików PDF w katalogu przyklady/: po jednym dla każdego z 27 państw plus '
                            + 'polski raport po angielsku. Dane są w całości fikcyjne, więc widać, co dokładnie '
                            + 'niesie gotowy raport, bez wypełniania kwestionariusza.',
                        en: '— 28 ready-made PDF files in the przyklady/ directory: one for each of the 27 countries '
                            + 'plus the Polish report in English. The data are entirely fictional, so you can see what '
                            + 'the finished report carries without filling in a questionnaire.',
                    },
                },
                {
                    tytul: { pl: 'Opis wydania ze zrzutami i zakresem prawa państwo po państwie',
                             en: 'A release description with screenshots and the legal scope country by country' },
                    tresc: {
                        pl: '— README po polsku i po angielsku, z przebiegiem oceny krok po kroku i tabelą 27 państw: '
                            + 'akt wdrażający w brzmieniu urzędowym, liczba dołączonych tekstów, warstwa oceny '
                            + 'i odsyłacz do raportu poglądowego. Tabelę buduje skrypt z danych narzędzia, '
                            + 'a brama sprawdza, że żaden odsyłacz nie prowadzi donikąd.',
                        en: '— a README in Polish and English, with the assessment walked through step by step and '
                            + 'a table of all 27 countries: the transposing act in its official wording, the number of '
                            + 'texts included, the layer the assessment runs on and a link to the sample report. The table '
                            + 'is built by a script from the data the tool itself uses, and a gate checks that no link leads nowhere.',
                    },
                },
                {
                    tytul: { pl: 'Wydruk i raport bez polskich śladów poza Polską',
                             en: 'Printout and report free of Polish traces outside Poland' },
                    tresc: {
                        pl: '— stopka wydruku szła z arkusza stylów po polsku i powoływała się na ustawę o KSC '
                            + 'w każdym państwie; teraz jest w języku interfejsu. Nad raportem stoi akt wdrażający '
                            + 'wybranego państwa — wydruk pokazuje sam raport, a dokument dla zarządu musi nazywać '
                            + 'prawo, które wiąże podmiot. Poprawiony też kontrast plakietek przy pytaniach: '
                            + 'białe litery nazwy aktu zostawały na jasnym tle.',
                        en: '— the print footer came from the stylesheet in Polish and cited the Polish cybersecurity act '
                            + 'in every country; it now follows the interface language. The transposing act of the selected '
                            + 'country stands above the report — printing covers the report alone, and a document for the '
                            + 'board has to name the law that binds the entity. The contrast of the badges next to questions '
                            + 'was fixed as well: the white lettering of the act name was left on a light background.',
                    },
                },
                {
                    tytul: { pl: 'Teksty aktów wdrażających NIS 2 z 23 państw', en: 'Texts of the acts transposing NIS 2 from 23 countries' },
                    tresc: {
                        pl: '— 73 pliki wraz z manifestem, który dla każdego podaje adres źródłowy i sposób pozyskania. '
                            + 'Dla państw publikujących prawo wyłącznie jako aplikację przeglądarkową (Czechy, Estonia, Litwa, Łotwa, '
                            + 'Słowacja, Szwecja, Węgry, Belgia, Chorwacja, Włochy, Rumunia) plik jest wydrukiem urzędowego HTML, '
                            + 'a odsyłacz prowadzi do źródła urzędowego.',
                        en: '— 73 files together with a manifest giving, for each of them, the source address and how it was obtained. '
                            + 'For countries that publish law only as a browser application (Czechia, Estonia, Lithuania, Latvia, '
                            + 'Slovakia, Sweden, Hungary, Belgium, Croatia, Italy, Romania) the file is a printout of the official HTML, '
                            + 'and the link points to the official source.',
                    },
                },
                {
                    tytul: { pl: 'Każde państwo widzi swój akt wdrażający', en: 'Every country sees its own transposing act' },
                    tresc: {
                        pl: '— na liście podstaw prawnych stoi akt krajowy danego państwa, w brzmieniu urzędowym i z odsyłaczem do źródła, '
                            + 'wraz ze zdaniem mówiącym wprost, że jego wymogów moduł wspólny jeszcze nie ocenia. Polskie rejestry i polskie '
                            + 'pola identyfikacyjne znikają poza modułem krajowym.',
                        en: '— the legal-basis list names the national act of the selected country, in its official wording and with a link '
                            + 'to the source, together with a sentence stating plainly that the common module does not yet assess its '
                            + 'requirements. Polish registers and Polish identification fields disappear outside the national module.',
                    },
                },
                {
                    tytul: { pl: 'Strona wejściowa po angielsku, gdy języka nie da się przypisać do państwa', en: 'English landing page when the language cannot be tied to a country' },
                    tresc: {
                        pl: '— przeglądarka po angielsku bez regionu unijnego nie dostaje zgadywanego państwa: widzi listę 27 państw '
                            + 'i wybiera sama. Wersja statyczna (bez JavaScriptu, dla robotów wyszukiwarek) jest angielska.',
                        en: '— a browser set to English without an EU region is not given a guessed country: it sees the list of 27 countries '
                            + 'and picks one. The static version (no JavaScript, for search engine crawlers) is English.',
                    },
                },
                {
                    tytul: { pl: 'Czytelniejsze odesłania do przepisów', en: 'More legible references to provisions' },
                    tresc: {
                        pl: '— plakietki mają jednakową wysokość i stoją równo w kolumnie, a nazwa aktu jest tylko na etykiecie: '
                            + '„ustawa o KSC · art. 7c ust. 1” zamiast powtarzania nazwy w treści. Pełne odesłanie pozostaje w podpowiedzi.',
                        en: '— the badges share one height and line up in a column, and the name of the act appears only on the label: '
                            + '“NIS 2 · Article 21(2)(a)” instead of repeating the name in the text. The full reference stays in the tooltip.',
                    },
                },
                {
                    tytul: { pl: 'Dostępność i spójność wizualna', en: 'Accessibility and visual consistency' },
                    tresc: {
                        pl: '— zero naruszeń WCAG 2.1 AA w obu motywach (sprawdzane automatem przy każdej zmianie), cztery stopnie pisma '
                            + 'zamiast dziewiętnastu, kolory oceny osobno dobrane dla motywu jasnego i ciemnego.',
                        en: '— zero WCAG 2.1 AA violations in both themes (checked automatically on every change), four type sizes instead '
                            + 'of nineteen, and assessment colours chosen separately for the light and the dark theme.',
                    },
                },
                {
                    tytul: { pl: 'Licencja i paczka publiczna', en: 'Licence and public package' },
                    tresc: {
                        pl: '— kod na AGPL-3.0, treść merytoryczna na CC BY-SA 4.0; teksty aktów prawnych i biblioteki zewnętrzne poza '
                            + 'licencją repozytorium (plik NOTICE).',
                        en: '— code under AGPL-3.0, substantive content under CC BY-SA 4.0; texts of legal acts and third-party libraries '
                            + 'outside the repository licence (see NOTICE).',
                    },
                },
            ],
        },
        {
            numer: '1.1.0',
            data: { pl: '16 września 2026', en: '16 September 2026' },
            opis: { pl: 'Rozszerzenie na wszystkie państwa członkowskie Unii Europejskiej.', en: 'Extension to all Member States of the European Union.' },
            pozycje: [
                {
                    tytul: { pl: 'Wybór państwa i języka', en: 'Choice of country and language' },
                    tresc: {
                        pl: '— 27 państw członkowskich i 24 języki urzędowe UE, niezależnie od siebie; języki urzędowe wybranego państwa '
                            + 'na początku listy. Wybór zapamiętywany w przeglądarce i w adresie (<code>?panstwo=DE&amp;jezyk=de</code>).',
                        en: '— 27 Member States and 24 official EU languages, independently of each other; the official languages of the '
                            + 'selected country come first in the list. The choice is remembered in the browser and in the address '
                            + '(<code>?panstwo=DE&amp;jezyk=de</code>).',
                    },
                },
                {
                    tytul: { pl: 'Moduł wspólny dla państw bez modułu prawa krajowego', en: 'Common module for countries without a national-law module' },
                    tresc: {
                        pl: '— ocena według bezpośrednio stosowanego rozporządzenia (UE) 2024/2690 i obowiązków wynikających wprost '
                            + 'z dyrektywy (UE) 2022/2555: status podmiotu, pułapy kar z art. 34, terminy, obowiązki organu zarządzającego, '
                            + 'katalog środków z art. 21 ust. 2.',
                        en: '— assessment under the directly applicable Regulation (EU) 2024/2690 and the obligations arising straight from '
                            + 'Directive (EU) 2022/2555: entity status, the fine ceilings of Article 34, deadlines, the duties of the '
                            + 'management body, and the catalogue of measures in Article 21(2).',
                    },
                },
                {
                    tytul: { pl: 'Treść rozporządzenia 2024/2690 w języku interfejsu', en: 'Text of Regulation 2024/2690 in the interface language' },
                    tresc: {
                        pl: '— urzędowe wersje z EUR-Lex; odesłania do przepisów składane w konwencji danego języka '
                            + '(np. „Article 21(2)(c)”, „Artikel 21 Absatz 2 Buchstabe c”, „άρθρο 21 παράγραφος 2 στοιχείο γ)”).',
                        en: '— official versions from EUR-Lex; references composed in the convention of each language '
                            + '(e.g. “Article 21(2)(c)”, “Artikel 21 Absatz 2 Buchstabe c”, “άρθρο 21 παράγραφος 2 στοιχείο γ)”).',
                    },
                },
                {
                    tytul: { pl: 'Nakładki regionalne', en: 'Regional overlays' },
                    tresc: {
                        pl: '— terminologia austriacka (de-AT), belgijska (nl-BE, fr-BE), luksemburska (fr-LU), fińsko-szwedzka (sv-FI) '
                            + 'i cypryjska (el-CY) oraz formatowanie dat i liczb według państwa.',
                        en: '— Austrian (de-AT), Belgian (nl-BE, fr-BE), Luxembourgish (fr-LU), Finland-Swedish (sv-FI) and Cypriot (el-CY) '
                            + 'terminology, plus date and number formatting by country.',
                    },
                },
                {
                    tytul: { pl: 'Strona startowa w języku gościa', en: 'Landing page in the visitor’s language' },
                    tresc: {
                        pl: '— język i państwo dobierane z ustawień przeglądarki (np. de-AT → Austria, niemiecki), wybór państwa i języka '
                            + 'nad przyciskami, lista 27 państw; teksty w 24 językach.',
                        en: '— language and country taken from the browser settings (e.g. de-AT → Austria, German), the country and language '
                            + 'pickers above the buttons, a list of 27 countries; texts in 24 languages.',
                    },
                },
                {
                    tytul: { pl: 'Raport poglądowy dla każdego państwa', en: 'Sample report for every country' },
                    tresc: {
                        pl: '— fikcyjna spółka z nazwą, adresem i formą prawną w konwencji języka modułu (GmbH, s.r.o., S.r.l.…), '
                            + 'dostępny z <code>?panstwo=XX&amp;jezyk=yy&amp;przyklad=1</code>.',
                        en: '— a fictitious company whose name, address and legal form follow the convention of the module’s language '
                            + '(GmbH, s.r.o., S.r.l. …), available at <code>?panstwo=XX&amp;jezyk=yy&amp;przyklad=1</code>.',
                    },
                },
                {
                    tytul: { pl: 'Polska ocena bez zmian', en: 'The Polish assessment unchanged' },
                    tresc: {
                        pl: '— wynik, klasyfikacja i raport dla prawa polskiego są identyczne z wersją 1.0.2 '
                            + '(weryfikacja bajt w bajt przy każdej zmianie).',
                        en: '— the score, the classification and the report under Polish law are identical to version 1.0.2 '
                            + '(verified byte for byte on every change).',
                    },
                },
            ],
        },
        {
            numer: '1.0.2',
            data: { pl: '2 sierpnia 2026', en: '2 August 2026' },
            opis: { pl: 'Naprawa wyświetlania terminów, które już obowiązują.', en: 'Fix for the display of deadlines that have already passed.' },
            pozycje: [
                {
                    tytul: { pl: 'Terminy już obowiązujące w podsumowaniu dla zarządu', en: 'Deadlines already in force in the management summary' },
                    tresc: {
                        pl: '— przepis, którego data wejścia w życie minęła, nie jest już pokazywany jako „za −X dni”. '
                            + 'Lista „Najbliższe terminy ustawowe” pokazuje wyłącznie terminy jeszcze przed nami.',
                        en: '— a provision whose entry into force has passed is no longer shown as “in −X days”. '
                            + 'The list of upcoming statutory deadlines shows only those still ahead.',
                    },
                },
                {
                    tytul: { pl: 'Kalendarz ustawowy', en: 'Statutory calendar' },
                    tresc: {
                        pl: '— przepis w mocy oznaczany jest jako „obowiązuje” zamiast ujemnej liczby dni, spójnie z resztą raportu.',
                        en: '— a provision in force is marked “in force” instead of a negative number of days, consistently with the rest of the report.',
                    },
                },
            ],
        },
        {
            numer: '1.0.1',
            data: { pl: '22 lipca 2026', en: '22 July 2026' },
            opis: { pl: 'Rozbudowa o materiał urzędowy i porządki w obsłudze.', en: 'Official material added and the interface tidied up.' },
            pozycje: [
                { tytul: { pl: 'Najczęściej zadawane pytania', en: 'Frequently asked questions' },
                  tresc: { pl: '— stanowisko Ministerstwa Cyfryzacji przy właściwych obszarach oceny i na ekranie startowym.',
                           en: '— the position of the Polish Ministry of Digital Affairs, shown next to the relevant assessment areas and on the start screen.' } },
                { tytul: { pl: 'System S46 i wykaz podmiotów', en: 'The S46 system and the list of entities' },
                  tresc: { pl: '— kroki rejestracji, dane do wniosku i odsyłacze wprost do systemu. Narzędzie rozpoznaje, kto jest wpisywany z urzędu.',
                           en: '— registration steps, the data required for the application and links straight into the system. The tool recognises who is entered ex officio.' } },
                { tytul: { pl: 'Poprawiony kalkulator kar', en: 'Improved penalty calculator' },
                  tresc: { pl: '— obok pułapu widać wariant procentowy i limit kwotowy, a osobny opis tłumaczy, że pułap wyznacza ustawa, a kwotę w jego granicach ustala organ.',
                           en: '— next to the ceiling it shows the percentage variant and the fixed-amount limit, and a separate note explains that the ceiling is set by statute while the amount within it is set by the authority.' } },
                { tytul: { pl: 'Poprawiona nawigacja', en: 'Improved navigation' },
                  tresc: { pl: '— koniec ślepego zaułka na profilu, widoczne kolejne kroki, stała lista brakujących pól.',
                           en: '— no more dead end on the profile screen, the next steps are visible, and the list of missing fields is always on screen.' } },
                { tytul: { pl: 'Klikalne podstawy prawne', en: 'Clickable legal bases' },
                  tresc: { pl: '— każde odesłanie otwiera przepis na właściwej stronie dokumentu.',
                           en: '— every reference opens the provision on the right page of the document.' } },
                { tytul: { pl: 'Nowe terminy urzędowe', en: 'New official deadlines' },
                  tresc: { pl: '— uruchomienie wykazu, okno wpisów z urzędu, start samorejestracji i udostępnienie S46.',
                           en: '— the launch of the register, the window for ex officio entries, the start of self-registration and the opening of S46.' } },
                { tytul: { pl: 'Rozróżnienie obowiązywania i terminu', en: 'Being in force distinguished from a deadline' },
                  tresc: { pl: '— przepis już obowiązujący nie jest opisywany jako termin przekroczony.',
                           en: '— a provision already in force is no longer described as a missed deadline.' } },
                { tytul: { pl: 'Raport poglądowy', en: 'Sample report' },
                  tresc: { pl: '— gotowa ocena na danych fikcyjnej spółki, bez wypełniania kwestionariusza.',
                           en: '— a finished assessment on the data of a fictitious company, without filling in the questionnaire.' } },
                { tytul: { pl: 'Sumaryczny czas oceny', en: 'Total time of the assessment' },
                  tresc: { pl: '— przy wyborze modułów widać łączny czas wypełnienia.',
                           en: '— the module selection screen shows how long filling everything in will take.' } },
                { tytul: { pl: 'Przebudowany ekran startowy', en: 'Rebuilt start screen' },
                  tresc: { pl: '— treść w punktach zamiast bloków tekstu.', en: '— content in bullet points instead of blocks of text.' } },
                { tytul: { pl: 'Zadania kierownictwa jako lista', en: 'Management tasks as a list' },
                  tresc: { pl: '— zamiast dwóch kolorowych kolumn dwie listy jedna pod drugą: najpierw obowiązki niezbywalne, potem te do powierzenia zespołowi.',
                           en: '— instead of two coloured columns, two lists one below the other: first the duties that cannot be delegated, then those that can be handed to the team.' } },
                { tytul: { pl: 'Pełna szerokość treści', en: 'Full content width' },
                  tresc: { pl: '— lista zmian, treść pytań i ramki pomocy wykorzystują całą kolumnę.',
                           en: '— the changelog, the text of the questions and the help boxes use the whole column.' } },
                { tytul: { pl: 'Dostępność', en: 'Accessibility' },
                  tresc: { pl: '— etykiety pól, obsługa klawiaturą, kontrast zgodny z WCAG AA w obu motywach.',
                           en: '— field labels, keyboard operation and WCAG AA contrast in both themes.' } },
                { tytul: { pl: 'Poprawiona nazwa narzędzia', en: 'Corrected name of the tool' },
                  tresc: { pl: '— ocenie podlega zgodność z ustawą o KSC, która wdraża dyrektywę NIS 2. Dyrektywa wiąże państwo członkowskie, '
                               + 'nie podmiot, więc „zgodność z NIS 2” byłaby zdaniem nieścisłym.',
                           en: '— what is assessed is compliance with the national act transposing the NIS 2 Directive. A directive binds the Member State, '
                               + 'not the entity, so “compliance with NIS 2” would be an imprecise phrase.' } },
                { tytul: { pl: 'Lista zmian w HTML', en: 'Changelog in HTML' },
                  tresc: { pl: '— zamiast pliku markdown, który gubił polskie znaki.',
                           en: '— instead of a markdown file, which lost Polish diacritics.' } },
            ],
        },
        {
            numer: '1.0.0',
            data: { pl: '21 lipca 2026', en: '21 July 2026' },
            pozycje: [
                { tytul: { pl: 'Uruchomienie narzędzia.', en: 'Launch of the tool.' }, tresc: { pl: '', en: '' } },
            ],
        },
    ],
};
