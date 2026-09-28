// subcomponent used in overall "filters" parent component
// to do: rename filters to filtersContainer

import React, { useState } from "react";
import {
  capitalizeFirstLetter,
  formatSalaries,
  calculateSalaryDifference,
} from "./utils.jsx";
import BasicScale from "./basicScale.jsx";

export default function demographicFilterScale({
  factor,
  selectedGuild,
  selectedDept,
}) {}
