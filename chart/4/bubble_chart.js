// Set the dimensions and margins of the graph
const margin = {top: 50, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(
      d3.zoom()
        .scaleExtent([0.5, 3]) // Set zooming range (50% zoom out to 3x zoom in)
        .translateExtent([[0, 0], [width, height]]) // Restrict the translation area
        .on("zoom", function(event) {
          const transform = event.transform;

          // Apply zoom transformations to bubbles and axes
          svg.selectAll(".bubbles").attr("transform", transform);

          // Keep X-axis ticks fixed at an interval of 2
          xAxis.call(d3.axisBottom(x).scale(transform.rescaleX(x)).ticks(25, "s"));
          yAxis.call(d3.axisLeft(y).scale(transform.rescaleY(y)));
        })
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add a transparent rectangle to capture zoom events over the entire chart area
svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("fill", "none")
  .style("pointer-events", "all");

// Add X axis (adjust the domain based on the data range of obesity)
const x = d3.scaleLinear()
  .domain([0, 50]) // Adjusted to match the obesity data range
  .range([0, width]);

// Add X axis with ticks every 2 units (0, 2, 4, 6, 8, 10...)
const xAxis = svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).ticks(25, "s"));

// Add Y axis (use 'death' for the Y axis)
const y = d3.scaleLinear()
  .domain([0, 20]) // Adjust domain based on 'death' values
  .range([height, 0]);

const yAxis = svg.append("g")
  .call(d3.axisLeft(y));

// Add a scale for bubble size
const z = d3.scaleLinear()
  .domain([31007.02236, 146150957.4]) // Adjusted domain based on population range
  .range([5, 20]);

// Add a scale for bubble color
const myColor = d3.scaleOrdinal()
  .domain(["Eastern Europe", "Western Europe", "Northern Europe", "Southern Europe", "Central Europe"])
  .range(d3.schemeSet2);

// Create a tooltip div that is hidden by default
const tooltip = d3.select("#my_dataviz")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

// Tooltip functions
const showTooltip = function(event, d) {
  tooltip.transition().duration(200).style("opacity", 1);
  tooltip.html("Country: " + d.country)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px");
};
const moveTooltip = function(event, d) {
  tooltip.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY + 10) + "px");
};
const hideTooltip = function(event, d) {
  tooltip.transition().duration(200).style("opacity", 0);
};

// Read the data
d3.csv("../data/bubble_chart/upload_with_regions.csv").then(function(data) {
  // Convert data types
  data.forEach(d => {
    d.year = +d.year;
    d.death = +d.death; // Use 'death' for the Y axis
    d.pop = +d.pop;
    d.obesity = +d.obesity; // Use obesity instead of gdpPercap
  });

  // Initial year setup
  let selectedYear = 2010; // Start with the year 2010

  // Filter data by year function
  const filterDataByYear = (year) => data.filter(d => d.year === year);

  // Update chart function
  const updateChart = (filteredData) => {
    const bubbles = svg.selectAll(".bubbles")
      .data(filteredData, d => d.country);

    // Update existing bubbles
    bubbles
      .transition().duration(200)
      .attr("cx", d => x(d.obesity)) // Use 'obesity' for the X axis
      .attr("cy", d => y(d.death)) // Update to use 'death' for the Y axis
      .attr("r", d => z(d.pop))
      .style("fill", d => myColor(d.continent));

    // Enter new bubbles
    bubbles.enter()
      .append("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d.obesity)) // Use 'obesity' for the X axis
      .attr("cy", d => y(d.death)) // Update to use 'death' for the Y axis
      .attr("r", d => z(d.pop))
      .style("fill", d => myColor(d.continent))
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);

    // Remove old bubbles
    bubbles.exit().remove();
  };

  // Initial rendering
  updateChart(filterDataByYear(selectedYear));

  // Add slider event listener
  d3.select("#yearSlider").on("input", function() {
    selectedYear = +this.value;
    d3.select("#yearValue").text(selectedYear);
    updateChart(filterDataByYear(selectedYear));
  });
});
