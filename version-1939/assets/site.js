(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    initHero();
    initSearch();
    initPlayers();
  });

  function initHero() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    show(0);
    restart();
  }

  function initSearch() {
    var input = document.querySelector('.movie-search');
    var searchables = Array.prototype.slice.call(document.querySelectorAll('[data-searchable]'));
    var count = document.querySelector('[data-search-count]');

    if (!input || !searchables.length) {
      return;
    }

    var items = [];
    searchables.forEach(function (searchable) {
      items = items.concat(Array.prototype.slice.call(searchable.children));
    });

    function update() {
      var keyword = input.value.trim().toLowerCase();
      var visible = 0;

      items.forEach(function (item) {
        var text = [
          item.getAttribute('data-title') || '',
          item.getAttribute('data-meta') || '',
          item.textContent || ''
        ].join(' ').toLowerCase();
        var matched = !keyword || text.indexOf(keyword) !== -1;
        item.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = keyword ? '匹配 ' + visible + ' 项内容' : '输入关键词快速筛选';
      }
    }

    input.addEventListener('input', update);
    update();
  }

  function initPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.video-shell'));

    shells.forEach(function (shell) {
      var video = shell.querySelector('.hls-video');
      var overlay = shell.querySelector('.player-overlay');

      if (!video || !overlay) {
        return;
      }

      overlay.addEventListener('click', function () {
        startVideo(video, overlay);
      });
    });
  }

  function startVideo(video, overlay) {
    var src = video.getAttribute('data-src');

    if (!src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', src);
      }
      overlay.classList.add('hidden');
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video._hlsPlayer) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        video._hlsPlayer = hls;
      }
      overlay.classList.add('hidden');
      video.play().catch(function () {});
    }
  }
})();
