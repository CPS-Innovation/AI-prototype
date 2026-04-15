/* global App */

App.MaterialsPane = function (params) {
  this.container = params.container;
  this.list = this.container.querySelector('.app-materials-pane__list');
  this.detail = this.container.querySelector('.app-materials-pane__detail');

  if (!this.list || !this.detail) return;

  this.items = Array.prototype.slice.call(
    this.list.querySelectorAll('.app-materials-pane__item')
  );

  if (!this.items.length) return;

  this.items.forEach(function (item) {
    item.addEventListener('click', this.onItemClick.bind(this));
    item.addEventListener('keydown', this.onItemKeydown.bind(this));
    item.setAttribute('tabindex', '0');
  }, this);

  // Select first item by default
  this.select(this.items[0]);

  // Override selection with URL hash if present (e.g. materials#mat-e-1)
  var hash = window.location.hash.slice(1);
  if (hash) {
    var self = this;
    var hashItem = this.items.find(function (item) {
      return item.getAttribute('data-detail') === hash;
    });
    if (hashItem) {
      self.select(hashItem);
    }
  }
};

App.MaterialsPane.prototype.onItemClick = function (e) {
  this.select(e.currentTarget);
};

App.MaterialsPane.prototype.onItemKeydown = function (e) {
  // Enter or Space activates the item
  if (e.keyCode === 13 || e.keyCode === 32) {
    e.preventDefault();
    this.select(e.currentTarget);
  }
  // Arrow down / up moves focus
  if (e.keyCode === 40 || e.keyCode === 38) {
    e.preventDefault();
    var index = this.items.indexOf(e.currentTarget);
    var next = e.keyCode === 40 ? index + 1 : index - 1;
    if (next >= 0 && next < this.items.length) {
      this.items[next].focus();
    }
  }
};

App.MaterialsPane.prototype.select = function (item) {
  // Remove active state from all items
  this.items.forEach(function (i) {
    i.setAttribute('aria-selected', 'false');
    i.classList.remove('app-materials-pane__item--active');
  });

  // Set active
  item.setAttribute('aria-selected', 'true');
  item.classList.add('app-materials-pane__item--active');

  // Render detail panel
  var detailId = item.getAttribute('data-detail');
  var detailEl = this.container.querySelector('#' + detailId);

  // Hide all detail panels
  Array.prototype.slice.call(this.detail.children).forEach(function (p) {
    p.hidden = true;
  });

  if (detailEl) {
    detailEl.hidden = false;
  }
};
