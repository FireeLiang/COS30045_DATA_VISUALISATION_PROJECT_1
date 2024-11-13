// Set the dimensions and margins of the graph
const margin = { top: 50, right: 20, bottom: 80, left: 50 }, // Increased bottom margin for legend space
    width = 1000 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(
        d3.zoom()
            .scaleExtent([0.5, 3])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", function(event) {
                const transform = event.transform;
                svg.selectAll(".bubbles").attr("transform", transform);
                xAxis.call(d3.axisBottom(x).scale(transform.rescaleX(x)).ticks(25, "s"));
                yAxis.call(d3.axisLeft(y).scale(transform.rescaleY(y)));
                xAxis.raise(); // Ensure x-axis stays on top during zoom
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

// Define scales and axes
const x = d3.scaleLinear().domain([0, 50]).range([0, width]);
const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(25, "s"));

const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
const yAxis = svg.append("g").call(d3.axisLeft(y));

const z = d3.scaleLinear().domain([31007.02236, 146150957.4]).range([5, 20]);
const myColor = d3.scaleOrdinal()
    .domain(["Eastern Europe", "Western Europe", "Northern Europe", "Southern Europe", "Central Europe"])
    .range(d3.schemeSet2);

// Tooltip setup
const tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

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

// Update the information table with data
const updateInfoTable = function(d) {
    d3.select("#countryCell").text(d.country);
    d3.select("#regionCell").text(d.continent);
    d3.select("#obesityCell").text(d.obesity.toFixed(2));
    d3.select("#deathCell").text(d.death.toFixed(2));
};

// Read the data
d3.csv("../data/bubble_chart/upload_with_regions.csv").then(function(data) {
    data.forEach(d => {
        d.year = +d.year;
        d.death = +d.death;
        d.pop = +d.pop;
        d.obesity = +d.obesity;
    });

    let selectedYear = 2010;
    let selectedRegion = "All";

    const filterData = () => {
        let filteredData = data.filter(d => d.year === selectedYear);
        if (selectedRegion !== "All") {
            filteredData = filteredData.filter(d => d.continent === selectedRegion);
        }
        return filteredData;
    };

    const updateChart = (filteredData) => {
        const bubbles = svg.selectAll(".bubbles").data(filteredData, d => d.country);

        bubbles
            .transition().duration(200)
            .attr("cx", d => x(d.obesity))
            .attr("cy", d => y(d.death))
            .attr("r", d => z(d.pop))
            .style("fill", d => myColor(d.continent));

        bubbles.enter()
            .append("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.obesity))
            .attr("cy", d => y(d.death))
            .attr("r", d => z(d.pop))
            .style("fill", d => myColor(d.continent))
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
            .on("click", function(event, d) {
                updateInfoTable(d); // Update table on click
            });

        bubbles.exit().remove();
    };

    const render = () => updateChart(filterData());

    render();

    d3.select("#yearSlider").on("input", function() {
        selectedYear = +this.value;
        d3.select("#yearValue").text(selectedYear);
        render();
    });

    d3.select("#regionSelect").on("change", function() {
        selectedRegion = this.value;
        render();
    });

    // Add a legend for the regions below the x-axis
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width / 2 - 400}, ${height + 50})`); // Centered below the x-axis

    const regions = ["Eastern Europe", "Western Europe", "Northern Europe", "Southern Europe", "Central Europe"];

    // Create a legend item for each region
    regions.forEach((region, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(${i * 180}, 0)`); // Space each item horizontally

        // Add colored circle for each region
        legendRow.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 8)
            .style("fill", myColor(region));

        // Add text label for each region
        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 0)
            .attr("text-anchor", "start")
            .style("alignment-baseline", "middle")
            .text(region);
    });
});
