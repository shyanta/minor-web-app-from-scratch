(function(){
    "use strict";
    // Store API data
    var dataStore = null;
    var loader = document.getElementById("loader");
    var responseContainer = document.getElementById("response");

    var request = {
        countries: function () {
            var apiURL = "https://restcountries.eu/rest/v1/all";
            aja()
                .method('get')
                .url(apiURL)
                .on('200', function (response) {
                    dataStore = response;
                    // Load app when have data
                    app.init();
                    // Remove loader
                    loader.remove();
                    // Fade in response
                    responseContainer.style.opacity = 1;
                })
                .on('40x', function (response) {
                    console.log(response);
                })
                .on('500', function (response) {
                    console.log(response);
                })
                .go();
        }
    };
    // Request the API
    request.countries();

    var app = {
        init: function () {
            console.log(dataStore);
            // Get hash from url
            var route = window.location.hash;
            // If no hash is in the URL add default hash
            if (!route) {
                route = "#countries";
                window.location.href  = window.location.href + route
            }
            // Start routers
            routers.init();
        }
    };

    var routers ={
        init: function () {
            // Routers
            routie({
                'countries': function() {
                    // Overview of all the countries
                    sections.overviewCountries();
                    // hide not selected sections
                    sections.hide();
                    // Add active to the section that needs te be displayed
                    document.getElementById("countries").classList.add("active");
                },
                'countries/:country': function() {
                    // Overview of single country
                    sections.singulairCountries();
                    // hide not selected sections
                    sections.hide();
                    // Add active to the section that needs te be displayed
                    document.getElementById("country").classList.add("active");
                }
            });
        }
    };

    // Sections
    var sections = {
        hide: function () {
            // Hide other sections
            var hidden = document.getElementsByTagName("section");
            //ES6 for loop
            for (var hide of hidden) {
                // Hide other sections
                hide.classList.remove("active");
            }
        },
        overviewCountries: function () {
            // Get all country names
            var countries = dataStore.map(function(objectItem) {
                return { name: objectItem.name,  countryCode: objectItem.alpha3Code };
            });
            // Render country name and link with alpha3Code
            var countrySingle = {
                country: {
                    text: function() {
                        return this.name;
                    },
                    value: function() {
                        return this.name;
                    },
                    href: function() {
                        return window.location.href + '/' + this.countryCode.toLowerCase();
                    }
                }
            };
            // Render HTML
            Transparency.render(document.getElementById("countriesOverview"), countries, countrySingle);
            Transparency.render(document.getElementById("countriesSearch"), countries, countrySingle);
        },
        singulairCountries: function () {
            // Get the right country by hash
            var initialPage = window.location.hash;
            var countryLink = initialPage.split('/')[1].toUpperCase();
            // Filter the selected country
            var singleCountry = dataStore.filter(function(value) {
                return value.alpha3Code == countryLink;
            });
            console.log(singleCountry);
            Transparency.render(document.getElementById('countryContainer'), singleCountry);
            // Google maps update
            var latValue = singleCountry[0].latlng[0];
            var lngValue = singleCountry[0].latlng[1];
            this.maps(latValue, lngValue);
        },
        maps: function (lat, lng) {
            var locationPoint = {lat: lat, lng: lng};
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: locationPoint,
                disableDefaultUI: true
            });
            var marker = new google.maps.Marker({
                position: locationPoint,
                map: map
            });
        }
    };

    /* STRUCTURE
    Ajax load countries API
        Load Overview
            (Optinal: load continents)
            Map countries
            Filter on Continent
        Load autocomplete countries
        Click on country
            Filter to the selected country
            Load Google maps for country
            Reduce summery

    Ajax load Google Maps
    */

}());
