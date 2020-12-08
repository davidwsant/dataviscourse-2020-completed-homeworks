/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  
  let barArraya = Array.from(document.getElementById('aBarChart').getElementsByTagName('rect'))
  /* Other option is to use children attribute 
  * let barArraya = Array.from(document.getElementById('aBarChart')
    let rectangles = barArraya.children
  */
  let barArrayb = Array.from(document.getElementById('bBarChart').getElementsByTagName('rect'))
  // This means get a pointer for each of the elements that are 'rect' in 'aBarChart', then put them into an array 
  /* Other option is this:
  document.querySelectorAll('#aBarChart rect')
  but this is much more computationally expensive */
  
  barArraya.sort((a, b) => a.width.baseVal.value - b.width.baseVal.value);
  barArrayb.sort((a, b) => a.width.baseVal.value - b.width.baseVal.value);
  // sort it based on the width.baseVal.value
  // Other option, for (let something of barArraya){
    //something.setAttribute("width", )
  //}
  let y = 0
  for (element of barArraya){
    //element.setAttribute('transform', 'translate(0, ' + y + ') scale(-1, 1)')
    element.transform.baseVal[0].matrix.f = y // this option is more computationally efficient
    y += 14
  }
  // Set the transform to 0, but add 14 for each element in the list after the sort
  let z = 0
  for (element of barArrayb){
    //element.setAttribute('transform', 'translate(0, ' + y + ') scale(-1, 1)')
    element.transform.baseVal[0].matrix.f = z // this option is more computationally efficient
    z += 14
  }
  /*console.log(barArraya)*/
  /*console.log(barGroup)*/

}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.cases = +d.cases; //unary operator converts string to number
    d.deaths = +d.deaths; //unary operator converts string to number
  }

  // Set up the scales
  let barChart_width = 345;
  let areaChart_width = 295;
  let maxBar_width = 240;
  let data_length = 15; // let data_length = data.length
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.cases)])
    .range([0, maxBar_width]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.deaths)])
    .range([0, maxBar_width]);
  let iScale_line = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 500]);
  let iScale_area = d3
    .scaleLinear()
    .domain([0, data_length])
    .range([0, 260]);
  
  // Draw axis for Bar Charts, Line Charts and Area Charts (You don't need to change this part.)
  d3.select("#aBarChart-axis").attr("transform", "translate(0,210)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([barChart_width, barChart_width-maxBar_width])).ticks(5));
  d3.select("#aAreaChart-axis").attr("transform", "translate(0,245)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([areaChart_width, areaChart_width-maxBar_width])).ticks(5));
  d3.select("#bBarChart-axis").attr("transform", "translate(5,210)").call(d3.axisBottom(bScale).ticks(5));
  d3.select("#bAreaChart-axis").attr("transform", "translate(5,245)").call(d3.axisBottom(bScale).ticks(5));
  let aAxis_line = d3.axisLeft(aScale).ticks(5);
  d3.select("#aLineChart-axis").attr("transform", "translate(50,15)").call(aAxis_line);
  d3.select("#aLineChart-axis").append("text").text("New Cases").attr("transform", "translate(50, -3)")
  let bAxis_line = d3.axisRight(bScale).ticks(5);
  d3.select("#bLineChart-axis").attr("transform", "translate(550,15)").call(bAxis_line);
  d3.select("#bLineChart-axis").append("text").text("New Deaths").attr("transform", "translate(-50, -3)")
  // add the axes for the scatterplot
  //d3.select("#x-axis").call(d3.axisBottom(aScale()).ticks(5)); //d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([0, maxBar_width])
  d3.select("#y-axis").call(d3.axisLeft(d3.scaleLinear().domain([0, d3.max(data, d => d.deaths)]).range([0, maxBar_width])).ticks(5));
  // ****** TODO: PART III (you will also edit in PART V) ******
  let x_axis = d3.axisBottom(aScale).ticks(5)
  d3.selectAll("#scatterplot > #x-axis").call(x_axis)
  

  // TODO: Select and update the 'a' bar chart bars

  aRects = d3.select("#aBarChart").selectAll('rect').data(data)
    

  aRects.exit().remove();
  let newARects = aRects.enter().append('rect') // This will add them when nothing is there, but if there are already 15 there, it will not do anything. 
    .attr('height', '12')
    .attr('transform', (d, i) => 'translate(0, '+ i*14 +') scale(-1, 1)') // Adds the 'rect' element for each new data point that is being added
    .attr('width', d => aScale(d.cases))
  newARects.merge(aRects)
    .on('mouseover', (d, i, nodes) => nodes[i].className.baseVal = 'hovered')
    .on('mouseout', (d, i, nodes) => nodes[i].className.baseVal = '');
  aRects.transition()
    .duration(1000)
    .attr('width', d => aScale(d.cases)),

  // TODO: Select and update the 'b' bar chart bars
  /*let bRects = d3.select("#bBarChart").selectAll('rect').data(data)
  bRects.exit().remove();
  let newRects = bRects.enter().append('rect') // This will add them when nothing is there, but if there are already 15 there, it will not do anything. 
    .attr('height', '12')
    .attr('transform', (d, i) => 'translate(0, '+ i*14 +')') // Adds the 'rect' element for each new data point that is being added
  newRects.merge(bRects).attr('width', d => bScale(d.deaths))
    .on('mouseover', (d, i, nodes) => nodes[i].className.baseVal = 'hovered')
    .on('mouseout', (d, i, nodes) => nodes[i].className.baseVal = ''); */
  //newRects.exit().remove();
  d3.select("#bBarChart").selectAll('rect').data(data)
    .join(
      enter => enter
        .append('rect')
        .attr('height', '12')
        .attr('width', '0') // Set it to 0 on page load
        .attr('transform', (d, i) => 'translate(0, '+ i*14 +')')
        .on('mouseover', (d, i, nodes) => nodes[i].className.baseVal = 'hovered')
        .on('mouseout', (d, i, nodes) => nodes[i].className.baseVal = ''), // This one uses the merge and exit all at once
      update => update,
      exit => exit.remove()
    )
    .transition()
    .duration(1000)
    .attr('width', d => bScale(d.deaths)) // Add this transition for every movement, including page load. 
    
    // Other option was for mouse over was this:
    /*on.('mouseover' function (d,i){
      d3.select(this)
        .attr('class', 'hovered')
    })*/ 


  //bRects.merge(bRects.enter().selectAll('rect')).attr('width', d => bScale(d.deaths));
  // The line above this worked as well, but probably not as efficient 

  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y(d => aScale(d.cases));

  // TODO: Select and update the 'b' line chart path (create your own generator)

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(d => aScale(d.cases));

  let noAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(0);

  if (!d3.select("#aAreaChart").attr("d"))
    d3.select("#aAreaChart")
      .attr("d", noAreaGenerator(data))
  d3.select("#aAreaChart")
    .transition()
    .duration(1000)
    .attr("d", aAreaGenerator(data))

  let bAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(d => bScale(d.deaths));
  
  if (!d3.select("#bAreaChart").attr("d"))
    d3.select("#bAreaChart")
      .attr("d", noAreaGenerator(data))
  d3.select("#bAreaChart")
  .transition()
  .duration(1000)
  .attr("d", bAreaGenerator(data))
  // TODO: Select and update the 'b' area chart path (create your own generator)
  
  

  // TODO: Select and update the scatterplot points
  let scatterCircles = d3.select("#scatterplot").selectAll('circle').data(data)
  
  scatterCircles.exit().remove();
  let deathMid = bScale(d3.max(data, d => d.deaths))/2
  let dataMid = aScale(d3.max(data, d => d.cases))/2

  let newCircles = scatterCircles.enter().append('circle')
    .on('click', d => (console.log('Number Cases: '+d.cases, '; Number Deaths: '+d.deaths+' \nX-Coordinate: '+aScale(d.cases)+', Y-Coordinate: '+bScale(d.deaths)))) // This will add them when nothing is there, but if there are already 15 there, it will not do anything. 
    .attr('cx', dataMid) // d => aScale(d.cases)
    .attr('cy', deathMid) // d => bScale(d.deaths)
    
    .attr('r', '5')
    
  newCircles.append('title')

  
  //scatterCircles
  
  let mergedCircles = newCircles.merge(scatterCircles)
    .on('mouseover', (d, i, nodes) => nodes[i].className.baseVal = 'hovered')
    .on('mouseout', (d, i, nodes) => nodes[i].className.baseVal = '')
    .transition()
    .duration(1000)
    .attr('cx', d => aScale(d.cases))
    .attr('cy', d => bScale(d.deaths))
    
    
  mergedCircles.select('title').text(d => 'Number Cases: '+d.cases+'; Number Deaths: '+d.deaths+' \nX-Coordinate: '+aScale(d.cases)+', Y-Coordinate: '+bScale(d.deaths));;
  
  
  // .append("title")
  //layer.select("title").text(d => 'Number Cases: '+d.cases+'; Number Deaths: '+d.deaths)


  // Now put the info about the points into a path element
  // Starting point should be 50, 15. Move from there. 
  // Each one should go right one 'unit' and end at 550 pixels
  let positionsCases = ''
  let startingPositions = ''
  //let dataMid = aScale(d3.max(data, d => d.cases))/2
  for (let [i, element] of data.entries()){
    positionsCases+='L '+iScale_line(i)+' '+aScale(element.cases)+' '
    startingPositions+= 'L '+iScale_line(i)+' '+dataMid
  }
  

  positionsCases = positionsCases.replace(/L/, 'M')
  startingPositions = startingPositions.replace(/L/, 'M')
  
  //console.log(positionsCases)
  //d3.select("#aLineChart").attr('d', startingPositions)
  let casesLine = d3.select("#aLineChart")
  if (!casesLine.attr('d'))
    casesLine.attr('d', startingPositions) 
  casesLine.transition()
    .duration(1000)
    .attr('d', positionsCases)


  let positionsDeaths = ''
  let positionDeathStart = ''
  //let deathMid = bScale(d3.max(data, d => d.deaths))/2
  for (let [i, element] of data.entries()){
    positionsDeaths+='L '+iScale_line(i)+' '+bScale(element.deaths)+' '
    positionDeathStart+='L '+iScale_line(i)+' '+deathMid
  }
  positionsDeaths = positionsDeaths.replace(/L/, 'M')
  positionDeathStart = positionDeathStart.replace(/L/, 'M')
  //console.log(positionsDeaths)

  let deathsLine = d3.select("#bLineChart")
  if (!deathsLine.attr('d'))
    deathsLine.attr('d', positionDeathStart) 
  deathsLine.transition()
    .duration(1000)
    .attr('d', positionsDeaths)
  
  
  // ****** TODO: PART IV ******
  /*scatterCircles.transition()
    .duration(1000)
    .attr('cx', d => aScale(d.cases))
    .attr('cy', d => bScale(d.deaths))*/
}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    console.log(error)
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
