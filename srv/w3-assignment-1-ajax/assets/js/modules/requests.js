// AJAX requests
var request = (function () {

    // URL location of the API
    var apiURL = "https://restcountries.eu/rest/v2/all";
    // Loader in HTML, we get the element so we can later remove when the AJAX call is done
    var loader = document.getElementById("loader");
    // Container in the HTML where we place the response of the ajax call
    var responseContainer = document.getElementById("response");

    return {

        // Request to country API - Get all countries at once so we need 1 AJAX cal
        countries: function () {
            // The AJAX call with the aja.js library
            aja()
                .method("get")
                .url(apiURL)
                .on("200", function (response) {
                    // Store response data in global variable dataStore
                    dataStore = response;
                    // Start routers only when AJAX call is a succes
                    routers.listen();
                    // Remove loader
                    loader.remove();
                    // Fade in response
                    responseContainer.style.opacity = 1;
                })
                .on("40x", function () {
                    // Error message for user
                    routers.failed();
                    // Remove loader
                    loader.remove();
                })
                .on("500", function () {
                    // Error message for user
                    routers.failed();
                    // Remove loader
                    loader.remove();
                })
                .go();
        }
    };

})();