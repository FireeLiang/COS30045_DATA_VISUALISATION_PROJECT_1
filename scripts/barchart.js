function init() {

    var width = window.innerWidth;
    var height = window.innerHeight * 0.7;

    var projection = d3.geoNaturalEarth1()
                        .scale(180)
                        .translate([width / 2, height / 2]);

    var path = d3.geoPath().projection(projection);

    var svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .style("width", "100%")
                .style("height", "auto");

    let yearData = {};
    let currentDataset = '../data/chloropleth/Adults.csv'; //Default dataset
    let currentYear = 2022; //Initialize with default year
    let geoData;

    function loadData(dataset) {

        Promise.all([
            d3.json('../data/chloropleth/world.geojson'),
            d3.csv(dataset)
        ]).then(([loadedGeoData, csvData]) => {
            geoData = loadedGeoData; //Assign the loaded GeoJSON to the global variable
            yearData = {}; //Reset yearData
            csvData.forEach(d => {
                if (!yearData[d.year]) yearData[d.year] = {};
                yearData[d.year][d.country] = +d.percentage;
            });

            drawMap(currentYear); //Draw map with the current year after loading data

        }).catch(error => {
            console.error("Data loading error:", error);
            d3.select("#map")
                .text("Error loading data. Please check the console for more details.");
        });

    }

    //Initial load with the default dataset (Both)
    loadData(currentDataset);

    //Dataset change based on the button clicks
    d3.select("#both")
        .on("click", function() {
            d3.select("#both")
                .style('opacity', '1');
            d3.select("#male")
                .style('opacity', '0.75');
            d3.select("#female")
                .style('opacity', '0.75');
            currentDataset = '../data/chloropleth/Adults.csv'; //Change to Both dataset
            loadData(currentDataset);
        });

    d3.select("#male")
        .on("click", function() {
            d3.select("#both")
                .style('opacity', '0.75');
            d3.select("#male")
                .style('opacity', '1');
            d3.select("#female")
                .style('opacity', '0.75');
            currentDataset = '../data/chloropleth/MaleAdults.csv'; //Change to Male dataset
            loadData(currentDataset);
        });

    d3.select("#female")
        .on("click", function() {
            d3.select("#both")
                .style('opacity', '0.75');
            d3.select("#male")
                .style('opacity', '0.75');
            d3.select("#female")
                .style('opacity', '1');
            currentDataset = '../data/chloropleth/FemaleAdults.csv'; //Change to Female dataset
            loadData(currentDataset);
        });

    var colorScale = d3.scaleSequential()
                        .domain([0, 100])
                        .interpolator(d3.interpolateRgb("#B3FF5E", "#009E5B")); //Color choice

    //Hide tooltip when drawing the map
    function resetTooltip() {
        d3.select("#tooltip")
            .transition()
            .duration(250)
            .style("opacity", 0); 
    }

    function drawMap(year) {
        resetTooltip(); 

        //Select the countries and bind data
        var countries = svg.selectAll(".country")
                            .data(geoData.features);

        //Append new paths for countries that don't exist yet (enter selection)
        countries.enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                .attr("fill", d => {
                    var value = yearData[year][d.properties.name];
                    if (value === undefined || value === 0) {
                        return "#ccc"; //Gray for 0% or not available
                    }
                    return colorScale(value);
                })
                .on("mouseover", function(event, d) {
                    var hoveredCountry = d.properties.name;

                    //Reduce opacity of other countries
                    svg.selectAll(".country")
                        .filter(function(d) {
                            return d.properties.name !== hoveredCountry;
                        })
                        .transition()
                        .duration(250)
                        .attr("opacity", 0.3);

                    var tooltip = d3.select("#tooltip");

                    tooltip.transition()
                        .duration(250)
                        .style("opacity", 1);

                    //Get the value for the current year
                    var value = yearData[currentYear][hoveredCountry]; //Use currentYear here

                    //Display the tooltip with the current year's data
                    var tooltipText = (value === undefined || value === 0) ? 
                        `${hoveredCountry}: Data not available` : 
                        `${hoveredCountry}: ${value}%`;

                    tooltip.text(tooltipText)
                        .style("left", Math.min(event.pageX + 5, window.innerWidth 
                        - tooltip.node().getBoundingClientRect().width - 10) + "px")
                        .style("top", Math.min(event.pageY - 28, window.innerHeight 
                        - tooltip.node().getBoundingClientRect().height - 10) + "px");
                })
                .on("mouseout", function() {
                    //Reset opacity of all countries
                    svg.selectAll(".country")
                        .transition()
                        .duration(250)
                        .attr("opacity", 1);

                    d3.select("#tooltip")
                        .transition()
                        .duration(250)
                        .style("opacity", 0); //Hide tooltip on mouseout
                })
                .merge(countries)  //Merge the enter selection with the update selection
                .attr("fill", d => {
                    var value = yearData[year][d.properties.name];
                    if (value === undefined || value === 0) {
                        return "#ccc"; //Gray for 0% or not available
                    }
                    return colorScale(value);
                });

        //Handle the exit selection (countries that no longer exist in the data)
        countries.exit()
                .transition()
                .duration(250)
                .attr("opacity", 0)
                .remove();

        updateLegend(); //Update legend with maxValue
    }

    var yearLabel = d3.select("#yearLabel");

    var slider = d3.sliderBottom()
                    .min(1990)
                    .max(2022)
                    .width(1000)
                    .ticks(11)
                    .step(1)
                    .default(2022)
                    .on('onchange', val => {
                        currentYear = Math.round(val); //Update currentYear
                        yearLabel.text(`Year: ${currentYear}`);
                        drawMap(currentYear); //Redraw map with new year
                    });

    d3.select('#slider')
        .append('svg')
        .attr('width', '1060')
        .attr('height', '75')
        .append('g')
        .attr('transform', 'translate(30,30)')
        .call(slider);

    function updateLegend() {
        d3.select("#legend")
            .selectAll("*")
            .remove();

        var legendWidth = 900;
        var legendHeight = 70;

        var legendSvg = d3.select("#legend").append("svg")
                            .attr("width", legendWidth)
                            .attr("height", legendHeight);

        var gradient = legendSvg.append("defs")
                                .append("linearGradient")
                                .attr("id", "gradient")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

        var grades = [0, 25, 50, 75, 100];

        grades.forEach((grade, i) => {
            gradient.append("stop")
                    .attr("offset", (i / (grades.length - 1)) * 100 + "%")
                    .attr("stop-color", colorScale(grade));
        });

        gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#ccc"); //Gray color for 0% or not available

        legendSvg.append("text")
                .attr("x", 10)
                .attr("y", 35)
                .text("Percentage Legend (%)")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .attr("fill", "darkgreen");

        legendSvg.append("rect")
                .attr("x", 200)
                .attr("y", 30)
                .attr("width", legendWidth - 400)
                .attr("height", 10)
                .style("fill", "url(#gradient)");

        grades.forEach((grade, i) => {
            legendSvg.append("text")
                    .attr("x", 200 + (i / (grades.length - 1)) * (legendWidth - 400))
                    .attr("y", 25)
                    .text(Math.round(grade))
                    .attr("font-size", "0.75em")
                    .attr("text-anchor", "middle")
                    .attr("font-weight", "bold")
                    .attr("fill", "darkgreen");
        });

        var grayX = legendWidth - 150; //Move gray legend to the right of percentage legend

        legendSvg.append("rect")
            .attr("x", grayX)
            .attr("y", 30)
            .attr("width", 100)
            .attr("height", 10)
            .style("fill", "#ccc"); //Gray color

        legendSvg.append("text")
            .attr("x", grayX + 40) //Adjust spacing from the colored legend
            .attr("y", 25)
            .text("N/A")
            .attr("font-size", "0.75em")
            .attr("text-anchor", "start")
            .attr("fill", "darkgreen");
    }

    window.addEventListener('resize', () => {
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight * 0.7;

        svg.attr("width", newWidth)
            .attr("height", newHeight)
            .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);

        projection.translate([newWidth / 2, newHeight / 2]);

        drawMap(currentYear); //Use currentYear for redraw to maintain on currently selected year
    });
}

window.onload = init;
