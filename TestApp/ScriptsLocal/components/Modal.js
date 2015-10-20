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
                var _this = this;
                $(this.$el).on('shown.bs.modal', function () { return _this.show = true; });
                $(this.$el).on('hidden.bs.modal', function () { return _this.show = false; });
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