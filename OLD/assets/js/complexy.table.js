$(document).ready(function () {
	
    $("#ComplaxyTable").jqGrid({
        url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
        mtype: "GET",
		styleUI : 'Bootstrap',
        datatype: "jsonp",
        colNames: ["OrderID", 'Customer ID', 'Order Date', 'Freight', 'Ship Name'],
        colModel: [
            { label: 'OrderID', name: 'OrderID', key:true, width: 75, frozen: true },
            { label: 'Customer ID', name: 'CustomerID', width: 150 },
            { label: 'Order Date', name: 'OrderDate', width: 150 },
            { label: 'Freight', name: 'Freight', width: 150 },
            { label: 'Ship Name', name: 'ShipName', width: 150 }
        ],
		viewrecords: false,
        height: 600,
        width: 200
    });


    $('#jqGrid').setGroupHeaders({
        useColSpanStyle: true,
        groupHeaders: [
            { "numberOfColumns": 2, "titleText": "General Info", "startColumnName": "CategoryName" },
            { "numberOfColumns": 3, "titleText": "Secondary Details", "startColumnName": "Country" }]
    });
});
