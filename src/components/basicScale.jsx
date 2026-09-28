import React, { useEffect } from "react";
import { scaleLinear } from "d3";

const margin = { top: 50, right: 30, bottom: 50, left: 50 };
const tickLength = 8;

const width = 700;
const height = 100;

//// pseudocode
// make everything based on

//// color variables for legend + scale — MAKE SURE THESE ARE COLOR BLIND ACCESSIBLE
// make the overall guild median neutral dark gray
const guildColor = "#3E3E3E";
const guildColorDark = "#111111"; // 300 value

// colors by race
const whiteColor = "#26A0A5";
const nonWhiteColor = "#FFBC30";
const whiteColorDark = "#00505A"; // 300 value
const nonWhiteColorDark = "#B17A00"; // 300 value

// colors by age
const over40Color = "#025BAF";
const under40Color = "#DF7821";
const over40ColorDark = "#003166"; // 300 value
const under40ColorDark = "#B05A0C"; // 300 value

// colors by gender
const wnbColor = "#97668F";
const maleColor = "#819958";
const wnbColorDark = "#724C6C"; // 300 value
const maleColorDark = "#5F7539"; // 300 value

export default function BasicScale({
  data,
  selectedGuild,
  selectedDept,
  factor,
}) {
  let guildDot;
  let whiteDot;
  let nonWhiteDot;
  let over40Dot;
  let under40Dot;
  let wnbDot;
  let maleDot;

  // not using these variables - delete?
  let maxMedian = Math.max(...data.map((l) => l.medianAnnual));
  let minMedian = Math.min(...data.map((l) => l.medianAnnual));
  /* for building the scale — in 10s */
  let shortenedMedians = data.map((l) => Math.round(l.medianAnnual / 1000));
  let maxShortened = Math.max(...shortenedMedians);

  const boundsWidth = width - margin.right - margin.left;
  const xScale = scaleLinear()
    .domain([70, maxShortened]) // changed this from 0 because the minimum salary is ~70k
    .range([0, boundsWidth]);

  // DEBUG: is there a way to make this not based on hardcoded numbers?
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
    wnbDot = xScale(
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
    maleDot = xScale(
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
    over40Dot = xScale(
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
    under40Dot = xScale(
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
    nonWhiteDot = xScale(
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
    whiteDot = xScale(
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

  // DEBUG: optimize this to be more efficient
  return (
    <>
      {factor === "gender" && (
        <svg width={width} height={height}>
          {/* START Legend */}
          <circle
            cx="10"
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width=".5"
            r="4"
            fill={guildColor}
          />
          <text
            fill={guildColorDark}
            fontSize="12px"
            text-anchor="start"
            x="20"
            y="14"
          >
            Median
          </text>
          <circle
            cx="85"
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r="5"
            fill={wnbColor}
          />
          <text
            fill={wnbColorDark}
            fontSize="12px"
            text-anchor="start"
            x="95"
            y="14"
          >
            Women and nonbinary
          </text>
          <circle
            cx="240"
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r="5"
            fill={maleColor}
          />
          <text
            fill={maleColorDark}
            fontSize="12px"
            text-anchor="start"
            x="250"
            y="14"
          >
            Men
          </text>
          {/* END Legend */}

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
              fill={guildColor}
            />
            <circle
              cx={wnbDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={wnbColor}
            />
            <circle
              cx={maleDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={maleColor}
            />
          </g>
        </svg>
      )}

      {factor === "age" && (
        <svg width={width} height={height}>
          {/* START Legend */}
          <circle
            cx="10"
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width=".5"
            r="4"
            fill={guildColor}
          />
          <text
            fill={guildColorDark}
            fontSize="12px"
            text-anchor="start"
            x="20"
            y="14"
          >
            Median
          </text>
          <circle
            cx="85"
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r="5"
            fill={under40Color}
          />
          <text
            fill={under40ColorDark}
            fontSize="12px"
            text-anchor="start"
            x="95"
            y="14"
          >
            Under 40 years old
          </text>
          <circle
            cx="220"
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r="5"
            fill={over40Color}
          />
          <text
            fill={over40ColorDark}
            fontSize="12px"
            text-anchor="start"
            x="230"
            y="14"
          >
            40+ years
          </text>
          {/* END Legend */}

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
              fill={guildColor}
            />
            <circle
              cx={over40Dot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={over40Color}
            />
            <circle
              cx={under40Dot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={under40Color}
            />
          </g>
        </svg>
      )}

      {factor === "ethnicity" && (
        <svg width={width} height={height}>
          {/* START Legend */}
          <circle
            cx="10"
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width=".5"
            r="4"
            fill={guildColor}
          />
          <text fontSize="12px" text-anchor="start" x="20" y="14">
            Median
          </text>
          <circle
            cx="85"
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r="5"
            fill={whiteColor}
          />
          <text
            fill={whiteColorDark}
            fontSize="12px"
            text-anchor="start"
            x="95"
            y="14"
          >
            White
          </text>
          <circle
            cx="150"
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r="5"
            fill={nonWhiteColor}
          />
          <text
            fill={nonWhiteColorDark}
            fontSize="12px"
            text-anchor="start"
            x="160"
            y="14"
          >
            Non-white
          </text>
          {/* END Legend */}

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
              fill={guildColor}
            />
            <circle
              cx={whiteDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={whiteColor}
            />
            <circle
              cx={nonWhiteDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={nonWhiteColor}
            />
          </g>
        </svg>
      )}
    </>
  );
}
