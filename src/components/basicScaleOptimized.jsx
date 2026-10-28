import React from "react";
import { scaleLinear, extent } from "d3";

const width = 670;
const height = 100;
const margin = { top: 50, right: 25, bottom: 50, left: 15 };
const tickLength = 7;

const demographicFactors = ["age", "gender", "ethnicity"];

// define dot characteristics here
const colorData = {
  all: { fill: "#D1365E", text: "#951D3A", radius: 4 },
  ageUnder40: { fill: "#DF7821", text: "#B05A0C", radius: 7.5 },
  age40Plus: { fill: "#025BAF", text: "#003166", radius: 7.5 },
  genderWnb: { fill: "#97668F", text: "#724C6C", radius: 7.5 },
  genderMen: { fill: "#819958", text: "#5F7539", radius: 7.5 },
  ethnicityWhite: { fill: "#26A0A5", text: "#00505A", radius: 7.5 },
  ethnicityNonwhite: { fill: "#FFBC30", text: "#B17A00", radius: 7.5 },
};

// 'value' has to match that in the allguild data
const groups = {
  age: [
    {
      value: "all",
      label: "Department-wide",
      legendX: 10,
      ...colorData.all,
    },
    {
      value: "under 40",
      label: "Under 40 years old",
      legendX: 150,
      ...colorData.ageUnder40,
    },
    {
      value: "40+",
      label: "40+ years",
      legendX: 300,
      ...colorData.age40Plus,
    },
  ],
  gender: [
    {
      value: "all",
      label: "Department-wide",
      legendX: 10,
      ...colorData.all,
    },
    {
      value: "women and nonbinary",
      label: "Women and nonbinary",
      legendX: 150,
      ...colorData.genderWnb,
    },
    {
      value: "men",
      label: "Men",
      legendX: 320,
      ...colorData.genderMen,
    },
  ],
  ethnicity: [
    {
      value: "all",
      label: "Department-wide",
      legendX: 10,
      ...colorData.all,
    },
    {
      value: "white",
      label: "White",
      legendX: 150,
      ...colorData.ethnicityWhite,
    },
    {
      value: "nonwhite",
      label: "Non-white",
      legendX: 230,
      ...colorData.ethnicityNonwhite,
    },
  ],
};

//// formatting the salary number
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return Number.isFinite(Number(value))
    ? currency.format(Number(value))
    : "Not available";
}

//// the fundamental filter function
export function findGroupRow(data, factor, value) {
  // return the first element that satisfies both conditionals
  return data.find(
    (row) =>
      row[factor] === value &&
      demographicFactors.every(
        (field) => field === factor || row[field] === "all",
      ),
  );
}

export function BasicScale({ data = [], factor }) {
  let groupsFiltered = groups[factor] ?? [];

  const points = groupsFiltered
    .map((group) => ({
      ...group,
      row: findGroupRow(data, factor, group.value),
    }))
    .filter(
      ({ row }) =>
        row &&
        row.medianAnnual != null &&
        Number.isFinite(Number(row.medianAnnual)),
    );

  // return this default message if there isn't any available data
  if (!points.length) {
    return (
      <div className="scaleContainer">
        <p>No data available.</p>
      </div>
    );
  }

  const values = points.map(({ row }) =>
    Math.round(Number(row.medianAnnual) / 1000),
  );

  // change min and max values to be a range based on the department-wide median (-10 and +10)

  //// to do: have range automatically adjust between +10/-10 and +15/-15 based on if a value falls outside the initial smaller range
  let adjustedMin = Math.round(points[0].row.medianAnnual / 1000 - 15);
  let adjustedMax = Math.round(points[0].row.medianAnnual / 1000 + 15);
  let adjustedDomain = [adjustedMin, adjustedMax];

  //// original min max values for xScale — remove if not using
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const domain =
    minValue === maxValue ? [minValue - 1, maxValue + 1] : [minValue, maxValue];

  const boundsWidth = width - margin.left - margin.right;
  const xScale = scaleLinear()
    .domain(adjustedDomain)
    .nice()
    .range([0, boundsWidth]);

  return (
    <div className="scaleContainer">
      <svg
        className="scaleSvg"
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={`Annual median salary by ${factor}`}
      >
        {/* legend */}
        {points.map(({ value, label, legendX, fill, text, radius }) => (
          <g key={`legend-${value}`}>
            <circle
              cx={legendX}
              cy="10"
              r={radius}
              fill={fill}
              stroke="#000"
              strokeWidth="0.5"
            />
            <text
              x={legendX + 13}
              y="14"
              fill={text}
              fontSize="12px"
              textAnchor="start"
            >
              {label}
            </text>
          </g>
        ))}

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Scale line */}
          <line
            x1="0"
            x2={boundsWidth}
            y1="0"
            y2="0"
            stroke="black"
            strokeWidth="0.5"
          />

          {/* ticks and labels */}
          {xScale.ticks(10).map((tick) => (
            <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
              <line y2={tickLength} stroke="currentColor" />
              <text y="25" fontSize="14px" textAnchor="middle">
                {tick}K
              </text>
            </g>
          ))}

          {/* the actual data points */}
          {points.map(({ row, value, label, fill, radius }) => {
            const x = xScale(Math.round(Number(row.medianAnnual) / 1000));
            const tooltipId = `salary-tooltip-${factor}-${String(value).replace(/[^a-z0-9]+/gi, "-")}`;
            const tooltip = `${label}: ${formatCurrency(row.medianAnnual)} per year${
              row.medianWeek == null
                ? ""
                : ` (${formatCurrency(row.medianWeek)} per week)`
            }`;

            return (
              <g
                key={value}
                className="point"
                transform={`translate(${x}, 0)`}
                tabIndex={0}
                role="img"
                aria-label={label}
                aria-describedby={tooltipId}
              >
                <circle
                  cx="0"
                  cy="0"
                  r={Math.max(radius, 10)}
                  fill="transparent"
                  pointerEvents="all"
                />
                <circle
                  className="pointVisible"
                  cx="0"
                  cy="0"
                  r={radius}
                  fill={fill}
                  stroke="#000"
                  strokeWidth="0.5"
                  pointerEvents="none"
                />

                <g id={tooltipId} className="tooltipContainer" role="tooltip">
                  <foreignObject x="-120" y="-40" width="240" height="100">
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="tooltipContent"
                    >
                      {tooltip}
                    </div>
                  </foreignObject>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
