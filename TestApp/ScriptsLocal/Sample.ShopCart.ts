﻿module Sample.KO3 {

    interface IProduct {
        name: string;
        price: number;
    }
    class CartLine {
        product: IProduct = null;
        quantity: number = 1;
        constructor() {
            // REMARK local additional functionality, not part of original Vue!!!
            //Vue.watcher(this, 'category', (x) => this.product = null); // previous technique
        }

        // using getter and setter property! :P
        get category() { return this._category; }
        set category(value) {
            this._category = value;
            this.product = null;
        }
        private _category: any = null;

        subtotal() {
            if (!this.product)
                return 0;
            return this.product.price * this.quantity;
        }
   }
    class Cart {
        lines = [new CartLine()];
        grandTotal() {
            var total = 0;
            $.each(this.lines, (i, item) => total += item.subtotal());
            return total;
        }
        categories = sampleProductCategories;
        addLine() { this.lines.push(new CartLine()); }
        removeLine(line: CartLine) { this.lines.remove(line); }
        save() {
            var data = $.map(this.lines, (line) => {
                if (!line.product)
                    return undefined;
                return {
                    productName: line.product.name,
                    quantity: line.quantity,
                };
            });
            alert("Could now send this to server: " + JSON.stringify(data));
        }
    }

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
}