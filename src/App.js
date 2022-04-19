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

  const order = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - Math.random())

  const fruitData = [
    { fruit: "Banana", count: 40, color: "yellow" },
    { fruit: "Blueberry", count: 18, color: "blue" },
    { fruit: "Coconut", count: 15, color: "saddlebrown" },
    { fruit: "Grape", count: 40, color: "rebeccapurple" },
    { fruit: "Kiwi", count: 45, color: "limegreen" },
    { fruit: "Orange", count: 56, color: "darkorange" },
    { fruit: "Strawberry", count: 32, color: "red" },
    { fruit: "Watermelon", count: 29, color: "lightcoral" }];

  const fruitDataSmall = [
    { fruit: "Banana", count: 40, color: "yellow" },
    { fruit: "Blueberry", count: 18, color: "blue" },
    { fruit: "Orange", count: 56, color: "darkorange" },
    { fruit: "Strawberry", count: 32, color: "red" }];

  const dimensions = {
    width: 960,
    height: 500,
    depth: 40,
    margin: {
      top: 50,
      right: 50,
      bottom: 70,
      left: 70
    }
  }

  return (
    <div className="App">
      <BarChart
        data={fruitData}
        dimensions={dimensions}
        order={order}
      />
    </div>
  );
}
