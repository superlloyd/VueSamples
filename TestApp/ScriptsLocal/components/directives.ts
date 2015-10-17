Vue.directive('enable', {
    bind: function () {
    },
    update: function (newValue, oldValue) {
        var el: HTMLElement = this.el;
        if (newValue) {
            el.removeAttribute("disabled");
        }
        else {
            (<any>el).disabled = true;
        }
    },
    unbind: function () {
    }
})
Vue.directive('disable', {
    bind: function () {
    },
    update: function (newValue, oldValue) {
        var el: HTMLElement = this.el;
        if (newValue) {
            (<any>el).disabled = true;
        }
        else {
            el.removeAttribute("disabled");
        }
    },
    unbind: function () {
    }
})