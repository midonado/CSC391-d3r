/** App.js */
import React, { useState, useEffect } from "react";
import BarChart from "./views/BarChart/BarChart";
import "./App.css";

export default function App() {
  // Setting up an empty state in a use effect allowed me to go through App before 
  // going through BarChart, allowing it to render properly. Potentially due to npm start
  const [preLoad, setPreLoad] = useState([]);

  const preLoadData = async (dataAddress) => {
    setPreLoad([]);
  }

  useEffect(() => {
    preLoadData();
  }, [])

  // const data = [
  //   { highlight: true, label: '1_TRUE', time: 3.477368421052631 },
  //   { highlight: false, label: '4_FALSE', time: 36.59315789473684 },
  //   { highlight: false, label: '2_FALSE', time: 31.410526315789472 },
  //   { highlight: false, label: '3_FALSE', time: 22.92684210526316 },
  //   { highlight: true, label: '4_TRUE', time: 3.3436842105263156 },
  //   { highlight: false, label: '1_FALSE', time: 6.936842105263159 },
  //   { highlight: true, label: '2_TRUE', time: 1.7405263157894737 },
  //   { highlight: true, label: '3_TRUE', time: 2.3168421052631576 }];

  const fruitData = [
    { fruit: "Banana", count: 40, color: "yellow" },
    { fruit: "Strawberry", count: 32, color: "red" },
    { fruit: "Blueberry", count: 18, color: "blue" },
    { fruit: "Mango", count: 56, color: "orange" },
    { fruit: "Pineapple", count: 45, color: "green" },
    { fruit: "Grape", count: 40, color: "purple" }];

  const dimensions = {
    width: 960,
    height: 500,
    margin: {
      top: 20,
      right: 40,
      bottom: 35,
      left: 40
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
