(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.getElementById("mobileNav");
    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", function () {
      var opened = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", opened ? "true" : "false");
      document.body.classList.toggle("menu-open", opened);
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length <= 1) {
      return;
    }

    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }

    start();
  }

  function setupFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    if (!inputs.length) {
      return;
    }

    var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-item]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function apply(value) {
      var term = normalize(value);
      var visible = 0;
      items.forEach(function (item) {
        var haystack = normalize(item.getAttribute("data-search"));
        var matched = !term || haystack.indexOf(term) !== -1;
        item.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        apply(input.value);
      });
    });

    var queryInput = document.querySelector("[data-query-input]");
    if (queryInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";
      if (q) {
        queryInput.value = q;
        apply(q);
      }
    }
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
