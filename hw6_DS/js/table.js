let tableMargin = {top: 20, right: 10, bottom: 20, left: 10}
let tableTotalWidth = 466
let figureWidth = tableTotalWidth-tableMargin.left-tableMargin.right
let gapPercent = 0.06*figureWidth
let remainingWidth = figureWidth-(4*gapPercent)

let phraseWidth = remainingWidth*0.20 // 20%
let frequencyWidth = remainingWidth*0.30 // 40%
let percentWidth = remainingWidth*0.40 // 30%
let totalsWidth = remainingWidth*0.10 // 10%

//console.log('table.js is being read in')

// let tableWidth = totalTableWidth - margin.left - margin.right 
// let totalTableHeight = 1000
// let tableHeight = totalTableHeight - margin.top - margin.bottom 

let tableDrawnYet = false
function generateTable(wordsObject) { 
    
    
    d3.select('#predictionTableHead')
        .append('tr')
        .attr('id', 'columnHeaders')

    let scaleFrequency = d3.scaleLinear()
        .domain([0,1])
        .range([0, frequencyWidth])

    let scalePercentages = d3.scaleLinear()
        .domain([0,100])
        .range([0, (percentWidth/2)]) 
        // I am going to have to subtract 1 from each rectangle width and then shift them over 1 to make that white space

    function getRectWidth(inputWidth) {
        let scaledWidth = scalePercentages(inputWidth)
        if (scaledWidth > 0) {
            return (scaledWidth -1)
        }
        else {
            return 0
        }
    }

    let scalePercentageAxis = d3.scaleLinear()
        .domain([-100,100])
        .range([0, percentWidth])

    let columnHeaders = d3.select('#columnHeaders')

    if (!tableDrawnYet) {
        columnHeaders.append('th')
            .attr('id', 'phraseHeader')
            .attr('width', phraseWidth)
            .text('Phrase')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .append('i')
                .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'frequencyHeader')
            .attr('width', frequencyWidth)
            .text('Frequency')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
                .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'percentageHeader')
            .attr('width', percentWidth)
            .text('Percentages')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'center')
            .append('i')
                .attr('class', 'fas no-display')

        columnHeaders.append('th')
            .attr('id', 'totalHeader')
            .attr('width', totalsWidth)
            .text('Total')
            .attr('class', 'sortable')
            .style('padding-right', gapPercent+'px')
            .style('text-align', 'right')
            .append('i')
                .attr('class', 'fas no-display')

        d3.select('#predictionTableHead')
            .append('tr')
            .attr('id', 'columnAxisLines')

        //////////
        let columnAxisLines = d3.select('#columnAxisLines')
        columnAxisLines.append('th')
            .attr('width', phraseWidth)
            //.style('padding-right', gapPercent+'px')

        columnAxisLines.append('th')
            .attr('width', frequencyWidth)
            //.style('padding-right', 0.5*gapPercent+'px') // no padding here
            .append('svg')
            .attr('width', frequencyWidth+1*gapPercent)
            .attr('height', 30)
            .append('g')
            .attr('id', 'ticksFrequency')
            
            
        let frequencyTickLines = d3.axisTop(scaleFrequency).ticks(3) //.tickFormat(d => Math.abs(d)) // Make them absolute values
        let selectedFrequencyTicks = d3.select("#ticksFrequency").call(frequencyTickLines)
            .style("font-size", "12px")
            //.style('font-weight', 'bold')
            .attr("transform", "translate("+0.5*gapPercent+",30)") // I did not add the gapPercent to the padding, so this flows over into the padding.
            // Translate to make sure it stays within the correct space. 
            
        selectedFrequencyTicks.select(".domain").attr("stroke-width", "0") // Get rid of the bottom line
        selectedFrequencyTicks.selectAll(".tick").attr("stroke-width", "2") // Make the tick marks a little wider
        
        columnAxisLines.append('th') // needs axis -100 to 100
            .attr('width', percentWidth)
            //.style('padding-right', gapPercent+'px')
            .append('svg')
            .attr('width', percentWidth+gapPercent)
            .attr('height', 30)
            .append('g')
            .attr('id', 'ticksPercent')

        let percentTickLines = d3.axisTop(scalePercentageAxis).ticks(5)
        let selectedPercentTicks = d3.select("#ticksPercent").call(percentTickLines)
            .style("font-size", "12px")
            //.style('font-weight', 'bold')
            .attr("transform", "translate("+0.5*gapPercent+",30)")

        selectedPercentTicks.select(".domain").attr("stroke-width", "0") // Get rid of the bottom line
        selectedPercentTicks.selectAll(".tick").attr("stroke-width", "2") // Make the tick marks a little wider
        //console.log(wordsObject)
        tableDrawnYet = true

    }

    
        
    
    let tableData = d3.select('#predictionTableBody')
        .selectAll('tr')
        .data(wordsObject)
        
     
    tableData.exit().remove()
    //console.log('The draw table function is being called')

    tableData.style('display', d => d.display ? '' : 'none')
        
    let individualTableRow = tableData
        .enter().append('tr')
    


    let phraseElements = individualTableRow
        .append('td')
        .attr('width', phraseWidth)
        .text(d => d['phrase'])
        .style('vertical-align', 'middle')
        .style('font-size', '14px')

    let frequencyElements = individualTableRow
        .append('td')
        .attr('width', frequencyWidth)
        .append('svg')
            .attr('height', '20')
            .attr('width', frequencyWidth+gapPercent)
            .append('rect')
                .attr('transform', 'translate('+0.5*gapPercent+', 0)')
                .attr('width', d => scaleFrequency(d['frequency']))
                .attr('height', 20)
                .attr('class', d => determineCategory(d['category']))

    let pergentageElements = individualTableRow
        .append('td')
        .attr('width', percentWidth)

    let pergentageSVG = pergentageElements
        .append('svg')
        .attr('height', '20')
        .attr('width', percentWidth+gapPercent)

    pergentageSVG.append('rect')
        .attr('transform', 'translate('+(0.5*gapPercent+0.5*percentWidth-1)+', 0) scale(-1, 1) ')
        .attr('width', d => getRectWidth(d['percent_of_d_speeches']))
        .attr('height', 20)
        .attr('class', 'left')
        .attr('opacity', '0.6')

    pergentageSVG.append('rect')
        .attr('transform', 'translate('+(0.5*gapPercent+0.5*percentWidth+1)+', 0)')
        .attr('width', d => getRectWidth(d['percent_of_r_speeches']))
        .attr('height', 20)
        .attr('class', 'right')
        .attr('opacity', '0.6')

    let totalsElements = individualTableRow
        .append('td')
        .attr('width', totalsWidth)
        .style('padding-right', gapPercent+'px')
        .text(d => d['total'])
        .style('vertical-align', 'middle')
        .style('font-size', '16px')
        .style('text-align', 'right')
   

}
headerData = [
    {
        sorted: false,
        ascending: false,
        key: 'phrase'
    },
    {
        sorted: false,
        ascending: false,
        key: 'frequency',
        alterFunc: d => +d
    },
    {
        sorted: false,
        ascending: false,
        key: 'percentage',
        //alterFunc: d => d['difference']
    },
    {
        sorted: false,
        ascending: false,
        key: 'total',
        alterFunc: d => +d

    }
]

function attachSortHandlers() {
    let sortHeaders = d3.select('#columnHeaders')
            .selectAll('th')
            .data(headerData)


    sortHeaders.on('click', (d, i, nodeList) => {
        //console.log(d)
        for (let entry of headerData){
            entry.sorted = false
        }
        d.sorted = true
        
        d.ascending = !d.ascending

        d3.select('#columnHeaders')
            .selectAll('th')
            .classed('sorting', false)
            .selectAll('i')
                .attr('class', 'fas no-display')

        d3.select('#'+d.key+'Header')
            .classed('sorting', true)
            .select('i')
                .attr('class', 'fas '+(d.ascending ? 'fa-sort-up' : 'fa-sort-down'))

        // Now I need to sort the table data
        let sortData = (a,b) => {
            a = d.alterFunc ? d.alterFunc(a[d.key]) : a[d.key]
            b = d.alterFunc ? d.alterFunc(b[d.key]) : b[d.key]
            return d.ascending ? d3.ascending(a, b) : d3.descending(a,b)
        }

        let rowSelection = d3.select('#predictionTableBody')
                .selectAll('tr')
                .sort(sortData) 
        wordsObject = wordsObject.sort(sortData)
    })

    
}


// columnHeaders.append('th')
// .attr('id', 'phraseHeader')
// .attr('width', phraseWidth)
// .text('Phrase')
// .style('padding-right', gapPercent+'px')

// columnHeaders.append('th')
// .attr('id', 'frequencyHeader')
// .attr('width', frequencyWidth)
// .text('Frequency')
// .style('padding-right', gapPercent+'px')
// .style('text-align', 'center')

// columnHeaders.append('th')
// .attr('id', 'percentageHeader')
// .attr('width', percentWidth)
// .text('Percentages')
// .style('padding-right', gapPercent+'px')
// .style('text-align', 'center')

// columnHeaders.append('th')
// .attr('id', 'totalsHeader')
// .attr('width', totalsWidth)
// .text('Total')
// .style('padding-right', gapPercent+'px')
// .style('text-align', 'right')