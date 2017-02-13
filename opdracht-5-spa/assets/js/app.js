(function(){
    "use strict";
    // App defined
    var app = {
        init: function () {
            // Get routes on load
            routes.init();
            // Get routes on hash change
        }
    };
    // Routes
    var routes = {
        init: function () {
            // Toggle on hashchange
            window.addEventListener("hashchange", sections.toggle);
            // Toggle section
            sections.toggle();
        }
    };
    // Sections
    var sections = {
        toggle: function () {
            // Get hash from url
            var route = window.location.hash;
            // Default section toggle if hash is empty
            if (!route) {
                route = "#startScreen";
            }
            // Hide other sections
            var hideSections = document.getElementsByTagName("section");
            //ES6 for loop
            for (var hideSection of hideSections) {
                // Hide other sections
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