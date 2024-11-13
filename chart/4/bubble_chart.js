// Set the dimensions and margins of the graph
const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add X axis
const x = d3.scaleLinear()
  .domain([0, 12000]) // Adjust domain based on data
  .range([0, width]);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
  .domain([35, 90]) // Adjust domain based on data
  .range([height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add a scale for bubble size
const z = d3.scaleLinear()
  .domain([200000, 1310000000]) // Adjust domain based on data
  .range([4, 40]);

// Add a scale for bubble color
const myColor = d3.scaleOrdinal()
  .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
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
d3.csv("../data/bubble_chart/sample.csv").then(function(data) {
  // Convert data types
  data.forEach(d => {
    d.year = +d.year;
    d.lifeExp = +d.lifeExp;
    d.gdpPercap = +d.gdpPercap;
    d.pop = +d.pop;
  });

  // Initial year setup
  let selectedYear = 2007;

  // Filter data by year function
  const filterDataByYear = (year) => data.filter(d => d.year === year);

  // Update chart function
  const updateChart = (filteredData) => {
    const bubbles = svg.selectAll(".bubbles")
      .data(filteredData, d => d.country);

    // Update existing bubbles
    bubbles
      .transition().duration(200)
      .attr("cx", d => x(d.gdpPercap))
      .attr("cy", d => y(d.lifeExp))
      .attr("r", d => z(d.pop))
      .style("fill", d => myColor(d.continent));

    // Enter new bubbles
    bubbles.enter()
      .append("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d.gdpPercap))
      .attr("cy", d => y(d.lifeExp))
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