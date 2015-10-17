module Sample.KO2 {

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
}