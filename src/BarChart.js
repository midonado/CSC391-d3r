/** MultilineChart.js */
import React, { useRef, useEffect, useState } from "react";
import axios from 'axios';
import * as d3 from "d3";
import Slider from "./Slider";

const BarChart = ({ data = [], dimensions = {}, order = [], sessionId = "", prompt }) => {
    const [attrSlider, setAttrSlider] = useState({
        background: 0,
        bars: 0,
        border: 0,
        axis: 0,
        gridline: 0,
        dimension: 0,
        submitted: false
    })

    const svgRef = useRef(null);
    var { width, height, depth, margin = {} } = dimensions;
    const svgWidth = width + margin.left + margin.right,
        svgHeight = height + margin.top + margin.bottom;

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements

    const bgColors = ["#fff",
        "#ddd",
        "linear-gradient(yellow, red)",
        "url('./img/fruit-texture.jpg')"]

    const bars = ["#333",
        d => d.color,
        d => `url(#bg-gradient-${d.fruit})`,
        d => `url(#bg-img-${d.fruit})`]

    const strokeWeight = ["0px",
        "1px",
        "3px",
        "5px",]
    // Toggle Handle Functions

    const postSubmit = async (values) => {
        try {
            await axios.post('https://workplace.rc.davidson.edu/api/data/attrsubmit',
                {
                    "background": values.background,
                    "bars": values.bars,
                    "border": values.border,
                    "axis": values.axis,
                    "gridline": values.gridline,
                    "dimension": values.dimension,
                    "datasetSize": data.length,
                    "initValue": "min",
                    "prompt": prompt,
                    "sessionId": sessionId
                });
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleSubmit = () => {
        const temp = attrSlider
        postSubmit(temp)
        temp.submitted = true
        setAttrSlider({ ...temp });
    }

    const postChange = async (label, value) => {
        try {
            await axios.post('https://workplace.rc.davidson.edu/api/data/attrchange',
                {
                    "attribute": label,
                    "value": value,
                    "datasetSize": data.length,
                    "initValue": "min",
                    "prompt": prompt,
                    "sessionId": sessionId
                });
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleBGChange = (event) => {
        postChange("Background", event.target.value);
        const temp = attrSlider
        temp.background = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleBarsChange = (event) => {
        postChange("Bars", event.target.value);
        const temp = attrSlider
        temp.bars = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleBorderChange = (event) => {
        postChange("Border", event.target.value);
        const temp = attrSlider
        temp.border = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleAxisChange = (event) => {
        postChange("Axes", event.target.value);
        const temp = attrSlider
        temp.axis = parseInt(event.target.value)

        setAttrSlider({ ...temp });
    }
    const handleGLChange = (event) => {
        postChange("Gridline", event.target.value);
        const temp = attrSlider
        temp.gridline = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }
    const handleDimensionChange = (event) => {
        postChange("Dimension", event.target.value);
        const temp = attrSlider
        temp.dimension = parseInt(event.target.value)
        setAttrSlider({ ...temp });
    }

    var sliderProps = [
        {
            label: "Background",
            initialValue: attrSlider.background,
            onChangeFunc: handleBGChange,
            min: 0,
            max: 3
        },
        {
            label: "Bars",
            initialValue: attrSlider.bars,
            onChangeFunc: handleBarsChange,
            min: 0,
            max: 3
        },
        {
            label: "Border",
            initialValue: attrSlider.border,
            onChangeFunc: handleBorderChange,
            min: 0,
            max: 3
        },
        {
            label: "Axes",
            initialValue: attrSlider.axis,
            onChangeFunc: handleAxisChange,
            min: 0,
            max: 3
        },
        {
            label: "Gridline",
            initialValue: attrSlider.gridline,
            onChangeFunc: handleGLChange,
            min: 0,
            max: 3
        },
        {
            label: "Dimension",
            initialValue: attrSlider.dimension,
            onChangeFunc: handleDimensionChange,
            min: 0,
            max: 2
        }
    ]

    const sliders = sliderProps.map(d => Slider(d.label, d.initialValue, d.onChangeFunc, d.min, d.max))

    // Axes Functions
    const createAxes = (max) => {
        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.fruit));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, max]);

        return { x, y }
    }

    const drawAxisLines = (svg, x, y) => {
        svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .attr("class", "x-grid")
            .call(d3.axisBottom(x))

        svg.append("g")
            .attr("class", "y-grid")
            .call(d3.axisLeft(y))
    }

    const drawAxisTitle = (svg, x, y) => {
        // Horizontal Axis Label
        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom * 0.8)
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
                svg.selectAll(".tick").selectAll("text").attr("fill", "transparent");
                svg.selectAll(".x-grid").selectAll(".tick").attr("opacity", 0);
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
        const yGrid = d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
            .ticks(10)

        svg.append('g')
            .attr('class', 'gridline')
            .call(yGrid);

        d3.selectAll('.gridline').selectAll('.tick').select('line')
            .style('stroke-width', strokeWeight[attrSlider.gridline])
            .style('opacity', 0.33 * attrSlider.gridline)

        if (attrSlider.dimension === 2) {
            const gridline = d3.selectAll('.gridline')
            const ticks = gridline.selectAll('.tick')

            ticks.select('line')
                .attr('transform', 'translate(' + depth + ',' + -depth / 2 + ')')

            ticks.append('line')
                .attr('x2', depth)
                .attr('y2', -depth / 2)
                .style('stroke', 'black')
                .style('stroke-width', strokeWeight[attrSlider.gridline])
                .style('opacity', 0.33 * attrSlider.gridline);
        }

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
        d3.selectAll(".shade-right")
            .attr("fill", "black")
            .attr("opacity", 0.5)

        d3.selectAll(".shade-top")
            .attr("fill", "black")
            .attr("opacity", 0.2)
    }

    const definePatterns = (entry, d, x) => {
        const defs = entry.append('defs');

        const bgGradient = defs
            .append('linearGradient')
            .attr('id', `bg-gradient-${d.fruit}`)
            .attr('gradientTransform', 'rotate(90)');
        bgGradient
            .append('stop')
            .attr('stop-color', d.color)
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

        var shadeRight = {
            face: "shade-right",
            points:
                `${right},${top} ${right + depth},${top - depth / 2} 
                ${right + depth},${bot - depth / 2} ${right},${bot}`
        }

        var shadeTop = {
            face: "shade-top",
            points:
                `${left},${top} ${right},${top} ${right + depth},${top - depth / 2} 
                ${left + depth},${top - depth / 2}`
        }

        const faces = [frontFace, topFace, rightFace, shadeRight, shadeTop];

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

            const faces = getFaces(x(d.fruit), y(d.count), barW, barH, depth)

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
        console.log(prompt);

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
        drawAxes(attrSlider.axis, svg, x, y);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, attrSlider]);

    return (<>
        {!attrSlider.submitted && <div className="toggles">
            {order.map(d => sliders[d])}
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>}
        <div className="chart-container">
            <svg ref={svgRef} width={svgWidth} height={svgHeight} />
        </div>
    </>);
};

export default BarChart;
