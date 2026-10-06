/* ==========================================================
   Raport zgodności: podsumowanie dla zarządu, wykresy, luki,
   ryzyko prawne, kalendarz, porównanie migawek
   ========================================================== */

let wykresRadar = null, wykresSlupki = null, wykresTrend = null;

function renderujWyniki() {
    const w = policzWynik(stan);
    const p = stan.profil;
    const kl = w.klasyfikacja;

    document.getElementById('podtytulWynikow').textContent =
        `${p.nazwa || napis('dashboard.112')} · ${STATUS_OPIS[kl.status].nazwa}${napis('dashboard.stanNa')}${new Date().toLocaleDateString(LOCALE.znacznik())}`;

    const el = document.getElementById('trescWynikow');
    if (kl.status === 'poza') {
        el.innerHTML = `<div class="alert alert-secondary">${napis('dashboard.1')}</div>`;
        return;
    }

    const kara = obliczKare(kl.status, p.przychod, p.kursEUR);
    const kier = obliczKareKierownika(p.wynagrodzenieKierownika, p.role.includes('isp'), kontekstKierownika(p));

    el.innerHTML = [
        sekcjaZarzadu(w, p, kl),
        blokKar(kara, kier, p, kl),
        sekcjaKafelkow(w),
        sekcjaWykresow(),
        sekcjaWarstw(w),
        sekcjaLuk(w),
        sekcjaRyzykaPrawnego(w),
        sekcjaKalendarza(w),
        sekcjaProgowIncydentow(p),
        sekcjaMigawek(),
        sekcjaEksportu(),
    ].join('');

    rysujWykresy(w);
}

/* Pozycja „akt krajowy" na liście obowiązujących przepisów raportu
   wstępnego. Moduł krajowy (Polska) wymienia swoje ustawy sam; moduł
   wspólny nazywa akt wdrażający wybranego państwa — ten sam tekst co na
   stronie startowej i nad raportem — albo mówi, że ustawy jeszcze nie ma. */
function pozycjaAktuKrajowego() {
    if (typeof AKTY_KRAJOWE === 'undefined') return '';
    const akt = AKTY_KRAJOWE[KRAJE.panstwo];
    if (akt) {
        const nazwa = akt.adres
            ? `<a href="${esc(akt.adres)}" target="_blank" rel="noopener">${esc(akt.nazwa)}</a>`
            : esc(akt.nazwa);
        return `<li>${napis('html.33a', {p0: `<strong>${nazwa}</strong>`})}</li>`;
    }
    if (typeof BEZ_USTAWY_WDRAZAJACEJ !== 'undefined' && BEZ_USTAWY_WDRAZAJACEJ.includes(KRAJE.panstwo))
        return `<li>${esc(napis('html.33b'))}</li>`;
    return '';
}

/* ── RAPORT WSTĘPNY ────────────────────────────────────────
   Dostępny natychmiast po wypełnieniu profilu, bez ani jednej odpowiedzi.
   Zawiera to, co dla zarządu najważniejsze: status, organy, kary, terminy. */
function renderujRaportWstepny() {
    const p = stan.profil;
    const kl = sklasyfikuj(p);
    const el = document.getElementById('trescRaportuWstepnego');

    if (kl.status === 'poza') {
        el.innerHTML = `<div class="alert alert-secondary">${napis('dashboard.1')}</div>`;
        return;
    }

    const kara = obliczKare(kl.status, p.przychod, p.kursEUR);
    const kier = obliczKareKierownika(p.wynagrodzenieKierownika, p.role.includes('isp'), kontekstKierownika(p));
    const terminy = nadchodzaceTerminy(kl.status);
    const nadchodzace = terminy.filter(t => !t.minelo);
    const opis = STATUS_OPIS[kl.status];
    const wszystkie = zbudujKwestionariusz(p, kl);

    el.innerHTML = `
      <div class="pasek-akcji">
        <div class="pasek-akcji-tresc">
          <div class="pasek-akcji-tytul">${napis('dashboard.6')}</div>
          <p class="pasek-akcji-opis">
            ${napis('dashboard.7')}
          </p>
        </div>
        <button class="btn btn-akcja" onclick="idzDoKrokuId('moduly')">
          ${napis('dashboard.8')} <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div class="card karta-zarzadu mb-4">
        <div class="card-header"><h5 class="mb-0">${napis('dashboard.9')}</h5></div>
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 flex-wrap mb-3">
            <span class="plakietka-status" style="background:${opis.kolor}">${esc(opis.nazwa)}</span>
            <span class="small">${odeslaniaZTekstu(kl.podstawa, 'ksc')}</span>
          </div>
          <p class="mb-3">${esc(opis.nadzor)}</p>

          <h6 class="fw-semibold">${napis('dashboard.10')}</h6>
          <ul class="lista-zwarta mb-3">${kl.organy.map(o => `<li><strong>${esc(o.organ.nazwa)}</strong>
            <span class="text-secondary">— ${odeslaniaZTekstu(o.podstawy.join(', '), 'ksc')}</span>
            <span class="d-block small text-secondary">${napis('dashboard.2', {p0: esc(o.role.join(', '))})}</span></li>`).join('')}</ul>
          ${kl.organy.length > 1 ? `<div class="alert alert-warning small">${napis('dashboard.3')}</div>` : ''}

          <h6 class="fw-semibold">${napis('dashboard.11')}</h6>
          <ul class="lista-zwarta mb-0">
            <li><strong>${esc(AKTY.ksc.tytul)}</strong> ${napis('dashboard.12', {
                p0: esc(AKTY.ksc.dziennik),
                p1: AKTY.nowelizacja ? esc(AKTY.nowelizacja.dziennik) : '',
                p2: new Date(AKTY.nowelizacja ? AKTY.nowelizacja.wejscie : AKTY.ksc.obowiazujeOd).toLocaleDateString(LOCALE.znacznik())})}</li>
            ${kl.zestawy.includes('reg2690') ? `<li><strong>${esc(AKTY.reg2690.tytul)}</strong> ${napis('dashboard.4', {p0: new Date(AKTY.reg2690.wejscie).toLocaleDateString(LOCALE.znacznik())})}</li>` : ''}
            ${kl.zestawy.includes('pke') && AKTY.pke ? `<li><strong>${esc(AKTY.pke.tytul)}</strong> ${napis('dashboard.5', {p0: esc(AKTY.pke.dziennik), p1: new Date(AKTY.pke.wejscie).toLocaleDateString(LOCALE.znacznik())})}</li>` : ''}
            ${pozycjaAktuKrajowego()}
          </ul>
        </div>
      </div>

      ${blokStosowania(kl)}

      ${blokS46(kl, p)}

      ${blokKierownictwa(kl.status)}

      ${blokKar(kara, kier, p, kl)}

      <div class="card mb-4">
        <div class="card-header"><h5 class="mb-0">${napis('dashboard.13')}</h5></div>
        <div class="card-body p-0"><div class="table-responsive"><table class="table mb-0">
          <thead><tr><th>${napis('xlsx.data')}</th><th>${napis('xlsx.zdarzenie')}</th><th>${napis('dashboard.14')}</th><th class="text-end">${napis('xlsx.stan')}</th></tr></thead>
          <tbody>${terminy.map(t => `<tr class="${t.minelo ? 'wiersz-minelo' : ''}">
            <td class="text-nowrap">${new Date(t.data).toLocaleDateString(LOCALE.znacznik())}</td>
            <td><div class="fw-semibold">${esc(t.tytul)}</div><div class="small text-secondary">${esc(t.opis)}</div></td>
            <td class="small">${odeslaniaZTekstu(t.podstawa)}</td>
            <td class="text-end text-nowrap ${t.wMocy ? 'text-success fw-semibold' : t.minelo ? 'text-secondary' : t.dni < 180 ? 'text-danger fw-semibold' : ''}">${
              t.wMocy ? napis('wspolne.obowiazuje') : t.minelo ? napis('wspolne.terminMinal') : napis('wspolne.dni', {p0: t.dni})}</td>
          </tr>`).join('')}</tbody></table></div></div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h5 class="mb-0">${napis('dashboard.15')}</h5></div>
        <div class="card-body p-0"><div class="table-responsive"><table class="table table-sm mb-0">
          <thead><tr><th>${napis('xlsx.termin')}</th><th>${napis('dashboard.16')}</th><th>${napis('dashboard.17')}</th><th>${napis('xlsx.podstawa')}</th></tr></thead>
          <tbody>${TERMINY_INDYWIDUALNE.map(t => `<tr>
            <td class="fw-semibold text-nowrap">${esc(t.termin)}</td><td class="small">${esc(t.od)}</td>
            <td class="small">${esc(t.co)}</td><td class="small">${odeslaniaZTekstu(t.art, 'ksc')}</td>
          </tr>`).join('')}</tbody></table></div></div>
      </div>

      ${sekcjaProgowIncydentow(p)}

      ${blokFaq(['wykaz', 's46', 'klasyfikacja', 'kierownictwo', 'kary', 'incydenty'], napis('dashboard.113'))}

      <div class="card mb-4">
        <div class="card-header"><h5 class="mb-0">${napis('dashboard.18')}</h5></div>
        <div class="card-body">
          <p class="small text-secondary">${napis('dashboard.19', {p0: wszystkie.reduce((a, s) => a + s.pytania.length, 0)})}</p>
          <div class="table-responsive"><table class="table table-sm mb-3">
            <thead><tr><th>${napis('dashboard.20')}</th><th>${napis('wspolne.przepisy')}</th><th class="text-center">${napis('dashboard.21')}</th><th>${napis('dashboard.22')}</th></tr></thead>
            <tbody>${moduleDostepne(kl).map(m => {
                const st = statystykaModulu(m, wszystkie, stan.odpowiedzi);
                return `<tr><td>${esc(m.nazwa)}${m.szybki ? ' <span class="znacznik znacznik-szybki">' + napis('wspolne.punktWyjscia') + '</span>' : m.zalecany ? ' <span class="znacznik znacznik-zalecany">' + napis('wspolne.zalecany') + '</span>' : ''}</td>
                  <td><span class="plakietka-warstwa" style="background:${m.szybki ? 'var(--marka-plakietka)' : WARSTWY_OPIS[m.warstwa].kolor}">${esc(m.szybki ? napis('wspolne.przekrojowy') : WARSTWY_OPIS[m.warstwa].skrot)}</span></td>
                  <td class="text-center">${st.pytan}</td><td class="small">${esc(st.czas)}</td></tr>`;
            }).join('')}</tbody></table></div>
          <button class="btn btn-primary" onclick="idzDoKrokuId('moduly')">${napis('dashboard.23')}</button>
        </div>
      </div>

      <div class="alert alert-secondary small mb-0">
        ${napis('dashboard.24')}
      </div>`;
}

/* ── CO MUSI ZROBIĆ KIEROWNICTWO ───────────────────────────
   Narzędzie otwiera zwykle osoba zarządzająca, więc obok kar musi
   od razu widzieć własną listę zadań — i rozgraniczenie na to, czego
   nie da się zlecić, oraz to, co należy komuś powierzyć. */
/* Od kiedy wymagania realnie wiążą — najczęstsze pytanie zarządu przy
   rozporządzeniu 2024/2690, które stosuje się bezpośrednio, ale którego
   krajowy termin wdrożenia jest późniejszy. */
function blokStosowania(kl) {
    /* Obowiązki formalne — wpis do wykazu, zadania kierownika, zgłaszanie
       incydentów — wiążą każdy podmiot w zakresie ustawy, niezależnie od
       tego, którą ścieżką idzie ocena merytoryczna. Mają przy tym
       najkrótszy termin ze wszystkich, więc nie mogą wypaść z zestawienia. */
    const klucze = kl.zestawy.slice();
    if (klucze.length && !klucze.includes('ksc-ob')) klucze.unshift('ksc-ob');
    const poz = klucze.map(z => STOSOWANIE[z]).filter(Boolean);
    if (!poz.length) return '';
    const dzis = new Date();
    return `<div class="card mb-4">
        <div class="card-header"><h5 class="mb-0">${napis('dashboard.26')}</h5></div>
        <div class="card-body">
          ${poz.map(s => {
            const data = new Date(s.odKiedy);
            const dni = Math.ceil((data - dzis) / 86400000);
            /* Akt, który już obowiązuje i nie wyznacza terminu wdrożenia,
               nie ma „przekroczonego terminu” — jest po prostu w mocy.
               Licznik dni stoi w osobnym kafelku po prawej, bo to on
               najczęściej decyduje o kolejności działań. */
            const wMocy = s.stan === 'w-mocy' || dni <= 0;
            const pilny = dni > 0 && dni <= 180;
            return `<div class="stosowanie stosowanie-${esc(s.stan)}">
              <div class="stosowanie-tresc">
                <div class="fw-semibold">${esc(s.nazwa)}</div>
                <div class="stosowanie-naglowek">${esc(s.naglowek)}</div>
                <p class="small mb-1">${esc(s.opis)}</p>
                ${s.uwaga ? `<p class="small text-secondary mb-1">${esc(s.uwaga)}</p>` : ''}
                <div class="small">${odeslaniaZTekstu(s.podstawa)}</div>
              </div>
              <div class="licznik-dni ${wMocy ? 'licznik-wmocy' : pilny ? 'licznik-pilny' : ''}">
                ${wMocy
                  ? `<span class="licznik-stan">${napis('dashboard.25')}</span>
                     <span class="licznik-opis">od ${data.toLocaleDateString(LOCALE.znacznik())}</span>`
                  : `<span class="licznik-liczba">${dni}</span>
                     <span class="licznik-opis">${dni === 1 ? napis('wspolne.dzien') : napis('wspolne.dniMn')} do ${data.toLocaleDateString(LOCALE.znacznik())}</span>`}
              </div>
            </div>`;
          }).join('')}
          <div class="alert alert-secondary small mb-0 mt-3">
            ${napis('dashboard.27')}
          </div>
        </div>
      </div>`;
}

/* System S46 i wpis do wykazu — pierwsza czynność, jaką podmiot musi
   wykonać, a zarazem ta o najkrótszym terminie. Blok podaje wprost, czy
   podmiot składa wniosek sam, czy czeka na wpis z urzędu, bo od tego
   zależy wszystko, co robi dalej. */
function blokS46(kl, profil) {
    const zUrzedu = (profil.role || []).some(r => ['isp', 'zaufania'].includes(r)
        || (ROLA_WG_ID[r] || {}).sektor === napis('dashboard.114'));

    return `<div class="card mb-4">
        <div class="card-header"><h5 class="mb-0">${napis('dashboard.30')}</h5></div>
        <div class="card-body">
          <p class="mb-3">${napis('dashboard.31', {p0: esc(S46.opis), p1: odeslaniaZTekstu(S46.podstawa, 'ksc')})}</p>

          <div class="alert ${zUrzedu ? 'alert-secondary' : 'alert-warning'} small">
            ${zUrzedu
              ? `<strong>${napis('dashboard.28')}</strong>
                 ${esc(S46.wpisZUrzeduSkutek)} ${napis('dashboard.dotyczyPodmiotow', {p0: esc(S46.wpisZUrzedu.join(', '))})}`
              : `<strong>${napis('dashboard.29')}</strong>
                 ${napis('dashboard.terminRejestracji')}`}
          </div>

          <h6 class="fw-semibold">${napis('dashboard.32')}</h6>
          <ol class="kroki-s46">${S46.kroki.map(k => `<li>
             <span class="kroki-s46-tytul">${esc(k.tytul)}</span>
             <span class="kroki-s46-opis">${esc(k.opis)}</span></li>`).join('')}</ol>

          <details class="szczegoly-wymogu">
            <summary>${napis('dashboard.33')}</summary>
            <div><ul class="lista-zwarta mb-0">${S46.daneDoWniosku.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
              <p class="small text-secondary mt-2 mb-0">${esc(S46.wymaganiaTechniczne)}</p></div>
          </details>

          <div class="linki-s46">
            ${S46.linki.filter(l => l.glowny).map(l =>
              `<a class="btn btn-sm btn-primary" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.etykieta)}</a>`).join('')}
            ${S46.linki.filter(l => !l.glowny).map(l =>
              `<a class="link-s46" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.etykieta)}</a>`).join('')}
          </div>

          <p class="small text-secondary mt-3 mb-0">
            Pomoc: ${S46.kontakt.map(k => `${esc(k.etykieta)} — <a href="${esc(k.url)}">${esc(k.wartosc)}</a>`).join(' · ')}
          </p>
        </div>
      </div>`;
}

/* Pytania i odpowiedzi Ministerstwa Cyfryzacji dopasowane do obszaru.
   Zwijane, żeby nie przykrywały treści raportu. */
function blokFaq(obszary, tytul) {
    const pytania = [].concat(...obszary.map(faqDlaObszaru));
    if (!pytania.length) return '';
    return `<div class="card mb-4">
        <div class="card-header"><h5 class="mb-0">${esc(tytul || napis('dashboard.115'))}</h5></div>
        <div class="card-body">
          ${pytania.map(q => `<details class="faq">
            <summary>${esc(q.p)}</summary>
            <div class="faq-odpowiedz">
              <p class="mb-1">${esc(q.o)}</p>
              ${q.art ? `<div class="small">${odeslaniaZTekstu(q.art, 'ksc')}</div>` : ''}
            </div>
          </details>`).join('')}
          <p class="small text-secondary mt-2 mb-0">
            ${napis('dashboard.34')} <a href="${esc(FAQ_ZRODLO.url)}" target="_blank" rel="noopener">${esc(FAQ_ZRODLO.nazwa)}</a>.
            ${esc(FAQ_ZRODLO.zastrzezenie)}
          </p>
        </div>
      </div>`;
}

function blokKierownictwa(status) {
    const z = zadaniaKierownictwa(status, stan.odpowiedzi);

    /* Zadania są posortowane wg pilności, a nie kolejności w przepisach —
       zarząd czyta tę listę, żeby wiedzieć, od czego zacząć. */
    const waga = (x) => (x.stan === 'niewykonane' ? 0 : x.stan === null ? 1 : x.stan === 'w-toku' ? 2 : 3)
        - (x.akcent ? 0.5 : 0);
    const posortuj = (lista) => lista.slice().sort((a, b) => waga(a) - waga(b));

    const STANY = {
        'niewykonane': { etykieta: napis('dashboard.116'), klasa: 'dozrobienia', ikona: '!' },
        'w-toku':      { etykieta: napis('dashboard.117'),       klasa: 'wtoku',       ikona: '~' },
        'wykonane':    { etykieta: 'Zrobione',     klasa: 'zrobione',    ikona: '✓' },
        null:          { etykieta: 'Nieocenione',  klasa: 'nieokreslony', ikona: '?' },
    };

    /* Jedno zadanie = jeden wiersz listy. Wcześniej każde było kartą
       z kolorową ramką, kolorowym znacznikiem, kolorową plakietką stanu
       i kolorowym odesłaniem — przy trzynastu zadaniach dawało to ścianę
       barw, w której nic nie było widać. Zostaje jeden nośnik koloru:
       kropka stanu. Reszta różnicuje się typografią i odstępem. */
    const zadanie = (x, nr) => {
        const st = STANY[x.stan] || STANY[null];
        return `<li class="zadanie stan-${st.klasa}">
            <span class="zadanie-stan" title="${esc(st.etykieta)}" aria-label="${esc(st.etykieta)}"></span>
            <div class="zadanie-tresc">
              <div class="zadanie-glowa">
                <span class="zadanie-numer">${nr + 1}.</span>
                <span class="zadanie-tytul">${esc(x.tytul)}</span>
                ${x.termin ? `<span class="zadanie-termin">${esc(x.termin)}</span>` : ''}
              </div>
              <div class="zadanie-opis">${esc(x.opis)}</div>
              <div class="zadanie-meta">
                <span class="zadanie-etykieta-stanu">${esc(st.etykieta)}</span>
                ${odeslaniaZTekstu(x.podstawa, 'ksc')}
              </div>
            </div>
          </li>`;
    };

    const licznik = (lista) => {
        const n = (s) => lista.filter(x => x.stan === s).length;
        /* Polska liczba mnoga: 1 zrobione, 2–4 zrobione, 5 zrobionych. */
        const odm = (ile, mnoga, dopelniacz) => {
            const d = ile % 10, s = ile % 100;
            return (ile === 1 || (d >= 2 && d <= 4 && !(s >= 12 && s <= 14))) ? mnoga : dopelniacz;
        };
        const poz = [
            ['dozrobienia', n('niewykonane'), napis('dashboard.doZrobienia')],
            ['wtoku', n('w-toku'), napis('dashboard.wToku')],
            ['zrobione', n('wykonane'), odm(n('wykonane'), napis('dashboard.zrobione'), napis('dashboard.zrobionych'))],
            ['nieokreslony', lista.filter(x => !x.stan).length,
             odm(lista.filter(x => !x.stan).length, napis('dashboard.nieocenione'), napis('dashboard.nieocenionych'))],
        ].filter(([, ile]) => ile > 0);
        return `<div class="licznik-zadan">${poz.map(([kl, ile, opis]) =>
            `<span class="licznik-pozycja"><span class="kropka ${kl}"></span>${ile} ${opis}</span>`).join('')}</div>`;
    };

    /* Grupy jedna pod drugą, nie obok siebie. Kolejność niesie treść:
       najpierw to, czego kierownik nie może z siebie zdjąć. */
    const grupa = (lista, tytul, wstep, klasa) => `
        <section class="grupa-zadan ${klasa}">
          <div class="grupa-glowa">
            <h6 class="grupa-tytul">${esc(tytul)} <span class="grupa-liczba">${lista.length}</span></h6>
            ${licznik(lista)}
          </div>
          <p class="grupa-wstep">${wstep}</p>
          <ol class="lista-zadan">${posortuj(lista).map(zadanie).join('')}</ol>
        </section>`;

    return `<div class="card karta-kierownictwa mb-4">
      <div class="card-header"><h5 class="mb-0">${napis('dashboard.35')}</h5></div>
      <div class="card-body">

        <div class="alert alert-secondary">
          <strong>${napis('dashboard.36')}</strong> ${esc(KIEROWNIK_DEFINICJA.tresc)}
          <ul class="lista-zwarta mb-0 mt-2">${KIEROWNIK_DEFINICJA.uwagi.map(u => `<li>${esc(u)}</li>`).join('')}</ul>
        </div>

        ${grupa(z.osobiste, napis('dashboard.118'), napis('dashboard.119'), 'grupa-osobiste')}
        ${grupa(z.doZlecenia, napis('dashboard.120'), napis('dashboard.121'), 'grupa-zlecane')}

        <h6 class="fw-semibold mt-4">${napis('dashboard.37')}</h6>
        <div class="row g-3 mb-3">${NADZOR_ZARZADCZY.map(n => `
          <div class="col-md-4"><div class="blok-nadzoru">
            <div class="etykieta">${esc(n.kategoria)}</div>
            <ul class="lista-zwarta small mb-0">${n.pozycje.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          </div></div>`).join('')}
        </div>

        <h6 class="fw-semibold">${napis('dashboard.38')}</h6>
        <div class="table-responsive"><table class="table table-sm mb-0">
          <thead><tr><th>${napis('xlsx.rola')}</th><th>${napis('wspolne.zakres')}</th></tr></thead>
          <tbody>${ZESPOL_MINIMALNY.map(r => `<tr><td class="fw-semibold text-nowrap">${esc(r.rola)}</td><td>${esc(r.zakres)}</td></tr>`).join('')}</tbody>
        </table></div>
      </div></div>`;
}

/* Wspólny blok kar — używany w raporcie wstępnym i w pełnym raporcie. */
function blokKar(kara, kier, p, kl) {
    return `<div class="card karta-ryzyka mb-4">
      <div class="card-header"><h5 class="mb-0">${napis('dashboard.52')}</h5></div>
      <div class="card-body">

        <h6 class="fw-semibold">${napis('xlsx.podmiot')}</h6>
        ${kara ? `
          <div class="mechanizm-ramka">
            <div class="mechanizm-naglowek">${napis('dashboard.39')}</div>
            <ol class="mechanizm-kary">${KARY_KSC.jakPowstajePulap.kroki.map(k => `<li>
               <span class="mechanizm-tytul">${esc(k.tytul)}</span>
               <span class="mechanizm-opis">${esc(k.opis)}</span>
               <span class="mechanizm-podstawa">${odeslaniaZTekstu(k.podstawa, 'ksc')}</span></li>`).join('')}</ol>
            <p class="mb-0 small">${esc(KARY_KSC.jakPowstajePulap.wniosek)}</p>
          </div>

          <p class="mb-2">${napis('dashboard.40')} <strong>${formatujPLN(kara.kwota)}</strong>. ${esc(kara.podstawaWyboru)}</p>
          <ul class="lista-zwarta small text-secondary mb-2">
            <li>${napis('dashboard.41', {p0: kara.wariantProcentowy !== null ? formatujPLN(kara.wariantProcentowy) : '—'})}</li>
            <li>${napis('dashboard.42', {p0: formatujPLN(kara.wariantKwotowy), p1: kara.kurs})}</li>
            <li>${napis('dashboard.43', {p0: formatujPLN(kara.minimum)})}</li>
          </ul>
          ${kara.uwagaProporcjonalnosc ? `<div class="alert alert-warning small">${esc(kara.uwagaProporcjonalnosc)}</div>` : ''}
          ${kara.uwagaRedakcyjna ? `<div class="alert alert-secondary small">${esc(kara.uwagaRedakcyjna)}</div>` : ''}
          <div class="ramka-miarkowanie small mb-3">
            <div class="fw-semibold mb-1">${napis('dashboard.44', {p0: odeslaniaZTekstu(KARY_KSC.miarkowanie.podstawa, 'ksc')})}</div>
            <p class="mb-2">${esc(KARY_KSC.miarkowanie.tresc)}</p>
            <div class="fw-semibold">${napis('dashboard.45')}</div>
            <ul class="lista-zwarta mb-2">${KARY_KSC.miarkowanie.kryteria.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
            <p class="mb-0 text-secondary">${esc(KARY_KSC.miarkowanie.odstapienie)}</p>
          </div>
        ` : napis('dashboard.122')}

        <ul class="lista-zwarta small text-secondary mb-3">
          ${KARY_KSC.okresowa.minPLN != null ? `<li>${napis('dashboard.53', {p0: KARY_KSC.okresowa.minPLN.toLocaleString(LOCALE.znacznik()), p1: KARY_KSC.okresowa.maksPLN.toLocaleString(LOCALE.znacznik()), p2: odeslaniaZTekstu(KARY_KSC.okresowa.podstawa, 'ksc')})}</li>` : `<li>${esc(KARY_KSC.okresowa.opis)}</li>`}
          ${KARY_KSC.kwalifikowana.kwotaPLN != null ? `<li>${napis('dashboard.54', {p0: KARY_KSC.kwalifikowana.kwotaPLN.toLocaleString(LOCALE.znacznik()), p1: odeslaniaZTekstu(KARY_KSC.kwalifikowana.podstawa, 'ksc')})}</li>` : `<li>${esc(KARY_KSC.kwalifikowana.opis)}</li>`}
        </ul>

        <h6 class="fw-semibold">${napis('dashboard.55')}</h6>
        ${kier.pozycje.length ? `<div class="table-responsive mb-2"><table class="table table-sm mb-0">
          <thead><tr><th>${napis('dashboard.47')}</th><th>${napis('xlsx.podstawa')}</th><th>${napis('xlsx.organ')}</th><th class="text-end">${napis('dashboard.48')}</th></tr></thead>
          <tbody>${kier.pozycje.map(x => `<tr><td>${esc(x.akt)}</td><td class="small">${odeslaniaZTekstu(x.podstawa, x.akt === napis('dashboard.123') ? 'ksc' : 'pke')}</td><td class="small">${esc(x.organ)}</td><td class="text-end fw-semibold">${formatujPLN(x.kwota)}</td></tr>`).join('')}
          ${kier.pozycje.length > 1 ? `<tr class="table-active"><td colspan="3" class="fw-semibold">${napis('dashboard.46')}</td><td class="text-end fw-bold">${formatujPLN(kier.suma)}</td></tr>` : ''}</tbody>
        </table></div>` : napis('dashboard.124')}
        <ul class="lista-zwarta small text-secondary mb-2">${KARY_KSC.kierownik.zasady.map(z => `<li>${esc(z)}</li>`).join('')}</ul>
        ${p.role.includes('isp') ? `<div class="alert alert-warning small mb-0">${napis('dashboard.49')} <strong>${napis('dashboard.50')}</strong> ${napis('dashboard.51')}</div>` : ''}

        <div class="alert alert-info small mb-0 mt-3">
          ${napis('dashboard.56')} <strong>${new Date(KARY_KSC.odKiedy.data).toLocaleDateString(LOCALE.znacznik())}</strong>
          ${napis('dashboard.57', {p0: odeslaniaZTekstu(KARY_KSC.odKiedy.podstawa, 'nowelizacja')})}
        </div>
      </div></div>`;
}

/* ── PODSUMOWANIE DLA ZARZĄDU ──────────────────────────────*/
function sekcjaZarzadu(w, p, kl) {
    const kara = obliczKare(kl.status, p.przychod, p.kursEUR);
    const kier = obliczKareKierownika(p.wynagrodzenieKierownika, p.role.includes('isp'), kontekstKierownika(p));
    const terminy = nadchodzaceTerminy(kl.status).filter(t => !t.minelo && !t.wMocy && t.dni > 0).slice(0, 3);
    const najw = w.luki.slice(0, 5);
    const niewyk = w.obowiazki.niewykonane;

    return `<div class="card karta-zarzadu mb-4">
      <div class="card-header"><h5 class="mb-0">${napis('dashboard.59')}</h5></div>
      <div class="card-body">

        <div class="row g-3 mb-4">
          <div class="col-md-4"><div class="blok-zarzadu">
            <div class="etykieta">${napis('dashboard.60')}</div>
            <div class="wartosc" style="color:${STATUS_OPIS[kl.status].kolor}">${esc(STATUS_OPIS[kl.status].nazwa)}</div>
            <div class="opis">${odeslaniaZTekstu(kl.podstawa, 'ksc')}</div>
          </div></div>
          <div class="col-md-4"><div class="blok-zarzadu">
            <div class="etykieta">${napis('dashboard.61')}</div>
            <div class="wartosc">${w.zgodnosc}%</div>
            <div class="opis">${w.maSkale
                ? napis('dashboard.dojrzaloscPrzyDocelowym', {p0: w.ogolny.toFixed(1), p1: w.docelowy})
                : napis('dashboard.125')}</div>
          </div></div>
          <div class="col-md-4"><div class="blok-zarzadu">
            <div class="etykieta">${napis('dashboard.62')}</div>
            <div class="wartosc" style="color:${niewyk ? '#dc2626' : '#157347'}">${w.obowiazki.wykonane}/${w.obowiazki.razem}</div>
            <div class="opis">${niewyk ? napis('dashboard.niewykonanych', {p0: niewyk}) : ''}${napis('dashboard.wTokuLiczba', {p0: w.obowiazki.wToku})}</div>
          </div></div>
        </div>

        <h6 class="fw-semibold">${napis('dashboard.63')}</h6>
        ${terminy.length ? `<ul class="lista-zwarta mb-3">${terminy.map(t => `<li><strong>${new Date(t.data).toLocaleDateString(LOCALE.znacznik())}</strong> ${napis('dashboard.zaDni', {p0: t.dni})} — ${esc(t.tytul)}</li>`).join('')}</ul>`
            : napis('dashboard.126')}

        <h6 class="fw-semibold">${napis('dashboard.64')}</h6>
        ${najw.length ? `<ol class="lista-zwarta mb-3">${najw.map(l => `<li>${napis('dashboard.58', {p0: esc(l.nazwa), p1: l.srednia.toFixed(1), p2: w.docelowy})} <span class="priorytet-tekst" style="color:${l.priorytet.kolor}">${esc(l.priorytet.nazwa.toLowerCase())}</span></li>`).join('')}</ol>`
            : napis('dashboard.127')}

        <div class="alert alert-info small mb-0">
          ${napis('dashboard.56')} <strong>${new Date(KARY_KSC.odKiedy.data).toLocaleDateString(LOCALE.znacznik())}</strong>
          ${napis('dashboard.65', {p0: odeslaniaZTekstu(KARY_KSC.odKiedy.podstawa, 'nowelizacja')})}
        </div>
      </div></div>`;
}

function sekcjaKafelkow(w) {
    const kolorPct = (v) => v >= 80 ? '#157347' : v >= 50 ? '#b45309' : '#dc2626';
    const wypelnienie = Math.round(w.odpowiedziano / Math.max(1, w.pytanRazem) * 100);

    /* Zestaw kafelków zależy od tego, czy wybrane moduły zawierają pytania
       w skali dojrzałości. Przy samych obowiązkach formalnych dojrzałość
       nie ma sensu i pokazywanie jej jako 0 wprowadzałoby w błąd. */
    const kafelki = w.maSkale
        ? [
            kafelek(w.ogolny.toFixed(1), etykietaDojrzalosci(w.ogolny), napis('dashboard.128'), kolorWyniku(w.ogolny, w.docelowy)),
            kafelek(w.zgodnosc + '%', napis('dashboard.129') + w.docelowy, napis('dashboard.130'), kolorPct(w.zgodnosc)),
            kafelek(Math.max(0, w.docelowy - w.ogolny).toFixed(1), napis('dashboard.doPoziomuDocelowego'), napis('dashboard.131'), 'var(--w-info)'),
          ]
        : [
            kafelek(w.obowiazki.procent === null ? '—' : w.obowiazki.procent + '%',
                napis('dashboard.132'), napis('dashboard.62'),
                w.obowiazki.procent === null ? 'var(--w-neutralny)' : kolorPct(w.obowiazki.procent)),
            kafelek(String(w.obowiazki.wykonane), napis('dashboard.zRazem', {p0: w.obowiazki.razem}), napis('skala.wykonane'), 'var(--w-niski)'),
            kafelek(String(w.obowiazki.niewykonane), w.obowiazki.niewykonane ? napis('dashboard.wymagajaDzialania') : napis('dashboard.134'), napis('skala.niewykonane'),
                w.obowiazki.niewykonane ? 'var(--w-krytyczny)' : 'var(--w-niski)'),
          ];

    kafelki.push(kafelek(w.odpowiedziano + '/' + w.pytanRazem, wypelnienie + napis('dashboard.135'), napis('dashboard.odpowiedzi'), 'var(--w-neutralny)'));

    return `<div class="row g-3 mb-4">${kafelki.join('')}</div>
      ${!w.maSkale ? `<div class="alert alert-secondary small">${napis('dashboard.66')}</div>` : ''}`;
}

function kafelek(wartosc, podpis, etykieta, kolor) {
    return `<div class="col-6 col-lg-3"><div class="kafelek">
      <div class="kafelek-wartosc" style="color:${kolor}">${esc(wartosc)}</div>
      <div class="kafelek-podpis">${esc(podpis)}</div>
      <div class="kafelek-etykieta">${esc(etykieta)}</div>
    </div></div>`;
}

/* Wykresy jeden pod drugim, na całą szerokość: pełne nazwy obszarów
   (bez wielokropka) potrzebują miejsca na etykiety. Obok siebie jedna
   długa nazwa rozdmuchiwała wykres słupkowy na kilka ekranów, a radar
   wisiał w pustej karcie obok. */
function sekcjaWykresow() {
    return `<div class="row g-3 mb-4">
      <div class="col-12"><div class="card h-100" id="kartaRadaru"><div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">${napis('dashboard.67')}</h6><span class="small text-secondary" id="uwagaRadar"></span></div>
        <div class="card-body"><canvas id="wykresRadar" style="max-height:380px"></canvas></div></div></div>
      <div class="col-12"><div class="card h-100"><div class="card-header"><h6 class="mb-0">${napis('dashboard.68')}</h6></div>
        <div class="card-body"><canvas id="wykresSlupki" style="max-height:380px"></canvas></div></div></div>
    </div>`;
}

function sekcjaWarstw(w) {
    const wiersze = Object.entries(w.warstwy).map(([id, v]) => {
        const o = WARSTWY_OPIS[id];
        return `<tr>
          <td><span class="plakietka-warstwa" style="background:${o.kolor}">${esc(o.skrot)}</span> ${esc(o.nazwa)}</td>
          <td class="text-center">${v.odpowiedziano}/${v.pytan}</td>
          <td class="text-center fw-semibold">${v.srednia !== null ? v.srednia.toFixed(1) : '—'}</td>
        </tr>`;
    }).join('');
    return `<div class="card mb-4"><div class="card-header"><h6 class="mb-0">${napis('dashboard.69')}</h6></div>
      <div class="card-body p-0"><div class="table-responsive"><table class="table mb-0">
        <thead><tr><th>${napis('dashboard.47')}</th><th class="text-center">${napis('dashboard.70')}</th><th class="text-center">${napis('dashboard.71')}</th></tr></thead>
        <tbody>${wiersze}</tbody></table></div></div></div>`;
}

function sekcjaLuk(w) {
    if (!w.luki.length) return '';
    return `<div class="card mb-4" id="kartaLuk"><div class="card-header"><h6 class="mb-0">${napis('dashboard.72')}</h6></div>
      <div class="card-body p-0"><div class="table-responsive"><table class="table table-hover mb-0">
        <thead><tr><th>${napis('xlsx.obszar')}</th><th class="text-center">${napis('xlsx.obecnie')}</th><th class="text-center">${napis('xlsx.cel')}</th><th class="text-center">${napis('xlsx.luka')}</th><th class="text-center">${napis('xlsx.priorytet')}</th><th class="text-center">${napis('dashboard.73')}</th></tr></thead>
        <tbody>${w.luki.map(l => `<tr>
          <td><div class="fw-semibold">${esc(l.nazwa)}</div><div class="small">${odeslaniaZTekstu(l.podstawa || '', WARSTWA_AKT[l.warstwa])}</div></td>
          <td class="text-center fw-semibold priorytet-tekst" style="color:${kolorWyniku(l.srednia, w.docelowy)}">${l.srednia.toFixed(1)}</td>
          <td class="text-center">${w.docelowy}</td>
          <td class="text-center fw-semibold">${l.luka.toFixed(1)}</td>
          <td class="text-center"><span class="badge" style="background:${l.priorytet.tlo}">${esc(l.priorytet.nazwa)}</span></td>
          <td class="text-center small text-secondary">${l.odpowiedziano}/${l.razem}</td>
        </tr>`).join('')}</tbody></table></div></div></div>`;
}

function sekcjaRyzykaPrawnego(w) {
    if (!w.ryzykoPrawne.length) {
        return `<div class="card mb-4"><div class="card-header"><h6 class="mb-0">${napis('dashboard.74')}</h6></div>
          <div class="card-body"><p class="mb-0 text-secondary small">${napis('dashboard.75')}</p></div></div>`;
    }
    return `<div class="card mb-4 karta-ryzyka"><div class="card-header"><h6 class="mb-0">${napis('dashboard.76')}</h6></div>
      <div class="card-body p-0"><div class="table-responsive"><table class="table mb-0">
        <thead><tr><th>${napis('dashboard.77')}</th><th>${napis('xlsx.podstawa')}</th><th>${napis('xlsx.termin')}</th><th>${napis('dashboard.78')}</th></tr></thead>
        <tbody>${w.ryzykoPrawne.map(r => `<tr>
          <td><div>${esc(r.tekst)}</div><div class="small text-secondary">${esc(r.sekcja)}</div></td>
          <td class="small">${odeslaniaZTekstu(r.art, 'ksc')}</td>
          <td class="small">${esc(r.termin || '—')}</td>
          <td class="small"><span class="znacznik znacznik-sankcja">${esc(r.sankcja)}</span></td>
        </tr>`).join('')}</tbody></table></div></div></div>`;
}

function sekcjaKalendarza(w) {
    const t = nadchodzaceTerminy(w.status);
    return `<div class="card mb-4"><div class="card-header"><h6 class="mb-0">${napis('dashboard.79')}</h6></div>
      <div class="card-body p-0"><div class="table-responsive"><table class="table mb-0">
        <thead><tr><th>${napis('xlsx.data')}</th><th>${napis('xlsx.zdarzenie')}</th><th>${napis('xlsx.podstawa')}</th><th class="text-end">${napis('dashboard.80')}</th></tr></thead>
        <tbody>${t.map(x => `<tr class="${x.minelo ? 'wiersz-minelo' : ''}">
          <td class="text-nowrap">${new Date(x.data).toLocaleDateString(LOCALE.znacznik())}</td>
          <td><div class="fw-semibold">${esc(x.tytul)}</div><div class="small text-secondary">${esc(x.opis)}</div></td>
          <td class="small">${odeslaniaZTekstu(x.podstawa, 'ksc')}</td>
          <td class="text-end text-nowrap ${x.wMocy ? 'text-success fw-semibold' : x.minelo ? 'text-secondary' : x.dni < 180 ? 'text-danger fw-semibold' : ''}">${x.wMocy ? napis('wspolne.obowiazuje') : x.minelo ? napis('wspolne.minelo') : napis('wspolne.dni', {p0: x.dni})}</td>
        </tr>`).join('')}</tbody></table></div></div></div>`;
}

function sekcjaProgowIncydentow(p) {
    const progi = reg2690ProgiDlaRol(p.role);
    const czyIsp = p.role.includes('isp');
    if (!progi.length && !czyIsp) return '';

    return `<div class="card mb-4"><div class="card-header"><h6 class="mb-0">${napis('dashboard.85')}</h6></div>
      <div class="card-body">
        ${progi.length ? `
          <p class="small text-secondary">${napis('dashboard.81')}</p>
          ${progi.map(g => `<div class="mb-3">
            <div class="fw-semibold">${esc(g.nazwa)} <span class="text-secondary small">(${esc(g.artykul)})</span></div>
            ${g.ostrzezenie ? `<div class="alert alert-warning small my-2">${esc(g.ostrzezenie)}</div>` : ''}
            <ul class="lista-zwarta small mb-0">${g.kryteria.map(k => `<li><strong>${esc(k.lit)})</strong> ${esc(k.tresc)}</li>`).join('')}</ul>
          </div>`).join('')}
          <div class="mt-3"><div class="fw-semibold mb-1">${napis('dashboard.82')}</div>
            <ul class="lista-zwarta small mb-0">${REG2690_PROGI_HORYZONTALNE.map(k => `<li><strong>${esc(k.lit)})</strong> ${esc(k.tytul)} — ${esc(k.tresc)}</li>`).join('')}</ul></div>
        ` : ''}
        ${czyIsp ? `<div class="alert alert-secondary small mt-3 mb-0">
          <strong>${napis('dashboard.83')}</strong> ${napis('dashboard.84')}
        </div>` : ''}
      </div></div>`;
}

function sekcjaMigawek() {
    const m = stan.migawki;
    if (!m.length) {
        return `<div class="card mb-4"><div class="card-header"><h6 class="mb-0">${napis('dashboard.86')}</h6></div>
          <div class="card-body"><p class="small text-secondary mb-2">${napis('dashboard.87')}</p>
          <button class="btn btn-sm btn-outline-primary" onclick="zapiszMigawkeUI()">${napis('dashboard.88')}</button></div></div>`;
    }
    const por = porownajZMigawka(m.length - 1);
    const strzalka = (v) => v > 0.001 ? `<span class="wzrost">▲ +${v.toFixed(1)}</span>` : v < -0.001 ? `<span class="spadek">▼ ${v.toFixed(1)}</span>` : '<span class="text-secondary">bez zmian</span>';

    return `<div class="card mb-4"><div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0">${napis('dashboard.86')}</h6>
        <button class="btn btn-sm btn-outline-primary" onclick="zapiszMigawkeUI()">${napis('dashboard.90')}</button></div>
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-md-6"><canvas id="wykresTrend" style="max-height:240px"></canvas></div>
          <div class="col-md-6">
            <div class="fw-semibold mb-2">${napis('dashboard.91', {p0: new Date(por.migawka.data).toLocaleDateString(LOCALE.znacznik())})}</div>
            <ul class="lista-zwarta">
              <li>${napis('dashboard.92', {p0: por.ogolnyPrzed.toFixed(1), p1: por.ogolnyPo.toFixed(1), p2: strzalka(por.ogolnyRoznica)})}</li>
              <li>${napis('dashboard.93', {p0: por.zgodnoscPrzed, p1: por.zgodnoscPo})}</li>
              <li>${napis('dashboard.94', {p0: por.obowiazkiPrzed, p1: por.obowiazkiPo})}</li>
            </ul>
            ${por.delty.length ? `<div class="fw-semibold mt-3 mb-1">${napis('dashboard.89')}</div>
              <ul class="lista-zwarta small">${por.delty.slice(0, 8).map(d => `<li>${esc(d.nazwa)}: ${d.przed.toFixed(1)} → ${d.po.toFixed(1)} ${strzalka(d.roznica)}</li>`).join('')}</ul>`
            : napis('dashboard.136')}
          </div>
        </div>
        <div class="table-responsive"><table class="table table-sm mb-0">
          <thead><tr><th>${napis('xlsx.data')}</th><th>${napis('xlsx.notatka')}</th><th class="text-center">${napis('dashboard.71')}</th><th class="text-center">${napis('dashboard.95')}</th><th class="text-center">${napis('dashboard.96')}</th></tr></thead>
          <tbody>${m.slice().reverse().map(x => `<tr>
            <td class="text-nowrap">${new Date(x.data).toLocaleDateString(LOCALE.znacznik())}</td>
            <td class="small">${esc(x.notatka || '—')}</td>
            <td class="text-center">${x.wynik.ogolny.toFixed(1)}</td>
            <td class="text-center">${x.wynik.zgodnosc}%</td>
            <td class="text-center">${x.wynik.obowiazkiWykonane}/${x.wynik.obowiazkiRazem}</td>
          </tr>`).join('')}</tbody></table></div>
      </div></div>`;
}

function sekcjaEksportu() {
    return `<div class="card mb-4 d-print-none"><div class="card-body text-center py-4">
        <h6 class="mb-3">${napis('dashboard.97')}</h6>
        <div class="d-flex justify-content-center gap-2 flex-wrap">
          <button class="btn btn-success" onclick="eksportujXLSX()">${napis('dashboard.98')}</button>
          <button class="btn btn-outline-secondary" onclick="window.print()">${napis('dashboard.99')}</button>
          <button class="btn btn-outline-primary" onclick="eksportujOceneUI()">${napis('dashboard.100')}</button>
        </div>
        <p class="small text-secondary mt-3 mb-0">${napis('dashboard.101')}</p>
      </div></div>`;
}

/* ── WYKRESY ───────────────────────────────────────────────*/
function rysujWykresy(w) {
    const dane = w.luki;
    if (!dane.length) { wyjasnijBrakWykresow(w); return; }

    /* Radar czytelny jest mniej więcej do dwunastu osi — przy większej
       liczbie obszarów pokazujemy te z największą luką, a pełen obraz
       zostaje na wykresie słupkowym i w tabeli luk. */
    const MAKS_OSI = 12;
    const doRadaru = dane.slice(0, MAKS_OSI);
    const etykiety = doRadaru.map(s => etykietaWykresu(s.nazwa, 26));
    const wartosci = doRadaru.map(s => s.srednia);
    const etykietySlupki = dane.map(s => etykietaWykresu(s.nazwa, 70));
    const wartosciSlupki = dane.map(s => s.srednia);
    const ciemny = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const kolorTekstu = ciemny ? '#cbd5e1' : '#334155';
    const kolorSiatki = ciemny ? 'rgba(148,163,184,.2)' : 'rgba(100,116,139,.18)';

    /* Radar dostaje stałą, wyższą ramę: pełne nazwy obszarów zajmują po
       dwa–trzy wiersze, a przy proporcjach kwadratu etykiety sąsiednich osi
       po bokach nachodziły na siebie. */
    const plotnoRadar = document.getElementById('wykresRadar');
    plotnoRadar.style.maxHeight = 'none';
    plotnoRadar.parentElement.style.height = '480px';

    if (wykresRadar) wykresRadar.destroy();
    wykresRadar = new Chart(plotnoRadar, {
        type: 'radar',
        data: {
            labels: etykiety,
            datasets: [
                { label: napis('dashboard.137'), data: wartosci, backgroundColor: 'rgba(26,86,219,.18)', borderColor: '#1a56db', borderWidth: 2, pointRadius: 3 },
                { label: napis('dashboard.138') + w.docelowy, data: etykiety.map(() => w.docelowy), borderColor: '#dc2626', borderWidth: 2, borderDash: [5, 5], pointRadius: 0, backgroundColor: 'rgba(220,38,38,.04)' },
            ],
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, color: kolorTekstu, backdropColor: 'transparent' }, grid: { color: kolorSiatki }, angleLines: { color: kolorSiatki }, pointLabels: { color: kolorTekstu, font: { size: 10 } } } },
            plugins: { legend: { position: 'bottom', labels: { color: kolorTekstu, font: { size: 11 } } } },
        },
    });

    const uwaga = document.getElementById('uwagaRadar');
    if (uwaga) uwaga.textContent = dane.length > MAKS_OSI
        ? MAKS_OSI + napis('dashboard.139') + dane.length
        : '';

    /* Wysokość wykresu słupkowego z liczby obszarów i wierszy etykiet —
       przy stałej wysokości wieloliniowe etykiety nachodziłyby na siebie. */
    /* Chart.js daje każdemu słupkowi tyle samo miejsca, więc liczy się
       najdłuższa etykieta, nie średnia. */
    const najwiecejWierszy = etykietySlupki.reduce((a, e) => Math.max(a, Array.isArray(e) ? e.length : 1), 1);
    const plotnoSlupki = document.getElementById('wykresSlupki');
    plotnoSlupki.style.maxHeight = 'none';
    plotnoSlupki.parentElement.style.height = Math.max(260, dane.length * (najwiecejWierszy * 12 + 12) + 70) + 'px';

    if (wykresSlupki) wykresSlupki.destroy();
    wykresSlupki = new Chart(plotnoSlupki, {
        type: 'bar',
        data: { labels: etykietySlupki, datasets: [{ label: napis('dashboard.71'), data: wartosciSlupki, backgroundColor: wartosciSlupki.map(v => kolorRozwiazany(kolorWyniku(v, w.docelowy))), borderRadius: 4, barThickness: 12 }] },
        options: {
            responsive: true, maintainAspectRatio: false, indexAxis: 'y',
            scales: {
                x: { min: 0, max: 5, ticks: { stepSize: 1, color: kolorTekstu }, grid: { color: kolorSiatki } },
                /* autoSkip: false — inaczej Chart.js pomijał co drugą etykietę,
                   gdy uznał, że się nie zmieszczą, i słupek zostawał bez nazwy. */
                y: { ticks: { color: kolorTekstu, font: { size: 10 }, autoSkip: false }, grid: { display: false } },
            },
            plugins: {
                legend: { display: false },
                annotation: { annotations: { cel: { type: 'line', xMin: w.docelowy, xMax: w.docelowy, borderColor: '#dc2626', borderWidth: 2, borderDash: [5, 5], label: { display: true, content: napis('dashboard.celSkrot') + w.docelowy, position: 'end', backgroundColor: '#dc2626', font: { size: 10 } } } } },
            },
        },
    });

    const plotno = document.getElementById('wykresTrend');
    if (plotno && stan.migawki.length) {
        const m = stan.migawki;
        if (wykresTrend) wykresTrend.destroy();
        wykresTrend = new Chart(plotno, {
            type: 'line',
            data: {
                labels: m.map(x => new Date(x.data).toLocaleDateString(LOCALE.znacznik())).concat([napis('dashboard.teraz')]),
                datasets: [
                    { label: napis('dashboard.71'), data: m.map(x => x.wynik.ogolny).concat([w.ogolny]), borderColor: '#1a56db', backgroundColor: 'rgba(26,86,219,.12)', fill: true, tension: .3 },
                    { label: napis('dashboard.140'), data: m.map(() => w.docelowy).concat([w.docelowy]), borderColor: '#dc2626', borderDash: [5, 5], pointRadius: 0, fill: false },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                scales: { y: { min: 0, max: 5, ticks: { stepSize: 1, color: kolorTekstu }, grid: { color: kolorSiatki } }, x: { ticks: { color: kolorTekstu, font: { size: 10 } }, grid: { display: false } } },
                plugins: { legend: { position: 'bottom', labels: { color: kolorTekstu, font: { size: 11 } } } },
            },
        });
    }
}

/* Puste płótno nic nie mówi. Gdy nie ma z czego rysować, wypisujemy
   wprost, których odpowiedzi brakuje i gdzie je uzupełnić. */
function wyjasnijBrakWykresow(w) {
    const kl = w.klasyfikacja;
    const sekcje = sekcjeWybrane(stan.profil, kl);
    const braki = [];

    sekcje.forEach(s => {
        const puste = s.pytania.filter(q => {
            if (typPytania(s, q) !== 'skala') return false;
            const a = normalizujOdpowiedz(stan.odpowiedzi[q.id]);
            return !a || !Number.isFinite(a.poziom);
        });
        if (puste.length) braki.push({ sekcja: s, puste });
    });

    const wSkali = sekcje.reduce((n, s) => n + s.pytania.filter(q => typPytania(s, q) === 'skala').length, 0);

    const tresc = wSkali === 0
        ? `<p class="mb-2">${napis('dashboard.102')}</p>
           <p class="mb-0">${napis('dashboard.103')}
             <strong>${napis('dashboard.104')}</strong>, <strong>${napis('dashboard.105')}</strong>
             albo <strong>${napis('dashboard.106')}</strong> na
             <a href="#" onclick="idzDoKrokuId('moduly');return false;">${napis('dashboard.107')}</a>.</p>`
        : `<p class="mb-2">${napis('dashboard.108')}
             <strong>${braki.reduce((n, b) => n + b.puste.length, 0)} z ${wSkali}</strong> ${napis('dashboard.109')}</p>
           <div class="table-responsive"><table class="table table-sm mb-2">
             <thead><tr><th>${napis('xlsx.sekcja')}</th><th class="text-center">${napis('dashboard.brakuje')}</th><th>${napis('dashboard.110')}</th></tr></thead>
             <tbody>${braki.map(b => `<tr>
               <td><a href="#" onclick="idzDoKrokuId('${esc(b.sekcja.id)}');return false;">${esc(b.sekcja.nazwa)}</a></td>
               <td class="text-center fw-semibold">${b.puste.length}</td>
               <td class="small">${b.puste.slice(0, 3).map(q => esc((q.tekst || '').slice(0, 90))).join('<br>')}${b.puste.length > 3 ? '<br><span class="text-secondary">' + napis('dashboard.iWiecej', {p0: b.puste.length - 3}) + '</span>' : ''}</td>
             </tr>`).join('')}</tbody></table></div>
           <p class="mb-0 text-secondary">${napis('dashboard.111')}</p>`;

    document.querySelectorAll('#wykresRadar, #wykresSlupki').forEach(c => {
        const karta = c.closest('.card');
        if (karta) karta.remove();
    });

    const kotwica = document.querySelector('#trescWynikow .row.g-3.mb-4');
    const html = `<div class="card mb-4"><div class="card-header"><h6 class="mb-0">${napis('dashboard.67')}</h6></div>
        <div class="card-body">${tresc}</div></div>`;
    if (kotwica) kotwica.insertAdjacentHTML('afterend', html);
    else document.getElementById('trescWynikow').insertAdjacentHTML('beforeend', html);
}

/* Etykieta osi wykresu: w kilku wierszach zamiast urwana wielokropkiem.
   Końcowe odesłanie w nawiasie („(art. 21 ust. 2 lit. f dyrektywy (UE)
   2022/2555)") zostaje w tabeli luk pod wykresem — na osi zajmowałoby
   połowę miejsca, a nie mówi, czego dotyczy obszar. */
function etykietaWykresu(s, szerokosc) {
    /* Numer porządkowy zostaje: „5. Bezpieczeństwo łańcucha dostaw"
       (rozporządzenie) i „Bezpieczeństwo łańcucha dostaw" (dyrektywa) to
       dwa różne obszary, a bez numeru i bez odesłania wyglądałyby tak samo. */
    let t = String(s).trim();
    if (/(2022\/2555|2024\/2690)\)\s*$/.test(t)) {
        let glebokosc = 0;
        for (let i = t.length - 1; i >= 0; i--) {
            if (t[i] === ')') glebokosc++;
            else if (t[i] === '(' && --glebokosc === 0) { t = t.slice(0, i).trim(); break; }
        }
    }
    const wiersze = [];
    let biezacy = '';
    for (const slowo of t.split(/\s+/)) {
        if (biezacy && (biezacy + ' ' + slowo).length > szerokosc) { wiersze.push(biezacy); biezacy = slowo; }
        else biezacy = biezacy ? biezacy + ' ' + slowo : slowo;
    }
    if (biezacy) wiersze.push(biezacy);
    return wiersze.length > 1 ? wiersze : wiersze[0];
}
