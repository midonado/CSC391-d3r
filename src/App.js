/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./views/BarChart/BarChart";
import "./App.css";
// import csvFile from "./data/dataFromClass.csv";
// import * as d3 from "https://cdn.skypack.dev/d3@7";

export default function App() {


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
        attributes={attr}
        dimensions={dimensions}
      />
    </div>
  );
}
