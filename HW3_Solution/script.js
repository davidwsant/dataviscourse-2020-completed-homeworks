document.querySelector("#dataset").addEventListener("change", changeData);
document.querySelector("#random").addEventListener("change", changeData);

// window.onload = changeData;

/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  // ****** TODO: PART II ******
  let barchart = document.querySelector("#aBarChart");
  let children = barchart.querySelectorAll("rect");
  children = Array.from(children);
  children.sort((a, b) => {
    return a.attributes.width.nodeValue - b.attributes.width.nodeValue;
  });
  children.forEach((c, i) => {
    c.attributes.transform.value = `translate(0, ${i * 14}) scale(-1,1)`;
    barchart.appendChild(c);
    addMouseHoverEvent(c);
  });
}

function addMouseHoverEvent(b) {
  b.addEventListener("mouseover", d => {
    b.className.baseVal = "hovered";
  });
  b.addEventListener("mouseout", d => {
    b.className.baseVal = b.className.baseVal.replace("hovered", "");
  });
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
  let data_length = 15;
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

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  let aBarChart = d3.select("#aBarChart");
  updateBarChart(aBarChart, data, aScale, false, d => d.cases);

  // TODO: Select and update the 'b' bar chart bars
  let bBarChart = d3.select("#bBarChart");
  updateBarChart(bBarChart, data, bScale, true, d => d.deaths);

  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y(d => aScale(d.cases));

  let aLineChart = d3.select("#aLineChart");
  updateLineOrAreaChart(aLineChart, data, aLineGenerator, true);

  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineChart = d3.select("#bLineChart");
  let bLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y(d => bScale(d.deaths));
  updateLineOrAreaChart(bLineChart, data, bLineGenerator, true);

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(d => aScale(d.cases));

  let aAreaChart = d3.select("#aAreaChart");
  updateLineOrAreaChart(aAreaChart, data, aAreaGenerator);

  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(d => bScale(d.deaths));

  let bAreaChart = d3.select("#bAreaChart");
  updateLineOrAreaChart(bAreaChart, data, bAreaGenerator);

  // TODO: Select and update the scatterplot points
  let scatterPlot = d3.select("#scatterplot");
  updateScatterPlot(scatterPlot, data, aScale, bScale);

  let axisBottom = d3.axisBottom(aScale).ticks(5);
  d3.select("#x-axis").call(axisBottom);

  let axisLeft = d3.axisLeft(bScale).ticks(5);
  d3.select("#y-axis").call(axisLeft);

  // ****** TODO: PART IV ******
}

function updateBarChart(root, data, scale, right, selector) {
    const exitAnimationDuration = 250;
    const moveVerticalAnimationDuration = 500;
    const enterRectAnimationDelay = 0.6 * moveVerticalAnimationDuration; // the existing bars should once this one starts
    const enterRectAnimationDuration = 300;
  
    const rectSelect = root.selectAll("rect")
      .data(data, dataKey);
  
    rectSelect.exit()
      .transition()
      .duration(exitAnimationDuration)
      .attr("width", 0)
      .attr("height", 0)
      .remove();
  
    transformFunc = (d, i) => right ? `translate(0, ${i * 14})` : `translate(0, ${i * 14}) scale(-1,1)`;
  
    const newRect = rectSelect
      .enter()
      .append("rect")
      .attr("transform", transformFunc) // new rects should start at the correct vertical position
      .attr("width", 0);
  
    newRect.transition()
      .duration(enterRectAnimationDuration)
      .delay(enterRectAnimationDelay)
      .attr("width", d => scale(selector(d)));
  
    rectSelect.transition()
      .duration(moveVerticalAnimationDuration) 
      .attr("transform", transformFunc)
      .attr("width", d => scale(selector(d))); // existing rects should move to their new position
  
    const mergedRects = newRect.merge(rectSelect)
      .attr("height", 12);

  let bars = document.querySelectorAll("g.bar-chart > rect");
  bars.forEach(b => {
    addMouseHoverEvent(b);
  });
}

function updateLineOrAreaChart(root, data, lineGen, isLine = false) {
  if (isLine) {
    root.datum(data).attr("d", lineGen);
    let totalLength = root.node().getTotalLength();
    root      
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);
  } else {
    root
      .datum(data)
      .transition()
      .duration(1000)
      .attr("d", lineGen);
  }
}

function updateScatterPlot(root, data, xScale, yScale) {
  let points = root.selectAll("circle")
      .data(data, dataKey);
  // animation times
  const fadeInOut1 = 150;
  const fadeInOut2 = 350;
  const movePoint = 500;

  const fadeOut = points.exit();
  fadeOut.transition()
    .duration(fadeInOut1)
    .attr("r", 7);

  fadeOut.transition()
    .delay(fadeInOut1)
    .duration(fadeInOut2)
    .attr("r", 0)
    .remove();

  const newPoints = points.enter().append("circle");
  newPoints
      .attr("cx", d => xScale(d.cases))
      .attr("cy", d => yScale(d.deaths))
      .attr("r", 0)
      .on("click", d => {
        console.log(`Cases: ${d.cases.toFixed(0)}, Deaths:${d.deaths.toFixed(0)}`);
      })
    .append("title")
      .text(d => {
        return `Cases: ${d.cases.toFixed(0)}, Deaths: ${d.deaths.toFixed(0)}`;
      });

  newPoints.transition()
    .duration(fadeInOut2)
    .attr("r", 7);

  newPoints.transition()
    .delay(fadeInOut2)
    .duration(fadeInOut1)
    .attr("r", 5);

  points = newPoints.merge(points);

  points.transition("movePoints")
      .duration(movePoint)
      .attr("cx", d => xScale(d.cases))
      .attr("cy", d => yScale(d.deaths));

  let nodes = document.querySelectorAll("#scatterplot > circle");
  nodes.forEach(b => {
      addMouseHoverEvent(b);
    });
}

/**
 * Useful for creating more connected animations
 */
function dataKey(d)
{
	if (d)
	{
		return d.date;
	}
	return this.id; // in the case when data isn't bound yet
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
