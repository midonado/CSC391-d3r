/** MultilineChart.js */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";
// import Bar3d from "./Bar3d.js";

const BarChart = ({ data = [], dimensions = {} }) => {
    const [attrSlider, setAttrSlider] = useState({
        background: 0,
        bars: 0,
        border: 0,
        axis: 0,
        gridline: 0,
        dimension: 0
    })

    const svgRef = useRef(null);
    var { width, height, margin = {} } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements

    const bgColors = ["#fff",
        "#aaa",
        "linear-gradient(#e66465, #9198e5)",
        "url('./img/fruit-texture.jpg') repeat"]

    const bars = ["#333",
        d => d.color,
        d => `url(#bg-gradient-${d.fruit})`,
        d => `url(#bg-img-${d.fruit})`]

    const strokeWeight = ["0px",
        "1px",
        "3px",
        "5px",]

    // Toggle Handle Functions
    //TODO: make less repetitive, pass attribute being toggled as prop?

    const handleBGChange = (event) => {
        const temp = attrSlider
        temp.background = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleBarChange = (event) => {
        const temp = attrSlider
        temp.bars = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleBorderChange = (event) => {
        const temp = attrSlider
        temp.border = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleAxisChange = (event) => {
        const temp = attrSlider
        temp.axis = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleGLChange = (event) => {
        const temp = attrSlider
        temp.gridline = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleDimensionChange = (event) => {
        const temp = attrSlider
        temp.dimension = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }

    // Axes Functions

    const createAxes = (max) => {
        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.fruit).sort());

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, max]);

        return { x, y }
    }

    const drawAxisLines = (svg, x, y) => {
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

    const drawAxes = (level, svg, x, y) => {
        switch (level) {
            case 1:
                drawAxisLines(svg, x, y);
                svg.selectAll(".tick").selectAll("text").attr("fill", "transparent")
                break;

            case 2:
                drawAxisLines(svg, x, y);
                break;

            case 3:
                drawAxisLines(svg, x, y);
                drawAxisTitle(svg, "Fruits", "Votes");
                break;

            default:
                break;
        }
    }

    const drawGridlines = (svg, y) => {
        const yGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(10);

        svg.append('g')
            .attr('class', 'y axis-grid')
            .call(yGrid);

        d3.selectAll('line')
            .style('stroke-width', strokeWeight[attrSlider.gridline])
            .style('opacity', 0.3)

        svg.selectAll('.domain').remove()
    }

    // Entries function
    const fillBars = () => {
        d3.selectAll(".bar")
            .attr("fill", bars[attrSlider.bars])
            .style("stroke", "black")
            .style("stroke-width", strokeWeight[attrSlider.border])
            .style("stroke-dasharray", attrSlider.border === 3 ? "10" : "none")

        if (attrSlider.bars === 2) {
            d3.selectAll(".top")
                .attr("fill", bars[1])
        }
    }

    const shadeBars = () => {
        d3.selectAll(".shade")
            .attr("fill", "black")
            .attr("opacity", 0.5)

    }

    const definePatterns = (entry, d, x) => {
        const defs = entry.append('defs');

        const bgGradient = defs
            .append('linearGradient')
            .attr('id', `bg-gradient-${d.fruit}`)
            .attr('gradientTransform', 'rotate(90)');
        bgGradient
            .append('stop')
            .attr('stop-color', d => d.color)
            .attr('offset', '0%');
        bgGradient
            .append('stop')
            .attr('stop-color', '#fff')
            .attr('offset', '100%');

        const bgImg = defs
            .append('pattern')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', x.bandwidth())
            .attr('height', x.bandwidth())
            .attr('x', x(d.fruit))
            .attr('id', `bg-img-${d.fruit}`)
        bgImg.append('image')
            .attr('href', `./img/bg-${d.fruit}.png`)
            .attr('width', x.bandwidth())
    }


    const getFaces = (x, y, width, height, depth) => {
        var left = x;
        var right = left + width;
        var top = y;
        var bot = top + height;

        var frontFace = {
            face: "front",
            points:
                `${left},${top} ${left},${bot} ${right},${bot} ${right},${top}`
        }

        var topFace = {
            face: "top",
            points:
                `${left},${top} ${right},${top} ${right + depth},${top - depth / 2} 
                ${left + depth},${top - depth / 2}`
        }

        var rightFace = {
            face: "right",
            points:
                `${right},${top} ${right + depth},${top - depth / 2} 
                ${right + depth},${bot - depth / 2} ${right},${bot}`
        }

        var shade = {
            face: "shade",
            points:
                `${right},${bot} ${right + depth},${bot - depth / 2} 
                ${right + depth},${top - depth / 2} ${left + depth},${top - depth / 2} 
                ${left},${top} ${right},${top}`
        }

        const faces = [frontFace, topFace, rightFace, shade];

        return faces;
    }

    const draw2DEntries = (svg, x, y) => {
        const entries = svg.selectAll(".bar-chart-g")
            .data(data)
            .enter()
            .append("g");

        entries.each(function (d, i) {
            const entry = d3.select(this);

            definePatterns(entry, d, x)

            entry.append("rect")
                .attr("class", "bar")
                .attr("x", x(d.fruit))
                .attr("y", y(d.count))
                .attr("height", height - y(d.count))
                .attr("width", x.bandwidth())
        })

        fillBars();
    }

    const draw3DEntries = (svg, x, y) => {
        const entries = svg.selectAll(".bar-chart-g")
            .data(data)
            .enter()
            .append("g");

        entries.each(function (d, i) {
            const entry = d3.select(this);

            definePatterns(entry, d, x)

            const barH = height - y(d.count),
                barW = x.bandwidth();

            const faces = getFaces(x(d.fruit), y(d.count), barW, barH, 50)

            faces.forEach(d => {
                entry.append("polygon")
                    .attr("class", `bar ${d.face}`)
                    .attr("points", d.points)
                    .attr("fill", "transparent")
            });

            fillBars();
        })
    }

    const drawEntries = (dimension, svg, x, y) => {
        switch (dimension) {
            case 0:
                draw2DEntries(svg, x, y);
                break;

            case 1:
                draw2DEntries(svg, x, y);
                d3.selectAll(".bar")
                    .style("filter", "drop-shadow(0 0 1rem rgb(0 0 0 / 0.5))")

                break;

            case 2:
                draw3DEntries(svg, x, y);
                shadeBars();
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        const svg = svgEl
            .style("background", bgColors[attrSlider.background])
            .attr("class", "bar-chart")
            .append("g")
            .attr("class", "bar-chart-g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const max = d3.max(data, d => d.count);

        const { x, y } = createAxes(max);

        drawGridlines(svg, y);
        drawEntries(attrSlider.dimension, svg, x, y);
        // draw3DEntries(svg, x, y);
        drawAxes(attrSlider.axis, svg, x, y);

        //TODO: include title + subtitle in useEffect

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, attrSlider]);

    return (<>
        <div className="toggles">
            <div className="toggle-container">
                <p>Background</p>
                <input
                    type="range"
                    min="0" max="3"
                    value={attrSlider.background}
                    onChange={handleBGChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Bars</p>
                <input
                    type="range"
                    min="0" max="3"
                    value={attrSlider.bars}
                    onChange={handleBarChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Border</p>
                <input
                    type="range"
                    min="0" max="3"
                    value={attrSlider.border}
                    onChange={handleBorderChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Axes</p>
                <input
                    type="range"
                    min="0" max="3"
                    value={attrSlider.axis}
                    onChange={handleAxisChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Gridline</p>
                <input
                    type="range"
                    min="0" max="3"
                    value={attrSlider.gridline}
                    onChange={handleGLChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Dimension</p>
                <input
                    type="range"
                    min="0" max="2"
                    value={attrSlider.dimension}
                    onChange={handleDimensionChange}
                    step="1" />
            </div>

        </div>
        <div className="chart-container">
            <svg ref={svgRef} width={svgWidth} height={svgHeight} />
        </div>
    </>);
};

export default BarChart;
