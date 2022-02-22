/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import "./App.css";
import * as d3 from "https://cdn.skypack.dev/d3@7";
import { csv } from "https://cdn.skypack.dev/d3-fetch@3";
import csvFile from "./data/dataFromClass.csv";

export default function App() {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchCSV = async (dataAddress) => {
      const csvObj = d3.dsv(",", dataAddress, (d) => {
        return {
          lines: +d.lines,
          time: +d.time,
          highlight: d.hihlight === "TRUE"
        };
      });

      setRawData(csvObj);
    }

    fetchCSV(csvFile);
  }, []);

  console.log(rawData);

  // const id = (d) => d.lines + "_" + d.highlight;

  // let avgData = {}

  // rawData.forEach(d => {
  //   console.log(d);
  // });

  // rawData.forEach(d => {
  //   const curID = id(d);

  //   if (!avgData.hasOwnProperty(curID)) {
  //     avgData[curID] = {
  //       lines: d.lines,
  //       times: [],
  //       highlight: d.highlight,
  //       label: curID
  //     };
  //   }

  //   avgData[curID].times.push(d.time);
  // });

  // avgData.forEach(d => {
  //   d.time = d3.mean(d.times)
  // });

  // console.log(avgData);

  // avgData.sort((a, b) => {
  //   if (a.lines === b.lines)
  //     return d3.descending(a.highlight, b.highlight)
  //   else
  //     return d3.ascending(a.lines, b.lines)
  // });

  // const max = d3.max(avgData, d => d.time);

  const dimensions = {
    width: 960,
    height: 500,
    margin: {
      top: 20,
      right: 20,
      bottom: 35,
      left: 40
    }
  }
  return (
    <div className="App">
      <BarChart
        data={[{ time: 5, label: "true" }, { time: 4, label: "false" }]}
        dimensions={dimensions}
        max={5}
      />
    </div>
  );
}
