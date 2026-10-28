import React from "react";
import Introduction from "./components/introduction.jsx";
import Filters from "./components/filtersOptimized.jsx";
import "./App.css";
import allGuildData from "./allguild.json";

export default function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>SFC-SFGate Pay Equity Study</h1>
      </header>
      <Introduction />
      <Filters data={allGuildData} />
    </div>
  );
}
