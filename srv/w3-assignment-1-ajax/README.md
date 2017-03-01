# Country finder

With the country finder you can find every country in the world, where it is located and some basic knowledge is provided. You can filter by continent or just scroll down the list of all countries the choice is yours.

## Why does this application have a purpose?
You can find the countries really fast and see where they're located and on the same page you can learn some basic knowledge about the selected country all in one.

## How does it works
When you landed on the page you can filter (on continent), select or just click on a country to see more information about it. The user sees basic knowledge and a world map with the selected country pinned in the middle.

## Usage
Download the assets folder and place this in the project of your choice. Then import the modules in the your HTML file like this:

```html

<!-- YOUR HTML -->

    <script src="assets/js/routie.min.js"></script>
    <script src="assets/js/transparency.min.js"></script>
    <script src="assets/js/aja.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOURAPICODE"></script>
    <script src="assets/js/maps.config.js"></script>
    <script src="assets/js/modules/requests.js"></script>
    <script src="assets/js/modules/routers.js"></script>
    <script src="assets/js/modules/sections.js"></script>
    <script src="assets/js/modules/filters.js"></script>
    <script src="assets/js/modules/app.js"></script>
</body>
```
Note: For Google Maps you need to place an API key instead of "YOURAPICODE".

### You need some ID's to get it to work use this as example:

#### To load the response of the API Call

```html
<div id="loader"><span>Loading...</span></div>
    <div id="response">
        <!-- HTML -->
    </div>
</main>
</section>
<div id="map"></div>
```

#### If the response failed use this
```html
<section id="failed" class="hide">
    <h2>Failed to load the content, please try to load the page again.</h2>
</section>
```

#### Countries overview selector
```html
<section id="countries">
    <!-- HTML -->
</section>
```

#### Overview filter
```html
<section id="filters">
    <label class="filterLabel" for="showFilters">Show/hide filters</label>
    <input type="checkbox" class="showFilters" value="showFilters" id="showFilters" />
    <ul id="allClickButtons">
        <li>
            <input type="radio" class="regionRadio" name="regionGroup" value="all" id="all" checked />
            <label class="region" for="all">All</label>
        </li>
        <div id="filterButtons">
            <li>
                <input type="radio" class="regionRadio" name="regionGroup" />
                <label class="region"></label>
            </li>
        </div>
    </ul>
</section>
```

#### Countries dropdown select option
```html
<select id="countriesSearch">
    <option class="country" value=""></option>
</select>
```

#### List all countries on the page
```html
<div id="countriesOverview">
    <a class="country"></a>
</div>
```

#### Country singulair selector
```html
<section id="country">
    <!-- HTML -->
</section>
```

#### Country singulair information
```html
<h1 id="name"></h1>
<div id="listInfoCountry">
    <ul>
        <li><label>Alpha3Code: </label><span class="alpha3Code"></span></li>
        <li><label>Population: </label><span class="population"></span></li>
        <li><label>Surface: </label><span class="area"></span> km&#178;</li>
        <li><label>Capital city: </label><span class="capital"></span></li>
        <li><label>Continent: </label><span class="region"></span></li>
        <li><label>Main language: </label><span class="demonym"></span></li>
    </ul>
</div>
```

#### Country singulair summery
```html
<article id="summery">
    <h2>Summary:</h2>
    <div class="inner">
    </div>
</article>
```

## Flow digram
![alt text](https://github.com/TimoVerkroost/minor-web-app-from-scratch/blob/master/srv/w3-assignment-1-ajax/assets/images/flow-diagram-webapp.png "FLow diagram")

## Resources
The application is mostly build with native JavaScript only 2 micro libraries are added. beside the JavaScript, the application gets it's information from an external API.
- Aja JS: to handle the AJAX calls
    -  http://krampstudio.com/aja.js/
- TransparencyJS: to template the JSON loaded files from the AJAX call to the HTML.
    - https://github.com/leonidas/transparency
- REST Countries API: to load the country information.
    - https://restcountries.eu/
- Google Maps API: to show where the country is located
    - https://developers.google.com/maps/documentation/javascript/adding-a-google-map

## Wishlist
- Dropdown searchbar so the user doesn't have to scroll down the whole dropdown.
- Country flags.
- More detailed information about the countries.
- Load all modules in one JS file and not the HTML file.
- Make selectors in JS flexible for the user, most of them are hardcoded now

## Live demo
- https://timoverkroost.github.io/minor-web-app-from-scratch/srv/w3-assignment-1-ajax/
