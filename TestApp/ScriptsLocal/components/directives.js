Vue.directive('enable', {
    bind: function () {
    },
    update: function (newValue, oldValue) {
        var el = this.el;
        if (newValue) {
            el.removeAttribute("disabled");
        }
        else {
            el.disabled = true;
        }
    },
    unbind: function () {
    }
});
Vue.directive('disable', {
    bind: function () {
    },
    update: function (newValue, oldValue) {
        var el = this.el;
        if (newValue) {
            el.disabled = true;
        }
        else {
            el.removeAttribute("disabled");
        }
    },
    unbind: function () {
    }
});
// async load of pic! use the 'v-img' for src tag
// thanks: http://codepen.io/pespantelis/pen/RWVZxL
Vue.directive('img', function (url) {
    var img = new Image();
    img.src = url;
    this.el.src = 'http://www.arabianbusiness.com/skins/ab.main/gfx/loading_spinner.gif';
    img.onload = function () {
        this.el.src = url;
        $(this.el)
            .css('opacity', 0)
            .animate({ opacity: 1 }, 1000);
    }.bind(this);
});
