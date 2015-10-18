module Sample.KO1 {

    var model = {
        firstName: "Albert",
        lastName: "Einstein",
    };

    new Vue({
        el: '#sample',
        data: model,
        computed: {
            fullName: function () {
                return this.firstName + ' ' + this.lastName;
            }
        }
    });
}
