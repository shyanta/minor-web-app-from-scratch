(function(){
    "use strict";
    // App defined
    var app = {
        init: function () {
            // get routers
            routes.init();
        }
    };
    // Routes
    var routes = {
        init: function () {
            // Get hashs from url
            var oldHash = window.location.hash;
            var newHash = window.location.hash;
            // Default section (when the hash is empty)
            if (!oldHash) {
                var defaultHash = "#startScreen";
                oldHash = defaultHash;
                newHash = defaultHash;
            }
            // Default section toggle
            sections.toggle(newHash, oldHash);
            // On hash change run function
            window.onhashchange = function () {
                newHash = window.location.hash;
                sections.toggle(newHash, oldHash);
                // Update hash after toggle
                oldHash = newHash;
            };
        }
    };
    // Sections
    var sections = {
        toggle: function (newRoute, oldRoute) {
            // If is empty do not run
            if (oldRoute) {
                var hideSection = document.querySelector(oldRoute);
                hideSection.classList.remove("active");
            }
            // If is empty do not run
            if (newRoute) {
                var showSection = document.querySelector(newRoute);
                showSection.classList.add("active");
            }
        }
    };
    // Run app
    app.init();
}());

/*
Sources:
- https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
- https://github.com/ColinDorr - Colin Dorr (build it together with him).
 */