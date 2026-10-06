/* ==========================================================
   Odesłania do przepisów

   Samo „art. 9 ust. 1 pkt 1” jest niejednoznaczne — taki przepis
   istnieje w ustawie o KSC, w Prawie komunikacji elektronicznej
   i w rozporządzeniu unijnym. Odesłanie musi więc zawsze nieść
   informację, z którego aktu pochodzi, i prowadzić do jego tekstu.

   Zależności: data/akty-strony.js (AKTY_PLIKI, AKTY_STRONY)
   ========================================================== */

/* Skróty aktów widoczne przy odesłaniach. */
const AKTY_SKROTY = {
    ksc:         { skrot: 'ustawa o KSC',       kolor: '#1a56db' },
    nowelizacja: { skrot: 'nowelizacja KSC',    kolor: '#7c3aed' },
    pke:         { skrot: 'PKE',                kolor: '#c2410c' },
    pkeWpr:      { skrot: 'przepisy wprow. PKE', kolor: '#b45309' },
    reg2690:     { skrot: 'rozp. 2024/2690',    kolor: '#0e7490' },
    inny:        { skrot: null,                 kolor: '#4b5563' },
};

/* Rozpoznanie aktu na podstawie treści odesłania.
   Kolejność ma znaczenie — wzorce bardziej szczegółowe najpierw.
   Moduł kraju może podać własne wzorce (ODESLANIA_WZORCE), bo poniższe
   rozpoznają odesłania pisane po polsku. */
function rozpoznajAkt(tekst) {
    const t = String(tekst || '');
    if (typeof ODESLANIA_WZORCE !== 'undefined' && ODESLANIA_WZORCE.akty) {
        const trafiony = ODESLANIA_WZORCE.akty.find(([wzorzec]) => wzorzec.test(t));
        return trafiony ? trafiony[1] : null;
    }
    if (/2024\/2690|rozporządzenia \(UE\)|załącznika do rozporządzenia/i.test(t)) return 'reg2690';
    if (/ustawy wprowadzającej|przepisy wprowadzające/i.test(t)) return 'pkeWpr';
    if (/\bPKE\b|Prawa komunikacji elektronicznej/i.test(t)) return 'pke';
    if (/ustawy nowelizującej|ustawy z 23\.01\.2026|o zmianie ustawy o KSC/i.test(t)) return 'nowelizacja';
    if (/ustawy o KSC|ustawy o krajowym systemie/i.test(t)) return 'ksc';
    return null;
}

/* Wyciągnięcie numeru artykułu, np. „art. 8 ust. 1 pkt 2 lit. e” → „8”. */
function numerArtykulu(tekst) {
    const wz = typeof ODESLANIA_WZORCE !== 'undefined' ? ODESLANIA_WZORCE : null;
    let t = String(tekst || '');
    if (wz) {
        /* Odesłanie do załącznika (sekcja, punkt) — kotwica załącznika,
           nie artykułu o tym numerze. */
        if (typeof wz.zalacznik === 'function' && wz.zalacznik(t)) return 'zal';
        /* Numer aktu („2022/2555") stoi w niektórych językach przed numerem
           artykułu — trzeba go zdjąć, zanim szukamy pierwszej liczby. */
        (wz.akty || []).forEach(([wzorzec]) => { t = t.replace(wzorzec, ''); });
    }
    const wzorzec = (wz && wz.artykul) || /art\.\s*(\d+[a-z]{0,2})/i;
    const m = t.match(wzorzec);
    return m ? m[1] : null;
}

/* Treść na plakietce bez nazwy aktu — akt jest już na etykiecie, więc
   „art. 7c ust. 1 ustawy o KSC" pokazuje się jako „art. 7c ust. 1". Dzięki
   temu plakietki są krótkie, jednowierszowe i równej wysokości. Tylko do
   wyświetlenia: pełny tekst zostaje w podpowiedzi. Wzorce polskie tutaj;
   moduł kraju piszący odesłania w innym języku podaje własną funkcję
   ODESLANIA_WZORCE.skroc. */
const SKROTY_TRESCI_PL = [
    /\s*,?\s*ustawy z 23\.01\.2026(?: r\.)? o zmianie ustawy o KSC(?: oraz niektórych innych ustaw)?/i,
    /\s*ustawy z 23\.01\.2026(?: r\.)?/i,
    /\s*ustawy nowelizującej/i,
    /\s*ustawy z 12\.07\.2024 — Przepisy wprowadzające PKE/i,
    /\s*(?:ustawy )?wprowadzającej PKE/i,
    /\s*(?:do )?ustawy o KSC/i,
    /\s*(?:do )?ustawy o krajowym systemie cyberbezpieczeństwa/i,
    /\s*(?:ustawy )?Prawa komunikacji elektronicznej/i,
    /\s+PKE\b/,
    /\s*(?:do )?rozporządzenia(?: wykonawczego)?(?: Komisji)?(?: \(UE\))? 2024\/2690/i,
    /\s*\(Dz\.U\. \d{4} poz\. \d+\)/,
];
function skrocOdeslanie(tekst, aktId) {
    const wz = typeof ODESLANIA_WZORCE !== 'undefined' ? ODESLANIA_WZORCE : null;
    let t = String(tekst || '');
    if (wz) {
        if (typeof wz.skroc === 'function') t = wz.skroc(t, aktId);
    } else {
        SKROTY_TRESCI_PL.forEach(wzorzec => { t = t.replace(wzorzec, ''); });
    }
    t = t.replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').replace(/^[\s,]+|[\s,]+$/g, '');
    return t || String(tekst || '');
}

/* Strona w PDF. Artykuły dodane nowelizacją nie występują w tekście
   jednolitym sprzed niej — wtedy sięgamy do ustawy nowelizującej. */
function stronaPrzepisu(aktId, numer) {
    if (!numer || typeof AKTY_STRONY === 'undefined') return null;
    const wlasny = AKTY_STRONY[aktId] && AKTY_STRONY[aktId][numer];
    if (wlasny) return { akt: aktId, strona: wlasny };
    if (aktId === 'ksc') {
        const zNoweli = AKTY_STRONY.nowelizacja && AKTY_STRONY.nowelizacja[numer];
        if (zNoweli) return { akt: 'nowelizacja', strona: zNoweli };
    }
    if (aktId === 'pke') {
        const zWpr = AKTY_STRONY.pkeWpr && AKTY_STRONY.pkeWpr[numer];
        if (zWpr) return { akt: 'pkeWpr', strona: zWpr };
    }
    return null;
}

/* Pełny opis odesłania: akt, plik, strona, etykieta.
   domyslnyAkt pozwala rozstrzygnąć przypadki, w których sama treść
   odesłania nie wskazuje aktu (np. „art. 39 ust. 2 pkt 3” w sekcji PKE). */
function opisOdeslania(tekst, domyslnyAkt) {
    const aktId = rozpoznajAkt(tekst) || domyslnyAkt || null;
    if (!aktId) return { tekst, aktId: null, skrot: null, plik: null, strona: null };

    const meta = (typeof AKTY_PLIKI !== 'undefined' && AKTY_PLIKI[aktId]) || null;
    const numer = numerArtykulu(tekst);
    const trafienie = stronaPrzepisu(aktId, numer);
    const metaDocelowa = trafienie
        ? (typeof AKTY_PLIKI !== 'undefined' && AKTY_PLIKI[trafienie.akt])
        : meta;

    return {
        tekst,
        tresc: skrocOdeslanie(tekst, aktId),
        aktId,
        skrot: (meta && meta.skrot) || (AKTY_SKROTY[aktId] || AKTY_SKROTY.inny).skrot,
        kolor: (AKTY_SKROTY[aktId] || AKTY_SKROTY.inny).kolor,
        tytulAktu: meta ? meta.tytul : null,
        dziennik: meta ? meta.dziennik : null,
        plik: metaDocelowa ? metaDocelowa.plik : null,
        strona: trafienie ? trafienie.strona : null,
        wInnymAkcie: trafienie && trafienie.akt !== aktId ? trafienie.akt : null,
    };
}

/* Adres otwierający dokument na właściwej stronie.
   Przeglądarkowe czytniki PDF obsługują fragment #page=N. Gdy zamiast
   numeru strony jest kotwica tekstowa (EUR-Lex: art_21, anx_I), adres
   prowadzi do urzędowego HTML z zakotwiczeniem na artykule — tak działa
   moduł unijny oraz państwa, które nie publikują stabilnego PDF. */
function adresPrzepisu(o) {
    if (!o || !o.plik) return null;
    if (!o.strona) return o.plik;
    return o.plik + (typeof o.strona === 'string' ? '#' + o.strona : '#page=' + o.strona);
}

/* Warstwa kwestionariusza → akt, z którego pochodzą jej odesłania. */
const WARSTWA_AKT = {
    'ksc': 'ksc',
    'ksc-ob': 'ksc',
    'pke': 'pke',
    'reg2690': 'reg2690',
    /* Załącznik nr 4 jest częścią ustawy o KSC — odesłania z tej ścieżki
       prowadzą do jej tekstu. */
    'zal4': 'ksc',
};
