/* Moduł ue: role i klasyfikacja wprost z dyrektywy (UE) 2022/2555.

   Identyfikatory ról są te same co w module polskim, żeby profil podmiotu
   dało się przenieść między państwami. Reguły klasyfikacji pochodzą
   z art. 3 dyrektywy — bez krajowych zaostrzeń. Dwa polskie odstępstwa,
   których tu celowo nie ma: MSSP kluczowy już od małego przedsiębiorcy
   (art. 5 ust. 1 pkt 3 ustawy o KSC) i rejestrator domen jako podmiot
   kluczowy (art. 5 ust. 1 pkt 4 lit. j). Dyrektywa klasyfikuje MSSP
   progowo, a rejestratorom domen nakłada obowiązki z art. 28 bez
   statusu podmiotu kluczowego lub ważnego. */
(function () {

/* Dyrektywa nie wskazuje organów — robi to prawo krajowe (art. 8 ust. 1).
   Jeden wpis zastępczy, żeby raport miał co pokazać. */
const ORGANY = {
    organ: {
        id: 'organ',
        nazwa: napis('ue.role.1'),
        skrot: napis('ue.role.2'),
        podstawa: cyt('art. 8 ust. 1 dyrektywy (UE) 2022/2555'),
        zakres: napis('ue.role.3'),
    },
};

const ROLE = [
    {
        id: 'isp',
        nazwa: napis('ue.role.4'),
        opis: napis('ue.role.5'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.7'),
        zalacznik: 1,
        regula: 'progowa-ke',
        organ: 'organ',
        zestawy: [ZESTAW.KSC],
        uwaga: napis('ue.role.8'),
    },
    {
        id: 'dc',
        nazwa: napis('ue.role.9'),
        opis: napis('ue.role.10'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.11'),
        zalacznik: 1,
        regula: 'progowa',
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.12'),
    },
    {
        id: 'ixp',
        nazwa: napis('ue.role.13'),
        opis: napis('ue.role.14'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.15'),
        zalacznik: 1,
        regula: 'progowa',
        organ: 'organ',
        zestawy: [ZESTAW.KSC],
        uwaga: napis('ue.role.16'),
    },
    {
        id: 'dns',
        nazwa: napis('ue.role.17'),
        opis: napis('ue.role.18'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.19'),
        zalacznik: 1,
        regula: 'zawsze-kluczowy',
        podstawaKluczowy: napis('ue.role.podstawaArt3b'),
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.20'),
    },
    {
        id: 'tld',
        nazwa: napis('ue.role.21'),
        opis: napis('ue.role.22'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.19'),
        zalacznik: 1,
        regula: 'zawsze-kluczowy',
        podstawaKluczowy: napis('ue.role.podstawaArt3b'),
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.23'),
    },
    {
        id: 'chmura',
        nazwa: napis('ue.role.24'),
        opis: napis('ue.role.25'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.26'),
        zalacznik: 1,
        regula: 'progowa',
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.27'),
    },
    {
        id: 'cdn',
        nazwa: napis('ue.role.28'),
        opis: napis('ue.role.29'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.30'),
        zalacznik: 1,
        regula: 'progowa',
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.27'),
    },
    {
        id: 'zaufania',
        nazwa: napis('ue.role.31'),
        opis: napis('ue.role.32'),
        sektor: napis('ue.role.6'),
        podsektor: napis('ue.role.33'),
        zalacznik: 1,
        regula: 'zaufania',
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.34'),
    },
    {
        id: 'msp',
        nazwa: napis('ue.role.35'),
        opis: napis('ue.role.36'),
        sektor: napis('ue.role.37'),
        podsektor: napis('ue.role.38'),
        zalacznik: 1,
        regula: 'progowa',
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.27'),
    },
    {
        id: 'mssp',
        nazwa: napis('ue.role.39'),
        opis: napis('ue.role.40'),
        sektor: napis('ue.role.37'),
        podsektor: napis('ue.role.41'),
        zalacznik: 1,
        regula: 'progowa',
        organ: 'organ',
        zestawy: [ZESTAW.KSC, ZESTAW.REG2690],
        uwaga: napis('ue.role.42'),
    },
];

const ROLA_WG_ID = Object.fromEntries(ROLE.map(r => [r.id, r]));

    KRAJE.rejestruj('ue', {
        ORGANY,
        ROLE,
        ROLA_WG_ID,
    });
})();
