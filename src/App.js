/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./views/BarChart/BarChart";
import "./App.css";
// import csvFile from "./data/dataFromClass.csv";
import * as d3 from "https://cdn.skypack.dev/d3@7";
import csvFile from "./data/dataFromClass.csv";

export default function App() {
  const [data, setData] = useState([]);
  const id = (d) => d.lines + "_" + d.highlight;

  const fetchCSV = async (dataAddress) => {
    const arr = [];
    const visited = [];
    const visIndex = [];

    d3.dsv(",", dataAddress, (d) => {
      const label = id(d);

      if (!visited.includes(label)) {
        visited.push(label);
        visIndex.push(arr.length - 1)

        arr.push({
          lines: +d.lines,
          times: [+d.time],
          highlight: d.highlight === "TRUE" ? true : false,
          label: id(d)
        });
      }
      else {
        let index = visited.indexOf(label);
        arr[index].times.push(+d.time);
        arr[index].time += +d.time;
      }
    });

    setData(arr);
  }

  useEffect(() => {
    fetchCSV(csvFile);
  }, [])

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

  const attr = [{ color: "red" }]

  return (
    <div className="App">
      <BarChart
        data={data}
        attributes={attr}
        dimensions={dimensions}
      />
    </div>
  );
}
