
history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            history.go(1);
};