(function () {
  var THRESHOLD = 80;
  var startY = null;
  var pulling = false;
  var indicator = null;

  function createIndicator() {
    indicator = document.createElement('div');
    indicator.className = 'ptr-indicator';
    indicator.textContent = 'Pull to refresh';
    document.body.appendChild(indicator);
  }

  function init() {
    createIndicator();

    document.addEventListener('touchstart', function (e) {
      if (window.scrollY > 0) { startY = null; return; }
      startY = e.touches[0].clientY;
      pulling = false;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      var dy = e.touches[0].clientY - startY;
      if (dy > 10 && window.scrollY === 0) {
        pulling = true;
        indicator.textContent = dy > THRESHOLD ? 'Release to refresh' : 'Pull to refresh';
        indicator.classList.toggle('visible', dy > 20);
      }
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      if (!pulling) { startY = null; return; }
      var dy = (e.changedTouches[0].clientY - startY);
      indicator.classList.remove('visible');
      if (dy > THRESHOLD) {
        window.location.reload();
      }
      startY = null;
      pulling = false;
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
