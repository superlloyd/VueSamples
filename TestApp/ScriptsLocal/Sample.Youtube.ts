namespace Sample.Youtue {

    var clips = [
        { name: 'Anastasia Volochkova(Adiemus)', tag: 'XP9tzWtLFus' },
        { name: 'Sound Of Silence (Masters of Chant)', tag: 'raRaxt_KM9Q'},
    ];

    new Vue({
        el: '#sample',
        data: {
            selection: null,
            clips: clips,
        },
        // need a directive to refresh the preview when the URL change
        directives: {
            src: function (value) {
                var e: HTMLEmbedElement = this.el;
                var e2: any = e.cloneNode();
                e2.src = value;
                e.parentNode.replaceChild(e2, e);
                this.el = e2;
            },
        },
    });

}