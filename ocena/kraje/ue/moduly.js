/* Moduł ue: moduły oceny i pytania nadrzędne.

   Cztery moduły zamiast polskich siedmiu: nie ma warstwy telekomunikacyjnej
   ani ścieżki podmiotów publicznych, bo dyrektywa ich nie zna. Funkcje
   pomocnicze są tożsame z polskimi — to logika, nie treść — i docelowo
   przejdą do core/. */
(function () {

/* Pytania nadrzędne: po jednym z każdego obszaru, którego brak przekreśla
   resztę. Bez zatwierdzenia przez organ zarządzający środki nie mają
   umocowania; bez procedury incydentowej terminy z art. 23 są nieosiągalne. */
const PYTANIA_KLUCZOWE = [
    'ob-d3-1',     // status podmiotu
    'ob-d3-2',     // dane rejestracyjne
    'ob-d20-1',    // zatwierdzenie środków przez organ zarządzający
    'ob-d23-1',    // wczesne ostrzeżenie w 24 h
    'd21-a-1',     // polityka analizy ryzyka
    'd21-b-1',     // procedura obsługi incydentu
    'd21-c-2',     // kopie zapasowe testowane
    'd21-d-3',     // wymagania w umowach z dostawcami
    'd21-e-2',     // proces postępowania z podatnościami
    'd21-i-2',     // polityka kontroli dostępu
    'd21-j-1',     // uwierzytelnianie wieloskładnikowe
];

const CZAS_NA_PYTANIE = { binarne: 35, skala: 55 };   // sekundy

function szacujCzas(sekcje, filtrPytan) {
    let sek = 0;
    sekcje.forEach(s => s.pytania.forEach(q => {
        if (filtrPytan && !filtrPytan(q)) return;
        sek += CZAS_NA_PYTANIE[typPytania(s, q)] || 40;
    }));
    const min = Math.round(sek / 60);
    if (min < 1) return napis('ue.moduly.4');
    if (min < 60) return napis('ue.moduly.1', {p0: min});
    const h = Math.floor(min / 60), r = min % 60;
    return r ? napis('ue.moduly.2', {p0: h, p1: r}) : napis('ue.moduly.3', {p0: h});
}

const MODULY = [
    {
        id: 'mod-szybki',
        nazwa: napis('ue.moduly.5'),
        warstwa: 'ksc-ob',
        priorytet: 0,
        zalecany: true,
        domyslny: true,
        szybki: true,
        scalaj: true,
        dlaczego: napis('ue.moduly.6'),
        sekcje: () => true,
        pytania: (q) => PYTANIA_KLUCZOWE.includes(q.id),
    },
    {
        id: 'mod-obowiazki',
        nazwa: napis('ue.moduly.7'),
        warstwa: 'ksc-ob',
        priorytet: 1,
        zalecany: true,
        domyslny: false,
        dlaczego: napis('ue.moduly.8'),
        sekcje: (s) => s.warstwa === 'ksc-ob',
    },
    {
        id: 'mod-szbi',
        nazwa: napis('ue.moduly.9'),
        warstwa: 'ksc',
        priorytet: 2,
        zalecany: true,
        domyslny: false,
        dlaczego: napis('ue.moduly.10'),
        sekcje: (s) => s.warstwa === 'ksc',
    },
    {
        id: 'mod-reg2690-org',
        nazwa: napis('ue.moduly.11'),
        warstwa: 'reg2690',
        priorytet: 4,
        zalecany: false,
        dlaczego: napis('ue.moduly.12'),
        sekcje: (s) => s.warstwa === 'reg2690' && ['1', '2', '3', '4', '5', '7', '8'].includes(String(s.id).replace('reg-', '')),
    },
    {
        id: 'mod-reg2690-tech',
        nazwa: napis('ue.moduly.13'),
        warstwa: 'reg2690',
        priorytet: 5,
        zalecany: false,
        dlaczego: napis('ue.moduly.14'),
        sekcje: (s) => s.warstwa === 'reg2690' && ['6', '9', '10', '11', '12', '13'].includes(String(s.id).replace('reg-', '')),
    },
];

function moduleDomyslne(klasyfikacja) {
    const d = moduleDostepne(klasyfikacja).filter(m => m.domyslny);
    return d.length ? d : moduleDostepne(klasyfikacja).slice(0, 1);
}

function moduleDostepne(klasyfikacja) {
    const warstwy = klasyfikacja.zestawy || [];
    return MODULY.filter(m => {
        if (m.warstwa === 'ksc-ob') return warstwy.includes('ksc');
        if (m.warstwa === 'ksc') return warstwy.includes('ksc');
        return warstwy.includes(m.warstwa);
    });
}

function modulSekcji(sekcja) {
    return MODULY.find(m => m.sekcje(sekcja)) || null;
}

function statystykaModulu(modul, wszystkieSekcje, odpowiedzi) {
    const sekcje = wszystkieSekcje.filter(modul.sekcje)
        .map(s => modul.pytania ? { ...s, pytania: s.pytania.filter(modul.pytania) } : s)
        .filter(s => s.pytania.length);
    let pytan = 0, wypelnionych = 0;
    sekcje.forEach(s => s.pytania.forEach(q => {
        pytan++;
        const a = normalizujOdpowiedz(odpowiedzi[q.id]);
        if (a && (Number.isFinite(a.poziom) || !!a.stan)) wypelnionych++;
    }));
    return { sekcji: sekcje.length, pytan, wypelnionych, sekcje, czas: szacujCzas(sekcje) };
}

    KRAJE.rejestruj('ue', {
        PYTANIA_KLUCZOWE, CZAS_NA_PYTANIE, szacujCzas, MODULY,
        moduleDomyslne, moduleDostepne, modulSekcji, statystykaModulu,
    });
})();
