(function () {
  var SUN_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  var MOON_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

  function getEffectiveTheme() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) { /* ignore */ }
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* ignore */ }
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
  }

  function renderHeader(isRoot) {
    var mount = document.getElementById('header-mount');
    if (!mount) return;
    var homeHref = isRoot ? 'index.html' : 'index.html';

    var header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML =
      '<div class="site-header-top">' +
        '<h1><a href="' + homeHref + '">Recipe Box</a></h1>' +
        '<div class="header-actions">' +
          '<a class="shopping-list-link" href="capture.html" title="Capture a Recipe" aria-label="Capture a Recipe">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="12" y1="6" x2="12" y2="12"/></svg>' +
          '</a>' +
          '<a class="shopping-list-link" href="shopping-list.html" title="Shopping List" aria-label="Shopping List">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
          '</a>' +
          '<button id="theme-toggle" class="theme-toggle" type="button" title="Toggle dark mode" aria-label="Toggle dark mode"></button>' +
        '</div>' +
      '</div>' +
      '<div class="subtitle">A personal, searchable, scalable recipe collection</div>';
    mount.appendChild(header);

    var btn = document.getElementById('theme-toggle');
    var current = getEffectiveTheme();
    btn.innerHTML = current === 'dark' ? SUN_ICON : MOON_ICON;
    btn.addEventListener('click', function () {
      applyTheme(getEffectiveTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  function renderFooter() {
    var mount = document.getElementById('footer-mount');
    if (!mount) return;
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.textContent = 'Recipe Box — Personal Collection';
    mount.appendChild(footer);
  }

  window.RecipeBoxTheme = { renderHeader: renderHeader, renderFooter: renderFooter };
})();
