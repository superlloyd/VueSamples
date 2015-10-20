Vue.component('modal', function (resolve, reject) {
    loader('ScriptsLocal/components/Modal.html')
        .then(function (s) {
        resolve({
            template: s,
            props: {
                show: {
                    type: Boolean,
                    required: true,
                    twoWay: true
                }
            },
            ready: function () {
                this.showModal(this.show);
            },
            methods: {
                showModal: function (value) {
                    $(this.$el).modal(value ? 'show' : 'hide');
                },
            },
            watch: {
                show: function (val) {
                    this.showModal(val);
                }
            },
        });
    })
        .fail(function (x) { return reject(); });
});
//# sourceMappingURL=Modal.js.map