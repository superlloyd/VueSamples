var Sample;
(function (Sample) {
    var KO1;
    (function (KO1) {
        new Vue({
            el: '#sample',
            computed: {
                fullName: function () {
                    return this.firstName + ' ' + this.lastName;
                }
            }
        });
    })(KO1 = Sample.KO1 || (Sample.KO1 = {}));
})(Sample || (Sample = {}));
//# sourceMappingURL=Sample.TabControl.js.map