// Routers we can access within the app
var routers = (function () {
    var mapsContainer = document.getElementById("map");
    return {
        // Listen loads when data from API is successfully loaded
        listen: function () {
            // Routers
            routie({
                "countries": function() {
                    // Hide Google Maps on overview
                    mapsContainer.classList.add("hide");
                    mapsContainer.classList.remove("show");
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
                    mapsContainer.classList.add("show");
                    mapsContainer.classList.remove("hide");
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
            mapsContainer.classList.add("hide");
            mapsContainer.classList.remove("show");
            // Show failed content
            document.getElementById("failed").classList.add("show");
            document.getElementById("failed").classList.remove("hide");
        }
    };

})();