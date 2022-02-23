/** MultilineChart.js */
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "https://cdn.skypack.dev/d3@7";

const BarChart = ({ data = [], elements = [], dimensions = {} }) => {
    const svgRef = useRef(null);
    const { width, height, margin = {} } = dimensions;
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const svgEl = d3.select(svgRef.current)
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements

    const svg = svgEl
        .attr("class", "bar-chart")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    useEffect(() => {
        data.forEach(d => {
            d.time = d3.mean(d.times);
        })

        console.log(data);

        const max = d3.max(data, d => d.time);

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .domain(data.map(d => d.label));

        const y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, max]);

        const entries = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

        entries.each(function (d, i) {
            const entry = d3.select(this);
            entry.append("rect")
                .attr("class", "bar")
                .attr("x", x(d.label))
                .attr("y", y(d.time))
                .attr("height", height - y(d.time))
                .attr("width", x.bandwidth())
                .style("fill", !d.highlight ? "#fff" : "#333")
                .attr("stroke", "black")
        })

        svg.append("g")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(x))

        svg.append("g")
            .call(d3.axisLeft(y))
    }, [elements]);

    return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default BarChart;
