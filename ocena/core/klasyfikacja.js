/* ==========================================================
   Klasyfikacja podmiotu — podmiot kluczowy / ważny / poza zakresem
   Podstawa: art. 5 i art. 41 ustawy z 5.07.2018 r. o krajowym systemie
   cyberbezpieczeństwa (t.j. Dz.U. 2026 poz. 20) w brzmieniu nadanym
   ustawą z 23.01.2026 r. (Dz.U. 2026 poz. 252).

   Zależności: data/role.js (ROLE, ROLA_WG_ID, WIELKOSC, ORGANY, ZESTAW)
   ========================================================== */

const STATUS = {
    KLUCZOWY:     'kluczowy',
    WAZNY:        'wazny',
    POZA_ZAKRESEM: 'poza',
};

const STATUS_OPIS = {
    kluczowy: {
        nazwa: napis('klasyfikacja.1'),
        kolor: '#dc2626',
        nadzor: napis('klasyfikacja.2'),
        poziomDocelowy: 4,
    },
    wazny: {
        nazwa: napis('klasyfikacja.3'),
        kolor: '#b45309',
        nadzor: napis('klasyfikacja.4'),
        poziomDocelowy: 3,
    },
    poza: {
        nazwa: napis('klasyfikacja.5'),
        kolor: '#4b5563',
        nadzor: napis('klasyfikacja.6'),
        poziomDocelowy: null,
    },
};

/* Ocena pojedynczej roli.
   wejscie: { rolaId, wielkosc, kwalifikowanyDostawcaZaufania }
   wynik:   { rolaId, status, podstawa, organ } */
function ocenRole(rolaId, profil) {
    const rola = ROLA_WG_ID[rolaId];
    if (!rola) return null;

    const rank = WIELKOSC[profil.wielkosc] ? WIELKOSC[profil.wielkosc].rank : 0;
    let status = STATUS.POZA_ZAKRESEM;
    let podstawa = null;

    switch (rola.regula) {
        /* art. 5 ust. 1 pkt 1 / ust. 2 pkt 1 — podmiot z załącznika nr 1.
           Kluczowy, gdy przewyższa wymogi dla średniego przedsiębiorcy;
           ważny, gdy spełnia kryteria średniego. */
        case 'progowa':
            if (rank >= WIELKOSC.duzy.rank) {
                status = STATUS.KLUCZOWY;
                podstawa = napis('klasyfikacja.7');
            } else if (rank === WIELKOSC.sredni.rank) {
                status = STATUS.WAZNY;
                podstawa = napis('klasyfikacja.8');
            } else {
                podstawa = napis('klasyfikacja.9');
            }
            break;

        /* art. 5 ust. 1 pkt 2 / ust. 2 pkt 4 — przedsiębiorca komunikacji
           elektronicznej. Brak progu wyłączającego z zakresu ustawy. */
        case 'progowa-ke':
            if (rank >= WIELKOSC.sredni.rank) {
                status = STATUS.KLUCZOWY;
                podstawa = napis('klasyfikacja.10');
            } else if (rank > 0) {
                status = STATUS.WAZNY;
                podstawa = napis('klasyfikacja.11');
            }
            break;

        /* art. 5 ust. 1 pkt 3 — dostawca usług zarządzanych w zakresie
           cyberbezpieczeństwa. Kluczowy już od małego przedsiębiorcy. */
        case 'progowa-mssp':
            if (rank >= WIELKOSC.maly.rank) {
                status = STATUS.KLUCZOWY;
                podstawa = napis('klasyfikacja.12');
            } else {
                podstawa = napis('klasyfikacja.13');
            }
            break;

        /* art. 5 ust. 1 pkt 4 — podmiot kluczowy niezależnie od wielkości. */
        case 'zawsze-kluczowy':
            status = STATUS.KLUCZOWY;
            podstawa = (rola.podstawaKluczowy || '') + napis('klasyfikacja.14');
            break;

        /* Dostawca usług zaufania — art. 5 ust. 1 pkt 4 lit. b (kwalifikowany)
           oraz art. 5 ust. 2 pkt 3 (niekwalifikowany mikro/mały/średni). */
        case 'zaufania':
            if (profil.kwalifikowanyDostawcaZaufania) {
                status = STATUS.KLUCZOWY;
                podstawa = napis('klasyfikacja.15');
            } else if (rank >= WIELKOSC.duzy.rank) {
                status = STATUS.KLUCZOWY;
                podstawa = napis('klasyfikacja.7');
            } else if (rank > 0) {
                status = STATUS.WAZNY;
                podstawa = napis('klasyfikacja.16');
            }
            break;

        /* art. 5 ust. 1 pkt 4 lit. d — podmiot publiczny z załącznika nr 1.
           Progi wielkości przedsiębiorcy nie mają tu zastosowania. */
        case 'publiczny-kluczowy':
            status = STATUS.KLUCZOWY;
            podstawa = (rola.podstawaKluczowy || '') + napis('klasyfikacja.17');
            break;

        /* art. 5 ust. 2 pkt 8 — samorządowy podmiot publiczny z załącznika
           nr 2 oraz uczelnia niebędąca organizacją badawczą (art. 8 ust. 3).
           Warunkiem jest realizowanie zadania publicznego z wykorzystaniem
           systemów informacyjnych — potwierdza to sam użytkownik w profilu. */
        case 'publiczny-wazny':
            status = STATUS.WAZNY;
            podstawa = napis('klasyfikacja.18');
            break;

        /* Załącznik nr 1, sektor podmiotów publicznych, pkt 4 — urząd gminy
           jest w załączniku nr 1 tylko przy co najmniej 50 etatach na dzień
           1 stycznia. Poniżej progu pozostaje samorządową jednostką
           budżetową z załącznika nr 2, czyli podmiotem ważnym. */
        case 'publiczny-gmina':
            if (rank >= WIELKOSC.sredni.rank) {
                status = STATUS.KLUCZOWY;
                podstawa = napis('klasyfikacja.19');
            } else {
                status = STATUS.WAZNY;
                podstawa = napis('klasyfikacja.20');
            }
            break;
    }

    /* Podmiot publiczny będący podmiotem WAŻNYM nie stosuje art. 8 ust. 1,
       tylko załącznik nr 4 (art. 8 ust. 3). Urząd gminy poniżej progu
       przechodzi więc na inny zestaw pytań niż ten zadeklarowany w roli. */
    if (rola.regula === 'publiczny-gmina' && status === STATUS.WAZNY) {
        return {
            rolaId, nazwa: rola.nazwa, status, podstawa,
            organ: ORGANY[rola.organ],
            zestawy: [ZESTAW.ZAL4],
            uwaga: napis('klasyfikacja.21'),
        };
    }

    return {
        rolaId,
        nazwa: rola.nazwa,
        status,
        podstawa,
        organ: status === STATUS.POZA_ZAKRESEM ? null : ORGANY[rola.organ],
        zestawy: status === STATUS.POZA_ZAKRESEM ? [] : rola.zestawy,
        uwaga: rola.uwaga || null,
    };
}

/* Klasyfikacja całego podmiotu na podstawie wszystkich zadeklarowanych ról.
   profil: { role: [id], wielkosc, kwalifikowanyDostawcaZaufania,
             niezalezneSystemy, podmiotMON } */
function sklasyfikuj(profil) {
    const wynik = {
        status: STATUS.POZA_ZAKRESEM,
        podstawa: null,
        oceny: [],
        organy: [],
        zestawy: [],
        ostrzezenia: [],
        poziomDocelowy: null,
    };

    /* Wyłączenia podmiotowe — art. 5 ust. 10 i 11 ustawy o KSC. */
    if (profil.podmiotMON) {
        wynik.ostrzezenia.push({
            typ: 'wylaczenie',
            tekst: napis('klasyfikacja.22'),
        });
    }

    (profil.role || []).forEach(rolaId => {
        const ocena = ocenRole(rolaId, profil);
        if (ocena) wynik.oceny.push(ocena);
    });

    if (!wynik.oceny.length) return wynik;

    /* Reguła kolizji — art. 5 ust. 4: podmiot spełniający kryteria zarówno
       podmiotu kluczowego, jak i ważnego, jest podmiotem kluczowym. */
    const maKluczowy = wynik.oceny.some(o => o.status === STATUS.KLUCZOWY);
    const maWazny    = wynik.oceny.some(o => o.status === STATUS.WAZNY);

    if (maKluczowy) {
        wynik.status = STATUS.KLUCZOWY;
        const zrodlo = wynik.oceny.find(o => o.status === STATUS.KLUCZOWY);
        wynik.podstawa = zrodlo.podstawa;
        if (maWazny) {
            wynik.ostrzezenia.push({
                typ: 'kolizja',
                tekst: napis('klasyfikacja.23'),
            });
        }
    } else if (maWazny) {
        wynik.status = STATUS.WAZNY;
        wynik.podstawa = wynik.oceny.find(o => o.status === STATUS.WAZNY).podstawa;
    }

    wynik.poziomDocelowy = STATUS_OPIS[wynik.status].poziomDocelowy;

    /* Organy właściwe — mogą być różne dla różnych ról tego samego podmiotu.
       Scalamy po nazwie organu: ten sam minister bywa właściwy na kilku
       podstawach (np. art. 41 pkt 8 dla infrastruktury cyfrowej i pkt 9b dla
       zarządzania usługami ICT). Zbieramy wtedy wszystkie podstawy razem. */
    const organyMap = new Map();
    wynik.oceny.filter(o => o.organ).forEach(o => {
        const klucz = o.organ.nazwa;
        if (!organyMap.has(klucz)) {
            organyMap.set(klucz, { organ: o.organ, role: [], podstawy: [] });
        }
        const wpis = organyMap.get(klucz);
        wpis.role.push(o.nazwa);
        if (!wpis.podstawy.includes(o.organ.podstawa)) wpis.podstawy.push(o.organ.podstawa);
    });
    wynik.organy = Array.from(organyMap.values());

    if (wynik.organy.length > 1) {
        wynik.ostrzezenia.push({
            typ: 'wiele-organow',
            tekst: napis('klasyfikacja.24'),
        });
    }

    /* Zestawy pytań uruchamiane przez zadeklarowane role. */
    const zestawy = new Set();
    wynik.oceny.forEach(o => o.zestawy.forEach(z => zestawy.add(z)));

    /* Załącznik nr 4 przysługuje wyłącznie podmiotowi WAŻNEMU będącemu
       podmiotem publicznym (art. 8 ust. 3). Jeżeli ten sam podmiot jest
       skądinąd kluczowy — bo pełni też rolę przedsiębiorcy albo jest
       w załączniku nr 1 — złagodzenie odpada i wraca pełny art. 8 ust. 1. */
    if (zestawy.has(ZESTAW.ZAL4) && wynik.status === STATUS.KLUCZOWY) {
        zestawy.delete(ZESTAW.ZAL4);
        zestawy.add(ZESTAW.KSC);
        wynik.ostrzezenia.push({
            typ: 'zal4-odpada',
            tekst: napis('klasyfikacja.25'),
        });
    }

    wynik.zestawy = Array.from(zestawy);

    /* Złagodzenia przysługujące podmiotowi ważnemu będącemu podmiotem
       publicznym. Są istotne dla zarządu, bo zmieniają zarówno zakres
       obowiązków, jak i wysokość osobistej odpowiedzialności kierownika. */
    if (wynik.zestawy.includes(ZESTAW.ZAL4)) {
        wynik.ostrzezenia.push({
            typ: 'publiczny-zlagodzenia',
            tekst: napis('klasyfikacja.26'),
        });
    }

    /* Art. 16d: podmiot publiczny realizuje obowiązki tylko w zakresie,
       w jakim wykorzystuje system informacyjny do zadania publicznego. */
    if (wynik.oceny.some(o => (ROLA_WG_ID[o.rolaId] || {}).sektor === napis('klasyfikacja.27'))) {
        wynik.ostrzezenia.push({
            typ: 'zakres-publiczny',
            tekst: napis('klasyfikacja.28'),
        });
    }

    /* Wyłączenie tzw. niezależnych systemów — art. 5 ust. 6 i 7. */
    if (profil.niezalezneSystemy) {
        wynik.ostrzezenia.push({
            typ: 'niezalezne-systemy',
            tekst: napis('klasyfikacja.29'),
        });
    }

    return wynik;
}

/* Kontekst potrzebny do wymiaru kary dla kierownika (art. 73a ust. 5):
   obniżony pułap 100 % przysługuje podmiotowi publicznemu, ale przepada,
   gdy ten sam podmiot jest objęty ustawą także z tytułu innego sektora. */
function kontekstKierownika(profil) {
    const role = (profil.role || []).map(id => ROLA_WG_ID[id]).filter(Boolean);
    const publiczne = role.filter(r => r.sektor === napis('klasyfikacja.27'));
    return {
        podmiotPubliczny: publiczne.length > 0,
        innySektor: publiczne.length > 0 && publiczne.length < role.length,
    };
}
