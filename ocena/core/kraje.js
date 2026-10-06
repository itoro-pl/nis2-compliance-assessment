/* ==========================================================
   Rejestr modułów krajowych.

   Silnik i interfejs odwołują się do stałych globalnych — ROLE,
   AKTY, KALENDARZ i kilkudziesięciu innych. Zamiast przepisywać
   każdą funkcję na przekazywanie danych parametrami, czynimy te
   stałe wymiennymi: moduł kraju rejestruje swój komplet, a aktywacja
   podstawia go pod te same nazwy.

   Warunek: pliki krajowe nie deklarują tych nazw przez `const`
   w zasięgu globalnym, bo `const` przesłoniłby `window.X`. Stąd
   opakowanie każdego pliku w funkcję.
   ========================================================== */

const KRAJE = {
    _dane: {},
    aktywny: null,

    rejestruj(kod, obiekt) {
        this._dane[kod] = Object.assign(this._dane[kod] || {}, obiekt);
    },

    aktywuj(kod) {
        const d = this._dane[kod];
        if (!d) throw new Error('Brak modułu kraju: ' + kod);
        Object.keys(d).forEach(nazwa => { window[nazwa] = d[nazwa]; });
        this.aktywny = kod;
        return d;
    },

    /* Teksty interfejsu zależne od prawa krajowego: ten sam klucz co
       w locale/<jezyk>.js, treść inna dla każdego państwa. Ładowarka
       nakłada je na słownik języka po załadowaniu modułu. */
    _napisy: {},
    napisy(kod, jezyk, slownik) {
        this._napisy[kod] = this._napisy[kod] || {};
        this._napisy[kod][jezyk] = slownik;
    },
    napisyKraju(kod, jezyk) {
        const n = this._napisy[kod] || {};
        return n[jezyk] || null;
    },

    _manifesty: {},
    manifest(kod, opis) { this._manifesty[kod] = opis; },
    opisKraju(kod) { return this._manifesty[kod] || null; },

    zarejestrowane() {
        return Object.keys(this._dane);
    },
};
