/** MultilineChart.js */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";

const BarChart = ({ data = [], dimensions = {} }) => {
    const [attrSlider, setAttrSlider] = useState({
        background: 0,
        bars: 0,
        border: 0,
        axis: 0
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

    const bars = ["#111",
        d => d.color,
        d => `url(#bg-gradient-${d.fruit})`,
        d => `url(#bg-img-${d.fruit})`]

    const strokeWeight = ["0px",
        "1px",
        "3px",
        "5px",]


    // Toggle Handle Functions
    //TODO: make less repetitive, pass attribute being toggled as prop?

    const handleBGChange = (event, bg) => {
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

    const drawAxisLines = (svg, x, y) => {
        svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))

        svg.append("g")
            .call(d3.axisLeft(y))

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
                .attr('stop-color', '#eee')
                .attr('offset', '100%');

            const bgImg = defs
                .append('pattern')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('width', x.bandwidth())
                .attr('height', x.bandwidth())
                .attr('x', 7.25 * i + 15)
                .attr('id', `bg-img-${d.fruit}`)

            bgImg.append('image')
                .attr('href', `./img/bg-${d.fruit}.png`)
                .attr('width', x.bandwidth())


            entry.append("rect")
                .attr("class", "bar")
                .attr("x", x(d.fruit))
                .attr("y", y(d.count))
                .attr("height", height - y(d.count))
                .attr("width", x.bandwidth())
        })

        d3.selectAll(".bar")
            .attr("fill", bars[attrSlider.bars])
            .style("stroke", "black")
            .style("stroke-width", strokeWeight[attrSlider.border])
            .style("stroke-dasharray", attrSlider.border === 3 ? "10" : "none")
    }

    useEffect(() => {
        const svg = svgEl
            // .style("background", attr.bgColorToggle ? attr.bgColor : "#fff")
            // .attr("class", attr.bgBorderToggle ? "bar-chart--border" : "bar-chart")
            .style("background", bgColors[attrSlider.background])
            .attr("class", "bar-chart")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const max = d3.max(data, d => d.count);

        const { x, y } = createAxes(max);

        drawEntries2D(svg, x, y);

        // if (!attr.barColorToggle)
        //     svg.selectAll(".bar").style("fill", attr.barColorDefault)


        // if (attr.barBorderToggle) {
        //     svg.selectAll(".bar")
        //         .style("stroke", attr.borderColor)
        // }

        // if (attr.showAxesToggle)
        drawAxes(attrSlider.axis, svg, x, y);


        // if (attr.showAxisTitleToggle)
        //     drawAxisTitle(svg, "Fruits", "Votes");


        // if (!attr.showAxisLableToggle)
        //     svg.selectAll(".tick").selectAll("text").attr("fill", "transparent")

        //TODO: include title + subtitle in useEffect

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, attrSlider]);

    return (<>
        <div className="toggles">
            <div className="toggle-container">
                <p>Background</p>
                <input
                    id="typeinp"
                    type="range"
                    min="0" max="3"
                    value={attrSlider.background}
                    onChange={handleBGChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Bars</p>
                <input
                    id="typeinp2"
                    type="range"
                    min="0" max="3"
                    value={attrSlider.bars}
                    onChange={handleBarChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Border</p>
                <input
                    id="typeinp2"
                    type="range"
                    min="0" max="3"
                    value={attrSlider.border}
                    onChange={handleBorderChange}
                    step="1" />
            </div>
            <div className="toggle-container">
                <p>Axes</p>
                <input
                    id="typeinp2"
                    type="range"
                    min="0" max="3"
                    value={attrSlider.axis}
                    onChange={handleAxisChange}
                    step="1" />
            </div>
        </div>
        <div className="chart-container">
            <svg ref={svgRef} width={svgWidth} height={svgHeight} />
        </div>
    </>);
};

export default BarChart;
