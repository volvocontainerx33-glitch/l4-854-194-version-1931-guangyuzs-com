(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");
    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-scroll-row]").forEach(function (row) {
      var section = row.closest(".horizontal-section");
      if (!section) return;
      var left = section.querySelector("[data-scroll-left]");
      var right = section.querySelector("[data-scroll-right]");
      if (left) {
        left.addEventListener("click", function () {
          row.scrollBy({ left: -420, behavior: "smooth" });
        });
      }
      if (right) {
        right.addEventListener("click", function () {
          row.scrollBy({ left: 420, behavior: "smooth" });
        });
      }
    });

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var index = 0;
      var timer;

      function show(nextIndex) {
        if (!slides.length) return;
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
        if (timer) window.clearInterval(timer);
      }

      if (prev) prev.addEventListener("click", function () { show(index - 1); start(); });
      if (next) next.addEventListener("click", function () { show(index + 1); start(); });
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () { show(i); start(); });
      });
      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll("[data-filter-list]").forEach(function (list) {
      var page = list.closest("main") || document;
      var input = page.querySelector("[data-filter-input]");
      var chips = Array.prototype.slice.call(page.querySelectorAll("[data-filter-chip]"));
      var cards = Array.prototype.slice.call(list.querySelectorAll("[data-filter-card]"));
      var activeChip = "";

      function cardText(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var text = cardText(card);
          var okQuery = !query || text.indexOf(query) !== -1;
          var okChip = !activeChip || text.indexOf(activeChip.toLowerCase()) !== -1;
          card.classList.toggle("is-hidden", !(okQuery && okChip));
        });
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && input.hasAttribute("data-query-input")) {
          input.value = q;
        }
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeChip = chip.getAttribute("data-filter-chip") || "";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          apply();
        });
      });

      apply();
    });
  });
})();
