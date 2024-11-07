// set the dimensions and margins of the graph
var margin = {
    top: 10,
    right: 30,
    bottom: 60,
    left: 80
  },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#female")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 100) // add extra space for the legend
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");
  
  // Read the data
  d3.csv("../data/line/filtered_xlsx_female_final.csv", function(data) {
  
  // group the data: one line per group
  var sumstat = d3.nest()
    .key(function(d) {
        return d.name;
    })
    .entries(data);
  
  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {
        return d.year;
    }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));
  
  // X-axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 40) // position below the x-axis
    .text("Years");
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
        return +d.n;
    })])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
  // Y-axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40) // position to the left of the y-axis
    .text("Share of population who are obese");
  
  // color palette
  var res = sumstat.map(function(d) {
    return d.key
  }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999']);
  
  // Draw the lines
  svg.selectAll(".line")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function(d) {
        return color(d.key);
    })
    .attr("stroke-width", 1.5)
    .attr("d", function(d) {
        return d3.line()
            .x(function(d) {
                return x(d.year);
            })
            .y(function(d) {
                return y(+d.n);
            })
            (d.values)
    });
  
  // Add legend under the chart
  var legend = svg.append("g")
    .attr("transform", "translate(0," + (height + 60) + ")");
  
  legend.selectAll("rect")
    .data(res)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return (i % 2) * 200;
    }) // Adjust spacing for two lines
    .attr("y", function(d, i) {
        return Math.floor(i / 2) * 30.5;
    }) // Stacking for every two items
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) {
        return color(d);
    });
  
  legend.selectAll("text")
    .data(res)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
        return (i % 2) * 200 + 20;
    }) // Align with rectangle
    .attr("y", function(d, i) {
        return Math.floor(i / 2) * 31 + 5;
    }) // Position text below rectangles
    .html(function(d) {
        // Add line breaks for long labels
        return d.replace("Europe", "<tspan>Europe</tspan>");
    })
    .style("alignment-baseline", "middle")
    .attr("dominant-baseline", "middle") // Center vertically
    .attr("text-anchor", "start"); // Align text to the left
  });