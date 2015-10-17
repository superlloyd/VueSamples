Vue.component('source-view', function (resolve, reject) {
    loader('/ScriptsLocal/components/SourceView.html').done(function (tpl) {
        resolve({
            template: tpl,
            data: function () {
                var result = { text: null };
                if (this.selector) {
                    var eHtml = $(this.selector);
                    if (eHtml && eHtml.length)
                        result.text = eHtml.html();
                }
                else if (this.url) {
                    loader({ url: this.url, cached: false }).then(function (x) { return result.text = x; });
                }
                return result;
            },
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
                }
            },
        });
    }).fail(function (x) { return reject(x); });
});
