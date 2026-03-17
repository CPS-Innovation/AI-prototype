App.DefendantSwitcher = function () {};
App.DefendantSwitcher.prototype.init = function () {
  var btns = document.querySelectorAll('[data-view-btn]');
  var sections = document.querySelectorAll('[data-view]');
  if (!btns.length) return;
  var setView = function (view) {
    btns.forEach(function (b) {
      var isActive = b.getAttribute('data-view-btn') === view;
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      b.classList.toggle('app-defendant-switcher__btn--active', isActive);
      b.classList.toggle('govuk-link', !isActive);
    });
    sections.forEach(function (section) {
      section.hidden = section.getAttribute('data-view') !== view;
    });
    try { sessionStorage.setItem('cgs-defendant-view', view); } catch (e) {}
  };
  var stored;
  try { stored = sessionStorage.getItem('cgs-defendant-view'); } catch (e) {}
  if (stored && document.querySelector('[data-view-btn="' + stored + '"]')) {
    setView(stored);
  }
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setView(btn.getAttribute('data-view-btn'));
    });
  });
};
