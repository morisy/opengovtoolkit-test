/**
 * Fetch and render a state page from its markdown file.
 */
const StatePage = (() => {
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

  async function render(el, slug) {
    el.innerHTML = '<p class="loading">Loading…</p>';

    try {
      const resp = await fetch(`data/states/${encodeURIComponent(slug)}.md`);
      if (!resp.ok) throw new Error('State not found');
      const text = await resp.text();
      const { attributes, body } = Frontmatter.parse(text);

      const title = escapeHtml(attributes.state || slug);
      const sections = splitSections(body);

      // Breadcrumb
      let html = `
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="#/">Home</a></li>
            <li>${title}</li>
          </ol>
        </nav>`;

      html += `<h1>${title}</h1>`;

      // Meta badge box
      html += '<div class="state-meta">';

      // Badge cards row
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

      // Law citations
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

      // Last updated
      if (attributes.last_updated) {
        html += `<p class="state-meta__updated">Last updated: ${formatDate(attributes.last_updated)}</p>`;
      }

      html += '</div>';

      // Sections as accordions
      sections.forEach((section, i) => {
        const sectionHtml = marked.parse(section.lines.join('\n'));
        const isFirst = i === 0;
        const isFeatured = section.title.toLowerCase().includes('right now');
        const featuredClass = isFeatured ? ' section-accordion--featured' : '';
        html += `
          <details class="section-accordion${featuredClass}" ${isFirst ? 'open' : ''}>
            <summary>${escapeHtml(section.title)}</summary>
            <div class="section-body">${sectionHtml}</div>
          </details>`;
      });

      el.innerHTML = html;

      // Add copy buttons to blockquotes (template language)
      Copyable.enhance(el);
      Accordion.enhance(el);

    } catch (err) {
      el.innerHTML = `
        <div class="error-message">
          <p><strong>Could not load state data.</strong></p>
          <p>The state "${escapeHtml(slug)}" may not be available yet.
          <a href="#/">Return to home</a>.</p>
        </div>`;
    }
  }

  return { render };
})();
