(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var toggle = qs('[data-menu-toggle]');
        var panel = qs('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', panel.classList.contains('is-open'));
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var prev = qs('[data-hero-prev]', hero);
        var next = qs('[data-hero-next]', hero);
        if (!slides.length) {
            return;
        }
        var active = 0;
        var timer = null;

        function render(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                render(active + 1);
            }, 5600);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                render(active - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                render(active + 1);
                restart();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                render(index);
                restart();
            });
        });
        render(0);
        restart();
    }

    function initFilters() {
        var areas = qsa('[data-filter-area]');
        areas.forEach(function (area) {
            var input = qs('[data-filter-input]', area);
            var category = qs('[data-category-filter]', area);
            var year = qs('[data-year-filter]', area);
            var list = qs('[data-card-list]', area.parentElement || document);
            var empty = qs('[data-empty-state]', area.parentElement || document);
            if (!list) {
                return;
            }
            var cards = qsa('.movie-card', list);

            function normalize(value) {
                return String(value || '').toLowerCase().trim();
            }

            function apply() {
                var term = normalize(input && input.value);
                var catValue = normalize(category && category.value);
                var yearValue = normalize(year && year.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-tags'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-category'),
                        card.getAttribute('data-year')
                    ].join(' '));
                    var matchesTerm = !term || haystack.indexOf(term) !== -1;
                    var matchesCategory = !catValue || normalize(card.getAttribute('data-category')) === catValue;
                    var matchesYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
                    var show = matchesTerm && matchesCategory && matchesYear;
                    card.style.display = show ? '' : 'none';
                    if (show) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            [input, category, year].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    function initSearchQuery() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (!query) {
            return;
        }
        var input = qs('[data-filter-input]');
        if (input) {
            input.value = query;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function initPlayers() {
        qsa('.video-player').forEach(function (box) {
            var video = qs('video', box);
            var button = qs('.play-overlay', box);
            if (!video || !button) {
                return;
            }
            var stream = video.getAttribute('data-stream') || '';

            function hideButton() {
                button.classList.add('is-hidden');
            }

            function play() {
                if (!stream) {
                    return;
                }
                hideButton();
                if (window.Hls && window.Hls.isSupported()) {
                    if (!video.__hlsReady) {
                        var hls = new window.Hls({ enableWorker: true });
                        hls.loadSource(stream);
                        hls.attachMedia(video);
                        video.__hlsReady = true;
                    }
                    video.play().catch(function () {});
                    return;
                }
                if (!video.getAttribute('src')) {
                    video.setAttribute('src', stream);
                }
                video.play().catch(function () {});
            }

            button.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', hideButton);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
        initSearchQuery();
        initPlayers();
    });
})();
