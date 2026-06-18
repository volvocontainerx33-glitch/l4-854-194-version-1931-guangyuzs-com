(function () {
  function createMoviePlayer(streamUrl) {
    var video = document.getElementById('movieVideo');
    var cover = document.getElementById('playerCover');
    if (!video || !streamUrl) {
      return;
    }
    var attached = false;
    var hls = null;
    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }
    function showCover() {
      if (cover) {
        cover.classList.remove('is-hidden');
      }
    }
    function hideCover() {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    }
    function start() {
      attach();
      hideCover();
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(showCover);
      }
    }
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener('play', hideCover);
    video.addEventListener('error', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      attached = false;
      showCover();
    });
  }
  window.createMoviePlayer = createMoviePlayer;
})();
