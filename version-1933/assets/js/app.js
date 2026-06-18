(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function submitSearch(form) {
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        if (query) {
            window.location.href = "./search.html?q=" + encodeURIComponent(query);
        }
    }

    selectAll(".js-search-form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            submitSearch(form);
        });
    });

    var toggle = document.querySelector(".js-mobile-toggle");
    var menu = document.querySelector(".js-mobile-menu");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", menu.classList.contains("is-open") ? "true" : "false");
        });
    }

    selectAll(".js-hero").forEach(function (hero) {
        var slides = selectAll(".hero-slide", hero);
        var dots = selectAll(".hero-dot", hero);
        var prev = hero.querySelector(".hero-control.prev");
        var next = hero.querySelector(".hero-control.next");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
                dot.setAttribute("aria-current", dotIndex === current ? "true" : "false");
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);

        show(0);
        start();
    });

    selectAll(".js-scroll-left, .js-scroll-right").forEach(function (button) {
        button.addEventListener("click", function () {
            var targetId = button.getAttribute("data-target");
            var target = targetId ? document.getElementById(targetId) : null;
            var direction = button.classList.contains("js-scroll-left") ? -1 : 1;

            if (target) {
                target.scrollBy({
                    left: direction * Math.min(460, target.clientWidth * 0.85),
                    behavior: "smooth"
                });
            }
        });
    });

    selectAll(".js-filter-zone").forEach(function (zone) {
        var input = zone.querySelector(".js-filter-input");
        var select = zone.querySelector(".js-filter-year");
        var items = selectAll(".movie-item", zone);
        var empty = zone.querySelector(".js-empty-state");

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function update() {
            var query = normalize(input ? input.value : "");
            var year = normalize(select ? select.value : "");
            var visible = 0;

            items.forEach(function (item) {
                var text = normalize(item.getAttribute("data-search"));
                var itemYear = normalize(item.getAttribute("data-year"));
                var matchesQuery = !query || text.indexOf(query) !== -1;
                var matchesYear = !year || itemYear === year;
                var shouldShow = matchesQuery && matchesYear;

                item.style.display = shouldShow ? "" : "none";

                if (shouldShow) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener("input", update);
        }

        if (select) {
            select.addEventListener("change", update);
        }

        update();
    });

    function renderSearch() {
        var target = document.querySelector("[data-search-results]");
        if (!target || !window.SEARCH_MOVIES) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var query = (params.get("q") || "").trim();
        var title = document.querySelector(".js-search-title");
        var intro = document.querySelector(".js-search-intro");
        var input = document.querySelector(".js-search-page-input");

        if (input) {
            input.value = query;
        }

        if (title) {
            title.textContent = query ? "搜索：" + query : "影片搜索";
        }

        if (intro) {
            intro.textContent = query ? "根据标题、简介、类型与标签匹配相关影片。" : "输入影片名、题材、地区或关键词查找内容。";
        }

        if (!query) {
            target.innerHTML = '<div class="empty-state">请输入关键词开始搜索。</div>';
            return;
        }

        var normalized = query.toLowerCase();
        var results = window.SEARCH_MOVIES.filter(function (movie) {
            return movie.search.toLowerCase().indexOf(normalized) !== -1;
        }).slice(0, 120);

        if (!results.length) {
            target.innerHTML = '<div class="empty-state">暂未找到相关影片。</div>';
            return;
        }

        target.innerHTML = results.map(function (movie) {
            return [
                '<article class="video-card movie-item">',
                '<a class="video-card-link" href="' + movie.link + '">',
                '<div class="video-card-media">',
                '<img class="video-card-cover" src="' + movie.cover + '" alt="' + movie.title + '">',
                '<span class="duration-chip">' + movie.duration + '</span>',
                '<span class="score-chip">' + movie.score + '</span>',
                '<div class="video-card-shade"></div>',
                '</div>',
                '<div class="video-card-content">',
                '<h2 class="video-card-title">' + movie.title + '</h2>',
                '<p class="video-card-description">' + movie.oneLine + '</p>',
                '<div class="video-card-meta">',
                '<span>' + movie.genre + '</span>',
                '<span>' + movie.year + '</span>',
                '</div>',
                '</div>',
                '</a>',
                '</article>'
            ].join("");
        }).join("");
    }

    renderSearch();
})();
