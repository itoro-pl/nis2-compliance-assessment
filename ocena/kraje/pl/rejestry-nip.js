/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   Pobieranie danych podmiotu na podstawie numeru NIP

   Źródła — oba publiczne, bezpłatne, bez klucza API, oba odsyłają
   nagłówek Access-Control-Allow-Origin odbijający Origin żądania
   (także "null"), więc działają z pliku otwartego bezpośrednio z dysku:

   1. Wykaz podatników VAT ("biała lista") — Ministerstwo Finansów
      https://wl-api.mf.gov.pl/api/search/nip/{nip}?date=RRRR-MM-DD
      zwraca: nazwę, REGON, KRS, adres, status VAT
   2. Rejestr KRS — Ministerstwo Sprawiedliwości
      https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/{krs}?rejestr=P&format=json
      zwraca: formę prawną, adres, kody PKD

   ZASADY:
   - Pobranie danych jest ZAWSZE świadomym działaniem użytkownika
     (osobny przycisk), nigdy nie uruchamia się automatycznie. Narzędzie
     musi działać w sieci odciętej od internetu, a operator infrastruktury
     krytycznej powinien kontrolować ruch wychodzący.
   - Kody PKD SUGERUJĄ role, ale ich nie przesądzają. Klasyfikacja prawna
     wynika z faktycznie wykonywanej działalności (art. 5 ustawy o KSC),
     a nie z wpisu w rejestrze. Użytkownik zawsze potwierdza wybór.
   - Nie pobieramy i nie zapisujemy danych osobowych członków organów
     (sekcja "reprezentacja" odpisu KRS jest pomijana).
   - Wielkość przedsiębiorstwa i przychód nie występują w tych rejestrach
     i pozostają do wypełnienia ręcznego — a to one decydują o klasyfikacji.
   ========================================================== */

const NIP_ZRODLA = {
    bialaLista: {
        nazwa: 'Wykaz podatników VAT (biała lista)',
        organ: 'Ministerstwo Finansów',
        url: 'https://wl-api.mf.gov.pl',
    },
    krs: {
        nazwa: 'Krajowy Rejestr Sądowy',
        organ: 'Ministerstwo Sprawiedliwości',
        url: 'https://api-krs.ms.gov.pl',
    },
};

/* ── MAPOWANIE PKD NA ROLE ─────────────────────────────────
   Obsługiwane są równolegle PKD 2025 (obecne wpisy) i PKD 2007
   (wpisy nieaktualizowane). Dopasowanie odbywa się trójstopniowo:
   dokładny kod → prefiks grupy → słowa kluczowe w opisie. */
const PKD_ROLE = [
    /* --- PKD 2025 --- */
    { kod: '61.10.A', role: ['ixp'], opis: 'Działalność w zakresie wymiany ruchu internetowego' },
    { kod: '61.10.B', role: ['isp'], opis: 'Pozostała działalność w zakresie telekomunikacji przewodowej, bezprzewodowej i satelitarnej' },
    { kod: '63.10.D', role: ['dc', 'chmura'], opis: 'Pozostała działalność usługowa w zakresie infrastruktury obliczeniowej' },
    { kod: '62.20.B', role: ['msp'], opis: 'Pozostała działalność związana z doradztwem w zakresie informatyki oraz zarządzaniem urządzeniami informatycznymi' },
    /* --- PKD 2007 --- */
    { kod: '61.10.Z', role: ['isp'], opis: 'Działalność w zakresie telekomunikacji przewodowej' },
    { kod: '61.20.Z', role: ['isp'], opis: 'Działalność w zakresie telekomunikacji bezprzewodowej' },
    { kod: '61.30.Z', role: ['isp'], opis: 'Działalność w zakresie telekomunikacji satelitarnej' },
    { kod: '61.90.Z', role: ['isp'], opis: 'Działalność w zakresie pozostałej telekomunikacji' },
    { kod: '63.11.Z', role: ['dc', 'chmura'], opis: 'Przetwarzanie danych; zarządzanie stronami internetowymi (hosting)' },
    { kod: '62.03.Z', role: ['msp'], opis: 'Działalność związana z zarządzaniem urządzeniami informatycznymi' },
];

/* Prefiksy grup — gdy dokładny kod nie jest znany. */
const PKD_PREFIKSY = [
    { prefiks: '61.10', role: ['isp'] },
    { prefiks: '61.20', role: ['isp'] },
    { prefiks: '61.30', role: ['isp'] },
    { prefiks: '61.90', role: ['isp'] },
    { prefiks: '61.',   role: ['isp'] },
    { prefiks: '63.10', role: ['dc', 'chmura'] },
    { prefiks: '63.11', role: ['dc', 'chmura'] },
];

/* Słowa kluczowe w opisie PKD — najbardziej odporne na zmiany klasyfikacji. */
const PKD_SLOWA = [
    { fraza: 'WYMIANY RUCHU INTERNETOWEGO', role: ['ixp'] },
    { fraza: 'TELEKOMUNIKAC',               role: ['isp'] },
    { fraza: 'INFRASTRUKTURY OBLICZENIOWEJ', role: ['dc', 'chmura'] },
    { fraza: 'HOSTING',                     role: ['dc', 'chmura'] },
    { fraza: 'PRZETWARZANIE DANYCH',        role: ['dc', 'chmura'] },
    { fraza: 'ZARZĄDZANIEM URZĄDZENIAMI INFORMATYCZNYMI', role: ['msp'] },
    { fraza: 'USŁUG ZAUFANIA',              role: ['zaufania'] },
    { fraza: 'CERTYFIKAC',                  role: ['zaufania'] },
];

function normalizujNip(nip) {
    return String(nip || '').replace(/[^0-9]/g, '');
}

/* Walidacja sumy kontrolnej NIP. */
function nipPoprawny(nip) {
    const n = normalizujNip(nip);
    if (n.length !== 10) return false;
    const wagi = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const suma = wagi.reduce((a, w, i) => a + w * Number(n[i]), 0) % 11;
    return suma !== 10 && suma === Number(n[9]);
}

function formatujPkd(p) {
    return [p.kodDzial, p.kodKlasa, p.kodPodklasa].filter(Boolean).join('.');
}

/* Zamiana listy kodów PKD na sugerowane role. */
function pkdNaRole(listaPkd) {
    const sugestie = new Map();
    const dodaj = (rolaId, kod, opis, pewnosc) => {
        if (!ROLA_WG_ID[rolaId]) return;
        const biezaca = sugestie.get(rolaId);
        if (!biezaca || biezaca.pewnosc < pewnosc) {
            sugestie.set(rolaId, { rolaId, kod, opis, pewnosc });
        }
    };

    (listaPkd || []).forEach(p => {
        const kod = formatujPkd(p);
        const opis = String(p.opis || '').toUpperCase();

        const dokladny = PKD_ROLE.find(x => x.kod === kod);
        if (dokladny) {
            dokladny.role.forEach(r => dodaj(r, kod, p.opis, 3));
            return;
        }
        const prefiks = PKD_PREFIKSY.find(x => kod.startsWith(x.prefiks));
        if (prefiks) {
            prefiks.role.forEach(r => dodaj(r, kod, p.opis, 2));
            return;
        }
        PKD_SLOWA.forEach(s => {
            if (opis.includes(s.fraza)) s.role.forEach(r => dodaj(r, kod, p.opis, 1));
        });
    });

    return Array.from(sugestie.values()).sort((a, b) => b.pewnosc - a.pewnosc);
}

/* ── POBIERANIE ────────────────────────────────────────────
   Zwraca obiekt wyniku; nigdy nie rzuca wyjątkiem — brak sieci jest
   normalnym stanem pracy narzędzia. */
async function pobierzDanePoNip(nip, opcje) {
    const o = opcje || {};
    const timeout = o.timeout || 15000;
    const n = normalizujNip(nip);

    const wynik = {
        ok: false,
        nip: n,
        nazwa: null, regon: null, krs: null, adres: null, formaPrawna: null,
        statusVat: null, pkd: [], sugerowaneRole: [],
        rpt: null, wstepneOdpowiedzi: [],
        zrodla: [], ostrzezenia: [], blad: null,
    };

    if (!nipPoprawny(n)) {
        wynik.blad = 'Numer NIP jest niepoprawny — sprawdź cyfrę kontrolną.';
        return wynik;
    }

    const pobierz = async (url) => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeout);
        try {
            const odp = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
            if (!odp.ok) return { ok: false, status: odp.status };
            return { ok: true, dane: await odp.json() };
        } catch (e) {
            return { ok: false, blad: e && e.name === 'AbortError' ? 'timeout' : 'sieć' };
        } finally {
            clearTimeout(t);
        }
    };

    /* Krok 1 — biała lista VAT. */
    const data = new Date().toISOString().slice(0, 10);
    const wl = await pobierz(`${NIP_ZRODLA.bialaLista.url}/api/search/nip/${n}?date=${data}`);

    if (!wl.ok) {
        /* Wykaz podatników VAT ma limit 100 zapytań „search" na dobę na adres
           (dokumentacja MF w wersji 25.0). Po jego przekroczeniu odpowiada
           kodem 429 — albo, gdy odpowiedź nie niesie nagłówków CORS, fetch
           rzuca błąd sieci, więc i tam trzeba wspomnieć o limicie. */
        if (wl.status === 429) {
            wynik.blad = 'Wykaz podatników VAT odrzucił zapytanie z powodu dziennego limitu (100 zapytań na adres). Spróbuj jutro albo wypełnij dane ręcznie.';
        } else if (wl.blad === 'timeout') {
            wynik.blad = 'Przekroczono czas oczekiwania na odpowiedź rejestru.';
        } else {
            wynik.blad = 'Nie udało się połączyć z rejestrem. Sprawdź połączenie z internetem albo wypełnij dane ręcznie. '
                + 'Jeżeli internet działa, mógł wyczerpać się dzienny limit zapytań do wykazu podatników VAT (100 na dobę) — spróbuj jutro.';
        }
        return wynik;
    }

    const podmiot = wl.dane && wl.dane.result && wl.dane.result.subject;
    if (!podmiot) {
        wynik.blad = 'Nie znaleziono podmiotu o podanym numerze NIP w wykazie podatników VAT.';
        return wynik;
    }

    wynik.ok = true;
    wynik.nazwa = podmiot.name || null;
    wynik.regon = podmiot.regon || null;
    wynik.krs = podmiot.krs || null;
    wynik.statusVat = podmiot.statusVat || null;
    wynik.adres = podmiot.workingAddress || podmiot.residenceAddress || null;
    wynik.zrodla.push(NIP_ZRODLA.bialaLista.nazwa);

    /* Krok 2 — KRS po numerze uzyskanym z białej listy. */
    if (wynik.krs) {
        const krs = await pobierz(`${NIP_ZRODLA.krs.url}/api/krs/OdpisAktualny/${wynik.krs}?rejestr=P&format=json`);
        const dane = krs.ok && krs.dane && krs.dane.odpis && krs.dane.odpis.dane;
        if (dane) {
            wynik.zrodla.push(NIP_ZRODLA.krs.nazwa);
            const d1 = dane.dzial1 || {};
            if (d1.danePodmiotu) {
                wynik.formaPrawna = d1.danePodmiotu.formaPrawna || null;
                wynik.nazwa = d1.danePodmiotu.nazwa || wynik.nazwa;
            }
            if (d1.siedzibaIAdres && d1.siedzibaIAdres.adres) {
                const a = d1.siedzibaIAdres.adres;
                wynik.adres = [
                    [a.ulica, a.nrDomu].filter(Boolean).join(' ') + (a.nrLokalu ? '/' + a.nrLokalu : ''),
                    [a.kodPocztowy, a.miejscowosc].filter(Boolean).join(' '),
                ].filter(Boolean).join(', ');
            }
            const dz = (dane.dzial3 || {}).przedmiotDzialalnosci || {};
            const wszystkie = [
                ...(dz.przedmiotPrzewazajacejDzialalnosci || []),
                ...(dz.przedmiotPozostalejDzialalnosci || []),
            ];
            wynik.pkd = wszystkie.map(p => ({ kod: formatujPkd(p), opis: p.opis }));
            wynik.sugerowaneRole = pkdNaRole(wszystkie);
        } else {
            wynik.ostrzezenia.push('Nie udało się pobrać odpisu KRS — role trzeba wskazać ręcznie.');
        }
    } else {
        wynik.ostrzezenia.push('Podmiot nie ma numeru KRS (prawdopodobnie jednoosobowa działalność gospodarcza). Kody PKD nie są dostępne w tym trybie — role trzeba wskazać ręcznie.');
    }

    /* Krok 3 — rejestr przedsiębiorców telekomunikacyjnych.
       Źródło mocniejsze niż PKD: obecność w rejestrze jest dowodem prowadzenia
       działalności telekomunikacyjnej, a nie przesłanką domniemania. */
    if (typeof rptSprawdzNip === 'function') {
        const r = rptSprawdzNip(n);
        if (r.ok) {
            wynik.rpt = r;
            wynik.zrodla.push(RPT_ZRODLO.nazwa);

            if (r.aktywny) {
                /* Rola ISP potwierdzona wpisem — pewność wyższa niż z kodów PKD. */
                const istniejaca = wynik.sugerowaneRole.find(s => s.rolaId === 'isp');
                if (istniejaca) { istniejaca.pewnosc = 4; istniejaca.kod = 'rejestr PT nr ' + r.wpis.nr; istniejaca.opis = 'wpis do rejestru przedsiębiorców telekomunikacyjnych'; }
                else wynik.sugerowaneRole.unshift({ rolaId: 'isp', kod: 'rejestr PT nr ' + r.wpis.nr, opis: 'wpis do rejestru przedsiębiorców telekomunikacyjnych', pewnosc: 4 });
                wynik.sugerowaneRole.sort((a, b) => b.pewnosc - a.pewnosc);

                /* Wstępne odpowiedzi na pytania, na które rejestr odpowiada wprost. */
                wynik.wstepneOdpowiedzi.push({
                    pytanieId: 'pke-1', stan: 'wykonane',
                    dowod: `Rejestr PT nr ${r.wpis.nr}, wpis z ${r.wpis.dataWpisu}`,
                    uzasadnienie: 'Wpis do rejestru przedsiębiorców telekomunikacyjnych potwierdza wykonywanie działalności telekomunikacyjnej.',
                });
                wynik.wstepneOdpowiedzi.push({
                    pytanieId: 'pke-2', stan: 'wykonane',
                    dowod: `Rejestr PT nr ${r.wpis.nr}, wpis z ${r.wpis.dataWpisu}, stan rejestru na ${r.stanNa}`,
                    uzasadnienie: 'Podmiot figuruje w rejestrze prowadzonym przez Prezesa UKE.',
                });
                if (r.przeterminowany) {
                    wynik.ostrzezenia.push(`Dołączony indeks rejestru przedsiębiorców telekomunikacyjnych pochodzi sprzed ${r.wiekDni} dni (stan na ${r.stanNa}). Odśwież go poleceniem: node narzedzia/generuj-rpt.js`);
                }
                if (r.wpis.uslugi) {
                    wynik.wstepneOdpowiedzi.push({
                        pytanieId: 'pke-3', stan: null,
                        dowod: 'Zakres wg rejestru PT: ' + r.wpis.uslugi,
                        uzasadnienie: 'Porównaj zakres zadeklarowany w rejestrze z działalnością faktycznie prowadzoną — rozbieżność jest zagrożona karą z art. 444 ust. 1 pkt 1 PKE.',
                    });
                }
            } else if (r.znaleziony) {
                wynik.ostrzezenia.push(`Podmiot figuruje w rejestrze przedsiębiorców telekomunikacyjnych pod numerem ${r.wpis.nr}, ale został z niego wykreślony ${r.wpis.dataWykreslenia}. Jeżeli nadal prowadzi działalność telekomunikacyjną, wymaga to wyjaśnienia.`);
            }
        } else {
            wynik.ostrzezenia.push('Nie udało się sprawdzić rejestru przedsiębiorców telekomunikacyjnych — rolę operatora trzeba potwierdzić ręcznie.');
        }
    }

    if (!wynik.sugerowaneRole.length && wynik.pkd.length) {
        wynik.ostrzezenia.push('Żaden z kodów PKD nie odpowiada rolom z sektora infrastruktury cyfrowej. Zweryfikuj, czy podmiot rzeczywiście podlega ustawie o KSC z tego tytułu.');
    }

    wynik.ostrzezenia.push('Wielkość przedsiębiorstwa i roczny przychód nie występują w żadnym z dostępnych rejestrów publicznych — a to one przesądzają o klasyfikacji i o wysokości kary. Uzupełnij je ręcznie.');
    wynik.ostrzezenia.push('Kody PKD jedynie sugerują role. O statusie decyduje faktycznie wykonywana działalność (art. 5 ustawy o KSC), a nie wpis w rejestrze.');

    return wynik;
}

    KRAJE.rejestruj('pl', {
        NIP_ZRODLA,
        PKD_ROLE,
        PKD_PREFIKSY,
        PKD_SLOWA,
        normalizujNip,
        nipPoprawny,
        formatujPkd,
        pkdNaRole,
        pobierzDanePoNip,
    });
})();
