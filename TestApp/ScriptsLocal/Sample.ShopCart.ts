module Sample.KO3 {

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
}