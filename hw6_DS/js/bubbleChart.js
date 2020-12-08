
let categoryNames = [
    'economy',
    'energy',
    'crime',
    'education',
    'health care',
    'mental',
]

let totalWidth = 1400
let totalChartWidth = totalWidth*2/3
let margin = {top: 30, right: 20, bottom: 20, left: 20}
let textTop = 40
let axisWidth = 15
let chartWidth = totalChartWidth - margin.left - margin.right 
let totalChartHeight = 1200
let chartHeight = totalChartHeight - margin.top - margin.bottom - textTop
let individualChartHeight = 130

let textBoxWidth = 400
let textBoxHeight = 90

let isButtonClicked = false



function determineCategoryIndex(category) {
    for (let [categoryIndex, categoryName] of categoryNames.entries()) {
        if (category.includes(categoryName))
            return categoryIndex
    }
    return -1
}

function determineY(d) {
    return ( determineCategoryIndex(d['category']) * individualChartHeight+65+d['sourceY'] )
}

function determineCategory(category) {
    for (let categoryName of categoryNames) {
        if (category.includes(categoryName))
            return categoryName
    }
    return 'testing'
}

let brushes = []
let brushGroups = []
let arraysCompleted = false
function generateBubbleSwarm(wordsObject) { 
    for (let entry of wordsObject) {
        entry['display'] = true
        entry['d_speeches'] = +entry['d_speeches']
        entry['r_speeches'] = +entry['r_speeches']
        entry['frequency'] = (entry['d_speeches'] + entry['r_speeches'])/50
        entry['percent_of_d_speeches'] = +entry['percent_of_d_speeches']
        entry['percent_of_r_speeches'] = +entry['percent_of_r_speeches']
        entry['percentage'] = Math.abs(entry['percent_of_r_speeches'] - entry['percent_of_d_speeches']) // Name the difference 'percentage' for sorting purposes
    }
    //console.log(wordsObject)

    let bubbleSwarmGroup = d3.select('#bubble-swarm')
        .append('svg')
        .attr('width', totalChartWidth)
        .attr('height', totalChartHeight)

    bubbleSwarmGroup.append('text')
        .text('Democratic Leaning')
        .attr('text-anchor', 'start')
        .attr('class', 'primaryLabel')
        .attr('x', margin.left)
        .attr('y', margin.top)
    bubbleSwarmGroup.append('text')
        .text('Republican Leaning')
        .attr('text-anchor', 'end') // didn't work 
        .attr('class', 'primaryLabel')
        .attr('x', chartWidth+margin.right)
        .attr('y', margin.top)


    let scaleForceToPercent = d3.scaleLinear()
        .domain([d3.min(wordsObject.map(d => d['sourceX'])), d3.max(wordsObject.map(d => d['sourceX']))])
        .range([d3.min(wordsObject.map(d => d['position'])), d3.max(wordsObject.map(d => d['position']))])
    
    let fixedMin = scaleForceToPercent(d3.min(wordsObject.map(d => d['sourceX'])))
    let fixedMax = scaleForceToPercent(d3.max(wordsObject.map(d => d['sourceX'])))

    // Try a linear regression instead
    // This made the middle line even further from the center than Alex's picture.
    // 
    //linearRegression = f(wordsObject)
    // let linearRegression = d3.regressionLinear()
    //     .x(d => d['position'])
    //     .y(d => d['sourceX'])

    // linearRegression = linearRegression(wordsObject) //.predict
    // console.log(linearRegression)

    // let scaleXAxis = d3.scaleLinear()
    //     .domain([linearRegression[0][0], linearRegression[1][0]])
    //     .range([linearRegression[0][1], linearRegression[1][1]])
    
    let scaleXAxis = d3.scaleLinear()
        //.domain([scaleForceToPercent(d3.min(wordsObject.map(d => d['sourceX'])), scaleForceToPercent(d3.max(wordsObject.map(d => d['sourceX']))))])
        //.domain([d3.min(wordsObject.map(d => d['position'])), d3.max(wordsObject.map(d => d['position']))])
        .domain([fixedMin, fixedMax])
        .range([10, (chartWidth - 10)])

    let scaleX = d3.scaleLinear()
        .domain([d3.min(wordsObject.map(d => d['sourceX'])), d3.max(wordsObject.map(d => d['sourceX']))])
        .range([10, (chartWidth - 10)])

    let scaleCircle = d3.scaleSqrt()
        .domain([d3.min(wordsObject.map(d => +d['total'])), d3.max(wordsObject.map(d => +d['total']))])
        .range([2.5, 12]) // I have chosen circles to have a radius between 2 and 10 pizels for now. 
        // changed radius to 2.5&12 
    bubbleSwarmGroup.append('g')
        .attr('id', 'bubbleAxis')
        .attr("transform", "translate("+(margin.left)+","+(margin.top+textTop)+")")

    let bubbleAxisLines = d3.axisTop(scaleXAxis).ticks(11).tickFormat(d => Math.abs(d)) // Make them absolute values
    let selectedAxis = d3.select("#bubbleAxis").call(bubbleAxisLines)
        .style("font-size", "12px")
        .style('font-weight', 'bold')
        
    selectedAxis.select(".domain").attr("stroke-width", "0") // Get rid of the bottom line
    selectedAxis.selectAll(".tick").attr("stroke-width", "2") // Make the tick marks a little wider
    
    let firstBubblePlot = bubbleSwarmGroup.append('g')
        .attr('id', 'firstPlot')
        .attr("transform", "translate("+(margin.left)+","+(margin.top+textTop+axisWidth)+")")

    

/////////////////////////////
    let textElementInfo = ['Economical/Fiscal', 'Energy/Environmental', 'Crime and Justice', 'Education', 'Health Care', 'Mental Health/Substance Abuse']
    let textElements = firstBubblePlot.selectAll('text')
        .data(textElementInfo)
        .join('text')

    textElements
        .attr("transform", (d, i) => "translate("+(margin.left/4)+","+(i*individualChartHeight+10)+")")
        .text(d => d)
        .attr('opacity', 0)
        .style('font-size', '18')



    for (let i = 0; i < (categoryNames.length); i++) {
        let brushGroup = firstBubblePlot.append('g').classed('brush', true)
    
        let brush = d3.brushX()
            .extent(i === 0 ? [ [0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]] : [[0,0], [0,0]])
            .on('start', () => {
                let iArray = [0,1,2,3,4,5]
                iArray.splice(i, 1)
                //console.log('Brushing started: '+i)
                for (let j of iArray) {
                    brushGroups[j].call(d3.brush().move, [[0,(j*individualChartHeight)],[0,(j*individualChartHeight)]])
                }
                
            })
            .on('end', function () {
                let selection = d3.brushSelection(this)
                if (!selection) {
                    for (let entry of wordsObject) {
                        entry['display'] = true
                    }
                    generateTable(wordsObject)
                    return
                }//let xLeft = scaleX
                for (let entry of wordsObject) {
                    entry['display'] = false
                }

                let [leftPixels, rightPixels] = selection
                let leftX = scaleX.invert(leftPixels)
                let rightX = scaleX.invert(rightPixels)
                
                // First determine if we need to use all categories, or just one
                if (isButtonClicked) {
                    // Include only one category
                    
                    for (let entry of wordsObject) {
                        if (entry['category'].includes(categoryNames[i]) && entry['sourceX'] > leftX && entry['sourceX'] < rightX) {
                            entry['display'] = true
                        }
                    }
                    
                }
                else {
                    for (let entry of wordsObject) {
                        if (entry['sourceX'] > leftX && entry['sourceX'] < rightX) {
                            entry['display'] = true
                        }
                    }
                }
                generateTable(wordsObject)


            })
        brushGroup.call(brush)
        if (!arraysCompleted) {
            brushes.push(brush)
            brushGroups.push(brushGroup)
        }
        if (i === (categoryNames.length)){
            //console.log(brushes)
            arraysCompleted = true

        }
        

    }

////////////////////////////////

    firstBubblePlot.append('line') ///// This one calls the function
        .attr('id', 'centerLine')
        .attr('x1', scaleXAxis(0))
        .attr('x2', scaleXAxis(0))
        .attr('y1', 0)
        .attr('y2', individualChartHeight )
        .style('stroke-width', 1)
        .style('stroke', 'black')

    

    firstBubblePlot.selectAll('circle')
        .data(wordsObject)
        .join('circle')
        .attr('id', d => 'circle_'+d['phrase'].replaceAll(' ', '_'))
        .attr('cx', d => scaleX(d['sourceX']))
        .attr('cy', d => d['sourceY'] +65) // The highest Y value + the radius would make +65, and these must all be negative
        .attr('r', d => scaleCircle(+d['total']))
        .attr('class', d => determineCategory(d['category']))
        .attr('opacity', 0.75)
        .attr('stroke', 'black')
        .on('mouseover', (d, i, nodeList) => {
            nodeList[i].setAttribute('stroke-width', '3')
            let currentY = (d['sourceY'] +65)
            if (isButtonClicked) {
                currentY =  determineY(d)
            }
            let currentX = (scaleX(d['sourceX']) + 10)
            if (d['sourceX'] > scaleXAxis(0)) {
                currentX = (scaleX(d['sourceX']) - (textBoxWidth+10))
            }
                    
            d3.select('#infoBoxRect')
                .attr('transform', 'translate('+currentX+', ' + currentY + ') scale(1, 1)')

            d3.select('#infoBoxRect rect')
                .attr('fill', 'white')
                .attr('opacity', 0.75)

            d3.select('#speechTitle')
                .text(d['phrase']) //'This is TITLE!'
                
            d3.select('#speechBalance')
                .text(d['position'] >= 0 ? "R+ "+d['position'].toFixed(2)+'%' : "D+ "+Math.abs(d['position']).toFixed(2)+'%') //'Which side is more frequent'
                
            d['d_speeches'] = +d['d_speeches']
            d['r_speeches'] = +d['r_speeches']
            let percentOfSpeeches = (100*(d['d_speeches']+d['r_speeches'])/50).toFixed(0)
            d3.select('#speechFrequency')
                .text('Mentioned in '+percentOfSpeeches+'% of speeches.') // 'What percent of speeches'


        }) // magically calls this with d, i, nodeList
        .on('mouseout', (d, i, nodeList) => {eraseText()
            d3.select('#infoBoxRect rect').attr('opacity', 0)
            nodeList[i].setAttribute('stroke-width', '1')
        })

    let infoBox = firstBubblePlot.append('g')
        .attr('id', 'infoBoxRect')
    
    
    infoBox.append('rect')
        .attr('width', textBoxWidth)
        .attr('height', textBoxHeight)
        .attr('rx', '25') // curvature line
        .attr('fill', 'none')
        //.attr('fill-opacity', '0')
    
    infoBox.append('text')
        .attr('id', 'speechTitle')
        .attr('x', (textBoxWidth/2))
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '30')

    infoBox.append('text')
        .attr('id', 'speechBalance')
        .attr('x', (textBoxWidth/2))
        .attr('y', 55)
        .attr('text-anchor', 'middle')
        .style('font-size', '20')

    infoBox.append('text')
        .attr('id', 'speechFrequency')
        .attr('x', (textBoxWidth/2))
        .attr('y', 75)
        .attr('text-anchor', 'middle')
        .style('font-size', '20')

    

}

//console.log('second one')


function eraseText(){

    d3.selectAll('#infoBoxRect text')
        .text('')
        
}
////////////////////////////////////////////////////////



function changeLocation(checked) {
    //console.log(checked)
    isButtonClicked = checked

    let circleElements = d3.selectAll('circle')
        .transition()
        .duration(500)

    let centerLine = d3.select('#centerLine')
        .transition()
        .duration(500)

    if (checked) {
        circleElements 
            .attr('cy', d => determineY(d)) //(d['category'])*individualChartHeight+65+d['sourceY'])) // Kept the sourceY because correctedY makes some overlap 

        centerLine.attr('y2', (individualChartHeight*(categoryNames.length)))
        enableBrushes()
        brushGroups[0].call(d3.brush().move, [[0,0],[0,0]])
        d3.select('#firstPlot').selectAll('text')
            .transition()
            .duration(500)
            .attr('opacity', 1)
        
    }
    else {
        circleElements
            .attr('cy', d => d['sourceY'] +65)
        centerLine.attr('y2', individualChartHeight)
        disableBrushes()
        brushGroups[0].call(d3.brush().move, [[0,0],[0,0]])
        d3.select('#firstPlot').selectAll('text').attr('opacity', 0)
    }
    for (let entry of wordsObject) {
        entry['display'] = true
    }
    generateTable(wordsObject)

}


function disableBrushes() {
    for (let i = 1; i < brushes.length; i++) {
        brushes[i].extent([ [0,0],[0,0]])
        brushGroups[i].call(brushes[i])
        brushGroups[i].call(d3.brush().move, [[0,(i*individualChartHeight)],[0,(i*individualChartHeight)]])
    }
}

function enableBrushes() {
    // console.log('Next is a list of the brushes')
    // console.log(brushes)
    for (let i = 0; i < brushes.length; i++) {
        //console.log(i)
        //brushes[i].call(move, [[0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]])
        //console.log([[0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]])
        brushes[i].extent([[0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]])
        brushGroups[i].call(brushes[i])
        //brushGroups[i].call(d3.brush().move, [[0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]])
        //brushGroups[i].call(d3.brush().move, [[0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]])
        //brushes[i].extent([ [0,(i*individualChartHeight)],[chartWidth, ((i+1)*individualChartHeight)]])
        
    }
}

