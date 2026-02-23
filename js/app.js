/**
 * App entry point — register routes and initialize.
 */
(function () {
  const main = document.getElementById('main');

  function setActiveNav(key) {
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (link.getAttribute('data-nav') === key) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  Router.on('/', () => {
    setActiveNav('home');
    Home.render(main);
  });

  Router.on('/state/:slug', (params) => {
    setActiveNav('');
    StatePage.render(main, params.slug);
  });

  Router.on('/about', () => {
    setActiveNav('about');
    renderAbout(main);
  });

  function renderAbout(el) {
    el.innerHTML = `
      <h1>About</h1>
      <div class="page-intro">
        <p>The Open Government Toolkit provides quick, plain-language guidance on open records
        and open meetings rights in every U.S. state.</p>
      </div>
      <div class="about-content">
        <h2>What is the Open Government Toolkit?</h2>
        <p>It's designed for journalists, activists,
        and anyone who needs to understand their rights to access government information.</p>

        <h2>How to use this site</h2>
        <p>Select your state from the home page dropdown or use geolocation to find your state
        automatically. Each state page includes key laws, practical tips, and template language
        you can copy directly into records requests.</p>

        <h2>Contributing</h2>
        <p>This is an open-source project. State guides are written in Markdown and can be
        updated by anyone via pull request. See our
        <a href="https://github.com/morisy/opengovtoolkit/blob/main/CONTRIBUTING.md">contributing guide</a>
        for details on how to add or edit state information.</p>

        <h2>Disclaimer</h2>
        <p>This site provides general information about public records and open meetings laws.
        It is <strong>not legal advice</strong>. Laws change, and their application varies by
        situation. Consult a qualified attorney for legal questions specific to your circumstances.</p>

        <h2>Privacy</h2>
        <p>This site uses no analytics, no cookies, and makes no external requests at runtime.
        If you use the geolocation feature, your coordinates are processed entirely in your
        browser and are never sent to any server.</p>
      </div>
    `;
  }

  Router.start();
})();
