/* ==========================================================
   Teksty interfejsu.

   Kod nie zawiera napisów dla użytkownika, tylko wywołania napis('klucz').
   Teksty leżą w locale/<jezyk>.js; polski jest wersją źródłową.

   Dwie niezależne osie: język interfejsu i państwo. Austriak i Niemiec
   dostają ten sam plik locale/de.js, ale inny moduł kraju. Terminologia
   prawna różni się między nimi (badanie: Etap 0), więc de-AT jest
   nakładką nadpisującą kilka procent kluczy z de — patrz nakladka().
   ========================================================== */

const LOCALE = {
    _dane: {},
    aktywny: 'pl',

    rejestruj(kod, slownik) {
        this._dane[kod] = Object.assign(this._dane[kod] || {}, slownik);
    },

    /* Nakładka regionalna: de-AT nadpisuje wybrane klucze z de. */
    nakladka(kod, baza, slownik) {
        this._dane[kod] = Object.assign({}, this._dane[baza] || {}, slownik);
    },

    aktywuj(kod) {
        if (!this._dane[kod]) throw new Error('Brak tekstów dla języka: ' + kod);
        this.aktywny = kod;
    },

    dostepne() {
        return Object.keys(this._dane);
    },

    /* Znacznik BCP 47 dla toLocaleString/toLocaleDateString. Pełny
       znacznik daje stabilniejsze formatowanie liczb między silnikami
       przeglądarek niż sam kod języka. */
    _znaczniki: { pl: 'pl-PL', de: 'de-DE', fr: 'fr-FR', en: 'en-GB', es: 'es-ES',
                  it: 'it-IT', nl: 'nl-NL', cs: 'cs-CZ', sk: 'sk-SK', hu: 'hu-HU',
                  ro: 'ro-RO', bg: 'bg-BG', hr: 'hr-HR', sl: 'sl-SI', lt: 'lt-LT',
                  lv: 'lv-LV', et: 'et-EE', fi: 'fi-FI', sv: 'sv-SE', da: 'da-DK',
                  el: 'el-GR', pt: 'pt-PT', mt: 'mt-MT', ga: 'ga-IE' },
    znacznik() {
        return this._znaczniki[this.aktywny] || this.aktywny;
    },
};

/* Brakujący klucz zwraca sam siebie — celowo widoczny, żeby brak
   tłumaczenia był widać od razu, a nie jako puste miejsce. */
function napis(klucz, podstawienia) {
    const slownik = LOCALE._dane[LOCALE.aktywny] || {};
    const tekst = slownik[klucz];
    if (tekst === undefined) return klucz;
    if (!podstawienia) return tekst;
    return tekst.replace(/\{(\w+)\}/g, (calosc, nazwa) =>
        (nazwa in podstawienia ? podstawienia[nazwa] : calosc));
}

/* Tekst statyczny z index.html. Element z data-napis dostaje textContent,
   z data-napis-html dostaje innerHTML (wartość zawiera własne znaczniki
   formatujące, pochodzi z naszego słownika), a data-napis-title itd.
   ustawiają atrybut. Brakujący klucz zostawia tekst polski z pliku. */
function przetlumaczDokument(korzen) {
    const slownik = LOCALE._dane[LOCALE.aktywny] || {};
    const w = korzen || document;
    w.querySelectorAll('[data-napis]').forEach(el => {
        const v = slownik[el.dataset.napis];
        if (v !== undefined) el.textContent = v;
    });
    w.querySelectorAll('[data-napis-html]').forEach(el => {
        const v = slownik[el.dataset.napisHtml];
        if (v !== undefined) el.innerHTML = v;
    });
    ['title', 'aria-label', 'placeholder'].forEach(atr => {
        const klucz = 'data-napis-' + atr;
        w.querySelectorAll('[' + klucz + ']').forEach(el => {
            const v = slownik[el.getAttribute(klucz)];
            if (v !== undefined) el.setAttribute(atr, v);
        });
    });
    const tytul = document.querySelector('title[data-napis]');
    if (tytul && slownik[tytul.dataset.napis] !== undefined) document.title = slownik[tytul.dataset.napis];
}
