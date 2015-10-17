module Sample.KO3 {

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
}