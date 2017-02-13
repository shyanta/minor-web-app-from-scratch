/***
 * cmdaan.js
 *   Bevat functies voor CMDAan stijl geolocatie welke uitgelegd
 *   zijn tijdens het techniek college in week 5.
 *
 *   Author: J.P. Sturkenboom <j.p.sturkenboom@hva.nl>
 *   Credit: Dive into html5, geo.js, Nicholas C. Zakas
 *
 *   Copyleft 2012, all wrongs reversed.
 */

// IIFE wrap
(function(){
    // Event functies - bron: http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/ Copyright (c) 2010 Nicholas C. Zakas. All rights reserved. MIT License
    function EventTarget(){ this.listenersEvent={} }

    EventTarget.prototype = {
        constructor: EventTarget,
        addListener: function(a, c) {
            "undefined" == typeof this.listenersEvent[a] && (this.listenersEvent[a] = []);
            this.listenersEvent[a].push(c)
        },
        fire: function(a) {
            var c;

            "string" == typeof a && (a = {
                type: a
            });
            a.target || (a.target = this);
            if (!a.type) throw Error("Event object missing 'type' property.");
            if (this.listenersEvent[a.type] instanceof Array)
                for (c = this.listenersEvent[a.type], b = 0, d = c.length; b < d; b++) c[b].call(this, a)
        },
        removeListener: function(a, c) {
            var b;

            if (this.listenersEvent[a] instanceof Array)
                for ( b =
                          this.listenersEvent[a], d = 0, e = b.length; d < e; d++)
                    if (b[d] === c) {
                        b.splice(d, 1);
                        break
                    }
        }
    };
    var ET = new EventTarget();
    var currentPosition = currentPositionMarker = customDebugging = debugId = map = interval = intervalCounter = updateMap = false;
        // Start een interval welke op basis van refreshRate de positie updated

    var moduleLocation = {
            sandbox: "SANDBOX",
            positionUpdated: "POSITION_UPDATED",
            refreshRate: 1000,
            gpsAvailable: "GPS_AVAILABLE",
            gpsUnavailable: "GPS_UNAVAILABLE",
            pos1: new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude),
            pos2: new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude),
            locatie: {coords:{latitude: locaties[i][3],longitude: locaties[i][4]}},
            startInterval: function () {
                this.debugMessage("GPS is beschikbaar, vraag positie.");
                interval = self.setInterval(this.updatePosition, this.refreshRate);
                ET.addListener(this.positionUpdated,this.checkLocations);
            },
            gpsInit: function () {
                this.debugMessage("Controleer of GPS beschikbaar is...");
                ET.addListener(this.gpsAvailable, this.startInterval);
                ET.addListener(this.gpsUnavailable, function(){
                    this.debugMessage("GPS is niet beschikbaar.")
                });
                (geo_position_js.init())?ET.fire(this.gpsAvailable):ET.fire(this.gpsUnavailable);
            },
            updatePosition: function () {
                intervalCounter++;
                geo_position_js.getCurrentPosition(this.setPosition(), this.geoErrorHandler, {enableHighAccuracy:true});
            },
            setPosition: function (position) {
                currentPosition = position;
                ET.fire("POSITION_UPDATED");
                this.debugMessage(intervalCounter+" positie lat:"+position.coords.latitude+" long:"+position.coords.longitude);
            },
            calculateDistance: function (p1, p2) {
                return Math.round(google.maps.geometry.spherical.computeDistanceBetween(this.pos1, this.pos2), 0);
            },
            checkLocations: function (event) {
                var i;
                for (i = 0; i < locaties.length; i++) {
                    if(this.calculateDistance(this.locatie, currentPosition)<locaties[i][2]){

                        // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
                        if(window.location!=locaties[i][1] && localStorage[locaties[i][0]]=="false"){
                            // Probeer local storage, als die bestaat incrementeer de locatie
                            try {
                                (localStorage[locaties[i][0]]=="false")?localStorage[locaties[i][0]]=1:localStorage[locaties[i][0]]++;
                            } catch(error) {
                                this.debugMessage("Localstorage kan niet aangesproken worden: "+error);
                            }

                            // Animeer de betreffende marker

                            window.location = locaties[i][1];
                            this.debugMessage("Speler is binnen een straal van "+ locaties[i][2] +" meter van "+locaties[i][0]);
                        }
                    }
                }
            },
            geoErrorHandler: function (code, message) {
                this.debugMessage("geo.js error "+code+": "+message);
            },
            debugMessage: function (message) {
                (customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
            },
            setCustomDebugging: function (debugId) {
                debugId = this.debugId;
                customDebugging = true;
            }

        };

    moduleLocation.startInterval();
    moduleLocation.gpsInit();
    moduleLocation.updatePosition();
    moduleLocation.setPosition();
    moduleLocation.calculateDistance();
    moduleLocation.checkLocations();
    moduleLocation.geoErrorHandler();
    moduleLocation.debugMessage();
    moduleLocation.setCustomDebugging();

        // GOOGLE MAPS FUNCTIES
        /**
         * generate_map(myOptions, canvasId)
         *  roept op basis van meegegeven opties de google maps API aan
         *  om een kaart te genereren en plaatst deze in het HTML element
         *  wat aangeduid wordt door het meegegeven id.
         *
         *  @param myOptions:object - een object met in te stellen opties
         *      voor de aanroep van de google maps API, kijk voor een over-
         *      zicht van mogelijke opties op http://
         *  @param canvasID:string - het id van het HTML element waar de
         *      kaart in ge-rendered moet worden, <div> of <canvas>
         */
        var moduleGmaps = {
            generateMap: function (myOptions, canvasId) {
                var lineair = "LINEAIR";
                var markerRij = [];
                var routeList = [];
                var i;
                var markerLatLng;
                var attr;
                var marker;

                this.debugMessage("Genereer een Google Maps kaart en toon deze in #"+canvasId)
                map = new google.maps.Map(document.getElementById(canvasId), myOptions);

                // Voeg de markers toe aan de map afhankelijk van het tourtype
                this.debugMessage("Locaties intekenen, tourtype is: "+tourType);
                for ( i = 0; i < locaties.length; i++) {

                    // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
                    try {
                        (localStorage.visited==undefined||isNumber(localStorage.visited))?localStorage[locaties[i][0]]=false:null;
                    } catch (error) {
                        this.debugMessage("Localstorage kan niet aangesproken worden: "+error);
                    }

                    markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
                    routeList.push(markerLatLng);

                    markerRij[i] = {};
                    for (attr in locatieMarker) {
                        markerRij[i][attr] = locatieMarker[attr];
                    }
                    markerRij[i].scale = locaties[i][2]/3;

                    marker = new google.maps.Marker({
                        position: markerLatLng,
                        map: map,
                        icon: markerRij[i],
                        title: locaties[i][0]
                    });
                }
                // Kleur aanpassen op het huidige punt van de tour
                if(tourType == lineair){
                    // Trek lijnen tussen de punten
                    this.debugMessage("Route intekenen");
                    var route = new google.maps.Polyline({
                        clickable: false,
                        map: map,
                        path: routeList,
                        strokeColor: "Black",
                        strokeOpacity: 0.6,
                        strokeWeight: 3
                    });

                }
                // Voeg de locatie van de persoon door
                currentPositionMarker = new google.maps.Marker({
                    position: kaartOpties.center,
                    map: map,
                    icon: positieMarker,
                    title: "U bevindt zich hier"
                });

                ET.addListener(positionUpdated, update_positie);
            },
            isNumber: function (n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            },
            update_positie: function (event) {
                // use currentPosition to center the map
                var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
                map.setCenter(newPos);
                currentPositionMarker.setPosition(newPos);
            },
            debugMessage: function (message) {
                (customDebugging && debugId)?document.getElementById(debugId).innerHTML:console.log(message);
            }
        };
    moduleGmaps.generateMap();
    moduleGmaps.isNumber();
    moduleGmaps.update_positie();
    moduleGmaps.debugMessage();
}());