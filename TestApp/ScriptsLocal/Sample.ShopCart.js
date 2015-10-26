var Sample;
(function (Sample) {
    var KO3;
    (function (KO3) {
        var CartLine = (function () {
            function CartLine() {
                this.product = null;
                this.quantity = 1;
                this._category = null;
                // REMARK local additional functionality, not part of original Vue!!!
                //Vue.watcher(this, 'category', (x) => this.product = null); // previous technique
            }
            Object.defineProperty(CartLine.prototype, "category", {
                // using getter and setter property! :P
                get: function () { return this._category; },
                set: function (value) {
                    this._category = value;
                    this.product = null;
                },
                enumerable: true,
                configurable: true
            });
            CartLine.prototype.subtotal = function () {
                if (!this.product)
                    return 0;
                return this.product.price * this.quantity;
            };
            return CartLine;
        })();
        var Cart = (function () {
            function Cart() {
                this.lines = [new CartLine()];
                this.categories = sampleProductCategories;
            }
            Cart.prototype.grandTotal = function () {
                var total = 0;
                $.each(this.lines, function (i, item) { return total += item.subtotal(); });
                return total;
            };
            Cart.prototype.addLine = function () { this.lines.push(new CartLine()); };
            Cart.prototype.removeLine = function (line) { this.lines.remove(line); };
            Cart.prototype.save = function () {
                var data = $.map(this.lines, function (line) {
                    if (!line.product)
                        return undefined;
                    return {
                        productName: line.product.name,
                        quantity: line.quantity,
                    };
                });
                alert("Could now send this to server: " + JSON.stringify(data));
            };
            return Cart;
        })();
        new Vue({
            el: '#sample',
            data: new Cart(),
            // get around that Vue only support plain objects
            methods: {
                formatCurrency: function (value) {
                    return "$" + value.toFixed(2);
                },
            },
        });
    })(KO3 = Sample.KO3 || (Sample.KO3 = {}));
})(Sample || (Sample = {}));
