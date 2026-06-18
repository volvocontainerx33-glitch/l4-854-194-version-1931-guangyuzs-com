(function () {
  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var message = document.getElementById(options.messageId);
    var url = options.url;
    var hls = null;

    if (!video || !url) {
      return;
    }

    function showMessage(text) {
      if (message) {
        message.textContent = text;
        message.hidden = false;
      }
    }

    function hideMessage() {
      if (message) {
        message.hidden = true;
        message.textContent = "";
      }
    }

    function attachStream() {
      hideMessage();
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("视频暂时无法播放");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else {
        showMessage("视频暂时无法播放");
      }
    }

    function startPlayback() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      hideMessage();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
          showMessage("点击播放按钮开始观看");
        });
      }
    }

    function togglePlayback() {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
        if (overlay) {
          overlay.classList.remove("is-hidden");
        }
      }
    }

    attachStream();

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", togglePlayback);
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (overlay && !video.ended) {
        overlay.classList.remove("is-hidden");
      }
    });
    video.addEventListener("ended", function () {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
