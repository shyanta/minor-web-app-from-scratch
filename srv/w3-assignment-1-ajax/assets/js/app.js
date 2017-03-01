(function(){
    "use strict";
    // Store API data in global variable to get access everywhere in the app
    var dataStore = null;
    // App settings
    var app = {
        init: function () {
            // Get hash from url
            var route = window.location.hash;
            // If no hash is in the URL add default hash
            if (!route) {
                route = "#countries";
                window.location.href  = window.location.href + route;
            }
            // Load request result
            request.countries();
        }
    };
    // AJAX requests
    var request = {
        // Request to country API - Get all countries at once so we need 1 AJAX cal
        countries: function () {
            // URL location of the API
            var apiURL = "https://restcountries.eu/rest/v2/all";
            // Loader in HTML, we get the element so we can later remove when the AJAX call is done
            var loader = document.getElementById("loader");
            // Container in the HTML where we place the response of the ajax call
            var responseContainer = document.getElementById("response");
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
    // Routers we can access within the app
    var routers = {
        // Listen loads when data from API is successfully loaded
        listen: function () {
            // Routers
            routie({
                "countries": function() {
                    // Hide Google Maps on overview
                    document.getElementById("map").classList.add("hide");
                    document.getElementById("map").classList.remove("show");
                    // Overview of all the countries
                    sections.overviewCountries();
                    // hide not selected sections
                    sections.hide();
                    // Add active to the section that needs te be displayed
                    document.getElementById("countries").classList.add("active");
                    filterRegion.select();
                },
                "countries/:country": function() {
                    // Show Google Maps on single
                    document.getElementById("map").classList.add("show");
                    document.getElementById("map").classList.remove("hide");
                    // Overview of single country
                    sections.singulairCountries();
                    // hide not selected sections
                    sections.hide();
                    // Add active to the section that needs te be displayed
                    document.getElementById("country").classList.add("active");
                }
            });
        },
        // Failed loads when data from API is NOT successfully loaded
        failed: function () {
            // Hide Google Maps on overview
            document.getElementById("map").classList.add("hide");
            document.getElementById("map").classList.remove("show");
            // Show failed content
            document.getElementById("failed").classList.add("show");
            document.getElementById("failed").classList.remove("hide");
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
            // Filter buttons loaded
            filterRegion.buttons();
            // Render country name and link with alpha3Code with the library Transparency.js
            var countrySingle = {
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
            // Get the right country by hash
            var initialPage = window.location.hash;
            var countryLink = initialPage.split("/")[1];
            // Filter the selected country
            var singleCountry = dataStore.filter(function(value) {
                return value.alpha3Code == countryLink;
            });
            // Render single countries, the selected one
            Transparency.render(document.getElementById("countryContainer"), singleCountry);
            // Google maps update
            var latValue = singleCountry[0].latlng[0];
            var lngValue = singleCountry[0].latlng[1];
            // Sent lat en lng to Google Maps the render the new map
            this.googleMaps(latValue, lngValue);
            // Generate summery for country based on the data from the API
            var summery = singleCountry.reduce(function(buffer, object) {
                var summeryString = object.name + " (or native name: " + object.nativeName + ") is a country located on the " + object.region + " continent." + " The surface is: " + object.area + " km\u00B2 for a population of " + object.population + " human beings." + " The capital city is named: " + object.capital;

                return summeryString;
            }, "");
            // Render summery
            Transparency.render(document.getElementById("summery"), {inner: summery});

        },
        googleMaps: function (lat, lng) {
            // Needed to reload Google Maps, because if the marker updates it needed a redraw.
            // lat and lng from the selected country
            var latlng = new google.maps.LatLng(lat, lng);
            var mapOptions = {
                center: latlng,
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                // Config in separate file because it's ugly maps.config.js
                styles: mapsConfig
            };
            // Render new map
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            // Place marker in the center of the map
            var marker = new google.maps.Marker({
                position: latlng,
                map: map
            });
        }
    };

    var filterRegion = {
        // Filter buttons for regions aka continents
        buttons: function () {
            // Map data to get only the region name
            var regions = dataStore.map(function(objectItem) {
                return { region: objectItem.region };
            });
            // Filter all regions so we don't have any duplicated one's
            var regionArray = [], regionOutput = [], l = regions.length, i;
            for( i=0; i<l; i++) {
                if( regionArray[regions[i].region]) continue;
                regionArray[regions[i].region] = true;
                // Do not add empty values
                if(regions[i].region != "") {
                    regionOutput.push(regions[i].region);
                }
            }
            // Render regions for filter
            var filterButtons = {
                    region: {
                        text: function() {
                            return this.value;
                        },
                        value: function() {
                            return this.value;
                        },
                        for: function() {
                            return this.value;
                        }
                    },
                    regionGroup: {
                        value: function() {
                            return this.value;
                        },
                        id: function() {
                            return this.value;
                        }
                    }

            };
            // Render HTML
            Transparency.render(document.getElementById("filterButtons"), regionOutput, filterButtons);
        },
        active: function (e) {
            if (e.target && e.target.matches(".regionRadio")) {
                // Filter on region
                var filteredRegion;
                if (e.target.value == "all") {
                    filteredRegion = dataStore;
                } else {
                    filteredRegion = dataStore.filter(function(value) {
                        return value.region == e.target.value;
                    });
                }

                // Render country name and link with alpha3Code
                var countrySingle = {
                    country: {
                        text: function() {
                            return this.name;
                        },
                        value: function() {
                            return this.alpha3Code;
                        },
                        href: function() {
                            return window.location.href + "/" + this.alpha3Code;
                        }
                    }
                };
                // Render overview list of countries
                Transparency.render(document.getElementById("countriesOverview"), filteredRegion, countrySingle);
                // Render dropdown list of countries
                Transparency.render(document.getElementById("countriesSearch"), filteredRegion, countrySingle);
            }
        },
        select: function () {
            // Default selected item in dropdown after loaded countries
            var countryDropdown = document.getElementById("countriesSearch");
            // Create default option
            var option = document.createElement("option");
            option.text = "Select a country..";
            // Set ID
            option.setAttribute("id", "defaultSelected");
            // Set as selected item
            option.setAttribute("selected", "selected");
            // Set as disabled so it can't be selected by the user
            option.setAttribute("disabled", "disabled");
            // add Default selected item to dropdown only when not exist
            var defaultSelected =  document.getElementById("defaultSelected");
            if (defaultSelected) {
                // First remove then add
                defaultSelected.remove();
                countryDropdown.add(option, countryDropdown[0]);
            } else {
                // Add
                countryDropdown.add(option, countryDropdown[0]);
            }
            // Go to selected country
            document.getElementById("countriesSearch").addEventListener("change",function () {
                if (this.value) {
                    window.location.href = "#countries/" + this.value;
                }
            });
        }
    };

    app.init();

}());