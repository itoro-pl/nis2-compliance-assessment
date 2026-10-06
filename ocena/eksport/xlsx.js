/* ==========================================================
   Eksport oceny do arkusza XLSX
   ========================================================== */

function eksportujXLSX() {
    if (!stan) { powiadom(napis('xlsx.2'), napis('xlsx.3')); return; }

    const w = policzWynik(stan);
    const p = stan.profil;
    const kl = w.klasyfikacja;
    const kara = kl.status !== 'poza' ? obliczKare(kl.status, p.przychod, p.kursEUR) : null;
    const kier = obliczKareKierownika(p.wynagrodzenieKierownika, p.role.includes('isp'), kontekstKierownika(p));
    const sekcje = zbudujKwestionariusz(p, kl);
    const wb = XLSX.utils.book_new();

    const dodaj = (nazwa, dane, szer) => {
        const ws = XLSX.utils.aoa_to_sheet(dane);
        if (szer) ws['!cols'] = szer.map(x => ({ wch: x }));
        XLSX.utils.book_append_sheet(wb, ws, nazwa.slice(0, 31));
    };

    /* 1. Podsumowanie dla zarządu */
    const podsum = [
        [napis('xlsx.4')],
        [napis('xlsx.5'), wersjaOpis()], [''],
        [napis('xlsx.podmiot'), p.nazwa], [napis('xlsx.etykietaNip'), p.nip], [napis('xlsx.etykietaRegon'), p.regon], [napis('xlsx.etykietaKrs'), p.krs],
        [napis('xlsx.6'), p.formaPrawna], [napis('xlsx.adres'), p.adres], [napis('xlsx.7'), p.dataOceny], [''],
        [napis('xlsx.klasyfikacja')],
        [napis('xlsx.status'), STATUS_OPIS[kl.status].nazwa],
        [napis('xlsx.8'), kl.podstawa || ''],
        [napis('xlsx.9'), STATUS_OPIS[kl.status].nadzor],
        [napis('xlsx.role'), p.role.map(r => (ROLA_WG_ID[r] || {}).nazwa || r).join('; ')],
        [napis('xlsx.10'), (WIELKOSC[p.wielkosc] || {}).nazwa || ''],
        [napis('xlsx.11'), kl.organy.map(o => o.organ.skrot + ' (' + o.podstawy.join(', ') + ')').join('; ')],
        [napis('xlsx.12'), kl.zestawy.map(z => WARSTWY_OPIS[z].nazwa).join('; ')], [''],
        [napis('xlsx.wynik')],
        [napis('xlsx.13'), w.ogolny.toFixed(2)],
        [napis('xlsx.14'), w.docelowy],
        [napis('xlsx.15'), w.zgodnosc + '%'],
        [napis('xlsx.16'), `${w.odpowiedziano} / ${w.pytanRazem}`],
        [napis('xlsx.17'), `${w.obowiazki.wykonane} / ${w.obowiazki.razem}`],
        [napis('xlsx.18'), w.obowiazki.niewykonane],
        [napis('xlsx.19'), w.obowiazki.wToku], [''],
        [napis('xlsx.20')],
    ];
    if (kara) {
        podsum.push([napis('xlsx.21'), Math.round(kara.kwota)]);
        podsum.push([napis('xlsx.22'), kara.podstawaWyboru]);
        podsum.push([napis('xlsx.8'), kara.podstawaPrawna]);
        podsum.push([napis('xlsx.23'), kara.wariantProcentowy !== null ? Math.round(kara.wariantProcentowy) : '—']);
        podsum.push([napis('xlsx.24'), Math.round(kara.wariantKwotowy)]);
        podsum.push([napis('xlsx.25'), kara.kurs]);
        podsum.push([napis('xlsx.26'), kara.minimum]);
    }
    podsum.push([napis('xlsx.27'), napis('xlsx.1', {p0: KARY_KSC.okresowa.minPLN, p1: KARY_KSC.okresowa.maksPLN})]);
    podsum.push([napis('xlsx.28'), napis('xlsx.do', {p0: KARY_KSC.kwalifikowana.kwotaPLN, p1: WALUTA.symbol})]);
    podsum.push([napis('xlsx.29'), KARY_KSC.odKiedy.data + ' (' + KARY_KSC.odKiedy.podstawa + ')']);
    podsum.push(['']);
    podsum.push([napis('xlsx.30')]);
    if (kier.pozycje.length) {
        podsum.push([napis('xlsx.31'), napis('xlsx.podstawa'), napis('xlsx.organ'), napis('xlsx.32')]);
        kier.pozycje.forEach(x => podsum.push([x.akt, x.podstawa, x.organ, Math.round(x.kwota)]));
        if (kier.pozycje.length > 1) podsum.push([napis('xlsx.33'), '', '', Math.round(kier.suma)]);
    } else {
        podsum.push([napis('xlsx.34')]);
    }
    KARY_KSC.kierownik.zasady.forEach(z => podsum.push([z]));
    dodaj(napis('xlsx.35'), podsum, [38, 60, 40, 18]);

    /* 2. Ocena szczegółowa */
    const szczeg = [[napis('xlsx.31'), napis('xlsx.sekcja'), napis('xlsx.podstawa'), 'ID', napis('xlsx.pytanie'), napis('xlsx.36'), napis('xlsx.37'), napis('xlsx.38'), napis('xlsx.termin'), napis('xlsx.uwagi'), napis('xlsx.39'), napis('xlsx.40'), napis('xlsx.sankcja')]];
    sekcje.forEach(s => {
        s.pytania.forEach(q => {
            const a = normalizujOdpowiedz(stan.odpowiedzi[q.id]);
            const typ = typPytania(s, q);
            let odp = napis('xlsx.41');
            if (a) {
                if (typ === 'skala' && Number.isFinite(a.poziom)) {
                    odp = a.poziom + ' — ' + (POZIOMY_DOJRZALOSCI[a.poziom - 1] || {}).nazwa;
                } else if (a.stan) {
                    odp = (STANY_OBOWIAZKU.find(x => x.id === a.stan) || {}).nazwa || a.stan;
                }
            }
            szczeg.push([
                WARSTWY_OPIS[s.warstwa].skrot, s.nazwa, s.podstawa || '', q.id, q.tekst, odp,
                (a && a.dowod) || '', (a && a.wlasciciel) || '', (a && a.termin) || '', (a && a.uwagi) || '',
                q.art || '', q.iso || '', q.sankcja || '',
            ]);
        });
    });
    dodaj(napis('xlsx.42'), szczeg, [12, 34, 30, 12, 80, 22, 34, 18, 14, 34, 34, 26, 26]);

    /* 3. Analiza luk */
    const luki = [[napis('xlsx.obszar'), napis('xlsx.31'), napis('xlsx.podstawa'), napis('xlsx.obecnie'), napis('xlsx.cel'), napis('xlsx.luka'), napis('xlsx.priorytet'), napis('xlsx.43')]];
    w.luki.forEach(l => luki.push([l.nazwa, WARSTWY_OPIS[l.warstwa].skrot, l.podstawa || '', l.srednia, w.docelowy, Number(l.luka.toFixed(2)), l.priorytet.nazwa, `${l.odpowiedziano}/${l.razem}`]));
    dodaj(napis('xlsx.44'), luki, [40, 12, 34, 10, 8, 8, 12, 12]);

    /* 4. Obowiązki formalne */
    const ob = [[napis('xlsx.sekcja'), 'ID', napis('xlsx.45'), napis('xlsx.stan'), napis('xlsx.46'), napis('xlsx.podstawa'), napis('xlsx.sankcja'), napis('xlsx.37'), napis('xlsx.38')]];
    sekcje.filter(s => s.typPytan === 'binarne' || s.typPytan === 'mieszane').forEach(s => {
        s.pytania.forEach(q => {
            if (typPytania(s, q) !== 'binarne') return;
            const a = normalizujOdpowiedz(stan.odpowiedzi[q.id]);
            ob.push([s.nazwa, q.id, q.tekst,
                a && a.stan ? (STANY_OBOWIAZKU.find(x => x.id === a.stan) || {}).nazwa : napis('xlsx.41'),
                q.termin || q.terminUstawowy || '', q.art || '', q.sankcja || '',
                (a && a.dowod) || '', (a && a.wlasciciel) || '']);
        });
    });
    dodaj(napis('xlsx.47'), ob, [34, 12, 80, 16, 30, 30, 26, 34, 18]);

    /* 5. Ryzyko prawne */
    const ryz = [[napis('xlsx.48'), napis('xlsx.sekcja'), napis('xlsx.podstawa'), napis('xlsx.termin'), napis('xlsx.49')]];
    w.ryzykoPrawne.forEach(r => ryz.push([r.tekst, r.sekcja, r.art, r.termin || '', r.sankcja]));
    if (w.ryzykoPrawne.length === 0) ryz.push([napis('xlsx.50')]);
    dodaj(napis('xlsx.51'), ryz, [80, 34, 30, 24, 30]);

    /* 6. Kalendarz */
    const kal = [[napis('xlsx.data'), napis('xlsx.zdarzenie'), napis('xlsx.opis'), napis('xlsx.podstawa'), napis('xlsx.52')]];
    nadchodzaceTerminy(kl.status).forEach(t => kal.push([t.data, t.tytul, t.opis, t.podstawa, t.minelo ? napis('wspolne.minelo') : t.dni]));
    kal.push(['']);
    kal.push([napis('xlsx.53')]);
    kal.push([napis('xlsx.termin'), napis('xlsx.54'), napis('xlsx.55'), napis('xlsx.podstawa')]);
    TERMINY_INDYWIDUALNE.forEach(t => kal.push([t.termin, t.od, t.co, t.art]));
    dodaj(napis('xlsx.kalendarz'), kal, [16, 44, 70, 44, 14]);

    /* 7. Progi incydentów */
    const progi = [[napis('xlsx.rola'), napis('xlsx.39'), napis('xlsx.litera'), napis('xlsx.kryterium')]];
    reg2690ProgiDlaRol(p.role).forEach(g => g.kryteria.forEach(k => progi.push([g.nazwa, g.artykul, k.lit, k.tresc])));
    progi.push(['']);
    progi.push([napis('xlsx.56')]);
    REG2690_PROGI_HORYZONTALNE.forEach(k => progi.push([napis('xlsx.57'), 'art. 3 ust. 1', k.lit, k.tytul + ' — ' + k.tresc]));
    if (p.role.includes('isp')) {
        progi.push(['']);
        progi.push([napis('xlsx.58')]);
    }
    dodaj(napis('xlsx.59'), progi, [40, 16, 8, 110]);

    /* 8. Historia migawek */
    const hist = [[napis('xlsx.data'), napis('xlsx.notatka'), napis('xlsx.60'), napis('xlsx.61'), napis('xlsx.62'), napis('xlsx.63')]];
    stan.migawki.forEach(m => hist.push([m.data.slice(0, 10), m.notatka, m.wynik.ogolny, m.wynik.zgodnosc + '%', m.wynik.obowiazkiWykonane, m.wynik.obowiazkiRazem]));
    hist.push([new Date().toISOString().slice(0, 10), napis('xlsx.64'), w.ogolny, w.zgodnosc + '%', w.obowiazki.wykonane, w.obowiazki.razem]);
    dodaj(napis('xlsx.historia'), hist, [14, 50, 12, 12, 20, 18]);

    /* 9. Podstawa prawna */
    const pods = [[napis('xlsx.akt'), napis('xlsx.65'), napis('xlsx.publikacja'), napis('xlsx.uwagi')]];
    Object.values(AKTY).forEach(a => pods.push(['', a.tytul, a.dziennik, a.wejscie ? napis('xlsx.66') + a.wejscie : '']));
    pods.push(['']);
    pods.push([napis('xlsx.67')]);
    pods.push([napis('xlsx.68')]);
    pods.push([napis('xlsx.69')]);
    pods.push([napis('xlsx.70')]);
    dodaj(napis('xlsx.8'), pods, [10, 90, 30, 40]);

    const nazwa = bezpiecznaNazwaPliku(stan) + '.xlsx';
    XLSX.writeFile(wb, nazwa);
    powiadom(napis('xlsx.wyeksportowano'), nazwa);
}
