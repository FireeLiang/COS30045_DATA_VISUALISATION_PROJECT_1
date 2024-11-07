// Set the margins and dimensions for the chart
const margin = { top: 20, right: 30, bottom: 50, left: 60 };
const container = document.getElementById("my_dataviz");

// Calculate width and height based on the container dimensions
const width = container.clientWidth - margin.left - margin.right;
const height = container.clientHeight - margin.top - margin.bottom;

// Append the SVG object to the container
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create the tooltip div
const tooltip = d3.select("#tooltip");

// Parse the Data
d3.csv("age/barchart.csv").then(function(data) {

    // List of subgroups = header of the csv files = Adult and Children
    const subgroups = data.columns.slice(1);

    // List of groups = subregions, value of the first column
    const groups = data.map(d => d.Subregions);

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.Adult, d.Children))])
        .nice()
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`));

    // Another scale for subgroup position
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    // Color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#4daf4a","#ffb832"]);  // Green for Adult, Yellow for Children

    // Show the bars with interactivity
    svg.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(${x(d.Subregions)}, 0)`)
    .selectAll("rect")
    .data(d => subgroups.map(key => ({key: key, value: +d[key]})))
    .join("rect")
    .attr("x", d => xSubgroup(d.key))
    .attr("y", d => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", d => color(d.key)) // Set initial color based on subgroup
    .on("mouseover", function(event, d) {
        // Change color to red on hover
        d3.select(this).attr("fill", "red");

        // Show tooltip
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.key}: ${d.value}%`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", function(event) {
        // Move tooltip with the mouse
        tooltip.style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
        // Reset color back to original based on subgroup
        d3.select(this).attr("fill", color(d.key));

        // Hide tooltip
        tooltip.transition().duration(200).style("opacity", 0);
    });

    // Add legend
    svg.append("g")
        .attr("class", "legend")
        .selectAll("text")
        .data(subgroups)
        .enter()
        .append("text")
        .attr("x", width - 60)
        .attr("y", function(d, i) { return 10 + i * 20; })
        .text(d => d)
        .style("fill", d => color(d))
        .style("font-weight", "bold")
        .attr("alignment-baseline", "middle");

}).catch(function(error) {
    console.error("Error loading or parsing data:", error);
});