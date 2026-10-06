/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Moduły kwestionariusza

   Pełna ocena to blisko 350 pytań — zbyt dużo, żeby zaczynać od nich
   pracę. Narzędzie dzieli je na moduły, które podmiot wybiera sam,
   a raport zgodności jest dostępny od razu po wypełnieniu profilu,
   jeszcze przed odpowiedzią na jakiekolwiek pytanie.

   Kolejność na liście odpowiada priorytetowi: najpierw to, od czego
   zależy odpowiedzialność karna, potem system zarządzania, na końcu
   szczegółowe wymogi techniczne.
   ========================================================== */

/* ── PYTANIA KLUCZOWE ──────────────────────────────────────
   Zestaw do szybkiej oceny ryzyka. Dobrane tak, by każde pytanie było
   "nadrzędne" wobec swojej grupy: jeżeli podmiot nie ma polityki
   kontroli dostępu, nie będzie miał też przeglądów uprawnień ani
   zarządzania kontami uprzywilejowanymi. Negatywna odpowiedź na
   pytanie kluczowe pozwala z dużym prawdopodobieństwem założyć brak
   przygotowania w całym obszarze.

   Lista jest utrzymywana tutaj, a nie znacznikami w plikach danych,
   żeby dało się ją przejrzeć i uzasadnić w jednym miejscu. */
const PYTANIA_KLUCZOWE = [
    /* Załącznik nr 4 — ścieżka podmiotu ważnego będącego podmiotem
       publicznym. Wybrane wymogi, których brak przekreśla cały system:
       bez inwentarza nie da się wykazać niczego innego, a kopia zapasowa
       bez separacji i bez testu odtworzenia nie chroni przed ransomware. */
    'z4-1',      // inwentaryzacja produktów, usług i procesów ICT
    'z4-3',      // ochrona przetwarzanych informacji
    'z4-4',      // dostęp wyłącznie dla uprawnionych
    'z4-10',     // kopie zapasowe odseparowane logicznie i fizycznie
    'z4-12',     // przygotowana i przetestowana procedura incydentowa
    'z4-14',     // cyberhigiena, w tym kierownika podmiotu
    'z4-17',     // szkolenia osób przetwarzających informacje
    'z4p-1',     // przegląd systemu co najmniej raz w roku
    'z4p-4',     // dokumentowanie realizacji działań

    /* Obowiązki formalne — decydują o odpowiedzialności karnej. */
    'ob-7c-1',   // wpis do wykazu
    'ob-46-1',   // korzystanie z systemu z art. 46 ust. 1
    'ob-8d-1',   // zatwierdzenie SZBI przez kierownika
    'ob-8d-2',   // zaplanowane środki finansowe
    'ob-8e-1',   // coroczne szkolenie kierownika
    'ob-8f-1',   // weryfikacja niekaralności
    'ob-9-1',    // osoby do kontaktu
    'ob-14-1',   // struktury albo umowa z dostawcą
    'ob-10-1',   // dokumentacja normatywna
    'ob-11-1',   // zdolność do zgłoszenia w 24 h
    'ob-11-2',   // zdolność do zgłoszenia w 72 h
    'ob-11-7',   // kryteria kwalifikacji incydentu poważnego
    'ob-15-1',   // audyt
    'ob-67-3',   // dostawca wysokiego ryzyka

    /* System zarządzania bezpieczeństwem informacji — po jednym pytaniu
       nadrzędnym z każdego obszaru art. 8. */
    'a8-1-1',    // systematyczne szacowanie ryzyka
    'a8-2a-1',   // polityka bezpieczeństwa
    'a8-2b-3',   // testowanie systemów
    'a8-2c-1',   // strefy i kontrola dostępu fizycznego
    'a8-2e-1',   // rejestr dostawców
    'a8-2f-2',   // plany ciągłości działania
    'a8-2f-4',   // testowanie planów i odtwarzania
    'a8-2g-1',   // monitorowanie w trybie ciągłym
    'a8-2h-1',   // pomiar skuteczności środków
    'a8-2i-1',   // szkolenia personelu
    'a8-2k-1',   // polityka kryptograficzna
    'a8-2l-1',   // uwierzytelnianie wieloskładnikowe
    'a8-2m-1',   // wykaz aktywów
    'a8-2n-1',   // polityka kontroli dostępu
    'a8-3-2',    // skanowanie podatności
    'a8-4-1',    // procedura obsługi incydentów
    'a8-5b-1',   // aktualizacje oprogramowania

    /* Prawo komunikacji elektronicznej — obowiązki nieznane ustawie o KSC. */
    'pke-2',     // wpis do rejestru PT
    'pke-11',    // plan działań w sytuacji szczególnego zagrożenia
    'pke-16',    // środki techniczne i organizacyjne
    'pke-32',    // zdolność 24 h wobec uprawnionych podmiotów
    'pke-36',    // retencja 12 miesięcy
    'pke-42',    // punkt kontaktowy
    'pke-45',    // blokowanie połączeń w 6 godzin
    'pke-47',    // dane o infrastrukturze do 31 marca
];

/* Szacowany czas wypełnienia. Pytanie binarne to odczyt i jedno
   kliknięcie, pytanie w skali wymaga oceny stanu — stąd różnica.
   Wartości celowo ostrożne, bo zaniżony szacunek zniechęca bardziej
   niż zawyżony. */
const CZAS_NA_PYTANIE = { binarne: 35, skala: 55 };   // sekundy

function szacujCzas(sekcje, filtrPytan) {
    let sek = 0;
    sekcje.forEach(s => s.pytania.forEach(q => {
        if (filtrPytan && !filtrPytan(q)) return;
        sek += CZAS_NA_PYTANIE[typPytania(s, q)] || 40;
    }));
    const min = Math.round(sek / 60);
    if (min < 1) return 'poniżej minuty';
    if (min < 60) return `około ${min} min`;
    const h = Math.floor(min / 60), r = min % 60;
    return r ? `około ${h} godz. ${r} min` : `około ${h} godz.`;
}

const MODULY = [
    {
        id: 'mod-szybki',
        nazwa: 'Szybka ocena ryzyka',
        warstwa: 'ksc-ob',
        priorytet: 0,
        zalecany: true,
        domyslny: true,
        szybki: true,
        scalaj: true,
        dlaczego: 'Zestaw pytań nadrzędnych z wszystkich obszarów. Każde z nich rozstrzyga o całej grupie zagadnień — jeżeli brakuje polityki kontroli dostępu, nie będzie też przeglądów uprawnień. Pozwala oszacować skalę zaległości bez przechodzenia pełnego kwestionariusza.',
        sekcje: () => true,
        pytania: (q) => PYTANIA_KLUCZOWE.includes(q.id),
    },
    {
        id: 'mod-obowiazki',
        nazwa: 'Obowiązki formalne KSC',
        warstwa: 'ksc-ob',
        priorytet: 1,
        zalecany: true,
        domyslny: false,
        dlaczego: 'Od tych obowiązków zależy odpowiedzialność karna podmiotu i osobista kierownika. Są sprawdzalne z dokumentów, bez analizy technicznej — dlatego stanowią zalecany punkt wyjścia.',
        sekcje: (s) => s.warstwa === 'ksc-ob',
    },
    {
        id: 'mod-szbi',
        nazwa: 'System zarządzania bezpieczeństwem informacji',
        warstwa: 'ksc',
        priorytet: 2,
        zalecany: true,
        domyslny: false,
        dlaczego: 'Wymogi art. 8 ustawy o KSC — trzon systemu, którego brak lub niezgodność jest zagrożona karą z art. 73 ust. 1 pkt 3. Ocena w skali dojrzałości.',
        sekcje: (s) => s.warstwa === 'ksc',
    },
    {
        id: 'mod-pke',
        nazwa: 'Prawo komunikacji elektronicznej',
        warstwa: 'pke',
        priorytet: 3,
        zalecany: true,
        domyslny: false,
        dlaczego: 'Obowiązki, których ustawa o KSC w ogóle nie zna: plan działań w sytuacji szczególnego zagrożenia, retencja danych, warunki dostępu dla uprawnionych podmiotów, punkt kontaktowy. Pominięcie tego modułu zostawia lukę w ocenie operatora.',
        sekcje: (s) => s.warstwa === 'pke',
    },
    {
        id: 'mod-reg2690-org',
        nazwa: 'Rozporządzenie 2024/2690 — zarządzanie i procesy',
        warstwa: 'reg2690',
        priorytet: 4,
        zalecany: false,
        dlaczego: 'Sekcje 1–5 i 7–8 załącznika: polityki, zarządzanie ryzykiem, obsługa incydentów, ciągłość działania, łańcuch dostaw, ocena skuteczności, cyberhigiena. Stosowane bezpośrednio od 7 listopada 2024 r.',
        sekcje: (s) => s.warstwa === 'reg2690' && ['1', '2', '3', '4', '5', '7', '8'].includes(String(s.id).replace('reg-', '')),
    },
    {
        id: 'mod-reg2690-tech',
        nazwa: 'Rozporządzenie 2024/2690 — wymogi techniczne',
        warstwa: 'reg2690',
        priorytet: 5,
        zalecany: false,
        dlaczego: 'Sekcje 6 i 9–13 załącznika: nabywanie i rozwój systemów, kryptografia, bezpieczeństwo zasobów ludzkich, kontrola dostępu, zarządzanie aktywami, bezpieczeństwo fizyczne i środowiskowe. Najbardziej szczegółowa część oceny.',
        sekcje: (s) => s.warstwa === 'reg2690' && ['6', '9', '10', '11', '12', '13'].includes(String(s.id).replace('reg-', '')),
    },
    {
        id: 'mod-zal4',
        nazwa: 'Załącznik nr 4 — system bezpieczeństwa informacji',
        warstwa: 'zal4',
        priorytet: 2,
        zalecany: true,
        domyslny: false,
        dlaczego: 'Katalog obowiązujący podmiot ważny będący podmiotem publicznym zamiast art. 8 ust. 1: osiemnaście wymogów obowiązkowych, dziewięć fakultatywnych oraz coroczny przegląd. Katalog jest zamknięty, więc ocena przebiega szybciej niż w przypadku przedsiębiorców.',
        sekcje: (s) => s.warstwa === 'zal4',
    },
];

/* Moduły zaznaczone przy pierwszym otwarciu. Zaczynamy od jednego —
   tego, od którego zależy odpowiedzialność karna. Pozostałe użytkownik
   dokłada świadomie, widząc ich rozmiar i szacowany czas. */
function moduleDomyslne(klasyfikacja) {
    const d = moduleDostepne(klasyfikacja).filter(m => m.domyslny);
    return d.length ? d : moduleDostepne(klasyfikacja).slice(0, 1);
}

/* Moduły dostępne dla danej klasyfikacji — pomijamy te, których warstwa
   nie ma zastosowania do zadeklarowanych ról. */
function moduleDostepne(klasyfikacja) {
    const warstwy = klasyfikacja.zestawy || [];
    return MODULY.filter(m => {
        /* Obowiązki formalne (wpis do wykazu, zadania kierownika, zgłaszanie
           incydentów) wiążą także podmiot publiczny idący ścieżką
           załącznika nr 4 — art. 16d wymienia art. 7c, 8c–8f i 9–12b. */
        if (m.warstwa === 'ksc-ob') return warstwy.includes('ksc') || warstwy.includes('zal4');
        if (m.warstwa === 'ksc') return warstwy.includes('ksc');
        return warstwy.includes(m.warstwa);
    });
}

/* Przypisanie sekcji do modułu. */
function modulSekcji(sekcja) {
    return MODULY.find(m => m.sekcje(sekcja)) || null;
}

/* Statystyka modułu przy danym profilu: liczba sekcji, pytań i wypełnionych. */
function statystykaModulu(modul, wszystkieSekcje, odpowiedzi) {
    const sekcje = wszystkieSekcje.filter(modul.sekcje)
        .map(s => modul.pytania ? { ...s, pytania: s.pytania.filter(modul.pytania) } : s)
        .filter(s => s.pytania.length);
    let pytan = 0, wypelnionych = 0;
    sekcje.forEach(s => s.pytania.forEach(q => {
        pytan++;
        const a = normalizujOdpowiedz(odpowiedzi[q.id]);
        if (a && (Number.isFinite(a.poziom) || !!a.stan)) wypelnionych++;
    }));
    return { sekcji: sekcje.length, pytan, wypelnionych, sekcje, czas: szacujCzas(sekcje) };
}

    KRAJE.rejestruj('pl', {
        PYTANIA_KLUCZOWE,
        CZAS_NA_PYTANIE,
        szacujCzas,
        MODULY,
        moduleDomyslne,
        moduleDostepne,
        modulSekcji,
        statystykaModulu,
    });
})();
