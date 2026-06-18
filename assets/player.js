(function(){
var video=document.getElementById('main-video');
var overlay=document.getElementById('player-overlay');
var data=document.getElementById('player-data');
if(!video||!data)return;
var cfg={};
try{cfg=JSON.parse(data.textContent||'{}')}catch(e){cfg={}}
var src=cfg.src||'';
var ready=false;
var hls=null;
function bind(){
if(ready||!src)return;
ready=true;
if(window.Hls&&window.Hls.isSupported()){
hls=new window.Hls({enableWorker:true,lowLatencyMode:true});
hls.loadSource(src);
hls.attachMedia(video);
hls.on(window.Hls.Events.ERROR,function(_,d){if(d&&d.fatal){ready=false}});
}else if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src}
}
function start(){bind();if(overlay)overlay.classList.add('is-hidden');var p=video.play();if(p&&p.catch){p.catch(function(){if(overlay)overlay.classList.remove('is-hidden')})}}
function toggle(){if(video.paused){start()}else{video.pause();if(overlay)overlay.classList.remove('is-hidden')}}
bind();
if(overlay)overlay.addEventListener('click',start);
video.addEventListener('click',function(e){if(e.target===video)toggle()});
video.addEventListener('play',function(){if(overlay)overlay.classList.add('is-hidden')});
video.addEventListener('pause',function(){if(overlay&&!video.ended)overlay.classList.remove('is-hidden')});
window.addEventListener('beforeunload',function(){if(hls&&hls.destroy)hls.destroy()});
})();
