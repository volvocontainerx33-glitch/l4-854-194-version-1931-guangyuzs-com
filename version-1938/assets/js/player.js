(function () {
    var video = document.querySelector('[data-player-video]');
    if (!video) {
        return;
    }
    var source = video.getAttribute('data-stream');
    var overlay = document.querySelector('[data-player-overlay]');
    var errorBox = document.querySelector('[data-player-error]');
    var started = false;
    var hls = null;

    var showError = function () {
        if (errorBox) {
            errorBox.textContent = '视频加载失败，请稍后重试';
            errorBox.classList.add('show');
        }
        if (overlay) {
            overlay.classList.remove('is-hidden');
        }
    };

    var bindSource = function () {
        if (!source) {
            showError();
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.load();
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    showError();
                }
            });
            return;
        }
        showError();
    };

    var play = function () {
        if (!started) {
            bindSource();
            started = true;
        }
        video.controls = true;
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && promise.catch) {
            promise.catch(function () {
                if (overlay) {
                    overlay.classList.remove('is-hidden');
                }
            });
        }
    };

    if (overlay) {
        overlay.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
        if (!started || video.paused) {
            play();
        } else {
            video.pause();
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
