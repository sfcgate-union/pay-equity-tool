// put any functions you can see yourself using throughout the project

export function capitalizeFirstLetter(string) {
  return [...string][0].toUpperCase() + [...string].slice(1).join("");
}

export function calculateMedian(data) {
  let array;
  array = data.map((group) => Number(group.medianAnnual)).sort();
  if (array.length % 2 === 0) {
    // array with even number elements
    return (array[array.length / 2] + array[array.length / 2 - 1]) / 2;
  } else {
    return array[(array.length - 1) / 2]; // array with odd number elements
  }
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
  return [difference, Math.abs(percentDifference), comparisonDesc];
}
