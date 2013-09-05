
// Copyright (c) 2013 Stephen J. Lovell

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function parse_caml (fields, options){
  function add_fields (fields, field_count){
    var new_args = "", caml_where = "";
    if (field_count == 0){ return "";}
    if (field_count == 2) {
      while (field_count > 0){
        var f = fields[field_count-1];
        new_args += build_elements_for_field(f.field, f.includes, f.excludes);
        field_count -= 1;
      }
      new_args = "<And>" + new_args + "</And>";
    } else {
      var f = fields[field_count-1];
      new_args += build_elements_for_field(f.field, f.includes, f.excludes);
      field_count -= 1;
    }
    caml_where = add_fields(fields, field_count);  // recursive call to add_fields
    if (caml_where){
      return "<And>" + caml_where + new_args + "</And>";
    } else {
      return new_args;
    }
  }  // end add_fields
  
  function build_elements_for_field (field, includes, excludes){
    var caml_where = "";
    var include = (includes != null && includes != undefined && includes.length > 0);
    var exclude = (excludes != null && excludes != undefined && excludes.length > 0);
    if(include){ caml_where += add_elements(field, includes, includes.length, true); }
    if(exclude){ caml_where += add_elements(field, excludes, excludes.length, false); }
    if(include && exclude){ caml_where = "<And>" + caml_where + "</And>"; }  
    return caml_where;
  } // end build_elements_for_field

  function add_elements (field, arr, item_count, include_mode){
    var new_args = "", caml_where = "", item_tag = "", operand = "";
    if (item_count == 0) {return "";}  // all array items have been parsed.
    if (include_mode){
      item_tag = "Eq";
      operand = "Or";
    } else {
      item_tag = "Neq";
      operand = "And";
    }
    if(item_count == 2){  // if 2 items remain, no need for additional nested operands.
      while(item_count > 0){
        new_args += "<" + item_tag + "><FieldRef Name=\'" + field + "\'/><Value Type=\'Text\'>" + arr[item_count-1] + "</Value></" + item_tag + ">";
        item_count -= 1;           
      }
      new_args = "<" + operand + ">" + new_args + "</" + operand + ">";
    } else {
      new_args += "<" + item_tag + "><FieldRef Name=\'" + field + "\'/><Value Type=\'Text\'>" + arr[item_count-1] + "</Value></" + item_tag + ">";
      item_count -= 1;
    }
    caml_where = add_elements(field, arr, item_count, include_mode);  // recursive call to add_elements.
    if(caml_where) {
      return ("<" + operand + ">" + caml_where + new_args + "</" + operand + ">");   
    } else {
      return new_args;
    }
  } // end add_elements

  var caml_where = "", sort_order = "", caml_order = "";
  var caml_options = "<QueryOptions><DateInUtc>TRUE</DateInUtc></QueryOptions>";
  if(options.row_limit > 0){ caml_options += "<RowLimit>" + options.row_limit + "</RowLimit>"; }
  var sort = options.sort_by;
  if(sort.field){ 
    if(sort.asc || sort.asc == undefined ){ sort_order = "TRUE"; } else { sort_order = "FALSE"; }
    caml_order = "<OrderBy><FieldRef Name=\'" + sort.field + "\' Ascending=\'" + sort_order + "\' /></OrderBy>"; 
  }  
  if(fields != null && fields != undefined && fields.length > 0){
    caml_where = "<Where>" + add_fields(fields, fields.length) + "</Where>"; 
  }
  return "<View><Query>" + caml_where + "</Query>" + caml_order + caml_options + "</View>";
}




