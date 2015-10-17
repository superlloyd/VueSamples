var Sample;
(function (Sample) {
    var KO3;
    (function (KO3) {
        var model = {
            itemToAdd: "",
            items: ["Alpha", "Beta", "Gamma"],
            selected: [],
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
                removeSelected: function () {
                    for (var i = 0; i < this.selected.length; i++) {
                        var item = this.selected[i];
                        for (var j = 0; j < this.items.length; j++) {
                            if (this.items[j] == item) {
                                this.items.splice(j, 1);
                                break;
                            }
                        }
                    }
                    this.selected = [];
                },
                sortItems: function () {
                    this.items.sort(function (s1, s2) {
                        s1 = s1.toLowerCase();
                        s2 = s2.toLowerCase();
                        return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
                    });
                },
            },
        });
    })(KO3 = Sample.KO3 || (Sample.KO3 = {}));
})(Sample || (Sample = {}));
