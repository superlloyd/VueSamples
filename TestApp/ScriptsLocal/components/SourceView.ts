declare var htmlSample: string;
Vue.component('source-view', {
    template: '<div><h2>{{ title }}</h2><pre class="code" v-text="text"></pre></div>',
    props: {
        url: {
            type: String,
            required: false,
        },
        selector: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: false,
        }
    },
    ready: function () {
        if (this.text)
            return;
        if (this.selector) {
            if (htmlSample) {
                this.text = htmlSample;
                return;
            }
            var eHtml = $(this.selector);
            if (eHtml && eHtml.length)
                this.text = eHtml.html();
        }
        else if (this.url) {
            loader({ url: this.url, cached: false }).then(x => this.text = x);
        }
    },
});