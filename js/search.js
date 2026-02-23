/**
 * Search page using MiniSearch over the state index.
 */
const Search = (() => {
  let searchIndex = null;
  let stateData = null;

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function buildIndex() {
    if (searchIndex) return;
    const resp = await fetch('data/index.json');
    stateData = await resp.json();

    searchIndex = new MiniSearch({
      fields: ['state', 'foia_law', 'open_meetings_law', 'abbreviation'],
      storeFields: ['state', 'slug', 'foia_law', 'open_meetings_law', 'abbreviation'],
      searchOptions: {
        boost: { state: 3, abbreviation: 2 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    searchIndex.addAll(stateData.map((s, i) => ({ id: i, ...s })));
  }

  async function render(el) {
    el.innerHTML = `
      <h1>Search</h1>
      <label for="search-input" class="sr-only">Search states</label>
      <div class="search-input-wrap">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11.5 11.5L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input type="search" id="search-input" class="search-input"
               placeholder="Search by state name, abbreviation, or law name…"
               autocomplete="off">
      </div>
      <p id="search-status" aria-live="polite"></p>
      <div id="search-empty-state" class="search-empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="14" stroke="currentColor" stroke-width="2"/>
          <path d="M30 30L44 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>Search across all 50 states and D.C. by name, abbreviation, or law name.</p>
      </div>
      <ul id="search-results" class="search-results" role="list"></ul>
    `;

    await buildIndex();

    const input = document.getElementById('search-input');
    const resultsList = document.getElementById('search-results');
    const emptyState = document.getElementById('search-empty-state');
    const status = document.getElementById('search-status');

    input.addEventListener('input', () => {
      const query = input.value.trim();
      if (!query) {
        resultsList.innerHTML = '';
        emptyState.style.display = '';
        status.textContent = '';
        return;
      }

      emptyState.style.display = 'none';
      const results = searchIndex.search(query);

      if (results.length === 0) {
        resultsList.innerHTML = '<li>No results found.</li>';
        status.textContent = 'No results found.';
        return;
      }

      status.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found.`;

      resultsList.innerHTML = results.map(r => `
        <li>
          <a href="#/state/${escapeHtml(r.slug)}" class="search-result-card">
            <span class="search-result-card__abbr">${escapeHtml(r.abbreviation)}</span>
            <span class="search-result-card__body">
              <span class="search-result-card__name">${escapeHtml(r.state)}</span>
              <span class="search-result-card__tags">
                ${r.foia_law ? `<span class="law-tag">${escapeHtml(r.foia_law)}</span>` : ''}
                ${r.open_meetings_law ? `<span class="law-tag">${escapeHtml(r.open_meetings_law)}</span>` : ''}
              </span>
            </span>
          </a>
        </li>
      `).join('');
    });

    input.focus();
  }

  return { render };
})();
