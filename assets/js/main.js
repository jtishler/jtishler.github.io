document.addEventListener("DOMContentLoaded", function () {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini|Mobile/i.test(
            navigator.userAgent
        )
    ) {
        document.getElementsByClassName("text").width = "100vw";
    } else {
        document.getElementsByClassName("text").width = "50vw";
    }
});