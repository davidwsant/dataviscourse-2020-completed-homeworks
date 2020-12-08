/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class Map {
    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data, updateCountry) {
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
        this.encyclopedia = data.encyclopedia

    }

    /**
     * Renders the map
     * @param world the json data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        /* I have a problem with the data because some of the pieces are missing (pop)
        * for some of the countries. I am going to put this into a slightly different format */
      /* let encyclopedia = {}
       for (let [almanacName, almanacContent] of Object.entries(data)) {
           for (let country of almanacContent) {
               if (!encyclopedia.hasOwnProperty(country.geo))
                   encyclopedia[country.geo] = {}
               encyclopedia[country.geo][almanacName] = almanacContent
           }
       }*/

        let worldGeoJson = topojson.feature(world, world.objects.countries)

        let mappedInfo = worldGeoJson.features.map(item => {
            let countryRegion = null
            if (this.encyclopedia.hasOwnProperty(item.id.toLowerCase())) {
                if (this.encyclopedia[item.id.toLowerCase()].hasOwnProperty('population')) {
                    countryRegion = this.encyclopedia[item.id.toLowerCase()].population.region //* @param region the country region
                }
            }
            let countryInfo = null
            if (this.encyclopedia.hasOwnProperty(item.id.toLowerCase())) {
                countryInfo = this.encyclopedia[item.id.toLowerCase()]
            }
            return new CountryData(item.type, // @param type refers to the geoJSON type- countries are considered features
                item.id.toLowerCase(),  //this.nameArray = data.population.map(d => d.geo.toUpperCase());
                countryInfo, // * @param properties contains the value mappings for the data
                item.geometry, //* @param geometry contains array of coordinates to draw the country paths
                countryRegion
 
            )
        })

        
       /* for (entry of worldGeoJson.features) {
            let newCountryData = new CountryData(entry.type, entry.id, {}, entries.geometry, '')
            countryDataArray.push(newCountryData)
        }

        let worldGeoJson = topojson.feature(world, world.objects.countries)
        console.log(worldGeoJson)
        /*for (entry of worldGeoJson.features) {
            entry.countryData = CountryData()
        }*/
        let svgParent = d3.select("#map-chart")
        let svg = svgParent.select('svg')
        if (svg.empty()) {
            svg = svgParent.append('svg')
            .attr("width", "100%")
            .attr("height", "100%")
        }
        let makePath = d3.geoPath()
            .projection(this.projection) 
            /* this is a function that will give you the correct value of the
            * 'd' attribute for a specific country
            * It combines the coordinates of the shape of the country with the projection
            * to get pixel coordinates and then combines them into a string that can
            * be passed into the 'd' attribute */

        let pathCountries = svg.selectAll('path')
            .data(mappedInfo)
            .enter().append('path')
            .attr('id', d => d.id)
            .attr('d', makePath)
            .attr('class', d => d.region)
            .classed('boundary', true)
            .classed('countries', true)

        pathCountries.on('click', d => {
            this.updateCountry(d.id)
        }) 

        let graticule = d3.geoGraticule();
        svg.append('path').datum(graticule)
            .attr("class", "graticule")
            .attr('d', makePath)
        svg.append('path').datum(graticule.outline)
            .attr("class", "stroke")
            .attr('d', makePath)




        


            
        //note that projection is global!

        // ******* TODO: PART I *******

        // Draw the background (country outlines; hint: use #map-chart)
        // Make sure to add a graticule (gridlines) and an outline to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        // You need to match the country with the region. This can be done using .map()
        // We have provided a class structure for the data called CountryData that you should assign the paramters to in your mapping

        //TODO - your code goes here
    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        this.clearHighlight()
        if (activeCountry){
            d3.select('#'+activeCountry) // these ones are lower case
                .classed('selected-country', true)
        }
        
        // ******* TODO: PART 3 *******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.

        //TODO - your code goes here

    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        d3.select('#map-chart .selected-country').classed('selected-country', false)
        // ******* TODO: PART 3 *******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //TODO - your code goes here
    }
}
