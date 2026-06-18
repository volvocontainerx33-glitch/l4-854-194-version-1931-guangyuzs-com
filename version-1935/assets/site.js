(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.mobile-toggle');
    if (!header || !toggle) {
      return;
    }
    toggle.addEventListener('click', function () {
      const open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
    });
  }

  function initHero() {
    const hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    if (slides.length < 2) {
      return;
    }
    let index = 0;
    let timer = null;
    const show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    const start = function () {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };
    const stop = function () {
      if (timer) {
        window.clearInterval(timer);
      }
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFiltering() {
    const containers = Array.from(document.querySelectorAll('[data-filter-list]'));
    containers.forEach(function (container) {
      const input = document.querySelector(container.getAttribute('data-filter-list'));
      const cards = Array.from(container.querySelectorAll('.video-card'));
      const empty = document.querySelector(container.getAttribute('data-empty-target') || '');
      const apply = function () {
        const query = normalizeText(input ? input.value : '');
        let visible = 0;
        cards.forEach(function (card) {
          const text = normalizeText(card.getAttribute('data-search'));
          const match = !query || text.indexOf(query) !== -1;
          card.style.display = match ? '' : 'none';
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      };
      if (input) {
        input.addEventListener('input', apply);
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
          input.value = q;
        }
      }
      document.querySelectorAll('[data-filter-value]').forEach(function (chip) {
        chip.addEventListener('click', function () {
          if (input) {
            input.value = chip.getAttribute('data-filter-value') || '';
            apply();
            input.focus();
          }
        });
      });
      apply();
    });
  }

  function attachVideo(shell) {
    const video = shell.querySelector('video[data-stream]');
    const cover = shell.querySelector('.play-cover');
    if (!video) {
      return;
    }
    let attached = false;
    const source = video.getAttribute('data-stream');
    const load = function () {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        shell.hlsInstance = hls;
      } else {
        video.src = source;
      }
    };
    const play = function () {
      load();
      shell.classList.add('is-playing');
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    };
    if (cover) {
      cover.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('ended', function () {
      shell.classList.remove('is-playing');
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0) {
        shell.classList.remove('is-playing');
      }
    });
  }

  function initPlayers() {
    document.querySelectorAll('.player-shell').forEach(attachVideo);
  }

  ready(function () {
    initNavigation();
    initHero();
    initFiltering();
    initPlayers();
  });
})();
