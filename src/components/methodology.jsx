import React from "react";

export default function Methodology() {
  return (
    <div className="methodologyContainer">
      <h2 className="methodologySubhed">Introduction and methodology</h2>
      <p>
        As employees and guild members, we deserve pay transparency. Knowing
        median pay has helped us successfully bargain for higher salary floors
        and guaranteed minimum yearly raises. TKTK{" "}
      </p>
      <br />
      <p>
        We calculated median salary data by multiplying median weekly pay among
        guild members ... TKTK. Some departments or roles are broken down by
        only ethnicity, age or gender, or not analyzed by any demographic
        variable due to having too few members.
      </p>
      <br />
      <p>The following guild members contributed to this report:</p>
      <ul>
        <li>Nanette Asimov, higher education reporter</li>
        <li>Christian Leonard, data reporter</li>
        <li>Ko Lyn Cheang, Asian American and Pacific Islander reporter</li>
        <li>Sophia Bollag, politics reporter</li>
        <li>Jenny Kwon, graphics reporter</li>
      </ul>
      <br />
      <p>
        Special shoutout to The Washington Post Guild for creating and releasing{" "}
        <a href="https://postguild.org/2022-pay-study-explore-data/">
          their 2022 pay equity report
        </a>{" "}
        that inspired ours, and to Nanette for collecting, analyzing and putting
        together pay equity reports for the past several years.
      </p>
    </div>
  );
}
