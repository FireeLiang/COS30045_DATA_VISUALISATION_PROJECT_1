// Set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 80},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#male")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Clip path to limit the zoom to the area of the graph
svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

// Add the clip path to the chart body
var chartBody = svg.append("g")
  .attr("clip-path", "url(#clip)");

// Read the data
d3.csv("../data/line/filtered_xlsx_male_final.csv", function(data) {

  // Group the data: one line per group
  var sumstat = d3.nest()
    .key(function(d) { return d.name; })
    .entries(data);

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([0, width]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // X-axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 40) // position below the x-axis
    .text("Years");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.n; })])
    .range([height, 0]);
  var yAxis = svg.append("g")
    .call(d3.axisLeft(y));

  // Y-axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40) // position to the left of the y-axis
    .text("Share of population who are obese");

  // Color palette
  var res = sumstat.map(function(d) { return d.key; }); // List of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']);

  // Define the line generator
  var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(+d.n); });

  // Draw the lines
  var lines = chartBody.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function(d) { return color(d.key); })
      .attr("stroke-width", 1.5)
      .attr("d", function(d) { return line(d.values); });

  // Zoom functionality
  var zoom = d3.zoom()
    .scaleExtent([-0.5, 2])  // Allow up to 10x zoom
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(zoom);

  function zoomed() {
    var t = d3.event.transform;
    xAxis.call(d3.axisBottom(t.rescaleX(x)));
    yAxis.call(d3.axisLeft(t.rescaleY(y)));
    lines.attr("transform", "translate(" + t.x + "," + t.y + ") scale(" + t.k + ")");
  }
});
