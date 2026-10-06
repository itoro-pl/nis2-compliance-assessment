/* ==========================================================
   Strona wejściowa narzędzi: język i państwo dobierane do gościa.

   Statyczny HTML jest angielską wersją bez wybranego państwa — to,
   co widzi robot wyszukiwarki, przeglądarka bez JavaScriptu i gość,
   któremu nie dotarł słownik. Skrypt po wczytaniu ustala język
   i państwo (adres → ostatni wybór w narzędziu → języki przeglądarki),
   dogrywa słownik landing/napisy/<język>.js i podmienia teksty
   w miejscu. Angielski bez regionu UE (Windows po angielsku w dowolnym
   kraju) nie wybiera państwa — gość wskazuje je sam, a wybór zostaje
   zapamiętany. Lista państw i języków pochodzi
   z narzędzia (ocena/core/panstwa.js), więc nie ma drugiej kopii.

   Teksty zależne od państwa: słownik może mieć gałąź kraj.<KOD>
   z kluczami nadpisującymi wersję ogólnounijną — dziś ma ją tylko
   polski słownik dla Polski (ustawa o KSC zamiast dyrektywy).
   ========================================================== */
const LANDING = (function () {
    const slowniki = {};
    const KLUCZ_WYBORU = 'ocena_wybor';      // ten sam co w ocena/core/ladowarka.js
    const JEZYK_ZAPASOWY = 'en';

    /* Państwo domyślne dla języka bez regionu w przeglądarce („de"
       zamiast „de-AT"). Języki jednego państwa wynikają z PANSTWA;
       tu rozstrzygnięcia dla języków wielu państw. Angielski celowo
       bez państwa: Irlandia byłaby zgadywaniem. */
    const PANSTWO_DLA_JEZYKA = { de: 'DE', en: null, fr: 'FR', nl: 'NL', el: 'GR', sv: 'SE' };

    let wybor = { jezyk: 'en', panstwo: null };

    function rejestruj(kod, slownik) { slowniki[kod] = slownik; }

    function panstwoDlaJezyka(jezyk) {
        if (jezyk in PANSTWO_DLA_JEZYKA) return PANSTWO_DLA_JEZYKA[jezyk];
        const p = PANSTWA.filter(x => x.jezyki.includes(jezyk));
        return p.length === 1 ? p[0].kod : null;
    }

    /* Kolejność źródeł: adres strony, ostatni wybór zapisany przez
       narzędzie, języki przeglądarki. Z przeglądarki bierzemy pierwszy
       język urzędowy UE; region („AT" w „de-AT") wskazuje państwo,
       jeśli jest państwem członkowskim i ma ten język. */
    function wykryj() {
        const par = new URLSearchParams(location.search);
        let zapisany = {};
        try { zapisany = JSON.parse(localStorage.getItem(KLUCZ_WYBORU) || '{}'); } catch (e) {}

        let jezyk = (par.get('jezyk') || zapisany.jezyk || '').toLowerCase().split('-')[0];
        let panstwo = (par.get('panstwo') || zapisany.panstwo || '').toUpperCase();
        if (!JEZYK_WG_KODU[jezyk]) jezyk = null;
        if (!PANSTWO_WG_KODU[panstwo]) panstwo = null;

        if (!jezyk) {
            const tagi = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
            for (const tag of tagi) {
                const [j, r] = String(tag).toLowerCase().split('-');
                if (!JEZYK_WG_KODU[j]) continue;
                jezyk = j;
                const region = (r || '').toUpperCase();
                if (!panstwo && PANSTWO_WG_KODU[region] && PANSTWO_WG_KODU[region].jezyki.includes(j)) panstwo = region;
                break;
            }
        }
        if (!jezyk) jezyk = JEZYK_ZAPASOWY;
        if (!panstwo) panstwo = panstwoDlaJezyka(jezyk);
        return { jezyk, panstwo, zAdresu: par.has('panstwo') || par.has('jezyk') };
    }

    function wstawSkrypt(src) {
        return new Promise((ok, blad) => {
            const s = document.createElement('script');
            s.src = src; s.onload = ok; s.onerror = () => blad(new Error(src));
            document.head.appendChild(s);
        });
    }

    async function zaladuj(jezyk) {
        if (slowniki[jezyk]) return jezyk;
        try { await wstawSkrypt('landing/napisy/' + jezyk + '.js'); } catch (e) {}
        if (slowniki[jezyk]) return jezyk;
        if (jezyk !== JEZYK_ZAPASOWY) return zaladuj(JEZYK_ZAPASOWY);
        return null;
    }

    /* Wartość klucza: wariant państwa, jeśli słownik go ma, inaczej ogólny. */
    function napis(klucz) {
        const s = slowniki[wybor.jezyk] || slowniki[JEZYK_ZAPASOWY] || {};
        const kraj = s.kraj && s.kraj[wybor.panstwo];
        if (kraj && kraj[klucz] !== undefined) return kraj[klucz];
        return s[klucz] !== undefined ? s[klucz] : klucz;
    }

    function wstaw(t, p) { return String(t).replace(/\{p(\d+)\}/g, (_, i) => p['p' + i] !== undefined ? p['p' + i] : ''); }

    function nazwaPanstwa(kod, jezyk) {
        if (!kod) return '';
        const n = typeof NAZWY_PANSTW !== 'undefined' && NAZWY_PANSTW[jezyk || wybor.jezyk];
        return (n && n[kod]) || PANSTWO_WG_KODU[kod].nazwaWlasna;
    }

    /* Bez państwa przyciski prowadzą do listy państw na tej stronie —
       narzędzie bez państwa nie ma czego oceniać. */
    function adresNarzedzia(dodatek) {
        if (!wybor.panstwo) return '#panstwa-tytul';
        return 'ocena/index.html?panstwo=' + wybor.panstwo + '&jezyk=' + wybor.jezyk + (dodatek || '');
    }

    function posortowanePanstwa() {
        const kol = new Intl.Collator(wybor.jezyk);
        return PANSTWA.slice().sort((a, b) => kol.compare(nazwaPanstwa(a.kod), nazwaPanstwa(b.kod)));
    }

    const STAN_KLASA = { 'gotowy': 'stan-gotowy', 'w-przygotowaniu': 'stan-wspolna', 'brak-ustawy': 'stan-brak' };
    const STAN_KLUCZ = { 'gotowy': 'gotowy', 'w-przygotowaniu': 'wspolna', 'brak-ustawy': 'brak' };

    function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

    /* Przepisanie tekstów: data-n = klucz (HTML), data-lista = klucz
       tablicy pozycji. Wersja i data z ocena/core/wersja.js. */
    function przetlumacz() {
        const lang = wybor.jezyk;
        document.documentElement.lang = lang;
        document.title = napis('tytul');
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.content = napis('opis');

        /* {p0} w tekście = nazwa państwa (tytuł karty „— Deutschland");
           bez państwa — wezwanie do wyboru. */
        const p = { p0: wybor.panstwo ? nazwaPanstwa(wybor.panstwo) : napis('brakPanstwa') };
        document.querySelectorAll('[data-n]').forEach(el => { el.innerHTML = wstaw(napis(el.dataset.n), p); });
        document.querySelectorAll('[data-n-attr]').forEach(el => {
            el.dataset.nAttr.split(',').forEach(para => {
                const [atr, klucz] = para.split(':');
                el.setAttribute(atr, napis(klucz));
            });
        });
        document.querySelectorAll('[data-lista]').forEach(el => {
            const poz = napis(el.dataset.lista);
            if (!Array.isArray(poz)) return;
            el.innerHTML = poz.map(p => typeof p === 'string'
                ? '<li>' + p + '</li>'
                : '<div class="fakt"><h3>' + p.h + '</h3><p>' + p.p + '</p></div>').join('');
        });
        document.querySelectorAll('[data-lista-plakietki]').forEach(el => {
            const poz = napis(el.dataset.listaPlakietki);
            if (!Array.isArray(poz)) return;
            el.innerHTML = poz.map(p => '<span class="plakietka ' + esc(p.k) + '">' + p.t + '</span>').join('');
        });

        const ver = document.getElementById('wersjaStrony');
        if (ver && typeof WERSJA !== 'undefined') {
            /* Angielski w wydaniu europejskim: „16 September 2026", nie „September 16". */
            const data = new Date(WERSJA.data).toLocaleDateString(lang === 'en' ? 'en-GB' : lang, { day: 'numeric', month: 'long', year: 'numeric' });
            ver.innerHTML = wstaw(napis('wersja'), { p0: WERSJA.numer, p1: data })
                + ' · <a href="ocena/zmiany.html">' + napis('zmiany') + '</a>';
        }

        odswiezWybor();
        odswiezSiatke();
        odswiezOdsylacze();
    }

    function odswiezWybor() {
        const sp = document.getElementById('wyborPanstwo');
        if (sp) {
            sp.innerHTML = (wybor.panstwo ? '' : '<option value="" selected>— ' + esc(napis('brakPanstwa')) + ' —</option>') + posortowanePanstwa().map(p =>
                '<option value="' + p.kod + '"' + (p.kod === wybor.panstwo ? ' selected' : '') + '>'
                + esc(nazwaPanstwa(p.kod)) + (nazwaPanstwa(p.kod) !== p.nazwaWlasna ? ' · ' + esc(p.nazwaWlasna) : '') + '</option>').join('');
        }
        const sj = document.getElementById('wyborJezyk');
        if (sj) {
            sj.innerHTML = JEZYKI.map(j =>
                '<option value="' + j.kod + '"' + (j.kod === wybor.jezyk ? ' selected' : '') + '>' + esc(j.nazwa) + '</option>').join('');
        }
        const stan = document.getElementById('wyborStan');
        if (stan) {
            const p = PANSTWO_WG_KODU[wybor.panstwo];
            stan.textContent = p ? napis('stan.' + STAN_KLUCZ[p.modul]) : napis('stan.wybierz');
            stan.className = 'wybor-stan ' + (p ? STAN_KLASA[p.modul] : 'stan-wybierz');
        }
    }

    function odswiezOdsylacze() {
        document.querySelectorAll('[data-narzedzie]').forEach(a => { a.href = adresNarzedzia(a.dataset.narzedzie); });
    }

    /* Rozporządzenie (UE) 2024/2690 stosuje się bezpośrednio we wszystkich
       państwach, więc moduł prawa krajowego nie zastępuje warstwy wspólnej,
       tylko ją uzupełnia. Kafel Polski mówiący samo „prawo krajowe" czytał
       się tak, jakby jedno wykluczało drugie. Składamy etykietę z dwóch
       napisów, które już są w słowniku — bez nowego klucza do tłumaczenia. */
    function etykietaWarstwy(modul) {
        return modul === 'gotowy'
            ? napis('etykieta.gotowy') + ' + ' + napis('etykieta.wspolna')
            : napis('etykieta.' + STAN_KLUCZ[modul]);
    }

    /* Siatka 27 kafli: nazwy w języku strony, odsyłacze z bieżącym
       językiem (zmiana państwa nie zmienia języka — prawnik czytający
       po polsku o Niemczech dostaje narzędzie po polsku). */
    function odswiezSiatke() {
        const siatka = document.querySelector('.panstwa-siatka');
        if (!siatka) return;
        siatka.innerHTML = posortowanePanstwa().map(p => {
            const klasa = STAN_KLASA[p.modul] + (p.kod === wybor.panstwo ? ' panstwo-wybrane' : '');
            return '<a class="panstwo-kafel ' + klasa + '" href="ocena/index.html?panstwo=' + p.kod + '&amp;jezyk=' + wybor.jezyk + '" data-panstwo="' + p.kod + '">'
                + '<span class="panstwo-kod" aria-hidden="true">' + p.kod + '</span>'
                + '<span class="panstwo-nazwy"><span class="panstwo-nazwa">' + esc(nazwaPanstwa(p.kod)) + '</span>'
                + '<span class="panstwo-wlasna">' + esc(p.nazwaWlasna) + '</span></span>'
                /* Nazwa aktu wdrażającego w brzmieniu urzędowym — bez niej kafel
                   mówił tylko, według czego biegnie ocena, i wyglądało to tak,
                   jakby prawo pozostałych państw nie było nam znane. Nazwa zostaje
                   w języku urzędowym: akt nazywa się tak, jak go ogłoszono,
                   i w całości, bo poznaje się go po numerze i roczniku na końcu. */
                + (AKTY_PANSTW[p.kod]
                    ? '<span class="panstwo-akt">' + esc(AKTY_PANSTW[p.kod]) + '</span>'
                    : '')
                + '<span class="panstwo-stan">' + esc(etykietaWarstwy(p.modul)) + '</span>'
                + '</a>';
        }).join('');
    }

    /* Zapis dopiero przy pełnym wyborze — narzędzie czyta ten sam klucz
       i państwo puste wzięłoby za Polskę. */
    function zapisz() {
        if (!wybor.panstwo) return;
        try { localStorage.setItem(KLUCZ_WYBORU, JSON.stringify({ panstwo: wybor.panstwo, jezyk: wybor.jezyk })); } catch (e) {}
    }

    async function ustawJezyk(jezyk) {
        wybor.jezyk = (await zaladuj(jezyk)) || wybor.jezyk;
        zapisz();
        przetlumacz();
    }

    function ustawPanstwo(kod) {
        if (!PANSTWO_WG_KODU[kod]) return;
        wybor.panstwo = kod;
        zapisz();
        przetlumacz();
    }

    function podepnij() {
        const sp = document.getElementById('wyborPanstwo');
        if (sp) sp.addEventListener('change', () => ustawPanstwo(sp.value));
        const sj = document.getElementById('wyborJezyk');
        if (sj) sj.addEventListener('change', () => ustawJezyk(sj.value));
    }

    /* Wołane z nagłówka strony: słownik dogrywa się, zanim przeglądarka
       narysuje polską treść — klasa „tlumacze" chowa stronę na czas
       podmiany, z bezpiecznikiem czasowym, gdyby plik nie dotarł. */
    async function start() {
        const w = wykryj();
        document.documentElement.classList.add('tlumacze');
        const bezpiecznik = setTimeout(() => document.documentElement.classList.remove('tlumacze'), 2500);
        try {
            const [jezyk] = await Promise.all([zaladuj(w.jezyk), new Promise(ok =>
                document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ok, { once: true }) : ok())]);
            /* Żaden słownik nie dotarł — zostaje statyczna wersja angielska. */
            if (!jezyk) return;
            wybor = { jezyk, panstwo: w.panstwo };
            podepnij();
            przetlumacz();
        } finally {
            clearTimeout(bezpiecznik);
            document.documentElement.classList.remove('tlumacze');
        }
    }

    return { rejestruj, start, ustawJezyk, ustawPanstwo, napis, wykryj, get wybor() { return wybor; } };
})();
