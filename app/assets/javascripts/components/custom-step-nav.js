// Custom Step Navigation - allows flexible markup in header
(function() {
  'use strict';

  function CustomStepNav(container) {
    this.container = container;
    this.steps = Array.from(container.querySelectorAll('.app-step-nav__step'));
    this.init();
  }

  CustomStepNav.prototype.init = function() {
    this.steps.forEach(function(step, idx) {
      var header = step.querySelector('.app-step-nav__header');
      var panel = step.querySelector('.app-step-nav__panel');
      if (!header || !panel) return;

      // Create toggle button
      var toggleBtn = document.createElement('button');
      toggleBtn.className = 'app-step-nav__toggle';
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-controls', panel.id);
      toggleBtn.innerHTML = 'Show';
      header.appendChild(toggleBtn);

      // Hide panel by default
      panel.style.display = 'none';

      // Toggle logic
      toggleBtn.addEventListener('click', function() {
        var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        panel.style.display = expanded ? 'none' : 'block';
        toggleBtn.innerHTML = expanded ? 'Show' : 'Hide';
      });
    });
  };

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    var nav = document.querySelector('.app-step-nav');
    if (nav) {
      new CustomStepNav(nav);
    }
  });
})();
