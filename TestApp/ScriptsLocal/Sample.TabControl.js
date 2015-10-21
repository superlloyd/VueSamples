var Sample;
(function (Sample) {
    var KO1;
    (function (KO1) {
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
    })(KO1 = Sample.KO1 || (Sample.KO1 = {}));
})(Sample || (Sample = {}));
//# sourceMappingURL=Sample.TabControl.js.map