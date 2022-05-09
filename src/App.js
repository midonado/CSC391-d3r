/** App.js */
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
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

  const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  const order = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - Math.random())
  const sessionId = makeid(5)

  const fruitData = [
    { fruit: "Banana", count: 40, color: "yellow" },
    { fruit: "Watermelon", count: 29, color: "lightcoral" },
    { fruit: "Coconut", count: 15, color: "saddlebrown" },
    { fruit: "Grape", count: 40, color: "rebeccapurple" },
    { fruit: "Kiwi", count: 45, color: "limegreen" },
    { fruit: "Orange", count: 56, color: "darkorange" },
    { fruit: "Strawberry", count: 32, color: "red" },
    { fruit: "Blueberry", count: 18, color: "blue" }];

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
    // <React.StrictMode>
      <div className="App">
        <BarChart
          data={fruitData}
          dimensions={dimensions}
          order={order}
          sessionId={sessionId}
        />
      </div>
    /* </React.StrictMode> */
  );
}
