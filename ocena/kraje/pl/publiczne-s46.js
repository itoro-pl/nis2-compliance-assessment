/* Moduł kraju: pl. Plik opakowany w funkcję — patrz core/kraje.js. */
(function () {

/* ==========================================================
   System S46 — system teleinformatyczny z art. 46 ust. 1
   ustawy o KSC, oraz Wykaz podmiotów kluczowych i ważnych.

   Źródło: serwis Ministerstwa Cyfryzacji gov.pl/web/system-s46
   wraz z podstronami oraz „Pytania i odpowiedzi" MC (dokument
   bez mocy prawnej, aktualizowany).

   Uwaga o rozbieżności źródeł: dokument PDF opisuje starszą
   procedurę dostępu (oświadczenie przesyłane formularzem
   kontaktowym). Obowiązuje wersja ze strony: dostęp do S46
   Cyber Hub dostaje automatycznie administrator wskazany
   we wniosku o wpis do wykazu.
   ========================================================== */

const S46 = {
    nazwa: 'System S46',
    podstawa: 'art. 46 ust. 1 ustawy o KSC',
    prowadzi: 'Minister właściwy do spraw informatyzacji; system realizuje i rozwija NASK-PIB.',
    opis: 'Platforma łącząca podmioty krajowego systemu cyberbezpieczeństwa. Służy do zgłaszania i obsługi incydentów, wymiany informacji o zagrożeniach, ostrzegania oraz czynności nadzorczych organów. W jej ramach prowadzony jest Wykaz podmiotów kluczowych i podmiotów ważnych.',

    /* Obowiązek korzystania — art. 46 ust. 1, termin z art. 16 pkt 1. */
    ktoMusi: 'Wszystkie podmioty kluczowe i podmioty ważne, w terminie 12 miesięcy od dnia spełnienia przesłanek. Dla podmiotów spełniających je 3 kwietnia 2026 r. termin upływa 3 kwietnia 2027 r.',

    /* Kto NIE składa wniosku sam — wpis następuje z urzędu.
       To rozróżnienie decyduje o tym, co podmiot ma zrobić. */
    wpisZUrzedu: [
        'przedsiębiorcy telekomunikacyjni',
        'dostawcy usług zaufania',
        'podmioty publiczne',
        'dotychczasowi operatorzy usług kluczowych',
    ],
    wpisZUrzeduSkutek: 'Minister Cyfryzacji wpisuje te podmioty sam, na podstawie rejestrów publicznych. Podmiot dostaje zawiadomienie, a często wezwanie do uzupełnienia danych z kodem dostępu — na uzupełnienie ma 6 miesięcy od doręczenia wezwania, pod rygorem kary pieniężnej.',

    kroki: [
        { nr: 1, tytul: 'Ustal, czy podlegasz ustawie',
          opis: 'Rodzaj działalności z załącznika nr 1 albo nr 2 oraz wielkość podmiotu. Tę część wykonuje profil podmiotu w tym narzędziu.' },
        { nr: 2, tytul: 'Sprawdź, czy nie jesteś wpisywany z urzędu',
          opis: 'Operatorzy telekomunikacyjni, dostawcy usług zaufania, podmioty publiczne i dotychczasowi operatorzy usług kluczowych wniosku nie składają — czekają na zawiadomienie i uzupełniają dane.' },
        { nr: 3, tytul: 'Załóż konto w Wykazie KSC',
          opis: 'Logowanie przez Węzeł Krajowy (login.gov.pl): profil zaufany, bankowość, mObywatel, e-dowód albo certyfikat kwalifikowany. Imię, nazwisko i PESEL pobierane są automatycznie.' },
        { nr: 4, tytul: 'Złóż wniosek o wpis',
          opis: 'Wniosek podpisuje kierownik podmiotu albo osoba upoważniona — pełnomocnictwo w postaci elektronicznej, zbędne dla prokurentów z KRS i pełnomocników z CEIDG. Oświadczenie kierownika składane jest pod rygorem odpowiedzialności karnej z art. 233 § 6 Kodeksu karnego.' },
        { nr: 5, tytul: 'Odbierz dostęp do S46 Cyber Hub',
          opis: 'Osobnego wniosku nie ma. Administrator wskazany w wykazie dostaje dane dostępowe na podany adres poczty.' },
    ],

    /* Dane, które trzeba mieć przygotowane — pokrywają się z profilem
       podmiotu w narzędziu, więc raport może je podpowiedzieć. */
    daneDoWniosku: [
        'nazwa, NIP, REGON, numer w rejestrze działalności regulowanej',
        'sektor, podsektor i rodzaj działalności wg załącznika nr 1 albo 2',
        'siedziba, adres korespondencyjny, adres do doręczeń elektronicznych',
        'zakresy publicznych adresów IP i nazw domen używanych w sposób ciągły',
        'osoby do kontaktu — dwie, u mikro- i małych przedsiębiorców jedna',
        'administrator konta w S46: dodatkowo PESEL i telefon',
        'deklaracja wielkości podmiotu',
        'informacja o umowie z dostawcą usług zarządzanych w zakresie cyberbezpieczeństwa',
        'pełnomocnictwo elektroniczne, jeżeli wniosku nie podpisuje kierownik',
    ],

    wymaganiaTechniczne: 'Przeglądarka na silniku Chromium w aktualnej wersji, łącze co najmniej 10 Mb/s, stacja robocza z ochroną antywirusową i zabezpieczona przed dostępem osób nieupoważnionych.',

    linki: [
        { etykieta: 'Wykaz KSC — logowanie i złożenie wniosku', url: 'https://wykaz-ksc.gov.pl', glowny: true },
        { etykieta: 'S46 Cyber Hub — logowanie', url: 'https://pa.s46.gov.pl', glowny: true },
        { etykieta: 'System S46 — strona informacyjna', url: 'https://www.gov.pl/web/system-s46' },
        { etykieta: 'Jak uzyskać dostęp — trzy kroki', url: 'https://www.gov.pl/web/system-s46/uzyskaj-dostep' },
        { etykieta: 'Wpis do wykazu — instrukcja samorejestracji', url: 'https://www.gov.pl/web/system-s46/wpis-do-wykazu-ksc' },
        { etykieta: 'Uzupełnienie danych po wezwaniu (wpis z urzędu)', url: 'https://www.gov.pl/web/system-s46/uzupelnienie-danych-po-wezwaniu' },
        { etykieta: 'Zgłoszenie incydentu — instrukcja', url: 'https://www.gov.pl/web/system-s46/zgloszenie-incydentu' },
        { etykieta: 'Minimalne wymagania techniczne', url: 'https://www.gov.pl/web/system-s46/minimalne-wymagania-techniczne-i-funkcjonalne-korzystania-z-systemu-teleinformatycznego' },
        { etykieta: 'Węzeł Krajowy — login.gov.pl', url: 'https://login.gov.pl' },
        { etykieta: 'Portal cyber.gov.pl', url: 'https://cyber.gov.pl/' },
        { etykieta: 'Bezpłatne szkolenia Ministerstwa Cyfryzacji', url: 'https://www.gov.pl/web/baza-wiedzy/harmonogramszkolen' },
        { etykieta: 'Kwalifikator MŚP — ustalenie wielkości podmiotu', url: 'https://kwalifikator.parp.gov.pl/' },
    ],

    kontakt: [
        { etykieta: 'Infolinia S46', wartosc: '+48 22 182 22 80', url: 'tel:+48221822280' },
        { etykieta: 'Przed uzyskaniem dostępu', wartosc: 's46-info@nask.pl', url: 'mailto:s46-info@nask.pl' },
        { etykieta: 'Pomoc dla uczestników systemu', wartosc: 's46-admin@nask.pl', url: 'mailto:s46-admin@nask.pl' },
    ],
};

    KRAJE.rejestruj('pl', {
        S46,
    });
})();
