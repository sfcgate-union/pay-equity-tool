import React from "react";
import Filters from "./filters";
import "./project.less";

// import data
let allGuildData = "";
try {
  allGuildData = require("./allguild.json");
} catch (err) {
  allGuildData = null;
}

export default function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>SFC-SFGate Pay Equity Study (2026)</h1>
      </header>
      <div className="methodology">
        <h2>How we did the data analysis</h2>
        <p>We chose terms TKTK carefully TKTK</p>
      </div>
      <Filters data={allGuildData} />
    </div>
  );
}
