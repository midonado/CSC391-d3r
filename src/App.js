/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import uuid from 'react-uuid'
import "./App.css";

export default function App() {
  // Setting up an empty state in a use effect allowed me to go through App before 
  // going through BarChart, allowing it to render properly. Potentially due to npm start
  const [dataset, setDataset] = useState(0);
  // const [preLoad, setPreLoad] = useState([]);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // preLoadData();

    const urlParams = new URLSearchParams(window.location.search)
    if(urlParams.has("size"))
      setDataset(urlParams.get("size"))

    setSessionId(uuid());
  }, [])

  const order = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - Math.random())

  const datasets = [
    [
      { fruit: "Banana", count: 40, color: "yellow" },
      { fruit: "Watermelon", count: 29, color: "lightcoral" },
      { fruit: "Coconut", count: 15, color: "saddlebrown" },
      { fruit: "Grape", count: 40, color: "rebeccapurple" },
      { fruit: "Kiwi", count: 45, color: "limegreen" },
      { fruit: "Orange", count: 56, color: "darkorange" },
      { fruit: "Strawberry", count: 32, color: "red" },
      { fruit: "Blueberry", count: 18, color: "blue" }],
    [
      { fruit: "Banana", count: 40, color: "yellow" },
      { fruit: "Blueberry", count: 18, color: "blue" },
      { fruit: "Orange", count: 56, color: "darkorange" },
      { fruit: "Strawberry", count: 32, color: "red" }
    ]];

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
        data={datasets[dataset]}
        dimensions={dimensions}
        order={order}
        sessionId={sessionId}
      />
    </div>
  );
}
