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
            var location = window.location;
            var oldHash = location.hash;
            var newHash = location.hash;
            // default section toggle
            sections.toggle(newHash, oldHash);
            window.onhashchange = function () {
                newHash = location.hash;
                sections.toggle(newHash, oldHash);
                // Update hash after toggle
                oldHash = newHash;
            };
        }
    };
    // Sections
    var sections = {
        toggle: function (newRoute, oldRoute) {
            // Default section
            if (!oldRoute) {
                newRoute = "#startScreen";
            }
            // If is empty do not run
            if (oldRoute) {
                // Remove hash for selector
                oldRoute = oldRoute.replace("#", "");
                var hideSection = document.getElementById(oldRoute);
                hideSection.classList.remove("active");
            }
            // If is empty do not run
            if (newRoute) {
                // Remove hash for selector
                newRoute = newRoute.replace("#", "");
                var showSection = document.getElementById(newRoute);
                showSection.classList.add("active");
            }

        }
    };
    // Run app
    app.init();
}());