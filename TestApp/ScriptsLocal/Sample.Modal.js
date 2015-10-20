var Sample;
(function (Sample) {
    var Modal;
    (function (Modal) {
        new Vue({
            el: '#sample',
            data: {
                showModal: false
            },
            watch: {
                showModal: function (val) {
                    console.log('showModal', val);
                }
            }
        });
    })(Modal = Sample.Modal || (Sample.Modal = {}));
})(Sample || (Sample = {}));
