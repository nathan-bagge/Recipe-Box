(function () {
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Formats a scaled amount nicely — whole numbers as-is, common
  // fractions as fraction glyphs, everything else rounded to 2dp.
  function formatAmount(n) {
    if (n === null || n === undefined || isNaN(n)) return '';
    var whole = Math.floor(n);
    var frac = n - whole;
    var fractions = [
      [0.125, '\u215b'], [0.166, '\u2159'], [0.2, '\u2155'], [0.25, '\u00bc'],
      [0.333, '\u2153'], [0.375, '\u215c'], [0.4, '\u2156'], [0.5, '\u00bd'],
      [0.6, '\u2157'], [0.625, '\u215d'], [0.666, '\u2154'], [0.75, '\u00be'],
      [0.8, '\u2158'], [0.833, '\u215a'], [0.875, '\u215e']
    ];
    if (frac < 0.02) return String(whole || 0);

    var closestSym = null, closestDiff = 0.02;
    fractions.forEach(function (pair) {
      var diff = Math.abs(frac - pair[0]);
      if (diff < closestDiff) { closestDiff = diff; closestSym = pair[1]; }
    });

    if (closestSym) return (whole > 0 ? whole + ' ' : '') + closestSym;
    return String(Math.round(n * 100) / 100);
  }

  function getRecipeIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  var STEP_PROGRESS_KEY = 'nb-step-progress';

  function loadAllStepProgress() {
    try {
      var raw = localStorage.getItem(STEP_PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveStepProgress(recipeId, checkedArray) {
    var all = loadAllStepProgress();
    all[recipeId] = checkedArray;
    try { localStorage.setItem(STEP_PROGRESS_KEY, JSON.stringify(all)); } catch (e) { /* ignore */ }
  }

  // Exact, density-independent conversions only: volume units convert to
  // ml, weight units convert to g. Deliberately does NOT attempt to turn
  // a volume (like cups of flour) into a weight, since that needs
  // ingredient-specific density data that varies too much to guess at
  // reliably — grams-per-cup differs for flour, sugar, and butter alike.
  var VOLUME_TO_ML = { cup: 236.588, cups: 236.588, tbsp: 14.787, tsp: 4.929 };
  var WEIGHT_TO_G = { oz: 28.3495, lb: 453.592 };

  var UNIT_SYSTEM_KEY = 'nb-unit-system';

  function getUnitSystem() {
    try {
      var v = localStorage.getItem(UNIT_SYSTEM_KEY);
      return v === 'metric' ? 'metric' : 'us';
    } catch (e) { return 'us'; }
  }

  function setUnitSystem(system) {
    try { localStorage.setItem(UNIT_SYSTEM_KEY, system); } catch (e) { /* ignore */ }
  }

  function formatMetricAmount(n) {
    if (n >= 10) return String(Math.round(n));
    return String(Math.round(n * 10) / 10);
  }

  // Returns the display text for an ingredient's amount at a given
  // multiplier and unit system — shared by the ingredient list and the
  // inline {id} references in the method steps, so both stay consistent.
  function getAmountText(ing, multiplier, unitSystem) {
    var rawAmount = ing.amount * multiplier;
    var unit = ing.unit;

    if (unitSystem === 'metric' && unit) {
      var lower = unit.toLowerCase();
      if (VOLUME_TO_ML.hasOwnProperty(lower)) {
        return formatMetricAmount(rawAmount * VOLUME_TO_ML[lower]) + ' ml';
      }
      if (WEIGHT_TO_G.hasOwnProperty(lower)) {
        return formatMetricAmount(rawAmount * WEIGHT_TO_G[lower]) + ' g';
      }
      // Already metric (g/kg/ml/l) or unconvertible (pinch, "x 379g can",
      // null for count items) — leave as originally written.
    }

    return formatAmount(rawAmount) + (unit ? ' ' + unit : '');
  }

  function renderRecipe(recipe) {
    document.title = recipe.title + ' — Recipe Box';
    document.getElementById('recipe-title').textContent = recipe.title;
    document.getElementById('recipe-desc').textContent = recipe.description || '';

    var metaEl = document.getElementById('recipe-meta-row');
    var metaParts = [];
    if (recipe.prepTime) metaParts.push('<span><strong>Prep</strong> ' + escapeHtml(recipe.prepTime) + '</span>');
    if (recipe.cookTime) metaParts.push('<span><strong>Cook</strong> ' + escapeHtml(recipe.cookTime) + '</span>');
    metaEl.innerHTML = metaParts.join('');

    var notesEl = document.getElementById('recipe-notes');
    if (recipe.notes) {
      notesEl.textContent = recipe.notes;
      notesEl.style.display = '';
    } else {
      notesEl.style.display = 'none';
    }

    var sourceEl = document.getElementById('recipe-source');
    if (recipe.source) {
      sourceEl.innerHTML = 'Adapted from <a href="' + escapeHtml(recipe.source) + '" target="_blank" rel="noopener">the original recipe</a>.';
      sourceEl.style.display = '';
    } else {
      sourceEl.style.display = 'none';
    }

    var servingsValueEl = document.getElementById('servings-value');
    var ingredientListEl = document.getElementById('ingredient-list');
    var stepsListEl = document.getElementById('step-list');
    var currentServings = recipe.baseServings;

    // Ingredients can be a flat array, or an array of groups
    // ({ group: 'Caramel', items: [...] }) for recipes with labeled
    // sub-sections. Normalize to a list of groups either way.
    function normalizeGroups() {
      if (recipe.ingredients.length && recipe.ingredients[0].items) {
        return recipe.ingredients;
      }
      return [{ group: null, items: recipe.ingredients }];
    }

    // Flat id -> ingredient lookup, used to resolve {id} placeholders in steps
    function buildIngredientMap() {
      var map = {};
      normalizeGroups().forEach(function (grp) {
        grp.items.forEach(function (ing) {
          if (ing.id) map[ing.id] = ing;
        });
      });
      return map;
    }

    var unitSystem = getUnitSystem();

    function renderIngredients() {
      var multiplier = currentServings / recipe.baseServings;
      ingredientListEl.innerHTML = '';

      normalizeGroups().forEach(function (grp) {
        if (grp.group) {
          var groupHeading = document.createElement('li');
          groupHeading.className = 'ingredient-group-heading';
          groupHeading.textContent = grp.group;
          ingredientListEl.appendChild(groupHeading);
        }
        grp.items.forEach(function (ing) {
          var li = document.createElement('li');
          var amountText = getAmountText(ing, multiplier, unitSystem);
          li.innerHTML =
            '<span class="ingredient-amount">' + escapeHtml(amountText) + '</span>' +
            '<span>' + escapeHtml(ing.name) + '</span>';
          ingredientListEl.appendChild(li);
        });
      });

      servingsValueEl.textContent = currentServings;
    }

    // Replaces {id} tokens in step text with that ingredient's amount at
    // the current serving size, so weights show up right where they're
    // used in the method — not just in the list above it. Each step also
    // gets a checkbox to tick off while cooking, saved so it survives a
    // page reload or navigating away mid-recipe.
    var stepProgress = (loadAllStepProgress()[recipe.id] || []).slice();
    var timers = {}; // step index -> { remaining, intervalId }

    function formatTime(totalSeconds) {
      var m = Math.floor(totalSeconds / 60);
      var s = totalSeconds % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    // Generates a short triple-beep with no audio file needed.
    function playTimerAlert() {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        var ctx = new Ctx();
        [0, 0.45, 0.9].forEach(function (delay) {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + delay + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.4);
        });
      } catch (e) { /* ignore — alert sound isn't essential */ }
      if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
    }

    // Looks the button up by ID rather than holding a direct element
    // reference, so a running timer keeps working correctly even if the
    // step list gets rebuilt underneath it (e.g. the servings count changes
    // mid-timer) — the same index always maps to the same button.
    function updateTimerButton(index, baseSeconds) {
      var btn = document.getElementById('timer-btn-' + index);
      if (!btn) return;
      var t = timers[index];
      if (t && t.remaining > 0) {
        btn.textContent = '\u23f1 ' + formatTime(t.remaining) + ' \u2014 tap to cancel';
        btn.className = 'step-timer-btn timer-running';
      } else if (t && t.remaining <= 0) {
        btn.textContent = '\u2713 Done \u2014 tap to restart';
        btn.className = 'step-timer-btn timer-done';
      } else {
        btn.textContent = '\u23f1 Start ' + Math.round(baseSeconds / 60) + ' min Timer';
        btn.className = 'step-timer-btn';
      }
    }

    function startTimer(index, seconds) {
      timers[index] = { remaining: seconds, intervalId: null };
      updateTimerButton(index, seconds);
      timers[index].intervalId = setInterval(function () {
        var t = timers[index];
        if (!t) return;
        t.remaining--;
        if (t.remaining <= 0) {
          clearInterval(t.intervalId);
          t.intervalId = null;
          t.remaining = 0;
          updateTimerButton(index, seconds);
          playTimerAlert();
          var btn = document.getElementById('timer-btn-' + index);
          var stepLi = btn ? btn.closest('li') : null;
          if (stepLi) {
            stepLi.classList.add('timer-flash');
            setTimeout(function () { stepLi.classList.remove('timer-flash'); }, 3000);
          }
        } else {
          updateTimerButton(index, seconds);
        }
      }, 1000);
    }

    function cancelTimer(index, seconds) {
      var t = timers[index];
      if (t && t.intervalId) clearInterval(t.intervalId);
      delete timers[index];
      updateTimerButton(index, seconds);
    }

    function renderSteps() {
      var multiplier = currentServings / recipe.baseServings;
      var idMap = buildIngredientMap();

      stepsListEl.innerHTML = '';
      (recipe.steps || []).forEach(function (stepText, index) {
        var timerMatch = stepText.match(/\{timer:(\d+)\}/);
        var timerSeconds = timerMatch ? parseInt(timerMatch[1], 10) : null;
        var textWithoutTimer = stepText.replace(/\s*\{timer:\d+\}/, '');

        var rendered = escapeHtml(textWithoutTimer).replace(/\{([a-zA-Z0-9_-]+)\}/g, function (match, id) {
          var ing = idMap[id];
          if (!ing) return match;
          var amountText = getAmountText(ing, multiplier, unitSystem);
          return '<strong class="step-amount">' + escapeHtml(amountText) + '</strong>';
        });

        var isChecked = !!stepProgress[index];
        var li = document.createElement('li');
        var label = document.createElement('label');
        label.className = 'step-item' + (isChecked ? ' step-checked' : '');

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'step-checkbox';
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', function () {
          stepProgress[index] = checkbox.checked;
          saveStepProgress(recipe.id, stepProgress);
          label.classList.toggle('step-checked', checkbox.checked);
        });

        var num = document.createElement('span');
        num.className = 'step-num';
        num.textContent = index + 1;

        var text = document.createElement('span');
        text.className = 'step-text';
        text.innerHTML = rendered;

        label.appendChild(checkbox);
        label.appendChild(num);
        label.appendChild(text);
        li.appendChild(label);
        stepsListEl.appendChild(li);

        if (timerSeconds !== null) {
          var timerBtn = document.createElement('button');
          timerBtn.type = 'button';
          timerBtn.id = 'timer-btn-' + index;
          timerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var t = timers[index];
            if (t && t.intervalId) {
              cancelTimer(index, timerSeconds);
            } else {
              startTimer(index, timerSeconds);
            }
          });
          li.appendChild(timerBtn);
          updateTimerButton(index, timerSeconds);
        }
      });
    }

    function renderAll() {
      renderIngredients();
      renderSteps();
    }

    document.getElementById('servings-minus').addEventListener('click', function () {
      if (currentServings > 1) { currentServings -= 1; renderAll(); }
    });
    document.getElementById('servings-plus').addEventListener('click', function () {
      currentServings += 1;
      renderAll();
    });

    document.getElementById('reset-steps-btn').addEventListener('click', function () {
      stepProgress = [];
      saveStepProgress(recipe.id, stepProgress);
      renderSteps();
    });

    var usBtn = document.getElementById('unit-toggle-us');
    var metricBtn = document.getElementById('unit-toggle-metric');

    function updateUnitButtons() {
      usBtn.classList.toggle('active', unitSystem === 'us');
      metricBtn.classList.toggle('active', unitSystem === 'metric');
    }

    usBtn.addEventListener('click', function () {
      unitSystem = 'us';
      setUnitSystem('us');
      updateUnitButtons();
      renderAll();
    });
    metricBtn.addEventListener('click', function () {
      unitSystem = 'metric';
      setUnitSystem('metric');
      updateUnitButtons();
      renderAll();
    });
    updateUnitButtons();

    renderAll();
    initCookMode();
    initSwipeNavigation(recipe);
    initAddToShoppingList(recipe, function () { return currentServings; }, normalizeGroups);
  }

  // ── Cook Mode: keeps the screen awake, enlarges the ingredient and step
  // text in place. No pagination, no tapping through steps — everything
  // stays visible and scrollable exactly as normal, just bigger and with
  // the screen guaranteed to stay on.
  function initCookMode() {
    var toggleBtn = document.getElementById('cook-mode-btn');
    var banner = document.getElementById('cook-mode-banner');
    var exitBtn = document.getElementById('cook-mode-exit');
    var wakeNoteEl = document.getElementById('cook-mode-wake-note');
    if (!toggleBtn) return;

    var active = false;
    var wakeLock = null;

    function requestWakeLock() {
      if (!('wakeLock' in navigator)) {
        wakeNoteEl.textContent = "Screen wake-lock isn't supported in this browser — your screen may still lock, just tap it to wake it back up.";
        return;
      }
      navigator.wakeLock.request('screen').then(function (lock) {
        wakeLock = lock;
        wakeNoteEl.textContent = 'Screen will stay awake while this is on.';
      }).catch(function () {
        wakeNoteEl.textContent = "Couldn't keep the screen awake — you may need to tap it occasionally.";
      });
    }

    function releaseWakeLock() {
      if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
    }

    function turnOn() {
      active = true;
      document.body.classList.add('cook-mode-active');
      banner.classList.add('active');
      requestWakeLock();
    }

    function turnOff() {
      active = false;
      document.body.classList.remove('cook-mode-active');
      banner.classList.remove('active');
      releaseWakeLock();
    }

    // Wake lock is released automatically when the tab is hidden — re-request
    // it when coming back if Cook Mode is still on.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && active && !wakeLock) {
        requestWakeLock();
      }
    });

    toggleBtn.addEventListener('click', turnOn);
    exitBtn.addEventListener('click', turnOff);
  }

  // ── Swipe left/right to move to the next/previous recipe (by list order) ──
  function initSwipeNavigation(recipe) {
    var recipes = window.RECIPES || [];
    var idx = recipes.findIndex(function (r) { return r.id === recipe.id; });
    if (idx === -1) return;

    var startX = null, startY = null;

    document.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      startX = null;

      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // not a clean horizontal swipe

      if (dx < 0 && idx < recipes.length - 1) {
        window.location.href = 'recipe.html?id=' + encodeURIComponent(recipes[idx + 1].id);
      } else if (dx > 0 && idx > 0) {
        window.location.href = 'recipe.html?id=' + encodeURIComponent(recipes[idx - 1].id);
      }
    }, { passive: true });
  }

  var SHOPPING_LIST_KEY = 'nb-shopping-list';

  function loadShoppingList() {
    try {
      var raw = localStorage.getItem(SHOPPING_LIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveShoppingList(items) {
    try { localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
  }

  function initAddToShoppingList(recipe, getServings, normalizeGroups) {
    var btn = document.getElementById('add-to-shopping-list-btn');
    var status = document.getElementById('shopping-add-status');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var multiplier = getServings() / recipe.baseServings;
      var list = loadShoppingList();

      normalizeGroups().forEach(function (grp) {
        grp.items.forEach(function (ing) {
          var scaledAmount = ing.amount * multiplier;
          list.push({
            id: 'i' + Date.now() + Math.random().toString(36).slice(2, 7),
            recipeId: recipe.id,
            recipeTitle: recipe.title,
            amountText: formatAmount(scaledAmount) + (ing.unit ? ' ' + ing.unit : ''),
            name: ing.name,
            checked: false
          });
        });
      });

      saveShoppingList(list);
      status.textContent = 'Added at ' + getServings() + ' servings!';
      setTimeout(function () { status.textContent = ''; }, 2500);
    });
  }

  function init() {
    var id = getRecipeIdFromUrl();
    var recipe = (window.RECIPES || []).find(function (r) { return r.id === id; });

    if (!recipe) {
      document.getElementById('recipe-detail').style.display = 'none';
      document.getElementById('recipe-not-found').style.display = 'block';
      return;
    }

    renderRecipe(recipe);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
