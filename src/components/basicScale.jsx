// TO DO - it's not guild median unless the "newsroom" selected is the entire guild — change this wording
// TO DO - remove "median" from legend

import React, { useEffect } from "react";
import { scaleLinear } from "d3";

const margin = { top: 50, right: 25, bottom: 50, left: 10 };
const tickLength = 8;

const width = Math.min(window.innerWidth * 0.95, 670); // adjust?
const height = 100;

//// color variables for legend + scale — MAKE SURE THESE ARE COLOR BLIND ACCESSIBLE
// make the overall guild median neutral dark gray
const guildColor = "#909090"; // 50 value
const guildColorDark = "#111111"; // 300 value
// add outline to either guild or dept color to further distinguish
const deptColor = "#D1365E";
const deptColorDark = "#951D3A"; // 300 value

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

// setting radii, opacity etc. settings for dots
const newsroomX = 10;
const deptX = 100;
const newsroomRadius = 3.5;
const newsroomOpacity = 0.5;
const deptRadius = 4;
const deptOpacity = 0.75;
const demoRadius = 7.5;

//// optimize later
// for now, adjusting x positioning of legend dots + labels here
const whiteX = 200;
const nonWhiteX = 270;
const wnbX = 200;
const maleX = 370;
const over40X = 200;
const under40X = 290;

export default function BasicScale({
  data,
  selectedGuild,
  selectedDept,
  factor,
}) {
  let guildDot;
  let deptDot;
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

  function drawChart() {
    // DEBUG: is there a way to make this not based on hardcoded numbers?
    if (selectedGuild == "sfc") {
      guildDot = xScale(Math.round(93786 / 1000));
    } else if (selectedGuild == "sfgate") {
      guildDot = xScale(Math.round(80644 / 1000));
    } else if (selectedGuild == "all") {
      /* guild-wide median */
      guildDot = xScale(Math.round(90702 / 1000));
    }

    // calculating dept-specific median
    deptDot = xScale(
      Math.round(
        data
          .filter(
            (dept) => dept.guild == selectedGuild && dept.teams == selectedDept,
          )
          .map((dept) => dept.medianAnnual)[0] / 1000,
      ),
    );

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
  }

  drawChart();

  useEffect(() => {
    window.addEventListener("resize", drawChart);
  }, []);

  // DEBUG: optimize this to be more efficient
  return (
    <>
      {factor === "gender" && (
        <svg width={width} height={height}>
          {/* START Legend */}

          {/* newsroom/guild median dot */}
          <circle
            cx={String(newsroomX)}
            cy="10"
            opacity={newsroomOpacity}
            stroke="#000"
            stroke-width="0"
            r={String(newsroomRadius)}
            fill={guildColor}
          />
          <text
            fill={guildColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(newsroomX + 10)}
            y="14"
          >
            Newsroom
          </text>

          {/* dept. median dot */}
          <circle
            cx={String(deptX)}
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width=".5"
            r={String(deptRadius)}
            fill={deptColor}
          />
          <text
            fill={deptColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(deptX + 10)}
            y="14"
          >
            Department
          </text>

          {/* women & nb dot */}
          <circle
            cx={String(wnbX)}
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r={String(demoRadius)}
            fill={wnbColor}
          />
          <text
            fill={wnbColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(wnbX + 15)}
            y="14"
          >
            Women and nonbinary
          </text>

          {/* men dot */}
          <circle
            cx={String(maleX)}
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r={String(demoRadius)}
            fill={maleColor}
          />
          <text
            fill={maleColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(maleX + 15)}
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
              opacity={String(newsroomOpacity)}
              stroke="#000"
              stroke-width="0"
              cy="0"
              r={String(newsroomRadius)}
              fill={guildColor}
            />
            {/* dept median */}
            <circle
              cx={deptDot}
              opacity=".5"
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r={String(deptRadius)}
              fill={deptColor}
            />
            <circle
              cx={wnbDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r={String(demoRadius)}
              fill={wnbColor}
            />
            <circle
              cx={maleDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r={String(demoRadius)}
              fill={maleColor}
            />
          </g>
        </svg>
      )}

      {factor === "age" && (
        <svg width={width} height={height}>
          {/* START Legend */}

          {/* newsroom/guild median dot */}
          <circle
            cx={String(newsroomX)}
            cy="10"
            opacity={newsroomOpacity}
            stroke="#000"
            stroke-width="0"
            r={String(newsroomRadius)}
            fill={guildColor}
          />
          <text
            fill={guildColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(newsroomX + 10)}
            y="14"
          >
            Newsroom
          </text>

          {/* dept. median */}
          <circle
            cx={String(deptX)}
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width=".5"
            r={String(deptRadius)}
            fill={deptColor}
          />
          <text
            fill={deptColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(deptX + 10)}
            y="14"
          >
            Department
          </text>

          {/* under 40 */}
          <circle
            cx={String(under40X)}
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r={String(demoRadius)}
            fill={under40Color}
          />
          <text
            fill={under40ColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(under40X + 15)}
            y="14"
          >
            Under 40 years old
          </text>

          {/* 40 and up*/}
          <circle
            cx={String(over40X)}
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r={String(demoRadius)}
            fill={over40Color}
          />
          <text
            fill={over40ColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(over40X + 15)}
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
              stroke-width="0"
              cy="0"
              r={String(newsroomRadius)}
              fill={guildColor}
            />
            {/* dept median */}
            <circle
              cx={deptDot}
              opacity=".5"
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r={String(deptRadius)}
              fill={deptColor}
            />
            <circle
              cx={over40Dot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r={String(demoRadius)}
              fill={over40Color}
            />
            <circle
              cx={under40Dot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r={String(demoRadius)}
              fill={under40Color}
            />
          </g>
        </svg>
      )}

      {factor === "ethnicity" && (
        <svg width={width} height={height}>
          {/* START Legend */}

          {/* guild median */}
          <circle
            cx={String(newsroomX)}
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width="0"
            r="4"
            fill={guildColor}
          />
          <text
            fontSize="12px"
            text-anchor="start"
            x={String(newsroomX + 10)}
            y="14"
          >
            Newsroom
          </text>

          {/* dept. median */}
          <circle
            cx={String(deptX)}
            cy="10"
            opacity=".5"
            stroke="#000"
            stroke-width=".5"
            r={String(deptRadius)}
            fill={deptColor}
          />
          <text
            fill={deptColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(deptX + 10)}
            y="14"
          >
            Department
          </text>

          {/* white median */}
          <circle
            cx={String(whiteX)}
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r={String(demoRadius)}
            fill={whiteColor}
          />
          <text
            fill={whiteColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(whiteX + 15)}
            y="14"
          >
            White
          </text>

          {/* nonwhite median */}
          <circle
            cx={String(nonWhiteX)}
            cy="10"
            stroke="#000"
            stroke-width=".5"
            r={String(demoRadius)}
            fill={nonWhiteColor}
          />
          <text
            fill={nonWhiteColorDark}
            fontSize="12px"
            text-anchor="start"
            x={String(nonWhiteX + 15)}
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
              stroke-width="0"
              cy="0"
              r="3.5"
              fill={guildColor}
            />
            {/* dept median */}
            <circle
              cx={deptDot}
              opacity=".5"
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="5"
              fill={deptColor}
            />
            <circle
              cx={whiteDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="7.5"
              fill={whiteColor}
            />
            <circle
              cx={nonWhiteDot}
              stroke="#000"
              stroke-width=".5"
              cy="0"
              r="7.5"
              fill={nonWhiteColor}
            />
          </g>
        </svg>
      )}
    </>
  );
}
