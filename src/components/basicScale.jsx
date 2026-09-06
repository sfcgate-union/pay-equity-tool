import React, { useEffect } from "react";
import { scaleLinear } from "d3";

const margin = { top: 30, right: 30, bottom: 50, left: 50 };
const tickLength = 8;

const width = 700;
const height = 100;

export default function BasicScale({
  data,
  selectedGuild,
  selectedDept,
  factor,
}) {
  let guildDot;
  let dotOne;
  let dotTwo;

  let maxMedian = Math.max(...data.map((l) => l.medianAnnual));
  let minMedian = Math.min(...data.map((l) => l.medianAnnual));
  /* for building the scale — in 10s */
  let shortenedMedians = data.map((l) => Math.round(l.medianAnnual / 1000));
  let maxShortened = Math.max(...shortenedMedians);

  const boundsWidth = width - margin.right - margin.left;
  const xScale = scaleLinear()
    .domain([70, maxShortened]) // changed this from 0 because the minimum salary is ~70k
    .range([0, boundsWidth]);

  if (selectedGuild == "sfc") {
    guildDot = xScale(Math.round(93786 / 1000));
  } else if (selectedGuild == "sfgate") {
    guildDot = xScale(Math.round(80644 / 1000));
  } else if (selectedGuild == "all") {
    /* median of all guild */
    guildDot = xScale(Math.round(90702 / 1000));
  }

  // for different demographic factors
  if (factor == "gender") {
    // for women and nonbinary
    dotOne = xScale(
      Math.round(
        data
          .filter(
            (dept) =>
              dept.guild == selectedGuild &&
              dept.teams == selectedDept &&
              dept.gender == "women and nonbinary",
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );
    // for men
    dotTwo = xScale(
      Math.round(
        data
          .filter(
            (dept) =>
              dept.guild == selectedGuild &&
              dept.teams == selectedDept &&
              dept.gender == "men",
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );
  } else if (factor == "age") {
    // for 40+
    dotOne = xScale(
      Math.round(
        data
          .filter(
            (dept) =>
              dept.guild == selectedGuild &&
              dept.teams == selectedDept &&
              dept.age == "40+",
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );
    // for under 40
    dotTwo = xScale(
      Math.round(
        data
          .filter(
            (dept) =>
              dept.guild == selectedGuild &&
              dept.teams == selectedDept &&
              dept.age == "under 40",
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );
  } else if (factor == "ethnicity") {
    dotOne = xScale(
      Math.round(
        data
          .filter(
            (dept) =>
              dept.guild == selectedGuild &&
              dept.teams == selectedDept &&
              dept.ethnicity == "nonwhite",
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );
    dotTwo = xScale(
      Math.round(
        data
          .filter(
            (dept) =>
              dept.guild == selectedGuild &&
              dept.teams == selectedDept &&
              dept.ethnicity == "white",
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );
  }

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Main horizontal line */}
        <line
          x1={0}
          x2={boundsWidth}
          y1={0}
          y2={0}
          stroke="black"
          strokeWidth={0.5}
        />

        {/* Ticks and Labels */}
        {xScale.ticks(10).map((value) => (
          <g key={value} transform={`translate(${xScale(value)}, 0)`}>
            <line y2={tickLength} stroke="currentColor" />
            <text
              style={{
                fontSize: "14px",
                textAnchor: "middle",
                transform: "translateY(25px)",
              }}
            >
              {value + "K"}
            </text>
          </g>
        ))}

        {/* *** Dots on the scale *** */}
        {/* newsroom median */}
        <circle
          cx={guildDot}
          opacity=".5"
          stroke="#000"
          stroke-width=".5"
          cy="0"
          r="4"
          fill="#26A0A5"
        />

        <circle
          cx={dotOne}
          stroke="#000"
          stroke-width=".5"
          cy="0"
          r="5"
          fill="#26A0A5"
        />
        <circle
          cx={dotTwo}
          stroke="#000"
          stroke-width=".5"
          cy="0"
          r="5"
          fill="#26A0A5"
        />
      </g>
    </svg>
  );
}
