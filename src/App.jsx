import React from "react";
import Methodology from "./components/methodology.jsx";
import Filters from "./components/filters.jsx";
import "./App.css";
import allGuildData from "./allguild.json";

console.log({ allGuildData });

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
