//// NOT USING YET
// subcomponent used in overall "filters" parent component
// to do: rename filters to filtersContainer

import React from "react";
// import {
//   capitalizeFirstLetter,
//   formatSalaries,
//   calculateSalaryDifference,
// } from "./utils.jsx";
import BasicScale from "./basicScale.jsx";

export default function demographicFilterScale({
  data,
  factor,
  subFactor,
  selectedGuild,
  selectedDept,
}) {
  return (
    <>
      <h3>Salary by {factor}</h3>
      <BasicScale
        data={data}
        selectedGuild={selectedGuild}
        selectedDept={selectedDept}
        factor={factor}
      />
    </>
  );
}
