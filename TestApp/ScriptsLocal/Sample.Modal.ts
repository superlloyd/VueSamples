module Sample.Modal {

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
}
