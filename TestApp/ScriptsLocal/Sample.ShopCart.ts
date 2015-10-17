module Sample.KO3 {

    function formatCurrency(value) {
        return "$" + value.toFixed(2);
    }

    var CartLine2 = function () {
        var self = this;
        self.category = ko.observable();
        self.product = ko.observable();
        self.quantity = ko.observable(1);
        self.subtotal = ko.pureComputed(function () {
            return self.product() ? self.product().price * parseInt("0" + self.quantity(), 10) : 0;
        });
 
        // Whenever the category changes, reset the product selection
        self.category.subscribe(function () {
            self.product(undefined);
        });
    };
    class CartLine {
        category: string = null;
        product: any = null;
        quantity: number = 1;
        subtotal() {
            if (!this.product)
                return 0;
            return this.product.price * this.quantity;
        }
    }
    class Cart {
        lines = [new CartLine()];
        grandtotal() {
            var total = 0;
            $.each(this.lines, (i, item) => total += item.subtotal());
            return total;
        }
    }

    var Cart2 = function () {
        // Stores an array of lines, and from these, can work out the grandTotal
        var self = this;
        self.lines = ko.observableArray([new CartLine()]); // Put one line in by default
        self.grandTotal = ko.pureComputed(function () {
            var total = 0;
            $.each(self.lines(), function () { total += this.subtotal() })
            return total;
        });
 
        // Operations
        self.addLine = function () { self.lines.push(new CartLine()) };
        self.removeLine = function (line) { self.lines.remove(line) };
        self.save = function () {
            var dataToSave = $.map(self.lines(), function (line) {
                return line.product() ? {
                    productName: line.product().name,
                    quantity: line.quantity()
                } : undefined
            });
            alert("Could now send this to server: " + JSON.stringify(dataToSave));
        };
    };

    new Vue({
        el: '#sample',
        data: model,
    });
}