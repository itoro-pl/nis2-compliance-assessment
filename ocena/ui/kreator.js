/* ==========================================================
   Kreator: ekran startowy, profil podmiotu, sekcje pytań
   ========================================================== */

let kroki = [];        // [{id, etykieta, typ, sekcja?}]
let biezacyKrok = 0;

function esc(s) {
    return String(s === null || s === undefined ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Odesłanie do przepisu jako element klikalny.
   Zawsze pokazuje, z którego aktu pochodzi — samo „art. 9 ust. 1 pkt 1”
   jest niejednoznaczne, bo taki przepis jest w kilku aktach naraz. */
function odeslanieHtml(tekst, domyslnyAkt) {
    if (!tekst) return '';
    const o = opisOdeslania(tekst, domyslnyAkt);
    const adres = adresPrzepisu(o);
    /* Objaśnienie w nawiasie na końcu („(przedsiębiorca komunikacji
       elektronicznej…)") nie jest częścią odesłania — idzie za plakietkę
       jako zwykły tekst, żeby plakietka została krótka i jednowierszowa. */
    const m = String(o.tresc || o.tekst).match(/^(.*?\S)\s+(\([^()]*\p{L}{3,}[^()]*\))$/u);
    const tresc = m ? m[1] : (o.tresc || o.tekst);
    const dopisek = m ? `<span class="odeslanie-tekst">${esc(m[2])}</span>` : '';
    const etykieta = `<span class="odeslanie-akt" style="--akt:${o.kolor || '#4b5563'}">${esc(o.skrot || napis('kreator.32'))}</span><span class="odeslanie-tresc">${esc(tresc)}</span>`;

    if (!adres) return `<span class="odeslanie" title="${esc(o.tekst)}">${etykieta}</span>${dopisek}`;

    /* Przepis może być dodany ustawą nowelizującą — wtedy odsyłamy do niej,
       bo w tekście jednolitym sprzed nowelizacji jeszcze go nie ma.
       Trzeba to widać, żeby nikt nie szukał go w niewłaściwym dokumencie. */
    const docelowy = o.wInnymAkcie ? ((AKTY_PLIKI[o.wInnymAkcie] || {}).skrot || (AKTY_SKROTY[o.wInnymAkcie] || {}).skrot) : null;
    /* Numer strony jest tylko w PDF; kotwica w HTML (art_21) to nie strona. */
    const naStronie = typeof o.strona === 'number';
    const podpowiedz = [
        o.tekst,
        napis('kreator.przepis') + (o.tytulAktu || ''),
        o.dziennik,
        o.wInnymAkcie ? napis('kreator.33') + (AKTY_PLIKI[o.wInnymAkcie] || {}).tytul : null,
        naStronie ? napis('kreator.strona', {p0: o.strona}) : null,
    ].filter(Boolean).join(' · ');

    const plakietkaStrony = naStronie
        ? `<span class="odeslanie-strona">${docelowy ? esc(docelowy) + ' ' : ''}${napis('kreator.stronaSkrot', {p0: o.strona})}</span>`
        : '';

    return `<a class="odeslanie odeslanie-link ${docelowy ? 'odeslanie-przekierowane' : ''}" href="${esc(adres)}"
        target="_blank" rel="noopener" title="${esc(podpowiedz)}">${etykieta}${plakietkaStrony}</a>${dopisek}`;
}

/* Rozbicie swobodnego opisu podstawy prawnej na klikalne odesłania.
   Podstawy bywają złożone: „art. 33 ust. 1 ustawy z 23.01.2026 o zmianie
   ustawy o KSC, art. 16 pkt 1 ustawy o KSC” to dwa różne akty w jednym
   zdaniu. Dzielimy po przecinku poprzedzającym kolejne „art.”, żeby każde
   odesłanie zachowało własną nazwę ustawy i trafiło do właściwego pliku.
   Fragmenty bez numeru artykułu zostają zwykłym tekstem. Plakietki stoją
   w kontenerze flex (bez przecinków), więc w kolumnie tabeli zawijają się
   równo do lewej krawędzi zamiast rozjeżdżać za przecinkiem. */
function odeslaniaZTekstu(tekst, domyslnyAkt) {
    if (!tekst) return '';
    const wz = typeof ODESLANIA_WZORCE !== 'undefined' ? ODESLANIA_WZORCE : {};
    const czesci = String(tekst).split(wz.podzial || /,\s*(?=art\.|załącznik|sekcja|pkt\s+\d)/i);
    const html = czesci.map(cz => {
        const t = cz.trim();
        if (!t) return '';
        return (wz.odeslanie || /art\.|załącznik|sekcja/i).test(t) ? odeslanieHtml(t, domyslnyAkt) : `<span class="odeslanie-tekst">${esc(t)}</span>`;
    }).filter(Boolean).join('');
    return html ? `<span class="odeslania">${html}</span>` : '';
}

/* Odesłania wplecione w zdania — „…zgodnie z art. 53 ust. 3 pkt 1…” —
   też mają być klikalne, a nie tylko te stojące osobno jako podstawa.
   Przebieg działa na węzłach tekstowych już wyrenderowanego drzewa, więc
   nie ma ryzyka popsucia znaczników: nie dotyka wnętrza odsyłaczy, pól
   formularza ani elementów, które same są odesłaniem. Akt rozpoznajemy
   z całego zdania, bo sam numer artykułu jest niejednoznaczny — art. 8
   istnieje i w ustawie o KSC, i w PKE. */
const WZOR_PRZEPISU = /art\.\s*\d+[a-z]{0,2}(?:\s+ust\.\s*\d+[a-z]?)?(?:\s+pkt\s*\d+[a-z]?)?(?:\s+lit\.\s*[a-z])?/gi;

function podlinkujPrzepisyWTekscie(kontener) {
    if (!kontener) return;
    const pomijane = new Set(['A', 'SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'CANVAS']);
    const chodzik = document.createTreeWalker(kontener, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
            if (!WZOR_PRZEPISU.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
            WZOR_PRZEPISU.lastIndex = 0;
            for (let e = n.parentElement; e && e !== kontener; e = e.parentElement) {
                if (pomijane.has(e.tagName) || e.classList.contains('odeslanie')) return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    const doZamiany = [];
    while (chodzik.nextNode()) doZamiany.push(chodzik.currentNode);

    doZamiany.forEach(wezel => {
        const zdanie = wezel.nodeValue;
        const akt = rozpoznajAkt(zdanie) || rozpoznajAkt(wezel.parentElement ? wezel.parentElement.textContent : '') || 'ksc';
        const czesci = document.createDocumentFragment();
        let ostatni = 0;
        zdanie.replace(WZOR_PRZEPISU, (trafienie, poz) => {
            if (poz > ostatni) czesci.appendChild(document.createTextNode(zdanie.slice(ostatni, poz)));
            const o = opisOdeslania(trafienie, akt);
            const adres = adresPrzepisu(o);
            if (adres) {
                const a = document.createElement('a');
                a.className = 'przepis-w-tekscie';
                a.href = adres; a.target = '_blank'; a.rel = 'noopener';
                a.title = [o.tytulAktu, o.dziennik, typeof o.strona === 'number' ? napis('kreator.strona', {p0: o.strona}) : null].filter(Boolean).join(' · ');
                a.textContent = trafienie;
                czesci.appendChild(a);
            } else {
                czesci.appendChild(document.createTextNode(trafienie));
            }
            ostatni = poz + trafienie.length;
            return trafienie;
        });
        if (ostatni < zdanie.length) czesci.appendChild(document.createTextNode(zdanie.slice(ostatni)));
        wezel.parentNode.replaceChild(czesci, wezel);
    });
}

function powiadom(tytul, tresc) {
    document.getElementById('tytulPowiadomienia').textContent = tytul;
    document.getElementById('trescPowiadomienia').textContent = tresc;
    new bootstrap.Toast(document.getElementById('powiadomienie'), { delay: 5000 }).show();
}

/* ── EKRAN STARTOWY ────────────────────────────────────────*/
/* Pytania na ekranie startowym — te same odpowiedzi, które wracają
   potem przy właściwych obszarach oceny. Ktoś, kto dopiero wchodzi,
   ma tu znaleźć odpowiedź na pierwsze wątpliwości bez czytania ustawy. */
function renderujFaqStart() {
    const el = document.getElementById('faqStart');
    if (!el || typeof faqNaStart !== 'function') return;
    el.innerHTML = faqNaStart().map(q => `<details class="faq">
        <summary>${esc(q.p)}</summary>
        <div class="faq-odpowiedz">
          <p class="mb-1">${esc(q.o)}</p>
          ${q.art ? `<div class="small">${odeslaniaZTekstu(q.art, 'ksc')}</div>` : ''}
        </div>
      </details>`).join('') +
      `<p class="small text-secondary mt-2 mb-0">
         ${napis('kreator.1')} <a href="${esc(FAQ_ZRODLO.url)}" target="_blank" rel="noopener">${esc(FAQ_ZRODLO.nazwa)}</a>.
         ${esc(FAQ_ZRODLO.zastrzezenie)}</p>`;
}

function renderujListeOcen() {
    renderujFaqStart();
    const el = document.getElementById('listaOcen');
    if (!oceny.length) {
        el.innerHTML = `<div class="pusto">
            <p class="mb-1 fw-semibold">${napis('kreator.2')}</p>
            <p class="text-secondary small mb-0">${napis('kreator.3')}</p>
        </div>`;
        return;
    }
    /* Karty na pełną szerokość — nazwa podmiotu bywa długa
       („Stowarzyszenie Telewizji Kablowej…”) i nie może być ucinana. */
    el.innerHTML = oceny.map(o => {
        const kl = sklasyfikuj(o.profil);
        const w = policzWynik(o);
        const opis = STATUS_OPIS[kl.status];
        const ost = o.migawki.length ? new Date(o.migawki[o.migawki.length - 1].data).toLocaleDateString(LOCALE.znacznik()) : '—';
        const nazwa = o.profil.nazwa || o.nazwa;
        return `<div class="card karta-oceny mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-2">
                <h5 class="nazwa-oceny mb-0">${esc(nazwa)}</h5>
                <span class="plakietka-status" style="background:${opis.kolor}">${esc(opis.nazwa)}</span>
              </div>
              <div class="text-secondary mb-3 opis-oceny">
                <div><strong>${napis('kreator.roleDwukropek')}</strong> ${o.profil.role.length ? o.profil.role.map(r => esc((ROLA_WG_ID[r] || {}).nazwa || r)).join(' · ') : napis('kreator.34')}</div>
                <div class="mt-1">${napis('kreator.4', {p0: new Date(o.zmieniono).toLocaleDateString(LOCALE.znacznik()), p1: o.migawki.length, p2: o.migawki.length ? ' (ostatnia ' + ost + ')' : ''})}</div>
              </div>
              <div class="d-flex align-items-center gap-4 flex-wrap mb-3">
                ${w.maSkale
                    ? `<div class="miara"><span class="wartosc" style="color:${kolorWyniku(w.ogolny, w.docelowy)}">${w.ogolny.toFixed(1)}</span><span class="etykieta">${napis('kreator.48')}</span></div>`
                    : `<div class="miara"><span class="wartosc">${w.obowiazki.procent === null ? '—' : w.obowiazki.procent + '%'}</span><span class="etykieta">${napis('kreator.49')}</span></div>`}
                <div class="miara"><span class="wartosc">${w.zgodnosc}%</span><span class="etykieta">${napis('kreator.5')}</span></div>
                <div class="miara"><span class="wartosc">${w.odpowiedziano}/${w.pytanRazem}</span><span class="etykieta">${napis('kreator.6')}</span></div>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-primary" onclick="otworzOceneUI('${o.id}')">${napis('kreator.7')}</button>
                <button class="btn btn-outline-secondary" onclick="eksportujOceneUI('${o.id}')">${napis('kreator.eksportuj')}</button>
                <button class="btn btn-outline-secondary" onclick="duplikujOceneUI('${o.id}')">${napis('kreator.duplikuj')}</button>
                <button class="btn btn-outline-danger ms-auto" onclick="usunOceneUI('${o.id}')">${napis('kreator.8')}</button>
              </div>
            </div>
          </div>`;
    }).join('');
}

/* ── PROFIL ────────────────────────────────────────────────*/
function renderujProfil() {
    const p = stan.profil;

    /* Ról jest kilkanaście i pochodzą z trzech różnych sektorów. Bez
       podziału lista zlewa się w jedną ścianę pól wyboru, a podmiot
       publiczny szuka siebie wśród dostawców chmury. */
    const kartaRoli = (r) => `
      <div class="col-md-6">
        <label class="karta-roli ${p.role.includes(r.id) ? 'wybrana' : ''}" for="rola-${r.id}">
          <input class="form-check-input mt-1 me-2" type="checkbox" id="rola-${r.id}" ${p.role.includes(r.id) ? 'checked' : ''}
                 onchange="przelaczRole('${r.id}', this.checked)">
          <span>
            <span class="fw-semibold d-block">${esc(r.nazwa)}</span>
            <span class="small text-secondary d-block">${esc(r.opis)}</span>
            ${r.uwaga ? `<span class="small d-block mt-1 tekst-uwaga">${esc(r.uwaga)}</span>` : ''}
          </span>
        </label>
      </div>`;

    const sektory = [];
    ROLE.forEach(r => {
        let g = sektory.find(x => x.nazwa === r.sektor);
        if (!g) { g = { nazwa: r.sektor, role: [] }; sektory.push(g); }
        g.role.push(r);
    });

    const rol = document.getElementById('listaRol');
    rol.innerHTML = sektory.map(g => `
      <div class="col-12 grupa-rol">
        <div class="grupa-rol-naglowek">${esc(g.nazwa)}</div>
        <div class="row g-2">${g.role.map(kartaRoli).join('')}</div>
      </div>`).join('');

    /* Na liście sama kategoria; progi wybranej kategorii stoją pod polem.
       Pełne „Średni przedsiębiorca — < 250 osób, obrót ≤ 50 mln EUR…"
       nie mieściło się w zamkniętym polu i przeglądarka je ucinała. */
    const wl = document.getElementById('polWielkosc');
    wl.innerHTML = '<option value="">' + napis('kreator.wybierz') + '</option>' +
        WIELKOSC_LISTA.map(w => `<option value="${w.id}" ${p.wielkosc === w.id ? 'selected' : ''}>${esc(w.nazwa)}</option>`).join('');
    if (!wl.dataset.opis) { wl.addEventListener('change', pokazOpisWielkosci); wl.dataset.opis = '1'; }
    pokazOpisWielkosci();

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.value = v === null || v === undefined ? '' : v; };
    set('polNazwa', p.nazwa); set('polNip', p.nip); set('polRegon', p.regon); set('polKrs', p.krs);
    set('polForma', p.formaPrawna); set('polAdres', p.adres); set('polData', p.dataOceny);
    set('polKurs', p.kursEUR);

    /* Kwoty przechowujemy jako liczby, a wyświetlamy z separatorami tysięcy. */
    set('polPrzychod', formatujGrupy(p.przychod));
    set('polPrzychodTelekom', formatujGrupy(p.przychodTelekom));
    set('polWynagrodzenie', formatujGrupy(p.wynagrodzenieKierownika));
    Object.keys(PODGLADY_KWOT).forEach(odswiezPodgladKwoty);
    document.getElementById('polKwalifikowany').checked = !!p.kwalifikowanyDostawcaZaufania;
    document.getElementById('polNiezalezne').checked = !!p.niezalezneSystemy;
    document.getElementById('polMON').checked = !!p.podmiotMON;

    document.getElementById('wierszPrzychodTelekom').style.display = p.role.includes('isp') ? '' : 'none';
    odswiezLinkRdf();
    oznaczBraki(false);
    renderujKlasyfikacje();
}

/* Sprawozdania finansowe nie mają publicznego API, ale są dostępne
   w przeglądarce Repozytorium Dokumentów Finansowych. Podajemy link
   i kopiujemy numer KRS, bo aplikacja RDF jest jednostronicowa i nie
   ma pewności, że odczyta parametr z adresu. */
function odswiezLinkRdf() {
    const el = document.getElementById('linkRdf');
    if (!el) return;
    const krs = (stan.profil.krs || '').replace(/[^0-9]/g, '');
    if (!krs) {
        el.innerHTML = napis('kreator.35');
        return;
    }
    el.innerHTML = `<a href="#" onclick="otworzRdf();return false;">${napis('kreator.9')}</a>
        <span class="text-secondary d-block">${napis('kreator.10')}</span>`;
}

async function otworzRdf() {
    const krs = (stan.profil.krs || '').replace(/[^0-9]/g, '');
    const nip = (stan.profil.nip || '').replace(/[^0-9]/g, '');
    /* Repozytorium wyszukuje po KRS, a gdy go nie znamy — po numerze NIP.
       Aplikacja RDF jest jednostronicowa, więc nie mamy pewności, że odczyta
       parametr z adresu; dlatego numer trafia równolegle do schowka. */
    const szukany = krs || nip;

    const adres = 'https://rdf-przegladarka.ms.gov.pl/wyszukaj-podmiot'
        + (krs ? '?krs=' + encodeURIComponent(krs) : '');
    window.open(adres, '_blank', 'noopener');

    if (!szukany) {
        powiadom(napis('kreator.36'),
            napis('kreator.37'));
        return;
    }

    let skopiowano = false;
    try { await navigator.clipboard.writeText(szukany); skopiowano = true; }
    catch (e) { /* brak uprawnień do schowka */ }

    powiadom(napis('kreator.36'), skopiowano
        ? napis('kreator.29', {p0: krs ? 'KRS' : 'NIP', p1: szukany})
        : napis('kreator.30', {p0: krs ? 'KRS' : 'NIP', p1: szukany}));
}

function podepnijPolaProfilu() {
    const mapa = {
        polNazwa: 'nazwa', polNip: 'nip', polRegon: 'regon', polKrs: 'krs',
        polForma: 'formaPrawna', polAdres: 'adres', polData: 'dataOceny',
        polPrzychod: 'przychod', polPrzychodTelekom: 'przychodTelekom',
        polWynagrodzenie: 'wynagrodzenieKierownika', polKurs: 'kursEUR', polWielkosc: 'wielkosc',
    };
    const kwotowe = ['przychod', 'przychodTelekom', 'wynagrodzenieKierownika'];
    Object.entries(mapa).forEach(([id, klucz]) => {
        const e = document.getElementById(id);
        if (!e) return;
        e.addEventListener('input', () => {
            if (!stan) return;
            stan.profil[klucz] = kwotowe.includes(klucz) ? liczbaZPola(e.value) : e.value;
            if (klucz === 'nazwa') stan.nazwa = e.value || napis('kreator.38');
            stan.zmieniono = new Date().toISOString();
            zapiszOceny();
            if (klucz === 'krs') odswiezLinkRdf();
            if (klucz === 'nip') nipWpisany(e.value);
            oznaczBraki(false);
            if (['wielkosc', 'przychod', 'kursEUR', 'wynagrodzenieKierownika'].includes(klucz)) renderujKlasyfikacje();
            /* Wielkość przesądza o klasyfikacji, a klasyfikacja o tym, jakie
               kroki w ogóle istnieją — bez przebudowy ocena kończyła się
               na profilu, mimo kompletnych danych. */
            if (klucz === 'wielkosc') zbudujKroki();
            odswiezPlakietke();
        });
    });
    podepnijPolaKwotowe();
    [['polKwalifikowany', 'kwalifikowanyDostawcaZaufania'], ['polNiezalezne', 'niezalezneSystemy'], ['polMON', 'podmiotMON']]
        .forEach(([id, klucz]) => {
            document.getElementById(id).addEventListener('change', function () {
                if (!stan) return;
                stan.profil[klucz] = this.checked;
                zapiszOceny(); renderujKlasyfikacje();
                /* Te trzy przełączniki także zmieniają status podmiotu,
                   a więc i zestaw kroków oceny. */
                zbudujKroki(); oznaczBraki(false);
            });
        });
}

function przelaczRole(id, wlaczona) {
    if (!stan) return;
    const r = stan.profil.role;
    if (wlaczona) { if (!r.includes(id)) r.push(id); }
    else { stan.profil.role = r.filter(x => x !== id); }
    zapiszOceny();
    document.getElementById('wierszPrzychodTelekom').style.display = stan.profil.role.includes('isp') ? '' : 'none';
    document.querySelector(`label[for="rola-${id}"]`).classList.toggle('wybrana', wlaczona);
    renderujKlasyfikacje();
    oznaczBraki(false);
    zbudujKroki();
}

function renderujKlasyfikacje() {
    const el = document.getElementById('podgladKlasyfikacji');
    const p = stan.profil;
    if (!p.role.length || !p.wielkosc) {
        el.innerHTML = `<div class="alert alert-secondary small mb-0">${napis('kreator.11')}</div>`;
        return;
    }
    const kl = sklasyfikuj(p);
    const opis = STATUS_OPIS[kl.status];
    const kara = kl.status !== 'poza' ? obliczKare(kl.status, p.przychod, p.kursEUR) : null;

    el.innerHTML = `<div class="card">
      <div class="card-body">
        <h6 class="fw-semibold mb-3">${napis('kreator.klasyfikacja')}</h6>
        <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <span class="plakietka-status" style="background:${opis.kolor}">${esc(opis.nazwa)}</span>
          ${kl.podstawa ? `<span class="small">${odeslaniaZTekstu(kl.podstawa, 'ksc')}</span>` : ''}
        </div>
        <div class="small mb-3">${esc(opis.nadzor)}</div>

        <div class="table-responsive mb-3">
          <table class="table table-sm mb-0">
            <thead><tr><th>${napis('xlsx.rola')}</th><th>${napis('xlsx.status')}</th><th>${napis('kreator.12')}</th><th>${napis('kreator.13')}</th></tr></thead>
            <tbody>${kl.oceny.map(o => `<tr>
              <td>${esc(o.nazwa)}</td>
              <td><span class="badge" style="background:${STATUS_OPIS[o.status].kolor}">${esc(STATUS_OPIS[o.status].nazwa)}</span></td>
              <td class="small">${o.podstawa ? odeslaniaZTekstu(o.podstawa, 'ksc') : '—'}</td>
              <td class="small komorka-organu">${o.organ
                  ? `<span class="organ-nazwa">${esc(o.organ.skrot)}</span>
                     <span class="organ-podstawa">${odeslaniaZTekstu(o.organ.podstawa, 'ksc')}</span>`
                  : '—'}</td>
              <!-- podstawa pokazywana per rola; scalona lista organów jest niżej -->
            </tr>`).join('')}</tbody>
          </table>
        </div>

        ${kl.organy.length ? `<div class="mb-3">
          <div class="small text-secondary mb-1">${napis('kreator.50')}</div>
          <ul class="lista-zwarta small mb-0">${kl.organy.map(o => `<li><strong>${esc(o.organ.nazwa)}</strong>
            <span class="text-secondary">— ${esc(o.podstawy.join(', '))}</span>
            <span class="d-block text-secondary">${napis('kreator.14', {p0: esc(o.role.join(', '))})}</span></li>`).join('')}</ul>
        </div>` : ''}

        ${kl.zestawy.length ? `<div class="mb-3"><div class="small text-secondary mb-1">${napis('kreator.51')}</div>
          ${kl.zestawy.map(z => `<span class="plakietka-warstwa" style="background:${WARSTWY_OPIS[z === 'ksc' ? 'ksc' : z].kolor}">${esc(WARSTWY_OPIS[z === 'ksc' ? 'ksc' : z].nazwa)}</span>`).join(' ')}
          ${kl.zestawy.includes('ksc') ? `<span class="plakietka-warstwa" style="background:${WARSTWY_OPIS['ksc-ob'].kolor}">${esc(WARSTWY_OPIS['ksc-ob'].nazwa)}</span>` : ''}
        </div>` : ''}

        ${kara ? `<div class="alert alert-warning small mb-0">
          <div class="kara-naglowek">${napis('kreator.52')}</div>
          <div class="kara-kwoty">
            <div class="kara-pozycja kara-pozycja-glowna">
              <span class="kara-liczba">${formatujPLN(kara.kwota)}</span>
              <span class="kara-opis">${napis('kreator.53')}</span>
            </div>
            ${kara.wariantProcentowy !== null ? `
            <div class="kara-pozycja">
              <span class="kara-liczba">${formatujPLN(kara.wariantProcentowy)}</span>
              <span class="kara-opis">wariant procentowy — ${(KARY_KSC[kl.status].procentPrzychodu * 100).toLocaleString(LOCALE.znacznik())} % przychodu</span>
            </div>
            <div class="kara-pozycja">
              <span class="kara-liczba">${formatujPLN(kara.wariantKwotowy)}</span>
              <span class="kara-opis">${napis('kreator.15', {p0: KARY_KSC[kl.status].kwotaEUR / 1000000})}</span>
            </div>` : ''}
          </div>
          <p class="small mb-2">${esc(kara.podstawaWyboru)}</p>

          <details class="szczegoly-wymogu mb-2" ${kara.pulapPrzewyzszaPrzychod ? 'open' : ''}>
            <summary>${napis('kreator.54')}</summary>
            <div>
              <ol class="mechanizm-kary">${KARY_KSC.jakPowstajePulap.kroki.map(k => `<li>
                 <span class="mechanizm-tytul">${esc(k.tytul)}</span>
                 <span class="mechanizm-opis">${esc(k.opis)}</span>
                 <span class="mechanizm-podstawa">${odeslaniaZTekstu(k.podstawa, 'ksc')}</span></li>`).join('')}</ol>
              <p class="small mb-0">${esc(KARY_KSC.jakPowstajePulap.wniosek)}</p>
            </div>
          </details>
          ${kara.uwagaProporcjonalnosc ? `<p class="small kara-uwaga mb-1">${esc(kara.uwagaProporcjonalnosc)}</p>` : ''}
          ${kara.uwagaRedakcyjna ? `<p class="small kara-uwaga mb-1">${esc(kara.uwagaRedakcyjna)}</p>` : ''}
          <p class="small text-secondary mb-0">${odeslaniaZTekstu(kara.podstawaPrawna, 'ksc')} · ${napis('kreator.miarkowanie')}${odeslaniaZTekstu(KARY_KSC.miarkowanie.podstawa, 'ksc')} · ${napis('kreator.karyOd')}${new Date(KARY_KSC.odKiedy.data).toLocaleDateString(LOCALE.znacznik())} (${odeslaniaZTekstu(KARY_KSC.odKiedy.podstawa, 'nowelizacja')})</p>
        </div>` : ''}

        ${kl.ostrzezenia.map(o => `<div class="alert alert-info small mb-0 mt-2">${esc(o.tekst)}</div>`).join('')}
      </div></div>`;
}

/* Progi wybranej kategorii wielkości — pod polem wyboru, w całości. */
function pokazOpisWielkosci() {
    const wl = document.getElementById('polWielkosc');
    const opis = document.getElementById('opisWielkosci');
    if (!wl || !opis) return;
    const w = WIELKOSC_LISTA.find(x => x.id === wl.value);
    opis.textContent = w ? w.opis : '';
}

/* ── SEKCJE PYTAŃ ──────────────────────────────────────────*/
function zbudujKroki() {
    const kl = stan ? sklasyfikuj(stan.profil) : { status: 'poza', zestawy: [] };
    const gotowyProfil = stan && stan.profil.role.length && stan.profil.wielkosc;
    const sekcje = gotowyProfil ? sekcjeWybrane(stan.profil, kl) : [];

    kroki = [{ id: 'start', etykieta: napis('kreator.39'), typ: 'start' }];
    if (stan) {
        kroki.push({ id: 'profil', etykieta: napis('kreator.40'), typ: 'profil' });

        /* Dalsze kroki pokazujemy ZAWSZE, także zanim profil będzie
           kompletny — inaczej użytkownik widzi „Krok 1” bez ciągu dalszego,
           przycisk podpisany „Koniec oceny” i nie ma pojęcia, że ocena
           dopiero się zaczyna. Dopóki profil nie wskazuje ról i wielkości,
           kroki są zablokowane: widać drogę, ale nie da się jej przeskoczyć. */
        const zablokowane = !gotowyProfil;

        /* Raport wstępny przed pytaniami — to on niesie najważniejszą treść:
           status, organy, kary, terminy. Nie wymaga żadnej odpowiedzi. */
        kroki.push({ id: 'raport-wstepny', etykieta: napis('kreator.41'), typ: 'raport-wstepny', zablokowany: zablokowane });
        kroki.push({ id: 'moduly', etykieta: napis('kreator.42'), typ: 'moduly', zablokowany: zablokowane });
        sekcje.forEach(s => kroki.push({ id: s.id, etykieta: s.nazwa, typ: 'sekcja', sekcja: s }));
        kroki.push({ id: 'wyniki', etykieta: napis('kreator.43'), typ: 'wyniki', zablokowany: zablokowane });
    }

    renderujSekcje(sekcje);
    renderujNawigacje();
    odswiezPostep();
}

/* ── WYBÓR MODUŁÓW ─────────────────────────────────────────*/
function renderujModuly() {
    const kl = sklasyfikuj(stan.profil);
    const wszystkie = zbudujKwestionariusz(stan.profil, kl);
    const dostepne = moduleDostepne(kl);
    const wybrane = stan.profil.moduly && stan.profil.moduly.length
        ? stan.profil.moduly
        : moduleDomyslne(kl).map(m => m.id);

    const razem = dostepne.reduce((a, m) => a + statystykaModulu(m, wszystkie, stan.odpowiedzi).pytan, 0);
    const sekcjeWybranych = dostepne.filter(m => wybrane.includes(m.id))
        .flatMap(m => wszystkie.filter(m.sekcje));
    const czasWybranych = sekcjeWybranych.length ? szacujCzas(sekcjeWybranych) : napis('kreator.44');
    const wybranePytan = dostepne.filter(m => wybrane.includes(m.id))
        .reduce((a, m) => a + statystykaModulu(m, wszystkie, stan.odpowiedzi).pytan, 0);

    document.getElementById('trescModulow').innerHTML = `
      <div class="alert alert-secondary small">
        ${napis('kreator.16')} <strong>${napis('kreator.17', {p0: razem})}</strong> ${napis('kreator.18')}
      </div>

      ${kl.zestawy.includes('reg2690') ? `<div class="alert alert-warning small">
        <strong>${napis('kreator.55')}</strong>
        ${napis('kreator.56')}
        <strong>${napis('kreator.przepisReg2690')}</strong>${napis('kreator.57')} <strong>${napis('kreator.terminReg2690')}</strong>${napis('kreator.58')}
      </div>` : ''}

      <div class="row g-3">
        ${dostepne.map(m => {
            const st = statystykaModulu(m, wszystkie, stan.odpowiedzi);
            const jest = wybrane.includes(m.id);
            const pct = st.pytan ? Math.round(st.wypelnionych / st.pytan * 100) : 0;
            return `<div class="col-lg-6">
              <label class="karta-modulu ${jest ? 'wybrana' : ''}" for="mod-${m.id}">
                <div class="d-flex align-items-start gap-2">
                  <input class="form-check-input mt-1" type="checkbox" id="mod-${m.id}" ${jest ? 'checked' : ''}
                         onchange="przelaczModul('${m.id}', this.checked)">
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start gap-2">
                      <span class="fw-semibold">${esc(m.nazwa)}</span>
                      ${m.szybki ? '<span class="znacznik znacznik-szybki">' + napis('wspolne.punktWyjscia') + '</span>' : m.zalecany ? '<span class="znacznik znacznik-zalecany">' + napis('wspolne.zalecany') + '</span>' : ''}
                    </div>
                    <div class="small text-secondary mt-1">${esc(m.dlaczego)}</div>
                    <div class="d-flex flex-wrap gap-2 mt-2 small">
                      <span class="plakietka-warstwa" style="background:${m.szybki ? 'var(--marka-plakietka)' : WARSTWY_OPIS[m.warstwa].kolor}">${esc(m.szybki ? napis('wspolne.przekrojowy') : WARSTWY_OPIS[m.warstwa].skrot)}</span>
                      <span class="text-secondary">${napis('kreator.59', {p0: st.pytan, p1: esc(st.czas)})}</span>
                    </div>
                    ${!m.szybki && STOSOWANIE[m.warstwa] ? `<div class="termin-modulu">
                      ${esc(STOSOWANIE[m.warstwa].naglowek)}</div>` : ''}
                    ${st.wypelnionych ? `<div class="postep-modulu mt-2">
                      <div class="progress flex-grow-1" style="height:4px;"><div class="progress-bar bg-success" style="width:${pct}%"></div></div>
                      <span class="small text-secondary">${st.wypelnionych}/${st.pytan}</span>
                    </div>` : ''}
                  </div>
                </div>
              </label></div>`;
        }).join('')}
      </div>

      <div class="d-flex flex-wrap align-items-center gap-2 mt-3">
        <button class="btn btn-sm btn-outline-secondary" onclick="ustawModuly('zalecane')">${napis('kreator.19')}</button>
        <button class="btn btn-sm btn-outline-secondary" onclick="ustawModuly('wszystkie')">${napis('kreator.20')}</button>
        <button class="btn btn-sm btn-outline-secondary" onclick="ustawModuly('zadne')">${napis('kreator.21')}</button>
      </div>

      <div class="podsumowanie-wyboru">
        <div class="podsumowanie-pozycja">
          <span class="podsumowanie-liczba">${wybranePytan}</span>
          <span class="podsumowanie-opis">${napis('kreator.22', {p0: razem})}</span>
        </div>
        <div class="podsumowanie-pozycja">
          <span class="podsumowanie-liczba">${esc(czasWybranych.startsWith(napis('wspolne.okolo')) ? czasWybranych.slice(napis('wspolne.okolo').length) : czasWybranych)}</span>
          <span class="podsumowanie-opis">${napis('kreator.23')}</span>
        </div>
        <p class="podsumowanie-uwaga">
          ${napis('kreator.24')}
        </p>
      </div>`;
}

function przelaczModul(id, wlaczony) {
    const kl = sklasyfikuj(stan.profil);
    const dostepne = moduleDostepne(kl);
    let biezace = stan.profil.moduly && stan.profil.moduly.length
        ? stan.profil.moduly.slice()
        : moduleDomyslne(kl).map(m => m.id);

    if (wlaczony) { if (!biezace.includes(id)) biezace.push(id); }
    else biezace = biezace.filter(x => x !== id);

    /* Pusta lista oznaczałaby powrót do domyślnych modułów zalecanych,
       więc świadome odznaczenie wszystkiego zapisujemy jako znacznik. */
    stan.profil.moduly = biezace.length ? biezace : ['__brak__'];
    zapiszOceny();
    renderujModuly();
    zbudujKroki();
}

function ustawModuly(tryb) {
    const kl = sklasyfikuj(stan.profil);
    const dostepne = moduleDostepne(kl);
    if (tryb === 'wszystkie') stan.profil.moduly = dostepne.map(m => m.id);
    else if (tryb === 'zalecane') stan.profil.moduly = dostepne.filter(m => m.zalecany).map(m => m.id);
    else stan.profil.moduly = ['__brak__'];
    zapiszOceny();
    renderujModuly();
    zbudujKroki();
}

function renderujSekcje(sekcje) {
    const k = document.getElementById('kontenerSekcji');
    k.innerHTML = sekcje.map((s, i) => {
        const w = WARSTWY_OPIS[s.warstwa];
        return `<section class="krok" data-krok="${esc(s.id)}">
          <div class="naglowek-kroku">
            <span class="plakietka-warstwa" style="background:${w.kolor}">${esc(w.nazwa)}</span>
            <h2 class="h5 mb-1 mt-2">${esc(s.nazwa)}</h2>
            <div class="small">${odeslaniaZTekstu(s.podstawa || '', WARSTWA_AKT[s.warstwa])}</div>
          </div>
          ${s.opis ? `<div class="alert alert-secondary small">${esc(s.opis)}</div>` : ''}
          <div class="postep-sekcji mb-3">
            <div class="progress flex-grow-1" style="height:5px;"><div class="progress-bar bg-success" id="postep-${esc(s.id)}" style="width:0%"></div></div>
            <span class="small text-secondary" id="postepTxt-${esc(s.id)}"></span>
          </div>
          ${s.pytania.map((q, qi) => kartaPytania(s, q, qi)).join('')}
        </section>`;
    }).join('');
    sekcje.forEach(s => odswiezPostepSekcji(s));
}

function kartaPytania(sekcja, q, indeks) {
    const typ = typPytania(sekcja, q);
    const a = stan ? normalizujOdpowiedz(stan.odpowiedzi[q.id]) : null;
    const wypelnione = a && (typ === 'skala' ? Number.isFinite(a.poziom) : !!a.stan);

    const kontrolki = typ === 'skala'
        ? `<div class="skala-ocen">${POZIOMY_DOJRZALOSCI.map(m => `
             <button type="button" class="opcja-skali ${a && a.poziom === m.poziom ? 'wybrana' : ''}"
                     onclick="ustawSkale('${q.id}','${sekcja.id}',${m.poziom})" title="${esc(m.opis)}">
               <span class="poziom">${m.poziom}</span><span class="etykieta">${esc(m.nazwa)}</span>
             </button>`).join('')}</div>`
        : `<div class="skala-ocen">${STANY_OBOWIAZKU.map(st => `
             <button type="button" class="opcja-stanu ${a && a.stan === st.id ? 'wybrana' : ''}"
                     style="--kolor:${st.kolor}" onclick="ustawStan('${q.id}','${sekcja.id}','${st.id}')">
               ${esc(st.nazwa)}
             </button>`).join('')}</div>`;

    return `<div class="karta-pytania ${wypelnione ? 'wypelnione' : ''}" id="pyt-${esc(q.id)}">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <div class="numer-pytania">${napis('kreator.pytanieNr', {p0: indeks + 1})}</div>
        <div class="d-flex gap-1 flex-wrap justify-content-end">
          ${q.termin ? `<span class="znacznik znacznik-termin">${esc(q.termin)}</span>` : ''}
          ${q.terminUstawowy ? `<span class="znacznik znacznik-termin">${esc(q.terminUstawowy)}</span>` : ''}
          ${q.czestotliwosc ? `<span class="znacznik znacznik-termin">${esc(q.czestotliwosc)}</span>` : ''}
          ${q.warunkowy ? `<span class="znacznik znacznik-warunkowy" title="${napis('kreator.45')}">${napis('kreator.warunkowy')}</span>` : ''}
          ${q.dlaZarzadu ? `<span class="znacznik znacznik-zarzad">${napis('kreator.60')}</span>` : ''}
          ${q.sankcja ? `<span class="znacznik znacznik-sankcja" title="${napis('kreator.46', {p0: esc(q.sankcja)})}">${napis('kreator.kara')}${esc(q.sankcja)}</span>` : ''}
        </div>
      </div>
      <div class="tresc-pytania">${esc(q.tekst)}</div>
      ${q.trescWymogu ? `<details class="szczegoly-wymogu"><summary>${napis('kreator.61')}</summary><div>${esc(q.trescWymogu).replace(/\n/g, '<br>')}</div></details>` : ''}
      ${q.pomoc ? `<div class="pomoc-pytania">${esc(q.pomoc)}</div>` : ''}
      <div class="meta-pytania">
        ${q.__zrodlo ? `<span class="zrodlo-pytania">${esc(q.__zrodlo)}</span>` : ''}
        ${q.art ? odeslanieHtml(q.art, WARSTWA_AKT[q.__warstwa || sekcja.warstwa]) : ''}
        ${q.iso ? `<span>${esc(q.iso)}</span>` : ''}
        ${q.mapowanieKSC ? `<span>${napis('kreator.62', {p0: esc(q.mapowanieKSC)})}</span>` : ''}
        ${q.warunkowe ? `<span>dotyczy: ${esc(q.warunkowe)}</span>` : ''}
        ${q.doWeryfikacji ? `<span class="tekst-uwaga">${esc(q.doWeryfikacji)}</span>` : ''}
      </div>
      ${kontrolki}
      <details class="dowody" ${a && (a.dowod || a.wlasciciel || a.termin || a.uwagi) ? 'open' : ''}>
        <summary>${napis('kreator.25')}</summary>
        <div class="row g-2 mt-1">
          <div class="col-md-6"><label class="form-label small mb-1" for="dowod-${q.id}">${napis('kreator.26')}</label>
            <input type="text" class="form-control form-control-sm" id="dowod-${q.id}" value="${esc(a && a.dowod)}"
                   oninput="ustawPole('${q.id}','dowod',this.value)" placeholder="${napis('kreator.47')}"></div>
          <div class="col-md-3"><label class="form-label small mb-1" for="wlasciciel-${q.id}">${napis('kreator.27')}</label>
            <input type="text" class="form-control form-control-sm" id="wlasciciel-${q.id}" value="${esc(a && a.wlasciciel)}"
                   oninput="ustawPole('${q.id}','wlasciciel',this.value)"></div>
          <div class="col-md-3"><label class="form-label small mb-1" for="termin-${q.id}">${napis('kreator.28')}</label>
            <input type="date" class="form-control form-control-sm" id="termin-${q.id}" value="${esc(a && a.termin)}"
                   oninput="ustawPole('${q.id}','termin',this.value)"></div>
          <div class="col-12"><label class="form-label small mb-1" for="uwagi-${q.id}">${napis('xlsx.uwagi')}</label>
            <textarea class="form-control form-control-sm" rows="2" id="uwagi-${q.id}"
                      oninput="ustawPole('${q.id}','uwagi',this.value)">${esc(a && a.uwagi)}</textarea></div>
        </div>
      </details>
    </div>`;
}

function ustawSkale(pytanieId, sekcjaId, poziom) {
    ustawOdpowiedz(pytanieId, { poziom });
    odswiezKartePytania(pytanieId, sekcjaId);
}

function ustawStan(pytanieId, sekcjaId, st) {
    ustawOdpowiedz(pytanieId, { stan: st });
    odswiezKartePytania(pytanieId, sekcjaId);
}

function ustawPole(pytanieId, pole, wartosc) {
    const z = {}; z[pole] = wartosc;
    ustawOdpowiedz(pytanieId, z);
}

function odswiezKartePytania(pytanieId, sekcjaId) {
    const karta = document.getElementById('pyt-' + pytanieId);
    if (!karta) return;
    const a = normalizujOdpowiedz(stan.odpowiedzi[pytanieId]);
    karta.classList.add('wypelnione');
    karta.querySelectorAll('.opcja-skali').forEach((b, i) => b.classList.toggle('wybrana', a && a.poziom === POZIOMY_DOJRZALOSCI[i].poziom));
    karta.querySelectorAll('.opcja-stanu').forEach((b, i) => b.classList.toggle('wybrana', a && a.stan === STANY_OBOWIAZKU[i].id));

    const kl = sklasyfikuj(stan.profil);
    const sekcja = zbudujKwestionariusz(stan.profil, kl).find(s => s.id === sekcjaId);
    if (sekcja) odswiezPostepSekcji(sekcja);
    odswiezPostep();
}

function odswiezPostepSekcji(s) {
    const pasek = document.getElementById('postep-' + s.id);
    const txt = document.getElementById('postepTxt-' + s.id);
    if (!pasek) return;
    const n = s.pytania.filter(q => {
        const a = normalizujOdpowiedz(stan.odpowiedzi[q.id]);
        return a && (Number.isFinite(a.poziom) || !!a.stan);
    }).length;
    pasek.style.width = (s.pytania.length ? (n / s.pytania.length) * 100 : 0) + '%';
    txt.textContent = napis('kreator.31', {p0: n, p1: s.pytania.length});
}
