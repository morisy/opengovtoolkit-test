/**
 * Minimal hash-based router.
 * Usage:
 *   Router.on('/state/:slug', (params) => { ... });
 *   Router.on('/', () => { ... });
 *   Router.start();
 */
const Router = (() => {
  const routes = [];

  function on(pattern, handler) {
    const paramNames = [];
    const regex = new RegExp(
      '^' +
      pattern.replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      }) +
      '$'
    );
    routes.push({ regex, paramNames, handler });
  }

  function resolve() {
    const hash = location.hash.slice(1) || '/';
    for (const route of routes) {
      const match = hash.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = decodeURIComponent(match[i + 1]);
        });
        route.handler(params);
        return;
      }
    }
    // No match — go home
    location.hash = '#/';
  }

  function start() {
    window.addEventListener('hashchange', resolve);
    resolve();
  }

  return { on, start };
})();
