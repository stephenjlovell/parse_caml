## parse_caml

This function 


### Example Query

WHERE (Status<>"Completed" AND Status<>"Cancelled" AND Status<>"Pending Approval") 
      AND (Office="Home Office" OR Office="Regional Office" OR Office="Field Office")
      AND (Portfolio="Financial Consulting" AND Portfolio<>"Application Development")
ORDER BY Date ASC
LIMIT 10000

### Example Useage

parse_caml([{field: "Status", excludes:["Completed", "Cancelled", "Pending Approval"]},
            {field: "Office", includes:["Home Office", "Regional Office", "Field Office"]},
            {field: "Portfolio", includes:["Financial Consulting"], excludes:["Application Development"] }], "Date", true);

### CAML Output 

<View><Query>
  <Where>
    <And>
      <And>
        <Or>
          <Or>
            <Eq><FieldRef Name='Office'/><Value Type='Text'>Regional Office</Value></Eq>
            <Eq><FieldRef Name='Office'/><Value Type='Text'>Home Office</Value></Eq>
          </Or>
          <Eq><FieldRef Name='Office'/><Value Type='Text'>Field Office</Value></Eq>
        </Or>
        <And>
          <And>
            <Neq><FieldRef Name='Status'/><Value Type='Text'>Cancelled</Value></Neq>
            <Neq><FieldRef Name='Status'/><Value Type='Text'>Completed</Value></Neq>
          </And>
          <Neq><FieldRef Name='Status'/><Value Type='Text'>Pending Approval</Value></Neq>
        </And>
      </And>
      <And>
        <Eq><FieldRef Name='Portfolio'/><Value Type='Text'>Financial Consulting</Value></Eq>
        <Neq><FieldRef Name='Portfolio'/><Value Type='Text'>Application Development</Value></Neq>
      </And>
    </And>
  </Where>
</Query><OrderBy><FieldRef Name='Date' Ascending='TRUE' /></OrderBy><QueryOptions><DateInUtc>TRUE</DateInUtc></QueryOptions><RowLimit>10000</RowLimit></View>