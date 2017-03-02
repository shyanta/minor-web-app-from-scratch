// Sections
var sections = (function () {
    var hidden,
        i,
        countrySingle,
        initialPage,
        countryLink,
        singleCountry,
        latValue,
        lngValue,
        summery,
        latlng,
        mapOptions,
        map,
        marker;
    return {
        hide: function () {
            // Hide other sections
            hidden = document.getElementsByTagName("section");
            // Loop in all sections
            for (i = 0; i < hidden.length; i++) {
                // Hide other sections
                hidden[i].classList.remove("active");
            }
        },
        overviewCountries: function () {
            // Filter buttons loaded
            filterRegion.buttons();
            // Render country name and link with alpha3Code with the library Transparency.js
            countrySingle = {
                country: {
                    text: function() {
                        // Get name of country
                        return this.name;
                    },
                    value: function() {
                        // Get alpha3Code of country
                        return this.alpha3Code;
                    },
                    href: function() {
                        // Generate link to single page of country
                        return window.location.href + "/" + this.alpha3Code;
                    }
                }
            };
            // Render overview list of countries
            Transparency.render(document.getElementById("countriesOverview"), dataStore, countrySingle);
            // Render dropdown list of countries
            Transparency.render(document.getElementById("countriesSearch"), dataStore, countrySingle);
            // Select region with the filters
            document.getElementById("allClickButtons").addEventListener("click",function (e) {
                // Create dropdown select html element
                filterRegion.select();
                // Filter for regions activated
                filterRegion.active(e);
                // When click on 1 filter item close filter section
                document.getElementById("showFilters").checked = false;
            });
        },
        singulairCountries: function () {
            // Back to top of window
            window.scrollTo(0, 0);
            // Get the right country by hash
            initialPage = window.location.hash;
            countryLink = initialPage.split("/")[1];
            // Filter the selected country
            singleCountry = dataStore.filter(function(value) {
                return value.alpha3Code == countryLink;
            });
            // Render single countries, the selected one
            Transparency.render(document.getElementById("countryContainer"), singleCountry);
            // Google maps update
            latValue = singleCountry[0].latlng[0];
            lngValue = singleCountry[0].latlng[1];
            // Sent lat en lng to Google Maps the render the new map
            this.googleMaps(latValue, lngValue);
            // Generate summery for country based on the data from the API
            summery = singleCountry.reduce(function(buffer, object) {
                return object.name + " (or native name: " + object.nativeName + ") is a country located on the " + object.region + " continent." + " The surface is: " + object.area + " km\u00B2 for a population of " + object.population + " human beings." + " The capital city is named: " + object.capital;
            }, "");
            // Render summery
            Transparency.render(document.getElementById("summery"), {inner: summery});

        },
        googleMaps: function (lat, lng) {
            // Needed to reload Google Maps, because if the marker updates it needed a redraw.
            // lat and lng from the selected country
            latlng = new google.maps.LatLng(lat, lng);
            mapOptions = {
                center: latlng,
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: false,
                // Config in separate file because it's ugly maps.config.js
                styles: mapsConfig
            };
            // Render new map
            map = new google.maps.Map(document.getElementById("map"), mapOptions);
            // Place marker in the center of the map
            marker = new google.maps.Marker({
                position: latlng,
                map: map
            });
        }
    };

})();