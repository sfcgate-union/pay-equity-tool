import React, { useState } from "react";
import {
  calculateSalaryDifference,
  capitalizeFirstLetter,
  formatSalaries,
} from "./utils.jsx";
import { findGroupRow, BasicScale } from "./basicScaleOptimized.jsx";

// is there a way to avoid defining twice in both filters and basicScale?
const demographicFactors = ["age", "gender", "ethnicity"];

function differenceFromNewsroom(row, newsroomRow) {
  if (!newsroomRow) return "";

  const [difference, percentDifference, direction] = calculateSalaryDifference(
    row.medianAnnual,
    newsroomRow.medianAnnual,
  );

  if (difference === 0) {
    return " (the same as the newsroom median)";
  }

  return `, $${formatSalaries(
    Math.abs(difference),
  )} or ${percentDifference}% ${direction} than the newsroom median`;
}

export default function Filters({ data = [] }) {
  const [selectedGuild, setSelectedGuild] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");

  // Filter once, then pass the same rows to each demographic section.
  const deptData = data.filter(
    (row) => row.guild === selectedGuild && row.teams === selectedDept,
  );

  const overallRow = findGroupRow(deptData, "age", "all");

  // The newsroom-wide row is used for the age comparison copy.
  const newsroomRow = data.find(
    (row) =>
      row.guild === selectedGuild &&
      row.teams === "all" &&
      demographicFactors.every((field) => row[field] === "all"),
  );

  const comparisons = {
    ethnicity: {
      title: "Salary by ethnicity",
      firstValue: "nonwhite",
      secondValue: "white",
      summary: (nonwhite, white) => (
        <>
          Non-white employees earn a median of $
          {formatSalaries(nonwhite.medianAnnual)}
          {differenceFromNewsroom(nonwhite, newsroomRow)}, while white employees
          earn a median of ${formatSalaries(white.medianAnnual)}
          {differenceFromNewsroom(white, newsroomRow)}.
        </>
      ),
    },

    gender: {
      title: "Salary by gender",
      firstValue: "women and nonbinary",
      secondValue: "men",
      summary: (womenAndNonbinary, men) => (
        <>
          Female and nonbinary-identifying employees earn a median of $
          {formatSalaries(womenAndNonbinary.medianAnnual)}
          {differenceFromNewsroom(womenAndNonbinary, newsroomRow)}, while
          male-identifying employees earn a median of $
          {formatSalaries(men.medianAnnual)}
          {differenceFromNewsroom(men, newsroomRow)}.
        </>
      ),
    },

    age: {
      title: "Salary by age",
      firstValue: "under 40",
      secondValue: "40+",
      summary: (under40, over40) => (
        <>
          Employees <i>under 40 years old</i> earn a median of $
          {formatSalaries(under40.medianAnnual)}
          {differenceFromNewsroom(under40, newsroomRow)}; employees{" "}
          <i>40 years and older</i> earn a median of $
          {formatSalaries(over40.medianAnnual)}
          {differenceFromNewsroom(over40, newsroomRow)}.
        </>
      ),
    },
  };

  function renderDemographicComparison(factor) {
    const comparison = comparisons[factor];
    const firstRow = findGroupRow(deptData, factor, comparison.firstValue);
    const secondRow = findGroupRow(deptData, factor, comparison.secondValue);

    return (
      <section className="demographicSection" key={factor}>
        <h3>{comparison.title}</h3>

        {firstRow && secondRow && (
          <p className="deptComparison">
            {comparison.summary(firstRow, secondRow)}
          </p>
        )}

        <BasicScale data={deptData} factor={factor} />
      </section>
    );
  }

  const guildLabels = {
    all: "Guild-wide",
    sfc: "SF Chronicle",
    sfgate: "SFGATE",
  };

  // does this have to match data exactly — this might not work
  const departmentLabels = {
    all: "All departments",
    metereologists: "Meteorologists",
    reporters: "Reporters",
    digital: "Digital",
    criticscolumnists: "Critics and columnists",
    datadevelopers: "Data reporters and developers",
    designers: "Designers",
    copyeditors: "Copy editors",
    photographers: "Photographers",
    sports: "Sports",
    editors: "Editors",
    parttime: "Part-time",
  };

  const selectedDeptLabel =
    departmentLabels[selectedDept] ?? capitalizeFirstLetter(selectedDept);

  return (
    <>
      <div className="filtersContainer">
        <h2 className="filtersInstructionsSubhed">
          How to filter and read the data
        </h2>
        <div className="instructions">
          <p>
            {" "}
            Using the filters below, you can explore the data and see how the
            pay equity gap varies by newsroom and by department or role.
          </p>
          <p>
            Hover over or tab (keyboard-accessible) dots to see exact salary
            data by demographic factor (ethnicity, gender, age).
          </p>
          <p>
            In this case, <i>newsroom median</i> means the median salary of the
            data filtered by <i>newsroom</i> — so if the data is filtered to
            only show <span className="newsroomButton">SFGate</span>, the
            newsroom median would be the <i>SFGate</i> overall median. But if
            the filter is set to{" "}
            <span className="newsroomButton">Guild-wide</span>, the newsroom
            median is actually the <i>guild-wide</i> median.
          </p>
          <p>
            If for certain departments/teams you see demographic factors{" "}
            <b>missing</b> (e.g. only the department-wide median shows up) or
            even "Insufficient data", there were{" "}
            <b>
              too few members or not enough data for that specific demographic
              factor
            </b>{" "}
            in 2025.
          </p>
        </div>

        <div className="filtersSubContainer">
          <label className="filtersSubhed">Filter by newsroom</label>
          <div className="newsroomButtonsContainer">
            <button
              type="button"
              className="newsButton"
              onClick={() => setSelectedGuild("sfc")}
              aria-pressed={selectedGuild === "sfc"}
            >
              SF Chronicle
            </button>
            <button
              type="button"
              className="newsButton"
              onClick={() => setSelectedGuild("sfgate")}
              aria-pressed={selectedGuild === "sfgate"}
            >
              SFGATE
            </button>
            <button
              type="button"
              className="newsButton"
              onClick={() => setSelectedGuild("all")}
              aria-pressed={selectedGuild === "all"}
            >
              Guild-wide
            </button>
          </div>

          <label className="filtersSubhed" htmlFor="dept">
            Filter by department or role
          </label>
          <div className="deptDropdownWrapper">
            <select
              id="dept"
              name="dept"
              className="deptDropdown"
              value={selectedDept}
              onChange={(event) => setSelectedDept(event.target.value)}
            >
              <option value="all">All departments</option>
              <option value="reporters">Reporters</option>
              <option value="digital">Digital</option>
              <option value="critics and columnists">
                Critics and columnists
              </option>
              <option value="data reporters and developers">
                Data reporters and developers
              </option>
              <option value="designers">Designers</option>
              <option value="metereologists">Meteorologists</option>
              <option value="copy editors">Copy editors</option>
              <option value="photographers">Photographers</option>
              <option value="sports">Sports</option>
              <option value="editors">Editors</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="deptResultsContainer">
        <h2 className="deptSubHed">
          {guildLabels[selectedGuild]} › {selectedDeptLabel}
        </h2>

        {overallRow && (
          <p className="deptComparison">
            The department-wide median is{" "}
            <b>${formatSalaries(overallRow.medianAnnual)}</b> per year.
          </p>
        )}

        {["ethnicity", "gender", "age"].map(renderDemographicComparison)}
      </div>
    </>
  );
}
