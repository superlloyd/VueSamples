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
