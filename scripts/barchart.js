// // // Set the margins and dimensions for the chart
// // const margin = { top: 20, right: 30, bottom: 50, left: 60 };
// // const container = document.getElementById("my_dataviz");

// // // Calculate width and height based on the container dimensions
// // const width = container.clientWidth - margin.left - margin.right;
// // const height = container.clientHeight - margin.top - margin.bottom;

// // // Append the SVG object to the container
// // const svg = d3.select("#my_dataviz")
// //   .append("svg")
// //     .attr("width", width + margin.left + margin.right)
// //     .attr("height", height + margin.top + margin.bottom)
// //   .append("g")
// //     .attr("transform", `translate(${margin.left},${margin.top})`);

// // // Create the tooltip div
// // const tooltip = d3.select("#tooltip");

// // // Parse the Data
// // d3.csv("age/barchart.csv").then(function(data) {

// //     // List of subgroups = header of the csv files = Adult and Children
// //     const subgroups = data.columns.slice(1);

// //     // List of groups = subregions, value of the first column
// //     const groups = data.map(d => d.Subregions);

// //     // Add X axis
// //     const x = d3.scaleBand()
// //         .domain(groups)
// //         .range([0, width])
// //         .padding([0.2]);
// //     svg.append("g")
// //         .attr("transform", `translate(0, ${height})`)
// //         .call(d3.axisBottom(x).tickSize(0));

// //     // Add Y axis
// //     const y = d3.scaleLinear()
// //         .domain([0, d3.max(data, d => Math.max(d.Adult, d.Children))])
// //         .nice()
// //         .range([height, 0]);
// //     svg.append("g")
// //         .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`));

// //     // Another scale for subgroup position
// //     const xSubgroup = d3.scaleBand()
// //         .domain(subgroups)
// //         .range([0, x.bandwidth()])
// //         .padding([0.05]);

// //     // Color palette = one color per subgroup
// //     const color = d3.scaleOrdinal()
// //         .domain(subgroups)
// //         .range(["#4daf4a","#ffb832"]);  // Green for Adult, Yellow for Children

// //     // Show the bars with interactivity
// //     svg.append("g")
// //     .selectAll("g")
// //     .data(data)
// //     .join("g")
// //     .attr("transform", d => `translate(${x(d.Subregions)}, 0)`)
// //     .selectAll("rect")
// //     .data(d => subgroups.map(key => ({key: key, value: +d[key]})))
// //     .join("rect")
// //     .attr("x", d => xSubgroup(d.key))
// //     .attr("y", d => y(d.value))
// //     .attr("width", xSubgroup.bandwidth())
// //     .attr("height", d => height - y(d.value))
// //     .attr("fill", d => color(d.key)) // Set initial color based on subgroup
// //     .on("mouseover", function(event, d) {
// //         // Change color to red on hover
// //         d3.select(this).attr("fill", "red");

// //         // Show tooltip
// //         tooltip.transition().duration(200).style("opacity", 1);
// //         tooltip.html(`${d.key}: ${d.value}%`)
// //             .style("left", (event.pageX + 5) + "px")
// //             .style("top", (event.pageY - 28) + "px");
// //     })
// //     .on("mousemove", function(event) {
// //         // Move tooltip with the mouse
// //         tooltip.style("left", (event.pageX + 5) + "px")
// //                 .style("top", (event.pageY - 28) + "px");
// //     })
// //     .on("mouseout", function(event, d) {
// //         // Reset color back to original based on subgroup
// //         d3.select(this).attr("fill", color(d.key));

// //         // Hide tooltip
// //         tooltip.transition().duration(200).style("opacity", 0);
// //     });

// //     // Add legend
// //     svg.append("g")
// //         .attr("class", "legend")
// //         .selectAll("text")
// //         .data(subgroups)
// //         .enter()
// //         .append("text")
// //         .attr("x", width - 60)
// //         .attr("y", function(d, i) { return 10 + i * 20; })
// //         .text(d => d)
// //         .style("fill", d => color(d))
// //         .style("font-weight", "bold")
// //         .attr("alignment-baseline", "middle");

// // }).catch(function(error) {
// //     console.error("Error loading or parsing data:", error);
// // });

// // Set the margins and dimensions for the chart
// const margin = { top: 20, right: 30, bottom: 50, left: 60 };
// const container = document.getElementById("my_dataviz");

// // Calculate width and height based on the container dimensions
// const width = container.clientWidth - margin.left - margin.right;
// const height = container.clientHeight - margin.top - margin.bottom;

// // Append the SVG object to the container
// const svg = d3.select("#my_dataviz")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// // Create the tooltip div
// const tooltip = d3.select("#tooltip");

// // Parse the Data
// d3.csv("age/barchart.csv").then(function(data) {

//     // List of subgroups = header of the csv files = Adult and Children
//     const subgroups = data.columns.slice(1);

//     // List of groups = subregions, value of the first column
//     const groups = data.map(d => d.Subregions);

//     // Add X axis
//     const x = d3.scaleBand()
//         .domain(groups)
//         .range([0, width])
//         .padding([0.2]);
//     svg.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(x).tickSize(0));

//     // Add Y axis
//     const y = d3.scaleLinear()
//         .domain([0, d3.max(data, d => Math.max(d.Adult, d.Children))])
//         .nice()
//         .range([height, 0]);
//     svg.append("g")
//         .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}%`));

//     // Another scale for subgroup position
//     const xSubgroup = d3.scaleBand()
//         .domain(subgroups)
//         .range([0, x.bandwidth()])
//         .padding([0.05]);

//     // Color palette = one color per subgroup
//     const color = d3.scaleOrdinal()
//         .domain(subgroups)
//         .range(["#4daf4a","#ffb832"]);  // Green for Adult, Yellow for Children

//     // Show the bars with interactivity and initial loading animation
//     svg.append("g")
//     .selectAll("g")
//     .data(data)
//     .join("g")
//     .attr("transform", d => `translate(${x(d.Subregions)}, 0)`)
//     .selectAll("rect")
//     .data(d => subgroups.map(key => ({key: key, value: +d[key]})))
//     .join("rect")
//     .attr("x", d => xSubgroup(d.key))
//     .attr("width", xSubgroup.bandwidth())
//     .attr("y", height) // Start from the bottom
//     .attr("height", 0) // Start with height 0 for animation
//     .attr("fill", d => color(d.key)) // Set initial color based on subgroup
//     .transition(1000) // Add initial load animation
//     .duration(1000)
//     .attr("y", d => y(d.value))
//     .attr("height", d => height - y(d.value));

//     // Add hover effect with animation
//     svg.selectAll("rect")
//     .on("mouseover", function(event, d) {
//         // Dim other bars
//         d3.selectAll("rect").transition().duration(200).attr("opacity", 0.2);
//         d3.select(this).transition().duration(200).attr("opacity", 1).attr("fill", "blue"); // Make hovered bar more visible

//         // Show tooltip with fade-in effect
//         tooltip.transition().duration(200).style("opacity", 1);
//         tooltip.html(`${d.key}: ${d.value}%`)
//             .style("left", (event.pageX + 5) + "px")
//             .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mousemove", function(event) {
//         // Move tooltip with the mouse
//         tooltip.style("left", (event.pageX + 5) + "px")
//                 .style("top", (event.pageY - 28) + "px");
//     })
//     .on("mouseout", function(event, d) {
//         // Reset color and opacity of all bars with transition
//         d3.selectAll("rect").transition().duration(200).attr("opacity", 1).attr("fill", d => color(d.key));

//         // Hide tooltip with fade-out effect
//         tooltip.transition().duration(200).style("opacity", 0);
//     });

//     // Add legend
//     svg.append("g")
//         .attr("class", "legend")
//         .selectAll("text")
//         .data(subgroups)
//         .enter()
//         .append("text")
//         .attr("x", width - 60)
//         .attr("y", function(d, i) { return 10 + i * 20; })
//         .text(d => d)
//         .style("fill", d => color(d))
//         .style("font-weight", "bold")
//         .attr("alignment-baseline", "middle");

// }).catch(function(error) {
//     console.error("Error loading or parsing data:", error);
// });

const margin = { top: 20, right: 30, bottom: 50, left: 60 };
const container = document.getElementById("my_dataviz");

// Calculate width and height based on the container dimensions
const width = container.clientWidth - margin.left - margin.right;
const height = container.clientHeight - margin.top - margin.bottom - 50; // Adjust for buttons height if necessary

// Append the SVG object to the container after the buttons
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create the tooltip div
const tooltip = d3.select("#tooltip");

// Parse the Data
d3.csv("../age/barchart.csv").then(function(data) {

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
        .range(["#FF00FF","#FF9900"]);  // Purple for Adult, Yellow for Children

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
            // Dim other bars
            d3.selectAll("rect").transition("hover").duration(200).attr("opacity", 0.2);
            d3.select(this).transition("hover").duration(200).attr("opacity", 1).attr("stroke", "blue");

            // Format value to two decimal places
            const formattedValue = d.value.toFixed(2);

            // Show tooltip
            tooltip.transition("hover").duration(200).style("opacity", 1);
            tooltip.html(`${d.key}: ${formattedValue}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
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