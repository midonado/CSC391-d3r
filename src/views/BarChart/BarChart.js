/** MultilineChart.js */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";

const BarChart = ({ data = [], dimensions = {} }) => {
    const [flag, setFlag] = useState(true);
    const [attr, setAttr] = useState({
        bgColorToggle: false, bgColor: "#aaa",
        bgBorderToggle: false, borderColor: "#000",
        barColorToggle: true, barColorDefault: "#222",
        barBorderToggle: false,
        showAxesToggle: true,
        showAxisTitleToggle: true,
        showAxisLableToggle: true,
        titleToggle: true, subtitleToggle: true
    });
    const svgRef = useRef(null);
    var { width, height, margin = {} } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements

    // Update Flag, Re-render Chart
    const updateArray = () => {
        setFlag(!flag);
    }

    // Toggle Handle Functions
    //TODO: make less repetitive, pass attribute being toggled as prop?
    const handleBgColorClick = () => {
        updateArray();
        const temp = attr;
        temp.bgColorToggle = !temp.bgColorToggle;
        setAttr(temp);
    }

    const handleBgBorderClick = () => {
        updateArray();
        const temp = attr;
        temp.bgBorderToggle = !temp.bgBorderToggle;
        setAttr(temp);
    }

    const handleBarColorClick = () => {
        updateArray();
        const temp = attr;
        temp.barColorToggle = !temp.barColorToggle;
        setAttr(temp);
    }

    const handleBarBorderClick = () => {
        updateArray();
        const temp = attr;
        temp.barBorderToggle = !temp.barBorderToggle;
        setAttr(temp);
    }

    const handleShowAxesClick = () => {
        updateArray();
        const temp = attr;
        temp.showAxesToggle = !temp.showAxesToggle;
        setAttr(temp);
    }

    const handleShowAxisTitleClick = () => {
        updateArray();
        const temp = attr;
        temp.showAxisTitleToggle = !temp.showAxisTitleToggle;
        setAttr(temp);
    }

    const handleShowAxisLablesClick = () => {
        updateArray();
        const temp = attr;
        temp.showAxisLableToggle = !temp.showAxisLableToggle;
        setAttr(temp);
    }

    // Draw Chart Functions

    const createAxes = (max) => {
        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.fruit).sort());

        var y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, max]);

        return { x, y }
    }

    const drawAxes = (svg, x, y) => {
        svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))

        svg.append("g")
            .call(d3.axisLeft(y))
    }

    const drawAxisTitle = (svg, x, y) => {
        // Horizontal Axis Label
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom * 0.65)
            .text(x);

        // Vertical Axis Label
        svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left * 0.55)
            .text(y);
    }

    const drawEntries2D = (svg, x, y) => {
        const entries = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

        entries.each(function (d, i) {
            const entry = d3.select(this);
            entry.append("rect")
                .attr("class", "bar")
                .attr("x", x(d.fruit))
                .attr("y", y(d.count))
                .attr("height", height - y(d.count))
                .attr("width", x.bandwidth())
                .style("fill", d => d.color)
        })
    }

    useEffect(() => {
        const svg = svgEl
            .style("background", attr.bgColorToggle ? attr.bgColor : "#fff")
            .attr("class", attr.bgBorderToggle ? "bar-chart--border" : "bar-chart")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const max = d3.max(data, d => d.count);

        const { x, y } = createAxes(max);

        drawEntries2D(svg, x, y);

        if (!attr.barColorToggle)
            svg.selectAll(".bar").style("fill", attr.barColorDefault)


        if (attr.barBorderToggle) {
            svg.selectAll(".bar")
                .style("stroke", attr.borderColor)
        }

        if (attr.showAxesToggle)
            drawAxes(svg, x, y);


        if (attr.showAxisTitleToggle)
            drawAxisTitle(svg, "Fruits", "Votes");


        if (!attr.showAxisLableToggle)
            svg.selectAll(".tick").selectAll("text").attr("fill", "transparent")

        //TODO: include title + subtitle in useEffect

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, flag]);

    return (<>
        <div className="toggles">
            <button onClick={handleBgColorClick} >
                Background Color
            </button>
            <button onClick={handleBgBorderClick} >
                Background Border
            </button>
            <button onClick={handleBarColorClick} >
                Bar Color
            </button>
            <button onClick={handleBarBorderClick} >
                Bar Borders
            </button>
            <button onClick={handleShowAxesClick} >
                Show Axes
            </button>
            <button onClick={handleShowAxisTitleClick} >
                Show Axis Titles
            </button>
            <button onClick={handleShowAxisLablesClick} >
                Show Axis Data Lables
            </button>
            {/* <button onClick={handleShowTitleClick} >
                Show Chart Title
            </button>
            <button onClick={handleShowSubtitleClick} >
                Show Chart Subitles
            </button> */}
        </div>
        <div className="chart-container">
            {/* <div>
                {attr.titleToggle && <h1>Favorite Fruit Survey</h1>}
                {attr.subtitleToggle && <h3>hello</h3>}
            </div> */}
            <svg ref={svgRef} width={svgWidth} height={svgHeight} />
        </div>
    </>);
};

export default BarChart;
