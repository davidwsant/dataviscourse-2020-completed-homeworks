/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data 
        //this.encyclopedia = this.data.encyclopedia 

        //TODO - your code goes here -

    }
    

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     * constructor(country, region, indicator_name, value)
     */

    updateTextDescription(activeCountry, activeYear) {
        
        if (!activeCountry) {
            this.clearHighlight()
            /*clearHighlight()
            d3.select('#country-detail').selectAll('div')
            .remove()*/
            //d3.select('#country-detail').selectAll('div').remove()//
            return
        }
        let infoBoxArray = Object.values(this.data.encyclopedia[activeCountry]).map(item =>
            new InfoBoxData(
                item.country,
                item.region || null,
                item.indicator_name || null,
                item[activeYear]
            )
        )
        //console.log('Inside updateTextDescription function')
        //console.log(this.data.encyclopedia)
        let countryNameDiv = d3.select('#country-detail')
            .append('div')
            .attr('class', 'label')
            
        let countryColorVariable = this.data.encyclopedia[activeCountry].population ? this.data.encyclopedia[activeCountry].population.region : ''
        countryNameDiv.append('i')
            .attr('class', 'fa fa-globe '+ countryColorVariable)
            

        countryNameDiv.append('span').text(' '+infoBoxArray[0].country)
        
        //let countryNameDiv = d3.select('#country-detail').append('div')
        //countryNameDiv.text(infoBoxArray[0].country)
        //let countryRegionDiv = d3.select('#country-detail').append('div')
        //countryRegionDiv.text(infoBoxArray[0].country)
        let countryInfoDivs = d3.select('#country-detail')
            .append('div')
            
            .selectAll('div').data(infoBoxArray)
        countryInfoDivs.enter().append('div')
            .text(d => d.indicator_name+': '+d.value)
        
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */
       

        //TODO - your code goes here -
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {
        d3.select('#country-detail').selectAll('div').remove()
        
        //TODO - your code goes here -
    }

}