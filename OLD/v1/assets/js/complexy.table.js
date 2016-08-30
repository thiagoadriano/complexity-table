/* global $ */

$(function () {
    
    
	
    $("#ComplaxyTable").jqGrid({
        url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
        mtype: "GET",
        datatype: "jsonp",
        colNames: ["Order ID", 'Customer ID', 'Order Date', 'Freight TS', 'Ship Name'],
        colModel: [
            { label: 'Order ID', name: 'OrderID',  width: 75, frozen: true },
            { label: 'Customer ID', name: 'CustomerID', width: 150,  frozen: true },
            { label: 'Order Date', name: 'OrderDate', width: 150 },
            { label: 'Freight TS', name: 'Freight', width: 150 },
            { label: 'Ship Name', name: 'ShipName', width: 150}
        ],
        styleUI: 'Bootstrap',
        responsive: true,
        page: 1,
		viewrecords: true,
		scroll: 1,
		rowNum: 100,
		emptyrecords: 'Rode o scroll para carregar uma nova página.',
        height: 500,
        width: 350,
    	scrollPopUp:true,
		scrollLeftOffset: "50%",
		loadonce: true,
        shrinkToFit: false
    });
    

    $('#ComplaxyTable').setGroupHeaders({
        useColSpanStyle: true,
        groupHeaders: [
            { "numberOfColumns": 2, "titleText": "General Info", "startColumnName": "CustomerID" },
            { "numberOfColumns": 2, "titleText": "Secondary Details", "startColumnName": "Freight" }]
    });
    
    $('#ComplaxyTable').jqGrid("setFrozenColumns");
    
});
