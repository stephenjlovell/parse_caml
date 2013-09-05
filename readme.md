## parse_caml (fields, options)

This JavaScript function recursively generates a string containing a SharePoint CAML query.  

The function accepts an array of objects, where each object represents a field in the SP list.  Any number of field objects can be included in this array.

Values for a given field can be included or excluded by adding the values to an 'includes' or 'excludes' array within the field object.  Any number of values can be included or excluded in this way.  These arrays are optional and may be omitted.

You may also pass in the following arguments via the options object:

| Option | Description | 
| :---- |:--- |
| sort_by: {field: "name", asc: true} | Use this option to sort the query by the specified field and order.  Default order is Ascending. |
| row_limit: 10000 | Use this option to specify a maximum number of data rows to be returned by the query. |

These arguments are optional and may be omitted.

You may also call parse_caml with no arguments or pass in null.  This will generate a CAML query that returns all items in the current SharePoint view.

### Example Query

    WHERE (Status<>"Completed" AND Status<>"Cancelled" AND Status<>"Pending Approval") 
          AND (Office="Home Office" OR Office="Regional Office" OR Office="Field Office")
          AND (Portfolio="Financial Consulting" AND Portfolio<>"Application Development")
    ORDER BY Date ASC
    LIMIT 10000

### Example Useage

    parse_caml([ { field: "Status", excludes:["Completed", "Cancelled", "Pending Approval"]},
                 { field: "Office", includes:["Home Office", "Regional Office", "Field Office"]},
                 { field: "Portfolio", includes:["Financial Consulting"], excludes:["Application Development"]} ], 
               { sort_by: {field: "Date", asc: true}, row_limit: 10000 });

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
