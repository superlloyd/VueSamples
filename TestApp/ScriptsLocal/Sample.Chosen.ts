Vue.component('vue-chosen', {
    template: '<select data-placeholder="Choose a country..." style="width:350px;" multiple class="chosen-select">',
    data: function () {
        return {
        };
    },
    props: {
        options: null, // chosen options
        'v-model': null, // bind to selection
    },
    attached: function () {
        $(this.$el).chosen(this.otions);
    },
});

module Sample.Chosen {

    var model = {
    };

    new Vue({
        el: '#sample',
        data: model,
    });
}
