var Sample;
(function (Sample) {
    var KO2;
    (function (KO2) {
        var model = {
            numberOfClicks: 0,
            registerClick: function () { this.numberOfClicks++; },
        };
        new Vue({
            el: '#sample',
            data: model,
            computed: {
                hasClickedTooManyTimes: function () {
                    return this.numberOfClicks >= 3;
                }
            }
        });
    })(KO2 = Sample.KO2 || (Sample.KO2 = {}));
})(Sample || (Sample = {}));
//# sourceMappingURL=Sample.KO2.js.map