(function(){
    "use strict";
    // App defined
    var dataStore;
    var app = {
        init: function () {
            // Get routes on load
            routes.init();
        }
    };
    // Routes
    var routes = {
        init: function () {
            // Toggle section
            sections.toggle();
            routie({
                'countries': function() {
                    routes.hideSections();
                    document.getElementById("countries").classList.add("active");
                    ajaxCountries.overview();
                },
                'countries/:country': function(country) {
                    routes.hideSections();
                    document.getElementById("country").classList.add("active");
                    ajaxCountries.singulair();
                }
            });
        },
        hideSections: function () {
            // Hide other sections
            var hidden = document.getElementsByTagName("section");
            //ES6 for loop
            for (var hide of hidden) {
                // Hide other sections
                hide.classList.remove("active");
            }
        }
    };
    // Sections
    var sections = {
        toggle: function () {
            // Get hash from url
            var route = window.location.hash;
            // Default section toggle if hash is empty
            if (!route) {
                route = "#countries";
                window.location.href  = window.location.href + route
            }
        }
    };
    // AJAX COUNTRIES
    var ajaxCountries = {
        overview: function () {
            var urlDate = "https://restcountries.eu/rest/v1/region/europe";
            aja()
                .method('get')
                .url(urlDate)
                .cache(false)
                .on('200', function(response){
                    // Get all country names
                    var countries = response.map(function(objectItem) {
                        return { name: objectItem.name,  countryCode: objectItem.alpha3Code };
                    });
                    // Render country name and link with alpha3Code
                    var country = {
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
                    Transparency.render(document.getElementById("countriesOverview"), countries, country);
                    Transparency.render(document.getElementById("countriesSearch"), countries, country);
                })
                .on('40x', function(response){

                })
                .on('500', function(response){

                })
                .go();
        },
        singulair: function () {
            var urlDate = "https://restcountries.eu/rest/v1/region/europe";
            var initialPage = window.location.hash;
            var countryLink = initialPage.split('/')[1].toUpperCase();
            aja()
                .method('get')
                .url(urlDate)
                .cache(false)
                .on('200', function(response){
                    var singleCountry = response.filter(function(value) {
                        return value.alpha3Code == countryLink;
                    });
                    Transparency.render(document.getElementById('countryContainer'), singleCountry);
                    // Google maps update
                    var latValue = singleCountry[0].latlng[0];
                    var lngValue = singleCountry[0].latlng[1];
                    var locationPoint = {lat: latValue, lng: lngValue};
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 4,
                        center: locationPoint,
                        disableDefaultUI: true
                    });
                    var marker = new google.maps.Marker({
                        position: locationPoint,
                        map: map
                    });

                })
                .on('40x', function(response){

                })
                .on('500', function(response){

                })
                .go();
        }
    };
    // Run app
    app.init();
}());
