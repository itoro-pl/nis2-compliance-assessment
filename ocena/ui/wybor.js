/* ==========================================================
   Wybór państwa i języka.

   W nagłówku znacznik bieżącego wyboru; kliknięcie otwiera okno
   z dwiema listami. Język i państwo są niezależne — ktoś oceniający
   niemiecką spółkę zależną może chcieć polskiego interfejsu — ale
   języki urzędowe wybranego państwa stoją na początku listy.

   Zmiana wyboru przeładowuje stronę z nowymi parametrami: to
   najprostsza droga do czystego stanu modułów kraju i języka.
   ========================================================== */

function nazwaPanstwa(kod) {
    return napis('panstwo.' + kod);
}

function etykietaStanuModulu(p) {
    if (p.modul === 'gotowy') return '';
    const klucz = p.modul === 'brak-ustawy' ? 'wybor.brakUstawy' : 'wybor.wPrzygotowaniu';
    const klasa = p.modul === 'brak-ustawy' ? 'stan-brak' : 'stan-przygotowanie';
    return `<span class="wybor-stan ${klasa}">${napis(klucz)}</span>`;
}

function pokazWybor(wybor) {
    const el = document.getElementById('wyborPanstwa');
    if (!el) return;
    const p = PANSTWO_WG_KODU[wybor.panstwo];
    const j = JEZYK_WG_KODU[wybor.jezyk];
    el.innerHTML = `<span class="wybor-flaga" aria-hidden="true">${flaga(p.kod)}</span>
        <span class="wybor-tekst">${esc(nazwaPanstwa(p.kod))} · ${esc(j.nazwa)}</span>`;
    el.setAttribute('title', napis('wybor.zmien'));
    el.setAttribute('aria-label', napis('wybor.zmien'));
    el.onclick = () => otworzWybor(wybor);
}

/* Znaczek z kodem państwa zamiast flagi emoji: emoji flag nie renderuje
   się na Windows (pokazuje parę liter), więc lepiej pokazać kod celowo
   i spójnie na każdym systemie. Mapa Europy przyjdzie osobno. */
function flaga(kod) {
    return `<span class="wybor-kod-panstwa">${kod}</span>`;
}

function otworzWybor(biezacy) {
    let modal = document.getElementById('modalWyboru');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalWyboru';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', 'modalWyboruTytul');
        document.body.appendChild(modal);
    }
    const stan = { panstwo: biezacy.panstwo, jezyk: biezacy.jezyk };

    const renderuj = () => {
        const p = PANSTWO_WG_KODU[stan.panstwo];
        const urzedowe = p.jezyki;
        const pozostale = JEZYKI.filter(x => !urzedowe.includes(x.kod));

        const wierszPanstwa = (x) => `
            <button type="button" class="wybor-pozycja ${x.kod === stan.panstwo ? 'aktywna' : ''}"
                    data-panstwo="${x.kod}" role="option" aria-selected="${x.kod === stan.panstwo}">
              <span class="wybor-flaga" aria-hidden="true">${flaga(x.kod)}</span>
              <span class="wybor-nazwa">${esc(nazwaPanstwa(x.kod))}
                <span class="wybor-wlasna">${esc(x.nazwaWlasna)}</span></span>
              ${etykietaStanuModulu(x)}
            </button>`;

        const wierszJezyka = (x) => `
            <button type="button" class="wybor-pozycja ${x.kod === stan.jezyk ? 'aktywna' : ''}"
                    data-jezyk="${x.kod}" role="option" aria-selected="${x.kod === stan.jezyk}">
              <span class="wybor-nazwa">${esc(x.nazwa)}</span>
              <span class="wybor-kod">${x.kod}</span>
            </button>`;

        const posortowane = PANSTWA.slice().sort((a, b) =>
            nazwaPanstwa(a.kod).localeCompare(nazwaPanstwa(b.kod), LOCALE.znacznik()));

        modal.innerHTML = `
          <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="modalWyboruTytul">${napis('wybor.tytul')}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${napis('wybor.zamknij')}"></button>
              </div>
              <div class="modal-body">
                <p class="text-secondary small mb-3">${napis('wybor.opis')}</p>
                <div class="row g-4">
                  <div class="col-md-7">
                    <h6 class="wybor-naglowek">${napis('wybor.panstwo')}</h6>
                    <div class="wybor-lista" role="listbox" aria-label="${napis('wybor.panstwo')}">
                      ${posortowane.map(wierszPanstwa).join('')}
                    </div>
                  </div>
                  <div class="col-md-5">
                    <h6 class="wybor-naglowek">${napis('wybor.jezyk')}</h6>
                    <div class="wybor-lista" role="listbox" aria-label="${napis('wybor.jezyk')}">
                      <div class="wybor-grupa">${napis('wybor.jezykiUrzedowe')}</div>
                      ${urzedowe.map(k => wierszJezyka(JEZYK_WG_KODU[k])).join('')}
                      <div class="wybor-grupa">${napis('wybor.pozostaleJezyki')}</div>
                      ${pozostale.map(wierszJezyka).join('')}
                    </div>
                  </div>
                </div>
                ${p.modul !== 'gotowy' ? `<div class="alert alert-secondary small mt-3 mb-0">${napis(
                    p.modul === 'brak-ustawy' ? 'wybor.opisBrakUstawy' : 'wybor.opisWPrzygotowaniu',
                    { p0: esc(nazwaPanstwa(p.kod)) })}</div>` : ''}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">${napis('wybor.anuluj')}</button>
                <button type="button" class="btn btn-primary" id="wyborZatwierdz">${napis('wybor.zatwierdz')}</button>
              </div>
            </div>
          </div>`;

        modal.querySelectorAll('[data-panstwo]').forEach(b => b.onclick = () => {
            stan.panstwo = b.dataset.panstwo;
            const nowe = PANSTWO_WG_KODU[stan.panstwo];
            /* Przy zmianie państwa język przeskakuje na jego język urzędowy,
               chyba że użytkownik już wybrał inny — wtedy zostaje. */
            if (!biezacy.jezykWybranyRecznie) stan.jezyk = nowe.jezyki[0];
            renderuj();
        });
        modal.querySelectorAll('[data-jezyk]').forEach(b => b.onclick = () => {
            stan.jezyk = b.dataset.jezyk;
            biezacy.jezykWybranyRecznie = true;
            renderuj();
        });
        modal.querySelector('#wyborZatwierdz').onclick = () => zmienWybor(stan.panstwo, stan.jezyk);
    };

    renderuj();
    bootstrap.Modal.getOrCreateInstance(modal).show();
}
