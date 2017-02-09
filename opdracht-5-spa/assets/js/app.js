(function(){
    "use strict";
    // App defined
    var app = {
        init: function () {
            // get routers
            routes.init();
        }
    };
    
    var routes = {
        init: function () {
            var defaultHash = "#startScreen";
            var oldHash = location.hash;
            var newHash = location.hash;
            // Default section (when the hash is empty)
            if (!newHash) {
                sections.toggle(defaultHash);
            }else{
                sections.toggle(newHash)
            }
            
            // default section toggle
            window.onhashchange = function () {
                newHash = location.hash;
                sections.toggle(newHash);
                // Update hash after toggle
                oldHash = newHash;
            };
        }
    };

    var sections = {
        toggle: function (route) {
            // If is empty do not run
            if (route) {
                // Remove hash for selector
                
                var showSection = document.querySelector(route);
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
- Colin Dorr (build it together with him).
 */
