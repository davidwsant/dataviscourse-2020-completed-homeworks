/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(forecastData, pollData) {
        this.forecastData = forecastData;
        this.tableData = [...forecastData]; // this just makes a copy of it that can be edited without destroying foreCastData
        // add useful attributes
        for (let forecast of this.tableData)
        {
            forecast.isForecast = true;
            forecast.isExpanded = false;
        }
        //console.log(this.forecastData)
        this.pollData = pollData;
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'state'
            },
            {
                sorted: false,
                ascending: false,
                key: 'margin',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'winstate_inc',
                alterFunc: d => +d
            },
        ]

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;

        this.scaleX = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, this.vizWidth]);

        this.attachSortHandlers();
        this.drawLegend();
    }

    drawLegend() {
        let legendInfo = {0: {'type': 'text', 'x': -75, 'class':'biden', 'text': '+75'}, // this.vizHeight and this.vizWidth and this.scaleX
        1: {'type': 'text', 'x': -50, 'class':'biden', 'text': '+50'},
        2: {'type': 'text', 'x': -25, 'class':'biden', 'text': '+25'},
        3: {'type': 'text', 'x': 25, 'class':'trump', 'text': '+25'},
        4: {'type': 'text', 'x': 50, 'class':'trump', 'text': '+50'},
        5: {'type': 'text', 'x': 75, 'class':'trump', 'text': '+75'}
        }
        

        let iAmLegend = d3.select('#marginAxis')
            .attr('height', this.vizHeight)
            .attr('width', this.vizWidth)

        iAmLegend.selectAll('text')
            .data(Object.values(legendInfo))
            .enter().append('text')
            .attr('x', d => this.scaleX(d.x)-12.5) // The 12.5 is the width of the '+'
            .attr('y', (this.vizHeight*3/4))
            .attr('class', d => d.class)
            .text(d => d.text)

        iAmLegend.append('line')
            .attr('x1', (this.vizWidth/2))
            .attr('x2', (this.vizWidth/2))
            .attr('y1', 0)
            .attr('y2', this.vizHeight)
            .style('stroke-width', 1)
            .style('stroke', 'black')


    }

    drawTable() {
        this.updateHeaders();
        let rowSelection = d3.select('#predictionTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr');

        rowSelection.on('click', (event, d) => 
            {
                if (d.isForecast)
                {
                    this.toggleRow(d, this.tableData.indexOf(d));
                }
            });

        let forecastSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class)

        

        let filteredForecast = forecastSelection.filter(d => d.type === 'text')
        filteredForecast.text(d => d.value) // Do not need to add 'text' element
           
            


        
        ////////////
        // PART 1 // 
        ////////////
        /**
         * with the forecastSelection you need to set the text based on the dat value as long as the type is 'text'
         */

        let vizSelection = forecastSelection.filter(d => d.type === 'viz');

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', d => d.isForecast ? this.vizHeight : this.smallVizHeight);

        let grouperSelect = svgSelect.selectAll('g')
            .data(d => [d, d, d])
            .join('g');

        this.addGridlines(grouperSelect.filter((d,i) => i === 0), [-75, -50, -25, 0, 25, 50, 75]);
        this.addRectangles(grouperSelect.filter((d,i) => i === 1));
        this.addCircles(grouperSelect.filter((d,i) => i === 2)); 
    }

    rowToCellDataTransform(d) {
        let stateInfo = {
            type: 'text',
            class: d.isForecast ? 'state-name' : 'poll-name',
            value: d.isForecast ? d.state : d.name
        };

        let marginInfo = {
            type: 'viz',
            value: {
                marginLow: +d.margin_lo,
                margin: +d.margin,
                marginHigh: +d.margin_hi,
            }
        };
        let winChance;
        if (d.isForecast)
        {
            const trumpWinChance = +d.winstate_inc;
            const bidenWinChance = +d.winstate_chal;

            const trumpWin = trumpWinChance > bidenWinChance;
            const winOddsValue = 100 * Math.max(trumpWinChance, bidenWinChance);
            let winOddsMessage = `${Math.floor(winOddsValue)} of 100`
            if (winOddsValue > 99.5 && winOddsValue !== 100)
            {
                winOddsMessage = '> ' + winOddsMessage
            }
            winChance = {
                type: 'text',
                class: trumpWin ? 'trump' : 'biden',
                value: winOddsMessage
            }
        }
        else
        {
            winChance = {type: 'text', class: '', value: ''}
        }

        let dataList = [stateInfo, marginInfo, winChance];
        for (let point of dataList)
        {
            point.isForecast = d.isForecast;
        }
        return dataList;
    }

    updateHeaders() {
        // I included this in the attachSortHandlers section 

        ////////////
        // PART 6 // 
        ////////////
        /**
         * update the column headers based on the sort state
         */

    }

    addGridlines(containerSelect, ticks) {
        containerSelect.selectAll('line')
            .data(ticks)
            .join('line')
            .attr('x1', d => this.scaleX(d))
            .attr('x2', d => this.scaleX(d))
            .attr('y1', 0)
            .attr('y2', this.vizHeight)
            .style('stroke-width', 1)
            .style('stroke', 'black')
            .style('opacity', d => {if (d === 0){
                return 1
                }
                else {
                    return 0.25
                }
            })

        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */
    
    }

    addRectangles(containerSelect) {
        
        containerSelect.selectAll('rect') 
            .data(d => {
                    {if (d.value.marginHigh*d.value.marginLow > 0) { // If one is positive and one is negative, this will return a negative number
                        return [d]
                    }
                    else{

                        let dBiden = {'value': {'marginLow': d.value.marginLow, 'marginHigh': 0}, 'isForecast': true}
                        let dTrump = {'value': {'marginLow': 0, 'marginHigh': d.value.marginHigh}, 'isForecast': true}

                        
                        return [dBiden, dTrump]
                    }}
                })
        //     .data(d => {if (d.value.marginHigh) {
        //         {if (d.value.marginHigh*d.value.marginLow > 0) { // If one is positive and one is negative, this will return a negative number
        //             return [d]
        //         }
        //         else{
        //             // let dBiden = {...d}
        //             // let dTrump = {...d}
        //             let dBiden = {'value': {'marginLow': d.value.marginLow, 'marginHigh': 0}, 'isForecast': true}
        //             let dTrump = {'value': {'marginLow': 0, 'marginHigh': d.value.marginHigh}, 'isForecast': true}
        //             //dBiden.value.marginHigh = 0
        //             //dTrump.value.marginLow = 0
        //             return [dBiden, dTrump]
        //         }}
        //     }
        // else {
        //     return [{'isForecast': false}]
        // }})
            .join('rect')

        
        //console.log(filteredContainerSelect)
        // let filteredForecast = forecastSelection.filter(d => d.type === 'text')
        // filteredForecast.text(d => d.value) // Do not need to add 'text' element


        // let filteredContainerSelect = containerSelect.selectAll('rect').filter(d => d.isForecast === true) // Now this will only add rectangles for the ones that are 'isForecast'
        // filteredContainerSelect //.selectAll('rect') //.filter(d => d.isForecast)  /// this line
        containerSelect.selectAll('rect')
            .attr('width', d => {if (isNaN(d.value.marginHigh) || isNaN(d.value.marginLow)){

                return 0
                }
                else{
                    
                    return (this.scaleX(d.value.marginHigh) - this.scaleX(d.value.marginLow))
                }
            })
            .attr('height', 25)
            .attr('y', 0)
            .attr('x', d => {if (isNaN(d.value.marginHigh)) {
                        return 0
                    }
                else {
                    return this.scaleX(d.value.marginLow)
                }
            })
            .attr('class', d => {if (d.value.marginHigh <= 0) {
                return 'biden'
                }
                else{
                    return 'trump'
                }
            })
            .attr('opacity', 0.6)
        ////////////
        // PART 4 // 
        ////////////
        /**
         * add rectangles for the bar charts
         */

 
    }

    addCircles(containerSelect) {

        containerSelect.selectAll('circle')
            .data(d => [d]) //=> Object.values(d)
            .join('circle')
            .attr('cx', d => this.scaleX(d.value.margin))
            .attr('cy', 12.5)
            .attr('r', d => d.isForecast ? 6.25 : 4) // this line 6.25
            .attr('class', d => {if (d.value.margin <= 0) {
                return 'biden margin-circle'
                }
                else{
                    return 'trump margin-circle'
                }
            })
            .attr('opacity', 1)


        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */


    }

    attachSortHandlers() 
    {
        //console.log(this.tableData)
        let sortHeaders = d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .join('th')
            .attr('id', d => 'header-'+d.key)
        
        sortHeaders.on('click', (event, d) =>
        {
            for (let entry of this.headerData){
                entry.sorted = false
            }
            d.sorted = true
            
            d.ascending = !d.ascending

            d3.select('#columnHeaders')
                .selectAll('th')
                .classed('sorting', false)
                .selectAll('i')
                    .attr('class', 'fas no-display')

            d3.select('#header-'+d.key)
                .classed('sorting', true)
                .select('i')
                    .attr('class', 'fas '+(d.ascending ? 'fa-sort-up' : 'fa-sort-down'))

            // Now sort this.tableData
            let sortData = (a,b) => {
                a = d.alterFunc ? d.alterFunc(a[d.key]) : a[d.key]
                b = d.alterFunc ? d.alterFunc(b[d.key]) : b[d.key]
                return d.ascending ? d3.ascending(a, b) : d3.descending(a,b)
            }
            
            let rowSelection = d3.select('#predictionTableBody')
                .selectAll('tr')
                .sort(sortData) 
            this.tableData = this.tableData
                .sort(sortData)
            this.collapseAll()
            this.drawTable()

        })

        
        ////////////
        // PART 7 // 
        ////////////
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */


    }


    toggleRow(rowData, index) {

        let statePolls = this.pollData.get(rowData.state) // rowData.state

        this.tableData[index].isExpanded = !this.tableData[index].isExpanded // boolean
        let insertLocation = index+1 // This automatically makes a copy, so I don't need to use ...
        if (this.tableData[index].isExpanded) {
            if (statePolls){
                for (let poll of statePolls) {
                    this.tableData.splice(insertLocation, 0, {"name" : poll.name, 
                        "state": poll.state, 
                        "margin" : poll.margin,
                        "isExpanded": true,
                        "isForecast": false})
                    insertLocation++
                }
            }
            else {
            
                console.log(rowData.state+' does not have any individual state polls logged.')
            }

        }
        else {
        
            if (!this.tableData[index].isExpanded){
                this.tableData.splice((index+1), statePolls.length)

            }
        }


        
        this.drawTable()
        
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */

    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
