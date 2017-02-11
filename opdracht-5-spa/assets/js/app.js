(function(){
    "use strict";
    // App defined
    var app = {
        init: function () {
            // Get routes on load
            routes.init();
            // Get routes on hash change
            window.addEventListener("hashchange", routes.init);
        }
    };
    // Routes
    var routes = {
        init: function () {
            // Get hashs from url
            var route = window.location.hash;
            // Default section toggle if hash is empty
            if (!route) {
                route = "#startScreen";
            }
            // Toggle section
            sections.toggle(route);
        }
    };
    // Sections
    var sections = {
        toggle: function (route) {
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