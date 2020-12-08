loadData().then(data => {

    // no country selected by default
    this.activeCountry = null;
    // deafult activeYear is 2000
    this.activeYear = '2000';
    // Set some defaults so that it loads on page load.
    // I did not like using all population, so I changed the X and Y axes
    /*this.xIndicator = 'child-mortality';
    this.yIndicator = 'gdp';
    this.circleSizeIndicator = 'population'; */
    let that = this;

    //console.log(data)


    // ******* TODO: PART 3 *******
    /**
     * Calls the functions of the views that need to react to a newly selected/highlighted country
     *
     * @param countryID the ID object for the newly selected country
     */
    
    function updateCountry(countryID) {
        that.activeCountry = countryID;
        that.gapPlot.updateHighlightClick(that.activeCountry)
        that.worldMap.updateHighlightClick(that.activeCountry)
        that.infoBox.updateTextDescription(that.activeCountry, that.activeYear)

        //console.log(countryID)

        // TODO - your code goes here
    }

    // ******* TODO: PART 3 *******

    /**
     *  Takes the specified activeYear from the range slider in the GapPlot view.
     *  It takes the value for the activeYear as the parameter. When the range slider is dragged, we have to update the
     *  gap plot and the info box.
     *  @param year the new year we need to set to the other views
     */
    function updateYear(year) {
        /* 
        * I am going to make it run the updatePlot function, but only add the year info if nothing is present.
        * That way I can have defaults in the updatePlot function
        */
        that.infoBox.clearHighlight()
        if (!this.xIndicator) {
            //console.log('xIndicator is not present')
            that.gapPlot.updatePlot(year)
        }
        else {
            //console.log('xIndicator is present')
            that.gapPlot.updatePlot(year, this.xIndicator, this.yIndicator, this.circleSizeIndicator)
        }
        that.infoBox.updateTextDescription(that.activeCountry, year)

        //TODO - your code goes here -

    }
    // Creates the view objects
    let encyclopedia = {}
    for (let [dataEntry, dataContent] of Object.entries(data)) {
        for (let countryData of dataContent) {
            if (!encyclopedia.hasOwnProperty(countryData.geo))
                encyclopedia[countryData.geo] = {}
            encyclopedia[countryData.geo][dataEntry] = countryData
        }
    }
    data.encyclopedia = encyclopedia
    //console.log(data)
    //console.log(data.encyclopedia)

    const infoBox = new InfoBox(data);
    const worldMap = new Map(data, updateCountry);
    const gapPlot = new GapPlot(data, updateCountry, updateYear, this.activeYear);

    this.gapPlot = gapPlot
    this.worldMap = worldMap
    this.infoBox = infoBox
    

    // Initialize gapPlot here.
    //TODO - your code goes here -

    gapPlot.drawPlot()

    //console.log('this line ran')
    if (this.xIndicator) {
        //console.log('xIndicator was present')
        gapPlot.updatePlot(this.activeYear, this.xIndicator, this.yIndicator, this.circleSizeIndicator)
        //gapPlot.updatePlot(this.activeYear, xIndicator, yIndicator, circleSizeIndicator) 
    }
    else {
        //console.log('Xindicator was not present')
        gapPlot.updatePlot(this.activeYear)
        //gapPlot.updatePlot(this.activeYear, xIndicator, yIndicator, circleSizeIndicator)
        
    }
    //gapPlot.updatePlot(this.activeYear) 
    /*, 
        xIndicator, 
        yIndicator,
        circleSizeIndicator)*/


    
    /*Unfortunately, not all of them have population data, therefore they don't have region data either */

    // here we load the map data
    d3.json('data/world.json').then(mapData => {
        
        worldMap.drawMap(mapData)
        //worldMap.drawMap.bind(this)(mapData) // This will allow me to access the encyclopedia inside the mapData function


        // ******* TODO: PART I *******

        // You need to pass the world topo data to the drawMap() function as a parameter, along with the starting activeYear.
        //TODO - your code goes here -



    });

    // This clears a selection by listening for a click
    document.addEventListener("click", function (e) {
        updateCountry(null);
    }, true);
});

// ******* DATA LOADING *******
// We took care of that for you

/**
 * A file loading function or CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file) {
    let data = await d3.csv(file).then(d => { // the d3.csv reads in the csv file and returns it as an array of dictionaries. Requires a header line in the csv
        let mapped = d.map(g => { 
            // If you call the `map` function, it will take an array and constructs a new array where 
            // each item is a result of a function of an item in the old array
            for (let key in g) { //recommended to use for(let key of Object.keys(g)) // this seems easier than the for-in syntax
                let numKey = +key;
                /* each item is a row, but each item is a dictionary */
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}

async function loadData() {
    let pop = await loadFile('data/pop.csv');
    let gdp = await loadFile('data/gdppc.csv');
    let tfr = await loadFile('data/tfr.csv');
    let cmu = await loadFile('data/cmu5.csv');
    let life = await loadFile('data/life_expect.csv');

    return {
        'population': pop,
        'gdp': gdp,
        'child-mortality': cmu,
        'life-expectancy': life,
        'fertility-rate': tfr
    };
}
