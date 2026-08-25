(function () {
  var STORAGE_KEY = 'nb-shopping-list';

  function loadList() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveList(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function render() {
    var contentEl = document.getElementById('shopping-list-content');
    var emptyEl = document.getElementById('shopping-list-empty');
    var items = loadList();

    contentEl.innerHTML = '';

    if (items.length === 0) {
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';

    // Group items by which recipe they came from, in the order first added
    var groups = [];
    var groupsByRecipe = {};
    items.forEach(function (item) {
      if (!groupsByRecipe[item.recipeId]) {
        var group = { title: item.recipeTitle, items: [] };
        groupsByRecipe[item.recipeId] = group;
        groups.push(group);
      }
      groupsByRecipe[item.recipeId].items.push(item);
    });

    groups.forEach(function (group) {
      var groupEl = document.createElement('div');
      groupEl.className = 'shopping-group';

      var titleEl = document.createElement('div');
      titleEl.className = 'shopping-group-title';
      titleEl.textContent = group.title;
      groupEl.appendChild(titleEl);

      group.items.forEach(function (item) {
        var row = document.createElement('label');
        row.className = 'shopping-item' + (item.checked ? ' checked' : '');
        row.innerHTML =
          '<input type="checkbox"' + (item.checked ? ' checked' : '') + ' data-id="' + item.id + '" />' +
          '<span class="shopping-amount">' + escapeHtml(item.amountText) + '</span>' +
          '<span>' + escapeHtml(item.name) + '</span>';
        groupEl.appendChild(row);
      });

      contentEl.appendChild(groupEl);
    });

    contentEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var list = loadList();
        var item = list.find(function (i) { return i.id === cb.dataset.id; });
        if (item) item.checked = cb.checked;
        saveList(list);
        render();
      });
    });
  }

  function init() {
    render();

    document.getElementById('clear-checked-btn').addEventListener('click', function () {
      var list = loadList().filter(function (i) { return !i.checked; });
      saveList(list);
      render();
    });

    document.getElementById('clear-all-btn').addEventListener('click', function () {
      if (!confirm('Clear the entire shopping list? This can\u2019t be undone.')) return;
      saveList([]);
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
