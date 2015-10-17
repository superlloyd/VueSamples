var Sample;
(function (Sample) {
    var KO3;
    (function (KO3) {
        var model = {
            stringValue: "Hello",
            passwordValue: "mypass",
            booleanValue: true,
            optionValues: ["Alpha", "Beta", "Gamma"],
            selectedOptionValue: "Gamma",
            multipleSelectedOptionValues: ["Alpha", "Beta"],
            radioSelectedOptionValue: "Beta"
        };
        new Vue({
            el: '#sample',
            data: model,
        });
    })(KO3 = Sample.KO3 || (Sample.KO3 = {}));
})(Sample || (Sample = {}));
//# sourceMappingURL=Sample.KO5.js.map