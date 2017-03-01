(function(){
    "use strict";
    var app = (function () {
        // Store API data in global variable to get access everywhere in the app
        var dataStore = null;
        var route;
        return {
            // App settings
            init: function () {
                // Get hash from url
                route = window.location.hash;
                // If no hash is in the URL add default hash
                if (!route) {
                    route = "#countries";
                    window.location.href  = window.location.href + route;
                }
                // Load request result
                request.countries();
            }
        };

    })();
    app.init();
}());