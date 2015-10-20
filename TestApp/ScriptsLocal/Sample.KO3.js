var Sample;
(function (Sample) {
    var KO3;
    (function (KO3) {
        var model = {
            itemToAdd: "",
            items: ["Alpha", "Beta", "Gamma"],
        };
        new Vue({
            el: '#sample',
            data: model,
            methods: {
                addItem: function (e) {
                    e.preventDefault();
                    if (this.itemToAdd) {
                        this.items.push(this.itemToAdd);
                        this.itemToAdd = "";
                    }
                },
            },
        });
    })(KO3 = Sample.KO3 || (Sample.KO3 = {}));
})(Sample || (Sample = {}));
//# sourceMappingURL=Sample.KO3.js.map