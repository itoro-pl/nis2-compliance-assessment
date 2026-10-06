/* ==========================================================
   Składanie kwestionariusza z warstw regulacyjnych i punktacja
   ========================================================== */

/* Sekcje wymogów rozporządzenia 2024/2690 przerobione na sekcje pytań.
   Każdy punkt załącznika jest osobnym pytaniem ocenianym w skali dojrzałości. */
function sekcjeReg2690() {
    return REG2690_SEKCJE.map(s => ({
        id: 'reg-' + s.nr,
        warstwa: 'reg2690',
        nazwa: s.nr + '. ' + s.tytul.replace(/\s*\(art\. 21.*$/, ''),
        podstawa: napis('punktacja.sekcja', {p0: s.nr}),
        opis: s.dyrektywa ? napis('punktacja.odpowiednik', {p0: s.dyrektywa}) : null,
        pytania: s.podsekcje.flatMap(p => p.wymogi.map(w => ({
            id: 'reg-' + w.nr,
            tekst: (p.wirtualna ? '' : p.tytul + ' — ') + napis('punktacja.punktSkrot', {p0: w.nr}),
            trescWymogu: w.tresc,
            art: napis('punktacja.punkt', {p0: w.nr}),
            warunkowy: w.warunkowy,
            czestotliwosc: w.czestotliwosc,
        }))),
    }));
}

/* Reguła składania warstw z modułu kraju, z domyślnymi wartościami
   modelu kumulatywnego, gdyby moduł jej nie zdefiniował. */
function relacjaDo2690() {
    const r = (typeof RELACJA_2690 !== 'undefined' && RELACJA_2690) || {};
    return {
        model: r.model || 'kumulatywny',
        podstawa: r.podstawa || null,
        krajowyGdyObjety: r.krajowyGdyObjety || 'pelny',
        reg2690: r.reg2690 || 'pelny',
        wyjatki: r.wyjatki || {},
    };
}

/* Pełny zestaw sekcji dla danego profilu — zależny od ról i statusu.
   Nie uwzględnia wyboru modułów; to pełen katalog obowiązujący podmiot. */
function zbudujKwestionariusz(profil, klasyfikacja) {
    const sekcje = [];
    const status = klasyfikacja.status;
    const warstwy = klasyfikacja.zestawy || [];

    const dopuszczona = (s) => !s.tylkoDlaStatusu || s.tylkoDlaStatusu.includes(status);

    /* Reguła składania warstw pochodzi z modułu kraju. Państwa różnie
       rozstrzygają, co obowiązuje podmiot objęty rozporządzeniem 2024/2690:
       Polska sumuje obie warstwy, Litwa wyłącza katalog krajowy, Łotwa
       stosuje krajowy z zastrzeżeniem pierwszeństwa rozporządzenia.
       Brak reguły w module traktujemy jak model kumulatywny. */
    const rel = relacjaDo2690();
    const objetyReg = warstwy.includes('reg2690');
    const trybKrajowy = objetyReg ? rel.krajowyGdyObjety : 'pelny';
    const trybSekcji = (s) => (rel.wyjatki && rel.wyjatki[s.id]) || trybKrajowy;

    /* Obowiązki formalne — rejestracja, incydenty, audyt — są zawsze krajowe. */
    KSC_OBOWIAZKI_SEKCJE.filter(dopuszczona).forEach(s =>
        sekcje.push({ ...s, warstwa: 'ksc-ob', typPytan: 'binarne' }));

    /* Podmiot ważny będący podmiotem publicznym „nie stosuje przepisu
       ust. 1” (art. 8 ust. 3) — art. 8 ust. 1 i załącznik nr 4 wykluczają
       się wzajemnie, więc pytania z art. 8 ustawiamy tylko poza tą ścieżką. */
    if (warstwy.includes('zal4')) {
        ZAL4_SEKCJE.forEach(s => sekcje.push({ ...s }));
    } else {
        KSC_ART8_SEKCJE.filter(dopuszczona).forEach(s => {
            const tryb = trybSekcji(s);
            if (tryb === 'wylaczony') return;
            sekcje.push({ ...s, warstwa: 'ksc', typPytan: 'skala',
                          ...(tryb === 'z-zastrzezeniem' ? { zastrzezenieReg2690: true } : {}) });
        });
    }

    if (warstwy.includes('pke')) {
        PKE_SEKCJE.forEach(s => sekcje.push({ ...s, warstwa: 'pke', typPytan: 'mieszane' }));
    }
    if (objetyReg && rel.reg2690 === 'pelny') {
        sekcjeReg2690().forEach(s => sekcje.push({ ...s, typPytan: 'skala' }));
    }
    return sekcje;
}

/* Sekcje ograniczone do modułów wybranych przez użytkownika.
   Brak wyboru oznacza moduły zalecane — nie pustkę. */
function sekcjeWybrane(profil, klasyfikacja) {
    const wszystkie = zbudujKwestionariusz(profil, klasyfikacja);
    const dostepne = moduleDostepne(klasyfikacja);
    const wybrane = (profil.moduly && profil.moduly.length)
        ? profil.moduly
        : moduleDomyslne(klasyfikacja).map(m => m.id);
    const aktywne = dostepne.filter(m => wybrane.includes(m.id));

    /* Moduł może zawężać nie tylko sekcje, ale i pojedyncze pytania
       (szybka ocena bierze wybrane pytania z całego katalogu).
       Pytanie trafia do wyniku, jeżeli obejmuje je którykolwiek
       z aktywnych modułów. */
    const zwykle = aktywne.filter(m => !m.scalaj);
    const scalane = aktywne.filter(m => m.scalaj);

    const wynik = wszystkie
        .map(s => {
            const moduly = zwykle.filter(m => m.sekcje(s));
            if (!moduly.length) return null;
            const pytania = s.pytania.filter(q =>
                moduly.some(m => !m.pytania || m.pytania(q)));
            return pytania.length ? { ...s, pytania } : null;
        })
        .filter(Boolean);

    /* Moduł przekrojowy (szybka ocena) czerpie po kilka pytań z wielu
       sekcji. Rozbicie go na 27 kroków po dwa pytania byłoby męczące,
       więc scalamy go w jedną sekcję, zachowując pochodzenie każdego
       pytania i jego typ odpowiedzi. */
    scalane.forEach(m => {
        const pytania = [];
        wszystkie.forEach(s => {
            if (!m.sekcje(s)) return;
            s.pytania.filter(q => !m.pytania || m.pytania(q)).forEach(q => {
                /* Pomijamy pytania już obecne w modułach zwykłych. */
                if (wynik.some(x => x.pytania.some(y => y.id === q.id))) return;
                pytania.push({ ...q, __typ: typPytania(s, q), __zrodlo: s.nazwa, __warstwa: s.warstwa });
            });
        });
        if (pytania.length) {
            wynik.unshift({
                id: m.id, warstwa: m.warstwa, przekrojowa: true,
                nazwa: m.nazwa, podstawa: napis('punktacja.3'),
                opis: m.dlaczego, typPytan: 'auto', pytania,
            });
        }
    });

    return wynik;
}

const WARSTWY_OPIS = {
    'ksc':     { nazwa: napis('punktacja.4'), skrot: napis('punktacja.skrotKsc'), kolor: '#1a56db' },
    'ksc-ob':  { nazwa: napis('punktacja.5'), skrot: napis('punktacja.6'), kolor: '#7c3aed' },
    'reg2690': { nazwa: napis('punktacja.7'), skrot: '2024/2690', kolor: '#0e7490' },
    'pke':     { nazwa: napis('punktacja.8'), skrot: napis('punktacja.skrotPke'), kolor: '#c2410c' },
    'zal4':    { nazwa: napis('punktacja.9'), skrot: napis('punktacja.10'), kolor: '#15803d' },
};

/* Typ pytania: sekcja może być jednorodna, mieszana (PKE) albo scalona
   z wielu sekcji (szybka ocena) — wtedy typ niesie samo pytanie. */
function typPytania(sekcja, pytanie) {
    if (pytanie && pytanie.__typ) return pytanie.__typ;
    if (sekcja.typPytan === 'mieszane') return pytanie.typ === 'skala' ? 'skala' : 'binarne';
    return sekcja.typPytan;
}

/* ── PUNKTACJA ─────────────────────────────────────────────*/
function policzWynik(ocena) {
    const o = ocena || stan;
    const kl = sklasyfikuj(o.profil);
    /* Punktujemy tylko moduły wybrane do wypełnienia — inaczej moduły
       świadomie pominięte zaniżałyby wynik, sugerując luki, których
       podmiot nie zadeklarował. */
    const sekcje = sekcjeWybrane(o.profil, kl);
    const docelowy = POZIOM_DOCELOWY[kl.status] || 3;

    const wynik = {
        status: kl.status,
        klasyfikacja: kl,
        docelowy,
        sekcje: {},
        warstwy: {},
        obowiazki: { wykonane: 0, wToku: 0, niewykonane: 0, nieDotyczy: 0, razem: 0 },
        ogolny: 0,
        zgodnosc: 0,
        odpowiedziano: 0,
        pytanRazem: 0,
        luki: [],
        ryzykoPrawne: [],
    };

    let sumaSkala = 0, liczbaSkala = 0;

    sekcje.forEach(s => {
        const pytania = s.pytania || [];
        let suma = 0, liczba = 0, wyk = 0, tok = 0, nie = 0, nd = 0, binarnych = 0;

        pytania.forEach(q => {
            wynik.pytanRazem++;
            const a = normalizujOdpowiedz(o.odpowiedzi[q.id]);
            const typ = typPytania(s, q);
            if (typ !== 'skala') binarnych++;

            if (typ === 'skala') {
                if (a && Number.isFinite(a.poziom)) {
                    wynik.odpowiedziano++;
                    suma += a.poziom; liczba++;
                    sumaSkala += a.poziom; liczbaSkala++;
                }
            } else {
                if (a && a.stan) {
                    wynik.odpowiedziano++;
                    if (a.stan === 'wykonane') wyk++;
                    else if (a.stan === 'w-toku') tok++;
                    else if (a.stan === 'niewykonane') {
                        nie++;
                        if (q.sankcja) {
                            wynik.ryzykoPrawne.push({
                                pytanieId: q.id, tekst: q.tekst, art: q.art,
                                sankcja: q.sankcja, sekcja: s.nazwa, termin: q.termin || null,
                            });
                        }
                    } else if (a.stan === 'nie-dotyczy') nd++;
                }
            }
        });

        /* Sekcja jest oceniana w skali, jeżeli tak zdefiniowano jej typ albo
           jeżeli padła w niej choć jedna odpowiedź w skali. Sekcja przekrojowa
           (szybka ocena) ma typ „auto”, więc bez tego wypadałaby z analizy luk
           i z wykresów, mimo że zawiera pytania w skali. */
        const jestSkala = s.typPytan === 'skala' || liczba > 0;
        const srednia = liczba ? Math.round((suma / liczba) * 100) / 100 : 0;

        wynik.sekcje[s.id] = {
            id: s.id, nazwa: s.nazwa, warstwa: s.warstwa, podstawa: s.podstawa,
            srednia, odpowiedziano: liczba + wyk + tok + nie + nd, razem: pytania.length,
            luka: jestSkala ? Math.max(0, docelowy - srednia) : null,
            wykonane: wyk, wToku: tok, niewykonane: nie, nieDotyczy: nd,
            typ: s.typPytan,
        };

        /* Obowiązki liczymy po typie pytania, a nie sekcji — sekcja
           przekrojowa i sekcje PKE mieszają oba rodzaje. */
        if (binarnych) {
            wynik.obowiazki.wykonane += wyk;
            wynik.obowiazki.wToku += tok;
            wynik.obowiazki.niewykonane += nie;
            wynik.obowiazki.nieDotyczy += nd;
            wynik.obowiazki.razem += binarnych;
        }

        const w = wynik.warstwy[s.warstwa] || (wynik.warstwy[s.warstwa] = { suma: 0, liczba: 0, pytan: 0, odpowiedziano: 0 });
        w.suma += suma; w.liczba += liczba; w.pytan += pytania.length;
        w.odpowiedziano += liczba + wyk + tok + nie + nd;
    });

    Object.values(wynik.warstwy).forEach(w => {
        w.srednia = w.liczba ? Math.round((w.suma / w.liczba) * 100) / 100 : null;
    });

    wynik.ogolny = liczbaSkala ? Math.round((sumaSkala / liczbaSkala) * 100) / 100 : 0;
    wynik.maSkale = liczbaSkala > 0;

    /* Stopień wykonania obowiązków formalnych — pozycje "nie dotyczy"
       nie wchodzą do mianownika, bo nie są zaniechaniem. */
    const obPodstawa = wynik.obowiazki.wykonane + wynik.obowiazki.wToku + wynik.obowiazki.niewykonane;
    wynik.obowiazki.procent = obPodstawa
        ? Math.round(((wynik.obowiazki.wykonane + wynik.obowiazki.wToku * 0.5) / obPodstawa) * 100)
        : null;

    /* Gdy wybrane moduły nie zawierają ani jednego pytania w skali dojrzałości,
       wskaźnikiem wiodącym jest wykonanie obowiązków — inaczej podmiot, który
       wypełnił cały wybrany moduł, widziałby zgodność 0 %. */
    if (wynik.maSkale) {
        wynik.zgodnosc = Math.min(100, Math.round((wynik.ogolny / docelowy) * 100));
        wynik.miaraZgodnosci = 'dojrzalosc';
    } else {
        wynik.zgodnosc = wynik.obowiazki.procent === null ? 0 : wynik.obowiazki.procent;
        wynik.miaraZgodnosci = 'obowiazki';
    }

    /* Obszary do wykresów i analizy luk.
       Sekcja przekrojowa zbiera po kilka pytań z wielu obszarów, więc jako
       jeden słupek nic by nie powiedziała. Rozbijamy ją z powrotem na
       obszary źródłowe — dopiero to daje czytelny profil dojrzałości. */
    const obszary = [];
    sekcje.forEach(s => {
        const w = wynik.sekcje[s.id];
        if (!s.przekrojowa) {
            if (w.luka !== null && w.odpowiedziano > 0) obszary.push(w);
            return;
        }
        const wgZrodla = new Map();
        s.pytania.forEach(q => {
            const a = normalizujOdpowiedz(o.odpowiedzi[q.id]);
            if (typPytania(s, q) !== 'skala' || !a || !Number.isFinite(a.poziom)) return;
            const klucz = q.__zrodlo || s.nazwa;
            const g = wgZrodla.get(klucz) || { suma: 0, liczba: 0, warstwa: q.__warstwa || s.warstwa };
            g.suma += a.poziom; g.liczba++;
            wgZrodla.set(klucz, g);
        });
        wgZrodla.forEach((g, nazwa) => {
            const sr = Math.round((g.suma / g.liczba) * 100) / 100;
            obszary.push({
                id: s.id + '::' + nazwa, nazwa, warstwa: g.warstwa,
                podstawa: napis('punktacja.11') + s.nazwa,
                srednia: sr, odpowiedziano: g.liczba, razem: g.liczba,
                luka: Math.max(0, docelowy - sr), typ: 'skala', zPrzekrojowej: true,
            });
        });
    });

    wynik.luki = obszary
        .sort((a, b) => b.luka - a.luka)
        .map(s => ({ ...s, priorytet: priorytetLuki(s.luka) }));

    return wynik;
}

function priorytetLuki(luka) {
    if (luka >= 2) return { id: 'krytyczny', nazwa: napis('punktacja.krytyczny'), kolor: 'var(--w-krytyczny)', tlo: 'var(--w-krytyczny-tlo)' };
    if (luka >= 1.5) return { id: 'wysoki', nazwa: napis('punktacja.wysoki'), kolor: 'var(--w-wysoki)', tlo: 'var(--w-wysoki-tlo)' };
    if (luka >= 0.5) return { id: 'sredni', nazwa: napis('punktacja.12'), kolor: 'var(--w-sredni)', tlo: 'var(--w-sredni-tlo)' };
    return { id: 'niski', nazwa: napis('punktacja.niski'), kolor: 'var(--w-niski)', tlo: 'var(--w-niski-tlo)' };
}

/* Kolory wracają jako zmienne CSS, nie jako kod szesnastkowy: ten sam
   zapis musi być czytelny na białym i na grafitowym tle, a wartości
   dla obu motywów trzyma arkusz. Wykresy potrzebują gotowej barwy —
   rozwiązuje ją kolorRozwiazany(). */
function kolorWyniku(v, docelowy) {
    if (v >= docelowy) return 'var(--w-niski)';
    if (v >= docelowy - 1) return 'var(--w-sredni)';
    return 'var(--w-krytyczny)';
}

function kolorRozwiazany(wartosc) {
    const m = String(wartosc).match(/var\((--[\w-]+)\)/);
    if (!m) return wartosc;
    return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || '#4b5563';
}

function etykietaDojrzalosci(v) {
    if (v >= 4.5) return 'Optymalizowany';
    if (v >= 3.5) return napis('punktacja.13');
    if (v >= 2.5) return 'Zdefiniowany';
    if (v >= 1.5) return 'Rozwijany';
    if (v > 0) return napis('punktacja.14');
    return 'Nieoceniony';
}
