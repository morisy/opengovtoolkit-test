/**
 * Parse YAML frontmatter from a markdown string.
 * Returns { attributes: {}, body: "" }
 */
const Frontmatter = (() => {
  function parse(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      return { attributes: {}, body: text };
    }
    let attributes = {};
    try {
      attributes = jsyaml.load(match[1]) || {};
    } catch (e) {
      console.error('Frontmatter YAML parse error:', e);
    }
    return { attributes, body: match[2] };
  }

  return { parse };
})();
