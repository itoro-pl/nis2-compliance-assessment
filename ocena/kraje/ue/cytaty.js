/* Moduł ue: odesłania do przepisów w języku interfejsu.

   Dane modułu zapisują odesłania w jednej, polskiej notacji:
   „art. 21 ust. 2 lit. c; art. 20 ust. 1 dyrektywy (UE) 2022/2555".
   Prosta zamiana słów nie wystarczy — po litewsku numer stoi przed
   nazwą jednostki („21 straipsnio 2 dalies c punktas"), po angielsku
   ustępy i litery idą w nawiasach bez słów („Article 21(2)(c)").
   Dlatego odesłanie jest rozkładane na jednostki i składane na nowo
   z wzorców napisów ue.cyt.* danego języka.

   Wzorce: ue.cyt.art / ust / lit / pkt / akapit — „{p0}" to numer;
   ue.cyt.laczenie — łącznik między jednostkami („ " po polsku,
   „" po angielsku); ue.cyt.i — spójnik w zakresach („3 i 4");
   ue.cyt.drugi — liczebnik akapitu; ue.cyt.dyr / rozp — nazwa aktu
   z „{p0}" w miejscu przepisu. */
(function () {

const JEDNOSTKI = { 'art.': 'art', 'ust.': 'ust', 'lit.': 'lit', 'pkt': 'pkt', 'akapit': 'akapit' };
const AKTY = [
    [/\s*dyrektywy \(UE\) 2022\/2555\s*$/, 'ue.cyt.dyr'],
    [/\s*rozporządzenia \(UE\) 2024\/2690\s*$/, 'ue.cyt.rozp'],
];

/* ue.cyt.litery: „a=α b=β c=γ" — litery przepisów w alfabecie danego
   języka (grecki); pusty napis = litery łacińskie bez zmian. */
function mapaLiter() {
    const m = {};
    String(napis('ue.cyt.litery') || '').split(/\s+/).forEach(para => {
        const [od, na] = para.split('=');
        if (od && na) m[od] = na;
    });
    return m;
}

function jednostka(rodzaj, wartosc) {
    /* Spójnik „i" tylko między dwoma numerami („3 i 4", „i i j") —
       samotne „i" to litera przepisu (lit. i). */
    let w = wartosc
        .replace(/(\S)\s+i\s+(?=\S)/g, (_, przed) => przed + ' ' + napis('ue.cyt.i') + ' ')
        .replace(/\bdrugi\b/g, napis('ue.cyt.drugi'));
    if (rodzaj === 'lit') {
        const mapa = mapaLiter();
        w = w.replace(/\b([a-l])\b/g, l => mapa[l] || l);
    }
    return napis('ue.cyt.' + rodzaj, { p0: w });
}

/* Jeden przepis: „art. 21 ust. 2 lit. c" → ciąg jednostek. */
function przepis(tekst) {
    const slowa = tekst.trim().split(/\s+/);
    const czesci = [];
    let biezaca = null;
    for (const s of slowa) {
        if (JEDNOSTKI[s]) {
            if (biezaca) czesci.push(biezaca);
            biezaca = { rodzaj: JEDNOSTKI[s], wartosc: [] };
        } else if (biezaca) {
            biezaca.wartosc.push(s);
        } else {
            return tekst;   // nie zaczyna się od jednostki — zostawiamy bez zmian
        }
    }
    if (biezaca) czesci.push(biezaca);
    return czesci.map(c => jednostka(c.rodzaj, c.wartosc.join(' '))).join(napis('ue.cyt.laczenie'));
}

function cyt(tekst) {
    let t = String(tekst || '');
    let akt = null;
    for (const [wzorzec, klucz] of AKTY) {
        if (wzorzec.test(t)) { akt = klucz; t = t.replace(wzorzec, ''); break; }
    }
    /* Kilka przepisów: „;" i „, art." to rozdzielacz, „i art." — spójnik. */
    const czesci = t.split(/(\s*;\s*|\s*,\s*(?=art\.)|\s+i\s+(?=art\.))/);
    let zlozone = '';
    for (let i = 0; i < czesci.length; i++) {
        if (i % 2 === 0) zlozone += przepis(czesci[i]);
        else zlozone += /\si\s/.test(czesci[i]) ? ' ' + napis('ue.cyt.i') + ' ' : napis('ue.cyt.rozdzielacz');
    }
    return akt ? napis(akt, { p0: zlozone }) : zlozone;
}

    KRAJE.rejestruj('ue', { cyt });
    window.cyt = cyt;
})();
