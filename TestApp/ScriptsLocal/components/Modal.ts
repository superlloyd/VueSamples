Vue.component('modal', function (resolve: (vueOptions:any) => void, reject: () => void) {
    loader('ScriptsLocal/components/Modal.html')
        .then(s => {
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
                    $(this.$el).on('shown.bs.modal', () => this.show = true);
                    $(this.$el).on('hidden.bs.modal', () => this.show = false);
                    this.showModal(this.show);  
                },
                methods: {
                    showModal: function (value: boolean) {
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
        .fail(x => reject())
    ;
});