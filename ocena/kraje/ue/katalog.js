/* Moduł ue: katalog środków zarządzania ryzykiem — art. 21 ust. 2 dyrektywy.

   Dziesięć obszarów w kolejności liter a–j. Pytania sformułowane na
   podstawie tekstu dyrektywy pobranego z EUR-Lex (CELEX 32022L2555);
   każde cytuje literę art. 21 ust. 2, z której wynika. Tam, gdzie
   rozporządzenie 2024/2690 doprecyzowuje wymóg, podmiot objęty
   rozporządzeniem dostaje je osobno jako warstwę wspólną.

   Identyfikatory zaczynają się od „d21-", żeby nie kolidowały
   z polskimi „a8-". */
(function () {

const KSC_ART8_SEKCJE = [
    {
        id: 'ksc-ryzyko',
        nazwa: napis('ue.katalog.1'),
        podstawa: cyt('art. 21 ust. 2 lit. a'),
        opis: napis('ue.katalog.2'),
        pytania: [
            { id: 'd21-a-1', tekst: napis('ue.katalog.3'), art: cyt('art. 21 ust. 2 lit. a; art. 20 ust. 1'), iso: napis('ue.katalog.4') },
            { id: 'd21-a-2', tekst: napis('ue.katalog.5'), art: cyt('art. 21 ust. 2'), iso: napis('ue.katalog.6') },
            { id: 'd21-a-3', tekst: napis('ue.katalog.7'), art: cyt('art. 21 ust. 1 akapit drugi'), iso: napis('ue.katalog.8') },
            { id: 'd21-a-4', tekst: napis('ue.katalog.9'), art: cyt('art. 21 ust. 1 akapit drugi'), iso: napis('ue.katalog.8') },
        ],
    },
    {
        id: 'ksc-incydenty-zarz',
        nazwa: napis('ue.katalog.10'),
        podstawa: cyt('art. 21 ust. 2 lit. b'),
        opis: napis('ue.katalog.11'),
        pytania: [
            { id: 'd21-b-1', tekst: napis('ue.katalog.12'), art: cyt('art. 21 ust. 2 lit. b; art. 6 pkt 8'), iso: napis('ue.katalog.13') },
            { id: 'd21-b-2', tekst: napis('ue.katalog.14'), art: cyt('art. 23 ust. 4'), iso: napis('ue.katalog.15') },
            { id: 'd21-b-3', tekst: napis('ue.katalog.16'), art: cyt('art. 23 ust. 3'), iso: napis('ue.katalog.17') },
            { id: 'd21-b-4', tekst: napis('ue.katalog.18'), art: cyt('art. 21 ust. 2 lit. b'), iso: napis('ue.katalog.19') },
        ],
    },
    {
        id: 'ksc-ciaglosc',
        nazwa: napis('ue.katalog.20'),
        podstawa: cyt('art. 21 ust. 2 lit. c'),
        opis: napis('ue.katalog.21'),
        pytania: [
            { id: 'd21-c-1', tekst: napis('ue.katalog.22'), art: cyt('art. 21 ust. 2 lit. c'), iso: napis('ue.katalog.23') },
            { id: 'd21-c-2', tekst: napis('ue.katalog.24'), art: cyt('art. 21 ust. 2 lit. c'), iso: napis('ue.katalog.25') },
            { id: 'd21-c-3', tekst: napis('ue.katalog.26'), art: cyt('art. 21 ust. 2 lit. c'), iso: napis('ue.katalog.27') },
            { id: 'd21-c-4', tekst: napis('ue.katalog.28'), art: cyt('art. 21 ust. 2 lit. c'), iso: napis('ue.katalog.29') },
        ],
    },
    {
        id: 'ksc-dostawcy',
        nazwa: napis('ue.katalog.30'),
        podstawa: cyt('art. 21 ust. 2 lit. d; art. 21 ust. 3'),
        opis: napis('ue.katalog.31'),
        pytania: [
            { id: 'd21-d-1', tekst: napis('ue.katalog.32'), art: cyt('art. 21 ust. 2 lit. d'), iso: napis('ue.katalog.33') },
            { id: 'd21-d-2', tekst: napis('ue.katalog.34'), art: cyt('art. 21 ust. 3'), iso: napis('ue.katalog.35') },
            { id: 'd21-d-3', tekst: napis('ue.katalog.36'), art: cyt('art. 21 ust. 2 lit. d'), iso: napis('ue.katalog.37') },
            { id: 'd21-d-4', tekst: napis('ue.katalog.38'), art: cyt('art. 21 ust. 3'), iso: napis('ue.katalog.39') },
        ],
    },
    {
        id: 'ksc-nabywanie',
        nazwa: napis('ue.katalog.40'),
        podstawa: cyt('art. 21 ust. 2 lit. e'),
        opis: napis('ue.katalog.41'),
        pytania: [
            { id: 'd21-e-1', tekst: napis('ue.katalog.42'), art: cyt('art. 21 ust. 2 lit. e'), iso: napis('ue.katalog.43') },
            { id: 'd21-e-2', tekst: napis('ue.katalog.44'), art: cyt('art. 21 ust. 2 lit. e'), iso: napis('ue.katalog.45') },
            { id: 'd21-e-3', tekst: napis('ue.katalog.46'), art: cyt('art. 21 ust. 2 lit. e; art. 12'), iso: napis('ue.katalog.45') },
            { id: 'd21-e-4', tekst: napis('ue.katalog.47'), art: cyt('art. 21 ust. 2 lit. e'), iso: napis('ue.katalog.48') },
        ],
    },
    {
        id: 'ksc-skutecznosc',
        nazwa: napis('ue.katalog.49'),
        podstawa: cyt('art. 21 ust. 2 lit. f'),
        opis: napis('ue.katalog.50'),
        pytania: [
            { id: 'd21-f-1', tekst: napis('ue.katalog.51'), art: cyt('art. 21 ust. 2 lit. f'), iso: napis('ue.katalog.52') },
            { id: 'd21-f-2', tekst: napis('ue.katalog.53'), art: cyt('art. 21 ust. 2 lit. f; art. 20 ust. 1'), iso: napis('ue.katalog.54') },
            { id: 'd21-f-3', tekst: napis('ue.katalog.55'), art: cyt('art. 21 ust. 2 lit. f'), iso: napis('ue.katalog.56') },
        ],
    },
    {
        id: 'ksc-edukacja',
        nazwa: napis('ue.katalog.57'),
        podstawa: cyt('art. 21 ust. 2 lit. g; art. 20 ust. 2'),
        opis: napis('ue.katalog.58'),
        pytania: [
            { id: 'd21-g-1', tekst: napis('ue.katalog.59'), art: cyt('art. 21 ust. 2 lit. g'), iso: napis('ue.katalog.60') },
            { id: 'd21-g-2', tekst: napis('ue.katalog.61'), art: cyt('art. 21 ust. 2 lit. g'), iso: napis('ue.katalog.62') },
            { id: 'd21-g-3', tekst: napis('ue.katalog.63'), art: cyt('art. 20 ust. 2'), iso: napis('ue.katalog.64') },
        ],
    },
    {
        id: 'ksc-krypto',
        nazwa: napis('ue.katalog.65'),
        podstawa: cyt('art. 21 ust. 2 lit. h'),
        opis: napis('ue.katalog.66'),
        pytania: [
            { id: 'd21-h-1', tekst: napis('ue.katalog.67'), art: cyt('art. 21 ust. 2 lit. h'), iso: napis('ue.katalog.68') },
            { id: 'd21-h-2', tekst: napis('ue.katalog.69'), art: cyt('art. 21 ust. 2 lit. h'), iso: napis('ue.katalog.68') },
        ],
    },
    {
        id: 'ksc-dostep',
        nazwa: napis('ue.katalog.70'),
        podstawa: cyt('art. 21 ust. 2 lit. i'),
        opis: napis('ue.katalog.71'),
        pytania: [
            { id: 'd21-i-1', tekst: napis('ue.katalog.72'), art: cyt('art. 21 ust. 2 lit. i'), iso: napis('ue.katalog.73') },
            { id: 'd21-i-2', tekst: napis('ue.katalog.74'), art: cyt('art. 21 ust. 2 lit. i'), iso: napis('ue.katalog.75') },
            { id: 'd21-i-3', tekst: napis('ue.katalog.76'), art: cyt('art. 21 ust. 2 lit. i'), iso: napis('ue.katalog.77') },
            { id: 'd21-i-4', tekst: napis('ue.katalog.78'), art: cyt('art. 21 ust. 2 lit. i'), iso: napis('ue.katalog.79') },
        ],
    },
    {
        id: 'ksc-komunikacja',
        nazwa: napis('ue.katalog.80'),
        podstawa: cyt('art. 21 ust. 2 lit. j'),
        opis: napis('ue.katalog.81'),
        pytania: [
            { id: 'd21-j-1', tekst: napis('ue.katalog.82'), art: cyt('art. 21 ust. 2 lit. j'), iso: napis('ue.katalog.83') },
            { id: 'd21-j-2', tekst: napis('ue.katalog.84'), art: cyt('art. 21 ust. 2 lit. j'), iso: napis('ue.katalog.85') },
            { id: 'd21-j-3', tekst: napis('ue.katalog.86'), art: cyt('art. 21 ust. 2 lit. j'), iso: napis('ue.katalog.27') },
        ],
    },
];

    KRAJE.rejestruj('ue', { KSC_ART8_SEKCJE });
})();
