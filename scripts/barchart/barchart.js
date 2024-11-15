const margin = { top: 20, right: 30, bottom: 50, left: 60 };

const container = document.getElementById("my_dataviz_bar");

// Calculate width and height based on the container dimensions
const width = container.clientWidth - margin.left - margin.right;

const height = container.clientHeight - margin.top - margin.bottom - 50; // Adjust for buttons height if necessary

// Append the SVG object to the container after the buttons
const svg = d3.select("#my_dataviz_bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create the tooltip div
const tooltip = d3.select("#tooltip");

// Parse the Data
d3.csv("../../data/barchart/barchart.csv").then(function(data) {

    // List of subgroups = header of the csv files = Adult and Children
    const subgroups = data.columns.slice(1);

    // List of groups = subregions, value of the first column
    const groups = data.map(d => d.Subregions);

    // Scales
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);

    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#439EBD","#F7AD19"]);  // BLue for Adult, Orange for Children

    // Y scales for grouped and stacked charts
    const yGrouped = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(+d.Adult, +d.Children))])
        .nice()
        .range([height, 0]);

    const yStacked = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Adult + +d.Children)])
        .nice()
        .range([height, 0]);

    let y = yGrouped; // Initial y scale

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const yAxis = svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`));

    // Create groups for each subgroup
    const groupsLayer = svg.selectAll("g.layer")
        .data(subgroups)
        .enter().append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d));

    // Function to attach event handlers
    function attachEventHandlers(selection) {
        selection.on("mouseover", function(event, d) {
            // Adjust for grouped or stacked data structure
            const key = d.key || d.data.key;
            const value = d.value || (d.y1 - d.y0);  // Use stacked value in stacked mode
    
            // Format value to two decimal places
            const formattedValue = value.toFixed(2);
    
            // Show tooltip
            tooltip.transition("hover").duration(200).style("opacity", 1);
    
            tooltip.html(`${key}: ${formattedValue}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
    
            // Dim other bars
            d3.selectAll("rect").transition("hover").duration(200).attr("opacity", 0.2);
            d3.select(this).transition("hover").duration(200).attr("opacity", 1).attr("stroke", "blue");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            // Reset bars
            d3.selectAll("rect").transition("hover").duration(200).attr("opacity", 1).attr("stroke", null);
    
            // Hide tooltip
            tooltip.transition("hover").duration(200).style("opacity", 0);
        });
    }

    // Draw the initial grouped bars
    const bars = groupsLayer.selectAll("rect")
        .data(d => data.map(function(datum) {
            return {Subregions: datum.Subregions, key: d, value: +datum[d]};
        }))
        .enter().append("rect")
        .attr("x", d => x(d.Subregions) + xSubgroup(d.key))
        .attr("y", height)
        .attr("width", xSubgroup.bandwidth())
        .attr("height", 0)
        .call(attachEventHandlers) // Attach event handlers
        .transition("mode")
        .duration(1000)
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value));

    // Function to update the chart to grouped
    function updateGrouped() {

        y = yGrouped;

        yAxis.transition("mode").duration(1000).call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`));

        const rects = groupsLayer.selectAll("rect")
            .data(d => data.map(function(datum) {
                return {Subregions: datum.Subregions, key: d, value: +datum[d]};
            }))
            .join("rect")
            .style("pointer-events", "none"); // Disable pointer events during transition

        rects.transition("mode")
            .duration(1000)
            .attr("x", d => x(d.Subregions) + xSubgroup(d.key))
            .attr("width", xSubgroup.bandwidth())
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value))
            .on("end", function() {
                d3.select(this).style("pointer-events", null); // Re-enable pointer events
            });

        // Reattach event handlers
        attachEventHandlers(rects);
    }

    // Function to update the chart to stacked
    function updateStacked() {

        y = yStacked;

        yAxis.transition("mode").duration(1000).call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`));

        const stackedData = d3.stack()
            .keys(subgroups)
            (data);

        const rects = groupsLayer.selectAll("rect")
            .data((d, i) => stackedData[i].map(function(datum) {
                return {
                    data: datum.data,
                    key: d,
                    Subregions: datum.data.Subregions,
                    y0: datum[0],
                    y1: datum[1],
                    value: +( (datum[1] - datum[0]).toFixed(2) ) // Format value here
                };
            }))
            .join("rect")
            .style("pointer-events", "none"); // Disable pointer events during transition

        rects.transition("mode")
            .duration(1000)
            .attr("x", d => x(d.Subregions))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.y1))
            .attr("height", d => y(d.y0) - y(d.y1))
            .on("end", function() {
                d3.select(this).style("pointer-events", null); // Re-enable pointer events
            });

        // Reattach event handlers
        attachEventHandlers(rects);
    }

    // Add event listeners to buttons
    d3.select("#grouped").on("click", updateGrouped);

    d3.select("#stacked").on("click", updateStacked);

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