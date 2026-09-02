import React, { useState } from "react";
import {
  capitalizeFirstLetter,
  formatSalaries,
  calculateSalaryDifference,
} from "./utils.jsx";
import BasicScale from "./basicScale.jsx";

export default function Filters({ data }) {
  /* set "all" as default for both guild and dept? */
  const [selectedGuild, setSelectedGuild] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");

  /* set newsroom medians as variables (for now) */
  let sfgateMedianAnnual = 80644;
  let sfgateMedianWeek = 1550;
  let sfcMedianAnnual = 93786;
  let sfcMedianWeek = 1804;

  console.log(selectedGuild);

  return (
    <>
      <div className="filtersContainer">
        <p className="instructions">
          Using the filters below, you can explore the data and see how the pay
          equity gap varies by newsroom and by department or role.
        </p>
        <label className="filtersSubhed" for="newsroom">
          Filter by newsroom
        </label>
        <div className="newsroomButtonsContainer">
          <button
            id="sfc"
            className="newsButton"
            onClick={(e) => setSelectedGuild(e.target.id)}
          >
            SF Chronicle
          </button>
          <button
            id="sfgate"
            className="newsButton"
            onClick={(e) => setSelectedGuild(e.target.id)}
          >
            SFGATE
          </button>
          <button
            id="all"
            className="newsButton"
            onClick={(e) => setSelectedGuild(e.target.id)}
          >
            Guild-wide
          </button>
        </div>
        <label className="filtersSubhed" for="dept">
          Filter by department or role
        </label>
        <div className="deptDropdownWrapper">
          <select
            name="dept"
            className="deptDropdown"
            onChange={(e) => setSelectedDept(e.target.value)}
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
            <option value="meteorologists">Meteorologists</option>
            <option value="copy editors">Copy editors</option>
            <option value="photographers">Photographers</option>
            <option value="sports">Sports</option>
            <option value="editors">Editors</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>
        <p class="resultsInstructions">
          Example results from filtering salary data
        </p>
      </div>
      <div className="deptResultsContainer">
        <h2 className="deptSubHed">
          {capitalizeFirstLetter(selectedDept) == "All"
            ? "All departments"
            : capitalizeFirstLetter(selectedDept)}
        </h2>

        {/* if dept. is too small, find a way to display overall median salary not broken down by any demographic factor */}
        {data
          .filter(
            (dept) => dept.guild == selectedGuild && dept.teams == selectedDept,
          )
          .map((dept) => (
            <>
              {dept.age == "all" &&
                dept.gender == "all" &&
                dept.ethnicity == "all" && (
                  <h4 className="deptGroupSubCategory">
                    Overall: {formatSalaries(dept.medianAnnual)}
                  </h4>
                )}

              {dept.age != "all" && dept.age == "40+" && (
                <>
                  <h4 className="deptGroupSubCategory">
                    40+ years: {formatSalaries(dept.medianAnnual)}
                  </h4>
                  {dept.guild == "sfc" ? (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  ) : (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  )}
                </>
              )}
              {dept.age != "all" && dept.age == "under 40" && (
                <>
                  <h4 className="deptGroupSubCategory">
                    Under 40 years: {formatSalaries(dept.medianAnnual)}
                  </h4>
                  {dept.guild == "sfc" ? (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  ) : (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  )}
                </>
              )}

              {dept.age != "all" && (
                <BasicScale
                  data={data}
                  selectedGuild={selectedGuild}
                  selectedDept={selectedDept}
                  factor="age"
                />
              )}

              {dept.gender != "all" && dept.gender == "women and nonbinary" && (
                <>
                  <h4 className="deptGroupSubCategory">
                    Women and non-binary: {formatSalaries(dept.medianAnnual)}
                  </h4>
                  {dept.guild == "sfc" ? (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  ) : (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  )}
                </>
              )}
              {dept.gender != "all" && dept.gender == "men" && (
                <>
                  <h4 className="deptGroupSubCategory">
                    Men: {formatSalaries(dept.medianAnnual)}
                  </h4>
                  {dept.guild == "sfc" ? (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  ) : (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  )}
                </>
              )}

              {dept.gender != "all" && (
                <BasicScale
                  data={data}
                  selectedGuild={selectedGuild}
                  selectedDept={selectedDept}
                  factor="gender"
                />
              )}

              {dept.ethnicity != "all" && dept.ethnicity == "nonwhite" && (
                <>
                  <h4 className="deptGroupSubCategory">
                    Non-white: {formatSalaries(dept.medianAnnual)}
                  </h4>
                  {dept.guild == "sfc" ? (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  ) : (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  )}
                </>
              )}
              {dept.ethnicity != "all" && dept.ethnicity == "white" && (
                <>
                  <h4 className="deptGroupSubCategory">
                    White: {formatSalaries(dept.medianAnnual)}
                  </h4>
                  {dept.guild == "sfc" ? (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfcMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  ) : (
                    <p className="deptComparison">
                      This is $
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[0],
                      )}{" "}
                      or{" "}
                      {formatSalaries(
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[1],
                      )}
                      %{" "}
                      {
                        calculateSalaryDifference(
                          dept.medianAnnual,
                          sfgateMedianAnnual,
                        )[2]
                      }{" "}
                      than the newsroom median.
                    </p>
                  )}
                  {/* d3 scale */}
                  <BasicScale
                    data={data}
                    selectedGuild={selectedGuild}
                    selectedDept={selectedDept}
                    factor="ethnicity"
                  />
                </>
              )}
            </>
          ))}
      </div>
    </>
  );
}
