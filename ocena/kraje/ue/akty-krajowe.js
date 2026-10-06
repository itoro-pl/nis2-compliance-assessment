/* ==========================================================
   Akty krajowe wdrażające NIS 2 — wykaz dla modułu wspólnego.

   Moduł wspólny ocenia według prawa Unii, bo wymogów krajowych
   jeszcze nie opisaliśmy. To nie znaczy, że wolno przemilczeć, czym
   dany podmiot jest w swoim państwie związany: narzędzie nazywa akt
   wdrażający po imieniu, w języku urzędowym tego państwa, i mówi
   wprost, że jego wymogów na razie nie ocenia.

   Nazwy w brzmieniu urzędowym — tak, jak akt jest publikowany.
   Pole „plik" wskazuje tekst w katalogu ustawy/ (ten sam, który
   opisuje ustawy/manifest.tsv); „adres" prowadzi do źródła urzędowego.
   Państwa bez wpisu nie uchwaliły jeszcze ustawy wdrażającej —
   dla nich interfejs mówi to wprost.
   ========================================================== */
(function () {

const AKTY_KRAJOWE = {
    AT: { nazwa: 'NIS-Gesetz 2026 (NISG 2026), BGBl. I Nr. 94/2025',
          adres: 'https://ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_94/BGBLA_2025_I_94.pdf',
          plik: 'AT/nisg-2026-bgbl-i-94-2025.pdf' },
    BE: { nazwa: 'Loi du 26 avril 2024 établissant un cadre pour la cybersécurité / Wet van 26 april 2024',
          adres: 'https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel',
          plik: 'BE/loi-2024-04-26-justel-fr.pdf' },
    BG: { nazwa: 'Закон за изменение и допълнение на Закона за киберсигурност, ДВ бр. 17/2026',
          adres: 'https://dv.parliament.bg/DVWeb/broeveList.faces',
          plik: 'BG/dv-17-2026-zid-zks.pdf' },
    CY: { nazwa: 'Ο περί Ασφάλειας Δικτύων και Συστημάτων Πληροφοριών Νόμος, Ν. 60(Ι)/2025',
          adres: 'https://www.cylaw.org/nomoi/arith/2025_1_060.pdf',
          plik: 'CY/nomos-60-I-2025.pdf' },
    CZ: { nazwa: 'Zákon č. 264/2025 Sb., o kybernetické bezpečnosti',
          adres: 'https://e-sbirka.gov.cz/sb/2025/264',
          plik: 'CZ/zakon-264-2025-sb.pdf' },
    DE: { nazwa: 'BSI-Gesetz in der Fassung des NIS2UmsuCG (BGBl. 2025 I Nr. 301)',
          adres: 'https://www.gesetze-im-internet.de/bsig_2025/BSIG.pdf',
          plik: 'DE/bsig-tekst-ujednolicony.pdf' },
    DK: { nazwa: 'Lov nr. 434 af 6. maj 2025 om foranstaltninger til sikring af et højt cybersikkerhedsniveau',
          adres: 'https://www.retsinformation.dk/eli/lta/2025/434',
          plik: 'DK/lov-434-2025.pdf' },
    EE: { nazwa: 'Küberturvalisuse seadus (KüTS)',
          adres: 'https://www.riigiteataja.ee/akt/130122025004',
          plik: 'EE/kuts-tekst-ujednolicony.pdf' },
    FI: { nazwa: 'Kyberturvallisuuslaki 124/2025',
          adres: 'https://www.finlex.fi/fi/lainsaadanto/2025/124',
          plik: 'FI/kyberturvallisuuslaki-124-2025.pdf' },
    GR: { nazwa: 'Νόμος 5160/2024 (ΦΕΚ Α΄ 195) και νόμος 5305/2026 (ΦΕΚ Α΄ 85)',
          adres: 'https://cyber.gov.gr/',
          plik: 'GR/nomos-5160-2024-fek-a-195.pdf' },
    HR: { nazwa: 'Zakon o kibernetičkoj sigurnosti, NN 14/2024',
          adres: 'https://narodne-novine.nn.hr/clanci/sluzbeni/2024_02_14_254.html',
          plik: 'HR/zakon-nn-14-2024.pdf' },
    HU: { nazwa: '2024. évi LXIX. törvény Magyarország kiberbiztonságáról',
          adres: 'https://njt.jog.gov.hu/jogszabaly/2024-69-00-00',
          plik: 'HU/torveny-2024-lxix.pdf' },
    IT: { nazwa: 'Decreto legislativo 4 settembre 2024, n. 138',
          adres: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2024-09-04;138',
          plik: 'IT/dlgs-138-2024.pdf' },
    LT: { nazwa: 'Lietuvos Respublikos kibernetinio saugumo įstatymas (nauja redakcija, Nr. XIV-2902)',
          adres: 'https://e-seimas.lrs.lt/portal/legalAct/lt/TAD/1a8657f2427a11efb121d2fe3a0eff27',
          plik: 'LT/kibernetinio-saugumo-istatymas-xiv-2902.pdf' },
    LU: { nazwa: 'Loi du 5 mai 2026, Mémorial A 225',
          adres: 'https://data.legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo',
          plik: 'LU/loi-05-05-2026-memorial-a225.pdf' },
    LV: { nazwa: 'Nacionālās kiberdrošības likums',
          adres: 'https://likumi.lv/ta/id/353390',
          plik: 'LV/nacionalas-kiberdrosibas-likums.pdf' },
    MT: { nazwa: 'Subsidiary Legislation 460.41 — Measures for a High Common Level of Cybersecurity',
          adres: 'https://legislation.mt/eli/sl/460.41/eng',
          plik: 'MT/sl-460-41-eng.pdf' },
    NL: { nazwa: 'Cyberbeveiligingswet, Stb. 2026, 187',
          adres: 'https://zoek.officielebekendmakingen.nl/stb-2026-187.html',
          plik: 'NL/cyberbeveiligingswet-stb-2026-187.pdf' },
    PT: { nazwa: 'Decreto-Lei n.º 125/2025 — Regime Jurídico da Segurança do Ciberespaço',
          adres: 'https://diariodarepublica.pt/dr/detalhe/decreto-lei/125-2025',
          plik: 'PT/decreto-lei-125-2025.pdf' },
    RO: { nazwa: 'OUG nr. 155/2024, aprobată cu modificări prin Legea nr. 124/2025',
          adres: 'https://legislatie.just.ro/Public/DetaliiDocument/293121',
          plik: 'RO/oug-155-2024-tekst.pdf' },
    SE: { nazwa: 'Cybersäkerhetslag (2025:1506)',
          adres: 'https://data.riksdagen.se/dokument/sfs-2025-1506.html',
          plik: 'SE/sfs-2025-1506-cybersakerhetslag.pdf' },
    SI: { nazwa: 'Zakon o informacijski varnosti (ZInfV-1), Uradni list RS 40/25',
          adres: 'https://pisrs.si/pregledPredpisa?id=ZAKO8934',
          plik: 'SI/zinfv-1-ur-l-40-2025.pdf' },
    SK: { nazwa: 'Zákon č. 69/2018 Z. z. v znení zákona č. 366/2024 Z. z.',
          adres: 'https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/2018/69/',
          plik: 'SK/zakon-69-2018-zz.pdf' },
};

/* Państwa, które do dziś nie uchwaliły ustawy wdrażającej — Komisja
   skierowała sprawy do Trybunału Sprawiedliwości 8 lipca 2026 r. */
const BEZ_USTAWY_WDRAZAJACEJ = ['ES', 'FR', 'IE'];

/* Rejestry gospodarcze, które wydają dane publicznie i bezpłatnie,
   bez klucza API (badanie z 25.08.2026). Narzędzie ich nie czyta —
   mówi o tym wprost i zaprasza do dopisania odczytu. */
const REJESTRY_PUBLICZNE = {
    "BE": {
        "nazwa": "KBO/BCE Open Data i sprawozdania Banku Narodowego",
        "adres": "https://economie.fgov.be/en/themes/enterprises/crossroads-bank-enterprises"
    },
    "DK": {
        "nazwa": "CVR — Det Centrale Virksomhedsregister",
        "adres": "https://datacvr.virk.dk/"
    },
    "EE": {
        "nazwa": "Äriregister — otwarte dane",
        "adres": "https://avaandmed.ariregister.rik.ee/en"
    },
    "FR": {
        "nazwa": "recherche-entreprises.api.gouv.fr",
        "adres": "https://recherche-entreprises.api.gouv.fr/docs/"
    },
    "LT": {
        "nazwa": "Registrų centras — Spinta API",
        "adres": "https://get.data.gov.lt/"
    },
    "LV": {
        "nazwa": "Uzņēmumu reģistra atvērtie dati",
        "adres": "https://data.gov.lv/dati/eng/dataset/uz-registri"
    },
    "RO": {
        "nazwa": "ANAF — webservicesp.anaf.ro",
        "adres": "https://webservicesp.anaf.ro/"
    },
    "SE": {
        "nazwa": "Bolagsverket — öppna data",
        "adres": "https://bolagsverket.se/omoss/varverksamhet/oppnadata"
    },
    "SK": {
        "nazwa": "Register účtovných závierok",
        "adres": "https://www.registeruz.sk/"
    }
};

KRAJE.rejestruj('ue', { AKTY_KRAJOWE, BEZ_USTAWY_WDRAZAJACEJ, REJESTRY_PUBLICZNE });

})();
