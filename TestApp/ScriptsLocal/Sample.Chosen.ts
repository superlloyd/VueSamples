Vue.component('vue-chosen', {
    template: '<select data-placeholder={{placeholder}} v-attr="multiple:multiple" class="chosen-select">' +
    ' <option v-if="placeholder"></option>' +
    ' <option v-repeat="item in options | toSelectItem" v-j-data="item.value">{{item.text}}</option>' +
    ' </select>'
    , data: function () {
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
        toSelectItem: function (val) {
            if (!val)
                return val;
            var key = this.textKey;
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
                    if (objs.contains(data)) $(e).attr('selected', 'selected');
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
                $(this.$el).find(':selected').each((i, e) => target.push($(e).data('chosen')));
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

module Sample.Chosen {

    interface IBook {
        ID: string;
        name: string;
        author?: string;
        value?: number;
        rating?: number;
    }
    var data: IBook[] = [
        { ID: 'B00CGOSBTU', name: 'Dark Space', author: 'Jasper T. Scott', rating: 4.0 },
        { ID: 'B007Y6LHAA', name: 'The Backworlds: Living on the Edge', author: 'M. Pax', rating: 3.5 },
        { ID: 'B00YR3S2SI', name: '2287 A.D. - After Destruction', author: 'R. Brown', rating: 3.6 },
        { ID: 'B00S8FCJCQ', name: 'The Three-Body Problem', author: 'Cixin Liu', rating: 4.5 },
        { ID: 'B004GJXQ20', name: 'A Game of Thrones', author: 'George R. R. Martin', rating: 4.5 },
        { ID: 'B004H4XAXO', name: 'The Way of Kings: The Stormlight Archive', author: ' Brandon Sanderson', rating: 4.7 },
        { ID: 'B00L3S2LWS', name: 'The Abyss Beyond Dreams', author: 'Peter F. Hamilton', rating: 4.3 },
        { ID: 'B0047T70VW', name: 'The Windup Girl', author: ' Paolo Bacigalupi', rating: 3.9 },
        { ID: 'B00I5NVFS0', name: 'Frostborn: The Undying Wizard', author: 'Jonathan Moeller', rating: 4.3 },
        { ID: 'B00C2RSA9C', name: 'The Human Division', author: 'John Scalzi', rating: 4.1 },
        { ID: 'B00I2WNYJW', name: 'Capital in the Twenty-First Century', author: 'Thomas Piketty', rating: 4.0 },
    ];
    var model = {
        books: data,
        selected: <IBook[]>[],
        single: <IBook>data[1],
    };

    new Vue({
        el: '#sample',
        data: model,
    });
    model.single = data[0];
}
