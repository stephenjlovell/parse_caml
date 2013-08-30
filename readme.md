## parse_caml(fields, order_field, order_by)

This JavaScript function recursively generates a string containing a SharePoint CAML query.  

The function accepts an array of objects, where each object represents a field in the SP list.  Any number of field objects can be included in this array.  

Values for a given field can be included or excluded by adding the values to an 'includes' or 'excludes' array within the field object.  Any number of values can be included or excluded in this way.  These arrays are optional and may be omitted.

You can also specify a field to order the results by via the order_field property.  Set order_by to true for ascending, or false for descending.  


### Example Query

    WHERE (Status<>"Completed" AND Status<>"Cancelled" AND Status<>"Pending Approval") 
          AND (Office="Home Office" OR Office="Regional Office" OR Office="Field Office")
          AND (Portfolio="Financial Consulting" AND Portfolio<>"Application Development")
    ORDER BY Date ASC
    LIMIT 10000

### Example Useage

    parse_caml([ {field: "Status", excludes:["Completed", "Cancelled", "Pending Approval"]},
                 {field: "Office", includes:["Home Office", "Regional Office", "Field Office"]},
                 {field: "Portfolio", includes:["Financial Consulting"], excludes:["Application Development"]} ], 
               "Date", true);

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