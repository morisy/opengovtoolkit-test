/**
 * Add "Copy this" buttons to blockquotes (sample request language).
 */
const Copyable = (() => {
  function enhance(container) {
    const blockquotes = container.querySelectorAll('.section-body blockquote');
    blockquotes.forEach(bq => {
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy this';
      btn.setAttribute('aria-label', 'Copy text to clipboard');

      btn.addEventListener('click', () => {
        const text = bq.innerText;
        copyToClipboard(text).then(() => {
          btn.textContent = 'Copied!';
          btn.setAttribute('data-copied', 'true');
          announce('Copied to clipboard');
          setTimeout(() => {
            btn.textContent = 'Copy this';
            btn.removeAttribute('data-copied');
          }, 2000);
        }).catch(() => {
          btn.textContent = 'Failed to copy';
          setTimeout(() => { btn.textContent = 'Copy this'; }, 2000);
        });
      });

      bq.parentNode.insertBefore(btn, bq.nextSibling);
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-HTTPS
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy') ? resolve() : reject();
      } catch (e) {
        reject(e);
      }
      document.body.removeChild(textarea);
    });
  }

  function announce(message) {
    let region = document.getElementById('copy-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'copy-live-region';
      region.className = 'sr-only';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    region.textContent = message;
  }

  return { enhance };
})();
