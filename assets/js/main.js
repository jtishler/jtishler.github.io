document.addEventListener("DOMContentLoaded", function () {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini|Mobile/i.test(
            navigator.userAgent
        )
    ) {
        document.getElementById("about-text").style.width = "100vw";
        document.getElementById("sketchy-holder").style.display = 'none';
    } else {
        document.getElementById("about-text").style.width = "50vw";
        document.getElementById("sketchy-holder").style.display = 'block';
    }
});