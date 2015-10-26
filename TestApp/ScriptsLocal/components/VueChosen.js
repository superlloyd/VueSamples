Vue.component('vue-chosen', {
    template: '<select v-bind:data-placeholder="placeholder" v-bind:multiple="multiple" class="chosen-select">' +
        ' <option v-if="placeholder"></option>' +
        ' <option v-for="item in options | toOptionData" v-j-data="item">{{item.text}}</option>' +
        ' </select>',
    data: function () {
        return {
            changing: false,
        };
    },
    directives: {
        jData: function (value) {
            var el = this.el;
            $(el).data('chosen', value);
        },
    },
    props: {
        options: null,
        'v-model': { twoWay: true, default: null },
        'selected-options': { twoWay: true, default: [], type: Array },
        chosen: null,
        'text-key': null,
        placeholder: null,
        multiple: { type: Boolean, required: false, }
    },
    filters: {
        toOptionData: function (val) {
            if (!val)
                return val;
            var key = this.textKey;
            if (!(val instanceof Array))
                return val;
            return val.map(function (x) {
                if (key)
                    return { text: x[key], value: x };
                else
                    return { text: (x ? x : '').toString(), value: x };
            });
        },
    },
    methods: {
        select: function (objs) {
            if (!objs)
                objs = [];
            this.changing = true;
            try {
                $(this.$el).find('option').each(function (i, e) {
                    var data = $(e).data('chosen');
                    if (!data)
                        return;
                    if (objs.contains(data.value))
                        $(e).attr('selected', 'selected');
                    else
                        $(e).removeAttr('selected');
                });
                $(this.$el).trigger("chosen:updated");
            }
            finally {
                this.changing = false;
            }
        }
    },
    ready: function () {
        var _this = this;
        // initialize
        var coptions = $.extend({}, { width: '10em' }, this.chosen);
        $(this.$el).chosen(coptions);
        // initialize selection
        if (this.vModel)
            this.select([this.vModel]);
        else
            this.select(this.selectedOptions);
        // track changes
        $(this.$el).on('change', function () {
            if (_this.changing)
                return;
            _this.changing = true;
            try {
                var target = _this.selectedOptions;
                if (!target) {
                    target = [];
                    _this.selectedOptions = target;
                }
                target.splice(0, target.length);
                $(_this.$el).find(':selected').each(function (i, e) {
                    var data = $(e).data('chosen');
                    if (data)
                        target.push(data.value);
                });
                _this.vModel = target.length > 0 ? target[0] : null;
            }
            finally {
                _this.changing = false;
            }
        });
    },
    watch: {
        'vModel': function (value) {
            if (this.changing)
                return;
            if (value)
                this.select([value]);
            else
                this.select([]);
        },
        'selectedOptions': function (value) {
            if (this.changing)
                return;
            if (value)
                this.select(value);
            else
                this.select([]);
        },
    },
});
