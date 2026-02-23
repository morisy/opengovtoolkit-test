/**
 * Enhance <details>/<summary> with ARIA attributes.
 */
const Accordion = (() => {
  function enhance(container) {
    const details = container.querySelectorAll('.section-accordion');
    details.forEach(el => {
      const summary = el.querySelector('summary');
      if (!summary) return;

      const body = el.querySelector('.section-body');
      if (body) {
        const id = 'section-' + Math.random().toString(36).slice(2, 8);
        body.id = id;
        summary.setAttribute('aria-controls', id);
      }

      updateAria(el, summary);
      el.addEventListener('toggle', () => updateAria(el, summary));
    });
  }

  function updateAria(details, summary) {
    summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
  }

  return { enhance };
})();
