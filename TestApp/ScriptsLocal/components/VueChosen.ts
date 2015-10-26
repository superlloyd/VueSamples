Vue.component('chosen', {
    template: '<select v-bind:data-placeholder="placeholder" v-bind:multiple="multiple" class="chosen-select">' +
    ' <option v-if="placeholder"></option>' +
    ' <option v-for="item in options | toOptionData" v-j-data="item">{{item.text}}</option>' +
    ' </select>'
    ,
    data: function () {
        return {
            changing: false,
        };
    },
    directives: {
        jData: function (value) {
            var el: HTMLElement = this.el;
            $(el).data('chosen', value);
        },
    },
    props: {
        options: null, // select data
        'v-model': { twoWay: true, default: null }, // bind to single selection
        'selected-options': { twoWay: true, default: [], type: Array }, // bind to multi-selection
        chosen: null, // chosen option
        'text-key': null, // item[text] will be displayed as text, or obj.toString() if text is undefined
        placeholder: null, // optional placeholder string
        multiple: { type: Boolean, required: false, }
    },
    filters: {
        toOptionData: function (val) {
            if (!val)
                return val;
            var key = this.textKey;
            if (!(val instanceof Array))  //???
                return val;
            return val.map(x => {
                if (key) return { text: x[key], value: x };
                else return { text: (x ? x : '').toString(), value: x };
            });
        },
    },
    methods: {
        select(objs: any[]) {
            if (!objs) objs = [];
            this.changing = true;
            try {
                $(this.$el).find('option').each((i, e) => {
                    var data = $(e).data('chosen');
                    if (!data)
                        return;
                    if (objs.contains(data.value)) $(e).attr('selected', 'selected');
                    else $(e).removeAttr('selected');
                });
                $(this.$el).trigger("chosen:updated");
            }
            finally {
                this.changing = false;
            }
        }
    },
    ready: function () {
        // initialize
        var coptions = $.extend({}, { width: '10em' }, this.chosen);
        $(this.$el).chosen(coptions);
        // initialize selection
        if (this.vModel) this.select([this.vModel]);
        else this.select(this.selectedOptions);
        // track changes
        $(this.$el).on('change', () => {
            if (this.changing)
                return;
            this.changing = true;
            try {
                var target: any[] = this.selectedOptions;
                if (!target) {
                    target = [];
                    this.selectedOptions = target;
                }
                target.splice(0, target.length);
                $(this.$el).find(':selected').each((i, e) => {
                    var data = $(e).data('chosen');
                    if (data)
                        target.push(data.value)
                });
                this.vModel = target.length > 0 ? target[0] : null;
            }
            finally {
                this.changing = false;
            }
        });
    },
    watch: {
        'vModel': function (value) {
            if (this.changing)
                return;
            if (value) this.select([value]);
            else this.select([]);
        },
        'selectedOptions': function (value: any[]) {
            if (this.changing)
                return;
            if (value) this.select(value);
            else this.select([]);
        },
    },
});
