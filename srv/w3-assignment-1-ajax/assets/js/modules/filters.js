var filterRegion = (function () {
    var regions,
        regionArray,
        regionOutput,
        i,
        filterButtons,
        filteredRegion,
        countryDropdown,
        option,
        defaultSelected;
    return {
        // Filter buttons for regions aka continents
        buttons: function () {
            // Map data to get only the region name
            regions = dataStore.map(function(objectItem) {
                return { region: objectItem.region };
            });
            // Filter all regions so we don't have any duplicated one's
            regionArray = [], regionOutput = [], l = regions.length, i;
            for( i=0; i<l; i++) {
                if( regionArray[regions[i].region]) continue;
                regionArray[regions[i].region] = true;
                // Do not add empty values
                if(regions[i].region != "") {
                    regionOutput.push(regions[i].region);
                }
            }
            // Render regions for filter
            filterButtons = {
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
            countryDropdown = document.getElementById("countriesSearch");
            // Create default option
            option = document.createElement("option");
            option.text = "Select a country..";
            // Set ID
            option.setAttribute("id", "defaultSelected");
            // Set as selected item
            option.setAttribute("selected", "selected");
            // Set as disabled so it can't be selected by the user
            option.setAttribute("disabled", "disabled");
            // add Default selected item to dropdown only when not exist
            defaultSelected =  document.getElementById("defaultSelected");
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

})();