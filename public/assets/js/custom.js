setTimeout(()=>{
    (function () {
        var vidElem = document.getElementById('robotVid');
        if(vidElem) {
            vidElem.addEventListener('timeupdate', function () {
                if (vidElem.currentTime >= 3.8) {
                    vidElem.currentTime = 2;
                    vidElem.play();
                }
            }, false);
        }

    })();
}, 2000)

window.fullScreen = true;