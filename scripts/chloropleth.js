function init(){

    const width = window.innerWidth;

    const height = window.innerHeight * 0.7;
    
    const projection = d3.geoNaturalEarth1()
                        .scale(180)
                        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select("#map")
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

    d3.select("#both").on("click", function() {
        currentDataset = '../data/chloropleth/Adults.csv'; //Change to Both dataset
        loadData(currentDataset);
    });

    d3.select("#male").on("click", function() {
        currentDataset = '../data/chloropleth/MaleAdults.csv'; //Change to Male dataset
        loadData(currentDataset);
    });

    d3.select("#female").on("click", function() {
        currentDataset = '../data/chloropleth/FemaleAdults.csv'; //Change to Female dataset
        loadData(currentDataset);
    });

    const colorScale = d3.scaleSequential()
                        .domain([0, 100]) 
                        .interpolator(d3.interpolateRgb("#B3FF5E", "#009E5B")); //Colour Choice

    function drawMap(year) {

        svg.selectAll(".country").remove(); //Clear previous map

        if (!yearData[year]) {
            console.warn(`No data available for year: ${year}`);
            return; 
        }

        const maxValue = d3.max(Object.values(yearData[2022]));

        colorScale.domain([0, maxValue]); //Update domain based on current year data

        svg.selectAll(".country")
            .data(geoData.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", d => {
                const value = yearData[year][d.properties.name];
                if (value === undefined || value === 0) {
                    return "#ccc"; //Gray for 0% or not available
                }
                return colorScale(value);
            })
            .on("mouseover", function(event, d) {
                const hoveredCountry = d.properties.name; //Get the hovered country name

                //Reduce opacity of other countries with transition
                svg.selectAll(".country")
                    .filter(function(d) {
                        return d.properties.name !== hoveredCountry;
                    })
                    .transition()
                    .duration(250) 
                    .attr("opacity", 0.3);

                const tooltip = d3.select("#tooltip");

                tooltip.transition()
                        .duration(250)
                        .style("opacity", 1);

                const value = yearData[year][hoveredCountry];
                
                const tooltipText = (value === undefined || value === 0) ? 
                    `${hoveredCountry}: Data not available` : 
                    `${hoveredCountry}: ${value}%`;

                tooltip.text(tooltipText)
                    .style("left", Math.min(event.pageX + 5, window.innerWidth 
                    - tooltip.node().getBoundingClientRect().width - 10) + "px")
                    .style("top", Math.min(event.pageY - 28, window.innerHeight 
                    - tooltip.node().getBoundingClientRect().height - 10) + "px");
            })
            .on("mouseout", function() {
                //Reset opacity of all countries with transition
                svg.selectAll(".country")
                    .transition()
                    .duration(250) 
                    .attr("opacity", 1);

                d3.select("#tooltip")
                    .transition()
                    .duration(250)
                    .style("opacity", 0);
            });

        updateLegend(maxValue);

    }

    const yearLabel = d3.select("#yearLabel");

    const slider = d3.sliderBottom()
                    .min(1990)
                    .max(2022)
                    .width(1000)
                    .ticks(33)
                    .step(1)
                    .default(2022)
                    .on('onchange', val => {
                        currentYear = Math.round(val); //Update currentYear
                        yearLabel.text(`Year: ${currentYear}`);
                        drawMap(currentYear);
                    });

    d3.select('#slider')
        .append('svg')
        .attr('width', '1060')
        .attr('height', '75')
        .append('g')
        .attr('transform', 'translate(30,30)')
        .call(slider);

    function updateLegend(maxValue) {

        d3.select("#legend")
            .selectAll("*")
            .remove();

        const legendWidth = 900;
        const legendHeight = 70;

        const legendSvg = d3.select("#legend").append("svg")
                            .attr("width", legendWidth)
                            .attr("height", legendHeight);

        const gradient = legendSvg.append("defs")
                                .append("linearGradient")
                                .attr("id", "gradient")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

        const grades = [0, maxValue / 4, maxValue / 2, (3 * maxValue) / 4, maxValue];

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
                    .attr("font-size", "12px")
                    .attr("text-anchor", "middle")
                    .attr("font-weight", "bold")
                    .attr("fill", "darkgreen");
        });

        const grayX = legendWidth - 150; //Move gray legend to the right of percentage legend

        legendSvg.append("rect")
            .attr("x", grayX)
            .attr("y", 30)
            .attr("width", 100)
            .attr("height", 10)
            .style("fill", "#ccc"); //Gray color

        legendSvg.append("text")
            .attr("x", grayX + 40) //Adjust spacing from the rectangle
            .attr("y", 25)
            .text("N/A")
            .attr("font-size", "12px")
            .attr("text-anchor", "start")
            .attr("fill", "darkgreen");

    }

    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight * 0.7;

        svg.attr("width", newWidth)
            .attr("height", newHeight)
            .attr("viewBox", `0 0 ${newWidth} ${newHeight}`);

        projection.translate([newWidth / 2, newHeight / 2]);

        drawMap(currentYear); //Use currentYear for redraw to maintain on currently select year
    });

}
window.onload = init;