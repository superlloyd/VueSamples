declare var htmlSample: string;
Vue.component('source-view', function (resolve, reject) {
    loader('/ScriptsLocal/components/SourceView.html').done(tpl => {
        resolve({
            template: tpl,
            //data: function () {
            //    var result = { text: null };
            //    if (this.selector) {
            //        var eHtml = $(this.selector);
            //        if (eHtml && eHtml.length)
            //            result.text = eHtml.html();
            //    }
            //    else if (this.url) {
            //        loader({ url: this.url, cached: false }).then(x => result.text = x);
            //    }
            //    return result;
            //},
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
            attached: function () {
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
    }).fail(x => reject(x));
})