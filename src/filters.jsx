import React from "react";

export default function Filters(data) {
  return (
    <div className="filtersContainer">
      <p>
        Using the filters below, you can explore the data and see how the pay
        equity gap varies by newsroom and by department or role.
      </p>
      <label htmlFor="newsroom">By newsroom</label>
      <h3>By newsroom</h3>
      <div className="newsroomButtons">
        <button>SF Chronicle</button>
        <button>SFGATE</button>
        <button>Guild-wide</button>
      </div>
      <label htmlFor="dept">By department or role</label>
      <h3>By department or role</h3>
      <select name="dept" id="dept-dropdown" className="deptDropdown">
        <option value="all-teams">All teams</option>
        <option value="reporters">Reporters</option>
        <option value="digital">Digital</option>
        <option value="critics">Critics and columnists</option>
        <option value="data-devs">Data reporters and developers</option>
        <option value="designers">Designers</option>
        <option value="copy-editors">Copy editors</option>
      </select>
    </div>
  );
}
