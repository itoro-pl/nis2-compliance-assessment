/* ==========================================================
   Ładowarka: państwo i język.

   Narzędzie ma działać po dwukliku na index.html, czyli z file://,
   a tam moduły ES nie działają. Zostaje dynamiczne wstawianie tagów
   <script>, które z file:// działa poprawnie.

   Dwie osie:
     język    → locale/<jezyk>.js, nakładka regionalna, jeśli państwo
                ją ma (locale/de-AT.js), oraz treść rozporządzenia
                2024/2690 w tym języku
     państwo  → moduł prawa krajowego kraje/<kod>/, a gdy go nie ma —
                wspólny moduł unijny kraje/ue/ oparty na dyrektywie

   Wybór pochodzi z adresu (?panstwo=DE&jezyk=de), potem z zapisanej
   preferencji, na końcu z domyślnych: Polska po polsku — tak zachowuje
   się opublikowany adres bez parametrów.
   ========================================================== */

const KLUCZ_WYBORU = 'ocena_wybor';

function wstawSkrypt(src) {
    return new Promise((ok, blad) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => ok(src);
        s.onerror = () => blad(new Error('Nie udało się załadować: ' + src));
        document.head.appendChild(s);
    });
}

/* Wstawia skrypt, a przy braku pliku zwraca false zamiast rzucać —
   dla plików, których brak jest dopuszczalny (nakładka, tłumaczenie
   jeszcze nieprzygotowane). */
async function wstawSkryptOpcjonalny(src) {
    try { await wstawSkrypt(src); return true; } catch (e) { return false; }
}

function odczytajWybor() {
    const par = new URLSearchParams(location.search);
    let zapisany = {};
    try { zapisany = JSON.parse(localStorage.getItem(KLUCZ_WYBORU) || '{}'); } catch (e) {}

    const panstwo = (par.get('panstwo') || zapisany.panstwo || 'PL').toUpperCase();
    const p = PANSTWO_WG_KODU[panstwo] || PANSTWO_WG_KODU.PL;
    const jezyk = (par.get('jezyk') || zapisany.jezyk || p.jezyki[0]).toLowerCase();

    return {
        panstwo: p.kod,
        jezyk: JEZYK_WG_KODU[jezyk] ? jezyk : p.jezyki[0],
        zAdresu: par.has('panstwo') || par.has('jezyk'),
        zapisany: !!zapisany.panstwo,
    };
}

function zapiszWybor(panstwo, jezyk) {
    try { localStorage.setItem(KLUCZ_WYBORU, JSON.stringify({ panstwo, jezyk })); } catch (e) {}
}

async function zaladujJezyk(jezyk, panstwo) {
    const jest = await wstawSkryptOpcjonalny(`locale/${jezyk}.js`);
    if (!jest) {
        console.warn('Brak tłumaczenia interfejsu:', jezyk, '— używam polskiego');
        await wstawSkrypt('locale/pl.js');
        LOCALE.aktywuj('pl');
    } else {
        LOCALE.aktywuj(jezyk);
    }
    /* Nakładka regionalna: kilka procent kluczy z terminologią danego państwa. */
    const p = PANSTWO_WG_KODU[panstwo];
    const nakladka = p && p.nakladka && p.nakladka[jezyk];
    if (nakladka && jest) {
        const ok = await wstawSkryptOpcjonalny(`locale/${nakladka}.js`);
        if (ok) LOCALE.aktywuj(nakladka);
    }
    /* Treść rozporządzenia 2024/2690 — urzędowe tłumaczenie z EUR-Lex.
       Numeracja załącznika jest identyczna we wszystkich językach, więc
       brak wersji językowej można zastąpić polską bez zmiany struktury. */
    const tresc = await wstawSkryptOpcjonalny(`wspolne/reg2690/tresc/${jezyk.split('-')[0]}.js`);
    if (!tresc) {
        console.warn('Brak treści rozporządzenia w języku', jezyk, '— używam polskiej');
        await wstawSkrypt('wspolne/reg2690/tresc/pl.js');
    }
}

async function zaladujModulKraju(kod, jezyk) {
    await wstawSkrypt(`kraje/${kod}/manifest.js`);
    const opis = KRAJE.opisKraju(kod);
    if (!opis) throw new Error('Manifest kraju ' + kod + ' nie zarejestrował się');
    /* Napisy przed plikami danych: moduł wspólny woła napis() w chwili
       ładowania, bo pokazuje się w każdym języku interfejsu. */
    await zaladujNapisyKraju(kod, opis, jezyk);
    for (const nazwa of opis.pliki) {
        await wstawSkrypt(`kraje/${kod}/${nazwa}.js`);
    }
    KRAJE.aktywuj(kod);
    return opis;
}

/* Teksty interfejsu zależne od prawa krajowego — nazwy aktów, organów,
   rejestrów, waluta, terminy. W języku interfejsu, jeśli moduł go ma;
   inaczej w pierwszym języku modułu, bo moduł krajowy jest pisany
   w języku swojego państwa i tłumaczenie prawa nie powstaje samo. */
async function zaladujNapisyKraju(kod, opis, jezyk) {
    const baza = jezyk.split('-')[0];
    /* Manifest wymienia pliki napisy/ — próbujemy tylko tych, które są.
       Inaczej każde wejście na Polskę po angielsku kończyło się zapytaniem
       o nieistniejący kraje/pl/napisy/en.js i czerwonym 404 w konsoli. */
    const jest = j => !opis.napisy || opis.napisy.includes(j);
    const kandydaci = [baza].concat(opis.jezyki || []).filter((j, i, a) => a.indexOf(j) === i && jest(j));
    for (const j of kandydaci) {
        if (await wstawSkryptOpcjonalny(`kraje/${kod}/napisy/${j}.js`)) {
            const slownik = KRAJE.napisyKraju(kod, j);
            if (slownik) LOCALE.rejestruj(LOCALE.aktywny, slownik);
            /* Nakładka regionalna napisów kraju (napisy/de-AT.js) — te same
               różnice terminologiczne co w locale/de-AT.js. */
            if (j === baza && jezyk !== baza && jest(jezyk) && await wstawSkryptOpcjonalny(`kraje/${kod}/napisy/${jezyk}.js`)) {
                const nakladka = KRAJE.napisyKraju(kod, jezyk);
                if (nakladka) LOCALE.rejestruj(LOCALE.aktywny, nakladka);
            }
            return j;
        }
    }
    return null;
}

function domGotowy() {
    return document.readyState === 'loading'
        ? new Promise(ok => document.addEventListener('DOMContentLoaded', ok, { once: true }))
        : Promise.resolve();
}

/* Punkt wejścia wołany z index.html. */
async function uruchom() {
    const wybor = odczytajWybor();
    try {
        await zaladujJezyk(wybor.jezyk, wybor.panstwo);
        /* Skala (wielkości, poziomy dojrzałości, stany obowiązku) nazywa
           swoje pozycje przez napis(), więc dopiero po słowniku. */
        await wstawSkrypt('core/skala.js');
        await wstawSkrypt('wspolne/reg2690/struktura.js');
        const modul = modulDlaPanstwa(wybor.panstwo);
        await Promise.all([zaladujModulKraju(modul, LOCALE.aktywny), domGotowy()]);
        KRAJE.panstwo = wybor.panstwo;
        /* Kod aplikacji dopiero teraz: STATUS_OPIS, WARSTWY_OPIS i POLA_WYMAGANE
           wołają napis() w chwili ładowania, więc słownik i moduł kraju muszą
           być wcześniej. Ta sama kolejność co przed przebudową: dane, potem kod. */
        for (const f of ['core/klasyfikacja.js', 'core/stan.js', 'core/punktacja.js',
                         'eksport/xlsx.js', 'ui/kreator.js', 'ui/dashboard.js', 'ui/app.js']) {
            await wstawSkrypt(f);
        }
        if (wybor.zAdresu) zapiszWybor(wybor.panstwo, wybor.jezyk);
        przetlumaczDokument();
        pokazWybor(wybor);
        uruchomAplikacje();
    } catch (e) {
        console.error(e);
        const el = document.getElementById('tresc') || document.body;
        el.insertAdjacentHTML('afterbegin',
            '<div class="alert alert-danger m-3">' + String(e.message).replace(/[<>&"]/g, '') + '</div>');
    }
}

/* Przełączenie państwa albo języka: nowy adres i przeładowanie —
   najprostsza droga do czystego stanu modułów. */
function zmienWybor(panstwo, jezyk) {
    zapiszWybor(panstwo, jezyk);
    const par = new URLSearchParams(location.search);
    par.set('panstwo', panstwo);
    par.set('jezyk', jezyk);
    location.search = par.toString();
}
