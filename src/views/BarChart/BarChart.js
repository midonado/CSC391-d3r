/** MultilineChart.js */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";

const BarChart = ({ data = [], dimensions = {} }) => {
    const [flag, setFlag] = useState(true);
    const [attr, setAttr] = useState({
        bgColorToggle: false, bgColor: "#aaa",
        barColorToggle: true, barColorDefault: "#333",
    });
    const svgRef = useRef(null);
    const { width, height, margin = {} } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements

    const updateArray = () => {
        setFlag(!flag);
    }

    const handleBgColorClick = () => {
        updateArray();
        const temp = attr;
        temp.bgColorToggle = !temp.bgColorToggle;
        setAttr(temp);
    }

    const handleBarColorClick = () => {
        updateArray();
        const temp = attr;
        temp.barColorToggle = !temp.barColorToggle;
        setAttr(temp);
    }

    const drawEntries = (svg, x, y) => {
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
                .style("fill", attr.barColorToggle ? d => d.color : attr.barColorDefault)
                .attr("stroke", "black")
        })
    }

    useEffect(() => {
        const svg = svgEl
            .style("background", attr.bgColorToggle ? attr.bgColor : "#fff")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const max = d3.max(data, d => d.count);

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.fruit).sort());

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, max]);

        drawEntries(svg, x, y);

        svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))

        svg.append("g")
            .call(d3.axisLeft(y))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, flag]);

    return (<>
        <svg ref={svgRef} width={svgWidth} height={svgHeight} />

        <div className="toggles">
            <button onClick={handleBgColorClick} >
                Background Color
            </button>
            <button onClick={handleBarColorClick} >
                Bar Color
            </button>
        </div>
    </>);
};

export default BarChart;
