/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* Organy właściwe do spraw cyberbezpieczeństwa — art. 41 ustawy o KSC. */
const ORGANY = {
    uke: {
        id: 'uke',
        nazwa: 'Prezes Urzędu Komunikacji Elektronicznej',
        skrot: 'Prezes UKE',
        podstawa: 'art. 41 pkt 8a ustawy o KSC',
        zakres: 'podsektor komunikacji elektronicznej',
    },
    mc: {
        id: 'mc',
        nazwa: 'Minister właściwy do spraw informatyzacji',
        skrot: 'Minister Cyfryzacji',
        podstawa: 'art. 41 pkt 8 ustawy o KSC',
        zakres: 'sektor infrastruktury cyfrowej z wyłączeniem podsektora komunikacji elektronicznej',
    },
    mcIct: {
        id: 'mcIct',
        nazwa: 'Minister właściwy do spraw informatyzacji',
        skrot: 'Minister Cyfryzacji',
        podstawa: 'art. 41 pkt 9b ustawy o KSC',
        zakres: 'sektor zarządzania usługami ICT',
    },
    mcPubliczne: {
        id: 'mcPubliczne',
        nazwa: 'Minister właściwy do spraw informatyzacji',
        skrot: 'Minister Cyfryzacji',
        podstawa: 'art. 41a ust. 1 ustawy o KSC',
        zakres: 'sektor podmiotów publicznych, z wyłączeniem podmiotów podległych MON i jednostek podległych ministrowi finansów',
    },
    mon: {
        id: 'mon',
        nazwa: 'Minister Obrony Narodowej',
        skrot: 'MON',
        podstawa: 'art. 41 pkt 9 ustawy o KSC',
        zakres: 'podmioty, o których mowa w art. 26 ust. 5 ustawy o KSC',
    },
};

/* Reguła klasyfikacji przypisana do roli.
   typ:
     'progowa'          — kluczowy powyżej średniego, ważny przy średnim
                          (art. 5 ust. 1 pkt 1 / ust. 2 pkt 1)
     'progowa-ke'       — kluczowy od średniego wzwyż, ważny dla mikro i małych
                          (przedsiębiorca komunikacji elektronicznej:
                           art. 5 ust. 1 pkt 2 / ust. 2 pkt 4)
     'progowa-mssp'     — kluczowy od małego wzwyż (art. 5 ust. 1 pkt 3)
     'zawsze-kluczowy'  — niezależnie od wielkości (art. 5 ust. 1 pkt 4)
     'zaufania'         — kwalifikowany: zawsze kluczowy (art. 5 ust. 1 pkt 4 lit. b);
                          niekwalifikowany mikro/mały/średni: ważny (art. 5 ust. 2 pkt 3)
     'publiczny-kluczowy' — podmiot publiczny z załącznika nr 1: kluczowy
                          niezależnie od wielkości (art. 5 ust. 1 pkt 4 lit. d)
     'publiczny-wazny'  — podmiot publiczny z załącznika nr 2: ważny
                          (art. 5 ust. 2 pkt 8); obowiązki wg załącznika nr 4
     'publiczny-gmina'  — urząd gminy: kluczowy przy co najmniej 50 etatach
                          (załącznik nr 1 sektor podmioty publiczne pkt 4),
                          poniżej progu — ważny jako samorządowa jednostka
                          budżetowa (art. 5 ust. 2 pkt 8) */
const ROLE = [
    {
        id: 'isp',
        nazwa: 'Przedsiębiorca komunikacji elektronicznej (ISP)',
        opis: 'Dostarczanie publicznych sieci telekomunikacyjnych lub świadczenie publicznie dostępnych usług telekomunikacyjnych, w tym usług dostępu do internetu.',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Komunikacja elektroniczna',
        zalacznik: 1,
        regula: 'progowa-ke',
        organ: 'uke',
        zestawy: [ZESTAW.KSC, ZESTAW.PKE],
        uwaga: 'Każdy przedsiębiorca komunikacji elektronicznej jest objęty ustawą — nie ma progu, poniżej którego podmiot wypada z zakresu. Mikro- i mali przedsiębiorcy są podmiotami ważnymi.',
    },
    {
        id: 'dc',
        nazwa: 'Dostawca usługi centrum przetwarzania danych',
        opis: 'Świadczenie usług centrum przetwarzania danych (kolokacja, hosting infrastruktury, powierzchnia serwerowa).',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'progowa',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
    },
    {
        id: 'ixp',
        nazwa: 'Dostawca punktu wymiany ruchu internetowego (IXP)',
        opis: 'Prowadzenie punktu wymiany ruchu internetowego umożliwiającego wzajemne połączenia sieci.',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'progowa',
        organ: 'mc',
        zestawy: [ZESTAW.KSC],
        uwaga: 'Rozporządzenie wykonawcze (UE) 2024/2690 NIE ma zastosowania do dostawców punktów wymiany ruchu internetowego — art. 1 rozporządzenia zawiera zamkniętą listę adresatów, na której IXP się nie znajduje. Podmiot stosuje wymogi art. 8 ustawy o KSC.',
    },
    {
        id: 'dns',
        nazwa: 'Dostawca usług DNS',
        opis: 'Świadczenie usług rozwiązywania nazw domen (z wyłączeniem operatorów głównych serwerów nazw).',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'zawsze-kluczowy',
        podstawaKluczowy: 'art. 5 ust. 1 pkt 4 lit. a ustawy o KSC',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: 'Podmiot kluczowy niezależnie od wielkości przedsiębiorstwa.',
    },
    {
        id: 'tld',
        nazwa: 'Rejestr nazw domen najwyższego poziomu (TLD)',
        opis: 'Prowadzenie rejestru nazw domen najwyższego poziomu.',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'zawsze-kluczowy',
        podstawaKluczowy: 'art. 5 ust. 1 pkt 4 lit. i ustawy o KSC',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: 'Podmiot kluczowy niezależnie od wielkości przedsiębiorstwa.',
    },
    {
        id: 'rejestrator',
        nazwa: 'Podmiot świadczący usługi rejestracji nazw domen',
        opis: 'Rejestracja nazw domen na rzecz abonentów (registrar).',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'zawsze-kluczowy',
        podstawaKluczowy: 'art. 5 ust. 1 pkt 4 lit. j ustawy o KSC',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: 'Podmiot kluczowy niezależnie od wielkości przedsiębiorstwa. Dodatkowo obowiązki dotyczące danych rejestracyjnych — art. 16b ustawy o KSC.',
    },
    {
        id: 'chmura',
        nazwa: 'Dostawca usług chmury obliczeniowej',
        opis: 'Świadczenie usług przetwarzania w chmurze (IaaS, PaaS, SaaS).',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'progowa',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
    },
    {
        id: 'cdn',
        nazwa: 'Dostawca sieci dostarczania treści (CDN)',
        opis: 'Świadczenie usług sieci dostarczania treści.',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'progowa',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
    },
    {
        id: 'zaufania',
        nazwa: 'Dostawca usług zaufania',
        opis: 'Świadczenie usług zaufania w rozumieniu rozporządzenia (UE) nr 910/2014 (eIDAS).',
        sektor: 'Infrastruktura cyfrowa',
        podsektor: 'Infrastruktura cyfrowa z wyłączeniem komunikacji elektronicznej',
        zalacznik: 1,
        regula: 'zaufania',
        organ: 'mc',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: 'Dostawca kwalifikowany — podmiot kluczowy niezależnie od wielkości (art. 5 ust. 1 pkt 4 lit. b). Odrębny termin zgłoszenia incydentu poważnego: 24 godziny na pełne zgłoszenie (art. 11 ust. 1a ustawy o KSC).',
    },
    {
        id: 'msp',
        nazwa: 'Dostawca usług zarządzanych (MSP)',
        opis: 'Świadczenie usług zarządzanych w zakresie ICT na rzecz innych podmiotów.',
        sektor: 'Zarządzanie usługami ICT',
        podsektor: null,
        zalacznik: 1,
        regula: 'progowa',
        organ: 'mcIct',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
    },
    {
        id: 'mssp',
        nazwa: 'Dostawca usług zarządzanych w zakresie cyberbezpieczeństwa (MSSP)',
        opis: 'Świadczenie usług zarządzanych w zakresie cyberbezpieczeństwa (SOC as a Service, zarządzanie incydentami, monitoring bezpieczeństwa).',
        sektor: 'Zarządzanie usługami ICT',
        podsektor: null,
        zalacznik: 1,
        regula: 'progowa-mssp',
        organ: 'mcIct',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: 'Próg niższy niż w pozostałych rolach: podmiot kluczowy już od małego przedsiębiorcy (art. 5 ust. 1 pkt 3). Jeżeli podmiot świadczy obsługę incydentów, stosuje także art. 8g ustawy o KSC (obowiązki informacyjne na stronie internetowej).',
    },

    /* ── SEKTOR PODMIOTÓW PUBLICZNYCH ──────────────────────
       Ścieżka odrębna od przedsiębiorców. Podmiot publiczny
       realizuje obowiązki tylko wtedy, gdy wykorzystuje system
       informacyjny do realizacji zadania publicznego (art. 16d).
       Progi wielkości przedsiębiorcy nie mają tu zastosowania —
       decyduje przynależność do załącznika, nie obrót. */
    {
        id: 'pp-zal1',
        nazwa: 'Podmiot publiczny z załącznika nr 1',
        opis: 'Jednostka sektora finansów publicznych, urząd ją obsługujący, państwowa instytucja kultury, instytut badawczy, agencja wykonawcza, fundusz celowy, a także jednostki i zakłady budżetowe samorządu województwa oraz starostwo powiatowe.',
        sektor: 'Podmioty publiczne',
        podsektor: null,
        zalacznik: 1,
        regula: 'publiczny-kluczowy',
        podstawaKluczowy: 'art. 5 ust. 1 pkt 4 lit. d ustawy o KSC',
        organ: 'mcPubliczne',
        zestawy: [ZESTAW.KSC],
        uwaga: 'Podmiot kluczowy niezależnie od wielkości — progi przedsiębiorcy nie mają zastosowania. Obowiązuje pełny katalog art. 8 ust. 1, a nie złagodzony załącznik nr 4. Dla podmiotów podległych MON organem jest Minister Obrony Narodowej (art. 41a ust. 2), dla jednostek podległych ministrowi finansów — minister właściwy do spraw finansów publicznych (art. 41a ust. 3).',
    },
    {
        id: 'pp-gmina',
        nazwa: 'Urząd gminy',
        opis: 'Urząd obsługujący gminę. Status zależy od zatrudnienia na dzień 1 stycznia danego roku, w przeliczeniu na pełny etat, na podstawie umowy o pracę.',
        sektor: 'Podmioty publiczne',
        podsektor: null,
        zalacznik: 1,
        regula: 'publiczny-gmina',
        organ: 'mcPubliczne',
        zestawy: [ZESTAW.KSC],
        uwaga: 'Próg 50 etatów przesądza o wszystkim: powyżej — podmiot kluczowy z pełnym art. 8 ust. 1, poniżej — podmiot ważny realizujący znacznie węższy załącznik nr 4. Wielkość podaje się w profilu; „średni” i większy odpowiada progowi ustawowemu.',
    },
    {
        id: 'pp-zal2',
        nazwa: 'Samorządowy podmiot publiczny z załącznika nr 2',
        opis: 'Samorządowa jednostka budżetowa, samorządowy zakład budżetowy, samorządowa instytucja kultury albo spółka wykonująca zadania o charakterze użyteczności publicznej — jeżeli realizuje zadanie publiczne z wykorzystaniem systemów informacyjnych.',
        sektor: 'Podmioty publiczne',
        podsektor: null,
        zalacznik: 2,
        regula: 'publiczny-wazny',
        organ: 'mcPubliczne',
        zestawy: [ZESTAW.ZAL4],
        uwaga: 'Podmiot ważny nie stosuje art. 8 ust. 1 — zamiast niego obowiązuje zamknięty katalog z załącznika nr 4 (art. 8 ust. 3). Odpada też wczesne ostrzeżenie i sprawozdania okresowe, z postępu oraz końcowe (art. 12c), a wobec kierownika nie stosuje się zakazu pełnienia funkcji zarządczych (art. 53 ust. 10).',
    },
    {
        id: 'pp-uczelnia',
        nazwa: 'Uczelnia lub instytut niebędący organizacją badawczą',
        opis: 'Podmiot, o którym mowa w art. 7 ust. 1 pkt 1–4 i 6–7 Prawa o szkolnictwie wyższym i nauce, w zakresie, w jakim realizuje zadania publiczne z wykorzystaniem systemów informacyjnych.',
        sektor: 'Podmioty publiczne',
        podsektor: null,
        zalacznik: 2,
        regula: 'publiczny-wazny',
        organ: 'mcPubliczne',
        zestawy: [ZESTAW.ZAL4],
        uwaga: 'Art. 8 ust. 3 zrównuje te podmioty z podmiotami publicznymi: zamiast art. 8 ust. 1 obowiązuje załącznik nr 4. Uczelnia będąca organizacją badawczą podlega natomiast sektorowi badań naukowych, gdzie organem właściwym jest minister właściwy do spraw szkolnictwa wyższego i nauki (art. 41 pkt 9k).',
    },
];

const ROLA_WG_ID = Object.fromEntries(ROLE.map(r => [r.id, r]));

    KRAJE.rejestruj('pl', {
        ORGANY,
        ROLE,
        ROLA_WG_ID,
    });
})();
