/* ==========================================================
   Konfiguracja neutralna silnika — wspólna dla wszystkich
   państw. Progi wielkości z zalecenia 2003/361/WE, skala
   dojrzałości, stany obowiązku, identyfikatory warstw.
   Wyciągnięte z plików polskich przy rozdzielaniu danych
   od silnika (Etap 0).
   ========================================================== */

/* Progi wielkości przedsiębiorcy — art. 2 ust. 1 załącznika I do
   rozporządzenia Komisji (UE) nr 651/2014. Ustawa odsyła do tych
   progów; art. 5 ust. 3 wyłącza stosowanie art. 3 ust. 4 załącznika I. */
const WIELKOSC = {
    mikro:  { id: 'mikro',  nazwa: napis('skala.mikro'), opis: napis('skala.mikroOpis'),  rank: 1 },
    maly:   { id: 'maly',   nazwa: napis('skala.maly'), opis: napis('skala.malyOpis'), rank: 2 },
    sredni: { id: 'sredni', nazwa: napis('skala.sredni'), opis: napis('skala.sredniOpis'), rank: 3 },
    duzy:   { id: 'duzy',   nazwa: napis('skala.duzy'), opis: napis('skala.duzyOpis'), rank: 4 },
};

/* ==========================================================
   Role podmiotu w sektorze infrastruktury cyfrowej
   Podstawa: ustawa z 5.07.2018 r. o krajowym systemie
   cyberbezpieczeństwa (t.j. Dz.U. 2026 poz. 20) w brzmieniu
   nadanym ustawą z 23.01.2026 r. (Dz.U. 2026 poz. 252).

   Narzędzie ITORO obejmuje sektor "Infrastruktura cyfrowa"
   (załącznik nr 1, oba podsektory) oraz "Zarządzanie usługami ICT".
   ========================================================== */

const WIELKOSC_LISTA = [WIELKOSC.mikro, WIELKOSC.maly, WIELKOSC.sredni, WIELKOSC.duzy];

/* Zestawy pytań, które uruchamia dana rola.
   - 'ksc'     — art. 8 ust. 1 ustawy o KSC (wszyscy)
   - 'reg2690' — rozporządzenie wykonawcze KE (UE) 2024/2690, stosowane
                 bezpośrednio; NIE obejmuje przedsiębiorców komunikacji
                 elektronicznej (art. 8b ustawy o KSC)
   - 'pke'     — ustawa z 12.07.2024 Prawo komunikacji elektronicznej
                 (Dz.U. 2024 poz. 1221) */
const ZESTAW = { KSC: 'ksc', REG2690: 'reg2690', PKE: 'pke', ZAL4: 'zal4' };

/* ==========================================================
   System zarządzania bezpieczeństwem informacji — art. 8 ustawy o KSC
   (t.j. Dz.U. 2026 poz. 20 w brzmieniu nadanym ustawą z 23.01.2026 r.)

   Struktura odwzorowuje jednostki redakcyjne przepisu, a nie domeny
   art. 21(2) dyrektywy. Pytania oceniane w skali dojrzałości 1-5.
   ========================================================== */

const POZIOMY_DOJRZALOSCI = [
    { poziom: 1, nazwa: napis('skala.poziom1'), opis: napis('skala.poziom1Opis') },
    { poziom: 2, nazwa: napis('skala.poziom2'), opis: napis('skala.poziom2Opis') },
    { poziom: 3, nazwa: napis('skala.poziom3'), opis: napis('skala.poziom3Opis') },
    { poziom: 4, nazwa: napis('skala.poziom4'), opis: napis('skala.poziom4Opis') },
    { poziom: 5, nazwa: napis('skala.poziom5'), opis: napis('skala.poziom5Opis') },
];

/* Docelowy poziom dojrzałości wg statusu podmiotu. */
const POZIOM_DOCELOWY = { kluczowy: 4, wazny: 3 };

/* ==========================================================
   Obowiązki formalne wynikające z ustawy o KSC

   W odróżnieniu od art. 8 nie ocenia się tu dojrzałości, lecz stan
   wykonania: obowiązek jest wykonany albo nie. Od tego zależy
   odpowiedzialność karna podmiotu (art. 73) i kierownika (art. 73a).
   ========================================================== */

const STANY_OBOWIAZKU = [
    { id: 'wykonane',    nazwa: napis('skala.wykonane'),     kolor: '#157347', waga: 1 },
    { id: 'w-toku',      nazwa: napis('skala.wToku'),       kolor: '#9a6700', waga: 0.5 },
    { id: 'niewykonane', nazwa: napis('skala.niewykonane'),  kolor: '#b02a37', waga: 0 },
    { id: 'nie-dotyczy', nazwa: napis('skala.nieDotyczy'),  kolor: '#4b5563', waga: null },
];
