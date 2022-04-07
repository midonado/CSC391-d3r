/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import "./App.css";

export default function App() {
  // Setting up an empty state in a use effect allowed me to go through App before 
  // going through BarChart, allowing it to render properly. Potentially due to npm start
  const [preLoad, setPreLoad] = useState([]);

  const preLoadData = async () => {
    setPreLoad([]);
  }

  useEffect(() => {
    preLoadData();
  }, [])

  const fruitData = [
    { fruit: "Banana", count: 40, color: "yellow" },
    { fruit: "Strawberry", count: 32, color: "red" },
    { fruit: "Blueberry", count: 18, color: "blue" },
    { fruit: "Mango", count: 56, color: "orange" },
    { fruit: "Pineapple", count: 45, color: "green" },
    { fruit: "Grape", count: 40, color: "rebeccapurple" }];

  const dimensions = {
    width: 960,
    height: 500,
    margin: {
      top: 20,
      right: 40,
      bottom: 60,
      left: 60
    }
  }

  return (
    <div className="App">
      <BarChart
        data={fruitData}
        dimensions={dimensions}
      />
    </div>
  );
}
