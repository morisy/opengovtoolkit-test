#!/usr/bin/env node
/**
 * Generate data/index.json from all state markdown files.
 * Run: node scripts/build-index.js
 */
const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'data', 'states');
const outputFile = path.join(__dirname, '..', 'data', 'index.json');

const files = fs.readdirSync(statesDir).filter(f => f.endsWith('.md')).sort();

const states = files.map(file => {
  const content = fs.readFileSync(path.join(statesDir, file), 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    console.warn(`Warning: ${file} has no frontmatter, skipping.`);
    return null;
  }

  // Simple YAML key-value parser (no nested objects needed)
  const attrs = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w[\w_]*)\s*:\s*"?(.+?)"?\s*$/);
    if (m) attrs[m[1]] = m[2];
  });

  return {
    slug: file.replace('.md', ''),
    state: attrs.state || file.replace('.md', ''),
    abbreviation: attrs.abbreviation || '',
    foia_law: attrs.foia_law || '',
    open_meetings_law: attrs.open_meetings_law || '',
    last_updated: attrs.last_updated || ''
  };
}).filter(Boolean);

fs.writeFileSync(outputFile, JSON.stringify(states, null, 2) + '\n');
console.log(`Built index.json with ${states.length} state(s).`);
