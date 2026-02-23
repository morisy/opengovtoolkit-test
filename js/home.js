/**
 * Home page: auto-detect state via geolocation, show state page inline,
 * with full state selector below.
 */
const Home = (() => {
  let stateIndex = null;

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadIndex() {
    if (stateIndex) return stateIndex;
    const resp = await fetch('data/index.json');
    stateIndex = await resp.json();
    return stateIndex;
  }

  async function render(el) {
    el.innerHTML = `
      <section class="home-hero">
        <h1>Open Government Toolkit</h1>
        <p>Quick, plain-language guidance on open records and open meetings rights in your state.</p>
      </section>
      <div id="geo-state-section"></div>
      <section id="state-select-section" class="state-select-group">
        <label for="state-select">Choose your state</label>
        <div class="state-select-row">
          <select id="state-select">
            <option value="">Select a state…</option>
          </select>
        </div>
      </section>
      <section class="home-grid-section">
        <h2>Or browse all states</h2>
        <ul class="state-grid" id="state-grid"></ul>
      </section>
    `;

    try {
      const states = await loadIndex();
      const select = document.getElementById('state-select');
      const grid = document.getElementById('state-grid');

      states.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.slug;
        opt.textContent = s.state;
        select.appendChild(opt);

        const li = document.createElement('li');
        li.innerHTML = `<a href="#/state/${escapeHtml(s.slug)}" class="state-card">
          <span class="state-card__abbr">${escapeHtml(s.abbreviation)}</span>
          <span class="state-card__name">${escapeHtml(s.state)}</span>
        </a>`;
        grid.appendChild(li);
      });

      select.addEventListener('change', () => {
        if (select.value) {
          location.hash = '#/state/' + select.value;
        }
      });

      // Auto-detect location
      tryAutoDetect(states);
    } catch (e) {
      console.error('Failed to load state index:', e);
    }
  }

  function tryAutoDetect(states) {
    if (!navigator.geolocation) return;

    Geo.detect(async (err, stateInfo) => {
      if (err) return;

      const match = states.find(s =>
        s.state.toLowerCase() === stateInfo.state.toLowerCase()
      );
      if (!match) return;

      const section = document.getElementById('geo-state-section');
      if (!section) return;

      // Show a "choose another state" link and render the state page inline
      section.innerHTML = `
        <div class="geo-detected">
          <p class="geo-detected__label">
            Based on your location, showing
            <strong>${escapeHtml(match.state)}</strong>.
            <a href="#state-select-section" class="geo-detected__change">Choose another state</a>
          </p>
        </div>
        <div id="geo-state-content"></div>
      `;

      // Render state page into the inline container
      const container = document.getElementById('geo-state-content');
      try {
        const resp = await fetch(`data/states/${encodeURIComponent(match.slug)}.md`);
        if (!resp.ok) return;
        const text = await resp.text();
        const { attributes, body } = Frontmatter.parse(text);

        const title = escapeHtml(attributes.state || match.slug);
        const sections = splitSections(body);

        let html = `<h2 class="geo-state-title">${title}</h2>`;

        // Meta badge box
        html += buildMetaBox(attributes);

        // Sections as accordions
        sections.forEach((s, i) => {
          const sectionHtml = marked.parse(s.lines.join('\n'));
          const isFirst = i === 0;
          const isFeatured = s.title.toLowerCase().includes('right now');
          const featuredClass = isFeatured ? ' section-accordion--featured' : '';
          html += `
            <details class="section-accordion${featuredClass}" ${isFirst ? 'open' : ''}>
              <summary>${escapeHtml(s.title)}</summary>
              <div class="section-body">${sectionHtml}</div>
            </details>`;
        });

        container.innerHTML = html;
        Copyable.enhance(container);
        Accordion.enhance(container);
      } catch (e) {
        // Silently fail — user still has the selector below
      }

      // Smooth-scroll the "Choose another state" link
      const changeLink = section.querySelector('.geo-detected__change');
      if (changeLink) {
        changeLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById('state-select-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  }

  function splitSections(markdown) {
    const sections = [];
    const lines = markdown.split('\n');
    let current = null;
    for (const line of lines) {
      const heading = line.match(/^## (.+)$/);
      if (heading) {
        if (current) sections.push(current);
        current = { title: heading[1], lines: [] };
      } else if (current) {
        current.lines.push(line);
      }
    }
    if (current) sections.push(current);
    return sections;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function buildMetaBox(attributes) {
    let html = '<div class="state-meta">';

    html += '<div class="state-meta__badges">';
    if (attributes.response_time) {
      html += `<div class="state-meta__badge">
        <span class="state-meta__badge-label">Response Time</span>
        <span class="state-meta__badge-value">${escapeHtml(attributes.response_time)}</span>
      </div>`;
    }
    if (attributes.fee_structure) {
      html += `<div class="state-meta__badge">
        <span class="state-meta__badge-label">Fees</span>
        <span class="state-meta__badge-value">${escapeHtml(attributes.fee_structure)}</span>
      </div>`;
    }
    if (attributes.enforcement_body) {
      html += `<div class="state-meta__badge">
        <span class="state-meta__badge-label">Enforcement</span>
        <span class="state-meta__badge-value">${escapeHtml(attributes.enforcement_body)}</span>
      </div>`;
    }
    html += '</div>';

    html += '<dl class="state-meta__laws">';
    if (attributes.foia_law) {
      html += `<div class="state-meta__law-item">
        <dt>Records Law</dt>
        <dd>${escapeHtml(attributes.foia_law)}</dd>
        ${attributes.foia_citation ? `<dd class="citation">${escapeHtml(attributes.foia_citation)}</dd>` : ''}
      </div>`;
    }
    if (attributes.open_meetings_law) {
      html += `<div class="state-meta__law-item">
        <dt>Open Meetings</dt>
        <dd>${escapeHtml(attributes.open_meetings_law)}</dd>
        ${attributes.open_meetings_citation ? `<dd class="citation">${escapeHtml(attributes.open_meetings_citation)}</dd>` : ''}
      </div>`;
    }
    html += '</dl>';

    if (attributes.last_updated) {
      html += `<p class="state-meta__updated">Last updated: ${formatDate(attributes.last_updated)}</p>`;
    }

    html += '</div>';
    return html;
  }

  return { render };
})();
