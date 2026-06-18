(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function buildCard(movie) {
    var cover = './' + movie.cover + '.jpg';
    var url = './' + movie.url;
    return [
      '<article class="video-card movie-card">',
      '<a class="card-cover" href="' + escapeHtml(url) + '" aria-label="' + escapeHtml(movie.title) + '">',
      '<img src="' + escapeHtml(cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="card-score">' + escapeHtml(movie.score) + '</span>',
      '<span class="card-play">▶</span>',
      '</a>',
      '<div class="video-card-content">',
      '<a class="video-card-title" href="' + escapeHtml(url) + '">' + escapeHtml(movie.title) + '</a>',
      '<p class="video-card-description">' + escapeHtml(movie.summary) + '</p>',
      '<div class="video-card-meta">',
      '<span>' + escapeHtml(movie.year) + '</span>',
      '<span>' + escapeHtml(movie.region) + '</span>',
      '<span>' + escapeHtml(movie.type) + '</span>',
      '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function search(records, query) {
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) {
      return records.slice(0, 72);
    }
    return records.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        movie.tags,
        movie.summary
      ].join(' ').toLowerCase();
      return terms.every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
    }).slice(0, 120);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    var status = document.getElementById('searchStatus');
    var records = Array.isArray(window.movieSearchData) ? window.movieSearchData : [];
    var query = getQuery();
    if (input) {
      input.value = query;
    }
    if (!results || !status) {
      return;
    }
    var matched = search(records, query);
    status.textContent = query ? '搜索：' + query : '精选影片';
    results.innerHTML = matched.map(buildCard).join('') || '<p class="search-status">未找到匹配影片</p>';
  });
})();
