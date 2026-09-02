import React from "react";
import { Methodology } from "./components/methodology.jsx";
import { Filters } from "./components/filters.jsx";
import "./App.css";

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
      <Methodology />
      <Filters data={allGuildData} />
    </div>
  );
}
