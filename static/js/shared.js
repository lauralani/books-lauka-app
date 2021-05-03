function filtertable( inputid, tableid, rowclass ) {
    // https://www.w3schools.com/howto/howto_js_filter_table.asp
    var input, filter, table, rowlist;
    input = document.getElementById(inputid);
    filter = input.value.toUpperCase();
    table = document.getElementById(tableid);
    rowlist = table.getElementsByClassName(rowclass);

    for(let row of rowlist) {
        var filterhit = false;
        for (let rowitem of row.getElementsByClassName("searchable")) {
            var rowitemtext = rowitem.textContent || rowitem.innerText;
            if (rowitemtext.toUpperCase().indexOf(filter) > -1) {
                filterhit = true;
            }
        };
        if (filterhit === true)
            row.style.display = "";
        else
            row.style.display = "none";
    };
}
