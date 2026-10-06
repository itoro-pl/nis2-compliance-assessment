/* ==========================================================
   Spinacz aplikacji: nawigacja, motyw, operacje na ocenach
   ========================================================== */

/* Start aplikacji woła ładowarka (core/ladowarka.js) dopiero po
   aktywacji modułu kraju — stąd nazwana funkcja zamiast nasłuchu
   na DOMContentLoaded. Kolejność wywołań bez zmian. */
function uruchomAplikacje() {
    przywrocMotyw();
    wczytajOceny();
    renderujListeOcen();
    podepnijPolaProfilu();
    zbudujKroki();
    idzDoKroku(0);
    pokazInfoZapisu();
    odswiezPrzyciskOffline();
    pokazWersje();
    pokazPodstaweKrajowa();
    ukryjPolaRejestrowe();
    ustawStopkeDruku();
    dopasujPasekGorny();
    window.addEventListener('resize', () => requestAnimationFrame(dopasujPasekGorny));
    trybDemonstracyjny();
}

/* Pasek górny: przyciski muszą się zmieścić. Gdy tytuł z przyciskami
   jest szerszy niż okno (niemiecki na laptopie, każdy język na tablecie),
   chowamy najpierw dopisek „— wdrożenie NIS 2", potem cały tytuł. Bez
   tego przycisk „Moje oceny" wychodził za prawą krawędź ekranu i znikał,
   bo strona ma wyłączone przewijanie w poziomie. */
function dopasujPasekGorny() {
    const p = document.querySelector('.pasek-gorny');
    if (!p) return;
    p.classList.remove('bez-dopisku', 'bez-tytulu');
    const zaSzeroki = () => p.scrollWidth > p.clientWidth + 1;
    if (zaSzeroki()) p.classList.add('bez-dopisku');
    if (zaSzeroki()) p.classList.add('bez-tytulu');
}

/* Stopka wydruku. Tekst siedzi w slowniku, nie w arkuszu stylow — CSS
   nie zna jezyka interfejsu, a wydruk raportu dla Austrii nie moze
   niesc polskiego zdania o ustawie o KSC. */
function ustawStopkeDruku() {
    document.documentElement.style.setProperty(
        '--stopka-druku', JSON.stringify(napis('app.stopkaDruku')));
}

/* Trzecia pozycja listy „Podstawa prawna oceny" zależy od państwa.
   Moduł krajowy ma tam własny tekst (dla Polski: PKE) i nic nie
   robimy. Moduł wspólny nazywa akt wdrażający danego państwa po
   imieniu i mówi wprost, że jego wymogów jeszcze nie ocenia —
   przemilczenie sugerowałoby, że podmiot nie ma innych obowiązków
   niż unijne. */
function pokazPodstaweKrajowa() {
    const el = document.getElementById('podstawaKrajowa');
    if (!el || typeof AKTY_KRAJOWE === 'undefined') return;
    /* Ten sam tekst trafia nad raport zgodnosci — wydruk pokazuje tylko
       krok wynikow, a dokument dla zarzadu musi nazwac akt krajowy. */
    const wRaporcie = document.getElementById('podstawaKrajowaRaport');
    const akt = AKTY_KRAJOWE[KRAJE.panstwo];
    if (akt) {
        const nazwa = akt.adres
            ? `<a href="${esc(akt.adres)}" target="_blank" rel="noopener">${esc(akt.nazwa)}</a>`
            : esc(akt.nazwa);
        el.innerHTML = napis('html.33a', {p0: nazwa});
        if (wRaporcie) wRaporcie.innerHTML = napis('html.33a', {p0: nazwa});
    } else if (typeof BEZ_USTAWY_WDRAZAJACEJ !== 'undefined' && BEZ_USTAWY_WDRAZAJACEJ.includes(KRAJE.panstwo)) {
        el.textContent = napis('html.33b');
        if (wRaporcie) wRaporcie.textContent = napis('html.33b');
    }
}

/* Pola rejestrowe (REGON, KRS) i obietnica pobrania danych mają sens
   tylko tam, gdzie moduł kraju zna swoje rejestry. Moduł wspólny ich
   nie zna — pokazywanie polskich identyfikatorów Austriakowi byłoby
   myleniem, więc znikają. */
function ukryjPolaRejestrowe() {
    const maRejestry = typeof NIP_ZRODLA !== 'undefined' && NIP_ZRODLA && Object.keys(NIP_ZRODLA).length > 0;
    if (maRejestry) return;
    document.querySelectorAll('[data-rejestr-krajowy]').forEach(el => { el.hidden = true; });
    /* Obie karty obiecują automat: wczytanie sprawozdania i pobranie
       z rejestru. Bez modułu kraju żadna z nich nie zadziała, więc
       zamiast tłumaczyć się z nieczynnych przycisków zostawiamy jedno
       zdanie i pola do wpisania. */
    const karty = document.getElementById('zrodlaDanych');
    if (karty) karty.hidden = true;
    const opis = document.getElementById('opisZrodel');
    if (!opis) return;
    opis.textContent = napis('html.zrodlaRecznie');
    /* Tam, gdzie rejestr gospodarczy wydaje dane publicznie, mówimy to
       wprost: brakuje nie danych, tylko modułu, który je przeczyta.
       Kto taki moduł napisze, ten przyśle pull request. */
    const rejestr = typeof REJESTRY_PUBLICZNE !== 'undefined' ? REJESTRY_PUBLICZNE[KRAJE.panstwo] : null;
    if (!rejestr) return;
    const nazwa = rejestr.adres
        ? `<a href="${esc(rejestr.adres)}" target="_blank" rel="noopener">${esc(rejestr.nazwa)}</a>`
        : esc(rejestr.nazwa);
    opis.insertAdjacentHTML('beforeend', ' ' + napis('html.rejestrMozliwy', {p0: nazwa}));
}

/* ── TRYB DEMONSTRACYJNY ───────────────────────────────────
   Uruchamiany parametrem ?demo=1 na potrzeby zrzutów ekranu do
   dokumentacji. Tworzy ocenę na danych w całości fikcyjnych
   i nie zapisuje jej trwale. */
function trybDemonstracyjny() {
    const par = new URLSearchParams(location.search);
    const przyklad = par.get('przyklad') === '1';
    if (par.get('demo') !== '1' && !przyklad) return;

    magazynDostepny = false;   // ocena poglądowa nie trafia do pamięci przeglądarki
    oceny = [];
    const o = utworzOcene(PRZYKLAD.profil.nazwa);
    Object.assign(o.profil, PRZYKLAD.profil);

    const kl = sklasyfikuj(o.profil);

    /* Tryb poglądowy pokazuje pełny raport, więc wypełniamy wszystkie
       moduły. Tryb zrzutów ekranu zostaje przy module startowym. */
    if (przyklad) o.profil.moduly = moduleDostepne(kl).map(m => m.id);

    wypelnijPrzykladoweOdpowiedzi(o.profil, kl);

    zbudujKroki();
    if (przyklad) { oznaczPrzyklad(); idzDoKrokuId('wyniki'); return; }

    const krok = par.get('krok');
    if (krok) idzDoKrokuId(krok); else idzDoKroku(0);
}

/* Profil poglądowy: operator z własnym centrum danych. Dobrany tak, żeby
   raport pokazał to, co w praktyce najczęściej zaskakuje zarząd — dwa
   organy nadzoru naraz, trzy zestawy wymagań i pułap kary wyższy od
   rocznego przychodu. Dane są w całości fikcyjne; nazwa, adres i forma
   prawna pochodzą z napisów modułu kraju, więc przykład dla Niemiec
   pokazuje GmbH, a dla Czech s.r.o. */
const PRZYKLAD = {
    profil: {
        nazwa: napis('app.przyklad.nazwa'),
        nip: '', regon: '', krs: '',
        adres: napis('app.przyklad.adres'),
        formaPrawna: napis('app.przyklad.forma'),
        role: ['isp', 'dc'], wielkosc: 'sredni',
        przychod: 24000000, przychodTelekom: 15000000,
        wynagrodzenieKierownika: 22000, kursEUR: 4.30,
    },
    /* Rozkład odpowiedzi udający realny stan wdrożenia: obszary
       proceduralne wypadają lepiej niż techniczne, obowiązki formalne
       są w części niedomknięte. Rozkład jest deterministyczny, więc
       raport poglądowy wygląda tak samo przy każdym otwarciu. */
    poziomy: { 'ksc': [3, 2, 4, 2, 3, 1], 'ksc-ob': [3, 2, 4], 'pke': [4, 3, 3, 2], 'reg2690': [2, 3, 1, 2, 4, 2], 'zal4': [3, 2, 4, 3] },
    stany: ['wykonane', 'w-toku', 'wykonane', 'niewykonane', 'wykonane', 'w-toku'],
};

function wypelnijPrzykladoweOdpowiedzi(profil, kl) {
    let n = 0;
    sekcjeWybrane(profil, kl).forEach(sek => sek.pytania.forEach(q => {
        const typ = typPytania(sek, q);
        const warstwa = q.__warstwa || sek.warstwa;
        if (typ === 'skala') {
            const skala = PRZYKLAD.poziomy[warstwa] || PRZYKLAD.poziomy.ksc;
            ustawOdpowiedz(q.id, { poziom: skala[n % skala.length] });
        } else {
            ustawOdpowiedz(q.id, { stan: PRZYKLAD.stany[n % PRZYKLAD.stany.length] });
        }
        n++;
    }));
}

/* Ostrzeżenie na wierzchu raportu — nikt nie może wziąć tego wydruku
   za ocenę własnej firmy, zwłaszcza że da się go wydrukować do PDF. */
function oznaczPrzyklad() {
    const el = document.getElementById('trescWynikow');
    if (!el) return;
    el.insertAdjacentHTML('afterbegin', `
      <div class="alert alert-warning d-flex flex-wrap gap-2 align-items-center">
        <strong>${napis('app.1')}</strong>
        <span>${napis('app.2')}</span>
        <a class="btn btn-sm btn-primary ms-auto d-print-none" href="index.html">${napis('app.3')}</a>
      </div>`);
}

function pokazWersje() {
    const el = document.getElementById('wersjaNarzedzia');
    if (el) el.textContent = wersjaOpis();
}

function pokazInfoZapisu() {
    const el = document.getElementById('infoZapisu');
    el.textContent = sprawdzMagazyn()
        ? napis('app.daneWPrzegladarce')
        : napis('app.33');
    el.classList.toggle('text-danger', !sprawdzMagazyn());
}

/* ── FORMATOWANIE KWOT ─────────────────────────────────────
   Wpisywanie "48000000" bez separatorów jest nieczytelne i podatne na
   pomyłkę o rząd wielkości. Pola kwotowe formatujemy w trakcie pisania
   i pokazujemy słowny podgląd rzędu wielkości. */
function liczbaZPola(tekst) {
    const t = String(tekst === null || tekst === undefined ? '' : tekst).replace(/[^0-9]/g, '');
    return t ? Number(t) : '';
}

function formatujGrupy(n) {
    if (n === '' || !Number.isFinite(Number(n))) return '';
    return Number(n).toLocaleString(LOCALE.znacznik());
}

/* Słowny rząd wielkości — najszybszy sposób wychwycenia pomyłki o zero. */
function slownieKwota(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return '';
    if (n >= 1e9) return (n / 1e9).toLocaleString(LOCALE.znacznik(), { maximumFractionDigits: 2 }) + napis('app.34');
    if (n >= 1e6) return (n / 1e6).toLocaleString(LOCALE.znacznik(), { maximumFractionDigits: 2 }) + napis('app.35');
    if (n >= 1e3) return (n / 1e3).toLocaleString(LOCALE.znacznik(), { maximumFractionDigits: 1 }) + napis('app.36');
    return n.toLocaleString(LOCALE.znacznik()) + ' ' + WALUTA.symbol;
}

const PODGLADY_KWOT = {
    polPrzychod: 'podgladPrzychod',
    polPrzychodTelekom: 'podgladPrzychodTelekom',
    polWynagrodzenie: 'podgladWynagrodzenie',
};

function opisKwoty(v, idPola) {
    let t = slownieKwota(v);
    if (idPola === 'polPrzychodTelekom') {
        t += v > 10000000
            ? napis('app.progDostawcy')
            : napis('app.37');
    } else if (idPola === 'polWynagrodzenie') {
        t += napis('app.38') + slownieKwota(v * 3);
    }
    return t;
}

function odswiezPodgladKwoty(idPola) {
    const el = document.getElementById(PODGLADY_KWOT[idPola]);
    const pole = document.getElementById(idPola);
    if (!el || !pole) return;
    const v = liczbaZPola(pole.value);
    if (!v) { el.textContent = ''; el.classList.remove('widoczny'); return; }
    el.textContent = opisKwoty(v, idPola);
    el.classList.add('widoczny');
}

/* Formatowanie w locie z zachowaniem pozycji kursora. */
function podepnijPolaKwotowe() {
    Object.keys(PODGLADY_KWOT).forEach(id => {
        const e = document.getElementById(id);
        if (!e) return;
        e.addEventListener('input', function () {
            const cyfrPrzedKursorem = this.value.slice(0, this.selectionStart).replace(/[^0-9]/g, '').length;
            const v = liczbaZPola(this.value);
            this.value = formatujGrupy(v);
            let cyfr = 0, poz = 0;
            for (; poz < this.value.length && cyfr < cyfrPrzedKursorem; poz++) {
                if (/[0-9]/.test(this.value[poz])) cyfr++;
            }
            this.setSelectionRange(poz, poz);
            odswiezPodgladKwoty(id);
        });
    });
}

/* ── NAWIGACJA ─────────────────────────────────────────────*/
/* Numer kroku widoczny dla użytkownika. Ekran startowy nie jest krokiem
   oceny, więc numerację zaczynamy od profilu podmiotu. */
/* Płynne przewijanie tylko dla tych, którzy nie wyłączyli animacji.
   Reguła CSS scroll-behavior nie wpływa na scrollTo z opcją behavior. */
function plynnie() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function numerKroku(i) {
    return kroki[i] && kroki[i].typ === 'start' ? null : i;
}
function liczbaKrokow() {
    return kroki.filter(k => k.typ !== 'start').length;
}

function renderujNawigacje() {
    document.getElementById('nawigacjaKrokow').innerHTML = kroki.map((k, i) => {
        const w = k.typ === 'sekcja' ? WARSTWY_OPIS[k.sekcja.warstwa] : null;
        const nr = numerKroku(i);
        const przeszly = i < biezacyKrok;
        const zamkniety = !!k.zablokowany;
        return `<div class="pozycja-kroku ${i === biezacyKrok ? 'aktywna' : ''} ${przeszly ? 'przeszla' : ''} ${zamkniety ? 'zamknieta' : ''}"
                     data-i="${i}" onclick="idzDoKroku(${i})"
                     title="${zamkniety ? napis('app.39') : esc(k.etykieta)}">
          <span class="numer-kroku">${nr === null ? '•' : nr}</span>
          ${w ? `<span class="kropka-warstwy" style="background:${w.kolor}" title="${esc(w.nazwa)}"></span>` : ''}
          <span class="etykieta-kroku">${esc(k.etykieta)}</span>
          ${zamkniety ? '<span class="klodka" aria-label="krok zablokowany">&#9679;</span>' : ''}
        </div>`;
    }).join('');
}

/* Pasek u góry ekranu — numer kroku, nazwa i przyciski nawigacji. */
function odswiezPasekKroku() {
    const pasek = document.getElementById('pasekKroku');
    const k = kroki[biezacyKrok];
    if (!k || k.typ === 'start') { pasek.style.display = 'none'; return; }
    pasek.style.display = '';

    const nr = numerKroku(biezacyKrok);
    const razem = liczbaKrokow();
    /* Dopóki profil nie jest wypełniony, dalszych kroków jeszcze nie ma —
       ich liczba zależy od ról podmiotu. Nie podajemy wtedy sumy, żeby nie
       sugerować, że profil jest jedynym krokiem. */
    const znanaLiczba = razem > 1;
    document.getElementById('pasekLicznik').textContent =
        znanaLiczba ? napis('app.24', {p0: nr, p1: razem}) : napis('app.40');
    document.getElementById('pasekNazwa').textContent = k.etykieta;
    document.getElementById('pasekKrokuPasek').style.width =
        (znanaLiczba ? Math.round((nr / razem) * 100) : 4) + '%';

    /* Strzałki zostają na swoich miejscach nawet wtedy, gdy nie ma dokąd
       iść — znikający przycisk przesuwałby licznik i nazwa kroku
       skakałaby przy każdym przejściu. Nieaktywny przycisk jest wygaszony. */
    const wstecz = document.getElementById('btnWsteczGora');
    const dalej = document.getElementById('btnDalejGora');
    const ostatni = biezacyKrok >= kroki.length - 1;
    const pierwszy = biezacyKrok <= 1;

    wstecz.disabled = pierwszy;
    wstecz.title = pierwszy ? napis('app.pierwszyKrok') : napis('app.41') + kroki[biezacyKrok - 1].etykieta;
    /* Na przycisku samo „Wstecz" — nazwa poprzedniego kroku bywa długa
       i na przycisku urywała się wielokropkiem; pełna stoi w podpowiedzi
       i w panelu kroków. */
    document.getElementById('etykietaWstecz').textContent = napis('app.wstecz');

    /* Przycisk pozostaje aktywny nawet wtedy, gdy przejście jest jeszcze
       zablokowane — kliknięcie przenosi wtedy do pierwszego brakującego
       pola. Wyszarzony przycisk bez wyjaśnienia był ślepym zaułkiem. */
    dalej.disabled = ostatni;
    document.getElementById('etykietaDalejTekst').textContent = ostatni ? napis('app.koniecOceny') : napis('app.dalej');

    /* Na profilu przejście dalej ma sens dopiero po uzupełnieniu pól, od
       których zależy klasyfikacja. Zamiast blokować przycisk — co nie
       tłumaczy powodu — sygnalizujemy stan i wyjaśniamy go w podpowiedzi. */
    const braki = (k.typ === 'profil' && stan) ? brakiProfilu() : [];
    dalej.classList.toggle('btn-krok-blokada', braki.length > 0);
    dalej.title = braki.length
        ? napis('app.42') + braki.map(b => b.etykieta.split(' —')[0].toLowerCase()).join(', ')
        : (ostatni ? napis('app.ostatniKrok') : napis('app.43') + kroki[biezacyKrok + 1].etykieta);
}

function etykietaDalej(i) {
    const k = kroki[i], nast = kroki[i + 1];
    if (k.typ === 'profil') return napis('app.44');
    if (k.typ === 'raport-wstepny') return napis('app.45');
    if (nast && nast.typ === 'wyniki') return napis('app.46');
    return napis('app.dalej');
}

function idzDoKroku(i) {
    if (i < 0 || i >= kroki.length) return;
    const k = kroki[i];

    if (k.typ !== 'start' && !stan) return;
    /* Próba wejścia w krok zamknięty kończy się powrotem do profilu wraz
       z listą brakujących pól — użytkownik dostaje powód, nie ciszę. */
    if (k.zablokowany || (k.typ !== 'start' && k.typ !== 'profil' && !walidujProfil(true))) {
        if (k.typ !== 'profil') { i = kroki.findIndex(x => x.typ === 'profil'); oznaczBraki(true); }
    }

    biezacyKrok = i;
    const cel = kroki[i];

    document.querySelectorAll('.krok').forEach(s => s.classList.remove('aktywny'));
    const sekcja = document.querySelector(`.krok[data-krok="${CSS.escape(cel.id)}"]`);
    if (sekcja) sekcja.classList.add('aktywny');

    if (cel.typ === 'start') renderujListeOcen();
    if (cel.typ === 'profil') renderujProfil();
    if (cel.typ === 'raport-wstepny') renderujRaportWstepny();
    if (cel.typ === 'moduly') renderujModuly();
    if (cel.typ === 'wyniki') renderujWyniki();

    document.getElementById('nawigacjaDolna').style.display = cel.typ === 'start' ? 'none' : '';
    document.getElementById('btnWstecz').style.display = i > 1 ? '' : 'none';
    document.getElementById('btnDalej').style.display = i < kroki.length - 1 ? '' : 'none';
    document.getElementById('btnDalej').textContent = etykietaDalej(i);

    /* Po każdym renderze podlinkowujemy odesłania wplecione w zdania. */
    const widoczny = document.querySelector('.krok.aktywny');
    if (widoczny) podlinkujPrzepisyWTekscie(widoczny);

    renderujNawigacje();
    odswiezPasekKroku();
    odswiezPostep();
    document.getElementById('panelBoczny').classList.remove('otwarty');
    document.getElementById('obszarTresci').scrollTo({ top: 0, behavior: plynnie() });
}

function nastepnyKrok() {
    if (kroki[biezacyKrok].typ === 'profil' && !walidujProfil()) return;
    idzDoKroku(biezacyKrok + 1);
}
function poprzedniKrok() { idzDoKroku(biezacyKrok - 1); }

function idzDoKrokuId(id) {
    const i = kroki.findIndex(k => k.id === id);
    if (i >= 0) idzDoKroku(i);
}

/* Pola bez których nie da się ustalić klasyfikacji podmiotu. */
const POLA_WYMAGANE = [
    { klucz: 'nazwa', pole: 'polNazwa', etykieta: napis('app.47'),
      pusty: (p) => !p.nazwa || !p.nazwa.trim() },
    { klucz: 'role', pole: null, etykieta: napis('app.48'),
      pusty: (p) => !p.role.length, kotwica: 'listaRol' },
    { klucz: 'wielkosc', pole: 'polWielkosc', etykieta: napis('app.49'),
      pusty: (p) => !p.wielkosc },
];

function brakiProfilu() {
    return POLA_WYMAGANE.filter(w => w.pusty(stan.profil));
}

/* Podświetlenie brakujących pól. Wywoływane przy każdej zmianie, żeby
   oznaczenie znikało od razu po uzupełnieniu, a nie dopiero po kliknięciu
   przycisku „Dalej”. */
function oznaczBraki(pokazPodsumowanie) {
    const braki = brakiProfilu();
    const brakujace = new Set(braki.map(b => b.klucz));

    POLA_WYMAGANE.forEach(w => {
        const el = w.pole && document.getElementById(w.pole);
        if (el) el.classList.toggle('pole-brakujace', brakujace.has(w.klucz));
    });
    const rol = document.getElementById('listaRol');
    if (rol) rol.classList.toggle('sekcja-brakujaca', brakujace.has('role'));

    /* Lista kontrolna stoi na stałe u góry kroku, a nie pojawia się dopiero
       po nieudanej próbie przejścia dalej. Wcześniej powód blokady krył się
       w podpowiedzi przycisku — czyli był niewidoczny do czasu najechania
       kursorem, a na dotyku niewidoczny w ogóle. */
    const el = document.getElementById('brakiProfilu');
    if (el) {
        const zrobione = POLA_WYMAGANE.length - braki.length;
        el.innerHTML = `<div class="lista-kontrolna ${braki.length ? '' : 'komplet'} ${pokazPodsumowanie && braki.length ? 'podswietlona' : ''}">
            <div class="lista-kontrolna-naglowek">
              <span>${braki.length
                 ? napis('app.trzyInformacje')
                 : napis('app.50')}</span>
              <span class="lista-kontrolna-licznik">${zrobione} z ${POLA_WYMAGANE.length}</span>
            </div>
            <ol class="lista-kontrolna-pozycje">${POLA_WYMAGANE.map(w => {
                const brak = brakujace.has(w.klucz);
                const cel = w.pole || w.kotwica;
                return `<li class="${brak ? 'brak' : 'ok'}">
                   <span class="znak" aria-hidden="true">${brak ? '' : '✓'}</span>
                   ${brak
                     ? `<a href="#" onclick="przejdzDoPola('${cel}');return false;">${esc(w.etykieta)}</a>`
                     : `<span>${esc(w.etykieta.split(' —')[0])}</span>`}
                 </li>`;
            }).join('')}</ol>
          </div>`;
    }
    /* Pasek u góry pokazuje, czy da się przejść dalej — musi reagować
       na każdą zmianę w profilu, nie dopiero na zmianę kroku. */
    if (document.getElementById('pasekKroku')) odswiezPasekKroku();
    return braki;
}

function przejdzDoPola(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: plynnie(), block: 'center' });
    if (el.focus) setTimeout(() => el.focus({ preventScroll: true }), 300);
}

function walidujProfil(cicho) {
    const braki = oznaczBraki(!cicho);
    if (braki.length) {
        if (!cicho) {
            powiadom(napis('app.51'), napis('app.brakuje') + braki.map(b => b.etykieta.split(' —')[0].toLowerCase()).join(', ') + '.');
            przejdzDoPola(braki[0].pole || braki[0].kotwica);
        }
        return false;
    }
    return true;
}

function odswiezPostep() {
    if (!stan) {
        document.getElementById('postepOgolny').style.width = '0%';
        document.getElementById('postepTekst').textContent = napis('app.52');
        return;
    }
    const w = policzWynik(stan);
    const pct = w.pytanRazem ? Math.round((w.odpowiedziano / w.pytanRazem) * 100) : 0;
    document.getElementById('postepOgolny').style.width = pct + '%';
    document.getElementById('postepTekst').textContent = napis('app.25', {p0: pct, p1: w.odpowiedziano, p2: w.pytanRazem});
    odswiezPlakietke();
}

function odswiezPlakietke() {
    const el = document.getElementById('plakietkaOceny');
    if (!stan) { el.textContent = ''; el.style.display = 'none'; return; }
    el.style.display = '';
    const nazwa = stan.profil.nazwa || stan.nazwa;
    el.textContent = nazwa;
    /* Nazwy podmiotów bywają bardzo długie. Jeżeli mimo elastycznej
       szerokości tekst się nie mieści, pełne brzmienie zostaje
       w podpowiedzi — inaczej po ucięciu nie da się go odczytać wcale. */
    el.title = nazwa;
}

function przelaczPanel() { document.getElementById('panelBoczny').classList.toggle('otwarty'); }

/* ── OPERACJE NA OCENACH ───────────────────────────────────*/
function doStartu() { biezacyKrok = 0; idzDoKroku(0); }

function nowaOcenaUI() {
    utworzOcene(napis('app.53'));
    zbudujKroki();
    idzDoKroku(1);
    powiadom(napis('app.54'), napis('app.55'));
}

function otworzOceneUI(id) {
    otworzOcene(id);
    zbudujKroki();
    idzDoKroku(1);
}

function usunOceneUI(id) {
    const o = oceny.find(x => x.id === id);
    if (!o) return;
    if (!confirm(napis('app.26', {p0: o.profil.nazwa || o.nazwa, p1: o.migawki.length}))) return;
    usunOcene(id);
    zbudujKroki();
    doStartu();
    powiadom(napis('app.56'), napis('app.57'));
}

function duplikujOceneUI(id) {
    const k = duplikujOcene(id);
    if (k) { renderujListeOcen(); powiadom(napis('app.zduplikowano'), napis('app.58')); }
}

async function eksportujOceneUI(id) {
    const p = eksportujJSON(id);
    if (!p) return;
    const w = await zapiszPlik(p.nazwaPliku, p.tresc, napis('app.59'), '.json', 'application/json');
    if (w.anulowane) return;
    powiadom(napis('xlsx.wyeksportowano'), (w.nazwa || p.nazwaPliku) +
        (w.klasycznie ? '' : napis('app.katalogZapamietany')));
}

/* ── WYBÓR PLIKU ───────────────────────────────────────────
   Przeglądarka nie pozwala wskazać katalogu startowego ścieżką — ze
   względów bezpieczeństwa nie ujawnia nawet lokalizacji otwartego pliku
   HTML. Można jednak zapamiętać uchwyt katalogu, w którym użytkownik
   ostatnio zapisywał lub otwierał ocenę, i wracać do niego przy kolejnym
   otwarciu. Wymaga to File System Access API (przeglądarki oparte na
   Chromium); w pozostałych działa klasyczne okno wyboru pliku. */
const KLUCZ_KATALOGU = 'nis2_katalog';
let bazaUchwytow = null;

function otworzBazeUchwytow() {
    if (bazaUchwytow) return bazaUchwytow;
    bazaUchwytow = new Promise((resolve) => {
        if (!window.indexedDB) { resolve(null); return; }
        const zad = indexedDB.open('nis2-uchwyty', 1);
        zad.onupgradeneeded = () => zad.result.createObjectStore('uchwyty');
        zad.onsuccess = () => resolve(zad.result);
        zad.onerror = () => resolve(null);
    });
    return bazaUchwytow;
}

async function zapiszUchwytKatalogu(uchwyt) {
    const db = await otworzBazeUchwytow();
    if (!db || !uchwyt) return;
    try {
        const t = db.transaction('uchwyty', 'readwrite');
        t.objectStore('uchwyty').put(uchwyt, KLUCZ_KATALOGU);
    } catch (e) { /* uchwyt nieserializowalny — pomijamy */ }
}

async function wczytajUchwytKatalogu() {
    const db = await otworzBazeUchwytow();
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const z = db.transaction('uchwyty', 'readonly').objectStore('uchwyty').get(KLUCZ_KATALOGU);
            z.onsuccess = () => resolve(z.result || null);
            z.onerror = () => resolve(null);
        } catch (e) { resolve(null); }
    });
}

/* Otwarcie pliku oceny — okno startuje w katalogu, w którym użytkownik
   ostatnio zapisał albo otworzył ocenę. Bez tego przeglądarka proponuje
   katalog domyślny systemu i klient szuka swojego pliku po całym dysku. */
async function wybierzPlikOceny() {
    if (!window.showOpenFilePicker) {
        document.getElementById('plikImportu').click();
        return;
    }
    const opcje = {
        types: [{ description: napis('app.59'), accept: { 'application/json': ['.json'] } }],
        multiple: false,
    };
    /* startIn przyjmuje uchwyt pliku i otwiera okno w jego katalogu. */
    const ostatni = await wczytajUchwytKatalogu();
    opcje.startIn = ostatni || 'documents';

    let uchwyt;
    try {
        [uchwyt] = await window.showOpenFilePicker(opcje);
    } catch (e) {
        return; /* użytkownik anulował */
    }
    await zapiszUchwytKatalogu(uchwyt);

    const plik = await uchwyt.getFile();
    const w = importujJSON(await plik.text());
    if (!w.ok) { powiadom(napis('app.60'), w.blad); return; }
    renderujListeOcen();
    powiadom(napis('app.zaimportowano'), napis('app.27', {p0: w.migawek}));
}

/* Zapis pliku z zapamiętaniem katalogu.

   showSaveFilePicker wymaga świeżej interakcji użytkownika. Okna prompt
   i confirm ją zużywają, więc po nich wywołanie kończy się błędem
   SecurityError — a że wcześniej traktowaliśmy każdy błąd jak anulowanie,
   plik po prostu się nie zapisywał i nic tego nie sygnalizowało.
   Teraz odróżniamy rezygnację użytkownika od utraty uprawnienia
   i w tym drugim przypadku wracamy do zwykłego pobierania. */
async function zapiszPlik(nazwa, tresc, opisTypu, rozszerzenie, typMime) {
    if (!window.showSaveFilePicker) {
        pobierzPlik(nazwa, tresc, typMime);
        return { ok: true, klasycznie: true };
    }

    const ostatni = await wczytajUchwytKatalogu();
    let uchwyt;
    try {
        uchwyt = await window.showSaveFilePicker({
            suggestedName: nazwa,
            startIn: ostatni || 'documents',
            types: [{ description: opisTypu, accept: { [typMime]: [rozszerzenie] } }],
        });
    } catch (e) {
        if (e && e.name === 'AbortError') return { ok: false, anulowane: true };
        /* Brak uprawnienia albo inny błąd okna — plik i tak musi trafić
           do użytkownika, więc pobieramy go klasycznie. */
        pobierzPlik(nazwa, tresc, typMime);
        return { ok: true, klasycznie: true, powod: e && e.name };
    }

    try {
        const strumien = await uchwyt.createWritable();
        await strumien.write(tresc instanceof Blob ? tresc : new Blob([tresc], { type: typMime }));
        await strumien.close();
    } catch (e) {
        pobierzPlik(nazwa, tresc, typMime);
        return { ok: true, klasycznie: true, powod: e && e.name };
    }

    await zapiszUchwytKatalogu(uchwyt);
    return { ok: true, nazwa: uchwyt.name };
}

function importujPlik(ev) {
    const plik = ev.target.files && ev.target.files[0];
    if (!plik) return;
    const czyt = new FileReader();
    czyt.onload = () => {
        const w = importujJSON(czyt.result);
        if (!w.ok) { powiadom(napis('app.60'), w.blad); return; }
        renderujListeOcen();
        powiadom(napis('app.zaimportowano'), napis('app.27', {p0: w.migawek}));
    };
    czyt.readAsText(plik, 'utf-8');
    ev.target.value = '';
}

async function zapiszMigawkeUI() {
    if (!stan) { powiadom(napis('app.61'), napis('app.62')); return; }

    /* Tylko jedno okno przed zapisem. Każde blokujące okno zużywa
       uprawnienie do otwarcia okna zapisu pliku, więc łańcuch
       prompt → confirm → showSaveFilePicker kończył się cichą porażką. */
    const notatka = prompt(
        napis('app.63') +
        napis('app.64'), '');
    if (notatka === null) return;

    zapiszMigawke(notatka);
    odswiezPostep();
    if (kroki[biezacyKrok] && kroki[biezacyKrok].typ === 'wyniki') renderujWyniki();

    /* Migawka w pamięci przeglądarki chroni przed zamknięciem karty, ale nie
       przed wyczyszczeniem danych ani zmianą komputera — dlatego od razu
       zapisujemy plik. */
    const p = eksportujJSON(stan.id);
    const w = await zapiszPlik(p.nazwaPliku, p.tresc, napis('app.59'), '.json', 'application/json');

    if (w.anulowane) {
        powiadom(napis('app.65'),
            napis('app.28', {p0: stan.migawki.length}));
        return;
    }
    powiadom(napis('app.66'),
        (w.nazwa || p.nazwaPliku) + (w.klasycznie ? napis('app.plikDoPobrania') : ''));
}

function pobierzPlik(nazwa, tresc, typ) {
    const blob = tresc instanceof Blob ? tresc : new Blob([tresc], { type: typ + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = nazwa;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ── TRYB OFFLINE ──────────────────────────────────────────
   Narzędzie bywa uruchamiane w sieciach odciętych od internetu albo
   z monitorowanym ruchem wychodzącym. Jeden przełącznik wyłącza
   wszystkie zapytania do rejestrów; reszta działa bez zmian. */
const KLUCZ_OFFLINE = 'nis2_offline';

function trybOffline() {
    try { return localStorage.getItem(KLUCZ_OFFLINE) === '1'; }
    catch (e) { return false; }
}

function przelaczTrybOffline() {
    const nowy = !trybOffline();
    try { localStorage.setItem(KLUCZ_OFFLINE, nowy ? '1' : '0'); } catch (e) { /* brak magazynu */ }
    odswiezPrzyciskOffline();
    powiadom(nowy ? napis('app.offlineWlaczony') : napis('app.67'),
        nowy ? napis('app.offlineOpis')
             : napis('app.68'));
}

function odswiezPrzyciskOffline() {
    const b = document.getElementById('btnOffline');
    if (!b) return;
    const wl = trybOffline();
    b.classList.toggle('aktywny', wl);
    b.title = wl
        ? napis('app.offlineTytul')
        : napis('app.69');
    b.textContent = wl ? 'Offline' : 'Online';
}

/* ── POBRANIE DANYCH PO NIP ────────────────────────────────
   Uruchamiane samo po wpisaniu poprawnego numeru — wpisanie NIP
   w polu opisanym „wyszukanie po numerze NIP” jest jednoznaczną
   intencją, a do rejestru trafia wyłącznie ten numer. */
let licznikNip = null;
let ostatniPobranyNip = null;

function nipWpisany(wartosc) {
    clearTimeout(licznikNip);
    const nip = String(wartosc || '').replace(/[^0-9]/g, '');
    if (nip.length !== 10 || !nipPoprawny(nip) || nip === ostatniPobranyNip || trybOffline()) return;
    /* Krótkie opóźnienie, żeby nie odpytywać przy każdym znaku
       podczas wklejania albo poprawiania numeru. */
    licznikNip = setTimeout(() => pobierzZRejestru(true), 600);
}

async function pobierzZRejestru(automatycznie) {
    const nip = document.getElementById('polNip').value;
    const btn = document.getElementById('btnPobierzNip');
    const el = document.getElementById('wynikNip');

    if (!nipPoprawny(nip)) {
        if (!automatycznie) {
            el.innerHTML = `<div class="alert alert-warning small mt-2 mb-0">${napis('app.4')}</div>`;
        }
        return;
    }
    if (trybOffline()) {
        el.innerHTML = `<div class="alert alert-secondary small mt-2 mb-0">${napis('app.5')}</div>`;
        return;
    }
    ostatniPobranyNip = String(nip).replace(/[^0-9]/g, '');

    btn.disabled = true;
    const etykieta = btn.textContent;
    btn.textContent = napis('app.pobieram');
    el.innerHTML = `<div class="small text-secondary mt-2">${napis('app.6')}</div>`;

    const w = await pobierzDanePoNip(nip);
    btn.disabled = false;
    btn.textContent = etykieta;

    if (!w.ok) {
        el.innerHTML = `<div class="alert alert-danger small mt-2 mb-0">${esc(w.blad)}</div>`;
        return;
    }

    const p = stan.profil;
    p.nip = w.nip; p.nazwa = w.nazwa || p.nazwa; p.regon = w.regon || '';
    p.krs = w.krs || ''; p.adres = w.adres || ''; p.formaPrawna = w.formaPrawna || '';
    p.pobranoZRejestru = new Date().toISOString();
    stan.nazwa = p.nazwa;

    /* Role zaznaczamy od razu — użytkownik i tak musi je zweryfikować,
       a zaczynanie od pustej listy zmuszałoby do przepisywania tego,
       co rejestry już podpowiedziały. */
    const noweRole = (w.sugerowaneRole || [])
        .map(s => s.rolaId)
        .filter(id => ROLA_WG_ID[id] && !p.role.includes(id));
    p.role.push(...noweRole);

    /* Wpis do rejestru UKE potwierdza część obowiązków wprost. */
    let wypelnionych = 0;
    (w.wstepneOdpowiedzi || []).forEach(x => {
        const z = { dowod: x.dowod };
        if (x.stan) z.stan = x.stan;
        ustawOdpowiedz(x.pytanieId, z);
        wypelnionych++;
    });
    zapiszOceny();

    window.__wstepne = w.wstepneOdpowiedzi || [];
    const rpt = w.rpt;

    el.innerHTML = `<div class="alert alert-success small mt-2 mb-0">
        <div class="fw-semibold mb-1">${napis('app.12', {p0: esc(w.nazwa)})}</div>
        <div class="text-secondary">${napis('app.13', {p0: esc(w.zrodla.join(' + ')), p1: w.statusVat ? napis('app.statusVat') + esc(w.statusVat) : ''})}</div>

        ${rpt && rpt.aktywny ? `<div class="mt-2 p-2 rounded ramka-rpt">
            <div class="fw-semibold">${napis('app.8')}</div>
            <div>${napis('app.numerWpisu', {p0: '<strong>' + esc(rpt.wpis.nr) + '</strong>', p1: esc(rpt.wpis.dataWpisu)})}${rpt.stanNa ? napis('app.stanRejestruNa') + esc(rpt.stanNa) : ''}</div>
            ${rpt.wpis.uslugi ? `<div class="mt-1"><span class="text-secondary">${napis('app.7')}</span> ${esc(rpt.wpis.uslugi)}</div>` : ''}
            ${rpt.wpis.obszar ? `<div><span class="text-secondary">${napis('app.obszarDwukropek')}</span> ${esc(rpt.wpis.obszar)}</div>` : ''}
          </div>` : ''}

        ${noweRole.length ? `<div class="mt-2">
            <div class="fw-semibold">${napis('app.9')}</div>
            <div class="d-flex flex-wrap gap-1 my-1">${w.sugerowaneRole.filter(s => noweRole.includes(s.rolaId)).map(s =>
                `<span class="badge ${s.pewnosc >= 4 ? 'bg-success-subtle text-success-emphasis' : 'bg-primary-subtle text-primary-emphasis'}">${esc((ROLA_WG_ID[s.rolaId] || {}).nazwa || s.rolaId)} <span class="opacity-75">(${esc(s.kod)})</span></span>`).join('')}</div>
            <div class="tekst-uwaga">${napis('app.10')}</div>
        </div>` : napis('app.70')}
        ${wypelnionych ? `<div class="mt-2">${napis('app.11', {p0: wypelnionych})}</div>` : ''}

        ${w.ostrzezenia.map(o => `<div class="mt-2 tekst-uwaga">${esc(o)}</div>`).join('')}
      </div>`;

    renderujProfil();
    zbudujKroki();
}


/* ── SPRAWOZDANIE FINANSOWE ────────────────────────────────
   Plik czytany jest wyłącznie w przeglądarce, nic nie jest wysyłane. */
async function wczytajSprawozdanie(ev) {
    const plik = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!plik || !stan) return;

    const el = document.getElementById('wynikSF');
    el.innerHTML = napis('app.71');

    const w = await esfWczytaj(plik);
    if (!w.ok) {
        el.innerHTML = `<div class="alert alert-danger small mt-2 mb-0">${esc(w.blad)}</div>`;
        return;
    }

    const p = stan.profil;
    const uzupelnione = [];
    if (w.przychodBiezacy !== null) { p.przychod = Math.round(w.przychodBiezacy); uzupelnione.push(napis('app.72')); }
    if (w.nazwa && !p.nazwa) { p.nazwa = w.nazwa; stan.nazwa = w.nazwa; uzupelnione.push('nazwa'); }
    if (w.nip && !p.nip) { p.nip = w.nip; uzupelnione.push('NIP'); }
    if (w.krs && !p.krs) { p.krs = w.krs; uzupelnione.push('KRS'); }
    if (w.adres && !p.adres) { p.adres = w.adres; uzupelnione.push('adres'); }
    zapiszOceny();

    const podsumowanieSF = `
        <div class="fw-semibold mb-1">${napis('app.17', {p0: esc(w.nazwa || 'podmiot bez nazwy')})}</div>
        <div class="text-secondary">
          ${esc(w.rodzajSprawozdania || '')}${w.wariantRZiS ? napis('app.73') + esc(w.wariantRZiS) : ''}
          ${esfOpisOkresu(w) ? ' · okres ' + esc(esfOpisOkresu(w)) : ''}
        </div>
        ${w.przychodBiezacy !== null ? `<div class="mt-2">
          <div><strong>${napis('app.15', {p0: formatujGrupy(Math.round(w.przychodBiezacy))})}</strong> (${esc(slownieKwota(w.przychodBiezacy))})</div>
          ${w.przychodPoprzedni !== null ? `<div class="text-secondary">${napis('app.14', {p0: formatujGrupy(Math.round(w.przychodPoprzedni))})}</div>` : ''}
        </div>` : ''}
        ${uzupelnione.length ? `<div class="mt-2">${napis('app.16', {p0: esc(uzupelnione.join(', '))})}</div>` : ''}
        ${w.ostrzezenia.map(o => `<div class="mt-2 tekst-uwaga">${esc(o)}</div>`).join('')}`;

    el.innerHTML = `<div class="alert alert-success small mt-2 mb-0">${podsumowanieSF}</div>`;
    renderujProfil();

    /* Sprawozdanie niesie numer NIP, więc resztę danych i role dobieramy
       od razu — bez przepisywania numeru do drugiego pola. */
    if (!w.nip || trybOffline()) {
        if (w.nip && trybOffline()) {
            el.insertAdjacentHTML('beforeend',
                `<div class="alert alert-secondary small mt-2 mb-0">${napis('app.18')}</div>`);
        }
        return;
    }

    el.insertAdjacentHTML('beforeend',
        `<div class="small text-secondary mt-2" id="stanRejestrow">${napis('app.19', {p0: esc(w.nip)})}</div>`);

    const r = await pobierzDanePoNip(w.nip);
    const stanEl = document.getElementById('stanRejestrow');

    if (!r.ok) {
        if (stanEl) stanEl.outerHTML =
            `<div class="alert alert-warning small mt-2 mb-0">${napis('app.20', {p0: esc(r.blad)})}
             <span class="d-block">${napis('app.21')}</span></div>`;
        return;
    }

    /* Uzupełniamy wyłącznie pola puste — dane ze sprawozdania mają
       pierwszeństwo, bo pochodzą z dokumentu podpisanego przez podmiot. */
    if (r.regon && !p.regon) p.regon = r.regon;
    if (r.formaPrawna && !p.formaPrawna) p.formaPrawna = r.formaPrawna;
    if (r.krs && !p.krs) p.krs = r.krs;
    if (r.adres && !p.adres) p.adres = r.adres;

    const nowe = (r.sugerowaneRole || []).map(s => s.rolaId).filter(id => ROLA_WG_ID[id] && !p.role.includes(id));
    p.role.push(...nowe);
    zapiszOceny();

    /* Wpis do rejestru UKE potwierdza część obowiązków wprost. */
    let wypelnionych = 0;
    (r.wstepneOdpowiedzi || []).forEach(x => {
        const z = { dowod: x.dowod };
        if (x.stan) z.stan = x.stan;
        ustawOdpowiedz(x.pytanieId, z);
        wypelnionych++;
    });

    renderujProfil();
    zbudujKroki();

    if (stanEl) stanEl.outerHTML = `<div class="alert alert-success small mt-2 mb-0">
        <div class="fw-semibold mb-1">${napis('app.23')}</div>
        <div class="text-secondary">${napis('app.13', {p0: esc(r.zrodla.join(' + ')), p1: r.statusVat ? napis('app.statusVat') + esc(r.statusVat) : ''})}</div>
        ${r.rpt && r.rpt.aktywny ? `<div class="mt-2 p-2 rounded ramka-rpt">
            <div class="fw-semibold">${napis('app.8')}</div>
            <div>${napis('app.22', {p0: esc(r.rpt.wpis.nr), p1: esc(r.rpt.wpis.dataWpisu)})}</div>
          </div>` : ''}
        ${nowe.length ? `<div class="mt-2">
            <div class="fw-semibold">${napis('app.9')}</div>
            <div class="d-flex flex-wrap gap-1 my-1">${nowe.map(id =>
                `<span class="badge bg-primary-subtle text-primary-emphasis">${esc(ROLA_WG_ID[id].nazwa)}</span>`).join('')}</div>
            <div class="tekst-uwaga">${napis('app.10')}</div>
          </div>` : napis('app.74')}
        ${wypelnionych ? `<div class="mt-2">${napis('app.11', {p0: wypelnionych})}</div>` : ''}
      </div>`;

    powiadom(napis('app.75'),
        napis('app.29', {p0: nowe.length ? napis('app.zaznaczonoRol', {p0: nowe.length}) : ''}));
}


/* ── MOTYW ─────────────────────────────────────────────────*/
function przelaczMotyw() {
    const h = document.documentElement;
    const nowy = h.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    h.setAttribute('data-bs-theme', nowy);
    try { localStorage.setItem(KLUCZ_MOTYW, nowy); } catch (e) { /* brak magazynu */ }
    odswiezIkoneMotywu(nowy);
    if (kroki[biezacyKrok] && kroki[biezacyKrok].typ === 'wyniki') renderujWyniki();
}

/* Bez własnego wyboru idziemy za ustawieniem systemu — tym samym, za
   którym idzie strona z narzędziami. Dzięki temu przejście ze strony do
   narzędzia nie przełącza motywu w połowie kliknięcia. Własny wybór
   z przycisku jest zapamiętywany i ma pierwszeństwo nad systemem. */
function motywSystemu() {
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function przywrocMotyw() {
    let zapisany = null;
    try { zapisany = localStorage.getItem(KLUCZ_MOTYW); } catch (e) { /* brak magazynu */ }
    const m = zapisany === 'dark' || zapisany === 'light' ? zapisany : motywSystemu();
    document.documentElement.setAttribute('data-bs-theme', m);
    odswiezIkoneMotywu(m);

    /* Zmiana ustawienia systemu w trakcie pracy przestawia motyw tylko
       tym, którzy sami niczego nie wybrali. */
    if (!zapisany && window.matchMedia) {
        matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            let nadal = null;
            try { nadal = localStorage.getItem(KLUCZ_MOTYW); } catch (x) { /* brak magazynu */ }
            if (nadal) return;
            const nowyMotyw = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-bs-theme', nowyMotyw);
            odswiezIkoneMotywu(nowyMotyw);
            if (kroki[biezacyKrok] && kroki[biezacyKrok].typ === 'wyniki') renderujWyniki();
        });
    }
}

/* Wypełniona połówka koła wskazuje, w którą stronę przełącznik zadziała:
   lewa przy jasnym motywie, prawa przy ciemnym. */
function odswiezIkoneMotywu(motyw) {
    const ik = document.getElementById('ikonaMotywu');
    if (!ik) return;
    ik.setAttribute('d', motyw === 'dark' ? 'M8 2a6 6 0 010 12z' : 'M8 2a6 6 0 000 12z');
    const btn = document.getElementById('btnMotyw');
    if (btn) btn.setAttribute('aria-pressed', motyw === 'dark' ? 'true' : 'false');
}
