/// <reference path="../scripts/typings/knockout/knockout.d.ts" />


var initialData = [
	{ name: "Well-Travelled Kitten", sales: 352, price: ko.observable(75.95), selected: ko.observable(false) },
	{ name: "Speedy Coyote", sales: 89, price: ko.observable(190.00), selected: ko.observable(true) },
	{ name: "Furious Lizard", sales: 152, price: ko.observable(25.00), selected: ko.observable(false) },
	{ name: "Indifferent Monkey", sales: 1, price: ko.observable(99.95), selected: ko.observable(false) },
	{ name: "Brooding Dragon", sales: 0, price: ko.observable(6350), selected: ko.observable(false) },
	{ name: "Ingenious Tadpole", sales: 39450, price: ko.observable(0.35), selected: ko.observable(false) },
	{ name: "Optimistic Snail", sales: 420, price: ko.observable(1.50), selected: ko.observable(false) }
];

var PagedGridModel = function (items) {
	this.items = ko.observableArray(items);
	this.showPriceEdit = ko.observable(false);

	this.addItem = function () {
		this.items.push({ name: "New item", sales: 0, price: ko.observable(100), selected: ko.observable(false) });
	};

	var selectedStyle = function (row) {
		return ko.computed(() => row.selected() ? 'background:cyan !important;' : null);
	}

	this.gridViewModel = new KOGridModel({
		data: this.items,
		columns: [
			{ header: "Item Name", data: "name" },
			{ header: "Sales Count", data: "sales", cellStyle: selectedStyle },
			{ header: "Price", data: function (item) { return "$" + parseFloat(item.price()).toFixed(2) }, cellStyle: selectedStyle },
			{ headerTemplate: "headerPrice", template: "columnPrice", visible: this.showPriceEdit, cellStyle: selectedStyle },
			{ data: 'selected', dataTemplate: 'tplCb', cellStyle: selectedStyle }
		],
		pageSize: 4
	});
	//this.gridViewModel.templateHeader = "KOGridModelDefaultViewHeaderTemplate2";
};

// bind onload to overwrite saved value
ko.applyBindings(new PagedGridModel(initialData));

