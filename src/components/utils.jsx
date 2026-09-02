// put any functions you can see yourself using throughout the project

export function capitalizeFirstLetter(string) {
  return [...string][0].toUpperCase() + [...string].slice(1).join("");
}

export function formatSalaries(integer) {
  return integer.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function calculateSalaryDifference(int1, int2) {
  let difference = int1 - int2;
  let percentDifference = (((int1 - int2) / int2) * 100).toFixed(1);
  let comparisonDesc;
  if (percentDifference < 0) {
    comparisonDesc = "lower";
  } else if (percentDifference >= 0) {
    comparisonDesc = "higher";
  }
  return [difference, percentDifference, comparisonDesc];
}
