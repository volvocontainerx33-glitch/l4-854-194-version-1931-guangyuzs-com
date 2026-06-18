(function () {
    function setupPlayer(player) {
        var video = player.querySelector("video");
        var cover = player.querySelector(".player-cover");
        var message = player.querySelector(".player-message");
        var stream = player.getAttribute("data-stream");
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function setMessage(text) {
            if (message) {
                message.textContent = text || "";
            }
        }

        function initStream() {
            if (video.dataset.ready === "1") {
                return;
            }

            video.dataset.ready = "1";

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setMessage("暂时无法播放，请稍后再试");
                    }
                });
                return;
            }

            setMessage("暂时无法播放，请稍后再试");
        }

        function playVideo() {
            initStream();

            if (cover) {
                cover.classList.add("is-hidden");
            }

            video.controls = true;
            var promise = video.play();

            if (promise && promise.catch) {
                promise.catch(function () {
                    if (cover) {
                        cover.classList.remove("is-hidden");
                    }
                });
            }
        }

        function toggleByVideoClick(event) {
            if (event.target !== video) {
                return;
            }

            initStream();

            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        }

        if (cover) {
            cover.addEventListener("click", playVideo);
        }

        video.addEventListener("click", toggleByVideoClick);

        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (video.currentTime === 0 && cover) {
                cover.classList.remove("is-hidden");
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });

        initStream();
    }

    Array.prototype.slice.call(document.querySelectorAll(".js-video-player")).forEach(setupPlayer);
})();
