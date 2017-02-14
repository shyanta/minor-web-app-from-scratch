(function(){
    "use strict";
    // App defined
    var app = {
        init: function () {
            // Get routes on load
            routes.init();
        }
    };
    // Routes
    var routes = {
        init: function () {
            var cityName = document.getElementById("cityName");
            // Toggle section
            sections.toggle();
            ajaxCurrency.init();
            ajaxCityRents.init();
            routie({
                'currency': function() {
                    routes.hideSections();
                    document.getElementById(this.path).classList.add("active");
                },
                'currency/:date': function(date) {
                    routes.hideSections();
                    var parentEl = this.path.replace("/:date", "");
                    document.getElementById(parentEl).classList.add("active");
                },
                'startScreen': function() {
                    routes.hideSections();
                    document.getElementById(this.path).classList.add("active");
                },
                'lists': function() {
                    routes.hideSections();
                    document.getElementById(this.path).classList.add("active");
                },
                'rents': function() {
                    routes.hideSections();
                    document.getElementById(this.path).classList.add("active");
                    // Default city
                    if(!cityName.value) {
                        cityName.value = "Amsterdam";
                    }
                    ajaxCityRents.update();
                },
                'rents/:city': function(city) {
                    routes.hideSections();
                    var parentEl = this.path.replace("/:city", "");
                    document.getElementById(parentEl).classList.add("active");
                    // Hash city
                    cityName.value = city;
                    ajaxCityRents.update();
                },
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
                route = "#startScreen";
                window.location.href  = window.location.href + route
            }
        }
    };
    // AJAX currency
    var ajaxCurrency = {
        init: function () {
            var datepicker = document.getElementById("datepicker");
            datepicker.addEventListener("change", this.update);
            // set default date
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            }
            if(mm<10){
                mm='0'+mm
            }

            today = yyyy+'-'+mm+'-'+dd;
            datepicker.value = today;
            datepicker.setAttribute("max", today);
            this.update();
        },
        update: function () {
            var dateValue = document.getElementById("datepicker");
            var urlDate = "https://api.fixer.io/" + dateValue.value;
            aja()
                .url(urlDate)
                .on('success', function (data) {
                    // Return currencies with the Currency name, need Map function to create a new Array for the template engine
                    var currencies = Object.keys(data.rates).map(function(cur) {
                        return cur + ': ' + data.rates[cur];
                    });
                    var directives = {
                        currency: {
                            text: function() {
                                return this.value;
                            }
                        }
                    };
                    Transparency.render(document.getElementById("currencies"), currencies, directives);
                    // Reduce data dunno where else I can use this
                    var result = currencies.reduce(function(a, b) {
                        return a + " - " + b;
                    });
                    var reducedData = {
                        innerReduced: result
                    };
                    Transparency.render(document.getElementById('reducedData'), reducedData);
                    // Get object values and map them
                    var numberValues = Object.keys(data.rates).map(function(cur) {
                        return data.rates[cur];
                    });
                    // Filter currencies higher or equel of 10
                    var filteredCurrencies = numberValues.filter(function(value) {
                        return value >= 10;
                    });
                    var directivesFilter = {
                        currencyFilter: {
                            text: function() {
                                return this.value;
                            }
                        }
                    };
                    Transparency.render(document.getElementById("filteredData"), filteredCurrencies, directivesFilter);
                })
                .go();
        }
    };
    // AJAX CITY RENTS
    var ajaxCityRents = {
        init: function () {
            var cityName = document.getElementById("cityName");
            cityName.addEventListener("change", this.update);
        },
        update: function () {
            var cityValue = document.getElementById("cityName").value;
            var urlDate = "http://api.rentswatch.com/api/cities/search?q=" + cityValue;
            var initialPage = location.pathname;
            location.replace(initialPage + '#rents/' + cityValue);
            aja()
                .url(urlDate)
                .on('success', function (data) {
                    Transparency.render(document.getElementById('cityRentInfo'), data);
                    // Google maps update
                    var latValue = data[0].latitude;
                    var lngValue = data[0].longitude;
                    var locationPoint = {lat: latValue, lng: lngValue};
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 5,
                        center: locationPoint
                    });
                    var marker = new google.maps.Marker({
                        position: locationPoint,
                        map: map
                    });
                })
                .go();
        }
    };
    // Run app
    app.init();
}());
