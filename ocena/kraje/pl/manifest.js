/* Manifest modułu kraju. Ładowarka czyta go jako pierwszy i na jego
   podstawie wstawia pozostałe pliki. Kolejność ma znaczenie tylko
   o tyle, że żaden plik nie sięga po cudze nazwy w chwili ładowania —
   sprawdzone przy migracji (Etap 0). */
KRAJE.manifest('pl', {
    nazwa: 'Polska',
    jezyki: ['pl'],
    /* Pliki w napisy/ — ładowarka nie pyta o inne. */
    napisy: ['pl'],
    pliki: [
        'role',
        'rejestry-rpt-indeks',
        'rejestry-rpt',
        'rejestry-nip',
        'rejestry-esf',
        'akty',
        'meta',
        'kierownictwo',
        'moduly',
        'katalog',
        'obowiazki',
        'sektorowe',
        'publiczne-zal4',
        'publiczne-s46',
        'faq',
    ],
});
