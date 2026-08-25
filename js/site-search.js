(function () {
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    var escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escapedQ + ')', 'gi');
    return escapeHtml(text).replace(regex, function (m) { return '<mark>' + m + '</mark>'; });
  }

  function matches(recipe, q) {
    if (!q) return true;
    var haystack = [
      recipe.title,
      recipe.description || '',
      (recipe.tags || []).join(' '),
      recipe.ingredients.map(function (i) { return i.name; }).join(' ')
    ].join(' ').toLowerCase();
    return haystack.indexOf(q) !== -1;
  }

  function renderCard(recipe, q) {
    var a = document.createElement('a');
    a.className = 'recipe-card';
    a.href = 'recipe.html?id=' + encodeURIComponent(recipe.id);

    var meta = [];
    if (recipe.prepTime) meta.push('Prep ' + recipe.prepTime);
    if (recipe.cookTime) meta.push('Cook ' + recipe.cookTime);
    meta.push('Serves ' + recipe.baseServings);

    a.innerHTML =
      '<div class="recipe-card-title">' + highlight(recipe.title, q) + '</div>' +
      '<div class="recipe-card-meta">' + escapeHtml(meta.join(' \u00b7 ')) + '</div>';

    return a;
  }

  // A small, curated set of top-level categories rather than a pill for
  // every tag ever used — keeps the filter row short and deliberate.
  // Add to this list as the collection grows into needing more categories.
  var CATEGORIES = ['Dessert', 'Gluten Free', 'Dinner'];

  function recipeHasCategory(recipe, category) {
    return (recipe.tags || []).some(function (t) {
      return t.toLowerCase() === category.toLowerCase();
    });
  }

  function init() {
    var input = document.getElementById('recipe-search');
    var gridEl = document.getElementById('recipe-grid');
    var countEl = document.getElementById('search-count');
    var noResultsEl = document.getElementById('no-results');
    var tagFiltersEl = document.getElementById('tag-filters');

    var activeTag = null;

    function renderTagFilters() {
      tagFiltersEl.innerHTML = '';
      CATEGORIES.forEach(function (category) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tag-filter-btn' + (category === activeTag ? ' active' : '');
        btn.textContent = category;
        btn.addEventListener('click', function () {
          activeTag = (activeTag === category) ? null : category;
          renderTagFilters();
          renderList();
        });
        tagFiltersEl.appendChild(btn);
      });
    }

    function renderList() {
      var q = input.value.trim().toLowerCase();
      var recipes = (window.RECIPES || []).filter(function (r) {
        var tagOk = !activeTag || recipeHasCategory(r, activeTag);
        return tagOk && matches(r, q);
      });

      gridEl.innerHTML = '';
      recipes.forEach(function (r) { gridEl.appendChild(renderCard(r, q)); });

      countEl.textContent = (q || activeTag) ? (recipes.length + ' recipe' + (recipes.length !== 1 ? 's' : '')) : '';
      noResultsEl.style.display = recipes.length === 0 ? 'block' : 'none';
      gridEl.style.display = recipes.length === 0 ? 'none' : '';
    }

    input.addEventListener('input', renderList);
    renderTagFilters();
    renderList();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
