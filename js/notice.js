/**
 * Prototype notice: persistent top banner + first-visit dismissible modal.
 */
(() => {
  const STORAGE_KEY = 'ogt-prototype-notice-dismissed';
  const modal = document.getElementById('prototype-modal');
  const banner = document.querySelector('.prototype-banner');
  if (!modal || !banner) return;

  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const dismiss = modal.querySelector('.prototype-modal__dismiss');
    if (dismiss) dismiss.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore */ }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  const moreBtn = banner.querySelector('.prototype-banner__more');
  if (moreBtn) moreBtn.addEventListener('click', open);

  let dismissed = false;
  try { dismissed = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { /* ignore */ }
  if (!dismissed) open();
})();
