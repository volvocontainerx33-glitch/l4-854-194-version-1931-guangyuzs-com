(function () {
  function showMessage(shell, text) {
    var message = shell.querySelector('[data-player-message]');
    if (message) {
      message.textContent = text || '';
    }
  }

  function hideOverlay(shell) {
    var overlay = shell.querySelector('[data-play-button]');
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function playVideo(video) {
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {});
    }
  }

  function start(shell) {
    var video = shell.querySelector('video');
    var stream = shell.getAttribute('data-stream');
    if (!video || !stream) {
      showMessage(shell, '播放暂时不可用');
      return;
    }
    hideOverlay(shell);
    showMessage(shell, '正在加载');

    if (video.getAttribute('data-ready') === '1') {
      playVideo(video);
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.setAttribute('data-ready', '1');
        showMessage(shell, '');
        playVideo(video);
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showMessage(shell, '播放连接异常，请稍后重试');
        }
      });
      shell.hlsPlayer = hls;
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.addEventListener('loadedmetadata', function () {
        video.setAttribute('data-ready', '1');
        showMessage(shell, '');
        playVideo(video);
      }, { once: true });
      return;
    }

    showMessage(shell, '当前设备暂不支持该播放格式');
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
      var button = shell.querySelector('[data-play-button]');
      var video = shell.querySelector('video');
      if (button) {
        button.addEventListener('click', function () {
          start(shell);
        });
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.getAttribute('data-ready') !== '1') {
            start(shell);
          }
        });
      }
    });
  });
})();
