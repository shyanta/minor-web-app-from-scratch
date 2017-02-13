//(function(){
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
                },
                'rents/:city': function(city) {
                    routes.hideSections();
                    var parentEl = this.path.replace("/:city", "");
                    document.getElementById(parentEl).classList.add("active");
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
                    var currencies = Object.keys(data.rates).map(function (key) { return data.rates[key]; });
                    var directives = {
                        currency: {
                            text: function() {
                                return this.value;
                            }
                        }
                    };
                    Transparency.render(document.getElementById("currencies"), currencies, directives);
                })
                .go();
        }
    };
    // AJAX CITY RENTS
    var ajaxCityRents = {
        init: function () {
            var cityName = document.getElementById("cityName");
            cityName.addEventListener("change", this.update);
            this.update();
        },
        update: function () {
            var dateValue = document.getElementById("cityName").value;
            var urlDate = "http://api.rentswatch.com/api/cities/search?q=" + dateValue;
            aja()
                .url(urlDate)
                .on('success', function (data) {
                    console.log(data);
                })
                .go();
        }
    };
    // Run app
    app.init();
//}());