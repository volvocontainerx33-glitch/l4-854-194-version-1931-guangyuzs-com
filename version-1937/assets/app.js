(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMobileMenu() {
    var toggle = qs('[data-mobile-toggle]');
    var menu = qs('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = qs('[data-hero]');
    if (!root) {
      return;
    }
    var slides = qsa('[data-hero-slide]', root);
    var dots = qsa('[data-hero-dot]', root);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        if (timer) {
          window.clearInterval(timer);
        }
        play();
      });
    });
    root.addEventListener('mouseenter', function () {
      if (timer) {
        window.clearInterval(timer);
      }
    });
    root.addEventListener('mouseleave', play);
    play();
  }

  function initHomeSearch() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input[name="q"]', form);
        var value = input ? input.value.trim() : '';
        var target = './movies.html';
        if (value) {
          target += '?q=' + encodeURIComponent(value);
        }
        window.location.href = target;
      });
    });
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function initFilters() {
    qsa('[data-filter-root]').forEach(function (root) {
      var input = qs('[data-filter-input]', root);
      var selects = qsa('[data-filter-select]', root);
      var cards = qsa('[data-filter-card]', root);
      var empty = qs('[data-filter-empty]', root);
      function apply() {
        var keyword = normalize(input ? input.value : '');
        var shown = 0;
        cards.forEach(function (card) {
          var ok = true;
          if (keyword) {
            ok = normalize(card.getAttribute('data-search')).indexOf(keyword) !== -1;
          }
          selects.forEach(function (select) {
            var value = normalize(select.value);
            var key = select.getAttribute('data-filter-key');
            if (ok && value && key) {
              ok = normalize(card.getAttribute('data-' + key)).indexOf(value) !== -1;
            }
          });
          card.style.display = ok ? '' : 'none';
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      }
      if (input) {
        input.addEventListener('input', apply);
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query) {
          input.value = query;
        }
      }
      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initHomeSearch();
    initFilters();
  });
})();
