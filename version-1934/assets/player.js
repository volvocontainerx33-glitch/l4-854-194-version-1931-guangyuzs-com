(function () {
  function initMoviePlayer(videoId, url) {
    var video = document.getElementById(videoId);
    if (!video) return;

    var shell = video.closest(".player-shell");
    var cover = shell ? shell.querySelector(".player-cover") : null;
    var hls = null;
    var prepared = false;

    function prepare() {
      if (prepared) return;
      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else {
        video.src = url;
      }
    }

    function play() {
      prepare();
      if (shell) shell.classList.add("is-playing");
      video.controls = true;
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (!prepared || video.paused) {
        play();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
