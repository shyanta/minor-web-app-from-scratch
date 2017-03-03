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
            // Check if there is localStorage, and if not run AJAX call
            if (localStorage.getItem("countries") === null) {
                // When there is no localStorage
                // The AJAX call with the aja.js library
                aja()
                    .method("get")
                    .url(apiURL)
                    .on("200", function (response) {
                        // Store response data in global variable dataStore
                        // Check if browser supports localStorage
                        if (typeof(Storage) !== "undefined") {
                            // If the browser does does support localStorage
                            // Store data in localStorage for better performance.
                            // The data needs to be converted to a string because localStorage only supports Strings and then in the dataStore variable it needs to be converted to a JSON syntax.
                            localStorage.setItem("countries", JSON.stringify(response));
                            dataStore = JSON.parse(localStorage.getItem("countries"));
                        } else {
                            // If the browser does not support localStorage
                            dataStore = response;
                        }
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
            } else {
                // if there is localStorage
                dataStore = JSON.parse(localStorage.getItem("countries"));
                // Start routers only when AJAX call is a succes
                routers.listen();
                // Remove loader
                loader.remove();
                // Fade in response
                responseContainer.style.opacity = 1;
            }
        }
    };

})();