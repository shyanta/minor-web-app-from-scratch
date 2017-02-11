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
            var route = window.location.hash;
            // Default section toggle
            if (!route) {
                route = "#startScreen";
            }
            // Init onload
            sections.toggle(route);
            // On hash change run function
            window.onhashchange = function () {
                route = window.location.hash;
                sections.toggle(route);
            };
        }
    };
    // Sections
    var sections = {
        toggle: function (route) {
            // Hide other sections
            var hideSections = document.getElementsByTagName("section");
            //ES6 for loop
            for (var hideSection of hideSections) {
                // Hide sections
                hideSection.classList.remove("active");
            }
            // Show new section
            var showSection = document.querySelector(route);
            showSection.classList.add("active");
        }
    };
    // Run app
    app.init();
}());

/*
Sources:
- https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
- https://github.com/ColinDorr - Colin Dorr (build it together with him).
- ES6 for loop: http://jsfiddle.net/jfriend00/joy06u4e/
 */