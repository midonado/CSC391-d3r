/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import uuid from 'react-uuid'
import "./App.css";

export default function App() {
  // Setting up an empty state in a use effect allowed me to go through App before 
  // going through BarChart, allowing it to render properly. Potentially due to npm start
  const [dataset, setDataset] = useState(0);
  const [prompt, setPrompt] = useState('news');
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("size"))
      setDataset(urlParams.get("size"))

    if (urlParams.has("prompt"))
      setPrompt(urlParams.get("prompt"))

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
    width: 500,
    height: 290,
    depth: 20,
    margin: {
      top: 25,
      right: 30,
      bottom: 50,
      left: 45
    }
  }

  return (
    <div className="App">
      <BarChart
        data={datasets[dataset]}
        dimensions={dimensions}
        order={order}
        sessionId={sessionId}
        prompt={prompt}
      />
    </div>
  );
}
